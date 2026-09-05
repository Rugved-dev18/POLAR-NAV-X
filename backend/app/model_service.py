"""Loading and inference for the trained XGBoost iceberg trajectory models."""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import xgboost as xgb

REPO_ROOT = Path(__file__).resolve().parents[2]
MODELS_DIR = REPO_ROOT / "ml" / "models"

sys.path.insert(0, str(REPO_ROOT / "ml"))

from features import FEATURES, sin_cos_to_longitude

MODEL_FILES = {
    "latitude": MODELS_DIR / "latitude_model.json",
    "longitude_sin": MODELS_DIR / "longitude_sin_model.json",
    "longitude_cos": MODELS_DIR / "longitude_cos_model.json",
}


class ModelLoadError(RuntimeError):
    """Raised when the trained models cannot be loaded."""


class TrajectoryModelService:
    """Holds the trained models in memory and turns feature dicts into predictions."""

    def __init__(self):
        self._models = {}

    @property
    def is_loaded(self):
        return len(self._models) == len(MODEL_FILES)

    def load(self):
        missing = [str(path) for path in MODEL_FILES.values() if not path.is_file()]
        if missing:
            raise ModelLoadError(
                "Trained model files not found: "
                + ", ".join(missing)
                + ". Run 'python ml/train_xgboost.py' to generate them."
            )

        models = {}
        for name, path in MODEL_FILES.items():
            model = xgb.XGBRegressor()
            try:
                model.load_model(str(path))
            except Exception as exc:
                raise ModelLoadError(f"Failed to load model {path}: {exc}") from exc
            models[name] = model

        self._models = models

    def predict(self, features):
        """Predict target latitude/longitude for a single observation.

        `features` maps every name in `FEATURES` to a numeric value; the frame is
        built in the training feature order.
        """
        if not self.is_loaded:
            raise ModelLoadError("Models are not loaded")

        frame = pd.DataFrame([[features[name] for name in FEATURES]], columns=FEATURES)

        latitude = float(self._models["latitude"].predict(frame)[0])
        longitude = float(
            sin_cos_to_longitude(
                self._models["longitude_sin"].predict(frame),
                self._models["longitude_cos"].predict(frame),
            )[0]
        )

        if not np.isfinite(latitude) or not np.isfinite(longitude):
            raise ValueError("Model produced a non-finite prediction")

        return latitude, longitude


model_service = TrajectoryModelService()
