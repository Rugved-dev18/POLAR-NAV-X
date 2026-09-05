import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from train_xgboost import (
    chronological_split,
    longitude_difference,
    longitude_to_sin_cos,
    sin_cos_to_longitude,
    wrap_longitude,
)


def make_rows(dates, target_dates):
    return pd.DataFrame(
        {
            'date': pd.to_datetime(dates),
            'target_date': pd.to_datetime(target_dates),
        }
    )


def test_wrap_longitude_normalizes_out_of_range_values():
    assert wrap_longitude(190.0) == pytest.approx(-170.0)
    assert wrap_longitude(-190.0) == pytest.approx(170.0)
    assert wrap_longitude(45.0) == pytest.approx(45.0)


def test_longitude_difference_uses_minimal_angle_across_dateline():
    assert longitude_difference(-179.0, 179.0) == pytest.approx(2.0)
    assert longitude_difference(179.0, -179.0) == pytest.approx(-2.0)


def test_sin_cos_round_trip_preserves_longitude():
    longitudes = np.array([-180.0, -179.5, -90.0, 0.0, 90.0, 179.5])
    decoded = sin_cos_to_longitude(*longitude_to_sin_cos(longitudes))
    assert np.allclose(longitude_difference(decoded, longitudes), 0.0, atol=1e-9)


def test_split_excludes_training_rows_whose_horizon_crosses_the_cutoff():
    df = make_rows(
        dates=['2020-01-01'] * 4 + ['2020-01-02'] * 4 + ['2020-01-03'] * 2,
        target_dates=['2020-01-01'] * 3 + ['2020-01-05'] + ['2020-01-02'] * 4 + ['2020-01-04'] * 2,
    )

    train_df, test_df = chronological_split(df, test_size=0.2)

    assert (train_df['target_date'] < test_df['date'].min()).all()
    assert len(train_df) == 7
    assert set(test_df['date']) == {pd.Timestamp('2020-01-03')}


def test_split_keeps_rows_sharing_an_observation_date_together():
    df = make_rows(
        dates=['2020-01-01'] * 2 + ['2020-01-02'] * 8,
        target_dates=['2020-01-01'] * 2 + ['2020-01-02'] * 8,
    )

    train_df, test_df = chronological_split(df, test_size=0.2)

    assert set(train_df['date']) & set(test_df['date']) == set()
    assert len(test_df) == 8


def test_split_rejects_datasets_without_a_test_period():
    df = make_rows(dates=['2020-01-01'] * 5, target_dates=['2020-01-01'] * 5)

    with pytest.raises(ValueError):
        chronological_split(df, test_size=0.2)
