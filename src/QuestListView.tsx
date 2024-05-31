import { useRef, useState, useEffect } from 'react';
import { getCurrentLocation } from './GeoJsonHelper';
import QuestGenerator, { Quest } from './QuestGenerator';
import Map from './map';
import Dropdown from './QuestList';

function QuestView() {
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
		<>
			<Dropdown quests={quests} />
			<div className="Map">
				{position && (
					<Map nodes={quests.length > currentQuestIndex ? quests[currentQuestIndex].nodes : []} position={position} />
				)}
			</div>
		</>
	);
}

export default QuestView;
