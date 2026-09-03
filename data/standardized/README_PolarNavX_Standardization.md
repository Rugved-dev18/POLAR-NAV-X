# Polar Nav X — Iceberg Trajectory Standardization

Source: `antarctic_iceberg_trajectories_CLEANED.csv` (the previously cleaned file — not modified by this step).
Output: `PolarNavX_Iceberg_Trajectory_Standardized.csv`

## Original columns (source → CLEANED file)
`iceberg_id, date, year, doy_sin, doy_cos, lat, lon, sensor, is_interpolated, n_sensors_reporting, days_since_first_seen, obs_number, days_gap, dist_km, bearing_deg, speed_km_per_day, length_nm, width_nm, aspect_ratio, likely_sensor_jump`

## Standardized columns (final file)
| Column | Source | Notes |
|---|---|---|
| `iceberg_id` | `iceberg_id` | Uppercased (e.g. `a01` → `A01`) |
| `date` | `date` | `YYYY-MM-DD` string |
| `latitude` | `lat` | Numeric, validated in [-90, 90] |
| `longitude` | `lon` | Numeric, validated in [-180, 180] |
| `sensor` | `sensor` | Unchanged |
| `distance_to_perimeter` | `dist_km` | Numeric. **Semantic caveat: this is distance travelled since the previous observation of the same iceberg, not a true distance to the Antarctic coastline/ice-shelf perimeter** — no perimeter reference data exists in the source. Named this way only to match the requested schema; see Quality Report. |
| `speed` | `speed_km_per_day` | Numeric |
| `previous_latitude` | derived | Prior row's `latitude` for the same iceberg (NaN on each iceberg's first observation) |
| `previous_longitude` | derived | Prior row's `longitude` for the same iceberg |
| `delta_latitude` | derived | `latitude − previous_latitude` |
| `delta_longitude` | derived | `longitude − previous_longitude` |
| `time_difference` | derived | Days between this observation and the prior one for the same iceberg |

**Dropped from this file** (kept in the CLEANED file, not deleted from the project): `year, doy_sin, doy_cos, is_interpolated, n_sensors_reporting, days_since_first_seen, obs_number, days_gap, bearing_deg, length_nm, width_nm, aspect_ratio, likely_sensor_jump`. These weren't part of the requested 7-column + 5-feature schema; pull them back in from the CLEANED file later if needed for feature engineering.

## Transformations performed
1. Renamed columns per the schema above.
2. Parsed `date` to a real datetime, re-emitted as `YYYY-MM-DD` text; no chronological information was altered (the CLEANED file had already fixed the one date defect — see below).
3. Coerced `latitude`, `longitude`, `distance_to_perimeter`, `speed` to numeric (`pd.to_numeric`, errors→NaN). Zero values were coerced to NaN — everything was already clean numeric or legitimately blank.
4. Validated latitude/longitude ranges — no violations found, nothing was altered.
5. Uppercased `iceberg_id`.
6. Sorted by `iceberg_id` → `date`.
7. Computed `previous_latitude/longitude`, `delta_latitude/longitude`, `time_difference` per iceberg from real prior rows only — no synthetic/interpolated values invented.
8. No rows were deleted at any point in this step.

## Missing values
- `distance_to_perimeter`, `speed`: 647 missing (exactly one per iceberg — its first observation, where no prior point exists). Left as NaN, not imputed.
- `previous_latitude`, `previous_longitude`, `delta_latitude`, `delta_longitude`, `time_difference`: 647 missing each, same cause. Left as NaN, not imputed.
- `iceberg_id`, `date`, `latitude`, `longitude`, `sensor`: 0 missing.

## Duplicates
0 full-row duplicates. 0 duplicate `(iceberg_id, date)` pairs.

## Invalid records
- Invalid dates: 0 (the source's 132 two-digit-year rows for iceberg **E03** were already corrected to 1992 in the prior cleaning pass).
- Invalid latitude/longitude: 0.
- Non-numeric values in numeric columns: 0.
- Abnormal values **not removed**: some `speed` values reach up to ~1652 km/day, physically implausible for an iceberg — very likely sensor jumps (the CLEANED file's `likely_sensor_jump` flag identifies 5,867 such rows, not carried into this file). These rows were kept per instructions; see the Quality Report for details and recommend handling before XGBoost feature engineering.

## Final stats
- **Row count:** 516,439
- **Column count:** 12
- **Date range:** 1976-02-01 to 2026-04-30
- **Unique icebergs:** 647

## Verification performed
Reloaded `PolarNavX_Iceberg_Trajectory_Standardized.csv` fresh with pandas and confirmed: `date` parses as datetime; `latitude`, `longitude`, `distance_to_perimeter`, `speed`, and all five derived feature columns are numeric; latitude/longitude ranges are valid; and row order is `iceberg_id` → `date` as required.

XGBoost training was **not** performed at this stage, per instructions.
