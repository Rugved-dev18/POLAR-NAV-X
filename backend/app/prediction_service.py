"""Build 24-hour XGBoost trajectory predictions for live iceberg observations.

The service reads the historical training ZIP once, caches it by iceberg ID,
looks up the most recent historical observation before a live record, and
constructs the exact 16-feature vector the models expect.
"""

import logging
import math
import sys
from datetime import date, datetime
from pathlib import Path

import numpy as np
import pandas as pd

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "ml"))

from features import wrap_longitude  # noqa: E402
from app.iceberg_service import IcebergDataError, iceberg_service  # noqa: E402
from app.model_service import ModelLoadError, model_service  # noqa: E402

logger = logging.getLogger(__name__)

TRAINING_ZIP = REPO_ROOT / "data" / "processed" / "PolarNavX_XGBoost_Training.zip"
EARTH_RADIUS_KM = 6371.0
REQUIRED_LIVE_FIELDS = {"id", "latitude", "longitude"}


class PredictionNotAvailableError(ValueError):
    """Raised when a prediction cannot be produced without fabricating data."""

    def __init__(self, reason: str):
        self.reason = reason
        super().__init__(reason)


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in kilometres between two lat/lon points."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c


def _to_python_date(value) -> date | None:
    """Normalize a date-like value to a Python date."""
    if value is None or pd.isna(value):
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        try:
            return date.fromisoformat(value)
        except Exception:
            try:
                return pd.to_datetime(value).date()
            except Exception:
                return None
    return None


class PredictionService:
    """Loads historical observations and produces XGBoost predictions for live icebergs."""

    def __init__(self, training_zip_path: Path = TRAINING_ZIP):
        self._training_zip = Path(training_zip_path)
        self._by_iceberg: dict[str, pd.DataFrame] = {}
        self._loaded = False

    def _load(self):
        if self._loaded:
            return

        if not self._training_zip.is_file():
            raise PredictionNotAvailableError(
                f"Historical training data not found: {self._training_zip}"
            )

        logger.info("Loading historical iceberg training data...")
        df = pd.read_csv(
            self._training_zip,
            compression="zip",
            parse_dates=["date"],
        )

        if "iceberg_id" not in df.columns:
            raise PredictionNotAvailableError(
                "Historical dataset is missing the iceberg_id column"
            )

        df = df.sort_values(["iceberg_id", "date"])
        for iceberg_id, group in df.groupby("iceberg_id"):
            self._by_iceberg[str(iceberg_id).upper()] = group.reset_index(drop=True)

        self._loaded = True
        logger.info(
            "Historical training data loaded: %s icebergs", len(self._by_iceberg)
        )

    def _find_previous_observation(
        self, iceberg_id: str, live_date: date
    ) -> pd.Series | None:
        """Return the latest historical observation that is strictly before live_date."""
        group = self._by_iceberg.get(iceberg_id.upper())
        if group is None or group.empty:
            return None

        # Ensure we are comparing Python dates, not Timestamps
        dates = group["date"].dt.date if hasattr(group["date"], "dt") else group["date"]
        candidates = group[dates < live_date]
        if candidates.empty:
            return None

        return candidates.iloc[-1]

    def _build_features(
        self, live: dict, previous: pd.Series
    ) -> dict[str, float]:
        """Construct the 16-feature vector from live and previous observations."""
        live_date = _to_python_date(live.get("last_updated"))
        previous_date = _to_python_date(previous.get("date"))

        if live_date is None or previous_date is None:
            raise PredictionNotAvailableError(
                "Missing observation dates needed for movement calculation"
            )

        if previous_date >= live_date:
            raise PredictionNotAvailableError(
                "No historical observation earlier than the live observation"
            )

        time_diff_days = (live_date - previous_date).days
        if time_diff_days <= 0:
            raise PredictionNotAvailableError(
                "Observation time difference must be positive"
            )

        curr_lat = float(live["latitude"])
        curr_lon = float(live["longitude"])
        prev_lat = float(previous["latitude"])
        prev_lon = float(previous["longitude"])

        delta_latitude = curr_lat - prev_lat
        delta_longitude_wrapped = float(wrap_longitude(curr_lon - prev_lon))

        movement_distance_deg = math.sqrt(
            delta_latitude**2 + delta_longitude_wrapped**2
        )

        lat_velocity = delta_latitude / time_diff_days
        lon_velocity = delta_longitude_wrapped / time_diff_days
        movement_rate_deg_per_day = movement_distance_deg / time_diff_days

        speed = _haversine_km(prev_lat, prev_lon, curr_lat, curr_lon) / time_diff_days

        return {
            "latitude": curr_lat,
            "longitude": curr_lon,
            "previous_latitude": prev_lat,
            "previous_longitude": prev_lon,
            "delta_latitude": delta_latitude,
            "delta_longitude_wrapped": delta_longitude_wrapped,
            "time_difference": float(time_diff_days),
            "speed": speed,
            "lat_velocity": lat_velocity,
            "lon_velocity": lon_velocity,
            "movement_distance_deg": movement_distance_deg,
            "movement_rate_deg_per_day": movement_rate_deg_per_day,
            "year": live_date.year,
            "month": live_date.month,
            "day_of_year": live_date.timetuple().tm_yday,
            "target_time_difference": 1.0,
        }

    def _get_live_record(self, iceberg_id: str) -> dict:
        """Fetch the current live record for an iceberg from the iceberg service."""
        try:
            records = iceberg_service.get_icebergs()
        except IcebergDataError as exc:
            raise PredictionNotAvailableError(
                "Live iceberg data is currently unavailable"
            ) from exc

        normalized_id = iceberg_id.upper()
        for record in records:
            if str(record.get("id", "")).upper() == normalized_id:
                return record

        raise PredictionNotAvailableError(f"Iceberg {iceberg_id} not found in live data")

    def predict(self, iceberg_id: str, horizon_days: float = 1.0) -> dict:
        """Return a 24-hour XGBoost prediction for a live iceberg.

        If movement history is missing, returns a structured unavailable response
        instead of fabricating features.
        """
        self._load()

        live = self._get_live_record(iceberg_id)

        if not REQUIRED_LIVE_FIELDS.issubset(live):
            raise PredictionNotAvailableError(
                "Live iceberg record is missing required fields"
            )

        live_date = _to_python_date(live.get("last_updated"))
        if live_date is None:
            raise PredictionNotAvailableError(
                "Live iceberg record has no observation date"
            )

        previous = self._find_previous_observation(live["id"], live_date)
        if previous is None:
            raise PredictionNotAvailableError(
                f"No historical movement data for iceberg {live['id']}"
            )

        features = self._build_features(live, previous)
        features["target_time_difference"] = float(horizon_days)

        try:
            predicted_lat, predicted_lon = model_service.predict(features)
        except ModelLoadError as exc:
            raise PredictionNotAvailableError(
                "Trajectory models are not loaded"
            ) from exc
        except Exception as exc:
            logger.exception("Prediction failed for iceberg %s", live["id"])
            raise PredictionNotAvailableError("Prediction model failed") from exc

        return {
            "iceberg_id": live["id"],
            "prediction_available": True,
            "current_latitude": float(live["latitude"]),
            "current_longitude": float(live["longitude"]),
            "predicted_latitude": predicted_lat,
            "predicted_longitude": predicted_lon,
            "prediction_horizon_days": float(horizon_days),
            "model": "XGBoost",
        }

    def predict_or_unavailable(self, iceberg_id: str, horizon_days: float = 1.0) -> dict:
        """Predict or return a structured unavailable response."""
        try:
            return self.predict(iceberg_id, horizon_days)
        except PredictionNotAvailableError as exc:
            try:
                live = self._get_live_record(iceberg_id)
            except PredictionNotAvailableError:
                live = None

            return {
                "iceberg_id": iceberg_id.upper(),
                "prediction_available": False,
                "current_latitude": float(live["latitude"]) if live else None,
                "current_longitude": float(live["longitude"]) if live else None,
                "reason": exc.reason,
            }


prediction_service = PredictionService()
