import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Target, AlertCircle, Sliders, IndianRupee } from 'lucide-react';
import { CATEGORIES } from '../../lib/expenseService';
import FramerButton from '../framer/FramerButton';

/**
 * Redesigned Budget Intelligence Modal
 * Glassmorphic dark card, tabbed controls, preset allowance chips,
 * 16px inputs, and FramerButton actions.
 */
export default function BudgetModal({
  isOpen,
  onClose,
  onSave,
  currentBudget = 0,
  categoryBudgets = {},
  selectedMonthLabel = 'Current Month',
}) {
  const [activeTab, setActiveTab] = useState('overall'); // 'overall' | 'categories'
  const [overallBudget, setOverallBudget] = useState('25000');
  const [catCaps, setCatCaps] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentBudget) {
      setOverallBudget(currentBudget.toString());
    } else {
      setOverallBudget('25000');
    }
    const initialCats = {};
    CATEGORIES.forEach((cat) => {
      initialCats[cat.name] = categoryBudgets[cat.name] ? categoryBudgets[cat.name].toString() : '';
    });
    setCatCaps(initialCats);
    setError('');
  }, [currentBudget, categoryBudgets, isOpen]);

  const handleCatChange = (catName, val) => {
    setCatCaps((prev) => ({ ...prev, [catName]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(overallBudget);
    if (!overallBudget || isNaN(num) || num <= 0) {
      setError('Please enter a valid overall budget amount');
      return;
    }
    if (num < 500) {
      setError('Minimum monthly allowance limit is ₹500');
      return;
    }

    // Parse category caps
    const parsedCats = {};
    Object.entries(catCaps).forEach(([name, val]) => {
      if (val && !isNaN(parseFloat(val)) && parseFloat(val) > 0) {
        parsedCats[name] = parseFloat(val);
      }
    });

    onSave({
      overall: num,
      categories: parsedCats,
    });
  };

  const PRESETS = [10000, 15000, 20000, 25000, 30000];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="budget-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            key="budget-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              background: 'rgba(8, 10, 16, 0.90)',
              border: '1px solid var(--border-glass-light)',
              borderRadius: '24px',
              padding: '32px 28px',
              boxShadow: 'var(--shadow-glass-modal)',
              backdropFilter: 'var(--blur-glass-lg)',
              WebkitBackdropFilter: 'var(--blur-glass-lg)',
              overflow: 'hidden',
              color: '#f0f7f5',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Shimmer line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '32px',
                right: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(25, 230, 140, 0.6), rgba(53, 167, 255, 0.4), transparent)',
              }}
            />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent-green)',
                background: 'rgba(25, 230, 140, 0.12)',
                padding: '3px 10px',
                borderRadius: '100px',
                marginBottom: '8px',
              }}
            >
              Budget Intelligence
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
              Set Monthly Guardrails
            </h3>
            <p style={{ fontSize: '13.5px', color: '#9e9ea7', marginTop: '4px' }}>
              {selectedMonthLabel} • Persistent caps synced to Supabase
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9e9ea7',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Toggle: Overall vs Categories */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '9999px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('overall')}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'overall' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
              color: activeTab === 'overall' ? '#fff' : '#9e9ea7',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Overall Allowance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            style={{
              flex: 1,
              padding: '8px 14px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'categories' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
              color: activeTab === 'categories' ? '#fff' : '#9e9ea7',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Category Caps
          </button>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 82, 104, 0.12)',
              border: '1px solid rgba(255, 82, 104, 0.3)',
              color: 'var(--accent-red)',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'overall' ? (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#9e9ea7',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Monthly Total Budget (₹ INR)
              </label>
              <div style={{ position: 'relative', marginBottom: '18px' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', fontWeight: 700, fontSize: '18px' }}>
                  ₹
                </span>
                <input
                  type="number"
                  step="500"
                  className="glass-input"
                  value={overallBudget}
                  onChange={(e) => setOverallBudget(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px 14px 40px',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: 600,
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#60606a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Quick Preset Caps
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PRESETS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setOverallBudget(val.toString())}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        background: overallBudget === val.toString() ? 'rgba(25, 230, 140, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                        border: overallBudget === val.toString() ? '1px solid var(--accent-green)' : '1px solid var(--border-glass)',
                        color: overallBudget === val.toString() ? 'var(--accent-green)' : '#dedede',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        backdropFilter: 'var(--blur-glass-sm)',
                        WebkitBackdropFilter: 'var(--blur-glass-sm)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', maxHeight: '320px', paddingRight: '6px', marginBottom: '18px' }}>
              <p style={{ fontSize: '13px', color: '#9e9ea7', marginBottom: '16px' }}>
                Optional: set strict spending ceilings for specific categories.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid var(--border-glass)',
                      backdropFilter: 'var(--blur-glass-sm)',
                      WebkitBackdropFilter: 'var(--blur-glass-sm)',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#dedede', fontWeight: 500 }}>{cat.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#60606a', fontSize: '14px' }}>₹</span>
                      <input
                        type="number"
                        placeholder="Unlimited"
                        className="glass-input"
                        value={catCaps[cat.name] || ''}
                        onChange={(e) => handleCatChange(cat.name, e.target.value)}
                        style={{
                          width: '110px',
                          padding: '6px 10px',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                          textAlign: 'right',
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <FramerButton variant="secondary" size="md" onClick={onClose} icon="none">
              Cancel
            </FramerButton>
            <FramerButton variant="primary" size="md" type="submit" icon="none">
              Save Guardrails
            </FramerButton>
          </div>
        </form>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
