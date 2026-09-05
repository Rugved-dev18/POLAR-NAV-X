import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { mockRoute, type RouteData } from '../data/mockRoute';
import { useZoomScaledSize } from '../utils/zoomScale';
import shipPng from '../assets/icons/ship.png';

/**
 * Interpolates a position [lat, lng] along route coordinates array based on normalized progress t (0 to 1).
 */
const interpolatePosition = (coords: [number, number][], progress: number): [number, number] => {
  if (!coords || coords.length === 0) return [-64.7742, -64.0531];
  if (coords.length === 1) return coords[0];

  const totalSegments = coords.length - 1;
  const scaled = Math.min(Math.max(progress, 0), 1) * totalSegments;
  const segmentIdx = Math.min(Math.floor(scaled), totalSegments - 1);
  const tSegment = scaled - segmentIdx;

  const p1 = coords[segmentIdx];
  const p2 = coords[segmentIdx + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * tSegment;
  const lng = p1[1] + (p2[1] - p1[1]) * tSegment;

  return [lat, lng];
};

interface ShipMarkerProps {
  routeData?: RouteData;
}

/**
 * ShipMarker renders an animated vessel along the navigation route with zoom-scaled sizing.
 */
export const ShipMarker: React.FC<ShipMarkerProps> = ({ routeData = mockRoute }) => {
  const [progress, setProgress] = useState<number>(0.15); // Start along route

  // Dynamic icon sizing scaled with map zoom level (baseSize=30, baseZoom=5, minSize=18, maxSize=60)
  const size = useZoomScaledSize(30, 5, 18, 60);
  const half = Math.round(size / 2);

  const shipIcon = L.icon({
    iconUrl: shipPng,
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half],
  });

  useEffect(() => {
    // Loop progress 0 -> 1 over approximately 9 seconds
    const intervalTimeMs = 100;
    const stepSize = 0.0011;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepSize;
        return next > 1 ? 0 : next;
      });
    }, intervalTimeMs);

    return () => clearInterval(timer);
  }, []);

  const currentPos = interpolatePosition(routeData.coordinates, progress);
  const progressPct = Math.round(progress * 100);

  return (
    <Marker position={currentPos} icon={shipIcon}>
      <Popup className="ship-popup">
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', lineHeight: '1.5', minWidth: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', borderBottom: '2px solid #0284c7', paddingBottom: '4px' }}>
            <span style={{ fontSize: '16px' }}>🚢</span>
            <strong style={{ color: '#0f172a', fontSize: '14px' }}>Vessel Navigator</strong>
          </div>
          <div><strong>Route:</strong> {routeData.name}</div>
          <div><strong>Progress:</strong> <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{progressPct}%</span></div>
          <div><strong>Latitude:</strong> {currentPos[0].toFixed(4)}</div>
          <div><strong>Longitude:</strong> {currentPos[1].toFixed(4)}</div>
          <div style={{
            marginTop: '8px',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            fontSize: '11px',
            fontWeight: '600',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #fde68a',
            textAlign: 'center'
          }}>
            Simulated position — demo only
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default ShipMarker;
