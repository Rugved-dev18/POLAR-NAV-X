import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { type RoutePoint, mockStartPoint } from '../data/mockRoute';
import startPng from '../assets/icons/start.png';

const startIcon = L.icon({
  iconUrl: startPng,
  iconSize: [22, 22],
  iconAnchor: [11, 20],
  popupAnchor: [0, -18],
});

interface StartMarkerProps {
  location?: RoutePoint;
}

export const StartMarker: React.FC<StartMarkerProps> = ({ location = mockStartPoint }) => {
  return (
    <Marker position={[location.latitude, location.longitude]} icon={startIcon}>
      <Popup>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>
          <h4 style={{ margin: '0 0 6px 0', borderBottom: '2px solid #10b981', paddingBottom: '4px', color: '#065f46' }}>
            🚩 START LOCATION
          </h4>
          <div><strong>Base:</strong> {location.name}</div>
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

export default StartMarker;
