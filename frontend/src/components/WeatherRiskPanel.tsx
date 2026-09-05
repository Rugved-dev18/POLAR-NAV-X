import React from 'react';
import { mockWeather, type WeatherMetrics } from '../data/mockWeather';

interface WeatherRiskPanelProps {
  weather?: WeatherMetrics;
}

export const WeatherRiskPanel: React.FC<WeatherRiskPanelProps> = ({
  weather = mockWeather,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#ef4444'; // High risk (Red)
    if (score >= 40) return '#f59e0b'; // Moderate risk (Amber)
    return '#10b981'; // Low risk (Green)
  };

  const scoreColor = getScoreColor(weather.weatherRiskScore);

  return (
    <div className="weather-risk-panel">
      {/* Panel Top Row with Title & Storm Watch Badge */}
      <div className="panel-top-row">
        <div className="title-group">
          <span className="panel-header-icon">{weather.stormWarning ? '🌩️' : '🌤️'}</span>
          <h4>WEATHER RISK ASSESSMENT</h4>
        </div>
        <div className="header-actions">
          {weather.stormWarning ? (
            <span className="risk-badge badge-storm">STORM WATCH</span>
          ) : (
            <span className="risk-badge badge-stable">STABLE</span>
          )}
        </div>
      </div>

      {/* Weather Telemetry Rows */}
      <div className="detail-rows">
        <div className="detail-row">
          <span className="detail-label">Wind Velocity:</span>
          <span className="detail-value highlight">
            {weather.windSpeedKn} kn {weather.windDirection}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Visibility:</span>
          <span className="detail-value">{weather.visibilityKm} km</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Wave Height:</span>
          <span className="detail-value">{weather.waveHeightM} m</span>
        </div>
      </div>

      {/* Visual Risk Score Progress Bar */}
      <div className="risk-score-container">
        <div className="score-label-row">
          <span className="score-title">WEATHER RISK INDEX</span>
          <span className="score-number" style={{ color: scoreColor }}>
            {weather.weatherRiskScore} / 100
          </span>
        </div>
        <div className="score-bar-track">
          <div
            className="score-bar-fill"
            style={{
              width: `${weather.weatherRiskScore}%`,
              backgroundColor: scoreColor,
              boxShadow: `0 0 10px ${scoreColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherRiskPanel;
