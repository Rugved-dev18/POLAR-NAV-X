export interface RoutePoint {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface RouteData {
  id: string;
  name: string;
  distanceKm: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'Recommended' | 'Caution' | 'Blocked';
  estimatedTimeHours: number;
  waypointsCount: number;
  startLocation: RoutePoint;
  destinationLocation: RoutePoint;
  coordinates: [number, number][];
}

export const mockStartPoint: RoutePoint = {
  name: "Palmer Station Base",
  latitude: -64.7742,
  longitude: -64.0531,
  description: "Starting polar departure coordinate"
};

export const mockDestinationPoint: RoutePoint = {
  name: "Rothera Research Station",
  latitude: -67.5700,
  longitude: -68.1300,
  description: "Target polar station destination coordinate"
};

// Route 1: Peninsula Passage Alpha (Direct Optimal Path)
export const routeAlphaCoordinates: [number, number][] = [
  [-64.7742, -64.0531],
  [-65.1000, -64.6000],
  [-65.6000, -65.2000],
  [-66.2000, -66.0000],
  [-66.8000, -67.1000],
  [-67.5700, -68.1300]
];

// Route 2: Weddell Sea Outer Detour (Wide Berth Bypass)
export const routeBetaCoordinates: [number, number][] = [
  [-64.7742, -64.0531],
  [-64.3000, -62.5000],
  [-65.0000, -60.8000],
  [-66.2000, -62.0000],
  [-67.1000, -65.5000],
  [-67.5700, -68.1300]
];

// Route 3: Drake Coastal Shortcut (High Speed / Iceberg Proximity Pass)
export const routeGammaCoordinates: [number, number][] = [
  [-64.7742, -64.0531],
  [-65.4000, -64.1000],
  [-66.0000, -64.9000],
  [-66.9000, -66.4000],
  [-67.5700, -68.1300]
];

export const mockRoutes: RouteData[] = [
  {
    id: "route-alpha",
    name: "Peninsula Passage Alpha",
    distanceKm: 124.5,
    riskLevel: "LOW",
    status: "Recommended",
    estimatedTimeHours: 6.5,
    waypointsCount: routeAlphaCoordinates.length,
    startLocation: mockStartPoint,
    destinationLocation: mockDestinationPoint,
    coordinates: routeAlphaCoordinates
  },
  {
    id: "route-beta",
    name: "Weddell Outer Detour",
    distanceKm: 158.2,
    riskLevel: "LOW",
    status: "Recommended",
    estimatedTimeHours: 8.2,
    waypointsCount: routeBetaCoordinates.length,
    startLocation: mockStartPoint,
    destinationLocation: mockDestinationPoint,
    coordinates: routeBetaCoordinates
  },
  {
    id: "route-gamma",
    name: "Drake Coastal Pass",
    distanceKm: 98.4,
    riskLevel: "HIGH",
    status: "Caution",
    estimatedTimeHours: 4.8,
    waypointsCount: routeGammaCoordinates.length,
    startLocation: mockStartPoint,
    destinationLocation: mockDestinationPoint,
    coordinates: routeGammaCoordinates
  }
];

// Default selected route for backward compatibility
export const mockRouteCoordinates = routeAlphaCoordinates;
export const mockRoute: RouteData = mockRoutes[0];
