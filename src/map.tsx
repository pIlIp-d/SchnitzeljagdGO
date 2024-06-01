// MapComponent.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
	const [position, setPosition] = useState<[number, number] | null>(null);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					setPosition([position.coords.latitude, position.coords.longitude]);
				},
				error => {
					console.error('Error getting user location:', error);
				}
			);
		}
	}, []);

	useEffect(() => {
		const fetchOSMData = async () => {
			// Hier nodes zuweisen
			//const nodes =
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
				</Popup>
			</Marker>
		));
		setMarkers(newMarkers);
	};

	return (
		<MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100vh', width: '100%' }}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{position && (
				<Marker position={position} icon={UserIcon}>
					<Popup>You are here.</Popup>
				</Marker>
			)}
			{markers}
		</MapContainer>
	);
};

export default Map;
