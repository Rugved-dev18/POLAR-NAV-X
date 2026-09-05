"""Feature definitions and longitude helpers shared by training and serving."""

import numpy as np

# Input features, in the exact order the models are trained on
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
