import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
import type { RootStackScreenProps } from '../../types';
import {
  formatCurrency,
  formatMonthLabel,
  getCurrentMonthTransactions,
  getTopExpenseCategories,
  withBalance,
} from '../../utils';

export function BudgetScreen({ navigation }: RootStackScreenProps<'Budget'>) {
  const { isLoading, loadError, reloadTransactions, transactions } =
    useTransactions();

  const currentMonthTransactions = useMemo(
    () => getCurrentMonthTransactions(transactions),
    [transactions]
  );
  const monthlySummary = useMemo(
    () => withBalance(currentMonthTransactions),
    [currentMonthTransactions]
  );
  const topExpenseCategories = useMemo(
    () => getTopExpenseCategories(currentMonthTransactions, 4),
    [currentMonthTransactions]
  );

  const spentAmount = monthlySummary.expenses;
  const remainingAmount = mockBudget.monthlyBudget - spentAmount;
  const progress = mockBudget.monthlyBudget
    ? Math.min(spentAmount / mockBudget.monthlyBudget, 1)
    : 0;
  const expenseEntries = currentMonthTransactions.filter(
    (transaction) => transaction.type === 'expense'
  );
  const budgetStatus =
    spentAmount === 0
      ? {
          title: 'Ready to track',
          description:
            'Your budget is set and waiting for the first expense of the month.',
        }
      : remainingAmount >= 0
        ? {
            title: 'Within budget',
            description: `${formatCurrency(
              remainingAmount
            )} remains before you hit your monthly target.`,
          }
        : {
            title: 'Budget exceeded',
            description: `${formatCurrency(
              Math.abs(remainingAmount)
            )} over the target, so the next expenses need extra attention.`,
          };

  if (isLoading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.centeredState}>
        <LoadingState label="Loading your budget..." />
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
          title="Budget data is unavailable"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Pressable
          hitSlop={8}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed ? styles.backButtonPressed : null,
          ]}
        >
          <Ionicons color={theme.colors.text} name="arrow-back-outline" size={20} />
        </Pressable>
        <Text style={styles.headerTitle}>Budget</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Monthly budget</Text>
        <Text style={styles.title}>Keep the month in control</Text>
        <Text style={styles.subtitle}>
          Spend against a single target with a clear progress view and category
          context.
        </Text>

        <View style={styles.heroMetricRow}>
          <View>
            <Text style={styles.heroMetricLabel}>Target</Text>
            <Text style={styles.heroMetricValue}>
              {formatCurrency(mockBudget.monthlyBudget)}
            </Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{formatMonthLabel(new Date())}</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryCard
          helperText="This month"
          label="Spent"
          tone="danger"
          value={formatCurrency(spentAmount)}
        />
        <SummaryCard
          helperText={remainingAmount >= 0 ? 'Still available' : 'Over target'}
          label="Remaining"
          value={formatCurrency(remainingAmount)}
        />
      </View>

      <View style={styles.progressCard}>
        <SectionHeader
          subtitle={`${expenseEntries.length} expense entries this month`}
          title="Budget progress"
        />

        <View style={styles.progressCopyRow}>
          <Text style={styles.progressLabel}>
            {formatCurrency(spentAmount)} of {formatCurrency(mockBudget.monthlyBudget)}
          </Text>
          <Text style={styles.progressValue}>{Math.round(progress * 100)}%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(progress * 100, progress > 0 ? 8 : 0)}%` },
              remainingAmount < 0 ? styles.progressFillDanger : null,
            ]}
          />
        </View>

        <View
          style={[
            styles.statusCard,
            remainingAmount < 0 ? styles.statusCardDanger : null,
          ]}
        >
          <Text
            style={[
              styles.statusTitle,
              remainingAmount < 0 ? styles.statusTitleDanger : null,
            ]}
          >
            {budgetStatus.title}
          </Text>
          <Text style={styles.statusDescription}>{budgetStatus.description}</Text>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeader
          subtitle="Where the spending is concentrated"
          title="Top categories"
        />

        {expenseEntries.length === 0 ? (
          <EmptyState
            actionLabel="Add transaction"
            description="Add an expense to start seeing your monthly budget distribution."
            iconName="wallet-outline"
            onActionPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Add',
              })
            }
            title="No expense activity this month"
          />
        ) : (
          <View style={styles.categoriesCard}>
            {topExpenseCategories.map((item) => {
              const width = spentAmount === 0 ? 0 : item.total / spentAmount;

              return (
                <View key={item.category} style={styles.categoryRow}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{item.category}</Text>
                    <Text style={styles.categoryValue}>
                      {formatCurrency(item.total)}
                    </Text>
                  </View>
                  <View style={styles.categoryTrack}>
                    <View
                      style={[
                        styles.categoryFill,
                        { width: `${Math.max(width * 100, 10)}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
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
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  backButtonPressed: {
    opacity: 0.92,
  },
  headerTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
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
  heroMetricRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  heroMetricLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  heroMetricValue: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  heroPill: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  heroPillText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  progressCopyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  progressValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primaryDark,
  },
  progressTrack: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.pill,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    height: '100%',
  },
  progressFillDanger: {
    backgroundColor: theme.colors.danger,
  },
  statusCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
  },
  statusCardDanger: {
    backgroundColor: '#FFF0F0',
  },
  statusTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primaryDark,
  },
  statusTitleDanger: {
    color: theme.colors.danger,
  },
  statusDescription: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  sectionBlock: {
    gap: theme.spacing.lg,
  },
  categoriesCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  categoryRow: {
    gap: theme.spacing.sm,
  },
  categoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  categoryValue: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  categoryTrack: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.pill,
    height: 10,
    overflow: 'hidden',
  },
  categoryFill: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radii.pill,
    height: '100%',
  },
});
