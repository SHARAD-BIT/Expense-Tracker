import type { Budget, Transaction, UserProfile } from '../types';

const currentMonth = new Date().toISOString().slice(0, 7);

export const mockUser: UserProfile = {
  id: 'user-1',
  fullName: 'Sharad Gupta',
  email: 'sharad@example.com',
};

export const mockBudget: Budget = {
  monthlyBudget: 2400,
  month: currentMonth,
};

export const expenseCategories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Travel',
  'Rent',
  'Other',
] as const;

export const incomeCategories = [
  'Salary',
  'Freelance',
  'Bonus',
  'Refund',
  'Other',
] as const;

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    title: 'Monthly Salary',
    amount: 4200,
    type: 'income',
    category: 'Salary',
    date: '2026-04-01',
    notes: 'Primary income for April',
  },
  {
    id: 'txn-002',
    title: 'Apartment Rent',
    amount: 1300,
    type: 'expense',
    category: 'Rent',
    date: '2026-04-02',
    notes: 'Paid for city apartment lease',
  },
  {
    id: 'txn-003',
    title: 'Freelance Design',
    amount: 850,
    type: 'income',
    category: 'Freelance',
    date: '2026-04-09',
    notes: 'Landing page polish work',
  },
  {
    id: 'txn-004',
    title: 'Metro Card Top-up',
    amount: 34,
    type: 'expense',
    category: 'Transport',
    date: '2026-04-10',
    notes: 'Weekly commute recharge',
  },
  {
    id: 'txn-005',
    title: 'Groceries',
    amount: 92,
    type: 'expense',
    category: 'Food',
    date: '2026-04-11',
    notes: 'Fresh produce and pantry restock',
  },
  {
    id: 'txn-006',
    title: 'Dinner with Friends',
    amount: 48,
    type: 'expense',
    category: 'Food',
    date: '2026-04-12',
    notes: 'Weekend dinner outing',
  },
  {
    id: 'txn-007',
    title: 'Electricity Bill',
    amount: 74,
    type: 'expense',
    category: 'Bills',
    date: '2026-04-05',
    notes: 'Utility bill for April',
  },
  {
    id: 'txn-008',
    title: 'Streaming Subscription',
    amount: 16,
    type: 'expense',
    category: 'Entertainment',
    date: '2026-04-06',
  },
  {
    id: 'txn-009',
    title: 'Pharmacy',
    amount: 22,
    type: 'expense',
    category: 'Health',
    date: '2026-04-08',
    notes: 'Prescription refill',
  },
  {
    id: 'txn-010',
    title: 'Online Shopping',
    amount: 110,
    type: 'expense',
    category: 'Shopping',
    date: '2026-04-07',
    notes: 'Desk accessories',
  },
  {
    id: 'txn-011',
    title: 'Tax Refund',
    amount: 120,
    type: 'income',
    category: 'Refund',
    date: '2026-04-03',
  },
  {
    id: 'txn-012',
    title: 'Weekend Train Trip',
    amount: 180,
    type: 'expense',
    category: 'Travel',
    date: '2026-03-24',
    notes: 'Short out-of-town trip',
  },
];
