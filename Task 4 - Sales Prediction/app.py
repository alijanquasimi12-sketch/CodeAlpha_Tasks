from flask import Flask, render_template, jsonify, request
import joblib
import pandas as pd
import json
from ml_pipeline import get_eda_data
import os

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

# Load model and metrics on startup
model = joblib.load('model.joblib')
with open('metrics.json', 'r') as f:
    metrics = json.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        tv = float(data.get('tv', 0))
        radio = float(data.get('radio', 0))
        newspaper = float(data.get('newspaper', 0))
        
        # Predict
        input_df = pd.DataFrame([[tv, radio, newspaper]], columns=['TV', 'Radio', 'Newspaper'])
        prediction = model.predict(input_df)[0]
        
        return jsonify({'prediction': round(prediction, 2), 'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

@app.route('/api/data', methods=['GET'])
def data_endpoint():
    try:
        eda_data = get_eda_data()
        return jsonify({
            'metrics': metrics,
            'eda': eda_data,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
