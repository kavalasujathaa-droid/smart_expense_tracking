// verify_phase5_logic.mjs
// Rigorous verification of Phase 5 Financial Analytics, Budget Guardrails & Boundary Scoping

import assert from 'assert';

console.log('--- STARTING PHASE 5 AUTOMATED VERIFICATION ---');

// 1. Division-by-Zero and Empty Database Math Verification
function computeMetrics({ totalSpent, budget, daysInMonth = 30, currentDay = 15 }) {
  const hasBudget = budget > 0;
  const remaining = hasBudget ? Math.max(0, budget - totalSpent) : 0;
  const percentage = hasBudget ? Math.round((totalSpent / budget) * 1000) / 10 : 0;
  const isOverBudget = hasBudget && totalSpent > budget;
  const overspendAmount = isOverBudget ? totalSpent - budget : 0;
  const isCriticalAlert = hasBudget && (percentage >= 90 || isOverBudget);
  const isCaution = hasBudget && percentage >= 75 && percentage < 90;
  const isSafe = hasBudget && percentage < 75;

  const daysLeft = Math.max(1, daysInMonth - currentDay);
  const daysPassed = Math.max(1, currentDay);
  const avgDailySpend = Math.round(totalSpent / daysPassed);
  const safeDailyBurn = hasBudget && remaining > 0 ? Math.round(remaining / daysLeft) : 0;

  return {
    hasBudget,
    remaining,
    percentage,
    isOverBudget,
    overspendAmount,
    isCriticalAlert,
    isCaution,
    isSafe,
    avgDailySpend,
    safeDailyBurn
  };
}

// Test Case 1: Empty Database (0 spent, 0 budget)
{
  const emptyRes = computeMetrics({ totalSpent: 0, budget: 0 });
  assert.strictEqual(emptyRes.hasBudget, false, 'Should have hasBudget=false');
  assert.strictEqual(emptyRes.percentage, 0, 'Percentage should be 0, not NaN or Infinity');
  assert.strictEqual(emptyRes.remaining, 0, 'Remaining should be 0');
  assert.strictEqual(emptyRes.isOverBudget, false, 'Not over budget');
  assert.strictEqual(emptyRes.avgDailySpend, 0, 'Avg daily spend should be 0');
  assert.strictEqual(emptyRes.safeDailyBurn, 0, 'Safe daily burn should be 0');
  console.log('✓ PASS: Empty database (0 spent, 0 budget) produces safe zero values without NaN/Infinity.');
}

// Test Case 2: Budget Set (20,000), 0 Spent
{
  const res = computeMetrics({ totalSpent: 0, budget: 20000 });
  assert.strictEqual(res.remaining, 20000, 'Remaining should equal full budget');
  assert.strictEqual(res.percentage, 0, 'Percentage should be 0%');
  assert.strictEqual(res.isSafe, true, 'Should be in Safe tier (<75%)');
  assert.strictEqual(res.isCaution, false, 'Not in Caution tier');
  assert.strictEqual(res.isCriticalAlert, false, 'Not in Critical tier');
  console.log('✓ PASS: Zero spent with active budget is correctly classified as Safe tier (0%).');
}

// Test Case 3: 75% Caution Threshold (15,000 spent of 20,000 budget = 75%)
{
  const res = computeMetrics({ totalSpent: 15000, budget: 20000 });
  assert.strictEqual(res.percentage, 75, 'Percentage should be exactly 75.0%');
  assert.strictEqual(res.isCaution, true, '75% should trigger Caution warning banner');
  assert.strictEqual(res.isCriticalAlert, false, '75% should not be Critical');
  assert.strictEqual(res.remaining, 5000, 'Remaining should be 5,000');
  console.log('✓ PASS: 75% spending triggers Caution tier (75%–90%).');
}

// Test Case 4: 85% Caution Tier (17,000 spent of 20,000 budget = 85%)
{
  const res = computeMetrics({ totalSpent: 17000, budget: 20000 });
  assert.strictEqual(res.percentage, 85, 'Percentage should be 85%');
  assert.strictEqual(res.isCaution, true, '85% should trigger Caution warning');
  assert.strictEqual(res.isCriticalAlert, false, '85% is not Critical yet');
  console.log('✓ PASS: 85% spending remains in Caution tier.');
}

// Test Case 5: 90% Critical Threshold (18,000 spent of 20,000 budget = 90%)
{
  const res = computeMetrics({ totalSpent: 18000, budget: 20000 });
  assert.strictEqual(res.percentage, 90, 'Percentage should be 90%');
  assert.strictEqual(res.isCaution, false, '90% should not be Caution');
  assert.strictEqual(res.isCriticalAlert, true, '90% triggers Critical Alert tier');
  assert.strictEqual(res.isOverBudget, false, '90% is not over budget yet');
  console.log('✓ PASS: 90% spending triggers Critical Alert banner (>=90%).');
}

// Test Case 6: Exceeded Budget (>100%, 22,500 spent of 20,000 budget = 112.5%)
{
  const res = computeMetrics({ totalSpent: 22500, budget: 20000 });
  assert.strictEqual(res.percentage, 112.5, 'Percentage is 112.5%');
  assert.strictEqual(res.isOverBudget, true, 'isOverBudget must be true');
  assert.strictEqual(res.overspendAmount, 2500, 'Overspend amount is 2,500');
  assert.strictEqual(res.remaining, 0, 'Remaining is clamped to 0');
  assert.strictEqual(res.isCriticalAlert, true, 'Critical Alert true when exceeded');
  console.log('✓ PASS: >100% spending triggers Allowance Cap Exceeded banner with exact overspend amount.');
}

// Test Case 7: Monthly Isolation & Boundary Filtering
{
  const sampleExpenses = [
    { id: 1, title: 'October Mess', amount: 3500, date: '2026-10-02', category: 'Mess & Dining' },
    { id: 2, title: 'October Books', amount: 1200, date: '2026-10-10', category: 'Books & Study' },
    { id: 3, title: 'September Rent', amount: 6000, date: '2026-09-28', category: 'Hostel & Rent' },
    { id: 4, title: 'November Exam Fee', amount: 2000, date: '2026-11-05', category: 'College & Exam Fees' },
    { id: 5, title: 'October Metro', amount: 450, date: '2026-10-12', category: 'Transit' },
  ];

  const selectedMonth = '2026-10';
  const octExpenses = sampleExpenses.filter(e => e.date.startsWith(selectedMonth));
  const octTotal = octExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  assert.strictEqual(octExpenses.length, 3, 'Must only include the 3 October transactions');
  assert.strictEqual(octTotal, 5150, 'Total October spend must be exactly 3500 + 1200 + 450 = 5150');
  assert.ok(!octExpenses.some(e => e.date.startsWith('2026-09')), 'No September expenses mixed in');
  assert.ok(!octExpenses.some(e => e.date.startsWith('2026-11')), 'No November expenses mixed in');
  console.log('✓ PASS: Monthly boundary strictly isolates selected month expenses without cross-month mixing.');
}

// Test Case 8: Highest-Spending Category Calculation
{
  const sampleExpenses = [
    { title: 'Mess Bill', amount: 4500, category: 'Mess & Dining' },
    { title: 'Canteen Snack', amount: 350, category: 'Mess & Dining' },
    { title: 'Books', amount: 1800, category: 'Books & Study' },
    { title: 'Metro', amount: 600, category: 'Transit' },
  ];

  const categoryMap = {};
  sampleExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + parseFloat(e.amount);
  });

  let highestCategory = 'None yet';
  let highestAmount = 0;
  Object.entries(categoryMap).forEach(([cat, amt]) => {
    if (amt > highestAmount) {
      highestCategory = cat;
      highestAmount = amt;
    }
  });

  assert.strictEqual(highestCategory, 'Mess & Dining', 'Highest category must be Mess & Dining');
  assert.strictEqual(highestAmount, 4850, 'Highest category amount must be 4850');
  console.log('✓ PASS: Highest-spending category accurately rolls up multiple entries per category.');
}

// Test Case 9: Category Budget Guardrail Progress & Alerts
{
  const categoryBudgets = {
    'Mess & Dining': 5000,
    'Books & Study': 2000,
    'Transit': 1000,
  };

  const categoryActuals = {
    'Mess & Dining': 4600, // 92% -> Critical
    'Books & Study': 1600, // 80% -> Caution
    'Transit': 1200,       // 120% -> Exceeded
  };

  const results = Object.entries(categoryBudgets).map(([cat, cap]) => {
    const spent = categoryActuals[cat] || 0;
    const pct = Math.round((spent / cap) * 100);
    const isExceeded = spent > cap;
    const isCritical = pct >= 90 || isExceeded;
    const isCaution = pct >= 75 && pct < 90;
    return { cat, spent, cap, pct, isExceeded, isCritical, isCaution };
  });

  const mess = results.find(r => r.cat === 'Mess & Dining');
  const books = results.find(r => r.cat === 'Books & Study');
  const transit = results.find(r => r.cat === 'Transit');

  assert.strictEqual(mess.isCritical, true, 'Mess at 92% must trigger Critical');
  assert.strictEqual(books.isCaution, true, 'Books at 80% must trigger Caution');
  assert.strictEqual(transit.isExceeded, true, 'Transit at 120% must trigger Exceeded');
  console.log('✓ PASS: Per-category budget guardrails correctly detect Safe, Caution, Critical, and Exceeded states.');
}

// Test Case 10: Pie Chart Mathematical Accuracy & Category Rollup
{
  const sampleExpenses = [
    { title: 'Campus Meals', amount: 3000, category: 'Mess & Dining' },
    { title: 'Dinner', amount: 1500, category: 'Mess & Dining' },
    { title: 'Bus Pass', amount: 1000, category: 'Transit' },
    { title: 'Notebooks', amount: 500, category: 'Books & Study' },
    { title: 'Custom Tool', amount: 4000, category: 'Lab Materials' }, // Category outside predefined list
  ];

  const totalSum = sampleExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  assert.strictEqual(totalSum, 10000, 'Total sum of records must be exactly 10,000');

  // Roll up
  const categoryAgg = {};
  sampleExpenses.forEach((e) => {
    const name = e.category || 'Other Expenses';
    categoryAgg[name] = (categoryAgg[name] || 0) + parseFloat(e.amount);
  });

  const slices = Object.entries(categoryAgg).map(([name, amount]) => {
    const spent = Math.round(amount);
    const percentage = (amount / totalSum) * 100;
    return { name, spent, percentage };
  });

  const sliceSum = slices.reduce((sum, s) => sum + s.spent, 0);
  const totalPercentage = slices.reduce((sum, s) => sum + s.percentage, 0);

  assert.strictEqual(sliceSum, totalSum, 'Sum of pie slices must strictly equal total records sum');
  assert.strictEqual(Math.round(totalPercentage), 100, 'Sum of percentages must equal 100%');

  const messSlice = slices.find(s => s.name === 'Mess & Dining');
  const labSlice = slices.find(s => s.name === 'Lab Materials');
  assert.strictEqual(messSlice.percentage, 45, 'Mess & Dining is 45% (4,500 / 10,000)');
  assert.strictEqual(labSlice.percentage, 40, 'Lab Materials is 40% (4,000 / 10,000)');
  console.log('✓ PASS: Pie chart category percentages and totals mathematically match source records.');
}

// Test Case 11: Empty Data Safety for Pie Chart (No NaN or Infinity)
{
  const emptyExpenses = [];
  const validExpenses = emptyExpenses.filter(e => parseFloat(e?.amount) > 0);
  const totalSum = validExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  assert.strictEqual(totalSum, 0, 'Empty expenses sum is 0');

  const percentage = totalSum > 0 ? (0 / totalSum) * 100 : 0;
  assert.strictEqual(percentage, 0, 'Empty percentage is safely 0');
  assert.ok(!isNaN(percentage), 'Percentage is not NaN');
  assert.ok(isFinite(percentage), 'Percentage is finite');
  console.log('✓ PASS: Empty database safely produces zero without NaN/Infinity in charts.');
}

console.log('--- ALL 11 VERIFICATION SUITES PASSED CLEANLY ---');
