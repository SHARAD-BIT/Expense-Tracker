import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Transaction } from '../../types';
import { theme } from '../../theme';
import { formatShortDate, formatSignedCurrency } from '../../utils';

type TransactionCardProps = {
  transaction: Transaction;
  onPress?: () => void;
  compact?: boolean;
};

export function TransactionCard({
  transaction,
  onPress,
  compact = false,
}: TransactionCardProps) {
  const content = (
    <View style={[styles.card, compact ? styles.cardCompact : null]}>
      <View style={styles.row}>
        <View style={styles.copyBlock}>
          <Text style={styles.title}>{transaction.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{transaction.category}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{formatShortDate(transaction.date)}</Text>
          </View>
          {!compact && transaction.notes ? (
            <Text numberOfLines={1} style={styles.note}>
              {transaction.notes}
            </Text>
          ) : null}
        </View>

        <View style={styles.amountBlock}>
          <Text
            style={[
              styles.amount,
              transaction.type === 'income' ? styles.income : styles.expense,
            ]}
          >
            {formatSignedCurrency(transaction.amount, transaction.type)}
          </Text>
          <View
            style={[
              styles.typeBadge,
              transaction.type === 'income'
                ? styles.typeBadgeIncome
                : styles.typeBadgeExpense,
            ]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                transaction.type === 'income'
                  ? styles.typeBadgeTextIncome
                  : styles.typeBadgeTextExpense,
              ]}
            >
              {transaction.type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : null)}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.94,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...theme.shadows.subtle,
  },
  cardCompact: {
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  copyBlock: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  metaDot: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginHorizontal: theme.spacing.xs,
  },
  note: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  amountBlock: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  amount: {
    ...theme.typography.bodyMedium,
  },
  income: {
    color: theme.colors.primaryDark,
  },
  expense: {
    color: theme.colors.danger,
  },
  typeBadge: {
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  typeBadgeIncome: {
    backgroundColor: theme.colors.primarySoft,
  },
  typeBadgeExpense: {
    backgroundColor: '#FFF1F1',
  },
  typeBadgeText: {
    ...theme.typography.tiny,
  },
  typeBadgeTextIncome: {
    color: theme.colors.primaryDark,
  },
  typeBadgeTextExpense: {
    color: theme.colors.danger,
  },
});
