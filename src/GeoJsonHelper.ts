import axios from 'axios';
import { OSMData, QueryResult } from './types';

export const getCurrentLocation = (): Promise<[number, number]> => {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(position =>
				resolve([position.coords.latitude, position.coords.longitude])
			);
		else reject('Geolocation is not supported by this browser.');
	});
};

export const fetchGeoJSON = async (selector: string, radius: number): Promise<OSMData> => {
	return new Promise((resolve, reject) => {
		getCurrentLocation().then(
			async coords => {
				const [latitude, longitude] = coords;
				try {
					const query = `
                            [out:json];
                            (
                                nwr(around:${radius},${latitude},${longitude})${selector};
                            );
                            out body;
                            >;
                            out skel qt;
                            `;
					const response = await axios.post(
						'https://overpass-api.de/api/interpreter',
						`data=${encodeURIComponent(query)}`
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

export const fetchNodesByHouseNumber = async (number: number, radius: number): Promise<QueryResult> => {
	const rawGeoJSONData = await fetchGeoJSON(`["addr:housenumber"="${number}"]`, radius);
	console.log(rawGeoJSONData);
	return {
		nodes: rawGeoJSONData.elements.filter(node => node.type === 'node'),
		uniqueNodeGroups: rawGeoJSONData.elements.filter(node => node.type === 'way').length,
	};
};
