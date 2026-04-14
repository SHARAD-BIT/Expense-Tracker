import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../theme';

type SummaryCardProps = {
  label: string;
  value: string;
  helperText?: string;
  tone?: 'primary' | 'neutral' | 'danger';
  size?: 'default' | 'large';
};

export function SummaryCard({
  label,
  value,
  helperText,
  tone = 'neutral',
  size = 'default',
}: SummaryCardProps) {
  return (
    <View
      style={[
        styles.base,
        toneStyles[tone],
        size === 'large' ? styles.large : styles.default,
      ]}
    >
      <Text style={[styles.label, labelStyles[tone]]}>{label}</Text>
      <Text style={[styles.value, size === 'large' ? styles.valueLarge : null]}>
        {value}
      </Text>
      {helperText ? (
        <Text style={[styles.helper, labelStyles[tone]]}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const toneStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  neutral: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: '#FFF1F1',
    borderColor: '#F2CCCC',
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: theme.colors.white,
  },
  neutral: {
    color: theme.colors.textMuted,
  },
  danger: {
    color: theme.colors.danger,
  },
});

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  default: {
    padding: theme.spacing.lg,
  },
  large: {
    padding: theme.spacing.xl,
  },
  label: {
    ...theme.typography.caption,
  },
  value: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  valueLarge: {
    color: theme.colors.white,
    fontSize: 30,
    lineHeight: 36,
  },
  helper: {
    ...theme.typography.caption,
  },
});
