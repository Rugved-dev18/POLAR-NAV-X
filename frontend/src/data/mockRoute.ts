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

// Polyline navigation path safely traversing around iceberg hazards
export const mockRouteCoordinates: [number, number][] = [
  [-64.7742, -64.0531], // Start: Palmer Station
  [-65.1000, -64.6000],
  [-65.6000, -65.2000],
  [-66.2000, -66.0000],
  [-66.8000, -67.1000],
  [-67.5700, -68.1300]  // Destination: Rothera Station
];

export const mockRoute: RouteData = {
  id: "ROUTE-NAV-101",
  name: "Peninsula Passage Alpha",
  distanceKm: 124.5,
  riskLevel: "LOW",
  status: "Recommended",
  estimatedTimeHours: 6.5,
  waypointsCount: mockRouteCoordinates.length,
  startLocation: mockStartPoint,
  destinationLocation: mockDestinationPoint,
  coordinates: mockRouteCoordinates
};
