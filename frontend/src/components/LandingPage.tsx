import React from 'react';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Asim Malik', role: 'Frontend Developer', initials: 'AM' },
  { name: 'Rugved Narkar', role: 'Backend Developer', initials: 'RN' },
  { name: 'Sarthak Wawre', role: 'AI/ML', initials: 'SW' },
  { name: 'Maithili Patil', role: 'Team Member', initials: 'MP' },
  { name: 'Siddhant Khedekar', role: 'Team Member', initials: 'SK' },
  { name: 'Sakib Shaikh', role: 'Team Member', initials: 'SS' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  return (
    <div className="landing-container">
      {/* Top Header Navigation */}
      <header className="landing-top-bar">
        <div className="top-bar-left">
          <svg className="app-logo-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span className="landing-brand-title">POLAR NAV-X</span>
        </div>
        <div className="top-bar-right">
          <button className="top-bar-enter-btn" onClick={onEnterDashboard}>
            Launch Console 🚀
          </button>
        </div>
      </header>

      {/* Main Full-Width Scrollable Main Area */}
      <main className="landing-main-content">
        {/* 1. HERO SECTION */}
        <section className="landing-hero-section">
          <div className="section-inner hero-inner">
            <h1 className="hero-title">POLAR NAV-X</h1>
            <p className="hero-tagline">
              Antarctic Sea-Ice, Iceberg Trajectory & Navigation Decision Support System
            </p>
            <p className="hero-description">
              Next-generation polar geospatial intelligence platform engineering real-time sea-ice pack forecasting,
              24-hour iceberg drift prediction vectors, and automated risk-minimized route optimization for research vessels navigating extreme Antarctic waters.
            </p>
          </div>
        </section>

        {/* 2. FEATURE HIGHLIGHTS SECTION */}
        <section className="landing-section section-features">
          <div className="section-inner">
            <div className="feature-grid">
              <div className="feature-card">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 22h20L12 2z" />
                    <path d="M12 6l5 10H7l5-10z" />
                  </svg>
                </div>
                <div className="feature-info">
                  <h4 className="feature-title">Live Iceberg Tracking</h4>
                  <p className="feature-desc">Telemetry drift velocity & 24h prediction vectors</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <div className="feature-info">
                  <h4 className="feature-title">AI Route Optimization</h4>
                  <p className="feature-desc">Haversine waypoint navigation & risk avoidance</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
                    <polyline points="13 11 9 17 15 17 11 23" />
                  </svg>
                </div>
                <div className="feature-info">
                  <h4 className="feature-title">Weather & Risk Assessment</h4>
                  <p className="feature-desc">Wind, wave height, storm watch & risk index meter</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                  </svg>
                </div>
                <div className="feature-info">
                  <h4 className="feature-title">Sea-Ice & Ocean Dynamics</h4>
                  <p className="feature-desc">Pack ice extent boundaries & current vector fields</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THE PROBLEM SECTION */}
        <section className="landing-section section-problem">
          <div className="section-inner">
            <h3 className="section-heading">The Problem</h3>
            <div className="problem-grid">
              <div className="problem-card">
                <div className="svg-icon-wrapper red-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4 className="problem-title">Unpredictable Drift</h4>
                <p className="problem-desc">Icebergs shift course daily, making static maps obsolete</p>
              </div>

              <div className="problem-card">
                <div className="svg-icon-wrapper red-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </div>
                <h4 className="problem-title">Manual Route Planning</h4>
                <p className="problem-desc">Traditional navigation can't react to real-time ice movement</p>
              </div>

              <div className="problem-card">
                <div className="svg-icon-wrapper red-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  </svg>
                </div>
                <h4 className="problem-title">High-Risk Waters</h4>
                <p className="problem-desc">Antarctic vessels operate with limited early-warning systems</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS PIPELINE SECTION */}
        <section className="landing-section section-pipeline">
          <div className="section-inner">
            <h3 className="section-heading">How It Works</h3>
            <div className="pipeline-row">
              <div className="pipeline-step">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10" />
                    <path d="M12 12L2.5 2.5" />
                    <path d="M20 4l-4 4" />
                  </svg>
                </div>
                <h4 className="pipeline-title">Satellite & Ocean Data</h4>
                <p className="pipeline-desc">Multi-source polar sensor telemetry ingestion</p>
              </div>

              <div className="pipeline-arrow-container">
                <svg className="pulse-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="pipeline-step">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                    <line x1="20" y1="9" x2="23" y2="9" />
                    <line x1="20" y1="15" x2="23" y2="15" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                    <line x1="1" y1="15" x2="4" y2="15" />
                  </svg>
                </div>
                <h4 className="pipeline-title">AI Prediction</h4>
                <p className="pipeline-desc">Sea-ice forecast & 24h iceberg drift vectors</p>
              </div>

              <div className="pipeline-arrow-container">
                <svg className="pulse-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="pipeline-step">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="3" x2="6" y2="15" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M18 9a9 9 0 0 1-9 9" />
                  </svg>
                </div>
                <h4 className="pipeline-title">Route Optimization</h4>
                <p className="pipeline-desc">A* pathfinding & dynamic risk avoidance</p>
              </div>

              <div className="pipeline-arrow-container">
                <svg className="pulse-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="pipeline-step">
                <div className="svg-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 21h20" />
                    <path d="M19.38 20A9 9 0 0 0 12 12a9 9 0 0 0-7.38 8" />
                    <path d="M12 12V3l4 3-4 3" />
                  </svg>
                </div>
                <h4 className="pipeline-title">Safe Navigation</h4>
                <p className="pipeline-desc">Optimal waypoints & real-time risk alerts</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. KEY METRICS STRIP */}
        <section className="landing-section section-metrics">
          <div className="section-inner">
            <div className="metrics-strip">
              <div className="metric-card">
                <span className="metric-number">8</span>
                <span className="metric-label">Icebergs Tracked</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-card">
                <span className="metric-number">4</span>
                <span className="metric-label">Active Risk Zones</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-card">
                <span className="metric-number">24H</span>
                <span className="metric-label">Prediction Window</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-card">
                <span className="metric-number">3</span>
                <span className="metric-label">Route Options</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TECH STACK STRIP */}
        <section className="landing-section section-tech">
          <div className="section-inner">
            <h4 className="tech-stack-heading">Built With</h4>
            <div className="tech-pills-row">
              <div className="tech-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
                  <circle cx="12" cy="12" r="1.5" fill="#38bdf8" />
                </svg>
                <span>React</span>
              </div>

              <div className="tech-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>TypeScript</span>
              </div>

              <div className="tech-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                <span>Leaflet</span>
              </div>

              <div className="tech-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>FastAPI</span>
              </div>

              <div className="tech-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
                  <path d="M8 12l3 3 5-5" />
                </svg>
                <span>Python</span>
              </div>

              <div className="tech-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20M5.05 5.05l13.9 13.9M5.05 18.95l13.9-13.9" />
                </svg>
                <span>Machine Learning</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. MEET THE TEAM SECTION */}
        <section className="landing-section section-team">
          <div className="section-inner">
            <div className="team-header">
              <h3 className="team-title">Meet the Team</h3>
              <p className="team-subtitle">The team behind POLAR NAV-X</p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member) => (
                <div className="team-card" key={member.name}>
                  <div className="avatar-ring">
                    <div className="avatar-circle">
                      <span className="avatar-initials">{member.initials}</span>
                    </div>
                  </div>
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-role">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CALL TO ACTION SECTION */}
        <section className="landing-section section-cta">
          <div className="section-inner cta-inner">
            <button className="launch-console-btn" onClick={onEnterDashboard}>
              <span>🚀 Launch Console</span>
            </button>
          </div>
        </section>
      </main>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <span>POLAR NAV-X &bull; Polar Navigation & Geospatial Safety</span>
      </footer>
    </div>
  );
};

export default LandingPage;
