import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  AppButton,
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenWrapper,
} from '../../../components/common';
import { ConfirmationModal } from '../../../components/modals';
import { useTransactions } from '../../../hooks';
import { theme } from '../../../theme';
import type { RootStackScreenProps } from '../../../types';
import {
  findTransactionById,
  formatCurrency,
  formatDate,
  formatSignedCurrency,
} from '../../../utils';

export function TransactionDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<'TransactionDetail'>) {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const {
    deleteTransaction,
    deletingTransactionId,
    isLoading,
    loadError,
    reloadTransactions,
    transactions,
  } = useTransactions();

  const transaction = findTransactionById(transactions, route.params.transactionId);
  const isDeletingCurrentTransaction =
    deletingTransactionId === route.params.transactionId;

  const handleDelete = async () => {
    try {
      await deleteTransaction(route.params.transactionId);
      setIsDeleteModalVisible(false);
      navigation.goBack();
    } catch {
      setIsDeleteModalVisible(false);
      Alert.alert(
        'Delete failed',
        'The transaction could not be removed locally. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.missingState}>
        <LoadingState label="Loading transaction..." />
      </ScreenWrapper>
    );
  }

  if (loadError && transactions.length === 0) {
    return (
      <ScreenWrapper contentContainerStyle={styles.missingState}>
        <ErrorState
          actionLabel="Try again"
          description={loadError}
          onActionPress={() => void reloadTransactions()}
          title="Transaction data is unavailable"
        />
      </ScreenWrapper>
    );
  }

  if (!transaction) {
    return (
      <ScreenWrapper contentContainerStyle={styles.missingState}>
        <EmptyState
          description="The selected transaction could not be found in local storage."
          iconName="alert-circle-outline"
          title="Transaction unavailable"
        />
      </ScreenWrapper>
    );
  }

  return (
    <>
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
          <Text style={styles.headerTitle}>Transaction detail</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroCategory}>{transaction.category}</Text>
          <Text
            style={[
              styles.heroAmount,
              transaction.type === 'income' ? styles.incomeText : styles.expenseText,
            ]}
          >
            {formatSignedCurrency(transaction.amount, transaction.type)}
          </Text>
          <Text style={styles.heroTitle}>{transaction.title}</Text>
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

        <View style={styles.actionsRow}>
          <AppButton
            onPress={() =>
              navigation.navigate('EditTransaction', {
                transactionId: transaction.id,
              })
            }
            title="Edit"
          />
          <AppButton
            loading={isDeletingCurrentTransaction}
            onPress={() => setIsDeleteModalVisible(true)}
            title="Delete"
            variant="danger"
          />
        </View>

        <View style={styles.infoCard}>
          <DetailRow label="Amount" value={formatCurrency(transaction.amount)} />
          <DetailRow label="Category" value={transaction.category} />
          <DetailRow label="Date" value={formatDate(transaction.date)} />
          <DetailRow
            label="Type"
            value={transaction.type === 'income' ? 'Income' : 'Expense'}
          />
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>Notes</Text>
          <Text style={styles.noteText}>
            {transaction.notes ?? 'No notes were added for this transaction.'}
          </Text>
        </View>
      </ScreenWrapper>

      <ConfirmationModal
        confirmLabel="Delete transaction"
        description="This removes the transaction from local storage and updates the dashboard and list immediately."
        isConfirming={isDeletingCurrentTransaction}
        onCancel={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDelete}
        title="Delete this transaction?"
        visible={isDeleteModalVisible}
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['4xl'],
    gap: theme.spacing.xl,
  },
  missingState: {
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
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  heroCategory: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  heroAmount: {
    ...theme.typography.display,
  },
  incomeText: {
    color: theme.colors.primaryDark,
  },
  expenseText: {
    color: theme.colors.danger,
  },
  heroTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  typeBadge: {
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  typeBadgeIncome: {
    backgroundColor: theme.colors.primarySoft,
  },
  typeBadgeExpense: {
    backgroundColor: '#FFF1F1',
  },
  typeBadgeText: {
    ...theme.typography.caption,
  },
  typeBadgeTextIncome: {
    color: theme.colors.primaryDark,
  },
  typeBadgeTextExpense: {
    color: theme.colors.danger,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  detailRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  detailLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  detailValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  noteCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  noteLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  noteText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
