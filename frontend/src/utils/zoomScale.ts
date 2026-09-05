import { useState, useEffect, useCallback } from 'react';
import { useMap } from 'react-leaflet';

/**
 * Custom React hook that computes a scaled pixel size relative to the map zoom level.
 * Size doubles roughly every 2 zoom levels in, halves every 2 zoom levels out, clamped between minSize and maxSize.
 */
export const useZoomScaledSize = (
  baseSize: number = 32,
  baseZoom: number = 5,
  minSize: number = 18,
  maxSize: number = 64
): number => {
  const map = useMap();

  const calculateSize = useCallback(
    (currentZoom: number): number => {
      const scaled = Math.round(baseSize * Math.pow(2, (currentZoom - baseZoom) / 2));
      return Math.min(Math.max(scaled, minSize), maxSize);
    },
    [baseSize, baseZoom, minSize, maxSize]
  );

  const [size, setSize] = useState<number>(() => calculateSize(map.getZoom()));

  useEffect(() => {
    const handleZoom = () => {
      const newSize = calculateSize(map.getZoom());
      setSize(newSize);
    };

    map.on('zoomend', handleZoom);
    map.on('zoom', handleZoom);

    return () => {
      map.off('zoomend', handleZoom);
      map.off('zoom', handleZoom);
    };
  }, [map, calculateSize]);

  return size;
};

export default useZoomScaledSize;
