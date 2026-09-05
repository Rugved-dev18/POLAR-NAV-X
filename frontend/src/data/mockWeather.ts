// src/data/mockWeather.ts

export interface WeatherMetrics {
  windSpeedKn: number;
  windDirection: string;
  visibilityKm: number;
  waveHeightM: number;
  stormWarning: boolean;
  weatherRiskScore: number; // 0 to 100
  seaTempC: number;
  airTempC: number;
  currentSpeedMs: number;
  currentDirectionDeg: number;
  iceDriftImpact: 'LOW' | 'MODERATE' | 'HIGH';
}

export const mockWeather: WeatherMetrics = {
  windSpeedKn: 28,
  windDirection: 'SSW',
  visibilityKm: 3.8,
  waveHeightM: 3.4,
  stormWarning: true,
  weatherRiskScore: 68,
  seaTempC: -1.4,
  airTempC: -5.2,
  currentSpeedMs: 0.42,
  currentDirectionDeg: 65,
  iceDriftImpact: 'HIGH',
};

export default mockWeather;
