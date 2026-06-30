import pandas as pd
import numpy as np
import os

class DataProcessor:
    def __init__(self, dataset_path='../datasets/premium_car_data.csv'):
        self.dataset_path = dataset_path
        self.df = None

    def load_data(self, file_path=None):
        path = file_path if file_path else self.dataset_path
        if not os.path.exists(path):
            raise FileNotFoundError(f"Dataset not found at {path}")
        self.df = pd.read_csv(path)
        return self.get_dataset_info()

    def get_dataset_info(self):
        if self.df is None:
            return None
        
        info = {
            "columns": list(self.df.columns),
            "dtypes": {col: str(dtype) for col, dtype in self.df.dtypes.items()},
            "shape": self.df.shape,
            "head": self.df.head().to_dict(orient='records'),
            "missing_values": self.df.isnull().sum().to_dict(),
            "duplicates": int(self.df.duplicated().sum())
        }
        return info

    def clean_data(self):
        if self.df is None:
            self.load_data()
        
        # 1. Handle missing values
        for col in self.df.columns:
            if self.df[col].dtype in ['float64', 'int64']:
                self.df[col] = self.df[col].fillna(self.df[col].median())
            else:
                self.df[col] = self.df[col].fillna(self.df[col].mode()[0])
                
        # 2. Remove duplicates
        self.df = self.df.drop_duplicates()
        
        # 3. Standardize Manufacturer/Brand Names (As requested in prompt)
        if 'Brand' in self.df.columns:
            brand_mapping = {
                'audi': 'Audi', 'toyota': 'Toyota', 'vw': 'Volkswagen', 
                'skoda': 'Skoda', 'bmw': 'BMW', 'ford': 'Ford', 'hyundai': 'Hyundai'
            }
            self.df['Brand'] = self.df['Brand'].str.lower().map(brand_mapping).fillna(self.df['Brand'])

        # Save cleaned dataset
        os.makedirs(os.path.dirname(self.dataset_path), exist_ok=True)
        self.df.to_csv(self.dataset_path, index=False)
        
        return self.get_dataset_info()

    def get_eda_stats(self):
        if self.df is None:
            self.load_data()
            
        numeric_df = self.df.select_dtypes(include=['float64', 'int64'])
        
        # Correlation matrix
        corr_matrix = numeric_df.corr().round(2).to_dict()
        
        # Statistical summary
        stats = numeric_df.describe().round(2).to_dict()
        
        return {
            "correlation": corr_matrix,
            "statistics": stats
        }
