import React from 'react';
import { Fuel, Ship, BarChart3, FileText, TrendingDown, Route, Waves, Zap } from 'lucide-react';

const stats = [
  { value: '4', label: 'Ship Types Tracked', icon: Ship, accent: 'var(--accent-primary)' },
  { value: '1,440', label: 'Total Fleet Units', icon: Waves, accent: 'var(--accent-teal)' },
  { value: '18.4%', label: 'Avg. Fuel Saved (est.)', icon: TrendingDown, accent: 'var(--accent-green)' },
  { value: '4', label: 'Operational Routes', icon: Route, accent: 'var(--accent-amber)' },
];

const modules = [
  {
    title: 'Fuel Prediction',
    desc: 'Estimate fuel consumption based on speed, load, weather conditions, and ship type using our trained ML model.',
    link: 'prediction',
    action: 'Show Module',
    icon: Fuel,
    tag: 'ML',
  },
  {
    title: 'Fleet Optimization',
    desc: 'Multi-objective — min fuel, min emissions, min cost — optimals via quantum QPSO.',
    link: 'optimization',
    action: 'Calculate QPSO',
    icon: Zap,
    tag: 'Quantum',
  },
  {
    title: 'Visualization',
    desc: 'Analyze fleet allocation and emission profiles through interactive charts and visual drill-downs.',
    link: 'visualization',
    action: 'Go to charts',
    icon: BarChart3,
    tag: 'Analytics',
  },
  {
    title: 'Report',
    desc: 'View the final optimization summary in a downloadable and printable report format.',
    link: 'report',
    action: 'Print Report',
    icon: FileText,
    tag: 'Export',
  },
];

export default function Overview({ setActiveTab }) {
  return (
    <div>
      <div className="page-header">
        <h2>Fleet Overview</h2>
        <p>
          Key performance indicators and a consolidated view of all platform modules. Track ship types, fuel efficiency, and route analytics in real time.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={i}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: `color-mix(in srgb, ${s.accent} 10%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18} style={{ color: s.accent }} />
                </div>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        marginTop: '12px',
      }}>
        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}>Platform Modules</h3>
        <span style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.04)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontWeight: 500,
        }}>{modules.length} available</span>
      </div>

      <div className="modules-grid">
        {modules.map((m, i) => {
          const Icon = m.icon;
          return (
            <div className="module-card" key={i}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={16} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <h3 style={{ marginBottom: 0 }}>{m.title}</h3>
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: 'var(--accent-primary)',
                  background: 'rgba(56, 189, 248, 0.08)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>{m.tag}</span>
              </div>
              <p>{m.desc}</p>
              <button className="module-link" onClick={() => setActiveTab(m.link)}>
                {m.action} <span style={{ fontSize: '1em' }}>→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
