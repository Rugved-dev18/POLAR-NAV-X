import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { mockOceanCurrentPoints, type OceanCurrentPoint } from '../data/mockOceanCurrents';

interface OceanCurrentsLayerProps {
  currents?: OceanCurrentPoint[];
}

/**
 * Creates a small discrete rotated SVG arrow icon in soft teal (#2dd4bf)
 */
const createArrowIcon = (directionDeg: number) => {
  return L.divIcon({
    html: `
      <div style="
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(${directionDeg}deg);
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6));
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <polyline points="5 11 12 4 19 11"></polyline>
        </svg>
      </div>
    `,
    className: 'ocean-current-arrow-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

/**
 * OceanCurrentsLayer component renders scattered, discrete rotated arrow markers
 * representing a directional ocean current vector field without any connecting lines.
 */
export const OceanCurrentsLayer: React.FC<OceanCurrentsLayerProps> = ({
  currents = mockOceanCurrentPoints,
}) => {
  return (
    <>
      {currents.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={createArrowIcon(point.directionDeg)}
          zIndexOffset={-100}
        >
          <Popup className="currents-popup">
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', minWidth: '150px' }}>
              <div style={{ fontWeight: 'bold', color: '#0d9488', fontSize: '13px', marginBottom: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>
                🌊 {point.name}
              </div>
              <div><strong>Flow Speed:</strong> <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{point.speedKnots} kts</span></div>
              <div><strong>Heading:</strong> {point.directionDeg}°</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default OceanCurrentsLayer;
