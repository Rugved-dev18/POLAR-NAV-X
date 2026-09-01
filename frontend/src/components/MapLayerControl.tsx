import React from 'react';

export interface LayerVisibilityState {
  icebergs: boolean;
  route: boolean;
  startDestination: boolean;
}

interface MapLayerControlProps {
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
  icebergCount?: number;
}

/**
 * MapLayerControl renders a control panel allowing users to toggle individual geospatial map layers on/off.
 */
export const MapLayerControl: React.FC<MapLayerControlProps> = ({
  layers,
  onToggleLayer,
  icebergCount = 5,
}) => {
  return (
    <div className="map-layer-control-panel">
      <div className="control-header">
        <span className="control-icon">🗺️</span>
        <span className="control-title">Map Layers</span>
      </div>
      
      <div className="control-items">
        <label className={`layer-toggle-item ${layers.icebergs ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={layers.icebergs}
            onChange={() => onToggleLayer('icebergs')}
          />
          <span className="toggle-label">
            <span className="layer-symbol">🧊</span> Iceberg Layer
          </span>
          <span className="layer-badge">{icebergCount}</span>
        </label>

        <label className={`layer-toggle-item ${layers.route ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={layers.route}
            onChange={() => onToggleLayer('route')}
          />
          <span className="toggle-label">
            <span className="layer-symbol">🧭</span> Navigation Route
          </span>
          <span className="layer-badge status-badge">Active</span>
        </label>

        <label className={`layer-toggle-item ${layers.startDestination ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={layers.startDestination}
            onChange={() => onToggleLayer('startDestination')}
          />
          <span className="toggle-label">
            <span className="layer-symbol">🚩</span> Start / Destination
          </span>
          <span className="layer-badge">2 Pts</span>
        </label>
      </div>
    </div>
  );
};

export default MapLayerControl;
