import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ALL_SWATCHES, type Swatch } from '@/data/palettes';
import { colors, radius, shadow, spacing } from '@/theme';

interface ColorPaletteProps {
  activeColor: string;
  onSelect: (color: string) => void;
  testID?: string;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  activeColor,
  onSelect,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {ALL_SWATCHES.map((swatch) => (
          <SwatchButton
            key={swatch.id}
            swatch={swatch}
            active={swatch.hex.toLowerCase() === activeColor.toLowerCase()}
            onPress={() => onSelect(swatch.hex)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface SwatchButtonProps {
  swatch: Swatch;
  active: boolean;
  onPress: () => void;
}

const SwatchButton: React.FC<SwatchButtonProps> = ({ swatch, active, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${swatch.name} color`}
    accessibilityState={{ selected: active }}
    style={({ pressed }) => [
      styles.swatchOuter,
      active && styles.swatchOuterActive,
      pressed && styles.swatchPressed,
    ]}
    testID={`swatch-${swatch.id}`}
  >
    <View style={[styles.swatchInner, { backgroundColor: swatch.hex }]} />
  </Pressable>
);

const SWATCH_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  swatchOuter: {
    width: SWATCH_SIZE + 8,
    height: SWATCH_SIZE + 8,
    borderRadius: (SWATCH_SIZE + 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  swatchOuterActive: {
    borderColor: colors.brand,
    transform: [{ scale: 1.05 }],
    ...shadow.button,
  },
  swatchPressed: {
    transform: [{ scale: 0.94 }],
  },
  swatchInner: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
  },
});
