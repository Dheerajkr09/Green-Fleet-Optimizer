import React, { useState } from 'react';
import { Cpu, Droplets, DollarSign, Leaf, ChevronRight, Loader2 } from 'lucide-react';

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
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(56, 189, 248, 0.08)',
          borderRadius: '6px',
          marginBottom: '12px',
        }}>
          <Cpu size={12} style={{ color: 'var(--accent-primary)' }} />
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--accent-primary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>ML Prediction Engine</span>
        </div>
        <h2>Fuel Consumption Prediction</h2>
        <p>Input ship parameters below. Our XGBoost ML model (92.45% accuracy) will predict fuel consumption in real-time.</p>
      </div>

      <div className="prediction-layout">
        {/* Left Side: Form */}
        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '22px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--card-border)',
          }}>
            <span style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>Input Parameters</span>
          </div>

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
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Running Model...
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} />
                Predict Fuel Consumption
              </span>
            )}
          </button>
        </div>

        {/* Right Side: Result */}
        {result && !result.error ? (
          <div className="result-card">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(52, 211, 153, 0.08)',
              borderRadius: '6px',
              marginBottom: '18px',
            }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'var(--accent-green)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>Prediction Result</span>
            </div>

            <div className="result-value">{result.fuel_consumption.toLocaleString()}</div>
            <div className="result-unit">units of fuel / trip</div>

            <div className="result-description" style={{ marginTop: '28px', textAlign: 'left', width: '100%' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.84rem',
                }}>
                  <Leaf size={14} style={{ color: 'var(--accent-green)' }} />
                  CO₂ Emissions
                </span>
                <span style={{
                  color: 'var(--accent-green)',
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.84rem',
                }}>{result.co2_emissions.toLocaleString()} units</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.84rem',
                }}>
                  <DollarSign size={14} style={{ color: 'var(--accent-amber)' }} />
                  Operational Cost
                </span>
                <span style={{
                  color: 'var(--accent-amber)',
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.84rem',
                }}>${result.operational_cost.toLocaleString()}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.84rem',
                }}>
                  <Droplets size={14} style={{ color: 'var(--accent-primary)' }} />
                  Fuel Type
                </span>
                <span style={{
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                }}>{result.fuel_type}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`result-card ${result?.error ? '' : 'empty'}`}>
            {result?.error ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(248, 113, 113, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}>⚠</div>
                <div className="result-value" style={{ fontSize: '0.88rem', color: 'var(--accent-red)', fontFamily: 'Inter, sans-serif' }}>
                  {result.error}
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Cpu size={22} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                </div>
                <div className="result-value">
                  Enter parameters and click Predict to see results
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                }}>
                  <ChevronRight size={12} />
                  <span>XGBoost model ready</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
