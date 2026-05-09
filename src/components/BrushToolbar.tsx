import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BRUSH_SIZES, type BrushSizeKey } from '@/state/brushStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface BrushToolbarProps {
  brushSize: number;
  isErasing: boolean;
  stayInside: boolean;
  onSelectSize: (size: number) => void;
  onToggleEraser: () => void;
  onToggleStayInside: () => void;
}

const SIZES: { key: BrushSizeKey; label: string; dot: number }[] = [
  { key: 'small', label: 'S', dot: 10 },
  { key: 'medium', label: 'M', dot: 18 },
  { key: 'large', label: 'L', dot: 28 },
];

export const BrushToolbar: React.FC<BrushToolbarProps> = ({
  brushSize,
  isErasing,
  stayInside,
  onSelectSize,
  onToggleEraser,
  onToggleStayInside,
}) => (
  <View style={styles.row} accessibilityRole="toolbar">
    <View style={styles.group}>
      {SIZES.map((s) => {
        const active = !isErasing && brushSize === BRUSH_SIZES[s.key];
        return (
          <Pressable
            key={s.key}
            onPress={() => onSelectSize(BRUSH_SIZES[s.key])}
            accessibilityRole="button"
            accessibilityLabel={`Brush size ${s.label}`}
            accessibilityState={{ selected: active }}
            testID={`btn-size-${s.key}`}
            style={({ pressed }) => [
              styles.toolButton,
              active && styles.toolButtonActive,
              pressed && styles.toolButtonPressed,
            ]}
          >
            <View
              style={[
                styles.dot,
                {
                  width: s.dot,
                  height: s.dot,
                  borderRadius: s.dot / 2,
                  backgroundColor: active ? colors.textOnBrand : colors.text,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>

    <Pressable
      onPress={onToggleEraser}
      accessibilityRole="button"
      accessibilityLabel="Eraser"
      accessibilityState={{ selected: isErasing }}
      testID="btn-eraser"
      style={({ pressed }) => [
        styles.toolButton,
        isErasing && styles.toolButtonActive,
        pressed && styles.toolButtonPressed,
      ]}
    >
      <Text style={[styles.toolLabel, isErasing && styles.toolLabelActive]}>
        🧽
      </Text>
    </Pressable>

    <Pressable
      onPress={onToggleStayInside}
      accessibilityRole="switch"
      accessibilityLabel="Stay inside the lines"
      accessibilityState={{ checked: stayInside }}
      testID="btn-stay-inside"
      style={({ pressed }) => [
        styles.stayInside,
        stayInside && styles.stayInsideActive,
        pressed && styles.toolButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.stayInsideLabel,
          stayInside && styles.stayInsideLabelActive,
        ]}
        numberOfLines={1}
      >
        {stayInside ? '🔒 Stay inside' : '🔓 Anywhere'}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  toolButton: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  toolButtonActive: {
    backgroundColor: colors.brand,
  },
  toolButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.94,
  },
  toolLabel: {
    fontSize: 22,
    lineHeight: 26,
  },
  toolLabelActive: {
    color: colors.textOnBrand,
  },
  dot: {
    backgroundColor: colors.text,
  },
  stayInside: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  stayInsideActive: {
    backgroundColor: colors.brand,
  },
  stayInsideLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  stayInsideLabelActive: {
    color: colors.textOnBrand,
  },
});
