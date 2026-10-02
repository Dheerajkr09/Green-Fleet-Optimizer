import React, { useState } from 'react';
import { Atom, Zap, Ship, Fuel, Gauge, DollarSign, Leaf, Loader2 } from 'lucide-react';

const API_URL = '/api';
const weatherTypes = ['Calm', 'Moderate', 'Stormy'];

export default function FleetOptimization({ setOptimizationResult }) {
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
      if (setOptimizationResult) setOptimizationResult(data);
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
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(167, 139, 250, 0.08)',
          borderRadius: '6px',
          marginBottom: '12px',
        }}>
          <Atom size={12} style={{ color: 'var(--accent-purple)' }} />
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--accent-purple)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>Quantum Optimization</span>
        </div>
        <h2>Fleet Optimization Result</h2>
        <p>Enter voyage requirements. QPSO (Quantum Particle Swarm Optimization) will find the best ship-fuel-speed combination.</p>
      </div>

      {/* Input Form */}
      <div className="card quantum-grid-bg" style={{ marginBottom: '24px', maxWidth: '640px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--card-border)',
        }}>
          <span style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>Voyage Parameters</span>
        </div>

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
        <button className="btn-predict" onClick={handleOptimize} disabled={loading} style={{
          background: 'linear-gradient(135deg, var(--accent-purple), #7C3AED)',
        }}>
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Running QPSO...
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Atom size={16} />
              Run Quantum Optimization
            </span>
          )}
        </button>
      </div>

      {/* QPSO Best Result */}
      {result?.qpso_best && (
        <div className="card" style={{
          marginBottom: '24px',
          borderLeft: '3px solid var(--accent-purple)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle quantum grid overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(167, 139, 250, 0.03) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(167, 139, 250, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Zap size={16} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '2px' }}>QPSO Global Best Solution</h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quantum-optimized allocation</span>
            </div>
          </div>

          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {[
              { label: 'Best Ship', value: result.qpso_best.ship_type, icon: Ship, color: 'var(--accent-primary)' },
              { label: 'Best Fuel', value: result.qpso_best.fuel_type, icon: Fuel, color: 'var(--accent-green)' },
              { label: 'Optimal Speed', value: `${result.qpso_best.speed} knots`, icon: Gauge, color: 'var(--accent-amber)' },
              { label: 'Fuel Consumed', value: `${result.qpso_best.fuel_consumption.toLocaleString()} units`, icon: Fuel, color: 'var(--accent-teal)' },
              { label: 'CO₂ Emissions', value: `${result.qpso_best.co2_emissions.toLocaleString()} units`, icon: Leaf, color: 'var(--accent-green)' },
              { label: 'Cost', value: `$${result.qpso_best.operational_cost.toLocaleString()}`, icon: DollarSign, color: 'var(--accent-amber)' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.03)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                  }}>
                    <Icon size={13} style={{ color: item.color, opacity: 0.7 }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.88rem',
                  }}>{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fleet Table */}
      {result?.fleet_table && (
        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--card-border)',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Per-Ship Optimal Allocation</h3>
            <span style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.04)',
              padding: '3px 8px',
              borderRadius: '4px',
            }}>{result.fleet_table.length} vessels</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="optimization-table">
              <thead>
                <tr>
                  <th>Ship Type</th>
                  <th>Best Fuel</th>
                  <th>Optimal Speed</th>
                  <th>Fuel (units)</th>
                  <th>CO₂ Emissions</th>
                  <th>Cost Index</th>
                </tr>
              </thead>
              <tbody>
                {result.fleet_table.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.ship_type}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        background: 'rgba(52, 211, 153, 0.08)',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        color: 'var(--accent-green)',
                        fontWeight: 500,
                      }}>{row.best_fuel_type}</span>
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.84rem' }}>{row.optimal_speed} kn</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.84rem' }}>{row.avg_fuel.toLocaleString()}</td>
                    <td>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.84rem' }}>{row.co2_exact.toLocaleString()}</span>
                      <span className={getBadgeClass(row.emission_level)} style={{ marginLeft: '8px' }}>{row.emission_level}</span>
                    </td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.84rem', color: 'var(--accent-amber)' }}>${row.cost_index.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="optimization-note">
            ⚛️ Optimized via Quantum PSO ({result.particles} particles × {result.iterations} iterations). Algorithm uses Schrödinger-inspired quantum update mechanics.
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
