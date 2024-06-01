import axios from 'axios';
import { BuildingType, NodeElement, OSMData, QueryResult, WayElement } from './types';

export const getCurrentLocation = (): Promise<[number, number]> => {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(position =>
				resolve([position.coords.latitude, position.coords.longitude])
			);
		else reject('Geolocation is not supported by this browser.');
	});
};

const queryOverpass = (query: string) => {
	return axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`);
};

export const fetchGeoJSON = async (selector: string, radius: number): Promise<OSMData> => {
	return new Promise((resolve, reject) => {
		getCurrentLocation().then(
			async coords => {
				const [latitude, longitude] = coords;
				try {
					const response = await queryOverpass(
						`[out:json];
                        (
                            nwr(around:${radius},${latitude},${longitude})${selector};
                        );
                        out body;
                        >;
                        out skel qt;`
					);

					resolve(response.data);
				} catch (err) {
					reject(err as string);
				}
			},
			err => {
				reject(`Geolocation error: ${err.message}`);
			}
		);
	});
};

export const fetchNodes = async (selector: string, radius: number): Promise<QueryResult> => {
	const rawGeoJSONData = await fetchGeoJSON(selector, radius);
	const ways = rawGeoJSONData.elements.filter(node => node.type === 'way');
	return {
		ways: ways as WayElement[],
		nodes: rawGeoJSONData.elements.filter(node => node.type === 'node') as NodeElement[],
	};
};

export const getBuildingTypesInRadius = async (
	minimumOccurences: number,
	maximumOccurences: number,
	radius: number
) => {
	const [latitude, longitude] = await getCurrentLocation();

	const response = await queryOverpass(`
        [out:json][timeout:25];
        nwr(around:${radius},${latitude},${longitude})[building];
        for (t["building"])
        {
        make stat building=_.val,
            count=count(ways);
        out;
        }`);

	return (response.data.elements as BuildingType[]).filter(
		e => minimumOccurences <= e.tags.count && e.tags.count <= maximumOccurences
	);
};
