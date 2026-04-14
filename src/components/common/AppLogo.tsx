import { StyleSheet, Text, View } from 'react-native';

import { APP_NAME } from '../../constants';
import { theme } from '../../theme';

type AppLogoProps = {
  compact?: boolean;
};

export function AppLogo({ compact = false }: AppLogoProps) {
  return (
    <View style={[styles.row, compact ? styles.rowCompact : null]}>
      <View style={[styles.badge, compact ? styles.badgeCompact : null]}>
        <Text style={[styles.badgeText, compact ? styles.badgeTextCompact : null]}>
          SW
        </Text>
      </View>
      <View>
        <Text style={[styles.name, compact ? styles.nameCompact : null]}>
          {APP_NAME}
        </Text>
        <Text style={styles.tagline}>Personal finance, kept simple</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  rowCompact: {
    gap: theme.spacing.sm,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    height: 56,
    justifyContent: 'center',
    width: 56,
    ...theme.shadows.subtle,
  },
  badgeCompact: {
    height: 44,
    width: 44,
  },
  badgeText: {
    ...theme.typography.title,
    color: theme.colors.white,
  },
  badgeTextCompact: {
    fontSize: 18,
    lineHeight: 22,
  },
  name: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  nameCompact: {
    fontSize: 20,
    lineHeight: 24,
  },
  tagline: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
