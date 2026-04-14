import type { Transaction } from '../types';
import { parseDateValue } from './dates';

function getMonthKey(value: string | Date) {
  const date = parseDateValue(value);

  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function sortTransactionsByDate(transactions: Transaction[]) {
  return [...transactions].sort(
    (left, right) =>
      new Date(right.date).getTime() - new Date(left.date).getTime()
  );
}

export function getTransactionsSummary(transactions: Transaction[]) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount;
      } else {
        summary.expenses += transaction.amount;
      }

      return summary;
    },
    {
      income: 0,
      expenses: 0,
      balance: 0,
    }
  );
}

export function withBalance(transactions: Transaction[]) {
  const summary = getTransactionsSummary(transactions);

  return {
    ...summary,
    balance: summary.income - summary.expenses,
  };
}

export function getCurrentMonthTransactions(
  transactions: Transaction[],
  referenceDate = new Date()
) {
  const monthKey = getMonthKey(referenceDate);

  return transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey);
}

export function getRecentDaysTransactions(
  transactions: Transaction[],
  days = 7,
  referenceDate = new Date()
) {
  const startDate = parseDateValue(referenceDate);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (days - 1));

  const endDate = parseDateValue(referenceDate);
  endDate.setHours(23, 59, 59, 999);

  return transactions.filter((transaction) => {
    const transactionDate = parseDateValue(transaction.date);

    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

export function getRecentTransactions(transactions: Transaction[], limit = 4) {
  return sortTransactionsByDate(transactions).slice(0, limit);
}

export function getTopExpenseCategories(transactions: Transaction[], limit = 3) {
  const categoryTotals = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      categoryTotals.set(
        transaction.category,
        (categoryTotals.get(transaction.category) ?? 0) + transaction.amount
      );
    });

  return [...categoryTotals.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([category, total]) => ({
      category,
      total,
    }));
}

export function getTopExpenseCategory(transactions: Transaction[]) {
  return getTopExpenseCategories(transactions, 1)[0];
}

export function findTransactionById(
  transactions: Transaction[],
  transactionId: string
) {
  return transactions.find((transaction) => transaction.id === transactionId);
}
