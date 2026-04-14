import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { TransactionForm, mapTransactionFormValuesToDraft } from '../../components/forms';
import { ScreenWrapper } from '../../components/common';
import { useTransactions } from '../../hooks';
import { theme } from '../../theme';
import type { MainTabScreenProps } from '../../types';
import type { TransactionFormValues } from '../../utils';

export function AddScreen({ navigation }: MainTabScreenProps<'Add'>) {
  const [formVersion, setFormVersion] = useState(0);
  const { createTransaction, isCreating } = useTransactions();

  const handleCreate = async (values: TransactionFormValues) => {
    try {
      await createTransaction(mapTransactionFormValuesToDraft(values));
      setFormVersion((current) => current + 1);
      navigation.navigate('Transactions');
    } catch {
      Alert.alert(
        'Save failed',
        'The transaction could not be saved locally. Please try again.'
      );
    }
  };

  return (
    <ScreenWrapper
      keyboardAware
      scrollable
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Add transaction</Text>
        <Text style={styles.title}>Capture a new entry</Text>
        <Text style={styles.subtitle}>
          Add income or expenses with clean local validation and immediate updates
          across the app.
        </Text>
      </View>

      <View style={styles.formCard}>
        <TransactionForm
          defaultValues={{
            type: 'expense',
          }}
          isSubmitting={isCreating}
          key={formVersion}
          onSubmit={handleCreate}
          submitLabel="Save Transaction"
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
