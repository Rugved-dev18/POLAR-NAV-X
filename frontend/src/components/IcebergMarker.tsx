import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

/**
 * Iceberg interface represents the data structure for an individual iceberg tracked by the system.
 */
export interface Iceberg {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
}

// L.divIcon is a Leaflet feature that generates a custom market symbol using raw HTML.
// Here we use a snowflake emoji (❄️). It serves as a distinct symbol separate from default markers.
const icebergIcon = L.divIcon({
  html: `<div style="font-size: 24px; text-align: center; line-height: 30px; user-select: none;">❄️</div>`,
  className: 'iceberg-div-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],     // Center point of the icon (matches half the iconSize coordinate)
  popupAnchor: [0, -15],     // Where the popup anchor point should open relative to the iconAnchor
});

interface IcebergMarkerProps {
  iceberg: Iceberg;
}

/**
 * IcebergMarker component renders a Leaflet marker at the coordinate positions [latitude, longitude].
 * In React Leaflet:
 * - <Marker> takes a geographic coordinate and custom Leaflet Icon.
 * - <Popup> intercepts marker left-clicks automatically, opening a detailed info bubble.
 */
export const IcebergMarker: React.FC<IcebergMarkerProps> = ({ iceberg }) => {
  return (
    <Marker 
      position={[iceberg.latitude, iceberg.longitude]} 
      icon={icebergIcon}
    >
      <Popup>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>
          <h4 style={{ margin: '0 0 6px 0', borderBottom: '1px solid #e1e4e6', paddingBottom: '4px', color: '#111827' }}>
            Iceberg Tracked
          </h4>
          <div><strong>ID:</strong> {iceberg.id}</div>
          <div><strong>Lat:</strong> {iceberg.latitude.toFixed(4)}</div>
          <div><strong>Lng:</strong> {iceberg.longitude.toFixed(4)}</div>
          <div>
            <strong>Status:</strong>{' '}
            <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>{iceberg.status}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default IcebergMarker;
