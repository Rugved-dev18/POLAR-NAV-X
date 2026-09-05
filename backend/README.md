# Backend - Iceberg Trajectory Prediction API

FastAPI service that serves the trained XGBoost models from `ml/models/`.

```
backend/
├── app/
│   ├── main.py           # FastAPI app, endpoints, error handling
│   ├── model_service.py  # Model loading at startup + inference
│   └── schemas.py        # Pydantic request/response models
└── requirements.txt
```

## Setup

```bash
pip install -r backend/requirements.txt
```

The models must exist at `ml/models/latitude_model.json`,
`ml/models/longitude_sin_model.json` and `ml/models/longitude_cos_model.json`.
Regenerate them with `python ml/train_xgboost.py` (see `ml/README.md`).

## Run

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Models are loaded once during application startup, not per request.

## Endpoints

### `GET /health`

```json
{ "status": "ok", "model_loaded": true }
```

### `POST /predict`

Body — the 16 training features, in the training order:

```json
{
  "latitude": -75.42,
  "longitude": -39.83,
  "previous_latitude": -75.40,
  "previous_longitude": -39.80,
  "delta_latitude": -0.02,
  "delta_longitude_wrapped": -0.03,
  "time_difference": 1.0,
  "speed": 0.42,
  "lat_velocity": -0.02,
  "lon_velocity": -0.03,
  "movement_distance_deg": 0.036,
  "movement_rate_deg_per_day": 0.036,
  "year": 2026,
  "month": 9,
  "day_of_year": 248,
  "target_time_difference": 1.0
}
```

Response:

```json
{ "predicted_latitude": -75.44, "predicted_longitude": -39.86 }
```

The longitude models predict the sine and cosine of the target angle; the API
decodes them with `atan2` and returns a longitude in (-180, 180].

Unknown fields are rejected and missing/invalid fields return HTTP 422. If the
models could not be loaded, `/predict` returns HTTP 503 and `/health` reports
`"model_loaded": false`; unexpected inference failures return HTTP 500 without
leaking a stack trace.

Interactive docs: `http://localhost:8000/docs`.

## Tests

```bash
python -m pytest backend/tests
```
