import React from 'react';
import { type Iceberg } from '../data/mockIceberg';

interface IcebergDetailPanelProps {
  selectedIceberg: Iceberg | null;
  onClose: () => void;
  onPredict?: (iceberg: Iceberg) => void;
  predictionLoading?: boolean;
  predictionError?: string | null;
}

export const IcebergDetailPanel: React.FC<IcebergDetailPanelProps> = ({
  selectedIceberg,
  onClose,
  onPredict,
  predictionLoading,
  predictionError,
}) => {
  if (!selectedIceberg) {
    return (
      <div className="sidebar-placeholder">
        <span className="placeholder-text">Select an iceberg marker on the map to view detailed telemetry.</span>
      </div>
    );
  }

  const riskClass = `risk-${(selectedIceberg.riskLevel ?? 'LOW').toLowerCase()}`;
  const displayStatus = selectedIceberg.currentStatus || selectedIceberg.status;

  return (
    <div className="iceberg-detail-panel">
      {/* Header with Title, Risk Badge, and Close Button */}
      <div className="panel-top-row">
        <div className="title-group">
          <span className="panel-header-icon">🧊</span>
          <h4>{selectedIceberg.name || selectedIceberg.id}</h4>
        </div>
        <div className="header-actions">
          <span className={`risk-badge ${riskClass}`}>{selectedIceberg.riskLevel || 'N/A'}</span>
          <button className="close-panel-btn" onClick={onClose} title="Deselect iceberg">
            ✕
          </button>
        </div>
      </div>

      {/* Main Telemetry Metric Rows */}
      <div className="detail-rows">
        <div className="detail-row">
          <span className="detail-label">Iceberg ID:</span>
          <span className="detail-value highlight">{selectedIceberg.id}</span>
        </div>

        {displayStatus && (
          <div className="detail-row">
            <span className="detail-label">Current Status:</span>
            <span className="detail-value status-tag">{displayStatus}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Latitude:</span>
          <span className="detail-value">{selectedIceberg.latitude.toFixed(4)}° S</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Longitude:</span>
          <span className="detail-value">{selectedIceberg.longitude.toFixed(4)}° W</span>
        </div>

        {selectedIceberg.lengthNm != null && (
          <div className="detail-row">
            <span className="detail-label">Length:</span>
            <span className="detail-value">{selectedIceberg.lengthNm} NM</span>
          </div>
        )}

        {selectedIceberg.widthNm != null && (
          <div className="detail-row">
            <span className="detail-label">Width:</span>
            <span className="detail-value">{selectedIceberg.widthNm} NM</span>
          </div>
        )}

        {selectedIceberg.velocityMs != null && (
          <div className="detail-row">
            <span className="detail-label">Drift Velocity:</span>
            <span className="detail-value">{selectedIceberg.velocityMs} m/s</span>
          </div>
        )}

        {selectedIceberg.direction && (
          <div className="detail-row">
            <span className="detail-label">Direction:</span>
            <span className="detail-value compass-heading">{selectedIceberg.direction}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Estimated Size:</span>
          <span className="detail-value">
            {selectedIceberg.sizeKm2 ? `${selectedIceberg.sizeKm2} km²` : 'N/A'}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Last Observed:</span>
          <span className="detail-value">{selectedIceberg.lastObserved || 'Recent'}</span>
        </div>

        {selectedIceberg.source && (
          <div className="detail-row">
            <span className="detail-label">Source:</span>
            <span className="detail-value">{selectedIceberg.source}</span>
          </div>
        )}

        {onPredict && (
          <div className="detail-row" style={{ marginTop: '8px' }}>
            <button
              className="predict-btn"
              onClick={() => onPredict(selectedIceberg)}
              disabled={predictionLoading}
              aria-label="Predict 24-hour iceberg trajectory"
            >
              {predictionLoading ? 'Predicting trajectory…' : 'Predict 24h'}
            </button>
          </div>
        )}

        {predictionError && (
          <div className="prediction-status error">{predictionError}</div>
        )}
      </div>

      {/* 24-Hour Position Prediction Subsection */}
      {selectedIceberg.predictedPosition24h && (
        <div className="prediction-subsection">
          <div className="subsection-header">
            <span className="subsection-icon">🎯</span>
            <h5>PREDICTED POSITION · 24H</h5>
          </div>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-label">Pred. Latitude:</span>
              <span className="detail-value pred-val">
                {selectedIceberg.predictedPosition24h.latitude.toFixed(4)}° S
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Pred. Longitude:</span>
              <span className="detail-value pred-val">
                {selectedIceberg.predictedPosition24h.longitude.toFixed(4)}° W
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IcebergDetailPanel;
