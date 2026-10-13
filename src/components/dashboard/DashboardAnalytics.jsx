import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Sliders, Globe } from 'lucide-react';
import { CATEGORIES, getCategoryDetails } from '../../lib/expenseService';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import SphereCarousel from '../framer/SphereCarousel';

/**
 * Custom Tooltip for Recharts Donut / Pie Chart
 * High contrast, clear INR formatting, and accurate percentage of total.
 */
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: 'rgba(5, 7, 9, 0.94)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '12px',
          padding: '10px 14px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          minWidth: '160px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: data.color || '#a1a1aa',
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>{data.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            ₹{data.spent.toLocaleString('en-IN')}
          </span>
          <span style={{ color: 'var(--accent-green)', fontSize: '12px', fontWeight: 600 }}>
            {data.percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardAnalytics({
  expenses = [],
  currentBudget = 0,
  categoryBudgets = {},
  selectedMonthLabel = 'Selected Month'
}) {
  const [categoryView, setCategoryView] = useState('donut'); // 'donut' | 'sphere'

  // 1. Safe Category Rollup calculated strictly from actual expense records
  const validExpenses = expenses.filter((e) => {
    const amt = parseFloat(e?.amount);
    return !isNaN(amt) && amt > 0;
  });

  // Calculate actual total sum of records
  const totalExpensesSum = validExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // Map predefined colors with fallback
  const catColorMap = {};
  CATEGORIES.forEach((c) => {
    catColorMap[c.name] = c.color;
  });

  // Aggregate dynamically across all actual categories
  const categoryAgg = {};
  validExpenses.forEach((e) => {
    const catName = (e.category && String(e.category).trim()) || 'Other';
    categoryAgg[catName] = (categoryAgg[catName] || 0) + parseFloat(e.amount);
  });

  // Build accurate pie slices and percentage calculations: category total / total expenses * 100
  const categoryTotals = Object.entries(categoryAgg)
    .map(([name, amount]) => {
      const spent = Math.round(amount);
      const percentage = totalExpensesSum > 0 ? (amount / totalExpensesSum) * 100 : 0;
      const color = catColorMap[name] || getCategoryDetails(name).color;
      return {
        name,
        spent,
        percentage,
        color,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  // Grand total matching the sum of categories
  const grandTotal = categoryTotals.reduce((sum, c) => sum + c.spent, 0);

  // Prepare items for 3D Sphere Carousel
  const sphereCategoryItems = (categoryTotals.length > 0 ? categoryTotals : CATEGORIES).map((cat) => {
    const details = getCategoryDetails(cat.name);
    return {
      name: cat.name,
      amount: cat.spent || 0,
      icon: details.icon,
      color: cat.color || details.color,
    };
  });

  // 2. Real Spending Chronological Trend Chart
  let trendData = [];
  if (validExpenses.length > 0) {
    const monthBuckets = {};
    validExpenses.forEach((e) => {
      if (!e.date) return;
      const d = new Date(e.date);
      if (isNaN(d.getTime())) return;
      const monthKey = e.date.slice(0, 7); // 'YYYY-MM'
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      monthBuckets[monthKey] = monthBuckets[monthKey] || { key: monthKey, label: monthName, amount: 0 };
      monthBuckets[monthKey].amount += parseFloat(e.amount || 0);
    });

    const sortedMonthKeys = Object.keys(monthBuckets).sort();
    if (sortedMonthKeys.length > 1) {
      trendData = sortedMonthKeys.map((k) => ({
        label: monthBuckets[k].label,
        amount: Math.round(monthBuckets[k].amount),
      }));
    } else {
      const dayBuckets = {};
      validExpenses.forEach((e) => {
        if (!e.date) return;
        const d = new Date(e.date);
        const dayLabel = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;
        dayBuckets[e.date] = dayBuckets[e.date] || { label: dayLabel, amount: 0, date: e.date };
        dayBuckets[e.date].amount += parseFloat(e.amount || 0);
      });
      trendData = Object.values(dayBuckets)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((b) => ({ label: b.label, amount: Math.round(b.amount) }));
    }
  }

  // 3. Category Budgets Guardrail Analysis
  const categoryBudgetEntries = Object.entries(categoryBudgets).map(([catName, cap]) => {
    const catTotal = categoryTotals.find((c) => c.name === catName)?.spent || 0;
    const limit = parseFloat(cap);
    const pct = limit > 0 ? Math.round((catTotal / limit) * 100) : 0;
    const isExceeded = catTotal > limit;
    const isCritical = pct >= 90 || isExceeded;
    const isCaution = pct >= 75 && pct < 90;
    const rem = Math.max(0, limit - catTotal);
    return {
      name: catName,
      spent: catTotal,
      limit,
      pct,
      remaining: rem,
      isExceeded,
      isCritical,
      isCaution,
    };
  });

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* 2-Column Analytics Charts */}
      <div className="grid-2" style={{ marginBottom: categoryBudgetEntries.length > 0 ? '24px' : '0' }}>
        {/* Chart 1: Real Category Donut Chart / 3D Sphere Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <GlassCard style={{ padding: '24px' }} tilt={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieIcon size={17} color="var(--accent-green)" />
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                  Category Distribution
                </h4>
              </div>

              {/* View Toggle: Donut vs 3D Sphere (Component 3 Integration) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '999px',
                  padding: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setCategoryView('donut')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: categoryView === 'donut' ? 'var(--accent-green)' : 'transparent',
                    color: categoryView === 'donut' ? '#050709' : '#a8b3bf',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <PieIcon size={12} />
                  <span>Donut</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryView('sphere')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: categoryView === 'sphere' ? 'var(--accent-blue)' : 'transparent',
                    color: categoryView === 'sphere' ? '#050709' : '#a8b3bf',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Globe size={12} />
                  <span>3D Sphere</span>
                </button>
              </div>
            </div>

            {categoryView === 'sphere' ? (
              <SphereCarousel
                items={sphereCategoryItems}
                cardCount={18}
                coverage={0.7}
              />
            ) : categoryTotals.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No expenses recorded for {selectedMonthLabel}.
                <br />
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Log your first expense to generate this distribution.
                </span>
              </div>
            ) : (
              <>
                {/* Donut Chart with Center Total Sum */}
                <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryTotals}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={86}
                        paddingAngle={categoryTotals.length > 1 ? 3 : 0}
                        dataKey="spent"
                        nameKey="name"
                        isAnimationActive={true}
                        animationDuration={500}
                        animationEasing="ease-out"
                      >
                        {categoryTotals.map((entry) => (
                          <Cell
                            key={`cat-${entry.name}`}
                            fill={entry.color}
                            stroke="#050709"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center of Donut: Total Sum display matching real records */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                      Total
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#f7fafc', fontFamily: 'var(--font-mono)' }}>
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Responsive Category Breakdown Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '8px',
                    marginTop: '14px',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    maxHeight: '160px',
                    overflowY: 'auto',
                  }}
                >
                  {categoryTotals.map((cat) => (
                    <div
                      key={cat.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-glass)',
                        backdropFilter: 'var(--blur-glass-sm)',
                        WebkitBackdropFilter: 'var(--blur-glass-sm)',
                        fontSize: '12px',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: cat.color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            color: 'var(--text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={cat.name}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexShrink: 0 }}>
                        <span className="mono" style={{ color: '#fff', fontWeight: 600 }}>
                          ₹{cat.spent.toLocaleString('en-IN')}
                        </span>
                        <span style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 600 }}>
                          {cat.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>

        {/* Chart 2: Real Spending Trajectory Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.06, ease: 'easeOut' }}
        >
          <GlassCard style={{ padding: '24px' }} tilt={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={17} color="var(--accent-blue)" />
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                  Spending Trajectory
                </h4>
              </div>
              <Badge variant="blue">Authenticated Data</Badge>
            </div>

            {trendData.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No chronological spending data available yet.
                <br />
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  Charts populate automatically as you log transactions.
                </span>
              </div>
            ) : (
              <>
                <div style={{ width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="liquidBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#19e68c" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#35a7ff" stopOpacity={0.75} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="rgba(255, 255, 255, 0.35)"
                        fontSize={10.5}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="rgba(255, 255, 255, 0.35)"
                        fontSize={10}
                        tickLine={false}
                        domain={[0, 'auto']}
                        tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(5, 7, 9, 0.94)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          borderColor: 'rgba(255, 255, 255, 0.18)',
                          borderRadius: '12px',
                          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75)',
                          fontSize: '12px',
                          color: '#fff',
                        }}
                        formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Actual Spent']}
                      />
                      <Bar
                        dataKey="amount"
                        fill="url(#liquidBarGrad)"
                        radius={[6, 6, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '14px',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>
                    Selected period total: <strong style={{ color: '#fff' }}>₹{grandTotal.toLocaleString('en-IN')}</strong>
                  </span>
                  {currentBudget > 0 && (
                    <span
                      className="mono"
                      style={{
                        color: grandTotal <= currentBudget ? 'var(--accent-green)' : 'var(--accent-red)',
                        fontWeight: 600,
                      }}
                    >
                      {grandTotal <= currentBudget
                        ? `● Under Cap (₹${(currentBudget - grandTotal).toLocaleString('en-IN')} left)`
                        : `▲ Over Cap by ₹${(grandTotal - currentBudget).toLocaleString('en-IN')}`}
                    </span>
                  )}
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Category Budget Guardrails Section (if category budgets are set) */}
      {categoryBudgetEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.12, ease: 'easeOut' }}
        >
          <GlassCard style={{ padding: '24px' }} tilt={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={17} color="var(--accent-blue)" />
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                  Category Budget Guardrails
                </h4>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {categoryBudgetEntries.length} Category Cap{categoryBudgetEntries.length === 1 ? '' : 's'} Active
              </span>
            </div>

            <div className="grid-2">
              {categoryBudgetEntries.map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: cat.isExceeded ? 'rgba(255, 82, 104, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${cat.isExceeded ? 'rgba(255, 82, 104, 0.4)' : cat.isCritical ? 'rgba(255, 82, 104, 0.3)' : cat.isCaution ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-glass)'}`,
                    backdropFilter: 'var(--blur-glass-sm)',
                    WebkitBackdropFilter: 'var(--blur-glass-sm)',
                    boxShadow: 'var(--shadow-glass-panel)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#fff', fontWeight: 500, fontSize: '13px' }}>{cat.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: '12px',
                          color: cat.isExceeded
                            ? 'var(--accent-red)'
                            : cat.isCritical
                            ? 'var(--accent-red)'
                            : cat.isCaution
                            ? 'var(--accent-amber)'
                            : 'var(--text-secondary)',
                        }}
                      >
                        ₹{cat.spent.toLocaleString('en-IN')} / ₹{cat.limit.toLocaleString('en-IN')}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: cat.isExceeded
                            ? 'var(--accent-red)'
                            : cat.isCritical
                            ? 'var(--accent-red)'
                            : cat.isCaution
                            ? 'var(--accent-amber)'
                            : 'var(--accent-green)',
                        }}
                      >
                        {cat.pct}%
                      </span>
                    </div>
                  </div>

                  <ProgressBar
                    percentage={Math.min(100, cat.pct)}
                    variant={cat.isCritical ? 'rose' : cat.isCaution ? 'amber' : 'emerald'}
                    height={6}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>
                      {cat.isExceeded
                        ? `Exceeded by ₹${(cat.spent - cat.limit).toLocaleString('en-IN')}`
                        : `₹${cat.remaining.toLocaleString('en-IN')} remaining`}
                    </span>
                    <span>
                      {cat.isExceeded ? '⚠️ Exceeded' : cat.isCritical ? '🔴 Critical' : cat.isCaution ? '🟡 Caution' : '🟢 Safe'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
