import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton, ScreenWrapper, SectionHeader } from '../../components/common';
import { mockUser } from '../../data';
import { useAuth } from '../../hooks';
import { theme } from '../../theme';
import type { MainTabScreenProps, RootNavigationProp } from '../../types';

const settingsItems = [
  {
    iconName: 'notifications-outline',
    title: 'Notifications',
    subtitle: 'Expense reminders and weekly recap',
  },
  {
    iconName: 'card-outline',
    title: 'Currency',
    subtitle: 'USD display for this frontend demo',
  },
  {
    iconName: 'moon-outline',
    title: 'Appearance',
    subtitle: 'Light theme active in this build',
  },
  {
    iconName: 'shield-checkmark-outline',
    title: 'Privacy',
    subtitle: 'All data stays on-device with local storage',
  },
] as const;

export function ProfileScreen({ navigation }: MainTabScreenProps<'Profile'>) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { session, signOut } = useAuth();
  const rootNavigation = navigation.getParent<RootNavigationProp>();
  const userProfile = {
    fullName: session?.fullName || mockUser.fullName,
    email: session?.email || mockUser.email,
    photoUrl: session?.photoUrl,
    provider: session?.provider ?? 'local',
  };
  const initials = userProfile.fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleLogout = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    rootNavigation?.reset({
      index: 0,
      routes: [
        {
          name: 'Login',
        },
      ],
    });
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Profile</Text>
        <Text style={styles.title}>Keep your local workspace tidy</Text>
        <Text style={styles.subtitle}>
          Review account info, placeholder settings, and a simple local logout
          flow without touching backend scope.
        </Text>
      </View>

      <View style={styles.userCard}>
        {userProfile.photoUrl ? (
          <Image source={{ uri: userProfile.photoUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <View style={styles.userCopy}>
          <Text style={styles.userName}>{userProfile.fullName}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
          <Text style={styles.userMeta}>
            {userProfile.provider === 'google'
              ? 'Google Sign-In client session'
              : 'Frontend-only demo account'}
          </Text>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeader
          subtitle="Placeholder rows for a production settings area"
          title="Settings"
        />

        <View style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.settingRow,
                index < settingsItems.length - 1 ? styles.settingRowBorder : null,
              ]}
            >
              <View style={styles.settingIconWrap}>
                <Ionicons
                  color={theme.colors.primaryDark}
                  name={item.iconName}
                  size={20}
                />
              </View>
              <View style={styles.settingCopy}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons
                color={theme.colors.textMuted}
                name="chevron-forward-outline"
                size={18}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeader subtitle="Current app state" title="Workspace" />
        <View style={styles.workspaceCard}>
          <View style={styles.workspaceRow}>
            <Text style={styles.workspaceLabel}>Data mode</Text>
            <Text style={styles.workspaceValue}>Local AsyncStorage</Text>
          </View>
          <View style={styles.workspaceRow}>
            <Text style={styles.workspaceLabel}>Sync</Text>
            <Text style={styles.workspaceValue}>Offline-only demo</Text>
          </View>
          <View style={styles.workspaceRow}>
            <Text style={styles.workspaceLabel}>Security</Text>
            <Text style={styles.workspaceValue}>
              {userProfile.provider === 'google'
                ? 'Client-side Google session'
                : 'No backend session'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.logoutCard}>
        <Text style={styles.logoutTitle}>Log out</Text>
        <Text style={styles.logoutSubtitle}>
          Clear the local session and return to the sign-in flow while keeping
          your saved transactions on this device.
        </Text>
        <AppButton
          loading={isSigningOut}
          onPress={() => void handleLogout()}
          title="Log Out"
          variant="danger"
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['4xl'],
    paddingTop: theme.spacing.lg,
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
  userCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  avatarImage: {
    borderRadius: theme.radii.pill,
    height: 80,
    width: 80,
  },
  avatarText: {
    ...theme.typography.title,
    color: theme.colors.primaryDark,
  },
  userCopy: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  userName: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  userEmail: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  userMeta: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  sectionBlock: {
    gap: theme.spacing.lg,
  },
  settingsCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  settingRowBorder: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  settingIconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  settingCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  settingTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  settingSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  workspaceCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  workspaceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workspaceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  workspaceValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  logoutCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    ...theme.shadows.subtle,
  },
  logoutTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  logoutSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
