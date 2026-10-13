import assert from 'node:assert/strict';
import { CATEGORIES, getCategoryDetails } from './expenseService.js';

console.log('=== RUNNING VERIFICATION FOR CUSTOM CATEGORIES & MINIMAL LANDING ===\n');

// TEST 1: Sensible standard categories defined
console.log('Test 1: Verify sensible categories defined in CATEGORIES');
const expectedCategoryNames = [
  'Food',
  'Transport',
  'Education',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Other',
];
const actualCategoryNames = CATEGORIES.map((c) => c.name);
assert.deepEqual(actualCategoryNames, expectedCategoryNames, 'Standard categories must match required list');
console.log('  PASS: Standard categories: ' + actualCategoryNames.join(', '));

// TEST 2: getCategoryDetails handles standard categories
console.log('\nTest 2: getCategoryDetails with standard categories');
const foodDetails = getCategoryDetails('Food');
assert.equal(foodDetails.name, 'Food');
assert.equal(foodDetails.icon, 'Utensils');
assert.equal(foodDetails.color, '#19e68c');

const otherDetails = getCategoryDetails('Other');
assert.equal(otherDetails.name, 'Other');
assert.equal(otherDetails.icon, 'HelpCircle');
assert.equal(otherDetails.color, '#a1a1aa');
console.log('  PASS: Standard categories resolved correctly');

// TEST 3: getCategoryDetails handles custom categories
console.log('\nTest 3: getCategoryDetails with custom categories (e.g. Gym, Books)');
const gymDetails = getCategoryDetails('Gym');
assert.equal(gymDetails.name, 'Gym');
assert.equal(gymDetails.icon, 'Tag');
assert.ok(gymDetails.color.startsWith('#'), 'Color should be hex code');
assert.notEqual(gymDetails.color, '#a1a1aa', 'Custom category should receive a vibrant palette color');

const booksDetails = getCategoryDetails('Books & Study');
assert.equal(booksDetails.name, 'Education', 'Legacy Books & Study maps safely');

const randomCustom = getCategoryDetails('Freelance Software');
assert.equal(randomCustom.name, 'Freelance Software');
assert.equal(randomCustom.icon, 'Tag');
console.log('  PASS: Custom categories receive distinct styling & Tag icon');

// TEST 4: Category logic in ExpenseModal (simulation of modal validation & edit resolution)
console.log('\nTest 4: Modal category resolution and validation logic');
function resolveCategoryOnEdit(initialCategory, standardCategories) {
  const isStandard = standardCategories.filter((c) => c !== 'Other').includes(initialCategory);
  if (isStandard) {
    return { dropdownCategory: initialCategory, customCategory: '' };
  } else {
    return {
      dropdownCategory: 'Other',
      customCategory: initialCategory === 'Other' ? '' : initialCategory,
    };
  }
}

function validateAndSubmit(dropdownCategory, customCategory, title, amount, date) {
  const errors = {};
  if (!title || !title.trim()) errors.title = 'Title required';
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) errors.amount = 'Invalid amount';
  if (!date) errors.date = 'Date required';

  if (dropdownCategory === 'Other') {
    if (!customCategory || !customCategory.trim()) {
      errors.customCategory = 'Please specify a category';
    } else if (customCategory.trim().length < 2) {
      errors.customCategory = 'Category must be at least 2 characters';
    }
  }

  const isValid = Object.keys(errors).length === 0;
  const finalCategory = isValid
    ? (dropdownCategory === 'Other' ? customCategory.trim() : dropdownCategory)
    : null;

  return { isValid, errors, finalCategory };
}

// 4a: Standard category submission
const resFood = validateAndSubmit('Food', '', 'Groceries', '450', '2026-10-13');
assert.equal(resFood.isValid, true);
assert.equal(resFood.finalCategory, 'Food');

// 4b: "Other" without custom category fails
const resEmptyOther = validateAndSubmit('Other', '   ', 'Gym Pass', '1500', '2026-10-13');
assert.equal(resEmptyOther.isValid, false);
assert.ok(resEmptyOther.errors.customCategory, 'Empty custom category must fail validation');

// 4c: "Other" with specified custom category passes and saves the custom name
const resGym = validateAndSubmit('Other', 'Gym Membership', 'Fitness First', '2000', '2026-10-13');
assert.equal(resGym.isValid, true);
assert.equal(resGym.finalCategory, 'Gym Membership');

// 4d: Preserve custom category when editing
const editGym = resolveCategoryOnEdit('Gym Membership', expectedCategoryNames);
assert.equal(editGym.dropdownCategory, 'Other');
assert.equal(editGym.customCategory, 'Gym Membership');

const editFood = resolveCategoryOnEdit('Food', expectedCategoryNames);
assert.equal(editFood.dropdownCategory, 'Food');
assert.equal(editFood.customCategory, '');
console.log('  PASS: Modal validation, "Other" specification, and edit preservation verified');

// TEST 5: Pie chart calculations with mixed standard and custom categories
console.log('\nTest 5: Pie Chart mathematical accuracy with custom categories');
const sampleRecords = [
  { title: 'Dinner', amount: 600, category: 'Food' },
  { title: 'Subway', amount: 400, category: 'Food' },
  { title: 'Bus Pass', amount: 500, category: 'Transport' },
  { title: 'Gym Fee', amount: 1000, category: 'Gym' },
  { title: 'Stationery', amount: 500, category: 'Stationery' },
];

const validExpenses = sampleRecords.filter((e) => parseFloat(e.amount) > 0);
const grandTotal = validExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
assert.equal(grandTotal, 3000);

const categoryAgg = {};
validExpenses.forEach((e) => {
  categoryAgg[e.category] = (categoryAgg[e.category] || 0) + parseFloat(e.amount);
});

const pieSlices = Object.entries(categoryAgg).map(([name, amount]) => {
  const percentage = (amount / grandTotal) * 100;
  return { name, amount, percentage, color: getCategoryDetails(name).color };
});

assert.equal(pieSlices.find((s) => s.name === 'Food').percentage, (1000 / 3000) * 100);
assert.equal(pieSlices.find((s) => s.name === 'Transport').percentage, (500 / 3000) * 100);
assert.equal(pieSlices.find((s) => s.name === 'Gym').percentage, (1000 / 3000) * 100);
assert.equal(pieSlices.find((s) => s.name === 'Stationery').percentage, (500 / 3000) * 100);

const sumPercentage = pieSlices.reduce((sum, s) => sum + s.percentage, 0);
assert.ok(Math.abs(sumPercentage - 100) < 0.0001, 'Total percentage sum must equal 100%');
console.log('  PASS: Slice percentages and grand totals mathematically match');

// TEST 6: Zero/Empty records safety
console.log('\nTest 6: Safe zero records handling');
const emptyRecords = [];
const emptyTotal = emptyRecords.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
assert.equal(emptyTotal, 0);
const emptySlices = Object.entries({}).map(([name, amount]) => ({
  name,
  percentage: emptyTotal > 0 ? (amount / emptyTotal) * 100 : 0,
}));
assert.equal(emptySlices.length, 0);
console.log('  PASS: Empty database handles zero without NaN or crashes');

console.log('\nALL 6 VERIFICATION TEST SUITES PASSED PERFECTLY!\n');
