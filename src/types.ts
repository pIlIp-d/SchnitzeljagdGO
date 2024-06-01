export type NodeElement = {
	type: string;
	id: number;
	lat: number;
	lon: number;
};

export type WayElement = {
	type: string;
	id: number;
	nodes: number[];
};

export type OSMData = {
	version: number;
	generator: string;
	osm3s: {
		timestamp_osm_base: string;
		copyright: string;
	};
	elements: NodeElement[] | WayElement[];
};

export type QueryResult = {
	nodes: NodeElement[];
	ways: WayElement[];
};

export type StreetViewProps = {
	latitude: number;
	longitude: number;
};

export type BuildingType = {
	id: number;
	tags: {
		count: number;
		building: string;
	};
};

export interface PendingQuest {
	getQueryResult: () => Promise<QueryResult>;
	name: string;
}

export interface Quest {
	nodes: NodeElement[];
	ways: WayElement[];
	name: string;
	current: number;
	max: number;
}

export enum QuestType {
	Housenumber = 0,
	Building = 1,
}
