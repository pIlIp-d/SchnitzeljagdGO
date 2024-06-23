import { fetchNodes, getBuildingTypesInRadius } from './GeoJsonHelper';
import { MAX_OCCURENCES_FOR_QUEST, MIN_OCCURENCES_FOR_QUEST, SEARCH_RADIUS } from './config';
import { Quest, QuestType } from './types';

const questBuilder = async (questType: QuestType, position: [number, number]) => {
	switch (questType) {
		case QuestType.Building: {
			const buildingTypes = await getBuildingTypesInRadius(
				position,
				MIN_OCCURENCES_FOR_QUEST,
				MAX_OCCURENCES_FOR_QUEST,
				SEARCH_RADIUS
			);
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
				selector: `["addr:housenumber"="${houseNumber}"]`,
			};
		}
	}
};

function getLengthOfEnum<T extends Record<string, string | number>>(e: T): number {
	return Object.values(e).filter(value => typeof value === 'string').length;
}

const QuestGenerator = async (position: [number, number], quests: Quest[]): Promise<Quest> => {
	let maxTries = 20;
	while (maxTries > 0) {
		maxTries--;
		const randomQuestType = Math.floor(Math.random() * getLengthOfEnum(QuestType));
		const randomPendingQuest = await questBuilder(randomQuestType, position);
		const data = await fetchNodes(randomPendingQuest.selector, position, SEARCH_RADIUS);

		if (
			// if it has at least required amount of nodes
			(data.ways.length >= MIN_OCCURENCES_FOR_QUEST && !quests.some(q => q.selector === randomPendingQuest.selector)) ||
			(maxTries < 2 && data.ways.length > 0) // or didnt find anything else
		)
			return {
				selector: randomPendingQuest.selector,
				name: randomPendingQuest.name,
				max: Math.max(Math.ceil(data.ways.length / 2), 1), // at least one
			};
		// else try again;
	}
	throw new Error("Couldn't find Quest for your location.");
};

export default QuestGenerator;
