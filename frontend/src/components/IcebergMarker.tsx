import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { type Iceberg } from '../data/mockIceberg';
import { useZoomScaledSize } from '../utils/zoomScale';
import icebergPng from '../assets/icons/iceberg.png';

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

const createIcebergIcon = (riskLevel: string, size: number) => {
  const riskColor = getRiskColor(riskLevel);
  const iconAnchor: [number, number] = [Math.round(size / 2), Math.round(size * (28 / 32))];
  const popupAnchor: [number, number] = [0, -Math.round(size * (24 / 32))];
  const badgeSize = Math.max(6, Math.round(size * (10 / 32)));

  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        <img src="${icebergPng}" alt="Iceberg" style="width: ${size}px; height: ${size}px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));" />
        <span style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: ${badgeSize}px;
          height: ${badgeSize}px;
          background-color: ${riskColor};
          border: 1.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 5px ${riskColor};
        "></span>
      </div>
    `,
    className: 'iceberg-div-icon',
    iconSize: [size, size],
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
  });
};

interface IcebergMarkerProps {
  iceberg: Iceberg;
}

/**
 * IcebergMarker component renders a Leaflet marker using custom PNG icon with dynamic zoom-scaled iconSize.
 */
export const IcebergMarker: React.FC<IcebergMarkerProps> = ({ iceberg }) => {
  // Dynamic icon sizing scaled with zoom level (baseSize=32, baseZoom=5, minSize=18, maxSize=64)
  const size = useZoomScaledSize(32, 5, 18, 64);
  const icon = createIcebergIcon(iceberg.riskLevel, size);
  const riskColor = getRiskColor(iceberg.riskLevel);

  return (
    <Marker 
      position={[iceberg.latitude, iceberg.longitude]} 
      icon={icon}
    >
      <Popup className="iceberg-popup">
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5', minWidth: '170px' }}>
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
          {iceberg.lastObserved && <div><strong>Observed:</strong> {iceberg.lastObserved}</div>}
          {iceberg.source && <div><strong>Source:</strong> <span style={{ color: '#64748b', fontSize: '11px' }}>{iceberg.source}</span></div>}
        </div>
      </Popup>
    </Marker>
  );
};

export default IcebergMarker;
