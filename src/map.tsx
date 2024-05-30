// MapComponent.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import Leaflet and fix the default icon path
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { NodeElement, OSMData } from './types';
// Fixing the default icon issue
const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const position: [number, number] = [51.505, -0.09];

const Map: React.FC = () => {
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

function setMarkersOnMap(nodes : NodeElement[]){
    let Markers : string = '';
    nodes.forEach(node => {
        
        const position : [number, number] = [node.lat, node.lon];
        Markers = Markers +"<Marker position={" + position +"}>\n<Popup>\n</Popup>\n</Marker>\n"
    });
    return Markers;

}

function jsonToLocation(jsonData : OSMData) {
    const nodes = jsonData.elements.filter(element => element.type === 'node') as NodeElement[];
    setMarkersOnMap(nodes);
}
export default Map;
