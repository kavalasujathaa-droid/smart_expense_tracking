import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Home,
  BookOpen,
  Train,
  Car,
  Wifi,
  Coffee,
  FileText,
  HelpCircle,
  ShoppingBag,
  Receipt,
  HeartPulse,
  Film,
  Gamepad2,
  Tag,
  MoreHorizontal,
  Edit2,
  Trash2,
  PlusCircle,
  Inbox
} from 'lucide-react';
import Badge from '../ui/Badge';

const CATEGORY_ICON_MAP = {
  Utensils,
  Home,
  BookOpen,
  Train,
  Car,
  Wifi,
  Coffee,
  FileText,
  HelpCircle,
  ShoppingBag,
  Receipt,
  HeartPulse,
  Film,
  Gamepad2,
  Tag,
  MoreHorizontal,
};

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  onAddNew,
  isFiltered,
  onResetFilters,
}) {
  if (expenses.length === 0) {
    return (
      <div className="table-empty-state">
        <div className="empty-state-icon">
          <Inbox size={32} />
        </div>
        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
          {isFiltered ? 'No Matching Expenses Found' : 'Your Expense Ledger is Empty'}
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 18px auto', lineHeight: 1.5 }}>
          {isFiltered
            ? 'Try adjusting your search terms, changing the category, or clearing date filters.'
            : 'Start tracking your daily college expenses by logging your first transaction!'}
        </p>
        {isFiltered ? (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onResetFilters}>
            Reset Filters
          </button>
        ) : (
          <button type="button" className="btn btn-green btn-sm" onClick={onAddNew}>
            <PlusCircle size={14} /> Log First Expense
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="expense-table-container">
      {/* Desktop Table View */}
      <table className="expense-table">
        <thead>
          <tr>
            <th style={{ width: '38%' }}>Title & Merchant</th>
            <th style={{ width: '18%' }}>Category</th>
            <th style={{ width: '16%' }}>Date & Payment</th>
            <th style={{ width: '16%', textAlign: 'right' }}>Amount</th>
            <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {expenses.map((expense) => {
              const Icon = CATEGORY_ICON_MAP[expense.icon] || HelpCircle;
              return (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="expense-row"
                >
                  {/* Title & Merchant */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        className="expense-category-avatar"
                        style={{ color: expense.color || 'var(--accent-green, #19e68c)' }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="expense-row-title">{expense.title}</div>
                        {expense.notes && (
                          <div className="expense-row-notes">{expense.notes}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="expense-category-pill">
                      {expense.category}
                    </span>
                  </td>

                  {/* Date & Payment */}
                  <td>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {expense.date}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {expense.paymentMethod}
                    </div>
                  </td>

                  {/* Amount */}
                  <td style={{ textAlign: 'right' }}>
                    <span className="expense-row-amount mono">
                      -₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        className="table-action-btn edit"
                        onClick={() => onEdit(expense)}
                        aria-label={`Edit ${expense.title}`}
                        title="Edit expense"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="table-action-btn delete"
                        onClick={() => onDelete(expense)}
                        aria-label={`Delete ${expense.title}`}
                        title="Delete expense"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="expense-mobile-list">
        <AnimatePresence initial={false}>
          {expenses.map((expense) => {
            const Icon = CATEGORY_ICON_MAP[expense.icon] || HelpCircle;
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="expense-mobile-card"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="expense-category-avatar" style={{ color: expense.color || 'var(--accent-green, #19e68c)' }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="expense-row-title">{expense.title}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {expense.category} • {expense.date}
                      </div>
                    </div>
                  </div>
                  <div className="expense-row-amount mono">
                    -₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                  </div>
                </div>

                {expense.notes && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', paddingLeft: '42px' }}>
                    {expense.notes}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {expense.paymentMethod}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="table-action-btn edit"
                      onClick={() => onEdit(expense)}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="table-action-btn delete"
                      onClick={() => onDelete(expense)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
