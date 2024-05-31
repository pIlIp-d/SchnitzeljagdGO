import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dropdown from './QuestList';
import QuestDetails from './QuestDetails';
import Map from './map';
import { QuestContext } from './QuestContext';
import { useRef, useState, useEffect } from 'react';
import { getCurrentLocation } from './GeoJsonHelper';
import QuestGenerator from './QuestGenerator';
import { getDistance } from 'geolib';
import { NodeElement, Quest, WayElement } from './types';

function App() {
	const firstRender = useRef(true);

	const [amountOfCompletedQuests, setAmountOfCompletedQuests] = useState<number>(0);
	const [quests, setQuests] = useState<Quest[]>([]);
	const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
	const [position, setPosition] = useState<[number, number]>();
	const [foundQuests, setFoundQuests] = useState<{ node: NodeElement; way: WayElement }[]>([]);

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
				<Routes>
					<Route path="/" element={<Dropdown quests={quests} current={amountOfCompletedQuests} />} />
					<Route
						path="/quest/:name"
						element={
							<QuestDetails
								checkLocation={checkLocation}
								quest={quests[currentQuestIndex]}
								current={amountOfCompletedQuests}
							/>
						}
					/>
				</Routes>
				<div className="Map">
					{position && <Map nodes={foundQuests.flatMap(foundQuest => foundQuest.node)} position={position} />}
				</div>
			</Router>
		</QuestContext.Provider>
	);
}

export default App;
