// src/data/mockSeaIce.ts

export interface SeaIcePolygon {
  id: string;
  name: string;
  densityPercent: number;
  thicknessMeters: number;
  status: string;
  coordinates: [number, number][];
}

export const mockSeaIceAreas: SeaIcePolygon[] = [
  {
    id: 'ice-zone-1',
    name: 'Weddell Sea Dense Pack Ice',
    densityPercent: 85,
    thicknessMeters: 2.4,
    status: 'Heavy Pack Ice',
    coordinates: [
      [-63.2, -56.5],
      [-62.8, -54.0],
      [-63.5, -52.5],
      [-64.8, -53.2],
      [-65.1, -55.8],
      [-64.2, -57.1],
    ],
  },
  {
    id: 'ice-zone-2',
    name: 'Bransfield Shelf Fast Ice',
    densityPercent: 60,
    thicknessMeters: 1.2,
    status: 'Drift Ice & Floes',
    coordinates: [
      [-61.8, -53.5],
      [-61.2, -50.8],
      [-62.4, -49.5],
      [-63.1, -51.2],
      [-62.7, -53.8],
    ],
  },
  {
    id: 'ice-zone-3',
    name: 'Drake Passage Marginal Ice Zone',
    densityPercent: 40,
    thicknessMeters: 0.8,
    status: 'Marginal Open Pack',
    coordinates: [
      [-59.8, -52.0],
      [-59.1, -48.5],
      [-60.3, -47.2],
      [-60.9, -50.1],
    ],
  },
  {
    id: 'ice-zone-4',
    name: 'South Orkney Drift Belt',
    densityPercent: 70,
    thicknessMeters: 1.8,
    status: 'Consolidated Pack Ice',
    coordinates: [
      [-60.2, -46.5],
      [-59.8, -42.8],
      [-60.9, -41.5],
      [-61.5, -45.0],
    ],
  },
];

export default mockSeaIceAreas;
