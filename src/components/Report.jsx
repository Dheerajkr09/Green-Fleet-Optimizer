import React from 'react';
import { Printer, FileText, Ship, Fuel, Gauge, DollarSign, Leaf, Atom, Cpu, Award, TrendingDown } from 'lucide-react';

export default function Report({ optimizationResult }) {
  const handlePrint = () => {
    window.print();
  };

  const now = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!optimizationResult || !optimizationResult.qpso_best) {
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
            <FileText size={12} style={{ color: 'var(--accent-primary)' }} />
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--accent-primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>Report</span>
          </div>
          <h2>Summary Report</h2>
          <p>Run a Quantum Optimization first to generate the report.</p>
        </div>
        <div className="card" style={{
          padding: '72px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          borderStyle: 'dashed',
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
            <FileText size={22} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px', lineHeight: '1.6' }}>
            No optimization data available yet. Go to Fleet Optimization and run QPSO to generate the report.
          </div>
        </div>
      </div>
    );
  }

  const { qpso_best, fleet_table } = optimizationResult;

  // Find lowest CO2 and lowest cost from fleet_table
  const greenestShip = [...fleet_table].sort((a, b) => a.co2_exact - b.co2_exact)[0];
  const cheapestShip = [...fleet_table].sort((a, b) => a.cost_index - b.cost_index)[0];

  const reportData = [
    { label: 'Global Best Ship', value: qpso_best.ship_type, icon: Ship, color: 'var(--accent-primary)' },
    { label: 'Global Best Fuel', value: qpso_best.fuel_type, icon: Fuel, color: 'var(--accent-green)' },
    { label: 'Optimal Speed', value: `${qpso_best.speed} knots`, icon: Gauge, color: 'var(--accent-amber)' },
    { label: 'Fuel Consumed', value: `${qpso_best.fuel_consumption.toLocaleString()} units`, icon: Fuel, color: 'var(--accent-teal)' },
    { label: 'CO₂ Emissions', value: `${qpso_best.co2_emissions.toLocaleString()} units`, icon: Leaf, color: 'var(--accent-green)' },
    { label: 'Operational Cost', value: `$${qpso_best.operational_cost.toLocaleString()}`, icon: DollarSign, color: 'var(--accent-amber)' },
    { label: 'Greenest Alternative', value: `${greenestShip.ship_type} (${greenestShip.best_fuel_type})`, icon: TrendingDown, color: 'var(--accent-green)' },
    { label: 'Cheapest Alternative', value: `${cheapestShip.ship_type} (${cheapestShip.best_fuel_type})`, icon: Award, color: 'var(--accent-amber)' },
    { label: 'Optimization Method', value: 'Quantum Particle Swarm Optimization (QPSO)', icon: Atom, color: 'var(--accent-purple)' },
    { label: 'ML Model Used', value: 'Advanced Gradient Boosting (High Accuracy)', icon: Cpu, color: 'var(--accent-primary)' },
  ];

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
          <FileText size={12} style={{ color: 'var(--accent-primary)' }} />
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--accent-primary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>Export</span>
        </div>
        <h2>Optimization Summary Report</h2>
        <p>Your optimization run's final summary — share or download (print layout ready).</p>
      </div>

      <div className="report-card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}>
          <h3>Fleet Deployment Summary</h3>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            background: 'rgba(52, 211, 153, 0.08)',
            borderRadius: '20px',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--accent-green)',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-green)',
              display: 'inline-block',
            }} />
            Completed
          </span>
        </div>
        <div className="report-date">Generated: {now}</div>

        {reportData.map((row, i) => {
          const Icon = row.icon;
          return (
            <div className="report-row" key={i}>
              <span className="report-label" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Icon size={14} style={{ color: row.color, opacity: 0.7, flexShrink: 0 }} />
                {row.label}
              </span>
              <span className="report-value">{row.value}</span>
            </div>
          );
        })}

        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '28px',
          flexWrap: 'wrap',
        }}>
          <button className="btn-report" onClick={handlePrint}>
            <Printer size={16} />
            Download / Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
