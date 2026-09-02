from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import random
import os
import warnings
warnings.filterwarnings('ignore')

# Serve React build from dist folder
DIST_DIR = os.path.join(os.path.dirname(__file__), '..', 'dist')
app = Flask(__name__, static_folder=DIST_DIR, static_url_path='')
CORS(app)

# Serve React index.html for root and any non-API routes
@app.route('/')
def serve_root():
    return send_from_directory(DIST_DIR, 'index.html')

@app.errorhandler(404)
def not_found(e):
    # For SPA routing, serve index.html for non-API 404s
    if not request.path.startswith('/api'):
        return send_from_directory(DIST_DIR, 'index.html')
    return jsonify({'error': 'Not found'}), 404


# --- PATHS ---
MODEL_PATH = 'xgboost_fuel_model.pkl'
ENCODER_PATH = 'encoders.pkl'
DATA_PATH = os.path.join(os.path.dirname(__file__), 'ship_dataset_v2_augmented.csv')

# --- CO2 and COST multipliers (same physics rules) ---
CO2_MULT = {'Ammonia': 0.05, 'Diesel': 0.95, 'HFO': 1.0, 'Hydrogen': 0.0, 'LNG': 0.75, 'Methanol': 0.90}
COST_MULT = {'Ammonia': 900, 'Diesel': 600, 'HFO': 500, 'Hydrogen': 1500, 'LNG': 450, 'Methanol': 700}

# --- TRAIN MODEL IF NOT EXISTS ---
def train_model():
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import LabelEncoder
    from xgboost import XGBRegressor

    print("[INFO] Training XGBoost model from CSV...")
    df = pd.read_csv(DATA_PATH)

    features = ['ship_type', 'distance', 'fuel_type', 'weather_conditions', 'speed', 'load']
    target = 'fuel_consumption'

    X = df[features].copy()
    y = df[target]

    encoders = {}
    for col in ['ship_type', 'fuel_type', 'weather_conditions']:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)

    from sklearn.metrics import r2_score
    preds = model.predict(X_test)
    print(f"[INFO] Model trained. R2 Score: {r2_score(y_test, preds)*100:.2f}%")

    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoders, ENCODER_PATH)
    return model, encoders

# --- LOAD OR TRAIN ---
if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
    print("[INFO] Model and Encoders loaded from .pkl files.")
else:
    model, encoders = train_model()


# ===================== API ENDPOINTS =====================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': True})


@app.route('/api/predict', methods=['POST'])
def predict_fuel():
    """Predict fuel consumption for a single voyage."""
    data = request.json
    try:
        ship_type = encoders['ship_type'].transform([data['ship_type']])[0]
        fuel_type = encoders['fuel_type'].transform([data['fuel_type']])[0]
        weather = encoders['weather_conditions'].transform([data['weather']])[0]
        speed = float(data['speed'])
        load = float(data['load'])
        distance = float(data['distance'])

        input_df = pd.DataFrame([[ship_type, distance, fuel_type, weather, speed, load]],
                                columns=['ship_type', 'distance', 'fuel_type', 'weather_conditions', 'speed', 'load'])

        pred_fuel = float(model.predict(input_df)[0])
        co2 = pred_fuel * 2.75 * CO2_MULT[data['fuel_type']]
        cost = (pred_fuel * COST_MULT[data['fuel_type']]) / 1000

        return jsonify({
            'fuel_consumption': round(pred_fuel, 2),
            'co2_emissions': round(co2, 2),
            'operational_cost': round(cost, 2),
            'fuel_type': data['fuel_type'],
            'ship_type': data['ship_type']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/optimize', methods=['POST'])
def optimize_fleet():
    """Run QPSO optimization for a voyage."""
    data = request.json
    try:
        distance = float(data['distance'])
        load = float(data['load'])
        weather_text = data['weather']
        weather_encoded = encoders['weather_conditions'].transform([weather_text])[0]

        # --- QPSO Algorithm ---
        num_particles = 30
        max_iter = 60
        dimensions = 3  # [ship, fuel, speed]

        positions = np.zeros((num_particles, dimensions))
        for i in range(num_particles):
            positions[i] = [random.uniform(0, 3), random.uniform(0, 5), random.uniform(10, 22)]

        pbest_positions = np.copy(positions)
        pbest_scores = np.full(num_particles, float('inf'))
        gbest_position = np.zeros(dimensions)
        gbest_score = float('inf')
        best_stats = None

        # Encoded CO2/Cost multipliers (by encoded index)
        ship_classes = encoders['ship_type'].classes_
        fuel_classes = encoders['fuel_type'].classes_

        co2_encoded = {}
        cost_encoded = {}
        for i, f in enumerate(fuel_classes):
            co2_encoded[i] = CO2_MULT[f]
            cost_encoded[i] = COST_MULT[f]

        for iteration in range(max_iter):
            mbest = np.mean(pbest_positions, axis=0)
            beta = 1.0 - (iteration / max_iter) * 0.5

            for i in range(num_particles):
                ship = int(np.clip(round(positions[i][0]), 0, 3))
                fuel = int(np.clip(round(positions[i][1]), 0, 5))
                speed = np.clip(positions[i][2], 10.0, 22.0)

                input_df = pd.DataFrame([[ship, distance, fuel, weather_encoded, speed, load]],
                                        columns=['ship_type', 'distance', 'fuel_type', 'weather_conditions', 'speed', 'load'])
                pred_fuel = float(model.predict(input_df)[0])

                co2 = pred_fuel * 2.75 * co2_encoded[fuel]
                cost = (pred_fuel * cost_encoded[fuel]) / 1000
                score = (co2 * 1.5) + (cost * 10)

                if score < pbest_scores[i]:
                    pbest_scores[i] = score
                    pbest_positions[i] = positions[i].copy()

                if score < gbest_score:
                    gbest_score = score
                    gbest_position = positions[i].copy()
                    best_stats = {
                        'ship_type': ship_classes[ship],
                        'fuel_type': fuel_classes[fuel],
                        'speed': round(float(speed), 2),
                        'fuel_consumption': round(pred_fuel, 2),
                        'co2_emissions': round(co2, 2),
                        'operational_cost': round(cost, 2),
                        'fitness_score': round(score, 2)
                    }

                # Quantum Jump
                for j in range(dimensions):
                    phi = random.random()
                    p = phi * pbest_positions[i][j] + (1 - phi) * gbest_position[j]
                    u = random.random()
                    L = beta * abs(mbest[j] - positions[i][j])
                    if random.random() > 0.5:
                        positions[i][j] = p + L * np.log(1 / max(u, 1e-10))
                    else:
                        positions[i][j] = p - L * np.log(1 / max(u, 1e-10))

        # --- Generate optimization for ALL ship types ---
        all_results = []
        for s_idx, s_name in enumerate(ship_classes):
            best_for_ship = None
            best_score_ship = float('inf')
            for f_idx, f_name in enumerate(fuel_classes):
                for spd in np.arange(10, 23, 2):
                    input_df = pd.DataFrame([[s_idx, distance, f_idx, weather_encoded, spd, load]],
                                            columns=['ship_type', 'distance', 'fuel_type', 'weather_conditions', 'speed', 'load'])
                    pf = float(model.predict(input_df)[0])
                    c2 = pf * 2.75 * co2_encoded[f_idx]
                    ct = (pf * cost_encoded[f_idx]) / 1000
                    sc = (c2 * 1.5) + (ct * 10)
                    if sc < best_score_ship:
                        best_score_ship = sc
                        emission_level = 'Low' if c2 < 5000 else ('Medium' if c2 < 15000 else 'High')
                        best_for_ship = {
                            'ship_type': s_name,
                            'units_deployed': random.randint(200, 450),
                            'avg_fuel': round(pf, 1),
                            'emission_level': emission_level,
                            'cost_index': round(ct, 2)
                        }
            all_results.append(best_for_ship)

        return jsonify({
            'qpso_best': best_stats,
            'fleet_table': all_results,
            'iterations': max_iter,
            'particles': num_particles
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get fleet overview statistics."""
    try:
        df = pd.read_csv(DATA_PATH)
        total_units = len(df)
        ship_types = df['ship_type'].nunique()
        routes = df['route_id'].nunique() if 'route_id' in df.columns else 4
        avg_fuel = round(df['fuel_consumption'].mean(), 2)
        avg_co2 = round(df['CO2_emissions'].mean(), 2)

        # Fleet allocation data for pie chart
        allocation = df['ship_type'].value_counts().to_dict()

        # Avg fuel per ship type for bar chart
        fuel_by_type = df.groupby('ship_type')['fuel_consumption'].mean().round(1).to_dict()

        return jsonify({
            'total_units': total_units,
            'ship_types': ship_types,
            'routes': routes,
            'avg_fuel': avg_fuel,
            'avg_co2': avg_co2,
            'allocation': allocation,
            'fuel_by_type': fuel_by_type
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    print("\n[SERVER] Green Fleet Optimizer API running on http://localhost:5000")
    print("[ENDPOINTS] /api/health, /api/predict, /api/optimize, /api/stats\n")
    app.run(debug=True, port=5000)
