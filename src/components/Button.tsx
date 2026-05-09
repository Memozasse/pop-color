import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { colors, radius, shadow, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, minHeight: 40 },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 52 },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, minHeight: 64 },
};

const sizeTextStyles: Record<Size, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 20 },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  accessibilityLabel,
  testID,
  style,
}) => {
  const isDisabled = disabled || loading;

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    isDisabled ? styles.disabled : null,
    style ?? null,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.label,
    sizeTextStyles[size],
    variant === 'primary' && styles.labelOnBrand,
    variant === 'secondary' && styles.labelDark,
    variant === 'ghost' && styles.labelDark,
  ].filter(Boolean) as TextStyle[];

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        ...containerStyles,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textOnBrand : colors.text} />
      ) : (
        <Text style={textStyles}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadow.button,
  },
  primary: {
    backgroundColor: colors.brand,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.brandSoft,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.button,
  },
  labelOnBrand: {
    color: colors.textOnBrand,
  },
  labelDark: {
    color: colors.text,
  },
});
