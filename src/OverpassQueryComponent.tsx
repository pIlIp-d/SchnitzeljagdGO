import React, { useEffect, useState } from 'react';
import { fetchNodesByHouseNumber } from './GeoJsonHelper';
import { NodeElement } from './types';

const OverpassQueryComponent: React.FC = () => {
	const [data, setData] = useState<NodeElement[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const difficulty = 5000;
		fetchNodesByHouseNumber(24, difficulty)
			.then(d => {
				setData(d);
				setLoading(false);
			})
			.catch((err: Error) => {
				setLoading(false);
				setError(err.message);
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
