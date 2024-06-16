import { fetchNodes, getBuildingTypesInRadius } from './GeoJsonHelper';
import { MAX_OCCURENCES_FOR_QUEST, MIN_OCCURENCES_FOR_QUEST, SEARCH_RADIUS } from './config';
import { Quest, QuestType } from './types';

const questBuilder = async (questType: QuestType, position: [number, number]) => {
	switch (questType) {
		case QuestType.Building: {
			const buildingTypes = await getBuildingTypesInRadius(position, MIN_OCCURENCES_FOR_QUEST, MAX_OCCURENCES_FOR_QUEST, SEARCH_RADIUS);
			const randomBuildingType = buildingTypes[Math.floor(Math.random() * (buildingTypes.length - 1))];
			return {
				name: `Try to find a Building of type: ${randomBuildingType.tags.building}.`,
				selector: `["building"="${randomBuildingType.tags.building}"]`,
			};
		}
		case QuestType.Housenumber: {
			const houseNumber = Math.floor(Math.random() * 200);
			return {
				name: `Find a House with the number ${houseNumber}.`,
				selector: `["addr:housenumber"="${houseNumber}"]`
			};
		}
	}
};

function getLengthOfEnum<T extends Record<string, string | number>>(e: T): number {
	return Object.values(e).filter(
		(value) => typeof value === 'string'
	).length;
}

const QuestGenerator = async (position: [number, number], quests: Quest[]): Promise<Quest> => {
	let maxTries = 20;
	while (true) {
		if (maxTries === 0) throw new Error("Couldn't find Quest for your location.");
		maxTries--;
		const randomQuestType = Math.floor(Math.random() * getLengthOfEnum(QuestType));
		const randomPendingQuest = await questBuilder(randomQuestType, position);
		const data = await fetchNodes(randomPendingQuest.selector, position, SEARCH_RADIUS);

		// if it has at least required amount of nodes
		if (
			data.ways.length >= MIN_OCCURENCES_FOR_QUEST
			&& !quests.some(q => q.selector === randomPendingQuest.selector)
		)
			return {
				selector: randomPendingQuest.selector,
				name: randomPendingQuest.name,
				max: Math.ceil(data.ways.length / 2),
			};
		// else try again;
	}
};

export default QuestGenerator;
