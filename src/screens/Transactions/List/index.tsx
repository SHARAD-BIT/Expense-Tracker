import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { TransactionCard } from '../../../components/cards';
import {
  CategoryChip,
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenWrapper,
  SearchBar,
  SectionHeader,
} from '../../../components/common';
import { expenseCategories, incomeCategories } from '../../../data';
import { useTransactions } from '../../../hooks';
import { theme } from '../../../theme';
import type { MainTabScreenProps, RootNavigationProp } from '../../../types';
import { sortTransactionsByDate } from '../../../utils';

const categories = Array.from(
  new Set(['All', ...expenseCategories, ...incomeCategories])
);

export function TransactionsScreen({
  navigation,
}: MainTabScreenProps<'Transactions'>) {
  const rootNavigation = useNavigation<RootNavigationProp>();
  const { isLoading, loadError, reloadTransactions, transactions } =
    useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return sortTransactionsByDate(transactions).filter((transaction) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        transaction.title.toLowerCase().includes(normalizedQuery) ||
        transaction.category.toLowerCase().includes(normalizedQuery) ||
        transaction.notes?.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === 'All' || transaction.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategory, transactions]);

  if (isLoading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.loadingState}>
        <LoadingState label="Loading transactions..." />
      </ScreenWrapper>
    );
  }

  if (loadError && transactions.length === 0) {
    return (
      <ScreenWrapper contentContainerStyle={styles.loadingState}>
        <ErrorState
          actionLabel="Try again"
          description={loadError}
          onActionPress={() => void reloadTransactions()}
          title="Transactions are unavailable"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Transactions</Text>
        <Text style={styles.title}>Track every movement</Text>
        <Text style={styles.subtitle}>
          Search by keyword, narrow by category, and review each entry with a clean
          detail view.
        </Text>
      </View>

      <SearchBar
        onChangeText={setSearchQuery}
        placeholder="Search by title, category, or notes"
        value={searchQuery}
      />

      <View style={styles.filterBlock}>
        <SectionHeader
          subtitle={`${filteredTransactions.length} matching transactions`}
          title="Category filter"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {categories.map((category) => (
              <CategoryChip
                active={selectedCategory === category}
                key={category}
                label={category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.resultsBlock}>
        <SectionHeader
          subtitle={`${transactions.length} total records`}
          title="All transactions"
        />

        {transactions.length === 0 ? (
          <EmptyState
            actionLabel="Add transaction"
            description="Use the Add tab to create your first transaction."
            iconName="receipt-outline"
            onActionPress={() => navigation.navigate('Add')}
            title="No transactions saved yet"
          />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            actionLabel="Clear filters"
            description="Try a different keyword or remove the category filter."
            iconName="search-outline"
            onActionPress={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            title="No transactions match your search"
          />
        ) : (
          <View style={styles.listBlock}>
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                onPress={() =>
                  rootNavigation.navigate('TransactionDetail', {
                    transactionId: transaction.id,
                  })
                }
                transaction={transaction}
              />
            ))}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['4xl'],
    gap: theme.spacing.xl,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    gap: theme.spacing.sm,
  },
  eyebrow: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  filterBlock: {
    gap: theme.spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  resultsBlock: {
    gap: theme.spacing.lg,
  },
  listBlock: {
    gap: theme.spacing.md,
  },
});
