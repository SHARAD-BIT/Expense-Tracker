import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SummaryCard, TransactionCard } from '../../components/cards';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenWrapper,
  SectionHeader,
} from '../../components/common';
import { mockBudget, mockUser } from '../../data';
import { useAuth, useTransactions } from '../../hooks';
import { theme } from '../../theme';
import type { MainTabScreenProps, RootNavigationProp } from '../../types';
import {
  formatCurrency,
  formatMonthLabel,
  getCurrentMonthTransactions,
  getRecentTransactions,
  getTopExpenseCategories,
  withBalance,
} from '../../utils';

export function DashboardScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const rootNavigation = useNavigation<RootNavigationProp>();
  const { session } = useAuth();
  const { isLoading, loadError, reloadTransactions, transactions } =
    useTransactions();
  const currentUserName = session?.fullName || mockUser.fullName;

  const summary = useMemo(() => withBalance(transactions), [transactions]);
  const currentMonthTransactions = useMemo(
    () => getCurrentMonthTransactions(transactions),
    [transactions]
  );
  const monthlySummary = useMemo(
    () => withBalance(currentMonthTransactions),
    [currentMonthTransactions]
  );
  const recentTransactions = useMemo(
    () => getRecentTransactions(transactions, 4),
    [transactions]
  );
  const topCategories = useMemo(
    () => getTopExpenseCategories(currentMonthTransactions, 3),
    [currentMonthTransactions]
  );
  const isBudgetOnTrack = monthlySummary.expenses <= mockBudget.monthlyBudget;
  const userInitials = currentUserName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (isLoading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.loadingState}>
        <LoadingState label="Loading your dashboard..." />
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
          title="Dashboard data could not load"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>{formatMonthLabel(new Date())}</Text>
          <Text style={styles.title}>Welcome back, {currentUserName.split(' ')[0]}</Text>
          <Text style={styles.subtitle}>
            Here's your current snapshot across balance, cash flow, and recent spending.
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
      </View>

      <SummaryCard
        helperText="Available after tracked income and expenses"
        label="Total balance"
        size="large"
        tone="primary"
        value={formatCurrency(summary.balance)}
      />

      <View style={styles.summaryGrid}>
        <SummaryCard
          helperText="Tracked income"
          label="Total income"
          value={formatCurrency(summary.income)}
        />
        <SummaryCard
          helperText="Tracked expenses"
          label="Total expenses"
          tone="danger"
          value={formatCurrency(summary.expenses)}
        />
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeader
          actionLabel="View budget"
          onActionPress={() => rootNavigation.navigate('Budget')}
          subtitle={formatMonthLabel(new Date())}
          title="Monthly summary"
        />

        <View style={styles.monthCard}>
          <View style={styles.monthMetricRow}>
            <View style={styles.monthMetric}>
              <Text style={styles.monthMetricLabel}>Inflow</Text>
              <Text style={styles.monthMetricValue}>
                {formatCurrency(monthlySummary.income)}
              </Text>
            </View>
            <View style={styles.monthMetric}>
              <Text style={styles.monthMetricLabel}>Outflow</Text>
              <Text style={[styles.monthMetricValue, styles.expenseText]}>
                {formatCurrency(monthlySummary.expenses)}
              </Text>
            </View>
            <View style={styles.monthMetric}>
              <Text style={styles.monthMetricLabel}>Transactions</Text>
              <Text style={styles.monthMetricValue}>
                {currentMonthTransactions.length}
              </Text>
            </View>
          </View>

          <View style={styles.monthDivider} />

          <View style={styles.netRow}>
            <View>
              <Text style={styles.netLabel}>Monthly net</Text>
              <Text style={styles.netValue}>
                {formatCurrency(monthlySummary.balance)}
              </Text>
            </View>
            <View
              style={[
                styles.netPill,
                !isBudgetOnTrack ? styles.netPillDanger : null,
              ]}
            >
              <Text
                style={[
                  styles.netPillText,
                  !isBudgetOnTrack ? styles.netPillTextDanger : null,
                ]}
              >
                {isBudgetOnTrack ? 'Within budget' : 'Over budget'}
              </Text>
            </View>
          </View>

          <View style={styles.categoryWrap}>
            {topCategories.length === 0 ? (
              <View style={styles.categoryEmptyCard}>
                <Text style={styles.categoryName}>No expense categories yet</Text>
                <Text style={styles.categoryEmptyText}>
                  Add a transaction to start seeing category totals here.
                </Text>
              </View>
            ) : (
              topCategories.map((item) => (
                <View key={item.category} style={styles.categoryCard}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryTotal}>{formatCurrency(item.total)}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeader
          actionLabel="View all"
          onActionPress={() => navigation.navigate('Transactions')}
          subtitle="Latest activity"
          title="Recent transactions"
        />

        {recentTransactions.length === 0 ? (
          <EmptyState
            actionLabel="Add transaction"
            description="Create your first local transaction to populate the dashboard."
            iconName="wallet-outline"
            onActionPress={() => navigation.navigate('Add')}
            title="No recent transactions yet"
          />
        ) : (
          <View style={styles.listBlock}>
            {recentTransactions.map((transaction) => (
              <TransactionCard
                compact
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

      <Pressable
        onPress={() => navigation.navigate('Transactions')}
        style={({ pressed }) => [
          styles.linkCard,
          pressed ? styles.linkCardPressed : null,
        ]}
      >
        <View>
          <Text style={styles.linkTitle}>Review all transactions</Text>
          <Text style={styles.linkSubtitle}>
            Search, filter, and inspect each transaction in more detail.
          </Text>
        </View>
        <Ionicons
          color={theme.colors.primaryDark}
          name="arrow-forward-outline"
          size={20}
        />
      </Pressable>
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  eyebrow: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    maxWidth: 280,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    ...theme.typography.label,
    color: theme.colors.primaryDark,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  sectionBlock: {
    gap: theme.spacing.lg,
  },
  monthCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  monthMetricRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  monthMetric: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  monthMetricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  monthMetricValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  expenseText: {
    color: theme.colors.danger,
  },
  monthDivider: {
    backgroundColor: theme.colors.border,
    height: 1,
  },
  netRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  netLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  netValue: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  netPill: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  netPillDanger: {
    backgroundColor: '#FFF0F0',
  },
  netPillText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  netPillTextDanger: {
    color: theme.colors.danger,
  },
  categoryWrap: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  categoryCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.md,
    flex: 1,
    padding: theme.spacing.md,
  },
  categoryEmptyCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    width: '100%',
  },
  categoryName: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  categoryTotal: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  categoryEmptyText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  listBlock: {
    gap: theme.spacing.md,
  },
  linkCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  linkCardPressed: {
    opacity: 0.92,
  },
  linkTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  linkSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    maxWidth: 260,
  },
});
