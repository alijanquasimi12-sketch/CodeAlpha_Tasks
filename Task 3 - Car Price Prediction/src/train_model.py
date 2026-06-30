import pandas as pd
import numpy as np
import joblib
import json
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def run_pipeline(dataset_path='datasets/premium_car_data.csv', base_path='.'):
    print("Starting Premium ML Pipeline...")
    full_dataset_path = os.path.join(base_path, dataset_path)
    if not os.path.exists(full_dataset_path):
        raise FileNotFoundError(f"Dataset not found at {full_dataset_path}")
        
    df = pd.read_csv(full_dataset_path)
    
    # Feature Engineering
    if 'Year' in df.columns:
        df['Car_Age'] = 2024 - df['Year']
        df_model = df.drop(['Year'], axis=1)
    else:
        df_model = df.copy()
        
    # Preprocessing setup
    categorical_cols = ['Brand', 'Model', 'Fuel_Type', 'Transmission']
    numerical_cols = ['Driven_kms', 'Car_Age', 'MPG', 'Engine_Size', 'Tax']
    
    # Ensure all expected columns exist
    for col in categorical_cols + numerical_cols:
        if col not in df_model.columns:
            print(f"Warning: {col} missing from dataset.")
            if col in numerical_cols: df_model[col] = 0
            else: df_model[col] = "Unknown"
            
    X = df_model[categorical_cols + numerical_cols]
    y = df_model['Selling_Price']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ])
    
    models = {
        'Linear Regression': LinearRegression(),
        'Decision Tree Regressor': DecisionTreeRegressor(random_state=42),
        'Random Forest Regressor': RandomForestRegressor(n_estimators=100, random_state=42),
        'Gradient Boosting Regressor': GradientBoostingRegressor(n_estimators=100, random_state=42)
    }
    
    results = {}
    best_r2 = -float('inf')
    best_model_name = ""
    best_pipeline = None
    
    for name, regressor in models.items():
        pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('regressor', regressor)])
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        
        results[name] = {
            'R2': round(r2, 4),
            'MAE': round(mae, 4),
            'MSE': round(mse, 4),
            'RMSE': round(rmse, 4)
        }
        
        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            best_pipeline = pipeline
            
    # Save Report
    reports_dir = os.path.join(base_path, 'reports')
    os.makedirs(reports_dir, exist_ok=True)
    report_df = pd.DataFrame(results).T
    report_df.to_csv(os.path.join(reports_dir, 'model_comparison.csv'))
    
    # Save Model
    models_dir = os.path.join(base_path, 'models')
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(best_pipeline, os.path.join(models_dir, 'car_price_model.pkl'))
    
    # Save feature columns
    metadata = {
        'categorical_cols': categorical_cols,
        'numerical_cols': numerical_cols,
        'best_model': best_model_name,
        'r2_score': best_r2
    }
    with open(os.path.join(models_dir, 'metadata.json'), 'w') as f:
        json.dump(metadata, f)
        
    return {
        "success": True,
        "best_model": best_model_name,
        "metrics": results
    }

if __name__ == "__main__":
    base = '..' if os.path.basename(os.getcwd()) == 'src' else '.'
    res = run_pipeline(base_path=base)
    print("Pipeline Results:", res)
