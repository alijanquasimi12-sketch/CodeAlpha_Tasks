import pandas as pd
import numpy as np
import random
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

# Define the brands and models
brands_models = {
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M4'],
    'Audi': ['A3', 'A4', 'Q5', 'Q7', 'R8'],
    'Hyundai': ['i20', 'Creta', 'Tucson', 'Elantra', 'Verna'],
    'Toyota': ['Corolla', 'Camry', 'Fortuner', 'Innova', 'Land Cruiser'],
    'Skoda': ['Octavia', 'Superb', 'Kodiaq', 'Slavia'],
    'Ford': ['Fiesta', 'Focus', 'Mustang', 'EcoSport', 'Endeavour'],
    'Volkswagen': ['Polo', 'Golf', 'Tiguan', 'Passat', 'Taigun']
}

fuel_types = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
transmissions = ['Manual', 'Automatic', 'Semi-Automatic']

data = []
num_records = 2500

for _ in range(num_records):
    brand = random.choice(list(brands_models.keys()))
    model = random.choice(brands_models[brand])
    year = random.randint(2015, 2024)
    
    # Base price logic
    base_price = 0
    if brand in ['BMW', 'Audi']: base_price = random.uniform(30000, 80000)
    elif brand in ['Toyota', 'Ford', 'Volkswagen', 'Skoda']: base_price = random.uniform(15000, 45000)
    else: base_price = random.uniform(10000, 30000)
        
    # Depreciation based on year
    age = 2024 - year
    selling_price = base_price * (0.85 ** age)
    
    # Add noise to price
    selling_price = selling_price * random.uniform(0.9, 1.1)
    
    # Mileage logic
    mileage_kms = age * random.uniform(10000, 20000)
    if age == 0: mileage_kms = random.uniform(100, 5000)
        
    # Categoricals
    fuel = random.choices(fuel_types, weights=[0.5, 0.3, 0.15, 0.05])[0]
    transmission = 'Automatic' if brand in ['BMW', 'Audi'] else random.choices(transmissions, weights=[0.4, 0.5, 0.1])[0]
    if fuel == 'Electric': transmission = 'Automatic'
        
    # Advanced KPIs
    mpg = random.uniform(20, 45) if fuel != 'Electric' else random.uniform(100, 150)
    tax = random.uniform(20, 200) if fuel != 'Electric' else 0
    engine_size = random.choice([1.0, 1.2, 1.4, 1.5, 2.0, 3.0, 4.0])
    if fuel == 'Electric': engine_size = 0.0
        
    data.append({
        'Brand': brand,
        'Model': model,
        'Year': year,
        'Selling_Price': round(selling_price, 2),
        'Driven_kms': int(mileage_kms),
        'Fuel_Type': fuel,
        'Transmission': transmission,
        'MPG': round(mpg, 1),
        'Engine_Size': engine_size,
        'Tax': round(tax, 2)
    })

df = pd.DataFrame(data)

# Save to datasets folder
os.makedirs('datasets', exist_ok=True)
output_path = 'datasets/premium_car_data.csv'
df.to_csv(output_path, index=False)
print(f"Successfully generated synthetic dataset at {output_path} with {len(df)} records.")
