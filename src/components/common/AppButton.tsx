import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { theme } from '../../theme';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
}: AppButtonProps) {
  const isInactive = loading || disabled;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        containerStyles[variant],
        isInactive && styles.inactive,
        pressed && !isInactive ? styles.pressed : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' || variant === 'danger'
              ? theme.colors.white
              : theme.colors.primary
          }
        />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={[styles.label, labelStyles[variant]]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const containerStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingVertical: theme.spacing.sm,
  },
});

const labelStyles = StyleSheet.create({
  primary: {
    color: theme.colors.white,
  },
  secondary: {
    color: theme.colors.text,
  },
  danger: {
    color: theme.colors.white,
  },
  ghost: {
    color: theme.colors.primaryDark,
  },
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: theme.spacing.xl,
  },
  pressed: {
    opacity: 0.9,
  },
  inactive: {
    opacity: 0.55,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  label: {
    ...theme.typography.bodyMedium,
  },
});
