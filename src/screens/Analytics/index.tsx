import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SummaryCard } from '../../components/cards';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenWrapper,
  SectionHeader,
} from '../../components/common';
import { mockBudget } from '../../data';
import { useTransactions } from '../../hooks';
import { theme } from '../../theme';
import type { MainTabScreenProps } from '../../types';
import {
  formatCurrency,
  formatMonthLabel,
  getCurrentMonthTransactions,
  getRecentDaysTransactions,
  getTopExpenseCategories,
  getTopExpenseCategory,
  withBalance,
} from '../../utils';

export function AnalyticsScreen({
  navigation,
}: MainTabScreenProps<'Analytics'>) {
  const { isLoading, loadError, reloadTransactions, transactions } =
    useTransactions();

  const currentMonthTransactions = useMemo(
    () => getCurrentMonthTransactions(transactions),
    [transactions]
  );
  const weeklyTransactions = useMemo(
    () => getRecentDaysTransactions(transactions, 7),
    [transactions]
  );
  const monthlySummary = useMemo(
    () => withBalance(currentMonthTransactions),
    [currentMonthTransactions]
  );
  const weeklySummary = useMemo(
    () => withBalance(weeklyTransactions),
    [weeklyTransactions]
  );
  const categoryBreakdown = useMemo(
    () => getTopExpenseCategories(currentMonthTransactions, 5),
    [currentMonthTransactions]
  );
  const topExpenseCategory = useMemo(
    () => getTopExpenseCategory(currentMonthTransactions),
    [currentMonthTransactions]
  );
  const monthlyBudgetUsage = mockBudget.monthlyBudget
    ? Math.round((monthlySummary.expenses / mockBudget.monthlyBudget) * 100)
    : 0;

  if (isLoading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.centeredState}>
        <LoadingState label="Loading analytics..." />
      </ScreenWrapper>
    );
  }

  if (loadError && transactions.length === 0) {
    return (
      <ScreenWrapper contentContainerStyle={styles.centeredState}>
        <ErrorState
          actionLabel="Try again"
          description={loadError}
          onActionPress={() => void reloadTransactions()}
          title="Analytics are unavailable"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Analytics</Text>
        <Text style={styles.title}>See where the month is moving</Text>
        <Text style={styles.subtitle}>
          Review category concentration, weekly pace, and a few practical insights
          from your locally saved transactions.
        </Text>
      </View>

      {transactions.length === 0 ? (
        <EmptyState
          actionLabel="Add transaction"
          description="Create a few transactions to unlock spending breakdowns and insight cards."
          iconName="stats-chart-outline"
          onActionPress={() => navigation.navigate('Add')}
          title="No analytics data yet"
        />
      ) : (
        <>
          <View style={styles.summaryGrid}>
            <SummaryCard
              helperText="Expense total"
              label="This month"
              value={formatCurrency(monthlySummary.expenses)}
            />
            <SummaryCard
              helperText="Last 7 days"
              label="This week"
              value={formatCurrency(weeklySummary.expenses)}
            />
          </View>

          <View style={styles.summaryGrid}>
            <SummaryCard
              helperText={topExpenseCategory ? 'Highest category' : 'No expense data'}
              label="Top spend"
              value={topExpenseCategory?.category ?? 'No data'}
            />
            <SummaryCard
              helperText="Budget usage"
              label="Used"
              value={`${Math.max(monthlyBudgetUsage, 0)}%`}
            />
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader
              subtitle={formatMonthLabel(new Date())}
              title="Category breakdown"
            />

            {categoryBreakdown.length === 0 ? (
              <EmptyState
                description="Add expense entries to see which categories take the biggest share."
                iconName="pie-chart-outline"
                title="No category breakdown yet"
              />
            ) : (
              <View style={styles.breakdownCard}>
                {categoryBreakdown.map((item) => {
                  const share =
                    monthlySummary.expenses === 0
                      ? 0
                      : item.total / monthlySummary.expenses;

                  return (
                    <View key={item.category} style={styles.breakdownRow}>
                      <View style={styles.breakdownHeader}>
                        <Text style={styles.breakdownTitle}>{item.category}</Text>
                        <Text style={styles.breakdownValue}>
                          {formatCurrency(item.total)}
                        </Text>
                      </View>
                      <View style={styles.breakdownTrack}>
                        <View
                          style={[
                            styles.breakdownFill,
                            { width: `${Math.max(share * 100, 10)}%` },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader
              subtitle="Monthly and weekly behavior"
              title="Insights"
            />

            <View style={styles.insightCard}>
              <Text style={styles.insightLabel}>Spending pace</Text>
              <Text style={styles.insightTitle}>
                {monthlyBudgetUsage <= 100 ? 'Budget usage is steady' : 'Budget usage is elevated'}
              </Text>
              <Text style={styles.insightDescription}>
                {monthlySummary.expenses === 0
                  ? 'No spending has been logged for this month yet.'
                  : `${formatCurrency(
                      monthlySummary.expenses
                    )} has been spent so far, which is ${Math.max(
                      monthlyBudgetUsage,
                      0
                    )}% of the current budget target.`}
              </Text>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightLabel}>Weekly pattern</Text>
              <Text style={styles.insightTitle}>
                {weeklySummary.expenses > 0
                  ? 'Recent activity is visible'
                  : 'No expenses in the last seven days'}
              </Text>
              <Text style={styles.insightDescription}>
                {weeklySummary.expenses > 0
                  ? `${formatCurrency(
                      weeklySummary.expenses
                    )} was spent over the last 7 days across ${
                      weeklyTransactions.length
                    } entries.`
                  : 'Add a new expense to start spotting short-term spending trends.'}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['4xl'],
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
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
  summaryGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  sectionBlock: {
    gap: theme.spacing.lg,
  },
  breakdownCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  breakdownRow: {
    gap: theme.spacing.sm,
  },
  breakdownHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  breakdownValue: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  breakdownTrack: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.pill,
    height: 10,
    overflow: 'hidden',
  },
  breakdownFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    height: '100%',
  },
  insightCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  insightLabel: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  insightTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  insightDescription: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
