import { fetchNodes, getBuildingTypesInRadius } from './GeoJsonHelper';
import { NodeElement, QueryResult } from './types';

export interface PendingQuest {
    getQueryResult: () => Promise<QueryResult>;
    name: string;
}

export interface Quest {
    nodes: NodeElement[];
    name: string;
    current: number;
    max: number;
}

enum QuestType {
    Housenumber = 0,
    Building = 1,
}

const questBuilder = async (questType: QuestType): Promise<PendingQuest> => {
    switch (questType) {
        case QuestType.Building:
            const buildingTypes = await getBuildingTypesInRadius(5, 50, 1000);
            const randomBuildingType = buildingTypes[Math.floor(Math.random() * (buildingTypes.length - 1))];
            return {
                name: `Try to find a Building of type: ${randomBuildingType.tags.building}.`,
                getQueryResult: () => fetchNodes(`["building"="${randomBuildingType.tags.building}"]`, 1000),
            };
        case QuestType.Housenumber:
        default:
            const houseNumber = Math.floor(Math.random() * 200);
            return {
                name: `Find a House with the number ${houseNumber}.`,
                getQueryResult: () => fetchNodes(`["addr:housenumber"="${houseNumber}"]`, 1000),
            };
    }
};

const QuestGenerator = async (minElementsForQuest: number = 1): Promise<Quest> => {
    let maxTries = 20;
    while (true) {
        if (maxTries === 0) throw new Error("Couldn't find Quest for your location.");
        maxTries--;
        const randomQuestType = Math.random() * (Object.keys(QuestType).length - 1);
        const randomPendingQuest = await questBuilder(randomQuestType);
        const data = await randomPendingQuest.getQueryResult();
        // if it has at least required amount of nodes
        if (data.uniqueNodeGroups >= minElementsForQuest)
            return {
                nodes: data.nodes,
                name: randomPendingQuest.name,
                current: 0,
                max: data.uniqueNodeGroups,
            };
        // else try again;
    }
};

export default QuestGenerator;
