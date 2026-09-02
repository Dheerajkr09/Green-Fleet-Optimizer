import React from 'react';
import { Printer } from 'lucide-react';

export default function Report() {
  const reportData = [
    { label: 'Total Fleet Units', value: '1,440' },
    { label: 'Total Predicted Fuel Use', value: '~6,852 tons/day' },
    { label: 'Estimated Emission Reduction', value: '18.4%' },
    { label: 'Optimization Method', value: 'Quantum-Inspired Metaheuristic' },
    { label: 'ML Model Used', value: 'XGBoost Regressor (R² = 92.45%)' },
    { label: 'Highest Fuel Contributor', value: 'Tanker Ship' },
    { label: 'Most Efficient Type', value: 'Fishing Trawler' },
    { label: 'Greenest Fuel (Zero CO₂)', value: 'Hydrogen' },
    { label: 'Cheapest Fuel', value: 'LNG' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const now = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <div className="page-header">
        <div className="module-label">Module 4</div>
        <h2>Summary Report</h2>
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
