import React from 'react';
import { StreetViewProps } from './types';
import { Button } from '@mui/material';


const StreetView: React.FC<StreetViewProps> = ({ latitude, longitude }) => {
	const openStreetView = (): void => {
		const gmmIntentUri = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
		window.open(gmmIntentUri, '_blank');
	};
	return <Button variant="contained" onClick={openStreetView}>Open Street View</Button>;
};

export default StreetView;
