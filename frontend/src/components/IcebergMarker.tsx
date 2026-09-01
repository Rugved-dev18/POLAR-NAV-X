import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { type Iceberg } from '../data/mockIcebergs';

// Re-export type for compatibility
export type { Iceberg };

const getRiskColor = (risk?: string) => {
  switch (risk) {
    case 'HIGH':
      return '#ef4444';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
    default:
      return '#10b981';
  }
};

const icebergIcon = L.divIcon({
  html: `<div style="
    font-size: 22px; 
    text-align: center; 
    line-height: 28px; 
    user-select: none;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  ">🧊</div>`,
  className: 'iceberg-div-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

interface IcebergMarkerProps {
  iceberg: Iceberg;
}

/**
 * IcebergMarker component renders a Leaflet marker at the coordinate positions [latitude, longitude].
 */
export const IcebergMarker: React.FC<IcebergMarkerProps> = ({ iceberg }) => {
  const riskColor = getRiskColor(iceberg.riskLevel);

  return (
    <Marker 
      position={[iceberg.latitude, iceberg.longitude]} 
      icon={icebergIcon}
    >
      <Popup className="iceberg-popup">
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5', minWidth: '160px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
            <strong style={{ color: '#0f172a', fontSize: '14px' }}>{iceberg.name || iceberg.id}</strong>
            <span style={{ 
              backgroundColor: riskColor, 
              color: '#ffffff', 
              fontSize: '10px', 
              fontWeight: 'bold', 
              padding: '2px 6px', 
              borderRadius: '4px' 
            }}>
              {iceberg.riskLevel || 'NORISK'}
            </span>
          </div>
          <div><strong>ID:</strong> {iceberg.id}</div>
          <div><strong>Lat:</strong> {iceberg.latitude.toFixed(4)}</div>
          <div><strong>Lng:</strong> {iceberg.longitude.toFixed(4)}</div>
          {iceberg.sizeKm2 && <div><strong>Area:</strong> {iceberg.sizeKm2} km²</div>}
          <div>
            <strong>Status:</strong>{' '}
            <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{iceberg.status}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default IcebergMarker;
