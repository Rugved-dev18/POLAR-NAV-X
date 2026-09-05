import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { IcebergLayer } from './IcebergLayer';
import { HeatmapLayer } from './HeatmapLayer';
import { SeaIceLayer } from './SeaIceLayer';
import { OceanCurrentsLayer } from './OceanCurrentsLayer';
import { RouteLayer } from './RouteLayer';
import { StartMarker } from './StartMarker';
import { DestinationMarker } from './DestinationMarker';
import { RiskLegend } from './RiskLegend';
import { type LayerVisibilityState } from './MapLayerControl';
import { mockRoutes, type RouteData } from '../data/mockRoute';
import { mockIcebergs, type Iceberg } from '../data/mockIceberg';
import { mockHeatmapPoints } from '../data/mockHeatmap';

// Compute initial bounding box encompassing all route waypoints and iceberg positions
const allLocations: [number, number][] = [
  ...mockRoutes.flatMap((r) => r.coordinates),
  ...mockIcebergs.map((iceberg): [number, number] => [iceberg.latitude, iceberg.longitude]),
];
const initialBounds = L.latLngBounds(allLocations.map((pos) => L.latLng(pos[0], pos[1])));

/**
 * Leaflet helper component that automatically re-fits map bounds when selected route changes.
 */
const FitBoundsToRoute: React.FC<{ route: RouteData }> = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.coordinates && route.coordinates.length > 0) {
      const bounds = L.latLngBounds(route.coordinates.map((c) => L.latLng(c[0], c[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [map, route]);
  return null;
};

/**
 * Leaflet helper component that triggers map.invalidateSize() when sidebars collapse/expand
 * or window resizes, ensuring tiles redraw properly to fill container space.
 */
const MapResizeHandler: React.FC<{ isLeftOpen?: boolean; isRightOpen?: boolean }> = ({
  isLeftOpen,
  isRightOpen,
}) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 320);
    return () => clearTimeout(timer);
  }, [map, isLeftOpen, isRightOpen]);

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  return null;
};

interface AntarcticMapProps {
  routes?: RouteData[];
  selectedRouteId?: string;
  onSelectRouteId?: (id: string) => void;
  layers?: LayerVisibilityState;
  isLeftOpen?: boolean;
  isRightOpen?: boolean;
  selectedIcebergId?: string | null;
  onSelectIceberg?: (iceberg: Iceberg) => void;
}

/**
 * AntarcticMap is the central map component displaying separate geospatial layers,
 * navigation route visualization, start/destination markers, and sea-ice/ocean layers.
 */
export const AntarcticMap: React.FC<AntarcticMapProps> = ({
  routes = mockRoutes,
  selectedRouteId = mockRoutes[0].id,
  layers = {
    icebergs: true,
    heatmap: true,
    seaIce: true,
    oceanCurrents: true,
    route: true,
    startDestination: true,
  },
  isLeftOpen,
  isRightOpen,
  selectedIcebergId,
  onSelectIceberg,
}) => {
  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0] || mockRoutes[0];
  const selectedIceberg = mockIcebergs.find((i) => i.id === selectedIcebergId);

  return (
    <div className="map-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Floating Bottom-Left Risk Legend Card */}
      <RiskLegend />

      {/* Main Leaflet Map Container */}
      <MapContainer
        bounds={initialBounds}
        boundsOptions={{ padding: [50, 50] }}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Resize Handler for sidebar collapse reflow & window resize */}
        <MapResizeHandler isLeftOpen={isLeftOpen} isRightOpen={isRightOpen} />

        {/* Helper to fit bounds on route selection change */}
        <FitBoundsToRoute route={selectedRoute} />

        {/* Esri World Imagery Satellite Base Map Tile Layer */}
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Risk Heatmap Layer */}
        {layers.heatmap && <HeatmapLayer points={mockHeatmapPoints} />}

        {/* Sea-Ice Pack Extent Layer */}
        {layers.seaIce && <SeaIceLayer />}

        {/* Ocean Currents Flow Vector Layer */}
        {layers.oceanCurrents && <OceanCurrentsLayer />}

        {/* Iceberg Marker Layer */}
        {layers.icebergs && (
          <IcebergLayer icebergs={mockIcebergs} onSelectIceberg={onSelectIceberg} />
        )}

        {/* 24-Hour Predicted Position Vector Line for Selected Iceberg */}
        {layers.icebergs && selectedIceberg && selectedIceberg.predictedPosition24h && (
          <>
            <Polyline
              positions={[
                [selectedIceberg.latitude, selectedIceberg.longitude],
                [selectedIceberg.predictedPosition24h.latitude, selectedIceberg.predictedPosition24h.longitude],
              ]}
              pathOptions={{
                color: '#a78bfa',
                weight: 2,
                dashArray: '6, 6',
                opacity: 0.9,
              }}
            />
            <CircleMarker
              center={[
                selectedIceberg.predictedPosition24h.latitude,
                selectedIceberg.predictedPosition24h.longitude,
              ]}
              radius={6}
              pathOptions={{
                color: '#a78bfa',
                fillColor: '#c084fc',
                fillOpacity: 0.8,
                dashArray: '3, 3',
              }}
            >
              <Popup className="prediction-popup">
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#5b21b6' }}>
                  🎯 24H Predicted Target ({selectedIceberg.id})
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* Navigation Route Layer & Animated Vessel */}
        {layers.route && <RouteLayer routeData={selectedRoute} />}

        {/* Start & Destination Markers Layer */}
        {layers.startDestination && (
          <>
            <StartMarker location={selectedRoute.startLocation} />
            <DestinationMarker location={selectedRoute.destinationLocation} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default AntarcticMap;
