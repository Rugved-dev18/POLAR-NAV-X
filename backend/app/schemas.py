"""Request/response schemas for the trajectory prediction API."""

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PredictionRequest(BaseModel):
    """The 16 features the XGBoost models were trained on."""

    model_config = ConfigDict(extra="forbid")

    latitude: float = Field(..., ge=-90, le=90, description="Current latitude in degrees")
    longitude: float = Field(..., ge=-180, le=180, description="Current longitude in degrees")
    previous_latitude: float = Field(..., ge=-90, le=90)
    previous_longitude: float = Field(..., ge=-180, le=180)
    delta_latitude: float
    delta_longitude_wrapped: float
    time_difference: float
    speed: float
    lat_velocity: float
    lon_velocity: float
    movement_distance_deg: float
    movement_rate_deg_per_day: float
    year: int = Field(..., ge=1900, le=2100)
    month: int = Field(..., ge=1, le=12)
    day_of_year: int = Field(..., ge=1, le=366)
    target_time_difference: float = Field(..., description="Days ahead to forecast")


class PredictionResponse(BaseModel):
    predicted_latitude: float
    predicted_longitude: float


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


class Iceberg(BaseModel):
    """A single normalized iceberg observation from the upstream ice centre."""

    id: str = Field(..., description="Iceberg designator, e.g. 'A23A'")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    length_nm: Optional[float] = Field(None, description="Length in nautical miles")
    width_nm: Optional[float] = Field(None, description="Width in nautical miles")
    last_updated: Optional[date] = Field(None, description="Observation/update date")
    source: str = Field(..., description="Upstream source the record came from")


class IcebergPredictionResponse(BaseModel):
    """XGBoost 24-hour prediction result for a live iceberg, or an unavailable reason."""

    iceberg_id: str
    prediction_available: bool
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    predicted_latitude: Optional[float] = None
    predicted_longitude: Optional[float] = None
    prediction_horizon_days: Optional[float] = None
    model: Optional[str] = None
    reason: Optional[str] = None
