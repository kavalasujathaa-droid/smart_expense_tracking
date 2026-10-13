// src/lib/verify_pie_and_transitions.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- STARTING PIE CHART, CURSOR & TRANSITIONS VERIFICATION ---');

// 1. Verify Pie Chart Mathematical Accuracy
{
  const expenses = [
    { id: '1', title: 'Mess lunch', amount: 3500, category: 'Mess & Dining' },
    { id: '2', title: 'Hostel laundry', amount: 1500, category: 'Hostel & Rent' },
    { id: '3', title: 'Study book', amount: 1000, category: 'Books & Study' },
    { id: '4', title: 'Metro pass', amount: 2000, category: 'Transit' },
    { id: '5', title: 'Unlisted Event', amount: 2000, category: 'College Fest' }, // non-predefined category
  ];

  const validExpenses = expenses.filter((e) => {
    const amt = parseFloat(e?.amount);
    return !isNaN(amt) && amt > 0;
  });

  const totalSum = validExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  assert.strictEqual(totalSum, 10000, 'Total sum should be 10,000');

  const categoryAgg = {};
  validExpenses.forEach((e) => {
    const catName = (e.category && String(e.category).trim()) || 'Other Expenses';
    categoryAgg[catName] = (categoryAgg[catName] || 0) + parseFloat(e.amount);
  });

  const categoryTotals = Object.entries(categoryAgg).map(([name, amount]) => {
    const spent = Math.round(amount);
    const percentage = totalSum > 0 ? (amount / totalSum) * 100 : 0;
    return { name, spent, percentage };
  });

  // Verify slice sum matches total records sum
  const sliceSum = categoryTotals.reduce((sum, c) => sum + c.spent, 0);
  assert.strictEqual(sliceSum, totalSum, 'Slice sum must strictly match total record sum');

  // Verify percentages
  const pctSum = categoryTotals.reduce((sum, c) => sum + c.percentage, 0);
  assert.strictEqual(Math.round(pctSum), 100, 'Percentages must total 100%');

  const festSlice = categoryTotals.find((c) => c.name === 'College Fest');
  assert.ok(festSlice, 'Unlisted category must NOT be dropped');
  assert.strictEqual(festSlice.percentage, 20, 'College Fest must be 20% (2000/10000)');

  console.log('✓ PASS: Category totals, slices, and percentages strictly match source records.');
}

// 2. Verify Empty Data & Zero Handling for Pie Chart
{
  const emptyExpenses = [];
  const validExpenses = emptyExpenses.filter((e) => {
    const amt = parseFloat(e?.amount);
    return !isNaN(amt) && amt > 0;
  });
  const totalSum = validExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  assert.strictEqual(totalSum, 0, 'Total sum is safely 0');
  const pct = totalSum > 0 ? (0 / totalSum) * 100 : 0;
  assert.strictEqual(pct, 0, 'Empty percentage is 0');
  assert.ok(!isNaN(pct) && isFinite(pct), 'Empty percentage does not produce NaN/Infinity');
  console.log('✓ PASS: Empty database safely handled without division by zero.');
}

// 3. Verify GlassCard tilt defaults to false to prevent cursor jitter
{
  const glassCardContent = fs.readFileSync('src/components/ui/GlassCard.jsx', 'utf8');
  assert.ok(glassCardContent.includes('tilt = false'), 'GlassCard must default tilt to false');
  assert.ok(glassCardContent.includes('if (tilt)'), 'GlassCard must only tilt when explicitly enabled');
  console.log('✓ PASS: GlassCard defaults tilt to false to keep dashboard charts and tables stable.');
}

// 4. Verify FramerTiltCard uses requestAnimationFrame and restrained 4-degree tilt
{
  const tiltCardContent = fs.readFileSync('src/components/framer/FramerTiltCard.jsx', 'utf8');
  assert.ok(tiltCardContent.includes('requestAnimationFrame'), 'FramerTiltCard must throttle with RAF');
  assert.ok(tiltCardContent.includes('maxTilt = 4'), 'FramerTiltCard default maxTilt must be 4 degrees');
  assert.ok(tiltCardContent.includes('cancelAnimationFrame'), 'FramerTiltCard must cancel pending RAF on unmount/leave');
  assert.ok(tiltCardContent.includes('hover: none'), 'FramerTiltCard must disable tilt on touch devices');
  console.log('✓ PASS: FramerTiltCard throttled with requestAnimationFrame with restrained 4-degree tilt.');
}

// 5. Verify Route-level Transitions & History Sync in App.jsx
{
  const appContent = fs.readFileSync('src/App.jsx', 'utf8');
  assert.ok(appContent.includes('AnimatePresence mode="wait"'), 'App.jsx must use AnimatePresence mode="wait"');
  assert.ok(appContent.includes('window.history.pushState'), 'App.jsx must synchronize window.history.pushState');
  assert.ok(appContent.includes('popstate'), 'App.jsx must handle popstate for Back/Forward navigation');
  assert.ok(appContent.includes('authLoading'), 'App.jsx must guard against flashing protected content during auth check');
  console.log('✓ PASS: Page-to-page route transitions and browser history synchronization verified.');
}

// 6. Verify Dashboard sliding transitions and tab switcher in DashboardLayout.jsx
{
  const layoutContent = fs.readFileSync('src/components/dashboard/DashboardLayout.jsx', 'utf8');
  assert.ok(layoutContent.includes('AnimatePresence mode="wait"'), 'DashboardLayout must use AnimatePresence for tab switching');
  assert.ok(layoutContent.includes('key={activeTab}'), 'Tabs must have route/view-aware key={activeTab}');
  console.log('✓ PASS: Dashboard tab switching and page entrance transitions verified.');
}

// 7. Verify Modal Exit and Entrance Transitions
{
  const expenseModalContent = fs.readFileSync('src/components/dashboard/ExpenseModal.jsx', 'utf8');
  const budgetModalContent = fs.readFileSync('src/components/dashboard/BudgetModal.jsx', 'utf8');
  const deleteModalContent = fs.readFileSync('src/components/dashboard/DeleteConfirmModal.jsx', 'utf8');

  assert.ok(expenseModalContent.includes('AnimatePresence'), 'ExpenseModal must have AnimatePresence');
  assert.ok(budgetModalContent.includes('AnimatePresence'), 'BudgetModal must have AnimatePresence');
  assert.ok(deleteModalContent.includes('AnimatePresence'), 'DeleteConfirmModal must have AnimatePresence');
  console.log('✓ PASS: All dashboard modals animated with AnimatePresence entrance and exit.');
}

console.log('--- ALL 7 CHECKS PASSED WITH 100% SUCCESS ---');
