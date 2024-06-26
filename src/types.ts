export type NodeElement = {
	type: string;
	id: number;
	lat: number;
	lon: number;
	questID?: string;
	wayID?: number;
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

export type BuildingType = {
	id: number;
	tags: {
		count: number;
		building: string;
	};
};

export interface PendingQuest {
	selector: string;
	name: string;
}

export interface DoneWay {
	nodes: number[];
	doneNode: NodeElement;
}

export interface Quest {
	selector: string;
	name: string;
	max: number;
	id?: string;
	doneNodes?: NodeElement[];
	group: QuestGroup;
	startDate: string;
	done: boolean;
	tagId?: string;
}

export enum QuestGroup {
	Daily,
	Random
}

export enum QuestType {
	Housenumber,
	Building,
}
