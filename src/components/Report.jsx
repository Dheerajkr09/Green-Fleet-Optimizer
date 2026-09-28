import React from 'react';
import { Printer } from 'lucide-react';

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
          <h2>Summary Report</h2>
          <p>Run a Quantum Optimization first to generate the report.</p>
        </div>
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: '#5C6470' }}>
          No optimization data available yet. Go to Fleet Optimization and run QPSO to generate the report.
        </div>
      </div>
    );
  }

  const { qpso_best, fleet_table } = optimizationResult;

  // Find lowest CO2 and lowest cost from fleet_table
  const greenestShip = [...fleet_table].sort((a, b) => a.co2_exact - b.co2_exact)[0];
  const cheapestShip = [...fleet_table].sort((a, b) => a.cost_index - b.cost_index)[0];

  const reportData = [
    { label: 'Global Best Ship', value: qpso_best.ship_type },
    { label: 'Global Best Fuel', value: qpso_best.fuel_type },
    { label: 'Optimal Speed', value: `${qpso_best.speed} knots` },
    { label: 'Fuel Consumed', value: `${qpso_best.fuel_consumption.toLocaleString()} units` },
    { label: 'CO₂ Emissions', value: `${qpso_best.co2_emissions.toLocaleString()} units` },
    { label: 'Operational Cost', value: `$${qpso_best.operational_cost.toLocaleString()}` },
    { label: 'Greenest Alternative', value: `${greenestShip.ship_type} (${greenestShip.best_fuel_type})` },
    { label: 'Cheapest Alternative', value: `${cheapestShip.ship_type} (${cheapestShip.best_fuel_type})` },
    { label: 'Optimization Method', value: 'Quantum Particle Swarm Optimization (QPSO)' },
    { label: 'ML Model Used', value: 'Advanced Gradient Boosting (High Accuracy)' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Optimization Summary Report</h2>
        <p>Your optimization run's final summary — share or download (print layout ready).</p>
      </div>

      <div className="report-card">
        <h3>Fleet Deployment Summary</h3>
        <div className="report-date">Generated: {now}</div>

        {reportData.map((row, i) => (
          <div className="report-row" key={i}>
            <span className="report-label">{row.label}</span>
            <span className="report-value">{row.value}</span>
          </div>
        ))}

        <button className="btn-report" onClick={handlePrint}>
          <Printer size={18} />
          Download / Print Report
        </button>
      </div>
    </div>
  );
}
