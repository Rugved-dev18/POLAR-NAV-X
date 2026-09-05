"""Request/response schemas for the trajectory prediction API."""

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
