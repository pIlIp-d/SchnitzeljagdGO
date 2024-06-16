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

const QuestGenerator = async (position: [number, number]): Promise<Quest> => {
	let maxTries = 20;
	while (true) {
		if (maxTries === 0) throw new Error("Couldn't find Quest for your location.");
		maxTries--;
		const randomQuestType = Math.floor(Math.random() * (Object.keys(QuestType).length - 1));
		const randomPendingQuest = await questBuilder(randomQuestType, position);
		const data = await fetchNodes(randomPendingQuest.selector, position, SEARCH_RADIUS);

		// if it has at least required amount of nodes
		if (data.ways.length >= MIN_OCCURENCES_FOR_QUEST)
			return {
				selector: randomPendingQuest.selector,
				name: randomPendingQuest.name,
				max: data.ways.length,
			};
		// else try again;
	}
};

export default QuestGenerator;
