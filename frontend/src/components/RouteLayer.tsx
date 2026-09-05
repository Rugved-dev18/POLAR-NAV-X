import React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { mockRoute, type RouteData } from '../data/mockRoute';
import { ShipMarker } from './ShipMarker';

interface RouteLayerProps {
  routeData?: RouteData;
}

/**
 * RouteLayer component renders a Polyline path and animated vessel marker for navigating around iceberg hazards.
 */
export const RouteLayer: React.FC<RouteLayerProps> = ({ routeData = mockRoute }) => {
  const routeColor = routeData.riskLevel === 'HIGH' ? '#ef4444' : '#0284c7';

  const polylineOptions = {
    color: routeColor,
    weight: 5,
    opacity: 0.85,
    dashArray: '8, 8',        // Dashed navigation line pattern
    lineJoin: 'round' as const,
    lineCap: 'round' as const
  };

  return (
    <>
      <Polyline 
        positions={routeData.coordinates} 
        pathOptions={polylineOptions}
      >
        <Popup>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>
            <h4 style={{ margin: '0 0 6px 0', borderBottom: `2px solid ${routeColor}`, paddingBottom: '4px', color: routeColor }}>
              🚢 NAVIGATION ROUTE
            </h4>
            <div><strong>Route ID:</strong> {routeData.id}</div>
            <div><strong>Name:</strong> {routeData.name}</div>
            <div><strong>Distance:</strong> {routeData.distanceKm} km</div>
            <div><strong>Risk Level:</strong> <span style={{ color: routeData.riskLevel === 'LOW' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{routeData.riskLevel}</span></div>
            <div><strong>Status:</strong> <span style={{ color: routeColor, fontWeight: 'bold' }}>{routeData.status}</span></div>
            <div><strong>Est. Time:</strong> {routeData.estimatedTimeHours} hrs</div>
          </div>
        </Popup>
      </Polyline>
      <ShipMarker key={routeData.id} routeData={routeData} />
    </>
  );
};

export default RouteLayer;
