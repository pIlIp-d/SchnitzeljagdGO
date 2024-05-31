export type NodeElement = {
	type: string;
	id: number;
	lat: number;
	lon: number;
};

export type OSMData = {
	version: number;
	generator: string;
	osm3s: {
		timestamp_osm_base: string;
		copyright: string;
	};
	elements: NodeElement[];
};

export type QueryResult = {
	nodes: NodeElement[];
	uniqueNodeGroups: number;
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
