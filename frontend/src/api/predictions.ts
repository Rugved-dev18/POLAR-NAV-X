import { API_BASE_URL } from '../config';

export interface IcebergPredictionResponse {
  iceberg_id: string;
  prediction_available: boolean;
  current_latitude?: number;
  current_longitude?: number;
  predicted_latitude?: number;
  predicted_longitude?: number;
  prediction_horizon_days?: number;
  model?: string;
  reason?: string;
}

export async function predictIceberg(
  icebergId: string
): Promise<IcebergPredictionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/icebergs/${encodeURIComponent(icebergId)}/predict`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error(`Prediction request failed (${response.status})`);
  }

  return (await response.json()) as IcebergPredictionResponse;
}
