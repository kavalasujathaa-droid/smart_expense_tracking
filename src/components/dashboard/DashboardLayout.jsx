import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Plus,
  ArrowLeft,
  Menu,
  X,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  LogOut,
  RefreshCw,
  Calendar
} from 'lucide-react';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchMonthlyBudgets,
  upsertMonthlyBudget,
  upsertCategoryBudget,
  getSelectableMonths,
  CATEGORIES
} from '../../lib/expenseService';
import Button from '../ui/Button';
import DashboardMetrics from './DashboardMetrics';
import DashboardAnalytics from './DashboardAnalytics';
import ExpenseFilters from './ExpenseFilters';
import ExpenseTable from './ExpenseTable';
import ExpenseModal from './ExpenseModal';
import BudgetModal from './BudgetModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function DashboardLayout({ onBackToLanding, user, onLogout }) {
  // State
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'expenses' | 'analytics'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Month selector
  const monthsList = getSelectableMonths();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  });
  const selectedMonthStart = `${selectedMonth}-01`;
  const selectedMonthObj = monthsList.find((m) => m.value === selectedMonth);
  const selectedMonthLabel = selectedMonthObj ? selectedMonthObj.label : selectedMonth;

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Modals State
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (msg, isErr = false) => {
    setToast({ text: msg, isErr });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedExpenses, budgetData] = await Promise.all([
        fetchExpenses(user.id),
        fetchMonthlyBudgets(user.id, selectedMonthStart),
      ]);
      setExpenses(fetchedExpenses || []);
      setBudget(budgetData.overall || 0);
      setCategoryBudgets(budgetData.categories || {});
    } catch (err) {
      console.error('Failed to load Supabase data:', err);
      setError(err.message || 'Failed to load records from Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load real data from Supabase on mount or when user/month changes
  useEffect(() => {
    if (user?.id) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, selectedMonth]);

  // Expenses filtered specifically for the selected month (used for monthly analytics and metrics)
  const selectedMonthExpenses = expenses.filter((e) => {
    if (!e.date) return false;
    return e.date.startsWith(selectedMonth);
  });

  // Monthly spent strictly for the selected month
  const selectedMonthTotalSpent = selectedMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  // Dynamic list of all categories present across standard list + user expenses
  const availableCategories = Array.from(
    new Set([
      ...CATEGORIES.map((c) => c.name),
      ...expenses.map((e) => e.category).filter(Boolean),
    ])
  );

  // Global Filter & Sort Logic for ledger view
  const filteredExpenses = expenses.filter((item) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title && item.title.toLowerCase().includes(q);
      const matchNotes = item.notes && item.notes.toLowerCase().includes(q);
      const matchCategory = item.category && item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchCategory) return false;
    }

    // Category
    if (selectedCategory !== 'ALL') {
      if (item.category !== selectedCategory) return false;
    }

    // Date Filter
    if (dateFilter !== 'ALL') {
      const expenseDate = new Date(item.date);
      const now = new Date();
      if (dateFilter === 'THIS_MONTH') {
        if (!item.date || !item.date.startsWith(selectedMonth)) {
          return false;
        }
      } else if (dateFilter === 'PAST_30_DAYS') {
        const diffDays = (now - expenseDate) / (1000 * 60 * 60 * 24);
        if (diffDays > 30) return false;
      } else if (dateFilter === 'PAST_7_DAYS') {
        const diffDays = (now - expenseDate) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'NEWEST') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'OLDEST') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'AMOUNT_HIGH') return parseFloat(b.amount) - parseFloat(a.amount);
    if (sortBy === 'AMOUNT_LOW') return parseFloat(a.amount) - parseFloat(b.amount);
    return 0;
  });

  // Handlers for Expense CRUD using real Supabase operations
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleSaveExpense = async (formData) => {
    if (!user?.id) {
      showToast('You must be logged in to save expenses.', true);
      return;
    }
    try {
      if (editingExpense) {
        const updated = await updateExpense(user.id, editingExpense.id, formData);
        setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        showToast(`Updated "${formData.title}"!`);
      } else {
        const created = await createExpense(user.id, formData);
        setExpenses((prev) => [created, ...prev]);
        showToast(`Logged "${formData.title}" for ₹${parseFloat(formData.amount).toLocaleString('en-IN')}!`);
      }
      setExpenseModalOpen(false);
    } catch (err) {
      console.error('Error saving expense:', err);
      showToast(err.message || 'Failed to save expense.', true);
    }
  };

  const handleOpenDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    if (!user?.id) return;
    try {
      await deleteExpense(user.id, id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
      showToast('Expense record removed from database');
    } catch (err) {
      console.error('Error deleting expense:', err);
      showToast(err.message || 'Failed to delete expense.', true);
    }
  };

  const handleSaveBudget = async ({ overall, categories }) => {
    if (!user?.id) {
      showToast('You must be logged in to set budget.', true);
      return;
    }
    try {
      const savedOverall = await upsertMonthlyBudget(user.id, overall, selectedMonthStart);
      setBudget(savedOverall);

      if (categories && Object.keys(categories).length > 0) {
        for (const [catName, capAmount] of Object.entries(categories)) {
          await upsertCategoryBudget(user.id, catName, capAmount, selectedMonthStart);
        }
        setCategoryBudgets(categories);
      }

      setBudgetModalOpen(false);
      showToast(`Budget settings saved for ${selectedMonthLabel}!`);
    } catch (err) {
      console.error('Error updating budget:', err);
      showToast(err.message || 'Failed to update budget.', true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setDateFilter('ALL');
    setSortBy('NEWEST');
  };

  // Export to CSV with required filename format: Smart_Expense_Tracking_Expenses_YYYY-MM-DD.csv
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showToast('No expenses available to export!', true);
      return;
    }
    const headers = ['ID', 'Title', 'Amount (INR)', 'Category', 'Date', 'Payment Method', 'Notes'];
    const rows = expenses.map((e) => [
      e.id,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      e.amount,
      `"${e.category || ''}"`,
      e.date,
      `"${e.paymentMethod || 'UPI'}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Smart_Expense_Tracking_Expenses_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Expenses exported to CSV successfully!');
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U';
  const userDisplayName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Student');

  return (
    <motion.div
      className="dashboard-app-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Toast Feedback */}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'rgba(9, 11, 18, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${toast.isErr ? 'rgba(255, 82, 104, 0.4)' : 'rgba(25, 230, 140, 0.4)'}`,
            borderRadius: '16px',
            padding: '12px 20px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-glass-elevated)',
            fontSize: '13.5px',
          }}
        >
          {toast.isErr ? (
            <AlertTriangle size={16} color="var(--accent-red)" />
          ) : (
            <CheckCircle2 size={16} color="var(--accent-green)" />
          )}
          <span>{toast.text}</span>
        </aside>
      )}

      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand-area">
          <div className="brand-logo" style={{ fontSize: '15px' }}>
            <div className="brand-icon">
              <Wallet size={16} strokeWidth={2.5} />
            </div>
            <span>Smart Expense Tracking</span>
          </div>
          <button
            type="button"
            className="sidebar-close-mobile-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Real User Profile Card */}
        <div className="sidebar-profile-card">
          <div
            className="mockup-avatar"
            style={{
              width: '36px',
              height: '36px',
              fontSize: '14px',
              fontWeight: 700,
              background: 'rgba(25, 230, 140, 0.15)',
              color: 'var(--accent-green)',
              border: '1px solid rgba(25, 230, 140, 0.3)',
            }}
          >
            {userInitial}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {userDisplayName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email || 'Protected Account'}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setMobileSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={16} />
            <span>Financial Overview</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('expenses');
              setMobileSidebarOpen(false);
            }}
          >
            <Receipt size={16} />
            <span>Expense Management ({expenses.length})</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('analytics');
              setMobileSidebarOpen(false);
            }}
          >
            <PieChart size={16} />
            <span>Spending Analytics</span>
          </button>

          <button
            type="button"
            className="sidebar-nav-item"
            onClick={() => {
              setBudgetModalOpen(true);
              setMobileSidebarOpen(false);
            }}
          >
            <Target size={16} />
            <span>Budget Cap ({budget > 0 ? `₹${budget.toLocaleString('en-IN')}` : 'Set Cap'})</span>
          </button>
        </nav>

        {/* Action Buttons in Sidebar */}
        <div className="sidebar-footer-actions">
          <Button
            variant="green"
            size="md"
            style={{ width: '100%', marginBottom: '10px' }}
            onClick={() => {
              handleOpenAddModal();
              setMobileSidebarOpen(false);
            }}
            icon={Plus}
          >
            Log Expense
          </Button>

          <Button
            variant="secondary"
            size="sm"
            style={{ width: '100%', marginBottom: '10px', fontSize: '12px' }}
            onClick={handleExportCSV}
            icon={Download}
          >
            Export CSV
          </Button>

          {onLogout && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: '12px', color: 'var(--text-muted)' }}
              onClick={onLogout}
              title="Log out of account"
            >
              <LogOut size={13} style={{ marginRight: '6px' }} /> Log out
            </button>
          )}

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '14px 0' }} />

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
            onClick={onBackToLanding}
          >
            <ArrowLeft size={13} style={{ marginRight: '6px' }} /> Return to Website
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main-area">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="dashboard-mobile-menu-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                {activeTab === 'overview' && 'Executive Financial Overview'}
                {activeTab === 'expenses' && 'Expense Management & Records'}
                {activeTab === 'analytics' && 'Spending Visualizations & Trends'}
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Authenticated PostgreSQL Ledger • Format in INR (₹)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Active Month Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.045)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-glass-light)',
                backdropFilter: 'var(--blur-glass-sm)',
                WebkitBackdropFilter: 'var(--blur-glass-sm)',
                boxShadow: 'var(--shadow-glass-sm)',
              }}
            >
              <Calendar size={13} color="var(--accent-blue)" />
              <select
                aria-label="Select active month"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {monthsList.map((m) => (
                  <option key={m.value} value={m.value} style={{ background: '#0a0a0c', color: '#fff' }}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm hidden-mobile"
              onClick={loadData}
              title="Refresh ledger from Supabase"
              disabled={isLoading}
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm hidden-mobile"
              onClick={onBackToLanding}
            >
              <ArrowLeft size={13} /> Landing Page
            </button>

            <Button
              variant="green"
              size="sm"
              onClick={handleOpenAddModal}
              icon={Plus}
            >
              + Log Expense
            </Button>
          </div>
        </header>

        {/* Database Error Banner if any */}
        {error && (
          <div
            style={{
              margin: '20px 24px 0 24px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 82, 104, 0.08)',
              border: '1px solid rgba(255, 82, 104, 0.3)',
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13.5px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={loadData}
              style={{ fontSize: '12px' }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Dashboard Content Container */}
        <div className="dashboard-content-body">
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '320px',
                gap: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <Loader2 size={32} className="animate-spin" color="var(--accent-green)" />
              <p style={{ fontSize: '14px' }}>Loading authenticated database records...</p>
            </div>
          ) : (
            <>
              {/* Top 4 Metrics Summary (Calculated strictly for selected month) */}
              <DashboardMetrics
                totalSpent={selectedMonthTotalSpent}
                budget={budget}
                transactionCount={selectedMonthExpenses.length}
                expenses={selectedMonthExpenses}
                selectedMonthLabel={selectedMonthLabel}
                onOpenBudgetModal={() => setBudgetModalOpen(true)}
                onNavigateToExpenses={() => setActiveTab('expenses')}
              />

              {/* Animated Tab Content Switcher with smooth slide & fade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Conditional Analytics View (Donut, Trajectory, Category Budgets) */}
                  {(activeTab === 'overview' || activeTab === 'analytics') && (
                    <DashboardAnalytics
                      expenses={selectedMonthExpenses}
                      currentBudget={budget}
                      categoryBudgets={categoryBudgets}
                      selectedMonthLabel={selectedMonthLabel}
                    />
                  )}

                  {/* Dedicated Expense Management View */}
                  {activeTab === 'expenses' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card"
                      style={{
                        background: 'var(--bg-glass-card, rgba(255, 255, 255, 0.04))',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '20px',
                        boxShadow: 'var(--shadow-glass-panel)',
                        backdropFilter: 'var(--blur-glass-md)',
                        WebkitBackdropFilter: 'var(--blur-glass-md)',
                        padding: '26px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                            Expense Records & History
                          </h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Search, filter, edit, or export your private expenses • Protected by Row Level Security (RLS)
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            variant="green"
                            size="sm"
                            onClick={handleOpenAddModal}
                            icon={Plus}
                          >
                            Add Expense
                          </Button>
                        </div>
                      </div>

                      {/* Filters Toolbar */}
                      <ExpenseFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        dateFilter={dateFilter}
                        onDateFilterChange={setDateFilter}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        totalCount={expenses.length}
                        filteredCount={filteredExpenses.length}
                        onResetFilters={handleResetFilters}
                        categories={availableCategories}
                      />

                      {/* Expenses Table */}
                      <ExpenseTable
                        expenses={filteredExpenses}
                        onEdit={handleOpenEditModal}
                        onDelete={handleOpenDeleteModal}
                        onAddNew={handleOpenAddModal}
                        isFiltered={Boolean(searchQuery || selectedCategory !== 'ALL' || dateFilter !== 'ALL')}
                        onResetFilters={handleResetFilters}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </main>

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        initialData={editingExpense}
      />

      {/* Set Monthly Budget Modal */}
      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        currentBudget={budget}
        categoryBudgets={categoryBudgets}
        selectedMonthLabel={selectedMonthLabel}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        expense={expenseToDelete}
      />
    </motion.div>
  );
}
