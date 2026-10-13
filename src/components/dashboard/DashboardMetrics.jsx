import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingDown,
  Settings,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import GlassBudgetCard from '../framer/GlassBudgetCard';
import { AppleGlassBox } from '../framer/AppleGlassStack';

/**
 * DashboardMetrics Component
 * Upgraded with:
 * - Component 4 (GlassPricing adaptation): GlassBudgetCard for monthly allowance cap
 * - Component 1 (AppleGlassStack): AppleGlassBox cards for top financial metrics with shine pass-through
 * - Black + Green + Blue + Red color system
 * - Real Supabase calculations preserving mathematical integrity
 */
export default function DashboardMetrics({
  totalSpent = 0,
  budget = 0,
  transactionCount = 0,
  expenses = [],
  selectedMonthLabel = 'Current Month',
  onOpenBudgetModal,
  onNavigateToExpenses,
}) {
  // Safe calculations preventing division-by-zero
  const hasBudget = budget > 0;
  const remaining = hasBudget ? Math.max(0, budget - totalSpent) : 0;
  const percentage = hasBudget ? Math.round((totalSpent / budget) * 1000) / 10 : 0;
  const isOverBudget = hasBudget && totalSpent > budget;
  const overspendAmount = isOverBudget ? totalSpent - budget : 0;

  // Multi-tier warning states
  const isCriticalAlert = hasBudget && (percentage >= 90 || isOverBudget);
  const isCaution = hasBudget && percentage >= 75 && percentage < 90;

  // Days calculation for current month burn rate
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - currentDay);

  // Average daily spending so far
  const daysPassed = Math.max(1, currentDay);
  const avgDailySpend = Math.round(totalSpent / daysPassed);

  // Safe remaining daily burn rate
  const safeDailyBurn = hasBudget && remaining > 0 ? Math.round(remaining / daysLeft) : 0;

  // Identify highest-spending category
  const categoryMap = {};
  expenses.forEach((e) => {
    const amt = parseFloat(e.amount || 0);
    categoryMap[e.category] = (categoryMap[e.category] || 0) + amt;
  });

  let highestCategory = 'None yet';
  let highestCategoryAmount = 0;
  Object.entries(categoryMap).forEach(([cat, amt]) => {
    if (amt > highestCategoryAmount) {
      highestCategory = cat;
      highestCategoryAmount = amt;
    }
  });

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* 1. Integrated GlassBudgetCard (Adapted from GlassPricing technique) */}
      <GlassBudgetCard
        budget={budget}
        totalSpent={totalSpent}
        onOpenBudgetModal={onOpenBudgetModal}
        selectedMonthLabel={selectedMonthLabel}
      />

      {/* 2. Top Metric Cards using AppleGlassBox Stack with Shine Pass-Through */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Metric 1: Total Spend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.0, ease: 'easeOut' }}
        >
          <AppleGlassBox
            title={`${selectedMonthLabel} Spend`}
            icon={Wallet}
            badge={hasBudget ? `${percentage}% Used` : `${transactionCount} Entries`}
            badgeColor={isCriticalAlert ? 'var(--accent-red)' : isCaution ? 'var(--accent-amber)' : 'var(--accent-green)'}
            accentGlow={isCriticalAlert ? 'var(--accent-red-glow)' : 'var(--accent-green-glow)'}
            minHeight={160}
            onClick={onNavigateToExpenses}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#f7fafc',
                fontFamily: 'var(--font-mono)',
                margin: '10px 0 6px 0',
                letterSpacing: '-0.03em',
              }}
            >
              ₹{totalSpent.toLocaleString('en-IN')}
            </div>
            <ProgressBar
              percentage={hasBudget ? Math.min(100, percentage) : 0}
              variant={isCriticalAlert ? 'rose' : isCaution ? 'amber' : 'emerald'}
              height={6}
              style={{ margin: '6px 0 10px 0' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {hasBudget ? (
                <span>Cap: ₹{budget.toLocaleString('en-IN')}</span>
              ) : (
                <span>No budget ceiling set</span>
              )}
              {onNavigateToExpenses && (
                <span style={{ color: 'var(--accent-blue)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  Manage Records <ArrowUpRight size={11} />
                </span>
              )}
            </div>
          </AppleGlassBox>
        </motion.div>

        {/* Metric 2: Remaining Allowance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05, ease: 'easeOut' }}
        >
          <AppleGlassBox
            title="Remaining Balance"
            icon={TrendingDown}
            badge={isOverBudget ? 'Over Cap' : hasBudget ? `${daysLeft}d left` : 'Open'}
            badgeColor={isOverBudget ? 'var(--accent-red)' : 'var(--accent-blue)'}
            accentGlow={isOverBudget ? 'var(--accent-red-glow)' : 'var(--accent-blue-glow)'}
            minHeight={160}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: isOverBudget ? 'var(--accent-red)' : '#f7fafc',
                fontFamily: 'var(--font-mono)',
                margin: '10px 0 6px 0',
                letterSpacing: '-0.03em',
              }}
            >
              {hasBudget ? `₹${remaining.toLocaleString('en-IN')}` : '—'}
            </div>
            <div style={{ height: '6px', margin: '6px 0 10px 0' }} />
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {hasBudget ? (
                isOverBudget ? (
                  <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                    Exceeded by ₹{overspendAmount.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span>Safe pace: ₹{safeDailyBurn.toLocaleString('en-IN')}/day</span>
                )
              ) : (
                <span>Set budget cap to track balance</span>
              )}
            </div>
          </AppleGlassBox>
        </motion.div>

        {/* Metric 3: Average Daily Spend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.10, ease: 'easeOut' }}
        >
          <AppleGlassBox
            title="Daily Burn Pace"
            icon={Flame}
            badge="Activity"
            badgeColor="var(--accent-amber)"
            accentGlow="var(--accent-amber-glow)"
            minHeight={160}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#f7fafc',
                fontFamily: 'var(--font-mono)',
                margin: '10px 0 6px 0',
                letterSpacing: '-0.03em',
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
              }}
            >
              ₹{avgDailySpend.toLocaleString('en-IN')}
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                /day
              </span>
            </div>
            <div style={{ height: '6px', margin: '6px 0 10px 0' }} />
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Top:{' '}
              <strong style={{ color: '#ffffff' }}>{highestCategory}</strong>{' '}
              {highestCategoryAmount > 0 && `(₹${highestCategoryAmount.toLocaleString('en-IN')})`}
            </div>
          </AppleGlassBox>
        </motion.div>

        {/* Metric 4: Monthly Cap Setup */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15, ease: 'easeOut' }}
        >
          <AppleGlassBox
            title="Monthly Target"
            icon={Settings}
            badge="Settings"
            badgeColor="var(--accent-green)"
            accentGlow="var(--accent-green-glow)"
            minHeight={160}
            onClick={onOpenBudgetModal}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#f7fafc',
                fontFamily: 'var(--font-mono)',
                margin: '10px 0 6px 0',
                letterSpacing: '-0.03em',
              }}
            >
              {hasBudget ? `₹${budget.toLocaleString('en-IN')}` : 'Not Set'}
            </div>
            <div style={{ height: '6px', margin: '6px 0 10px 0' }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: 'var(--accent-green)',
                fontWeight: 600,
              }}
            >
              <span>{hasBudget ? 'Adjust Cap Limits' : 'Configure Limit'}</span>
              <ArrowUpRight size={13} />
            </div>
          </AppleGlassBox>
        </motion.div>
      </div>
    </div>
  );
}
