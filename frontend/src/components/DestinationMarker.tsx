import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { type RoutePoint, mockDestinationPoint } from '../data/mockRoute';

const destinationIcon = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ef4444;
    color: white;
    font-weight: bold;
    font-size: 14px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  ">🏁</div>`,
  className: 'destination-marker-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface DestinationMarkerProps {
  location?: RoutePoint;
}

export const DestinationMarker: React.FC<DestinationMarkerProps> = ({ location = mockDestinationPoint }) => {
  return (
    <Marker position={[location.latitude, location.longitude]} icon={destinationIcon}>
      <Popup>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>
          <h4 style={{ margin: '0 0 6px 0', borderBottom: '2px solid #ef4444', paddingBottom: '4px', color: '#991b1b' }}>
            🏁 DESTINATION LOCATION
          </h4>
          <div><strong>Station:</strong> {location.name}</div>
          <div><strong>Latitude:</strong> {location.latitude.toFixed(4)}</div>
          <div><strong>Longitude:</strong> {location.longitude.toFixed(4)}</div>
          {location.description && (
            <div style={{ marginTop: '4px', color: '#64748b', fontSize: '12px' }}>
              {location.description}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default DestinationMarker;
