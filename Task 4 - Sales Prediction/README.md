# K.M.A² Advanced Sales Prediction Intelligence System

## Overview
The **K.M.A² Advanced Sales Prediction System** is a professional, enterprise-grade AI decision and sales forecasting platform. Developed as part of the CodeAlpha Data Science internship, this project goes far beyond a standard Jupyter Notebook script. It is a fully interactive, responsive web application built with Python (Flask) and a visually stunning UI.

It takes advertising budget inputs across three channels (TV, Radio, Newspaper) and utilizes a powerful **Random Forest Regressor** Machine Learning model to accurately predict future sales.

## 🚀 Key Features

* **Real-time AI Forecasting:** Predict sales instantly by tweaking advertising budgets.
* **Executive Report Center:** Automatically generates dynamic business insights and strategic marketing recommendations based on calculated predictions.
* **AI Decision Center:** Visually highlights the most impactful marketing channel and provides a risk/confidence analysis.
* **Scenario Comparison Engine:** Allows users to run up to three different budget scenarios in parallel and compare the projected outcomes visually.
* **Advanced UI/UX:** 
  * Premium Glassmorphism design system.
  * Three distinct themes: **Dark**, **Light**, and the exclusive **Premium Midnight Theme**.
  * Cinematic staggered animations and dynamic rendering via JavaScript.
* **Dynamic Charting:** Interactive, theme-adaptive charts powered by Chart.js.

## 🛠️ Technology Stack

* **Backend:** Python 3, Flask
* **Machine Learning:** Scikit-Learn, Pandas, NumPy (Random Forest Regressor)
* **Frontend:** HTML5, Vanilla CSS3, JavaScript (ES6+)
* **Data Visualization:** Chart.js
* **Icons & Fonts:** FontAwesome, Google Fonts (Orbitron, Rajdhani, Poppins)

## 📦 Project Structure

```text
📁 Sales Prediction
├── 📁 dataset
│   └── Advertising.csv       # The source data
├── 📁 static
│   ├── 📁 assets             # Backgrounds & logos
│   ├── 📁 css
│   │   └── style.css         # Custom UI & Theme styling
│   └── 📁 js
│       └── main.js           # Dynamic logic, API calls, Chart.js
├── 📁 templates
│   └── index.html            # Main web application interface
├── app.py                    # Flask server & API endpoints
├── ml_pipeline.py            # Script for data cleaning & model training
├── model.joblib              # The trained Random Forest model
├── metrics.json              # Model evaluation metrics (R2, MSE, MAE)
└── requirements.txt          # Python dependencies
```

## ⚙️ How to Run Locally

1. **Clone the Repository**
2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Train the Model (Optional):**
   If you want to retrain the AI model from scratch:
   ```bash
   python ml_pipeline.py
   ```
4. **Start the Application:**
   ```bash
   python app.py
   ```
5. **Open in Browser:**
   Navigate to `http://127.0.0.1:5000` to view the application.

## 📝 Internship Details
* **Company:** CodeAlpha
* **Domain:** Data Science
* **Task:** Task 4 - Sales Prediction using Python

## 👤 Developer
**Mohammed Asjad Aliyan K**
*Founder • AI Systems Developer • Creator of the KMA² Ecosystem*
