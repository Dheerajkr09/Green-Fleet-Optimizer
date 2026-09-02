import React from 'react';

const stats = [
  { value: '4', label: 'Ship Types Tracked' },
  { value: '1,440', label: 'Total Fleet Units' },
  { value: '18.4%', label: 'Avg. Fuel Saved (est.)' },
  { value: '4', label: 'Operational Routes' },
];

const modules = [
  {
    title: 'Fuel Prediction',
    desc: 'Estimate fuel consumption based on speed, load, weather conditions, and ship type using our trained ML model.',
    link: 'prediction',
    action: 'Show Module →',
  },
  {
    title: 'Fleet Optimization',
    desc: 'Multi-objective — min fuel, min emissions, min cost — optimals via quantum QPSO.',
    link: 'optimization',
    action: 'Calculate QPSO →',
  },
  {
    title: 'Visualization',
    desc: 'Analyze fleet allocation and emission profiles through interactive charts and visual drill-downs.',
    link: 'visualization',
    action: 'Go to charts →',
  },
  {
    title: 'Report',
    desc: 'View the final optimization summary in a downloadable and printable report format.',
    link: 'report',
    action: 'Print Report →',
  },
];

export default function Overview({ setActiveTab }) {
  return (
    <div>
      <div className="page-header">
        <div className="module-label">Module 0</div>
        <h2>Fleet Overview</h2>
        <p>
          Key performance indicators and a consolidated view of all platform modules. Track ship types, fuel efficiency, and route analytics in real time.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="modules-grid">
        {modules.map((m, i) => (
          <div className="module-card" key={i}>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            <button className="module-link" onClick={() => setActiveTab(m.link)}>
              {m.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
