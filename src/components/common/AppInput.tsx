import { useMemo, useState } from 'react';
import type { TextInputProps } from 'react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { theme } from '../../theme';

type AppInputProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
};

export function AppInput({
  label,
  error,
  helperText,
  secureTextEntry,
  autoComplete,
  importantForAutofill,
  textContentType,
  ...textInputProps
}: AppInputProps) {
  const [isSecureVisible, setIsSecureVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const shouldHideText = useMemo(
    () => Boolean(secureTextEntry) && !isSecureVisible,
    [isSecureVisible, secureTextEntry]
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputShell,
          textInputProps.multiline ? styles.inputShellMultiline : null,
          isFocused ? styles.inputShellFocused : null,
          error ? styles.inputShellError : null,
        ]}
      >
        <TextInput
          autoComplete="off"
          importantForAutofill="no"
          onBlur={(event) => {
            setIsFocused(false);
            textInputProps.onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            textInputProps.onFocus?.(event);
          }}
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.primary}
          style={styles.input}
          secureTextEntry={shouldHideText}
          textContentType="none"
          {...textInputProps}
        />
        {secureTextEntry ? (
          <Pressable
            hitSlop={8}
            onPress={() => setIsSecureVisible((current) => !current)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {isSecureVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: theme.spacing.lg,
  },
  inputShellFocused: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
  },
  inputShellMultiline: {
    alignItems: 'flex-start',
    minHeight: 120,
    paddingVertical: theme.spacing.md,
  },
  inputShellError: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.danger,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  toggleButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  toggleText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  helperText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
  },
});
