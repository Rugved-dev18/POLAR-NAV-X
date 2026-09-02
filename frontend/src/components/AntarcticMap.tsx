import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { IcebergLayer } from './IcebergLayer';
import { RouteLayer } from './RouteLayer';
import { StartMarker } from './StartMarker';
import { DestinationMarker } from './DestinationMarker';
import { MapLayerControl, type LayerVisibilityState } from './MapLayerControl';
import { mockRoute } from '../data/mockRoute';
import { mockIcebergs } from '../data/mockIcebergs';

/**
 * AntarcticMap is the central map component displaying separate geospatial layers,
 * navigation route visualization, start/destination markers, layer controls, and a route info panel.
 */
export const AntarcticMap: React.FC = () => {
  // Map viewport default coordinates centered over the Antarctic Peninsula route
  const center: [number, number] = [-66.0, -66.0];
  const zoom = 5;

  // Layer visibility state
  const [layers, setLayers] = useState<LayerVisibilityState>({
    icebergs: true,
    route: true,
    startDestination: true
  });

  const handleToggleLayer = (layerKey: keyof LayerVisibilityState) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
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
          <div className="info-row">
            <span className="info-label">Route Name:</span>
            <span className="info-value text-highlight">{mockRoute.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Distance:</span>
            <span className="info-value">{mockRoute.distanceKm} km</span>
          </div>
          <div className="info-row">
            <span className="info-label">Risk:</span>
            <span className={`risk-badge risk-${mockRoute.riskLevel.toLowerCase()}`}>
              {mockRoute.riskLevel}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className="status-recommended">{mockRoute.status}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Est. Time:</span>
            <span className="info-value">{mockRoute.estimatedTimeHours} hrs</span>
          </div>
        </div>
        <div className="fastapi-prep-footer">
          <span className="backend-tag">⚡ FastAPI Ready</span>
        </div>
      </div>

      {/* Layer Controls Panel */}
      <MapLayerControl 
        layers={layers} 
        onToggleLayer={handleToggleLayer}
        icebergCount={mockIcebergs.length}
      />

      {/* Main Leaflet Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Base Map Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Iceberg Layer */}
        {layers.icebergs && <IcebergLayer icebergs={mockIcebergs} />}

        {/* Navigation Route Layer */}
        {layers.route && <RouteLayer routeData={mockRoute} />}

        {/* Start & Destination Markers Layer */}
        {layers.startDestination && (
          <>
            <StartMarker location={mockRoute.startLocation} />
            <DestinationMarker location={mockRoute.destinationLocation} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default AntarcticMap;
