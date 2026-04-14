export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
};

export type TransactionDraft = Omit<Transaction, 'id'>;

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
};

export type Budget = {
  monthlyBudget: number;
  month: string;
};

export type AuthProvider = 'local' | 'google';

export type AuthSession = {
  id: string;
  provider: AuthProvider;
  fullName: string;
  email: string;
  photoUrl?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  authenticatedAt: string;
};
