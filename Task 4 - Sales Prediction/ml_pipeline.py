import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import json

def train_and_save_model(data_path="dataset/Advertising.csv", model_path="model.joblib", metrics_path="metrics.json"):
    # Load dataset
    df = pd.read_csv(data_path)
    
    # Clean dataset (drop unnamed index column if it exists)
    if 'Unnamed: 0' in df.columns:
        df = df.drop('Unnamed: 0', axis=1)
    elif df.columns[0] == 'Unnamed: 0':
        df = df.drop(df.columns[0], axis=1)
        
    # Also sometimes it's just empty string in read_csv if no header name
    # Let's clean safely by checking for index-like columns
    for col in df.columns:
        if 'Unnamed' in col:
            df = df.drop(col, axis=1)
    
    # Features and Target
    X = df[['TV', 'Radio', 'Newspaper']]
    y = df['Sales']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Evaluate
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    # Feature Importance (Coefficients)
    coefficients = {
        'TV': model.coef_[0],
        'Radio': model.coef_[1],
        'Newspaper': model.coef_[2]
    }
    
    metrics = {
        'MAE': mae,
        'MSE': mse,
        'R2': r2,
        'Coefficients': coefficients,
        'Intercept': model.intercept_
    }
    
    # Save model and metrics
    joblib.dump(model, model_path)
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f)
        
    print(f"Model trained and saved to {model_path}")
    print(f"Metrics: {metrics}")
    
    return model, metrics

def get_eda_data(data_path="dataset/Advertising.csv"):
    df = pd.read_csv(data_path)
    for col in df.columns:
        if 'Unnamed' in col:
            df = df.drop(col, axis=1)
            
    # Summary statistics
    summary = df.describe().to_dict()
    
    # Correlation matrix
    corr = df.corr().to_dict()
    
    # Data for scatter plots 
    data_records = df.to_dict(orient='records')
    
    return {
        'summary': summary,
        'correlation': corr,
        'raw_data': data_records
    }

if __name__ == "__main__":
    train_and_save_model()
