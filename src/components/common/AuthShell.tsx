import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../theme';
import { AppLogo } from './AppLogo';
import { ScreenWrapper } from './ScreenWrapper';

type AuthShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  subtitle: string;
  note?: string;
  footer: ReactNode;
}>;

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  note,
  footer,
  children,
}: AuthShellProps) {
  return (
    <ScreenWrapper
      keyboardAware
      scrollable
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <AppLogo compact />
      </View>

      <View style={styles.copyBlock}>
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>{eyebrow}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {note ? (
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.formCard}>{children}</View>
      <View style={styles.footer}>{footer}</View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
  header: {
    marginBottom: theme.spacing['2xl'],
  },
  copyBlock: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  eyebrowPill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  eyebrowText: {
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
  noteCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  noteText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
});
