// MapComponent.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import UserLocation from './assets/circle.svg';

// Import Leaflet and fix the default icon path
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { NodeElement, Quest } from './types';
import { Box } from '@mui/material';
import StreetViewButton from './views/buttons/StreetViewButton';
import OSMButton from './views/buttons/OSMButton';

// Fixing the default icon issue
const DefaultIcon = L.icon({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

const UserIcon = L.icon({
	iconUrl: UserLocation, // Replace with your image URL
	iconSize: [30, 30], // Adjust the size to match your image dimensions
	iconAnchor: [15, 15], // Adjust the anchor to position the icon correctly
	popupAnchor: [0, 0], // Adjust the popup anchor to open the popup correctly
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapParameters {
	nodes: NodeElement[];
	quests: { [key: string]: Quest };
	position: [number, number];
}

const Map: React.FC<MapParameters> = ({ nodes, quests, position }) => {
	const [markers, setMarkers] = useState<JSX.Element[]>([]);

	//TODO https://leafletjs.com/examples/mobile/


	const setMarkersOnMap = useCallback((nodes: NodeElement[]) => {
		const uniqueFilteredNodes = nodes.filter(function (item, pos) {
			return nodes.flatMap(n => n.id).indexOf(item.id) == pos;
		});
		const newMarkers = uniqueFilteredNodes.map(node => (
			<Marker key={node.id} position={[node.lat, node.lon]}>
				<Popup>
					<Box display={'flex'} flexDirection={"column"} textAlign={"center"}>
						<div>{quests[node.questID!].name}</div>
						<div>Lat: {node.lat}, Lon: {node.lon}</div>
						<Box display={'flex'} flexDirection={"row"} justifyContent="space-around" width="100%">
							<StreetViewButton latitude={node.lat} longitude={node.lon} />
							<OSMButton wayID={node.wayID!} />
						</Box>
					</Box>
				</Popup>
			</Marker>
		));
		setMarkers(newMarkers);
	}, [quests]);

	useEffect(() => {
		const fetchOSMData = async () => {
			// Hier nodes zuweisen
			setMarkersOnMap(nodes);
		};

		fetchOSMData();
	}, [nodes, setMarkersOnMap]);

	const RecenterAutomatically = ({ pos }: { pos: [number, number] }) => {
		const map = useMap();
		useEffect(() => {
			map.setView(pos);
		}, [pos, map]);
		return null;
	}

	return (
		<MapContainer center={position} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{/*url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"*/}
			{markers}
			{position && (
				<Marker position={position} icon={UserIcon} zIndexOffset={100}>
					<Popup>You are here.</Popup>
				</Marker>
			)}
			<RecenterAutomatically pos={position} />
		</MapContainer>
	);
};

export default Map;
