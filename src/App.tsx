import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dropdown from './QuestList';
import { QuestContext } from './QuestContext';
import { useRef, useState, useEffect } from 'react';
import { getCurrentLocation } from './GeoJsonHelper';
import QuestGenerator, { Quest } from './QuestGenerator';
import AuthUI from './firebase/AuthUI';
import QuestView from './QuestView';
import QuestListView from './QuestListView';

function App() {
	const firstRender = useRef(true);

	const [quests, setQuests] = useState<Quest[]>([]);
	const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
	const [position, setPosition] = useState<[number, number]>();

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

	return (
		<QuestContext.Provider value={quests}>
			<Router>
				<Routes>
					<Route path="/login" element={<AuthUI />} />
					<Route path="/" element={<Dropdown quests={quests} />} />
					<Route path="/quest/:name" element={<QuestView />} />
					<Route path="/dropdown" element={<QuestListView />} />
				</Routes>
			</Router>
		</QuestContext.Provider>
	);
}

export default App;
