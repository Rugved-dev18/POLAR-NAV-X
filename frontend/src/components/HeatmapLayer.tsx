import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { type HeatPoint, mockHeatmapPoints } from '../data/mockHeatmap';

interface HeatmapLayerProps {
  points?: HeatPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
  max?: number;
}

/**
 * HeatmapLayer component renders a geospatial density heatmap overlay representing iceberg concentration.
 * 
 * Powered by Leaflet.heat. API-ready for future real-time dataset streams.
 */
export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  points = mockHeatmapPoints,
  radius = 35,
  blur = 25,
  maxZoom = 8,
  max = 1.0,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Create Leaflet.heat layer instance
    const heatLayer = (L as any).heatLayer(points, {
      radius,
      blur,
      maxZoom,
      max,
      gradient: {
        0.2: '#0284c7',
        0.4: '#10b981',
        0.6: '#eab308',
        0.8: '#f97316',
        1.0: '#ef4444',
      },
    });

    heatLayer.addTo(map);

    return () => {
      if (map && heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points, radius, blur, maxZoom, max]);

  return null;
};

export default HeatmapLayer;
