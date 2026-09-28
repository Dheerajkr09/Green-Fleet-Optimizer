import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis, LabelList,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0E7C66', '#C08A2E', '#111827', '#5C6470'];

export default function Visualization({ optimizationResult }) {
  if (!optimizationResult || !optimizationResult.fleet_table) {
    return (
      <div>
        <div className="page-header">
          <h2>Visualization</h2>
          <p>Please run a Quantum Optimization first to view dynamic charts.</p>
        </div>
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: '#5C6470' }}>
          No optimization data available yet. Go to Fleet Optimization and run QPSO to generate insights.
        </div>
      </div>
    );
  }

  const { fleet_table, convergence } = optimizationResult;

  // KPIs
  const totalBaselineCO2 = fleet_table.reduce((sum, r) => sum + r.baseline_co2, 0);
  const totalOptimalCO2 = fleet_table.reduce((sum, r) => sum + r.co2_exact, 0);
  const co2SavedPct = ((totalBaselineCO2 - totalOptimalCO2) / totalBaselineCO2 * 100).toFixed(1);

  const totalBaselineCost = fleet_table.reduce((sum, r) => sum + r.baseline_cost, 0);
  const totalOptimalCost = fleet_table.reduce((sum, r) => sum + r.cost_index, 0);
  const costSavedPct = ((totalBaselineCost - totalOptimalCost) / totalBaselineCost * 100).toFixed(1);

  // Chart 1: Before vs After Data
  const beforeAfterData = fleet_table.map(row => ({
    name: row.ship_type,
    'Unoptimized CO₂': row.baseline_co2,
    'Optimized CO₂': row.co2_exact,
    unoptDetails: 'Baseline: HFO Fuel @ 18.00 knots',
    optDetails: `Optimized: ${row.best_fuel_type} Fuel @ ${row.optimal_speed} knots`
  }));

  // Chart 2: Convergence Data
  const convergenceData = convergence ? convergence.map((score, i) => ({
    iteration: i + 1,
    Fitness: Math.round(score)
  })) : [];

  // Chart 3: Cost vs CO2 Scatter (Data is used directly in render to split by ship type)

  // Chart 4: Pie Chart (Distribution of CO2 emissions among optimized fleet)
  const pieData = fleet_table.map(row => ({
    name: row.ship_type,
    value: row.co2_exact
  }));

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#fff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', color: '#111827' }}>{data.name}</p>
          <p style={{ margin: '4px 0', color: '#5C6470' }}><strong>Cost:</strong> ${data.Cost}</p>
          <p style={{ margin: '4px 0', color: '#5C6470' }}><strong>CO₂:</strong> {data.CO2} kg</p>
          <p style={{ margin: '4px 0', color: '#5C6470' }}><strong>Optimal Fuel:</strong> {data.FuelType}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 10px 0', color: '#111827', fontSize: '14px' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <p style={{ margin: 0, color: entry.color, fontWeight: 'bold' }}>{entry.name}: {entry.value} kg</p>
              <p style={{ margin: '2px 0 0 0', color: '#5C6470', fontSize: '11.5px' }}>
                {entry.dataKey === 'Unoptimized CO₂' ? entry.payload.unoptDetails : entry.payload.optDetails}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="page-header">
        <h2>Visualization</h2>
        <p>Compare the environmental impact and fuel expenses across optimal ship allocations.</p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#0E7C66' }}>{co2SavedPct}%</div>
          <div className="stat-label">Estimated CO₂ Saved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#0E7C66' }}>{costSavedPct}%</div>
          <div className="stat-label">Estimated Cost Saved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{convergence ? convergence.length : 60}</div>
          <div className="stat-label">QPSO Iterations</div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Chart 1: Before vs After Grouped Bar - Made full width for better readability */}
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Before vs After Optimization</h3>
          <p>Quantifying the reduction in carbon footprint achieved through AI-driven fuel substitution and speed modulation.</p>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={beforeAfterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 500 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft', offset: -10 }} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Unoptimized CO₂" fill="#5C6470" radius={[4, 4, 0, 0]} barSize={60} />
              <Bar dataKey="Optimized CO₂" fill="#0E7C66" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Convergence Line */}
        <div className="chart-card">
          <h3>QPSO Convergence</h3>
          <p>Fitness value minimization over iterations</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={convergenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="iteration" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="Fitness" stroke="#C08A2E" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Cost vs CO2 Scatter */}
        <div className="chart-card">
          <h3>Cost vs CO₂ Efficiency (Bubble Chart)</h3>
          <p>Lower left is best. Bubble size = Fuel consumed.</p>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 30, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="Cost" type="number" name="Cost" unit="$" tick={{ fontSize: 12 }} domain={['dataMin - 500', 'dataMax + 500']} />
              <YAxis dataKey="CO2" type="number" name="CO₂" unit="kg" tick={{ fontSize: 12 }} domain={['dataMin - 2000', 'dataMax + 2000']} />
              <ZAxis dataKey="FuelAmt" range={[200, 1000]} name="Fuel" />
              <Tooltip content={<CustomScatterTooltip />} cursor={{strokeDasharray: '3 3'}} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              {fleet_table.map((row, index) => (
                <Scatter 
                  key={row.ship_type} 
                  name={row.ship_type} 
                  data={[{
                    name: row.ship_type,
                    Cost: row.cost_index,
                    CO2: row.co2_exact,
                    FuelType: row.best_fuel_type,
                    FuelAmt: row.avg_fuel
                  }]} 
                  fill={COLORS[index % COLORS.length]} 
                  fillOpacity={0.8} 
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Fleet Allocation (Pie) */}
        <div className="chart-card">
          <h3>Post-Optimization CO₂ Footprint</h3>
          <p>Which ship type contributes most to remaining emissions?</p>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
      </div>
    </div>
  );
}
