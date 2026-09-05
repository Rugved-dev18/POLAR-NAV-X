// src/data/mockOceanCurrents.ts

export interface OceanCurrentPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  speedKnots: number;
  directionDeg: number; // 0..360 (0 = North, 90 = East, 180 = South, 270 = West)
}

export const mockOceanCurrentPoints: OceanCurrentPoint[] = [
  // Antarctic Circumpolar Current (ACC) Flow Vector Field (West-to-East / ENE drift)
  { id: 'curr-1', name: 'ACC Main Stream', latitude: -57.5, longitude: -64.0, speedKnots: 2.8, directionDeg: 80 },
  { id: 'curr-2', name: 'ACC Main Stream', latitude: -57.2, longitude: -58.0, speedKnots: 3.1, directionDeg: 85 },
  { id: 'curr-3', name: 'ACC Main Stream', latitude: -57.8, longitude: -52.0, speedKnots: 2.9, directionDeg: 75 },
  { id: 'curr-4', name: 'ACC Main Stream', latitude: -57.1, longitude: -45.0, speedKnots: 3.4, directionDeg: 90 },
  { id: 'curr-5', name: 'ACC Main Stream', latitude: -56.8, longitude: -38.0, speedKnots: 2.6, directionDeg: 95 },

  // Drake Passage Polar Front Jet
  { id: 'curr-6', name: 'Drake Passage Jet', latitude: -59.2, longitude: -65.0, speedKnots: 3.5, directionDeg: 105 },
  { id: 'curr-7', name: 'Drake Passage Jet', latitude: -58.8, longitude: -59.0, speedKnots: 3.2, directionDeg: 110 },
  { id: 'curr-8', name: 'Drake Passage Jet', latitude: -59.5, longitude: -53.0, speedKnots: 3.0, directionDeg: 100 },
  { id: 'curr-9', name: 'Drake Passage Jet', latitude: -58.9, longitude: -47.0, speedKnots: 2.7, directionDeg: 95 },

  // Bransfield Strait Regional Current
  { id: 'curr-10', name: 'Bransfield Flow', latitude: -63.5, longitude: -61.0, speedKnots: 1.6, directionDeg: 65 },
  { id: 'curr-11', name: 'Bransfield Flow', latitude: -62.8, longitude: -57.0, speedKnots: 1.8, directionDeg: 70 },
  { id: 'curr-12', name: 'Bransfield Flow', latitude: -62.1, longitude: -53.0, speedKnots: 1.5, directionDeg: 60 },

  // Weddell Gyre Coastal Branch (SW-to-NE Circulation)
  { id: 'curr-13', name: 'Weddell Gyre Jet', latitude: -65.2, longitude: -54.0, speedKnots: 2.1, directionDeg: 35 },
  { id: 'curr-14', name: 'Weddell Gyre Jet', latitude: -64.1, longitude: -50.0, speedKnots: 2.4, directionDeg: 45 },
  { id: 'curr-15', name: 'Weddell Gyre Jet', latitude: -62.9, longitude: -46.0, speedKnots: 2.2, directionDeg: 50 },
  { id: 'curr-16', name: 'Weddell Gyre Jet', latitude: -61.5, longitude: -42.0, speedKnots: 1.9, directionDeg: 55 },

  // South Orkney Shelf Drift
  { id: 'curr-17', name: 'Orkney Drift', latitude: -60.4, longitude: -48.0, speedKnots: 2.0, directionDeg: 75 },
  { id: 'curr-18', name: 'Orkney Drift', latitude: -59.8, longitude: -41.0, speedKnots: 2.3, directionDeg: 80 },
];

export default mockOceanCurrentPoints;
