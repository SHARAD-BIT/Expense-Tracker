import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppLogo, ScreenWrapper } from '../../components/common';
import { APP_NAME, SPLASH_DELAY_MS } from '../../constants';
import { useAuth } from '../../hooks';
import { theme } from '../../theme';
import type { RootStackScreenProps } from '../../types';

export function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const { isHydrating, session } = useAuth();

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const timer = setTimeout(() => {
      navigation.replace(session ? 'MainTabs' : 'Onboarding');
    }, SPLASH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isHydrating, navigation, session]);

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Daily money clarity</Text>
        </View>
      </View>

      <View style={styles.heroBlock}>
        <AppLogo />
        <Text style={styles.title}>A calmer way to manage money every day.</Text>
        <Text style={styles.subtitle}>
          Keep spending, habits, and monthly pace in one clean place that feels
          steady from the first screen.
        </Text>
      </View>

      <View style={styles.illustrationPanel}>
        <View style={styles.illustrationHeader}>
          <View>
            <Text style={styles.illustrationEyebrow}>Monthly snapshot</Text>
            <Text style={styles.illustrationTitle}>Your spending at a glance</Text>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        <View style={styles.illustrationContent}>
          <View style={styles.deviceFrame}>
            <View style={styles.deviceTop}>
              <Text style={styles.deviceLabel}>Current balance</Text>
              <Text style={styles.deviceValue}>$4,820</Text>
            </View>

            <View style={styles.barsRow}>
              {[42, 78, 58, 92, 66].map((height, index) => (
                <View
                  key={index}
                  style={[styles.bar, { height, opacity: index === 3 ? 1 : 0.7 }]}
                />
              ))}
            </View>

            <View style={styles.progressBlock}>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressLabel}>Budget pace 68%</Text>
            </View>
          </View>

          <View style={styles.signalColumn}>
            <View style={styles.signalRow}>
              <Text style={styles.signalLabel}>Income</Text>
              <Text style={styles.signalValue}>$6,200</Text>
            </View>
            <View style={styles.signalDivider} />
            <View style={styles.signalRow}>
              <Text style={styles.signalLabel}>Expenses</Text>
              <Text style={styles.signalValue}>$1,380</Text>
            </View>
            <View style={styles.signalDivider} />
            <View style={styles.signalRow}>
              <Text style={styles.signalLabel}>Savings pace</Text>
              <Text style={styles.signalValue}>Strong</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomBlock}>
        <View style={styles.statusPill}>
          <ActivityIndicator color={theme.colors.primaryDark} size="small" />
          <Text style={styles.statusText}>Preparing {APP_NAME}</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
  headerRow: {
    marginBottom: theme.spacing['2xl'],
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  heroBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  heroBlock: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['3xl'],
    paddingRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    maxWidth: 320,
  },
  illustrationPanel: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    ...theme.shadows.card,
  },
  illustrationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  illustrationEyebrow: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.xs,
  },
  illustrationTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  livePill: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.pill,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  liveDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    height: 8,
    width: 8,
  },
  liveText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  illustrationContent: {
    gap: theme.spacing.lg,
  },
  deviceFrame: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.md,
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  deviceTop: {
    gap: theme.spacing.xs,
  },
  deviceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  deviceValue: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  barsRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    height: 96,
  },
  bar: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    flex: 1,
  },
  progressBlock: {
    gap: theme.spacing.sm,
  },
  progressTrack: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radii.pill,
    height: '100%',
    width: '68%',
  },
  progressLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  signalColumn: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  signalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  signalDivider: {
    backgroundColor: theme.colors.border,
    height: 1,
  },
  signalLabel: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  signalValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  bottomBlock: {
    alignItems: 'flex-start',
    marginTop: 'auto',
    paddingTop: theme.spacing['3xl'],
  },
  statusPill: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  statusText: {
    ...theme.typography.label,
    color: theme.colors.primaryDark,
  },
});
