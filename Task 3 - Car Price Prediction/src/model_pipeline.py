import joblib
import json
import pandas as pd
import numpy as np

class CarPricePredictor:
    def __init__(self, model_path='models/car_price_model.pkl', meta_path='models/metadata.json'):
        self.model = joblib.load(model_path)
        with open(meta_path, 'r') as f:
            self.metadata = json.load(f)
            
    def predict(self, data):
        """
        data expected format:
        {
            "Brand": str,
            "Model": str,
            "Year": int,
            "Driven_kms": int,
            "Fuel_Type": str,
            "Transmission": str,
            "MPG": float,
            "Engine_Size": float,
            "Tax": float
        }
        """
        try:
            input_df = pd.DataFrame([data])
            input_df['Car_Age'] = 2024 - input_df['Year']
            
            # Predict
            pred = self.model.predict(input_df)[0]
            
            confidence = self.metadata.get('r2_score', 0.90) * 100
            
            # Formulate response
            margin = max(500, pred * 0.05)
            
            return {
                "success": True,
                "predicted_price": float(round(pred, 2)),
                "estimated_range": f"{float(round(pred - margin, 2))} - {float(round(pred + margin, 2))}",
                "confidence_score": f"{round(confidence, 1)}%"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

if __name__ == "__main__":
    predictor = CarPricePredictor('../models/car_price_model.pkl', '../models/metadata.json')
    test_data = {
        "Brand": "BMW",
        "Model": "3 Series",
        "Year": 2020,
        "Driven_kms": 30000,
        "Fuel_Type": "Petrol",
        "Transmission": "Automatic",
        "MPG": 30.5,
        "Engine_Size": 2.0,
        "Tax": 145.0
    }
    print(predictor.predict(test_data))
