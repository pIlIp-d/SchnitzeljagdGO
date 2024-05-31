import React from 'react';
import { StreetViewProps } from './types';

const StreetView: React.FC<StreetViewProps> = ({ latitude, longitude }) => {
	const openStreetView = (): void => {
		const gmmIntentUri = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
		window.open(gmmIntentUri, '_blank');
	};
	return <button onClick={openStreetView}>Open Street View</button>;
};

export default StreetView;
