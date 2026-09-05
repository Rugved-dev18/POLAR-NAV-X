import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AntarcticMap from './components/AntarcticMap';
import TopBar from './components/TopBar';
import NavigationPanel from './components/NavigationPanel';
import IcebergDetailPanel from './components/IcebergDetailPanel';
import WeatherRiskPanel from './components/WeatherRiskPanel';
import OceanCurrentWeatherPanel from './components/OceanCurrentWeatherPanel';
import { mockRoutes, type RouteData } from './data/mockRoute';
import { mockIcebergs, type Iceberg } from './data/mockIceberg';
import { type LayerVisibilityState } from './components/MapLayerControl';

/**
 * App component functions as the root container, managing view state ('landing' | 'dashboard')
 * and dashboard shell layout.
 *
 * NOTE ON STATE PRESERVATION:
 * Dashboard state (custom routes, active route selection, selected iceberg, layer toggles)
 * is maintained at the App component level. Toggling between 'landing' and 'dashboard' views
 * preserves all user selections seamlessly without resetting.
 */
function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  const [isLeftOpen, setIsLeftOpen] = useState<boolean>(true);
  const [isRightOpen, setIsRightOpen] = useState<boolean>(true);

  // Shared route state across Left Navigation Panel and Map Layer
  const [routes, setRoutes] = useState<RouteData[]>(mockRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(mockRoutes[0].id);

  // Shared selected iceberg state across Map and Right Details Panel
  const [selectedIcebergId, setSelectedIcebergId] = useState<string | null>(null);

  const selectedIceberg = mockIcebergs.find((i) => i.id === selectedIcebergId) || null;

  // Shared layer visibility state across map layers and MapLayerControl
  const [layers, setLayers] = useState<LayerVisibilityState>({
    icebergs: true,
    heatmap: true,
    seaIce: true,
    oceanCurrents: true,
    route: true,
    startDestination: true,
  });

  const handleToggleLayer = (layerKey: keyof LayerVisibilityState) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleAddAndSelectRoute = (newRoute: RouteData) => {
    setRoutes((prev) => [newRoute, ...prev]);
    setSelectedRouteId(newRoute.id);
  };

  const handleSelectIceberg = (iceberg: Iceberg) => {
    setSelectedIcebergId(iceberg.id);
    setIsRightOpen(true); // Automatically expand right sidebar if collapsed when marker clicked
  };

  if (currentView === 'landing') {
    return <LandingPage onEnterDashboard={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="dashboard-container">
      {/* 48px Top Navigation Command Bar (Brand Logo/Title clicks back to Landing Page) */}
      <TopBar onNavigateToLanding={() => setCurrentView('landing')} />

      {/* Main 3-Column Body Shell */}
      <div className="dashboard-body">
        {/* LEFT COLUMN (~300px) */}
        <aside className={`sidebar sidebar-left ${isLeftOpen ? 'open' : 'collapsed'}`}>
          <button
            className="sidebar-toggle-btn toggle-left"
            onClick={() => setIsLeftOpen(!isLeftOpen)}
            aria-label={isLeftOpen ? 'Collapse Left Sidebar' : 'Expand Left Sidebar'}
            title={isLeftOpen ? 'Collapse Navigation Control' : 'Expand Navigation Control'}
          >
            {isLeftOpen ? '◀' : '▶'}
          </button>

          {isLeftOpen && (
            <div className="sidebar-inner">
              <div className="sidebar-header">
                <span className="sidebar-header-icon">🧭</span>
                <h3>NAVIGATION CONTROL</h3>
              </div>
              <NavigationPanel
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRouteId={setSelectedRouteId}
                onAddAndSelectRoute={handleAddAndSelectRoute}
                layers={layers}
                onToggleLayer={handleToggleLayer}
              />
            </div>
          )}
        </aside>

        {/* CENTER COLUMN (Flex Grow Map - fully clear of floating overlays) */}
        <main className="dashboard-center">
          <AntarcticMap
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRouteId={setSelectedRouteId}
            layers={layers}
            isLeftOpen={isLeftOpen}
            isRightOpen={isRightOpen}
            selectedIcebergId={selectedIcebergId}
            onSelectIceberg={handleSelectIceberg}
          />
        </main>

        {/* RIGHT COLUMN (~320px) */}
        <aside className={`sidebar sidebar-right ${isRightOpen ? 'open' : 'collapsed'}`}>
          <button
            className="sidebar-toggle-btn toggle-right"
            onClick={() => setIsRightOpen(!isRightOpen)}
            aria-label={isRightOpen ? 'Collapse Right Sidebar' : 'Expand Right Sidebar'}
            title={isRightOpen ? 'Collapse Details' : 'Expand Details'}
          >
            {isRightOpen ? '▶' : '◀'}
          </button>

          {isRightOpen && (
            <div className="sidebar-inner sidebar-details-stack">
              <div className="sidebar-header">
                <span className="sidebar-header-icon">📊</span>
                <h3>DETAILS</h3>
              </div>

              {/* 1. Iceberg Telemetry Card (or placeholder) */}
              <IcebergDetailPanel
                selectedIceberg={selectedIceberg}
                onClose={() => setSelectedIcebergId(null)}
              />

              <div className="sidebar-card-divider" />

              {/* 2. Weather Risk Assessment Card */}
              <WeatherRiskPanel />

              <div className="sidebar-card-divider" />

              {/* 3. Ocean & Environmental Metrics Card */}
              <OceanCurrentWeatherPanel />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;
