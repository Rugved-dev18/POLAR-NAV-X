import React from 'react';

/**
 * RiskLegend renders a compact floating legend card in the bottom-left of the map view,
 * explaining risk level color coding (Green = Low, Orange = Medium, Red = High).
 */
export const RiskLegend: React.FC = () => {
  return (
    <div className="risk-legend-card">
      <div className="legend-header">
        <span className="legend-title">RISK KEY</span>
      </div>
      <div className="legend-items">
        <div className="legend-item">
          <span className="legend-dot dot-low" />
          <span className="legend-label">Low Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-medium" />
          <span className="legend-label">Medium Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-high" />
          <span className="legend-label">High Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskLegend;
