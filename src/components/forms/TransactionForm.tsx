import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { expenseCategories, incomeCategories } from '../../data';
import { theme } from '../../theme';
import type { Transaction, TransactionType } from '../../types';
import { transactionSchema, type TransactionFormValues } from '../../utils';
import { AppButton, AppInput, CategoryChip } from '../common';

type TransactionFormProps = {
  defaultValues?: Partial<TransactionFormValues>;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (values: TransactionFormValues) => void;
};

const defaultTransactionValues: TransactionFormValues = {
  title: '',
  amount: '',
  category: '',
  type: 'expense',
  date: getLocalDateValue(),
  notes: '',
};

export function TransactionForm({
  defaultValues,
  isSubmitting = false,
  submitLabel,
  onSubmit,
}: TransactionFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      ...defaultTransactionValues,
      ...defaultValues,
    },
  });

  const selectedType = watch('type');
  const selectedCategory = watch('category');

  const categories = useMemo(
    () => (selectedType === 'income' ? incomeCategories : expenseCategories),
    [selectedType]
  );

  useEffect(() => {
    if (selectedCategory && !categories.includes(selectedCategory as never)) {
      setValue('category', '', { shouldValidate: true });
    }
  }, [categories, selectedCategory, setValue]);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            error={errors.title?.message}
            label="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Groceries, Salary, Rent"
            returnKeyType="next"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            error={errors.amount?.message}
            keyboardType="decimal-pad"
            label="Amount"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="0.00"
            returnKeyType="next"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="type"
        render={({ field: { value } }) => (
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Transaction type</Text>
            <View style={styles.selectionRow}>
              {(['expense', 'income'] as TransactionType[]).map((type) => (
                <CategoryChip
                  active={value === type}
                  key={type}
                  label={type === 'expense' ? 'Expense' : 'Income'}
                  onPress={() =>
                    setValue('type', type, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              ))}
            </View>
            {errors.type?.message ? (
              <Text style={styles.errorText}>{errors.type.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { value } }) => (
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.selectionRow}>
                {categories.map((category) => (
                  <CategoryChip
                    active={value === category}
                    key={category}
                    label={category}
                    onPress={() =>
                      setValue('category', category, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                ))}
              </View>
            </ScrollView>
            {errors.category?.message ? (
              <Text style={styles.errorText}>{errors.category.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="date"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            error={errors.date?.message}
            helperText="Use the YYYY-MM-DD format."
            label="Date"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="2026-04-13"
            returnKeyType="next"
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            helperText="Optional"
            label="Notes"
            multiline
            numberOfLines={4}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Add any context for this transaction"
            textAlignVertical="top"
            value={value ?? ''}
          />
        )}
      />

      <AppButton
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        title={submitLabel}
      />
    </View>
  );
}

export function getTransactionFormDefaults(
  transaction: Transaction
): TransactionFormValues {
  return {
    title: transaction.title,
    amount: String(transaction.amount),
    category: transaction.category,
    type: transaction.type,
    date: transaction.date,
    notes: transaction.notes ?? '',
  };
}

export function mapTransactionFormValuesToDraft(
  values: TransactionFormValues
) {
  return {
    title: values.title.trim(),
    amount: Number(values.amount),
    category: values.category,
    type: values.type,
    date: values.date,
    notes: values.notes?.trim() ? values.notes.trim() : undefined,
  };
}

function getLocalDateValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  fieldBlock: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  selectionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
  },
});
