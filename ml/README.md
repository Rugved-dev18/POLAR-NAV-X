# Machine Learning Module - XGBoost Iceberg Trajectory Prediction

## Overview

This module contains XGBoost regression models for predicting Antarctic iceberg trajectories. The models predict future latitude and longitude positions of iceberons based on historical movement patterns and environmental features.

## Model Purpose

The trained models predict:
- **target_latitude**: Future latitude position of an iceberg
- **target_longitude**: Future longitude position of an iceberg

These predictions support the POLAR-NAV-X navigation decision support system by providing trajectory forecasts for Antarctic maritime operations.

## Input Features

The models use the following 16 input features:

1. **latitude** - Current latitude position
2. **longitude** - Current longitude position  
3. **previous_latitude** - Previous latitude position
4. **previous_longitude** - Previous longitude position
5. **delta_latitude** - Change in latitude
6. **delta_longitude_wrapped** - Change in longitude (wrapped for date line crossing)
7. **time_difference** - Time elapsed between observations
8. **speed** - Movement speed
9. **lat_velocity** - Latitude velocity component
10. **lon_velocity** - Longitude velocity component
11. **movement_distance_deg** - Distance moved in degrees
12. **movement_rate_deg_per_day** - Movement rate per day
13. **year** - Year of observation
14. **month** - Month of observation
15. **day_of_year** - Day of year (1-365/366)
16. **target_time_difference** - Time difference to target prediction

## Excluded Variables

The following variables are NOT used as input features:
- `iceberg_id` - Identifier (not predictive)
- `date` - Observation date (information leak)
- `target_date` - Target date (information leak)
- `sensor` - Sensor type (not relevant for prediction)

## Target Variables

- **target_latitude**: Predicted future latitude position
- **target_longitude**: Predicted future longitude position

## Train/Test Strategy

**Chronological Split**: The dataset is split chronologically rather than randomly to respect the time-series nature of trajectory data.

- **Training set**: 80% of earliest records
- **Test set**: 20% of latest records

This strategy ensures the model is evaluated on future time periods, simulating real-world prediction scenarios.

## Model Architecture

### Latitude Model
- **Algorithm**: XGBoost Regressor
- **Objective**: reg:squarederror
- **Parameters**:
  - max_depth: 6
  - learning_rate: 0.1
  - n_estimators: 100
  - subsample: 0.8
  - colsample_bytree: 0.8
  - random_state: 42

### Longitude Model
- **Algorithm**: XGBoost Regressor
- **Objective**: reg:squarederror
- **Parameters**: Same as latitude model

## Evaluation Metrics

Both models are evaluated using:

1. **MAE (Mean Absolute Error)**: Average absolute difference between predicted and actual values (in degrees)
2. **RMSE (Root Mean Squared Error)**: Square root of average squared differences (in degrees)
3. **R² (R-squared)**: Proportion of variance explained by the model

Additionally, **distance error** is calculated as the combined error in degrees using Euclidean distance approximation.

## How to Run Training

### Prerequisites

Install required packages:
```bash
pip install pandas xgboost scikit-learn numpy
```

### Training Process

1. Ensure the training dataset is available at:
   ```
   c:\Users\Admin\Downloads\PolarNavX_XGBoost_Training.csv
   ```

2. Run the training script:
   ```bash
   python ml/train_xgboost.py
   ```

3. The script will:
   - Load and preprocess the dataset
   - Perform chronological train/test split
   - Train both latitude and longitude models
   - Evaluate model performance
   - Save trained models to `ml/models/`

### Output Files

- `ml/models/latitude_model.json` - Trained latitude prediction model
- `ml/models/longitude_model.json` - Trained longitude prediction model

## Model Usage Example

```python
import xgboost as xgb
import pandas as pd

# Load trained models
latitude_model = xgb.XGBRegressor()
latitude_model.load_model('ml/models/latitude_model.json')

longitude_model = xgb.XGBRegressor()
longitude_model.load_model('ml/models/longitude_model.json')

# Prepare input features (must match training features)
features = {
    'latitude': -60.5,
    'longitude': -48.5,
    'previous_latitude': -60.6,
    'previous_longitude': -48.4,
    # ... include all 16 features
}

# Make predictions
input_df = pd.DataFrame([features])
pred_lat = latitude_model.predict(input_df)
pred_lon = longitude_model.predict(input_df)

print(f"Predicted position: {pred_lat[0]}, {pred_lon[0]}")
```

## Training Dataset

- **Source**: Historical Antarctic iceberg trajectory data
- **Format**: CSV file
- **Preprocessing**: Missing values and infinite values handled appropriately
- **Quality**: Data quality checks performed during training

## Development Notes

- Models are designed as first prototypes for the SIH 2026 competition
- Hyperparameters are set to reasonable defaults for initial development
- Future improvements could include hyperparameter optimization, feature engineering, and ensemble methods
- The chronological split ensures realistic evaluation of temporal prediction performance

## Current Status

- ✅ XGBoost training script implemented
- ✅ Model architecture defined
- ✅ Evaluation metrics established
- ✅ Documentation completed
- ⏳ Models to be trained and evaluated