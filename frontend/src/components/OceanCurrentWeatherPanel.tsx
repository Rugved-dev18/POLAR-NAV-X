import React from 'react';
import { mockWeather, type WeatherMetrics } from '../data/mockWeather';

interface OceanCurrentWeatherPanelProps {
  weather?: WeatherMetrics;
}

export const OceanCurrentWeatherPanel: React.FC<OceanCurrentWeatherPanelProps> = ({
  weather = mockWeather,
}) => {
  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'risk-high';
      case 'MODERATE':
        return 'risk-medium';
      case 'LOW':
      default:
        return 'risk-low';
    }
  };

  return (
    <div className="ocean-environment-panel">
      {/* Panel Header */}
      <div className="panel-top-row">
        <div className="title-group">
          <span className="panel-header-icon">🌊</span>
          <h4>OCEAN & ENVIRONMENT METRICS</h4>
        </div>
      </div>

      {/* Environmental Telemetry Rows */}
      <div className="detail-rows">
        <div className="detail-row">
          <span className="detail-label">Surface Current:</span>
          <span className="detail-value highlight">{weather.currentSpeedMs} m/s</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Current Heading:</span>
          <span className="detail-value compass-heading">
            {weather.currentDirectionDeg}° ENE
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Sea Surface Temp:</span>
          <span className="detail-value">{weather.seaTempC}°C</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Air Temperature:</span>
          <span className="detail-value">{weather.airTempC}°C</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Drift Impact:</span>
          <span className={`risk-badge ${getImpactBadgeClass(weather.iceDriftImpact)}`}>
            {weather.iceDriftImpact}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OceanCurrentWeatherPanel;
