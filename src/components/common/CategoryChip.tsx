import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../../theme';

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function CategoryChip({
  label,
  active = false,
  onPress,
}: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        active ? styles.active : styles.inactive,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.label, active ? styles.labelActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  active: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  inactive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  labelActive: {
    color: theme.colors.white,
  },
});
