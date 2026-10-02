import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import FuelPrediction from './components/FuelPrediction';
import FleetOptimization from './components/FleetOptimization';
import Visualization from './components/Visualization';
import Report from './components/Report';
import { Circle, Settings } from 'lucide-react';

const pageTitles = {
  overview: 'Overview',
  prediction: 'Fuel Prediction',
  optimization: 'Fleet Optimization',
  visualization: 'Visualization',
  report: 'Report',
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [optimizationResult, setOptimizationResult] = useState(null);

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'prediction':
        return <FuelPrediction />;
      case 'optimization':
        return <FleetOptimization setOptimizationResult={setOptimizationResult} />;
      case 'visualization':
        return <Visualization optimizationResult={optimizationResult} />;
      case 'report':
        return <Report optimizationResult={optimizationResult} />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {/* Top Navbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          paddingBottom: '0',
        }}>
          {/* Breadcrumb */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}>
            <span>Dashboard</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{pageTitles[activeTab]}</span>
          </div>

          {/* Status & Settings */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              background: 'rgba(52, 211, 153, 0.06)',
              borderRadius: '20px',
              border: '1px solid rgba(52, 211, 153, 0.1)',
            }}>
              <Circle size={7} fill="#34D399" stroke="none" />
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--accent-green)',
                fontWeight: 500,
              }}>Models Active</span>
            </div>

            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--card-border-hover)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--card-border)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <Settings size={15} />
            </button>
          </div>
        </div>

        {renderPage()}
      </main>
    </div>
  );
}

export default App;
