// MapComponent.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import UserPin from './assets/UserPin.png';

// Import Leaflet and fix the default icon path
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { NodeElement } from './types';
import StreetView from './OpenStreetView';

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
	iconUrl: UserPin, // Replace with your image URL
	iconSize: [50, 50], // Adjust the size to match your image dimensions
	iconAnchor: [25, 50], // Adjust the anchor to position the icon correctly
	popupAnchor: [0, 0], // Adjust the popup anchor to open the popup correctly
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapParameters {
	nodes: NodeElement[];
	position: [number, number];
}

const Map: React.FC<MapParameters> = ({ nodes, position }) => {
	const [markers, setMarkers] = useState<JSX.Element[]>([]);

	useEffect(() => {
		const fetchOSMData = async () => {
			// Hier nodes zuweisen
			setMarkersOnMap(nodes);
		};

		fetchOSMData();
	}, [nodes]);
	// Hier Node type ändern
	const setMarkersOnMap = (nodes: NodeElement[]) => {
		const uniqueFilteredNodes = nodes.filter(function (item, pos) {
			return nodes.indexOf(item) == pos;
		});
		const newMarkers = uniqueFilteredNodes.map(node => (
			<Marker key={node.id} position={[node.lat, node.lon]}>
				<Popup>
					Node ID: {node.id}
					<br />
					Lat: {node.lat}, Lon: {node.lon}
					<StreetView latitude={node.lat} longitude={node.lon} />
					{/*OSM NODE INFO https://www.openstreetmap.org/node/305293190 or ...org/way/<id>*/}
				</Popup>
			</Marker>
		));
		setMarkers(newMarkers);
	};

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
			{position && (
				<Marker position={position} icon={UserIcon}>
					<Popup>You are here.</Popup>
				</Marker>
			)}
			{markers}
			<RecenterAutomatically pos={position} />
		</MapContainer>
	);
};

export default Map;
