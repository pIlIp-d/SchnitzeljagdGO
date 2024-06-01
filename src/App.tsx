import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { QuestContext } from './QuestContext';
import { useRef, useState, useEffect } from 'react';
import { getCurrentLocation } from './GeoJsonHelper';
import { getDistance } from 'geolib';
import { FoundQuest, Quest } from './types';
import QuestGenerator from './QuestGenerator';
import QuestView from './QuestView';
import QuestListView from './QuestListView';
import LoginView from './firebase/LoginView';
import { checkUserStatus } from './firebase/AuthStatus';

function App() {
	const firstRender = useRef(true);

	const [amountOfCompletedQuests, setAmountOfCompletedQuests] = useState<number>(0);
	const [loggedIn, setLoggedIn] = useState(false);

	const [quests, setQuests] = useState<Quest[]>([]);
	const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
	const [position, setPosition] = useState<[number, number]>();
	const [foundQuests, setFoundQuests] = useState<FoundQuest[]>([]);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			QuestGenerator()
				.then(quest => {
					console.log(quest);
					setQuests(oldQuests => [...oldQuests, quest]);
				})
				.catch(e => console.error(e));
			getCurrentLocation().then(pos => {
				setPosition(pos);
			});
		}
		checkUserStatus()
			.then(({ user }) => {
				if (user) {
					setLoggedIn(true);
				} else {
					setLoggedIn(false);
				}
			})
			.catch(error => {
				console.error('Error checking user status:', error);
			});
	});

	const checkLocation = async () => {
		const location = await getCurrentLocation();
		const quest = quests[currentQuestIndex];
		if (quest) {
			for (const node of quest.nodes) {
				// if node has already been found or is part of already found way
				if (!foundQuests.some(foundQuest => foundQuest.node.id === node.id || foundQuest.way.nodes.includes(node.id))) {
					const distance = getDistance(
						{ latitude: location[0], longitude: location[1] },
						{ latitude: node.lat, longitude: node.lon }
					);
					if (distance < 1000) {
						setFoundQuests(oldQ => {
							const newFoundQuests = [
								...oldQ,
								{ node: node, way: quest.ways.filter(way => way.nodes.includes(node.id))[0] },
							];
							setAmountOfCompletedQuests(newFoundQuests.length);
							return newFoundQuests;
						});
						break;
					}
				}
			}
		} else {
			console.log('Quest not found');
		}
	};

	return (
		<QuestContext.Provider value={quests}>
			<Router>
				{loggedIn ? (
					<Routes>
						<Route path="/login" element={<LoginView />} />
						{position && (
							<>
								<Route
									path="/"
									element={<QuestListView foundQuests={foundQuests} position={position} quests={quests} />}
								/>
								<Route
									path="/quest/:name"
									element={
										<QuestView
											quest={quests[currentQuestIndex]}
											position={position}
											foundQuests={foundQuests}
											checkLocation={checkLocation}
										/>
									}
								/>
							</>
						)}
					</Routes>
				) : (
					<LoginView />
				)}
			</Router>
		</QuestContext.Provider>
	);
}

export default App;
