import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Iceberg } from './IcebergMarker';
import { IcebergMarker } from './IcebergMarker';

// Hardcoded array of icebergs typed as Iceberg[] following the requested format.
// Contains real reference points in the southern polar region.
const initialIcebergs: Iceberg[] = [
  { id: "ICE-001", latitude: -64.1466, longitude: -56.6418, status: "Test Data" },
  { id: "ICE-002", latitude: -65.2500, longitude: -64.0000, status: "Drifting" },
  { id: "ICE-003", latitude: -70.5000, longitude: -10.0000, status: "Stationary Shelf" }
];

/**
 * AntarcticMap is the core map visualization container.
 * In this version, we map over the typed 'initialIcebergs' array to dynamically
 * render an <IcebergMarker> for each item inside the Leaflet <MapContainer>.
 */
export const AntarcticMap = () => {
  const center: [number, number] = [-75, 0];
  const zoom = 3;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* 
        In React, we use the Javascript .map() function on arrays to dynamically generate list elements.
        The 'key' attribute helps React optimize rendering when items change.
      */}
      {initialIcebergs.map((iceberg) => (
        <IcebergMarker key={iceberg.id} iceberg={iceberg} />
      ))}
    </MapContainer>
  );
};

export default AntarcticMap;
