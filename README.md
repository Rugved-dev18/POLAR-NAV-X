# POLAR NAV-X

## AI-Enabled Antarctic Sea-Ice, Iceberg Trajectory, and Navigation Decision Support System

**SIH Problem Statement ID:** SIH26059

## Description

POLAR NAV-X is an intelligent navigation decision support system designed for Antarctic maritime operations. The system leverages artificial intelligence to analyze sea-ice conditions, predict iceberg trajectories, and provide optimal routing recommendations for vessels operating in polar regions.

## Current Development Phase

**Step 1: Project Setup** ✅

This phase involves establishing the foundational project structure, documentation, and configuration files.

## High-Level Architecture

The system is designed with a modular architecture consisting of:

- **Frontend**: React-based user interface for visualization and decision support
- **Backend**: FastAPI-based REST API for data processing and model serving
- **ML Module**: Machine learning models for sea-ice analysis and iceberg trajectory prediction
- **Routing Module**: Path optimization algorithms (A*) for safe navigation planning
- **Data Layer**: Structured data pipeline for raw and processed datasets

```
┌─────────────┐
│   Frontend  │  React UI
└──────┬──────┘
       │ HTTP
┌──────▼──────┐
│   Backend   │  FastAPI
└──────┬──────┘
       │
   ┌───┴───┬────────┐
   ▼       ▼        ▼
┌─────┐ ┌─────┐ ┌───────┐
│  ML │ │Route│ │ Data  │
└─────┘ └─────┘ └───────┘
```

## Team Contributions

- [Team Member 1] - [Asim Malik]
- [Team Member 2] - [Rugved Narkar]
- [Team Member 3] - [Sarthak Wawre]
- [Team Member 4] - [Siddhant Khedekar]
- [Team Member 5] - [Maithili Patil]
- [Team Member 6] - [Sakib Shaikh]

## Project Structure

```
POLAR NAV-X/
├── frontend/          # React-based user interface
├── backend/           # FastAPI REST API
├── ml/                # Machine learning models and training
├── routing/           # Navigation algorithms (A*)
├── data/              # Data storage and processing
│   ├── raw/          # Original datasets
│   └── processed/    # Cleaned and processed data
├── docs/              # Project documentation
└── README.md          # This file
```

## Development Status

- [x] Step 1: Project Setup
- [x] Step 2: Data Collection and Processing
- [ ] Step 3: ML Model Development
- [ ] Step 4: Routing Algorithm Implementation
- [ ] Step 5: Backend API Development
- [ ] Step 6: Frontend Development
- [ ] Step 7: Integration and Testing

## License

[MIT License]

## Contact

For questions about this project, please contact the development team.
