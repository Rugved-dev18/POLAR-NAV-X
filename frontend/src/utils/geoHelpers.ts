/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula. Returns distance in kilometers (rounded to 1 decimal place).
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

/**
 * Linearly interpolates a series of N coordinates between start and destination lat/lng.
 */
export const interpolateRouteCoordinates = (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
  steps: number = 5
): [number, number][] => {
  const coords: [number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const lat = startLat + (destLat - startLat) * t;
    const lng = startLng + (destLng - startLng) * t;
    coords.push([Math.round(lat * 10000) / 10000, Math.round(lng * 10000) / 10000]);
  }
  return coords;
};
