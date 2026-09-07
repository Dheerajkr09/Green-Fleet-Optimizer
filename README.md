# 🚢 Green Fleet Optimizer — Quantum-Inspired Fuel Optimization

> **SIH 2026 | Problem ID: 26138**  
> AI-driven fleet optimization system using XGBoost ML + Quantum Particle Swarm Optimization (QPSO) for fuel prediction, emission reduction, and cost-optimal ship deployment.

---

## 🌟 Features

| Module | Description |
|---|---|
| **Fuel Prediction** | XGBoost ML model predicts fuel consumption based on ship type, speed, load, weather, fuel type & distance |
| **Fleet Optimization** | Quantum-Inspired PSO (QPSO) algorithm finds optimal ship-fuel-speed combinations minimizing emissions + cost |
| **Visualization** | Interactive Doughnut & Bar charts for fleet allocation and fuel consumption analysis |
| **Report** | Downloadable/printable summary report of optimization results |

---

## 🛠️ Tech Stack

- **ML Engine**: XGBoost Regressor (92.45% R² accuracy)
- **Optimization**: Quantum Particle Swarm Optimization (QPSO) with Schrodinger-inspired probability updates
- **Backend**: Flask (Python) REST API
- **Frontend**: React (Vite) with Recharts
- **Data**: IMO/IRENA-aligned physics-based fuel & emission multipliers

---

## 📂 Project Structure

```
Green-Fleet-Optimizer/
├── backend/
│   ├── app.py                          # Flask API + QPSO engine
│   ├── xgboost_fuel_model.pkl          # Trained XGBoost model
│   ├── encoders.pkl                    # Label encoders for categorical features
│   └── ship_dataset_v2_augmented.csv   # Training dataset
├── src/
│   ├── App.jsx                         # Main React app with sidebar navigation
│   ├── main.jsx                        # React entry point
│   ├── index.css                       # Global styles
│   └── components/
│       ├── Overview.jsx                # Fleet overview dashboard
│       ├── FuelPrediction.jsx          # Fuel prediction form + results
│       ├── FleetOptimization.jsx       # QPSO optimization interface
│       ├── Visualization.jsx           # Charts (Doughnut + Bar)
│       └── Report.jsx                  # Summary report with print
├── dist/                               # Production build (pre-built)
├── requirements.txt                    # Python dependencies
├── package.json                        # Node.js dependencies
├── vite.config.js                      # Vite configuration
├── index.html                          # HTML entry point
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- Python 3.9+
- Node.js 18+ (only needed if you want to modify frontend)

### Quick Start (Backend Only — Serves Full Website)

```bash
# 1. Clone the repo
git clone https://github.com/Dheerajkr09/Green-Fleet-Optimizer.git
cd Green-Fleet-Optimizer

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the server
cd backend
python app.py
```

Open **http://localhost:5000** in your browser. That's it!

### Frontend Development (Optional)

```bash
# Install Node dependencies
npm install

# Start dev server (hot reload)
npm run dev
```

Frontend dev server runs on **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/predict` | Predict fuel consumption |
| POST | `/api/optimize` | Run QPSO fleet optimization |
| GET | `/api/stats` | Get fleet statistics for charts |

### Example Predict Request
```json
POST /api/predict
{
  "ship_type": "Tanker Ship",
  "fuel_type": "HFO",
  "distance": 200,
  "speed": 14,
  "load": 85,
  "weather": "Moderate"
}
```

---

## 🧠 How QPSO Works

The Quantum Particle Swarm Optimization engine:
1. **Generates particles** — each representing a ship-fuel-speed combination
2. **Evaluates fitness** — `fitness = (CO2 * 1.5) + (Cost * 10)` (lower = better)
3. **Quantum probability update** — uses Schrodinger-inspired wave function collapse for position updates
4. **Converges** — finds globally optimal deployment after multiple iterations

---


---

## 📄 License

This project is built for Smart India Hackathon (SIH) 2026.
