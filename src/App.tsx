import { useEffect, useRef, useState } from 'react';
import './App.css';
import Map from './map';
import QuestGenerator, { Quest } from './QuestGenerator';
import { getCurrentLocation } from './GeoJsonHelper';

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

	console.log(quests);

	return (
		<>
			<h1>Some Headline</h1>
			<div className="Map">
				{quests.length > currentQuestIndex && position && (
					<Map nodes={quests[currentQuestIndex].nodes} position={position} />
				)}
			</div>
		</>
	);
}

export default App;
