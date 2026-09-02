import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import FuelPrediction from './components/FuelPrediction';
import FleetOptimization from './components/FleetOptimization';
import Visualization from './components/Visualization';
import Report from './components/Report';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'prediction':
        return <FuelPrediction />;
      case 'optimization':
        return <FleetOptimization />;
      case 'visualization':
        return <Visualization />;
      case 'report':
        return <Report />;
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
