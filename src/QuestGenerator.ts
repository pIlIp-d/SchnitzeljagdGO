import { fetchNodes, getBuildingTypesInRadius } from './GeoJsonHelper';
import { PendingQuest, Quest, QuestType } from './types';

const questBuilder = async (questType: QuestType): Promise<PendingQuest> => {
	switch (questType) {
		case QuestType.Building:
			const buildingTypes = await getBuildingTypesInRadius(5, 50, 1000);
			const randomBuildingType = buildingTypes[Math.floor(Math.random() * (buildingTypes.length - 1))];
			return {
				name: `Try to find a Building of type: ${randomBuildingType.tags.building}.`,
				selector: `["building"="${randomBuildingType.tags.building}"]`,
			};
		case QuestType.Housenumber:
		default:
			const houseNumber = Math.floor(Math.random() * 200);
			return {
				name: `Find a House with the number ${houseNumber}.`,
				selector: `["addr:housenumber"="${houseNumber}"]`
			};
	}
};

const QuestGenerator = async (minElementsForQuest: number = 1): Promise<Quest> => {
	let maxTries = 20;
	while (true) {
		if (maxTries === 0) throw new Error("Couldn't find Quest for your location.");
		maxTries--;
		const randomQuestType = Math.floor(Math.random() * (Object.keys(QuestType).length - 1));
		const randomPendingQuest = await questBuilder(randomQuestType);
		const data = await fetchNodes(randomPendingQuest.selector, 1000);

		// if it has at least required amount of nodes
		if (data.ways.length >= minElementsForQuest)
			return {
				selector: randomPendingQuest.selector,
				name: randomPendingQuest.name,
				doneNodes: [],
				doneWays: [],
				max: data.ways.length,
			};
		// else try again;
	}
};

export default QuestGenerator;
