// src/data/mockIceberg.ts
//
// Source: NASA Scatterometer Climate Record Pathfinder (BYU/NIC Antarctic Iceberg DB)
// Fetched via: https://raw.githubusercontent.com/Joel-hanson/Iceberg-locations/main/api/latest.json
// Snapshot: last_updated "08/18/26" (from source feed)
//
// lat/lng were converted from the source's DMS strings (e.g. "54 20'W") to decimal
// degrees — the source JSON's own "longitude"/"lattitude" fields are NOT valid decimal
// coordinates, do not use them directly.
//
// riskLevel, sizeKm2, and status are NOT provided by this data source (BYU/NIC only
// tracks position). They are placeholders until real risk-classification logic exists
// elsewhere in the project — replace when that's ready.

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
}

export const mockIcebergs: Iceberg[] = [
  { id: "A85", name: "Iceberg A85", latitude: -63.8167, longitude: -54.3333, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-08-16", source: "BYU/NIC SCP" },
  { id: "D33A", name: "Iceberg D33A", latitude: -63.6, longitude: -55.25, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-08-16", source: "BYU/NIC SCP" },
  { id: "D33B", name: "Iceberg D33B", latitude: -60.3333, longitude: -51.0167, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-08-16", source: "BYU/NIC SCP" },
  { id: "D33C", name: "Iceberg D33C", latitude: -62.2167, longitude: -54.7, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-07-30", source: "BYU/NIC SCP" },
  { id: "A81", name: "Iceberg A81", latitude: -59.05, longitude: -51.1833, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-08-16", source: "BYU/NIC SCP" },
  { id: "A83", name: "Iceberg A83", latitude: -61.1, longitude: -50.5333, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-08-16", source: "BYU/NIC SCP" },
  { id: "D30B", name: "Iceberg D30B", latitude: -60.5667, longitude: -45.7167, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-08-16", source: "BYU/NIC SCP" },
  { id: "D32", name: "Iceberg D32", latitude: -58.75, longitude: -37.3667, status: "Tracked", sizeKm2: null, riskLevel: "MEDIUM", lastObserved: "2026-08-16", source: "BYU/NIC SCP" }
];

export default mockIcebergs;
