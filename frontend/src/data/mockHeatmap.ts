export type HeatPoint = [number, number, number]; // [latitude, longitude, intensity (0.0 to 1.0)]

/**
 * Mock Heatmap Data representing iceberg concentration density and navigation hazard clusters
 * around the Antarctic Peninsula, Weddell Sea, and Drake Passage.
 * 
 * Designed to be replaced seamlessly with a real backend API payload e.g. GET /api/v1/heatmap/icebergs
 */
export const mockHeatmapPoints: HeatPoint[] = [
  // High Risk Cluster 1: Weddell Sea Iceberg Alley (around Icebergs A85, D33A, D33B)
  [-63.8167, -54.3333, 0.95],
  [-63.8500, -54.3000, 0.90],
  [-63.7800, -54.4000, 0.85],
  [-64.1667, -53.8333, 0.88],
  [-64.2000, -53.8000, 0.82],
  [-64.1000, -53.9000, 0.75],
  [-64.2500, -53.5000, 0.92],
  [-64.3000, -53.4500, 0.85],
  [-64.0000, -54.1000, 0.78],

  // Moderate Risk Cluster 2: Bransfield Strait & Elephant Island
  [-62.1000, -58.2000, 0.70],
  [-62.1500, -58.1000, 0.65],
  [-62.0500, -58.3000, 0.60],
  [-61.8000, -55.2000, 0.80],
  [-61.7500, -55.3000, 0.75],

  // Cluster 3: South Weddell Sea Iceberg Drift Field (Icebergs A81, A83, D30B)
  [-66.1500, -57.4833, 0.88],
  [-66.2000, -57.5000, 0.82],
  [-66.1000, -57.4000, 0.75],
  [-67.8500, -60.1167, 0.90],
  [-67.9000, -60.1000, 0.85],
  [-67.8000, -60.2000, 0.80],
  [-65.5000, -52.2833, 0.70],
  [-65.5500, -52.2000, 0.65],

  // Cluster 4: Gerlache Strait & Anvers Passage (around Iceberg D32)
  [-64.5000, -62.9000, 0.60],
  [-64.5500, -63.0000, 0.65],
  [-64.7500, -63.7500, 0.78],
  [-64.7000, -63.7000, 0.72],

  // Outer Drake Passage Drift Points
  [-61.5000, -63.0000, 0.45],
  [-60.8000, -60.5000, 0.50],
  [-60.2000, -58.0000, 0.40],
  [-62.8000, -66.0000, 0.55],
  [-63.4000, -65.2000, 0.58],

  // Coastal Marginal Ice Zones
  [-65.1000, -64.6000, 0.50],
  [-65.6000, -65.2000, 0.52],
  [-66.2000, -66.0000, 0.55],
  [-66.8000, -67.1000, 0.48],
];

export default mockHeatmapPoints;
