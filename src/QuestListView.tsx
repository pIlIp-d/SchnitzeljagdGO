import Map from './map';
import Dropdown from './QuestList';
import { FoundQuest, Quest } from './types';

type QuestListViewProps = {
	quests: Quest[];
	foundQuests: FoundQuest[];
	position: [number, number];
}

function QuestView({ quests, position, foundQuests }: QuestListViewProps) {
	return (
		<>
			<Dropdown quests={quests} />
			<div className="Map">
				{position && (
					<Map nodes={foundQuests.flatMap(foundQuest => foundQuest.node)} position={position} />
				)}
			</div>
		</>
	);
}

export default QuestView;
