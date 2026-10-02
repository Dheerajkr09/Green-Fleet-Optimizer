import React from 'react';
import { LayoutDashboard, Fuel, Ship, BarChart3, FileText, Activity } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'prediction', label: 'Fuel Prediction', icon: Fuel },
  { id: 'optimization', label: 'Fleet Optimization', icon: Ship },
  { id: 'visualization', label: 'Visualization', icon: BarChart3 },
  { id: 'report', label: 'Report', icon: FileText },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Green Fleet <span>Optimizer</span></h1>
        <p>Quantum-Inspired Fuel Optimization &amp; Deployment Intelligence</p>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div style={{
        marginTop: 'auto',
        padding: '16px 14px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <Activity size={14} style={{ color: '#34D399' }} />
          <span style={{
            fontSize: '0.72rem',
            color: '#34D399',
            fontWeight: 600,
            letterSpacing: '0.03em',
          }}>System Online</span>
        </div>
        <div style={{
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.03em',
          opacity: 0.6,
        }}>ML + Quantum Engine Active</div>
      </div>
    </aside>
  );
}
