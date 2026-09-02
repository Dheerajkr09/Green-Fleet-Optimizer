import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = '/api';
const COLORS = ['#0ea5e9', '#0f172a', '#f59e0b', '#14b8a6'];

export default function Visualization() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div>
        <div className="page-header">
          <div className="module-label">Module 3</div>
          <h2>Visualization</h2>
          <p>Loading charts from API...</p>
        </div>
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Make sure Flask backend is running on port 5000
        </div>
      </div>
    );
  }

  // Transform data for charts
  const pieData = Object.entries(stats.allocation).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(stats.fuel_by_type).map(([name, value]) => ({ name, fuel: value }));

  return (
    <div>
      <div className="page-header">
        <div className="module-label">Module 3</div>
        <h2>Visualization</h2>
        <p>Interactive charts for fleet allocation breakdown and fuel consumption analysis across ship types.</p>
      </div>

      <div className="charts-grid">
        {/* Doughnut Chart */}
        <div className="chart-card">
          <h3>Fleet Allocation by Ship Type</h3>
          <p>Distribution of ships across fleet categories</p>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <h3>Avg Fuel Consumption (units/day)</h3>
          <p>Average fuel consumed per ship type across all voyages</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="fuel" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
