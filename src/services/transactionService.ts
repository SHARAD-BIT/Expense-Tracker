import AsyncStorage from '@react-native-async-storage/async-storage';

import { mockTransactions, mockUser } from '../data';
import type { Transaction, TransactionDraft } from '../types';
import { sortTransactionsByDate } from '../utils';
import { getStoredSession } from './authService';

const TRANSACTIONS_STORAGE_KEY_PREFIX = '@spendwise/transactions-';
const SERVICE_DELAY_MS = 450;

async function wait() {
  await new Promise((resolve) => setTimeout(resolve, SERVICE_DELAY_MS));
}

async function getStorageKey() {
  const session = await getStoredSession();
  const userId = session?.id || 'guest';
  return `${TRANSACTIONS_STORAGE_KEY_PREFIX}${userId}`;
}

async function readTransactionsFromStorage() {
  const key = await getStorageKey();
  const storedValue = await AsyncStorage.getItem(key);

  if (!storedValue) {
    return null;
  }

  return JSON.parse(storedValue) as Transaction[];
}

async function writeTransactionsToStorage(transactions: Transaction[]) {
  const key = await getStorageKey();
  await AsyncStorage.setItem(
    key,
    JSON.stringify(sortTransactionsByDate(transactions))
  );
}

async function ensureSeededTransactions() {
  const storedTransactions = await readTransactionsFromStorage();

  if (storedTransactions) {
    return sortTransactionsByDate(storedTransactions);
  }

  const session = await getStoredSession();
  if (session?.id === mockUser.id) {
    await writeTransactionsToStorage(mockTransactions);
    return sortTransactionsByDate(mockTransactions);
  }

  await writeTransactionsToStorage([]);
  return [];
}

function createTransactionId() {
  return `txn-${Date.now()}`;
}

export async function getTransactions() {
  await wait();

  return ensureSeededTransactions();
}

export async function addTransaction(transactionDraft: TransactionDraft) {
  await wait();

  const transactions = await ensureSeededTransactions();
  const createdTransaction: Transaction = {
    ...transactionDraft,
    id: createTransactionId(),
  };
  const updatedTransactions = sortTransactionsByDate([
    createdTransaction,
    ...transactions,
  ]);

  await writeTransactionsToStorage(updatedTransactions);

  return {
    createdTransaction,
    transactions: updatedTransactions,
  };
}

export async function updateTransaction(
  transactionId: string,
  transactionDraft: TransactionDraft
) {
  await wait();

  const transactions = await ensureSeededTransactions();
  const updatedTransactions = transactions.map((transaction) =>
    transaction.id === transactionId
      ? {
          ...transactionDraft,
          id: transaction.id,
        }
      : transaction
  );

  await writeTransactionsToStorage(updatedTransactions);

  return {
    updatedTransaction: updatedTransactions.find(
      (transaction) => transaction.id === transactionId
    ),
    transactions: sortTransactionsByDate(updatedTransactions),
  };
}

export async function deleteTransaction(transactionId: string) {
  await wait();

  const transactions = await ensureSeededTransactions();
  const updatedTransactions = transactions.filter(
    (transaction) => transaction.id !== transactionId
  );

  await writeTransactionsToStorage(updatedTransactions);

  return updatedTransactions;
}
