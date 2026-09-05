import React, { useState } from 'react';
import { type RouteData } from '../data/mockRoute';
import { MapLayerControl, type LayerVisibilityState } from './MapLayerControl';
import { calculateHaversineDistance, interpolateRouteCoordinates } from '../utils/geoHelpers';

interface NavigationPanelProps {
  routes: RouteData[];
  selectedRouteId: string;
  onSelectRouteId: (id: string) => void;
  onAddAndSelectRoute: (newRoute: RouteData) => void;
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
  icebergCount?: number;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  routes,
  selectedRouteId,
  onSelectRouteId,
  onAddAndSelectRoute,
  layers,
  onToggleLayer,
  icebergCount = 8,
}) => {
  // Input fields state initialized with Palmer Station -> Rothera Station coordinates
  const [startLat, setStartLat] = useState<string>('-64.774');
  const [startLng, setStartLng] = useState<string>('-64.053');
  const [destLat, setDestLat] = useState<string>('-67.570');
  const [destLng, setDestLng] = useState<string>('-68.130');

  const [showToast, setShowToast] = useState<boolean>(false);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Validation helpers
  const getLatError = (val: string): string | null => {
    if (!val) return null;
    const num = parseFloat(val);
    if (isNaN(num) || num < -90 || num > -50) {
      return 'Latitude must be between -90° and -50° (Antarctic waters)';
    }
    return null;
  };

  const getLngError = (val: string): string | null => {
    if (!val) return null;
    const num = parseFloat(val);
    if (isNaN(num) || num < -180 || num > 180) {
      return 'Longitude must be between -180° and 180°';
    }
    return null;
  };

  const startLatErr = getLatError(startLat);
  const startLngErr = getLngError(startLng);
  const destLatErr = getLatError(destLat);
  const destLngErr = getLngError(destLng);

  const handlePlanRoute = (e: React.FormEvent) => {
    e.preventDefault();

    const sLat = parseFloat(startLat) || -64.7742;
    const sLng = parseFloat(startLng) || -64.0531;
    const dLat = parseFloat(destLat) || -67.5700;
    const dLng = parseFloat(destLng) || -68.1300;

    const distance = calculateHaversineDistance(sLat, sLng, dLat, dLng);
    const coords = interpolateRouteCoordinates(sLat, sLng, dLat, dLng, 5);
    const estHours = Math.max(0.5, Math.round((distance / 20) * 10) / 10);

    const customRoute: RouteData = {
      id: `custom-${Date.now()}`,
      name: 'Custom Route',
      distanceKm: distance,
      riskLevel: 'MEDIUM',
      status: 'Recommended',
      estimatedTimeHours: estHours,
      waypointsCount: coords.length,
      startLocation: {
        name: 'Custom Start',
        latitude: sLat,
        longitude: sLng,
        description: 'User-specified departure coordinate',
      },
      destinationLocation: {
        name: 'Custom Destination',
        latitude: dLat,
        longitude: dLng,
        description: 'User-specified destination coordinate',
      },
      coordinates: coords,
    };

    onAddAndSelectRoute(customRoute);

    // Show brief "Route planned ✓" toast message for ~2 seconds
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div className="nav-panel-container">
      {/* 1. ROUTE PLANNING FORM SECTION */}
      <form onSubmit={handlePlanRoute} className="nav-form">
        {/* Start Location Section */}
        <div className="form-section">
          <div className="section-title-box">
            <span className="section-icon">🚩</span>
            <h4 className="section-title">START LOCATION</h4>
          </div>

          <div className="field-group">
            <label className="field-label">Latitude (°S)</label>
            <input
              type="number"
              step="0.001"
              placeholder="-64.774"
              value={startLat}
              onChange={(e) => setStartLat(e.target.value)}
              className={`nav-input ${startLatErr ? 'input-error' : ''}`}
            />
            {startLatErr && <span className="validation-hint">{startLatErr}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Longitude (°W)</label>
            <input
              type="number"
              step="0.001"
              placeholder="-64.053"
              value={startLng}
              onChange={(e) => setStartLng(e.target.value)}
              className={`nav-input ${startLngErr ? 'input-error' : ''}`}
            />
            {startLngErr && <span className="validation-hint">{startLngErr}</span>}
          </div>
        </div>

        {/* Destination Location Section */}
        <div className="form-section">
          <div className="section-title-box">
            <span className="section-icon">🎯</span>
            <h4 className="section-title">DESTINATION LOCATION</h4>
          </div>

          <div className="field-group">
            <label className="field-label">Latitude (°S)</label>
            <input
              type="number"
              step="0.001"
              placeholder="-67.570"
              value={destLat}
              onChange={(e) => setDestLat(e.target.value)}
              className={`nav-input ${destLatErr ? 'input-error' : ''}`}
            />
            {destLatErr && <span className="validation-hint">{destLatErr}</span>}
          </div>

          <div className="field-group">
            <label className="field-label">Longitude (°W)</label>
            <input
              type="number"
              step="0.001"
              placeholder="-68.130"
              value={destLng}
              onChange={(e) => setDestLng(e.target.value)}
              className={`nav-input ${destLngErr ? 'input-error' : ''}`}
            />
            {destLngErr && <span className="validation-hint">{destLngErr}</span>}
          </div>
        </div>

        {/* Primary Action Button & Confirmation Toast */}
        <div className="form-actions">
          <button type="submit" className="plan-route-btn">
            🧭 Plan Route
          </button>
          {showToast && <div className="route-toast">Route planned ✓</div>}
        </div>
      </form>

      <div className="nav-panel-divider" />

      {/* 2. ROUTE INFORMATION CARD SECTION */}
      <div className="sidebar-route-info-card">
        <div className="form-section">
          <div className="section-title-box">
            <span className="section-icon">⚓</span>
            <h4 className="section-title">ROUTE INFORMATION</h4>
          </div>

          <div className="panel-content">
            <div className="route-select-box">
              <span className="info-label">Active Route:</span>
              <select
                id="sidebar-route-select"
                className="route-dropdown"
                value={selectedRoute?.id}
                onChange={(e) => onSelectRouteId(e.target.value)}
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="info-row">
              <span className="info-label">Distance:</span>
              <span className="info-value">{selectedRoute?.distanceKm} km</span>
            </div>

            <div className="info-row">
              <span className="info-label">Risk:</span>
              <span className={`risk-badge risk-${selectedRoute?.riskLevel.toLowerCase()}`}>
                {selectedRoute?.riskLevel}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className={selectedRoute?.status === 'Recommended' ? 'status-recommended' : 'status-caution'}>
                {selectedRoute?.status}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Est. Time:</span>
              <span className="info-value">{selectedRoute?.estimatedTimeHours} hrs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-panel-divider" />

      {/* 3. MAP LAYERS CONTROL SECTION */}
      <MapLayerControl
        layers={layers}
        onToggleLayer={onToggleLayer}
        icebergCount={icebergCount}
      />

      <div className="nav-panel-divider" />

      {/* Unobtrusive Demo Data Footnote */}
      <div className="sidebar-demo-note">
        <span>⚠️ Demo data — live feed integration pending</span>
      </div>
    </div>
  );
};

export default NavigationPanel;
