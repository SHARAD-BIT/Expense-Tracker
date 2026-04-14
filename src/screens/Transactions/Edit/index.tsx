import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenWrapper,
} from '../../../components/common';
import {
  TransactionForm,
  getTransactionFormDefaults,
  mapTransactionFormValuesToDraft,
} from '../../../components/forms';
import { useTransactions } from '../../../hooks';
import { theme } from '../../../theme';
import type { RootStackScreenProps } from '../../../types';
import type { TransactionFormValues } from '../../../utils';
import { findTransactionById } from '../../../utils';

export function EditTransactionScreen({
  navigation,
  route,
}: RootStackScreenProps<'EditTransaction'>) {
  const {
    transactions,
    isLoading,
    isUpdating,
    loadError,
    reloadTransactions,
    updateTransaction,
  } = useTransactions();

  const transaction = findTransactionById(transactions, route.params.transactionId);

  const handleUpdate = async (values: TransactionFormValues) => {
    try {
      await updateTransaction(
        route.params.transactionId,
        mapTransactionFormValuesToDraft(values)
      );
      navigation.goBack();
    } catch {
      Alert.alert(
        'Update failed',
        'The transaction could not be updated locally. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.loadingState}>
        <LoadingState label="Loading transaction..." />
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
          title="Transaction data is unavailable"
        />
      </ScreenWrapper>
    );
  }

  if (!transaction) {
    return (
      <ScreenWrapper contentContainerStyle={styles.loadingState}>
        <EmptyState
          description="The transaction you tried to edit is no longer available."
          iconName="create-outline"
          title="Transaction unavailable"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      keyboardAware
      scrollable
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Edit transaction</Text>
        <Text style={styles.title}>Update the saved details</Text>
        <Text style={styles.subtitle}>
          Changes are saved locally and reflected immediately in your dashboard and
          transaction views.
        </Text>
      </View>

      <View style={styles.formCard}>
        <TransactionForm
          defaultValues={getTransactionFormDefaults(transaction)}
          isSubmitting={isUpdating}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
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
  formCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
});
