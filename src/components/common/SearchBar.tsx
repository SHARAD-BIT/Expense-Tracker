import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

import { theme } from '../../theme';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search transactions',
}: SearchBarProps) {
  return (
    <View style={styles.shell}>
      <Ionicons
        color={theme.colors.textMuted}
        name="search-outline"
        size={20}
      />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 54,
    paddingHorizontal: theme.spacing.lg,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
});
