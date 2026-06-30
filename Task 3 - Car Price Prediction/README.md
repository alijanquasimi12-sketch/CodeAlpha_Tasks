# K.M.A<sup>2</sup> Car Price Prediction Platform

![K.M.A<sup>2</sup> Legacy Systems](assets/KMA2%20Silver%20Logo.jpeg)

*Powered by K.M.A<sup>2</sup> Technologies*

## Project Overview
This repository contains a portfolio-quality, production-ready machine learning application designed to predict vehicle prices using real-world vehicle features. The project serves as a submission for the CodeAlpha Data Science Internship (Task 3).

The platform features a premium aesthetic interface conforming to the **K.M.A<sup>2</sup> Signature Series** branding requirements, complete with a cinematic startup sequence and glassmorphism-styled dashboard.

## Tech Stack
- **Backend**: Python, Flask
- **Machine Learning**: Scikit-Learn, Pandas, NumPy
- **Visualizations**: Matplotlib, Seaborn, Plotly
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Data Exploration**: Jupyter Notebook (`nbformat`)

## Directory Structure
```
Car_Price_Prediction/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── assets/                     # Branding logos and images
├── datasets/                   # Raw and processed CSV data
├── models/                     # Pickled models (e.g. car_price_model.pkl)
├── notebooks/                  # Jupyter notebooks for EDA
├── reports/                    # Model evaluation metrics
├── src/                        # ML pipeline and training scripts
├── static/                     # CSS stylesheets and JS assets
├── templates/                  # HTML templates
└── visualizations/             # Generated charts and plots
```

## Features
1. **Dynamic Startup Sequence**: An immersive 16-second animated intro showcasing the K.M.A<sup>2</sup> ecosystem.
2. **Advanced Machine Learning**: Utilizes a trained `Gradient Boosting Regressor` (R² ~ 0.96) wrapped in an SKLearn pipeline handling encoding and scaling dynamically.
3. **Exploratory Data Analysis**: Includes automated generation of performance reports and feature correlation matrices.
4. **Interactive Dashboard**: Predict car prices in real-time with confidence scores and estimated ranges.

## Installation & Usage

1. **Clone the repository** (if on GitHub):
   ```bash
   git clone https://github.com/YourUsername/CodeAlpha_CarPricePrediction.git
   cd CodeAlpha_CarPricePrediction
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **(Optional) Re-train the Model**:
   ```bash
   cd src
   python train_model.py
   cd ..
   ```

4. **Launch the Platform**:
   ```bash
   python app.py
   ```

5. **Access the App**: Open your browser and navigate to `http://localhost:5000`. Wait for the startup sequence to initialize the engine!

## Internship Submission Details
- **Task**: 3 (Car Price Prediction with Machine Learning)
- **Organization**: CodeAlpha
- **Ecosystem**: K.M.A<sup>2</sup> Technologies
