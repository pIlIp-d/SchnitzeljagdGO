import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dropdown from './QuestList';
import QuestDetails from './QuestDetails';
import Map from './map';
import { NodeElement } from './types';
import { QuestContext } from './QuestContext';
import { useRef, useState, useEffect } from 'react';
import { getCurrentLocation } from './GeoJsonHelper';
import QuestGenerator, { Quest } from './QuestGenerator';

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
					<Route path="/" element={<Dropdown quests={quests} />} />
					<Route path="/quest/:name" element={<QuestDetails />} />
				</Routes>
				<div className="Map">
					{position && (
						<Map nodes={quests.length > currentQuestIndex ? quests[currentQuestIndex].nodes : []} position={position} />
					)}
				</div>
			</Router>
		</QuestContext.Provider>
	);
}

export default App;
