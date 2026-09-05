import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.main import app

VALID_REQUEST = {
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
    "target_time_difference": 1.0,
}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_reports_loaded_models(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "model_loaded": True}


def test_predict_returns_a_position(client):
    response = client.post("/predict", json=VALID_REQUEST)
    assert response.status_code == 200

    body = response.json()
    assert -90 <= body["predicted_latitude"] <= 90
    assert -180 < body["predicted_longitude"] <= 180


def test_predict_rejects_missing_fields(client):
    payload = {key: value for key, value in VALID_REQUEST.items() if key != "speed"}
    assert client.post("/predict", json=payload).status_code == 422


def test_predict_rejects_unknown_fields(client):
    payload = dict(VALID_REQUEST, sea_ice_concentration=0.5)
    assert client.post("/predict", json=payload).status_code == 422


def test_predict_rejects_out_of_range_values(client):
    payload = dict(VALID_REQUEST, month=13)
    assert client.post("/predict", json=payload).status_code == 422


def test_openapi_exposes_both_endpoints(client):
    paths = client.get("/openapi.json").json()["paths"]
    assert "/health" in paths
    assert "/predict" in paths
