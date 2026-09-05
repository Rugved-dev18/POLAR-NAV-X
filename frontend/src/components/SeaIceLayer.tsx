import React from 'react';
import { Polygon, Popup } from 'react-leaflet';
import { mockSeaIceAreas, type SeaIcePolygon } from '../data/mockSeaIce';

interface SeaIceLayerProps {
  seaIceAreas?: SeaIcePolygon[];
}

/**
 * SeaIceLayer component renders semi-transparent polygon boundaries representing Antarctic sea-ice pack extent.
 */
export const SeaIceLayer: React.FC<SeaIceLayerProps> = ({
  seaIceAreas = mockSeaIceAreas,
}) => {
  return (
    <>
      {seaIceAreas.map((area) => (
        <Polygon
          key={area.id}
          positions={area.coordinates}
          pathOptions={{
            fillColor: '#38bdf8',
            fillOpacity: 0.22,
            color: '#7dd3fc',
            weight: 1.5,
            dashArray: '5, 5',
          }}
        >
          <Popup className="sea-ice-popup">
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', minWidth: '160px' }}>
              <div style={{ fontWeight: 'bold', color: '#0369a1', fontSize: '13px', marginBottom: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>
                ❄️ {area.name}
              </div>
              <div><strong>Status:</strong> {area.status}</div>
              <div><strong>Pack Density:</strong> <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{area.densityPercent}%</span></div>
              <div><strong>Est. Thickness:</strong> {area.thicknessMeters} m</div>
            </div>
          </Popup>
        </Polygon>
      ))}
    </>
  );
};

export default SeaIceLayer;
