export interface Iceberg {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  status: string;
  sizeKm2?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const mockIcebergs: Iceberg[] = [
  {
    id: "ICE-001",
    name: "A-68A Fragment",
    latitude: -64.1466,
    longitude: -56.6418,
    status: "Drifting",
    sizeKm2: 4200,
    riskLevel: "HIGH"
  },
  {
    id: "ICE-002",
    name: "B-15 Sector A",
    latitude: -65.2500,
    longitude: -64.0000,
    status: "Drifting",
    sizeKm2: 1500,
    riskLevel: "MEDIUM"
  },
  {
    id: "ICE-003",
    name: "Ronne Shelf Alpha",
    latitude: -70.5000,
    longitude: -10.0000,
    status: "Stationary Shelf",
    sizeKm2: 850,
    riskLevel: "LOW"
  },
  {
    id: "ICE-004",
    name: "Gerlache Strait Hazard",
    latitude: -65.5000,
    longitude: -65.1000,
    status: "Calving Hazard",
    sizeKm2: 320,
    riskLevel: "HIGH"
  },
  {
    id: "ICE-005",
    name: "Marguerite Bay Drift",
    latitude: -67.1000,
    longitude: -67.8000,
    status: "Drifting",
    sizeKm2: 610,
    riskLevel: "MEDIUM"
  }
];
