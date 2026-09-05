import React from 'react';
import { IcebergMarker } from './IcebergMarker';
import { mockIcebergs, type Iceberg } from '../data/mockIceberg';

interface IcebergLayerProps {
  icebergs?: Iceberg[];
}

/**
 * IcebergLayer component groups and renders all tracked iceberg markers.
 */
export const IcebergLayer: React.FC<IcebergLayerProps> = ({ icebergs = mockIcebergs }) => {
  return (
    <>
      {icebergs.map((iceberg) => (
        <IcebergMarker key={iceberg.id} iceberg={iceberg} />
      ))}
    </>
  );
};

export default IcebergLayer;
