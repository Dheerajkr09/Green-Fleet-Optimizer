import React, { useState } from 'react';

const API_URL = '/api';
const weatherTypes = ['Calm', 'Moderate', 'Stormy'];

export default function FleetOptimization() {
  const [form, setForm] = useState({ distance: 250, load: 85, weather: 'Stormy' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getBadgeClass = (level) => {
    if (level === 'Low') return 'badge badge-low';
    if (level === 'Medium') return 'badge badge-medium';
    return 'badge badge-high';
  };

  return (
    <div>
      <div className="page-header">
        <div className="module-label">Module 2</div>
        <h2>Fleet Optimization Result</h2>
        <p>Enter voyage requirements. QPSO (Quantum Particle Swarm Optimization) will find the best ship-fuel-speed combination.</p>
      </div>

      {/* Input Form */}
      <div className="card" style={{ marginBottom: '24px', maxWidth: '600px' }}>
        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="form-group">
            <label>Distance (km)</label>
            <input type="number" name="distance" value={form.distance} onChange={handleChange} min="20" max="500" />
          </div>
          <div className="form-group">
            <label>Load (%)</label>
            <input type="number" name="load" value={form.load} onChange={handleChange} min="50" max="100" />
          </div>
          <div className="form-group">
            <label>Weather</label>
            <select name="weather" value={form.weather} onChange={handleChange}>
              {weatherTypes.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-predict" onClick={handleOptimize} disabled={loading}>
          {loading ? '⚛️ Running QPSO...' : '⚛️ Run Quantum Optimization'}
        </button>
      </div>

      {/* QPSO Best Result */}
      {result?.qpso_best && (
        <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ marginBottom: '12px', color: '#10b981' }}>⚡ QPSO Global Best Solution</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Best Ship</span><div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{result.qpso_best.ship_type}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Best Fuel</span><div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{result.qpso_best.fuel_type}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Optimal Speed</span><div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{result.qpso_best.speed} knots</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Fuel Consumed</span><div style={{ fontWeight: 700 }}>{result.qpso_best.fuel_consumption.toLocaleString()} units</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>CO₂ Emissions</span><div style={{ fontWeight: 700 }}>{result.qpso_best.co2_emissions.toLocaleString()} units</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cost</span><div style={{ fontWeight: 700 }}>${result.qpso_best.operational_cost.toLocaleString()}</div></div>
          </div>
        </div>
      )}

      {/* Fleet Table */}
      {result?.fleet_table && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Per-Ship Optimal Allocation</h3>
          <table className="optimization-table">
            <thead>
              <tr>
                <th>Ship Type</th>
                <th>Units Deployed</th>
                <th>Avg Fuel/day</th>
                <th>Emission Level</th>
                <th>Cost Index</th>
              </tr>
            </thead>
            <tbody>
              {result.fleet_table.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{row.ship_type}</td>
                  <td>{row.units_deployed}</td>
                  <td>{row.avg_fuel.toLocaleString()}</td>
                  <td><span className={getBadgeClass(row.emission_level)}>{row.emission_level}</span></td>
                  <td>${row.cost_index.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="optimization-note">
            ⚛️ Optimized via Quantum PSO ({result.particles} particles × {result.iterations} iterations). Algorithm uses Schrödinger-inspired quantum update mechanics.
          </div>
        </div>
      )}
    </div>
  );
}
