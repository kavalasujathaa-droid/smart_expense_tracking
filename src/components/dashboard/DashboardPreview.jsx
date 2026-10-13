import React from 'react';
import {
  Wallet,
  TrendingDown,
  Target,
  Calendar,
  Utensils,
  BookOpen,
  Train,
  Wifi,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  PieChart as PieIcon,
  BarChart3,
  Flame,
  CheckCircle2
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

export default function DashboardPreview({ onLaunchApp }) {
  const currentMonthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="dashboard-mockup-wrapper">
      <div className="dashboard-mockup">
        {/* Top Mockup Header */}
        <div className="mockup-topbar">
          <div className="mockup-user-info">
            <div className="mockup-avatar" style={{ background: 'var(--accent-emerald)', color: '#000000' }}>
              <Wallet size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>
                  Smart Expense Tracking
                </span>
                <Badge variant="emerald" icon={ShieldCheck}>
                  PostgreSQL RLS Protected
                </Badge>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Authenticated Ledger Architecture • Zero Mock Fallbacks
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
                background: 'rgba(255,255,255,0.04)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Calendar size={13} color="var(--accent-cyan)" />
              <span>{currentMonthLabel}</span>
            </div>
            {onLaunchApp && (
              <Button size="sm" variant="primary" icon={ArrowUpRight} iconPosition="right" onClick={onLaunchApp}>
                Open App
              </Button>
            )}
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="mockup-metrics-grid">
          {/* Metric 1: Monthly Spending Overview */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-title">Monthly Expenditure</span>
              <Wallet size={16} color="var(--accent-emerald)" />
            </div>
            <div className="metric-card-value">
              ₹0 <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>(Clean Start)</span>
            </div>
            <ProgressBar percentage={0} variant="emerald" height={6} style={{ margin: '8px 0' }} />
            <div className="metric-card-footer">
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 500 }}>
                Awaiting first transaction in Supabase
              </span>
            </div>
          </div>

          {/* Metric 2: Remaining Pocket Money */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-title">Remaining Allowance</span>
              <TrendingDown size={16} color="var(--accent-cyan)" />
            </div>
            <div className="metric-card-value" style={{ color: '#ffffff' }}>
              Dynamic
            </div>
            <div style={{ height: '6px', margin: '8px 0' }} />
            <div className="metric-card-footer">
              <span style={{ color: 'var(--text-secondary)' }}>
                Calculates safe daily burn rate automatically
              </span>
            </div>
          </div>

          {/* Metric 3: Average Daily Spending */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-title">Avg Daily Spending</span>
              <Flame size={16} color="var(--accent-amber)" />
            </div>
            <div className="metric-card-value" style={{ fontSize: '22px' }}>
              Real-Time
            </div>
            <div style={{ height: '6px', margin: '8px 0' }} />
            <div className="metric-card-footer" style={{ color: 'var(--text-muted)' }}>
              Tracks burn rate per passed day in month
            </div>
          </div>

          {/* Metric 4: Guardrail Health */}
          <div className="metric-card">
            <div className="metric-card-header">
              <span className="metric-card-title">Guardrail Health</span>
              <Target size={16} color="var(--accent-violet)" />
            </div>
            <div className="metric-card-value" style={{ fontSize: '18px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Multi-Tier</span>
              <Badge variant="emerald">75% • 90% • 100%</Badge>
            </div>
            <div style={{ height: '6px', margin: '8px 0' }} />
            <div className="metric-card-footer" style={{ color: 'var(--text-muted)' }}>
              Automatic caution & overspend warnings
            </div>
          </div>
        </div>

        {/* Content Columns: Analytics & Architecture Overview */}
        <div className="mockup-content-grid">
          {/* Left Column: Visual Analytics Architecture */}
          <div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={16} color="var(--accent-emerald)" />
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                    Chronological Trajectory & Donut Rollups
                  </h4>
                </div>
                <Badge variant="emerald">Recharts Engine</Badge>
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                As you log genuine student expenses, Recharts automatically generates category distribution donuts and chronological expenditure trends.
              </p>

              {/* Visual Architecture Representation */}
              <div
                style={{
                  height: '140px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px dashed var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <PieIcon size={24} color="var(--accent-cyan)" />
                <div style={{ fontSize: '12px', color: '#fff', fontWeight: 500 }}>
                  Live Data Visualization Canvas
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '320px' }}>
                  Empty state for new accounts • Populates instantly from your private PostgreSQL records
                </div>
              </div>
            </div>

            {/* Supported Campus Categories List */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                Campus Categories Supported
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-emerald">Mess & Dining</span>
                <span className="badge badge-violet">Hostel & Rent</span>
                <span className="badge badge-cyan">Books & Study</span>
                <span className="badge badge-amber">Transit</span>
                <span className="badge badge-violet">Tech & Utilities</span>
                <span className="badge badge-emerald">Exam Fees</span>
              </div>
            </div>
          </div>

          {/* Right Column: Security & Guardrail Guarantees */}
          <div>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '22px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={16} color="var(--accent-emerald)" />
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                    Authentic Data Architecture
                  </h4>
                </div>

                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                  Smart Expense Tracking guarantees zero fake statistics, zero simulated profiles, and zero mock fallbacks:
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--accent-emerald)" />
                    <span><strong>Row Level Security:</strong> Direct PostgreSQL policy isolation per user</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--accent-emerald)" />
                    <span><strong>Native INR (₹):</strong> Built specifically for Indian student payments</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--accent-emerald)" />
                    <span><strong>Clean Empty States:</strong> Genuine zero values until you log expenses</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--accent-emerald)" />
                    <span><strong>CSV Ledger Export:</strong> Ready for parents and scholarship claims</span>
                  </li>
                </ul>
              </div>

              <div>
                <Button
                  variant="primary"
                  size="md"
                  style={{ width: '100%' }}
                  onClick={onLaunchApp}
                  icon={ArrowUpRight}
                  iconPosition="right"
                >
                  Access Personal Ledger
                </Button>
                <div style={{ fontSize: '11px', textAlign: 'center', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Sign in or create a student account to start tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
