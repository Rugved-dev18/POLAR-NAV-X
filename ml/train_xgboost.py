"""
XGBoost Iceberg Trajectory Prediction Training Script
Trains two regression models to predict iceberg latitude and longitude
"""

import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import os

# Configuration
DATA_PATH = r"c:\Users\Admin\Downloads\PolarNavX_XGBoost_Training.csv"
MODELS_DIR = "ml/models"

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

# Columns to exclude
EXCLUDE_COLUMNS = ['iceberg_id', 'date', 'target_date', 'sensor']

def load_and_preprocess_data():
    """Load and preprocess the dataset"""
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    print(f"Dataset loaded: {len(df)} rows, {len(df.columns)} columns")
    
    # Select features and targets
    feature_columns = FEATURES
    target_columns = TARGETS
    
    # Create working dataframe
    df_work = df[feature_columns + target_columns].copy()
    
    # Handle missing values
    print("Handling missing values...")
    df_work = df_work.replace([np.inf, -np.inf], np.nan)
    df_work = df_work.dropna()
    
    print(f"After cleaning: {len(df_work)} rows")
    return df_work, feature_columns, target_columns

def chronological_split(df, test_size=0.2):
    """Split data chronologically (80% earliest for training, 20% latest for testing)"""
    print("Performing chronological train/test split...")
    
    # Sort by date to ensure chronological order
    # We'll use year, month, day_of_year to create a chronological index
    df_sorted = df.sort_values(['year', 'month', 'day_of_year'])
    
    split_idx = int(len(df_sorted) * (1 - test_size))
    
    train_df = df_sorted.iloc[:split_idx]
    test_df = df_sorted.iloc[split_idx:]
    
    print(f"Training set: {len(train_df)} rows ({len(train_df)/len(df_sorted)*100:.1f}%)")
    print(f"Test set: {len(test_df)} rows ({len(test_df)/len(df_sorted)*100:.1f}%)")
    
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

def evaluate_model(model, X_test, y_test, target_name):
    """Evaluate model and return metrics"""
    print(f"\nEvaluating {target_name} model...")
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    # Print metrics
    print(f"  MAE: {mae:.6f} degrees")
    print(f"  RMSE: {rmse:.6f} degrees") 
    print(f"  R²: {r2:.6f}")
    
    return {
        'mae': mae,
        'rmse': rmse,
        'r2': r2,
        'predictions': y_pred,
        'actual': y_test
    }

def calculate_distance_error(lat_pred, lon_pred, lat_actual, lon_actual):
    """Calculate prediction error in degrees using Haversine-like distance"""
    # Simple Euclidean distance in degrees (approximation for small distances)
    lat_error = np.abs(lat_pred - lat_actual)
    lon_error = np.abs(lon_pred - lon_actual)
    
    # Combined error (degrees)
    distance_error = np.sqrt(lat_error**2 + lon_error**2)
    
    print(f"\nDistance Error Statistics:")
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

def main():
    """Main training pipeline"""
    print("="*60)
    print("XGBoost Iceberg Trajectory Prediction Training")
    print("="*60)
    
    # Load and preprocess data
    df, feature_columns, target_columns = load_and_preprocess_data()
    
    # Chronological split
    train_df, test_df = chronological_split(df)
    
    # Prepare training data
    X_train = train_df[feature_columns]
    y_train_lat = train_df['target_latitude']
    y_train_lon = train_df['target_longitude']
    
    # Prepare test data
    X_test = test_df[feature_columns]
    y_test_lat = test_df['target_latitude']
    y_test_lon = test_df['target_longitude']
    
    print(f"\nFeatures used: {len(feature_columns)}")
    print(f"Feature columns: {feature_columns}")
    
    # Train latitude model
    latitude_model = train_xgboost_model(
        X_train, y_train_lat, X_test, y_test_lat, 'latitude'
    )
    
    # Train longitude model  
    longitude_model = train_xgboost_model(
        X_train, y_train_lon, X_test, y_test_lon, 'longitude'
    )
    
    # Evaluate models
    lat_metrics = evaluate_model(latitude_model, X_test, y_test_lat, 'latitude')
    lon_metrics = evaluate_model(longitude_model, X_test, y_test_lon, 'longitude')
    
    # Calculate combined distance error
    distance_error = calculate_distance_error(
        lat_metrics['predictions'], 
        lon_metrics['predictions'],
        lat_metrics['actual'],
        lon_metrics['actual']
    )
    
    # Save models
    print("\nSaving trained models...")
    latitude_model_path = os.path.join(MODELS_DIR, 'latitude_model.json')
    longitude_model_path = os.path.join(MODELS_DIR, 'longitude_model.json')
    
    save_model(latitude_model, latitude_model_path)
    save_model(longitude_model, longitude_model_path)
    
    print("\n" + "="*60)
    print("Training completed successfully!")
    print("="*60)
    
    # Print summary
    print("\nSummary:")
    print(f"  Training samples: {len(X_train)}")
    print(f"  Test samples: {len(X_test)}")
    print(f"  Latitude MAE: {lat_metrics['mae']:.6f} degrees")
    print(f"  Longitude MAE: {lon_metrics['mae']:.6f} degrees")
    print(f"  Mean distance error: {np.mean(distance_error):.6f} degrees")
    print(f"  Models saved to: {MODELS_DIR}")

if __name__ == "__main__":
    main()