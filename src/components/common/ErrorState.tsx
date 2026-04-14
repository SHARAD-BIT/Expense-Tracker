import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../theme';
import { AppButton } from './AppButton';

type ErrorStateProps = {
  title: string;
  description: string;
  iconName?: ComponentProps<typeof Ionicons>['name'];
  actionLabel?: string;
  onActionPress?: () => void;
};

export function ErrorState({
  title,
  description,
  iconName = 'alert-circle-outline',
  actionLabel,
  onActionPress,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons color={theme.colors.danger} name={iconName} size={28} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onActionPress ? (
        <View style={styles.actionWrap}>
          <AppButton
            onPress={onActionPress}
            title={actionLabel}
            variant="secondary"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFF6F6',
    borderColor: '#F2D6D6',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['3xl'],
    ...theme.shadows.subtle,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#FFE7E7',
    borderRadius: theme.radii.md,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  title: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  actionWrap: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.sm,
  },
});
