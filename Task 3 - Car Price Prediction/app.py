from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from src.model_pipeline import CarPricePredictor
from src.train_model import run_pipeline
from src.data_processing import DataProcessor
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'datasets'

# Initialize Predictor and Processor
predictor = None
processor = DataProcessor(dataset_path=os.path.join(app.config['UPLOAD_FOLDER'], 'premium_car_data.csv'))

def load_predictor():
    global predictor
    try:
        predictor = CarPricePredictor(model_path='models/car_price_model.pkl', meta_path='models/metadata.json')
    except Exception as e:
        print(f"Warning: Could not load model initially. {e}")
        predictor = None

load_predictor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

@app.route('/upload', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    if file and file.filename.endswith('.csv'):
        filename = secure_filename('premium_car_data.csv')
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(filepath)
        processor.dataset_path = filepath
        info = processor.load_data()
        return jsonify({"success": True, "info": info})
    return jsonify({"success": False, "error": "Invalid file format, please upload a CSV."}), 400

@app.route('/clean', methods=['POST'])
def clean_data():
    try:
        info = processor.clean_data()
        return jsonify({"success": True, "info": info})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/eda', methods=['GET'])
def get_eda():
    try:
        stats = processor.get_eda_stats()
        return jsonify({"success": True, "stats": stats})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/train', methods=['POST'])
def train_model():
    try:
        results = run_pipeline(dataset_path='datasets/premium_car_data.csv', base_path='.')
        load_predictor() # reload model
        return jsonify(results)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    if not predictor:
        return jsonify({"success": False, "error": "Model not loaded"}), 500
        
    try:
        data = request.json
        model_input = {
            "Brand": data.get("Brand", "Hyundai"),
            "Model": data.get("Model", "i20"),
            "Year": int(data.get("Year", 2024)),
            "Driven_kms": int(data.get("Driven_kms", 0)),
            "Fuel_Type": data.get("Fuel_Type", "Petrol"),
            "Transmission": data.get("Transmission", "Manual"),
            "MPG": float(data.get("MPG", 35.0)),
            "Engine_Size": float(data.get("Engine_Size", 1.2)),
            "Tax": float(data.get("Tax", 100.0))
        }
        
        result = predictor.predict(model_input)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
