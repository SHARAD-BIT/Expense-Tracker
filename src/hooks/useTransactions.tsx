import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { PropsWithChildren } from 'react';

import type { Transaction, TransactionDraft } from '../types';
import * as transactionService from '../services';

type TransactionsContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  loadError: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  deletingTransactionId: string | null;
  reloadTransactions: () => Promise<void>;
  createTransaction: (transactionDraft: TransactionDraft) => Promise<Transaction>;
  updateTransaction: (
    transactionId: string,
    transactionDraft: TransactionDraft
  ) => Promise<Transaction | undefined>;
  deleteTransaction: (transactionId: string) => Promise<void>;
};

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined
);

export function TransactionsProvider({ children }: PropsWithChildren) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(
    null
  );

  const reloadTransactions = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const loadedTransactions = await transactionService.getTransactions();
      setTransactions(loadedTransactions);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadTransactions();
  }, [reloadTransactions]);

  const createTransaction = useCallback(
    async (transactionDraft: TransactionDraft) => {
      setIsCreating(true);

      try {
        const { createdTransaction, transactions: updatedTransactions } =
          await transactionService.addTransaction(transactionDraft);

        setTransactions(updatedTransactions);

        return createdTransaction;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const updateTransaction = useCallback(
    async (transactionId: string, transactionDraft: TransactionDraft) => {
      setIsUpdating(true);

      try {
        const { updatedTransaction, transactions: updatedTransactions } =
          await transactionService.updateTransaction(transactionId, transactionDraft);

        setTransactions(updatedTransactions);

        return updatedTransaction;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const deleteTransaction = useCallback(async (transactionId: string) => {
    setDeletingTransactionId(transactionId);

    try {
      const updatedTransactions = await transactionService.deleteTransaction(
        transactionId
      );

      setTransactions(updatedTransactions);
    } finally {
      setDeletingTransactionId(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      isLoading,
      loadError,
      isCreating,
      isUpdating,
      deletingTransactionId,
      reloadTransactions,
      createTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [
      transactions,
      isLoading,
      loadError,
      isCreating,
      isUpdating,
      deletingTransactionId,
      reloadTransactions,
      createTransaction,
      updateTransaction,
      deleteTransaction,
    ]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'We could not load your transactions right now. Please try again.';
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error('useTransactions must be used within TransactionsProvider.');
  }

  return context;
}
