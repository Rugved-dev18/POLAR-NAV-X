"""
XGBoost Iceberg Trajectory Prediction Training Script
Trains regression models to predict iceberg latitude and longitude
"""

import argparse
import os
from pathlib import Path

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA_PATH = REPO_ROOT / "data" / "processed" / "PolarNavX_XGBoost_Training.csv"
DEFAULT_MODELS_DIR = REPO_ROOT / "ml" / "models"

# Input features (as specified)
FEATURES = [
    'latitude',
    'longitude',
    'previous_latitude',
    'previous_longitude',
    'delta_latitude',
    'delta_longitude_wrapped',
    'time_difference',
    'speed',
    'lat_velocity',
    'lon_velocity',
    'movement_distance_deg',
    'movement_rate_deg_per_day',
    'year',
    'month',
    'day_of_year',
    'target_time_difference'
]

# Target variables
TARGETS = ['target_latitude', 'target_longitude']

# Date columns kept for the temporal split only (never used as features)
DATE_COLUMNS = ['date', 'target_date']

# Columns to exclude from the feature matrix
EXCLUDE_COLUMNS = ['iceberg_id', 'date', 'target_date', 'sensor']


def wrap_longitude(longitude):
    """Normalize longitude values to the canonical (-180, 180] range"""
    return (np.asarray(longitude, dtype=float) + 180.0) % 360.0 - 180.0


def longitude_difference(lon_a, lon_b):
    """Signed minimal angular difference (degrees) between two longitudes"""
    return wrap_longitude(np.asarray(lon_a, dtype=float) - np.asarray(lon_b, dtype=float))


def longitude_to_sin_cos(longitude):
    """Encode longitude as sine/cosine components of its angle"""
    radians = np.radians(wrap_longitude(longitude))
    return np.sin(radians), np.cos(radians)


def sin_cos_to_longitude(sin_component, cos_component):
    """Decode sine/cosine components back to a canonical longitude in degrees"""
    return wrap_longitude(np.degrees(np.arctan2(sin_component, cos_component)))


def load_and_preprocess_data(data_path):
    """Load and preprocess the dataset"""
    print("Loading dataset...")
    df = pd.read_csv(data_path)
    print(f"Dataset loaded: {len(df)} rows, {len(df.columns)} columns")

    missing = [column for column in FEATURES + TARGETS + DATE_COLUMNS if column not in df.columns]
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")

    df_work = df[FEATURES + TARGETS + DATE_COLUMNS].copy()

    for column in DATE_COLUMNS:
        df_work[column] = pd.to_datetime(df_work[column], errors='coerce')

    print("Handling missing values...")
    df_work = df_work.replace([np.inf, -np.inf], np.nan)
    df_work = df_work.dropna()

    df_work['target_longitude'] = wrap_longitude(df_work['target_longitude'])
    lon_sin, lon_cos = longitude_to_sin_cos(df_work['target_longitude'])
    df_work['target_longitude_sin'] = lon_sin
    df_work['target_longitude_cos'] = lon_cos

    print(f"After cleaning: {len(df_work)} rows")
    return df_work


def chronological_split(df, test_size=0.2):
    """Split the data at a forecast cutoff date.

    Training rows must be fully observable before the cutoff: both the
    observation date and the forecast target date have to fall strictly
    before it. Rows sharing an observation date always land on the same
    side of the split.
    """
    print("Performing chronological train/test split...")

    rows_per_date = df['date'].value_counts().sort_index()
    if len(rows_per_date) < 2:
        raise ValueError(
            "A temporal split needs at least two distinct observation dates in the dataset"
        )

    # Candidate cutoffs are observation dates; the test period starts at the
    # cutoff, so the earliest date can never be one.
    candidates = rows_per_date.index[1:]
    test_fractions = 1 - (rows_per_date.cumsum().iloc[:-1].to_numpy() / len(df))
    cutoff = candidates[np.argmin(np.abs(test_fractions - test_size))]

    train_df = df[(df['date'] < cutoff) & (df['target_date'] < cutoff)]
    test_df = df[df['date'] >= cutoff]

    if train_df.empty or test_df.empty:
        raise ValueError("Chronological split produced an empty training or test set")

    dropped = len(df[df['date'] < cutoff]) - len(train_df)
    print(f"Cutoff date: {pd.Timestamp(cutoff).date()}")
    print(f"Training set: {len(train_df)} rows ({len(train_df)/len(df)*100:.1f}%)")
    print(f"Test set: {len(test_df)} rows ({len(test_df)/len(df)*100:.1f}%)")
    print(f"Dropped {dropped} pre-cutoff rows whose forecast horizon crosses the cutoff")

    return train_df, test_df


def train_xgboost_model(X_train, y_train, X_test, y_test, target_name):
    """Train a single XGBoost regression model"""
    print(f"\nTraining {target_name} model...")

    # XGBoost parameters for first prototype
    params = {
        'objective': 'reg:squarederror',
        'eval_metric': 'rmse',
        'max_depth': 6,
        'learning_rate': 0.1,
        'n_estimators': 100,
        'subsample': 0.8,
        'colsample_bytree': 0.8,
        'random_state': 42,
        'n_jobs': -1
    }

    model = xgb.XGBRegressor(**params)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    return model


def evaluate_latitude(model, X_test, y_test):
    """Evaluate the latitude model with standard regression metrics"""
    print("\nEvaluating latitude model...")

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"  MAE: {mae:.6f} degrees")
    print(f"  RMSE: {rmse:.6f} degrees")
    print(f"  R²: {r2:.6f}")

    return {'mae': mae, 'rmse': rmse, 'r2': r2, 'predictions': y_pred}


def evaluate_longitude(sin_model, cos_model, X_test, y_test):
    """Decode the circular longitude prediction and score it with wrapped errors"""
    lon_pred = sin_cos_to_longitude(sin_model.predict(X_test), cos_model.predict(X_test))
    errors = longitude_difference(lon_pred, y_test)

    print("\nEvaluating longitude model...")
    mae = np.mean(np.abs(errors))
    rmse = np.sqrt(np.mean(errors ** 2))
    variance = np.mean(longitude_difference(y_test, np.mean(y_test)) ** 2)
    r2 = 1 - np.mean(errors ** 2) / variance if variance > 0 else float('nan')

    print(f"  MAE: {mae:.6f} degrees")
    print(f"  RMSE: {rmse:.6f} degrees")
    print(f"  R²: {r2:.6f}")

    return {'mae': mae, 'rmse': rmse, 'r2': r2, 'predictions': lon_pred}


def calculate_distance_error(lat_pred, lon_pred, lat_actual, lon_actual):
    """Calculate prediction error in degrees, wrapping the longitude difference"""
    lat_error = np.abs(np.asarray(lat_pred, dtype=float) - np.asarray(lat_actual, dtype=float))
    lon_error = np.abs(longitude_difference(lon_pred, lon_actual))

    distance_error = np.sqrt(lat_error**2 + lon_error**2)

    print("\nDistance Error Statistics:")
    print(f"  Mean: {np.mean(distance_error):.6f} degrees")
    print(f"  Median: {np.median(distance_error):.6f} degrees")
    print(f"  Std: {np.std(distance_error):.6f} degrees")
    print(f"  Max: {np.max(distance_error):.6f} degrees")

    return distance_error


def save_model(model, model_path):
    """Save trained model to JSON format"""
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    model.save_model(model_path)
    print(f"Model saved to {model_path}")


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--data',
        type=Path,
        default=DEFAULT_DATA_PATH,
        help=f"Path to the training CSV (default: {DEFAULT_DATA_PATH})",
    )
    parser.add_argument(
        '--models-dir',
        type=Path,
        default=DEFAULT_MODELS_DIR,
        help=f"Directory to write trained models to (default: {DEFAULT_MODELS_DIR})",
    )
    parser.add_argument(
        '--test-size',
        type=float,
        default=0.2,
        help="Approximate fraction of the most recent observations held out (default: 0.2)",
    )
    return parser.parse_args(argv)


def main(argv=None):
    """Main training pipeline"""
    args = parse_args(argv)

    print("="*60)
    print("XGBoost Iceberg Trajectory Prediction Training")
    print("="*60)

    data_path = args.data.expanduser().resolve()
    models_dir = args.models_dir.expanduser().resolve()
    if not data_path.is_file():
        raise SystemExit(
            f"Training dataset not found at {data_path}. Pass --data /path/to/dataset.csv"
        )

    df = load_and_preprocess_data(data_path)

    train_df, test_df = chronological_split(df, test_size=args.test_size)

    X_train = train_df[FEATURES]
    y_train_lat = train_df['target_latitude']
    y_train_lon_sin = train_df['target_longitude_sin']
    y_train_lon_cos = train_df['target_longitude_cos']

    X_test = test_df[FEATURES]
    y_test_lat = test_df['target_latitude']
    y_test_lon = test_df['target_longitude']
    y_test_lon_sin = test_df['target_longitude_sin']
    y_test_lon_cos = test_df['target_longitude_cos']

    print(f"\nFeatures used: {len(FEATURES)}")
    print(f"Feature columns: {FEATURES}")

    latitude_model = train_xgboost_model(
        X_train, y_train_lat, X_test, y_test_lat, 'latitude'
    )
    longitude_sin_model = train_xgboost_model(
        X_train, y_train_lon_sin, X_test, y_test_lon_sin, 'longitude (sine)'
    )
    longitude_cos_model = train_xgboost_model(
        X_train, y_train_lon_cos, X_test, y_test_lon_cos, 'longitude (cosine)'
    )

    lat_metrics = evaluate_latitude(latitude_model, X_test, y_test_lat)
    lon_metrics = evaluate_longitude(longitude_sin_model, longitude_cos_model, X_test, y_test_lon)

    distance_error = calculate_distance_error(
        lat_metrics['predictions'],
        lon_metrics['predictions'],
        y_test_lat,
        y_test_lon,
    )

    print("\nSaving trained models...")
    save_model(latitude_model, str(models_dir / 'latitude_model.json'))
    save_model(longitude_sin_model, str(models_dir / 'longitude_sin_model.json'))
    save_model(longitude_cos_model, str(models_dir / 'longitude_cos_model.json'))

    print("\n" + "="*60)
    print("Training completed successfully!")
    print("="*60)

    print("\nSummary:")
    print(f"  Training samples: {len(X_train)}")
    print(f"  Test samples: {len(X_test)}")
    print(f"  Latitude MAE: {lat_metrics['mae']:.6f} degrees")
    print(f"  Longitude MAE: {lon_metrics['mae']:.6f} degrees")
    print(f"  Mean distance error: {np.mean(distance_error):.6f} degrees")
    print(f"  Models saved to: {models_dir}")


if __name__ == "__main__":
    main()
