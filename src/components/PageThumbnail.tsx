import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg from 'react-native-svg';

import type { PageDefinition, RegionColors } from '@/data/types';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface PageThumbnailProps {
  page: PageDefinition;
  size: number;
  regionColors?: RegionColors;
  onPress?: () => void;
  label?: string;
  testID?: string;
}

export const PageThumbnail: React.FC<PageThumbnailProps> = ({
  page,
  size,
  regionColors = {},
  onPress,
  label,
  testID,
}) => {
  const Component = page.Component;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label ?? page.title}
      style={({ pressed }) => [
        styles.container,
        { width: size, height: size + (label ? 36 : 0) },
        pressed && onPress && styles.pressed,
      ]}
      testID={testID}
    >
      <View style={[styles.canvas, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${page.width} ${page.height}`}>
          <Component regionColors={regionColors} />
        </Svg>
      </View>
      {label ? (
        <Text style={styles.label} numberOfLines={1}>
          {page.emoji} {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  canvas: {
    backgroundColor: colors.paperWhite,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadow.card,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
    maxWidth: '100%',
    textAlign: 'center',
  },
});
