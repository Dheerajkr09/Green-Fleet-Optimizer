import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis, LabelList,
  PieChart, Pie, Cell
} from 'recharts';
import { BarChart3, TrendingDown, DollarSign, Activity } from 'lucide-react';

const COLORS = ['#38BDF8', '#FBBF24', '#A78BFA', '#34D399'];

export default function Visualization({ optimizationResult }) {
  if (!optimizationResult || !optimizationResult.fleet_table) {
    return (
      <div>
        <div className="page-header">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: 'rgba(56, 189, 248, 0.08)',
            borderRadius: '6px',
            marginBottom: '12px',
          }}>
            <BarChart3 size={12} style={{ color: 'var(--accent-primary)' }} />
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--accent-primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>Analytics</span>
          </div>
          <h2>Visualization</h2>
          <p>Please run a Quantum Optimization first to view dynamic charts.</p>
        </div>
        <div className="card" style={{
          padding: '72px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          borderStyle: 'dashed',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BarChart3 size={22} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px', lineHeight: '1.6' }}>
            No optimization data available yet. Go to Fleet Optimization and run QPSO to generate insights.
          </div>
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

  // Chart 4: Pie Chart
  const pieData = fleet_table.map(row => ({
    name: row.ship_type,
    value: row.co2_exact
  }));

  const tooltipStyle = {
    backgroundColor: 'var(--bg-elevated)',
    padding: '14px 16px',
    border: '1px solid var(--card-border)',
    borderRadius: '10px',
    fontSize: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(12px)',
  };

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={tooltipStyle}>
          <p style={{ fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '13px' }}>{data.name}</p>
          <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}><strong>Cost:</strong> ${data.Cost}</p>
          <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}><strong>CO₂:</strong> {data.CO2} kg</p>
          <p style={{ margin: '4px 0', color: 'var(--text-secondary)' }}><strong>Optimal Fuel:</strong> {data.FuelType}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle}>
          <p style={{ fontWeight: 600, margin: '0 0 10px 0', color: 'var(--text-primary)', fontSize: '13px' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <p style={{ margin: 0, color: entry.color, fontWeight: 600, fontSize: '12px' }}>{entry.name}: {entry.value} kg</p>
              <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted)', fontSize: '11px' }}>
                {entry.dataKey === 'Unoptimized CO₂' ? entry.payload.unoptDetails : entry.payload.optDetails}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const kpiItems = [
    {
      value: `${co2SavedPct}%`,
      label: 'Estimated CO₂ Saved',
      icon: TrendingDown,
      color: 'var(--accent-green)',
    },
    {
      value: `${costSavedPct}%`,
      label: 'Estimated Cost Saved',
      icon: DollarSign,
      color: 'var(--accent-amber)',
    },
    {
      value: convergence ? convergence.length : 60,
      label: 'QPSO Iterations',
      icon: Activity,
      color: 'var(--accent-purple)',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(56, 189, 248, 0.08)',
          borderRadius: '6px',
          marginBottom: '12px',
        }}>
          <BarChart3 size={12} style={{ color: 'var(--accent-primary)' }} />
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--accent-primary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>Analytics Dashboard</span>
        </div>
        <h2>Visualization</h2>
        <p>Compare the environmental impact and fuel expenses across optimal ship allocations.</p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        {kpiItems.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div className="stat-card" key={i}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `color-mix(in srgb, ${kpi.color} 10%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={15} style={{ color: kpi.color }} />
                </div>
              </div>
              <div className="stat-value" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="stat-label">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        {/* Chart 1: Before vs After Grouped Bar - Full width */}
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Before vs After Optimization</h3>
          <p>Quantifying the reduction in carbon footprint achieved through AI-driven fuel substitution and speed modulation.</p>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={beforeAfterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A6478' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A6478' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft', offset: -10, fill: '#5A6478', fontSize: 11 }} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Unoptimized CO₂" fill="#5A6478" radius={[4, 4, 0, 0]} barSize={48} />
              <Bar dataKey="Optimized CO₂" fill="#34D399" radius={[4, 4, 0, 0]} barSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Convergence Line */}
        <div className="chart-card">
          <h3>QPSO Convergence</h3>
          <p>Fitness value minimization over iterations</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={convergenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="iteration" tick={{ fontSize: 11, fill: '#5A6478' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5A6478' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }} itemStyle={{ color: 'var(--text-secondary)' }} />
              <Line type="monotone" dataKey="Fitness" stroke="#FBBF24" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Cost vs CO2 Scatter */}
        <div className="chart-card">
          <h3>Cost vs CO₂ Efficiency (Bubble Chart)</h3>
          <p>Lower left is best. Bubble size = Fuel consumed.</p>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 30, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="Cost" type="number" name="Cost" unit="$" tick={{ fontSize: 11, fill: '#5A6478' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} domain={['dataMin - 500', 'dataMax + 500']} />
              <YAxis dataKey="CO2" type="number" name="CO₂" unit="kg" tick={{ fontSize: 11, fill: '#5A6478' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} domain={['dataMin - 2000', 'dataMax + 2000']} />
              <ZAxis dataKey="FuelAmt" range={[200, 1000]} name="Fuel" />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
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
                  fillOpacity={0.85}
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
                stroke="var(--bg-primary)"
                strokeWidth={2}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--text-secondary)' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
