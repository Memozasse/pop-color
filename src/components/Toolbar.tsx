import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, typography } from '@/theme';

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  emphasized?: boolean;
  testID?: string;
}

interface ToolbarProps {
  actions: ToolbarAction[];
}

export const Toolbar: React.FC<ToolbarProps> = ({ actions }) => (
  <View style={styles.row} accessibilityRole="toolbar">
    {actions.map((action) => (
      <ToolbarButton key={action.id} action={action} />
    ))}
  </View>
);

const ToolbarButton: React.FC<{ action: ToolbarAction }> = ({ action }) => (
  <Pressable
    onPress={action.disabled ? undefined : action.onPress}
    accessibilityRole="button"
    accessibilityLabel={action.label}
    accessibilityState={{ disabled: !!action.disabled }}
    testID={action.testID}
    style={({ pressed }) => [
      styles.button,
      action.emphasized && styles.buttonEmphasized,
      action.disabled && styles.buttonDisabled,
      pressed && !action.disabled && styles.buttonPressed,
    ]}
  >
    <Text
      style={[
        styles.icon,
        action.emphasized && styles.iconEmphasized,
        action.disabled && styles.textDisabled,
      ]}
    >
      {action.icon}
    </Text>
    <Text
      style={[
        styles.label,
        action.emphasized && styles.labelEmphasized,
        action.disabled && styles.textDisabled,
      ]}
      numberOfLines={1}
    >
      {action.label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  button: {
    flex: 1,
    minHeight: 56,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  buttonEmphasized: {
    backgroundColor: colors.brand,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.94,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  icon: {
    fontSize: 22,
    lineHeight: 26,
  },
  iconEmphasized: {
    color: colors.textOnBrand,
  },
  label: {
    ...typography.caption,
    color: colors.text,
    marginTop: 2,
  },
  labelEmphasized: {
    color: colors.textOnBrand,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
