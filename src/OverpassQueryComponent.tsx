import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OverpassQueryComponent: React.FC = () => {
	const [data, setData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchGeoJSON = async (
			selector: string,
			radius: number
		): Promise<GeoJSON.FeatureCollection<GeoJSON.Geometry>> => {
			return new Promise((resolve, reject) => {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						async position => {
							const { latitude, longitude } = position.coords;
							try {
								const query = `
                  [out:json];
                  /* This dynamically sets the central point to the current map view center */
                  (
                    node(around:${radius},${latitude},${longitude})${selector};
                    way(around:${radius},${latitude},${longitude})${selector};
                    rel(around:${radius},${latitude},${longitude})${selector};
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
				} else {
					reject('Geolocation is not supported by this browser.');
				}
			});
		};

		const fetchByHouseNumber = (
			number: number,
			radius: number
		): Promise<GeoJSON.FeatureCollection<GeoJSON.Geometry>> => {
			return fetchGeoJSON(`["addr:housenumber"="${number}"]`, radius);
		};

		const difficulty = 5000;
		fetchByHouseNumber(24, difficulty)
			.then((d: GeoJSON.FeatureCollection<GeoJSON.Geometry>) => {
				setData(d);
				setLoading(false);
			})
			.catch(err => {
				setLoading(false);
				setError(err);
			});
	}, []);

	return (
		<div>
			<h1>Overpass Query Results</h1>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}
			{data && <pre>{JSON.stringify(data, null, 2)}</pre>}
		</div>
	);
};

export default OverpassQueryComponent;
