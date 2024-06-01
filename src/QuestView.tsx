import { useRef, useState, useEffect } from 'react';
import QuestDetails from './QuestDetails';
import Map from './map';
import { FoundQuest, Quest } from './types';


type QuestViewProps = {
	quest: Quest;
	position: [number, number];
	checkLocation: () => void;
	foundQuests: FoundQuest[];
}

function QuestView({ quest, position, checkLocation, foundQuests }: QuestViewProps) {
	return (
		<>
			<QuestDetails quest={quest} checkLocation={checkLocation} current={foundQuests.length} />
			<div className="Map">
				{position && (
					<Map nodes={foundQuests.flatMap(foundQuest => foundQuest.node)} position={position} />
				)}
			</div>
		</>
	);
}

export default QuestView;
