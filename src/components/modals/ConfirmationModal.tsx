import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../theme';
import { AppButton } from '../common';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({
  visible,
  title,
  description,
  confirmLabel,
  isConfirming = false,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.modalCard}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.actions}>
            <AppButton onPress={onCancel} title="Cancel" variant="secondary" />
            <AppButton
              loading={isConfirming}
              onPress={onConfirm}
              title={confirmLabel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    ...theme.shadows.card,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
});
