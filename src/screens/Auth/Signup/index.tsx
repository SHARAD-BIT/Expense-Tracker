import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { AppButton, AppInput, AuthShell } from '../../../components/common';
import { AUTH_DELAY_MS } from '../../../constants';
import { useAuth } from '../../../hooks';
import { theme } from '../../../theme';
import type { RootStackScreenProps } from '../../../types';
import { signupSchema, type SignupFormValues } from '../../../utils';

export function SignupScreen({ navigation }: RootStackScreenProps<'Signup'>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeAuthMethod, signInWithGoogle } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSimulatedGoogleSignup = async () => {
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

    await new Promise((resolve) => setTimeout(resolve, AUTH_DELAY_MS));

    setIsSubmitting(false);
    Alert.alert(
      'Account created',
      'Your demo account is ready. Continue to login with the email you entered.',
      [
        {
          text: 'Continue',
          onPress: () =>
            navigation.replace('Login', { prefillEmail: values.email }),
        },
      ]
    );
  });

  return (
    <AuthShell
      eyebrow="Create your profile"
      title="Create your account"
      subtitle="Set up your demo account and move into a polished personal finance experience."
      note="No backend is connected in this build. Sign up is simulated to show the intended product flow."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable hitSlop={8} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log in</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.fieldGroup}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppInput
              autoCapitalize="words"
              error={errors.fullName?.message}
              label="Full name"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Sharad Gupta"
              returnKeyType="next"
              value={value}
            />
          )}
        />

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
              helperText="Use at least 6 characters."
              label="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Create a password"
              returnKeyType="next"
              secureTextEntry
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.confirmPassword?.message}
              helperText="Re-enter the password to confirm it."
              label="Confirm password"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Confirm your password"
              returnKeyType="done"
              secureTextEntry
              value={value}
            />
          )}
        />
      </View>

      <View style={styles.actionGroup}>
        <AppButton
          disabled={activeAuthMethod === 'google'}
          loading={isSubmitting}
          onPress={onSubmit}
          title="Create Account"
        />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        <AppButton
          disabled={isSubmitting}
          loading={activeAuthMethod === 'google'}
          onPress={() => void handleSimulatedGoogleSignup()}
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
