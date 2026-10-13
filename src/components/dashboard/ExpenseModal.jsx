import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, IndianRupee, Calendar, Tag, CreditCard, AlignLeft } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../../lib/expenseService';
import FramerButton from '../framer/FramerButton';

/**
 * Redesigned Expense Entry Modal
 * Glassmorphic dark card, crisp responsive inputs (16px), accessible labels,
 * active focus rings, and FramerButton actions.
 */
const STANDARD_CATEGORY_NAMES = CATEGORIES.filter((c) => c.name !== 'Other').map((c) => c.name);

export default function ExpenseModal({ isOpen, onClose, onSave, initialData }) {

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? initialData.amount.toString() : '');
      
      const existingCat = initialData.category || '';
      if (STANDARD_CATEGORY_NAMES.includes(existingCat)) {
        setCategory(existingCat);
        setCustomCategory('');
      } else {
        // Saved as a custom category or 'Other'
        setCategory('Other');
        setCustomCategory(existingCat === 'Other' ? '' : existingCat);
      }

      if (initialData.date && initialData.date.includes('-')) {
        setDate(initialData.date);
      } else {
        setDate(new Date().toISOString().split('T')[0]);
      }
      setPaymentMethod(initialData.paymentMethod || PAYMENT_METHODS[0]);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory(CATEGORIES[0].name);
      setCustomCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod(PAYMENT_METHODS[0]);
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title or merchant name is required';
    } else if (title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      errs.amount = 'Please enter a valid amount';
    } else if (numAmount <= 0) {
      errs.amount = 'Amount must be greater than ₹0';
    } else if (numAmount > 500000) {
      errs.amount = 'Amount cannot exceed ₹5,00,000';
    }

    if (!date) {
      errs.date = 'Date is required';
    }

    if (category === 'Other') {
      if (!customCategory.trim()) {
        errs.customCategory = 'Please specify a category';
      } else if (customCategory.trim().length < 2) {
        errs.customCategory = 'Category must be at least 2 characters';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resolvedCategory = category === 'Other' ? customCategory.trim() : category;

    onSave({
      title: title.trim(),
      amount: parseFloat(amount),
      category: resolvedCategory,
      date,
      paymentMethod,
      notes: notes.trim(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="expense-modal-backdrop"
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
            key="expense-modal-card"
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
            }}
          >
            {/* Liquid Shimmer top line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '32px',
                right: '32px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(25, 230, 140, 0.65), rgba(53, 167, 255, 0.55), transparent)',
              }}
            />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
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
                border: '1px solid rgba(25, 230, 140, 0.3)',
                padding: '3px 10px',
                borderRadius: '100px',
                marginBottom: '8px',
              }}
            >
              {initialData ? 'Update Record' : 'New Transaction'}
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
              {initialData ? 'Edit Expense Record' : 'Log Expense'}
            </h3>
            <p style={{ fontSize: '14px', color: '#9e9ea7', marginTop: '4px' }}>
              {initialData ? 'Update details of this transaction' : 'Record your spending in INR with private PostgreSQL sync'}
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
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9e9ea7')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label
              htmlFor="expense-title"
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#9e9ea7',
                marginBottom: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Title / Merchant <span style={{ color: 'var(--accent-red)' }}>*</span>
            </label>
            <input
              id="expense-title"
              type="text"
              className="glass-input"
              placeholder="e.g. Campus Canteen, Books, Metro Pass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                outline: 'none',
                borderColor: errors.title ? 'rgba(255, 82, 104, 0.7)' : undefined,
              }}
              autoFocus
            />
            {errors.title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--accent-red)', marginTop: '5px' }}>
                <AlertCircle size={13} /> {errors.title}
              </div>
            )}
          </div>

          {/* Amount and Category 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {/* Amount */}
            <div>
              <label
                htmlFor="expense-amount"
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#9e9ea7',
                  marginBottom: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Amount (₹ INR) <span style={{ color: 'var(--accent-red)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', fontWeight: 700, fontSize: '16px' }}>
                  ₹
                </span>
                <input
                  id="expense-amount"
                  type="number"
                  step="any"
                  className="glass-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 34px',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'monospace',
                    borderColor: errors.amount ? 'rgba(255, 82, 104, 0.7)' : undefined,
                  }}
                />
              </div>
              {errors.amount && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--accent-red)', marginTop: '5px' }}>
                  <AlertCircle size={13} /> {errors.amount}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="expense-category"
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#9e9ea7',
                  marginBottom: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Category
              </label>
              <select
                id="expense-category"
                className="glass-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value !== 'Other') {
                    setErrors((prev) => ({ ...prev, customCategory: undefined }));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name} style={{ background: '#090a10', color: '#fff' }}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reveal custom category input when "Other" is selected */}
          {category === 'Other' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <label
                htmlFor="expense-custom-category"
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#9e9ea7',
                  marginBottom: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Specify category <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <input
                id="expense-custom-category"
                type="text"
                className="glass-input"
                placeholder="Enter expense category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  outline: 'none',
                  borderColor: errors.customCategory ? 'rgba(244, 63, 94, 0.7)' : undefined,
                }}
                autoFocus
              />
              {errors.customCategory && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    color: '#f87171',
                    marginTop: '5px',
                  }}
                >
                  <AlertCircle size={13} /> {errors.customCategory}
                </div>
              )}
            </motion.div>
          )}

          {/* Date and Payment Method */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {/* Date */}
            <div>
              <label
                htmlFor="expense-date"
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#9e9ea7',
                  marginBottom: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Date
              </label>
              <input
                id="expense-date"
                type="date"
                className="glass-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  outline: 'none',
                  borderColor: errors.date ? 'rgba(244, 63, 94, 0.7)' : undefined,
                }}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label
                htmlFor="expense-payment"
                style={{
                  display: 'block',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#9e9ea7',
                  marginBottom: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Payment Method
              </label>
              <select
                id="expense-payment"
                className="glass-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm} style={{ background: '#090a10', color: '#fff' }}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="expense-notes"
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#9e9ea7',
                marginBottom: '7px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Notes / Tags <span style={{ color: '#60606a', textTransform: 'none', fontWeight: 400 }}>(Optional)</span>
            </label>
            <input
              id="expense-notes"
              type="text"
              className="glass-input"
              placeholder="e.g. Shared with roommates, Mid-term supplies"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <FramerButton variant="secondary" size="md" onClick={onClose} icon="none">
              Cancel
            </FramerButton>
            <FramerButton variant="green" size="md" type="submit" icon="none">
              {initialData ? 'Save Changes' : 'Log Expense'}
            </FramerButton>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
