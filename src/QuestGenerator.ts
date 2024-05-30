import { fetchNodesByHouseNumber } from './GeoJsonHelper';
import { NodeElement } from './types';

export interface PendingQuest {
    getNodes: () => Promise<NodeElement[]>;
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
                getNodes: () => fetchNodesByHouseNumber(houseNumber, 1000),
            };
    }
};

const QuestGenerator = async (minElementsForQuest: number = 1): Promise<Quest> => {
    let maxTries = 20;
    while (true) {
        if (maxTries === 0) throw new Error("Couldn't find Quest for your location.");
        maxTries--;
        const randomOption = questBuilder(Math.random() * (Object.keys(QuestType).length - 1));
        const data = await randomOption.getNodes();
        // if it has at least required amount of nodes
        if (data.length >= minElementsForQuest)
            return {
                nodes: data,
                name: randomOption.name,
            };
        // else try again;
    }
};

export default QuestGenerator;
