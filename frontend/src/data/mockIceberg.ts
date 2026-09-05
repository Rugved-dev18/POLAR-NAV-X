// src/data/mockIceberg.ts
//
// Source: NASA Scatterometer Climate Record Pathfinder (BYU/NIC Antarctic Iceberg DB)
// Fetched via: https://raw.githubusercontent.com/Joel-hanson/Iceberg-locations/main/api/latest.json
// Snapshot: last_updated "08/18/26" (from source feed)

export interface Iceberg {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  status: string;
  sizeKm2?: number | null;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastObserved?: string;
  source?: string;
  // Step 3 Extended Fields:
  currentStatus: 'Drifting' | 'Stationary' | 'Calving' | 'Grounded';
  velocityMs: number;
  direction: string;
  predictedPosition24h: {
    latitude: number;
    longitude: number;
  };
}

export const mockIcebergs: Iceberg[] = [
  {
    id: "A85",
    name: "Iceberg A85",
    latitude: -63.8167,
    longitude: -54.3333,
    status: "Tracked",
    sizeKm2: 1250,
    riskLevel: "HIGH",
    lastObserved: "2026-08-16",
    source: "BYU/NIC SCP",
    currentStatus: "Drifting",
    velocityMs: 0.45,
    direction: "NE",
    predictedPosition24h: { latitude: -63.62, longitude: -54.10 },
  },
  {
    id: "D33A",
    name: "Iceberg D33A",
    latitude: -63.6,
    longitude: -55.25,
    status: "Tracked",
    sizeKm2: 840,
    riskLevel: "MEDIUM",
    lastObserved: "2026-08-16",
    source: "BYU/NIC SCP",
    currentStatus: "Drifting",
    velocityMs: 0.32,
    direction: "ENE",
    predictedPosition24h: { latitude: -63.48, longitude: -54.95 },
  },
  {
    id: "D33B",
    name: "Iceberg D33B",
    latitude: -60.3333,
    longitude: -51.0167,
    status: "Tracked",
    sizeKm2: 410,
    riskLevel: "LOW",
    lastObserved: "2026-08-16",
    source: "BYU/NIC SCP",
    currentStatus: "Stationary",
    velocityMs: 0.12,
    direction: "E",
    predictedPosition24h: { latitude: -60.31, longitude: -50.92 },
  },
  {
    id: "D33C",
    name: "Iceberg D33C",
    latitude: -62.2167,
    longitude: -54.7,
    status: "Tracked",
    sizeKm2: 670,
    riskLevel: "HIGH",
    lastObserved: "2026-07-30",
    source: "BYU/NIC SCP",
    currentStatus: "Calving",
    velocityMs: 0.58,
    direction: "NE",
    predictedPosition24h: { latitude: -61.98, longitude: -54.42 },
  },
  {
    id: "A81",
    name: "Iceberg A81",
    latitude: -59.05,
    longitude: -51.1833,
    status: "Tracked",
    sizeKm2: 1560,
    riskLevel: "MEDIUM",
    lastObserved: "2026-08-16",
    source: "BYU/NIC SCP",
    currentStatus: "Drifting",
    velocityMs: 0.38,
    direction: "NNE",
    predictedPosition24h: { latitude: -58.88, longitude: -51.02 },
  },
  {
    id: "A83",
    name: "Iceberg A83",
    latitude: -61.1,
    longitude: -50.5333,
    status: "Tracked",
    sizeKm2: 920,
    riskLevel: "MEDIUM",
    lastObserved: "2026-08-16",
    source: "BYU/NIC SCP",
    currentStatus: "Drifting",
    velocityMs: 0.28,
    direction: "NE",
    predictedPosition24h: { latitude: -60.96, longitude: -50.35 },
  },
  {
    id: "D30B",
    name: "Iceberg D30B",
    latitude: -60.5667,
    longitude: -45.7167,
    status: "Tracked",
    sizeKm2: 310,
    riskLevel: "LOW",
    lastObserved: "2026-08-16",
    source: "BYU/NIC SCP",
    currentStatus: "Grounded",
    velocityMs: 0.05,
    direction: "SE",
    predictedPosition24h: { latitude: -60.58, longitude: -45.68 },
  },
  {
    id: "D32",
    name: "Iceberg D32",
    latitude: -58.75,
    longitude: -37.3667,
    status: "Tracked",
    sizeKm2: 780,
    riskLevel: "MEDIUM",
    lastObserved: "2026-08-16",
    source: "BYU/NIC SCP",
    currentStatus: "Drifting",
    velocityMs: 0.41,
    direction: "E",
    predictedPosition24h: { latitude: -58.72, longitude: -37.10 },
  },
];

export default mockIcebergs;
