import React, { useState } from 'react';

const API_URL = '/api';

const shipTypes = ['Oil Service Boat', 'Fishing Trawler', 'Surfer Boat', 'Tanker Ship'];
const fuelTypes = ['HFO', 'Diesel', 'LNG', 'Methanol', 'Ammonia', 'Hydrogen'];
const weatherTypes = ['Calm', 'Moderate', 'Stormy'];

export default function FuelPrediction() {
  const [form, setForm] = useState({
    ship_type: 'Tanker Ship',
    distance: 150,
    fuel_type: 'HFO',
    speed: 14,
    load: 80,
    weather: 'Calm',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'API not reachable. Make sure Flask backend is running on port 5000.' });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="module-label">Module 1</div>
        <h2>Fuel Consumption Prediction</h2>
        <p>Input ship parameters below. Our XGBoost ML model (92.45% accuracy) will predict fuel consumption in real-time.</p>
      </div>

      <div className="prediction-layout">
        {/* Left Side: Form */}
        <div className="card">
          <div className="form-group">
            <label>Ship Type</label>
            <select name="ship_type" value={form.ship_type} onChange={handleChange}>
              {shipTypes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Fuel Type</label>
            <select name="fuel_type" value={form.fuel_type} onChange={handleChange}>
              {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Distance (km)</label>
            <input type="number" name="distance" value={form.distance} onChange={handleChange} min="20" max="500" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Speed (knots)</label>
              <input type="number" name="speed" value={form.speed} onChange={handleChange} min="10" max="22" />
            </div>
            <div className="form-group">
              <label>Load (%)</label>
              <input type="number" name="load" value={form.load} onChange={handleChange} min="50" max="100" />
            </div>
          </div>

          <div className="form-group">
            <label>Weather</label>
            <select name="weather" value={form.weather} onChange={handleChange}>
              {weatherTypes.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <button className="btn-predict" onClick={handlePredict} disabled={loading}>
            {loading ? 'Predicting...' : '🔮 Predict Fuel Consumption'}
          </button>
        </div>

        {/* Right Side: Result */}
        {result && !result.error ? (
          <div className="result-card">
            <div className="result-value">{result.fuel_consumption.toLocaleString()}</div>
            <div className="result-unit">units of fuel / trip</div>
            <div className="result-description" style={{ marginTop: '24px', textAlign: 'left', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>CO₂ Emissions</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>{result.co2_emissions.toLocaleString()} units</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>Operational Cost</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>${result.operational_cost.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Fuel Type</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>{result.fuel_type}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`result-card ${result?.error ? '' : 'empty'}`}>
            <div className="result-value" style={{ fontSize: result?.error ? '1rem' : '1.2rem', color: result?.error ? '#ef4444' : undefined }}>
              {result?.error || 'Enter parameters and click Predict to see results'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
