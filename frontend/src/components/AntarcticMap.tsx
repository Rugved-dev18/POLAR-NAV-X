import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { IcebergLayer } from './IcebergLayer';
import { HeatmapLayer } from './HeatmapLayer';
import { RouteLayer } from './RouteLayer';
import { StartMarker } from './StartMarker';
import { DestinationMarker } from './DestinationMarker';
import { MapLayerControl, type LayerVisibilityState } from './MapLayerControl';
import { mockRoutes } from '../data/mockRoute';
import { mockIcebergs } from '../data/mockIceberg';
import { mockHeatmapPoints } from '../data/mockHeatmap';

// Compute bounding box encompassing all route waypoints and iceberg positions
const allLocations: [number, number][] = [
  ...mockRoutes.flatMap(r => r.coordinates),
  ...mockIcebergs.map((iceberg): [number, number] => [iceberg.latitude, iceberg.longitude]),
];
const initialBounds = L.latLngBounds(allLocations.map((pos) => L.latLng(pos[0], pos[1])));

/**
 * AntarcticMap is the central map component displaying separate geospatial layers,
 * navigation route visualization, start/destination markers, layer controls, and a route info panel.
 */
export const AntarcticMap: React.FC = () => {
  // Layer visibility state (4 toggles: icebergs, heatmap, route, startDestination)
  const [layers, setLayers] = useState<LayerVisibilityState>({
    icebergs: true,
    heatmap: true,
    route: true,
    startDestination: true,
  });

  // Selected route state
  const [selectedRouteId, setSelectedRouteId] = useState<string>(mockRoutes[0].id);

  const selectedRoute = mockRoutes.find(r => r.id === selectedRouteId) || mockRoutes[0];

  const handleToggleLayer = (layerKey: keyof LayerVisibilityState) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  return (
    <div className="map-wrapper" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Route Information Overlay Panel */}
      <div className="route-info-panel">
        <div className="panel-header">
          <span className="panel-icon">⚓</span>
          <h3>ROUTE INFORMATION</h3>
        </div>
        <div className="panel-content">
          <div className="route-select-box">
            <span className="info-label">Active Route:</span>
            <select
              id="route-select"
              className="route-dropdown"
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
            >
              {mockRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="info-row">
            <span className="info-label">Distance:</span>
            <span className="info-value">{selectedRoute.distanceKm} km</span>
          </div>

          <div className="info-row">
            <span className="info-label">Risk:</span>
            <span className={`risk-badge risk-${selectedRoute.riskLevel.toLowerCase()}`}>
              {selectedRoute.riskLevel}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className={selectedRoute.status === 'Recommended' ? 'status-recommended' : 'status-caution'}>
              {selectedRoute.status}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Est. Time:</span>
            <span className="info-value">{selectedRoute.estimatedTimeHours} hrs</span>
          </div>
        </div>
      </div>

      {/* Layer Controls Panel (4 toggles) */}
      <MapLayerControl
        layers={layers}
        onToggleLayer={handleToggleLayer}
        icebergCount={mockIcebergs.length}
      />

      {/* Main Leaflet Map Container */}
      <MapContainer
        bounds={initialBounds}
        boundsOptions={{ padding: [50, 50] }}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Esri World Imagery Satellite Base Map Tile Layer */}
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Risk Heatmap Layer */}
        {layers.heatmap && <HeatmapLayer points={mockHeatmapPoints} />}

        {/* Iceberg Marker Layer */}
        {layers.icebergs && <IcebergLayer icebergs={mockIcebergs} />}

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
