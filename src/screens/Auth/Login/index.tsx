import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { AppButton, AppInput, AuthShell } from '../../../components/common';
import { AUTH_DELAY_MS } from '../../../constants';
import { useAuth } from '../../../hooks';
import { theme } from '../../../theme';
import type { RootStackScreenProps } from '../../../types';
import { loginSchema, type LoginFormValues } from '../../../utils';

export function LoginScreen({ navigation, route }: RootStackScreenProps<'Login'>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeAuthMethod, signInWithGoogle, signInWithLocalAccount } =
    useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: route.params?.prefillEmail ?? '',
      password: '',
    },
  });

  useEffect(() => {
    if (route.params?.prefillEmail) {
      setValue('email', route.params.prefillEmail);
    }
  }, [route.params?.prefillEmail, setValue]);

  const handleSimulatedGoogleLogin = async () => {
    const result = await signInWithGoogle();

    if (result.status === 'success') {
      navigation.replace('MainTabs');
      return;
    }

    if (result.status === 'error') {
      Alert.alert('Google Sign-In failed', result.message);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    await signInWithLocalAccount({
      email: values.email,
    });

    await new Promise((resolve) => setTimeout(resolve, AUTH_DELAY_MS));

    setIsSubmitting(false);
    navigation.replace('MainTabs');
  });

  return (
    <AuthShell
      eyebrow="Secure sign in"
      title="Welcome back"
      subtitle="Sign in to pick up your spending flow with a clean, focused experience."
      note="Frontend demo build only. Authentication is simulated locally for product presentation."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to SpendWise?</Text>
          <Pressable hitSlop={8} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}>Create account</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.fieldGroup}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email?.message}
              keyboardType="email-address"
              label="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="you@example.com"
              returnKeyType="next"
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.password?.message}
              label="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter your password"
              returnKeyType="done"
              secureTextEntry
              value={value}
            />
          )}
        />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.helperLabel}>Password reset</Text>
        <Text style={styles.helperLink}>Coming soon</Text>
      </View>

      <View style={styles.actionGroup}>
        <AppButton
          disabled={activeAuthMethod === 'google'}
          loading={isSubmitting}
          onPress={onSubmit}
          title="Log In"
        />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        <AppButton
          disabled={isSubmitting}
          loading={activeAuthMethod === 'google'}
          onPress={() => void handleSimulatedGoogleLogin()}
          title="Continue with Google"
          variant="secondary"
          icon={
            <View style={styles.googleBadge}>
              <Text style={styles.googleBadgeText}>G</Text>
            </View>
          }
        />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: theme.spacing.lg,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  helperLink: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  actionGroup: {
    gap: theme.spacing.lg,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  divider: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  googleBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  googleBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    justifyContent: 'center',
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  footerLink: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primaryDark,
  },
});
