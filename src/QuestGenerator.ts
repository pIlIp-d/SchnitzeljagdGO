import { fetchNodesByHouseNumber } from './GeoJsonHelper';
import { NodeElement, QueryResult } from './types';

export interface PendingQuest {
	getQueryResult: () => Promise<QueryResult>;
	name: string;
}

export interface Quest {
	nodes: NodeElement[];
	name: string;
}

enum QuestType {
	Housenumber = 0,
	Node = 1,
}

const questBuilder = (questType: QuestType): PendingQuest => {
	switch (questType) {
		case QuestType.Housenumber:
		default:
			const houseNumber = Math.floor(Math.random() * 200);
			return {
				name: `Find a House with the number ${houseNumber}.`,
				getQueryResult: () => fetchNodesByHouseNumber(houseNumber, 1000),
			};
	}
};

const QuestGenerator = async (minElementsForQuest: number = 1): Promise<Quest> => {
	let maxTries = 20;
	while (true) {
		if (maxTries === 0) throw new Error("Couldn't find Quest for your location.");
		maxTries--;
		const randomQuestType = Math.random() * (Object.keys(QuestType).length - 1);
		const randomPendingQuest = questBuilder(randomQuestType);
		const data = await randomPendingQuest.getQueryResult();
		// if it has at least required amount of nodes
		if (data.uniqueNodeGroups >= minElementsForQuest)
			return {
				nodes: data.nodes,
				name: randomPendingQuest.name,
			};
		// else try again;
	}
};

export default QuestGenerator;
