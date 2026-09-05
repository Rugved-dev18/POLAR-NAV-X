import React, { useState, useEffect } from 'react';

interface TopBarProps {
  onNavigateToLanding?: () => void;
}

/**
 * TopBar component displays top application branding, live UTC clock, LIVE status indicator,
 * and a subtle demo data badge note. Brand logo/title is clickable to return to Landing Page.
 */
export const TopBar: React.FC<TopBarProps> = ({ onNavigateToLanding }) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = monthNames[now.getUTCMonth()];
      const year = now.getUTCFullYear();

      setUtcTime(`${day} ${month} ${year} ${hours}:${minutes}:${seconds} UTC`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-bar">
      <div
        className="top-bar-left top-bar-left-clickable"
        onClick={onNavigateToLanding}
        title="Return to POLAR NAV-X Landing Page"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (onNavigateToLanding) onNavigateToLanding();
          }
        }}
      >
        <span className="app-logo">🌐</span>
        <h1 className="app-title">POLAR NAV-X</h1>
        <span className="app-subtitle">Antarctic Geospatial Command</span>
      </div>

      <div className="top-bar-right">
        <span className="demo-data-badge">Demo data — live feed integration pending</span>

        <div className="utc-clock">
          <span className="clock-icon">🕒</span>
          <span className="clock-text">{utcTime || '00:00:00 UTC'}</span>
        </div>

        <div className="live-indicator">
          <span className="pulsing-dot"></span>
          <span className="live-label">LIVE</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
