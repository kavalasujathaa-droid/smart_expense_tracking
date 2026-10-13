// src/lib/expenseService.js
// Supabase Database Service Layer for Smart Expense Tracking
// Scoped to the authenticated user with Row Level Security (RLS)
import { supabase, isSupabaseConfigured } from './supabase.js';

export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'Utensils', color: '#19e68c' },
  { id: 'transport', name: 'Transport', icon: 'Train', color: '#f59e0b' },
  { id: 'education', name: 'Education', icon: 'BookOpen', color: '#35a7ff' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', color: '#38bdf8' },
  { id: 'health', name: 'Health', icon: 'HeartPulse', color: '#ff5268' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#8b5cf6' },
  { id: 'other', name: 'Other', icon: 'HelpCircle', color: '#a1a1aa' },
];

const CUSTOM_PALETTE = [
  '#14b8a6', '#f43f5e', '#84cc16', '#a855f7', '#f97316', '#06b6d4', '#eab308'
];

/**
 * Resolves category details (name, icon, color) for standard or custom categories
 */
export function getCategoryDetails(categoryName) {
  if (!categoryName) return { id: 'other', name: 'Other', icon: 'HelpCircle', color: '#a1a1aa' };

  const trimmed = categoryName.trim();
  const found = CATEGORIES.find(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (found) return found;

  const legacyMap = {
    'mess & dining': { id: 'food', name: 'Food', icon: 'Utensils', color: '#10b981' },
    'hostel & rent': { id: 'bills', name: 'Bills', icon: 'Receipt', color: '#3b82f6' },
    'books & study': { id: 'education', name: 'Education', icon: 'BookOpen', color: '#06b6d4' },
    'transit': { id: 'transport', name: 'Transport', icon: 'Train', color: '#f59e0b' },
    'tech & utilities': { id: 'bills', name: 'Bills', icon: 'Receipt', color: '#3b82f6' },
    'social & outings': { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#8b5cf6' },
    'exam & lab fees': { id: 'education', name: 'Education', icon: 'BookOpen', color: '#06b6d4' },
    'other expenses': { id: 'other', name: 'Other', icon: 'HelpCircle', color: '#a1a1aa' },
  };
  const lower = trimmed.toLowerCase();
  if (legacyMap[lower]) {
    return legacyMap[lower];
  }

  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = trimmed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % CUSTOM_PALETTE.length;

  return {
    id: `custom-${lower.replace(/[^a-z0-9]+/g, '-')}`,
    name: trimmed,
    icon: 'Tag',
    color: CUSTOM_PALETTE[colorIndex],
  };
}

export const PAYMENT_METHODS = [
  'UPI / GPay / PhonePe',
  'Debit Card',
  'Cash',
  'Net Banking',
];

function checkClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env.local file.'
    );
  }
}

// 1. Fetch all expenses for the authenticated user
export async function fetchExpenses(userId) {
  checkClient();
  if (!userId) throw new Error('User ID is required to fetch expenses.');

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching expenses from Supabase:', error);
    throw new Error(error.message || 'Failed to retrieve expenses from database.');
  }

  // Normalize field names to match frontend UI expectations
  return (data || []).map((row) => {
    const cat = getCategoryDetails(row.category);
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      amount: parseFloat(row.amount),
      category: row.category,
      date: row.expense_date, // normalized to date for UI
      notes: row.notes || '',
      paymentMethod: row.payment_method || 'UPI',
      icon: cat.icon,
      color: cat.color,
      createdAt: row.created_at,
    };
  });
}

// 2. Insert a new expense record
export async function createExpense(userId, expenseData) {
  checkClient();
  if (!userId) throw new Error('User ID is required to create an expense.');

  const payload = {
    user_id: userId,
    title: expenseData.title.trim(),
    amount: parseFloat(expenseData.amount),
    category: expenseData.category,
    expense_date: expenseData.date || new Date().toISOString().split('T')[0],
    notes: expenseData.notes ? expenseData.notes.trim() : null,
    payment_method: expenseData.paymentMethod || 'UPI',
  };

  const { data, error } = await supabase
    .from('expenses')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error creating expense in Supabase:', error);
    throw new Error(error.message || 'Failed to save expense to database.');
  }

  const cat = getCategoryDetails(data.category);
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    amount: parseFloat(data.amount),
    category: data.category,
    date: data.expense_date,
    notes: data.notes || '',
    paymentMethod: data.payment_method || 'UPI',
    icon: cat.icon,
    color: cat.color,
    createdAt: data.created_at,
  };
}

// 3. Update an existing expense record
export async function updateExpense(userId, expenseId, expenseData) {
  checkClient();
  if (!userId || !expenseId) throw new Error('User ID and Expense ID are required to update.');

  const payload = {
    title: expenseData.title.trim(),
    amount: parseFloat(expenseData.amount),
    category: expenseData.category.trim(),
    expense_date: expenseData.date,
    notes: expenseData.notes ? expenseData.notes.trim() : null,
    payment_method: expenseData.paymentMethod || 'UPI',
  };

  const { data, error } = await supabase
    .from('expenses')
    .update(payload)
    .eq('id', expenseId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating expense in Supabase:', error);
    throw new Error(error.message || 'Failed to update expense in database.');
  }

  const cat = getCategoryDetails(data.category);
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    amount: parseFloat(data.amount),
    category: data.category,
    date: data.expense_date,
    notes: data.notes || '',
    paymentMethod: data.payment_method || 'UPI',
    icon: cat.icon,
    color: cat.color,
    createdAt: data.created_at,
  };
}

// 4. Delete an expense record
export async function deleteExpense(userId, expenseId) {
  checkClient();
  if (!userId || !expenseId) throw new Error('User ID and Expense ID are required to delete.');

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting expense from Supabase:', error);
    throw new Error(error.message || 'Failed to delete expense from database.');
  }

  return true;
}

// Helper: Get first day of current month in YYYY-MM-01 format
export function getCurrentMonthStart() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

// Helper: Generate list of selectable months (current and past 11 months)
export function getSelectableMonths() {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const value = `${year}-${month}`;
    const start = `${year}-${month}-01`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    months.push({ value, start, label });
  }
  return months;
}

// 5. Fetch overall monthly budget cap
export async function fetchMonthlyBudget(userId, monthStart = getCurrentMonthStart()) {
  checkClient();
  if (!userId) return 0;

  const { data, error } = await supabase
    .from('monthly_budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month_start', monthStart)
    .eq('category', 'OVERALL')
    .maybeSingle();

  if (error) {
    console.error('Error fetching monthly budget:', error);
    throw new Error(error.message || 'Failed to load monthly budget.');
  }

  return data ? parseFloat(data.amount) : 0;
}

// 6. Fetch ALL budgets for a month (overall + per-category)
export async function fetchMonthlyBudgets(userId, monthStart = getCurrentMonthStart()) {
  checkClient();
  if (!userId) return { overall: 0, categories: {} };

  const { data, error } = await supabase
    .from('monthly_budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month_start', monthStart);

  if (error) {
    console.error('Error fetching budgets:', error);
    throw new Error(error.message || 'Failed to load budgets from database.');
  }

  const result = { overall: 0, categories: {} };
  (data || []).forEach((row) => {
    const amt = parseFloat(row.amount);
    if (row.category === 'OVERALL') {
      result.overall = amt;
    } else {
      result.categories[row.category] = amt;
    }
  });

  return result;
}

// 7. Set / Upsert monthly overall budget cap
export async function upsertMonthlyBudget(userId, amount, monthStart = getCurrentMonthStart()) {
  checkClient();
  if (!userId) throw new Error('User ID is required to set a budget.');

  const payload = {
    user_id: userId,
    month_start: monthStart,
    category: 'OVERALL',
    amount: parseFloat(amount),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('monthly_budgets')
    .upsert(payload, { onConflict: 'user_id,month_start,category' })
    .select()
    .single();

  if (error) {
    console.error('Error setting budget in Supabase:', error);
    throw new Error(error.message || 'Failed to save monthly budget.');
  }

  return parseFloat(data.amount);
}

// 8. Set / Upsert category-specific budget cap
export async function upsertCategoryBudget(userId, category, amount, monthStart = getCurrentMonthStart()) {
  checkClient();
  if (!userId) throw new Error('User ID is required to set a category budget.');

  const payload = {
    user_id: userId,
    month_start: monthStart,
    category: category,
    amount: parseFloat(amount),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('monthly_budgets')
    .upsert(payload, { onConflict: 'user_id,month_start,category' })
    .select()
    .single();

  if (error) {
    console.error('Error setting category budget in Supabase:', error);
    throw new Error(error.message || 'Failed to save category budget.');
  }

  return {
    category: data.category,
    amount: parseFloat(data.amount),
  };
}
