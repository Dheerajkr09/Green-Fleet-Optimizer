import React from 'react';
import { LayoutDashboard, Fuel, Ship, BarChart3, FileText } from 'lucide-react';

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
    </aside>
  );
}
