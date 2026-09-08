# POLAR-NAV-X Dataset Documentation

## Dataset Information

### Dataset Name

**PolarNavX_XGBoost_Training**

### Dataset Purpose

This dataset is the processed historical iceberg-movement dataset used
to train the XGBoost trajectory prediction models in POLAR-NAV-X.

The dataset provides historical iceberg positions and derived movement
features that allow the model to learn relationships between an
iceberg's previous movement and its future position.

The trained XGBoost models predict:

- Future latitude
- Future longitude

### Dataset Source

**Project-processed historical iceberg observation data.**

The dataset used by POLAR-NAV-X is a processed training dataset rather
than the raw live iceberg feed.

The current/latest iceberg observations used by the application are
handled separately through the live iceberg data integration.

> Note: The exact upstream historical-data provenance should be cited
> here once the original historical dataset/source documentation is
> formally recorded by the project team.

### Data Format

**CSV**

The repository stores a compressed ZIP version:

`data/processed/PolarNavX_XGBoost_Training.zip`

The ZIP contains:

`PolarNavX_XGBoost_Training.csv`

### Time Period

The dataset contains historical iceberg observations used for
trajectory modelling.

The exact minimum and maximum observation dates should be derived from
the CSV before claiming a specific date range.

### Spatial Coverage

**Antarctic iceberg observation region.**

Latitude and longitude are represented using geographic coordinates in
decimal degrees.

The exact geographic bounding box should be derived from the dataset
before being documented as a fixed range.

---

## Dataset Size

### Rows

**515,160**

### Columns

**22**

### Original CSV Size

Approximately **88.81 MiB (~89 MB)**

### Compressed Repository Version

Approximately **14.91 MiB (~15 MB)** as a ZIP archive.

---

# Data Schema

## Raw / Identifier Columns

### `iceberg_id`

Unique identifier/name of the tracked iceberg.

**Type:** String

**Example:**

`A76C`

---

### `date`

Date associated with the historical iceberg observation.

**Type:** Date/String

**Purpose:**

Used for temporal ordering and deriving time-related features.

---

### `sensor`

Identifies the observation/data source or sensor associated with the
historical record.

**Type:** String

---

## Position Features

### `latitude`

Current latitude of the iceberg observation.

**Type:** Float

**Unit:** Decimal degrees

---

### `longitude`

Current longitude of the iceberg observation.

**Type:** Float

**Unit:** Decimal degrees

---

### `previous_latitude`

Latitude of the iceberg's previous observation.

**Type:** Float

**Unit:** Decimal degrees

**Purpose:**

Used to calculate iceberg movement between observations.

---

### `previous_longitude`

Longitude of the iceberg's previous observation.

**Type:** Float

**Unit:** Decimal degrees

**Purpose:**

Used to calculate iceberg movement between observations.

---

## Movement Features

### `delta_latitude`

Change in latitude between the previous and current observations.

**Type:** Float

**Unit:** Decimal degrees

---

### `delta_longitude_wrapped`

Change in longitude between observations while accounting for longitude
wrap-around at the ±180° dateline.

**Type:** Float

**Unit:** Decimal degrees

---

### `time_difference`

Time elapsed between the previous and current observations.

**Type:** Float

**Unit:** Days

---

### `speed`

Calculated iceberg movement speed.

**Type:** Float

**Unit:** Dataset-derived movement units per day

---

### `lat_velocity`

Rate of change of latitude.

**Type:** Float

**Unit:** Degrees per day

---

### `lon_velocity`

Rate of change of longitude.

**Type:** Float

**Unit:** Degrees per day

---

### `movement_distance_deg`

Distance travelled by the iceberg represented in geographic degrees.

**Type:** Float

**Unit:** Degrees

---

### `movement_rate_deg_per_day`

Movement distance normalized by elapsed time.

**Type:** Float

**Unit:** Degrees per day

---

# Temporal Features

### `year`
Calendar year of the observation.

**Type:** Integer

---

### `month`

Calendar month of the observation.

**Type:** Integer

**Range:** 1–12

---

### `day_of_year`

Day number within the calendar year.

**Type:** Integer

**Range:** 1–366

---

# Target Variables

### `target_latitude`

Future latitude that the XGBoost model is trained to predict.

**Type:** Float

**Unit:** Decimal degrees

**ML Role:** Target variable

---

### `target_longitude`

Future longitude that the XGBoost model is trained to predict.

**Type:** Float
**Unit:** Decimal degrees

**ML Role:** Target variable

---

### `target_longitude`

Future longitude that the XGBoost model is trained to predict.

**Type:** Float

**Unit:** Decimal degrees

**ML Role:** Target variable

---

### `target_date`

Date associated with the future target observation.

**Type:** Date/String

**ML Role:** Target/temporal reference

---

### `target_time_difference`

Time difference between the current observation and the target
observation.

**Type:** Float

**Unit:** Days

**ML Role:** Model input feature

---

# XGBoost Feature Set

The existing POLAR-NAV-X XGBoost models use the following **16 input
features in this exact order**:

1. `latitude`
2. `longitude`
3. `previous_latitude`
4. `previous_longitude`
5. `delta_latitude`
6. `delta_longitude_wrapped`
7. `time_difference`
8. `speed`
9. `lat_velocity`
10. `lon_velocity`
11. `movement_distance_deg`
12. `movement_rate_deg_per_day`
13. `year`
14. `month`
15. `day_of_year`
16. `target_time_difference`

The following columns are **not directly used as numerical model
features**:

- `iceberg_id`
- `date`
- `sensor`
- `target_date`

The target variables are:

- `target_latitude`
- `target_longitude`

---

# Units

| Variable | Unit |
|---|---|
| latitude | Decimal degrees |
| longitude | Decimal degrees |
| previous_latitude | Decimal degrees |
| previous_longitude | Decimal degrees |
| delta_latitude | Degrees |
| delta_longitude_wrapped | Degrees |
| time_difference | Days |
| speed | Dataset-derived movement units/day |
| lat_velocity | Degrees/day |
| lon_velocity | Degrees/day |
| movement_distance_deg | Degrees |
| movement_rate_deg_per_day | Degrees/day |
| year | Year |
| month | Month number |
| day_of_year | Day number |
| target_latitude | Decimal degrees |
| target_longitude | Decimal degrees |
| target_time_difference | Days |

---

# Data Characteristics

## Resolution

### Spatial

Geographic point observations represented using decimal latitude and
longitude.

A fixed spatial grid resolution is **not applicable** to this dataset.

### Temporal

The dataset is based on historical iceberg observations and therefore
contains observation intervals rather than a fixed raster/grid temporal
resolution.

The exact observation frequency depends on the underlying historical
observations.

---

## File Size

Original CSV:

**~88.81 MiB (~89 MB)**

Compressed ZIP used in the repository:

**~14.91 MiB (~15 MB)**

The compressed version is used to keep the training dataset within
GitHub's individual file-size limits.

---

## Update Frequency

The training dataset is a **processed historical training dataset** and
is not intended to be updated on every live-data request.

The application obtains latest iceberg observations separately through
the iceberg data service.

Model retraining can be performed when additional validated historical
observations become available.

---

# License and Access

## License

The license of the original historical data source is **not specified
in the current dataset documentation**.

The project should preserve the license/attribution requirements of
the original upstream data source.

Do not assume that the processed dataset is independently licensed
under an open-source license without confirming the upstream source.

---

## Access Requirements

The processed training dataset is stored within the POLAR-NAV-X project
repository in compressed form.

No separate user authentication or API key is required to access the
repository copy.

Any restrictions imposed by the original upstream data provider still
apply.

---

## Citation Requirements

The original upstream historical iceberg data source should be cited
when the source provenance is finalized.

POLAR-NAV-X should also be cited when this processed dataset is used
as part of the project.

---

# Data Quality

## Completeness

The dataset contains **515,160 records**.

The exact percentage of missing values has not been formally documented
in this file.

Before production use, missing values should be checked for all
features used by the XGBoost models.

---

## Accuracy

The trained XGBoost model has been evaluated using held-out data.

Current model evaluation reported for POLAR-NAV-X includes approximately:

- Latitude MAE: **0.063°**
- Wrapped longitude MAE: **0.422°**
- Mean distance error: **0.443°**

These are **model prediction metrics**, not direct accuracy guarantees
of the underlying iceberg observations.

They should therefore not be interpreted as operational navigation
accuracy.

---

## Known Issues

1. Historical observations may have irregular time intervals.

2. Iceberg observations may originate from different observation
   sources/sensors.

3. Longitude calculations require special handling around the
   ±180° dateline.

4. Historical observations may contain gaps.

5. Not every latest/live iceberg necessarily has sufficient historical
   observations for trajectory prediction.

6. The dataset is intended for research/prototype decision support and
   should not be treated as an operational navigation safety dataset.

---

# Preprocessing Requirements

The dataset contains preprocessed movement features required by the
XGBoost model.

Important preprocessing operations include:

1. Ordering iceberg observations temporally.

2. Obtaining previous iceberg positions.

3. Calculating latitude change.

4. Calculating wrapped longitude change.

5. Calculating elapsed time between observations.

6. Calculating movement distance.

7. Calculating movement speed/rate.

8. Calculating latitude velocity.

9. Calculating longitude velocity.

10. Extracting year, month, and day-of-year features.

11. Generating future target latitude and longitude.

12. Generating target time difference.

---

# Model Integration

The dataset is used by the POLAR-NAV-X XGBoost trajectory prediction
pipeline.

The architecture is:

```text
Historical Iceberg Observations
            ↓
      Preprocessing
            ↓
    Movement Features
            ↓
   XGBoost Training Data
            ↓
       XGBoost Models
            ↓
 Predicted Latitude/Longitude
