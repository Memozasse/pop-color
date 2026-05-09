import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg from 'react-native-svg';

import { StrokesSvgLayer } from '@/components/StrokesSvgLayer';
import type { PageDefinition, RegionColors, Stroke } from '@/data/types';
import { OutlineOnlyContext } from '@/pages/Region';
import { colors, radius, shadow, spacing, typography } from '@/theme';

interface PageThumbnailProps {
  page: PageDefinition;
  size: number;
  regionColors?: RegionColors;
  strokes?: Stroke[];
  onPress?: () => void;
  label?: string;
  testID?: string;
}

export const PageThumbnail: React.FC<PageThumbnailProps> = ({
  page,
  size,
  regionColors = {},
  strokes,
  onPress,
  label,
  testID,
}) => {
  const hasStrokes = !!strokes && strokes.length > 0;
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
        {page.kind === 'vector' ? (
          <Svg width={size} height={size} viewBox={`0 0 ${page.width} ${page.height}`}>
            {hasStrokes ? (
              <>
                <StrokesSvgLayer
                  strokes={strokes as Stroke[]}
                  geometry={page.regionGeometry}
                />
                <OutlineOnlyContext.Provider value>
                  <page.Component regionColors={{}} />
                </OutlineOnlyContext.Provider>
              </>
            ) : (
              <page.Component regionColors={regionColors} />
            )}
          </Svg>
        ) : (
          <View style={{ width: size, height: size }}>
            {hasStrokes ? (
              <Svg
                width={size}
                height={size}
                viewBox={`0 0 ${page.width} ${page.height}`}
                style={StyleSheet.absoluteFill}
              >
                <StrokesSvgLayer strokes={strokes as Stroke[]} geometry={{}} />
              </Svg>
            ) : null}
            <Image
              source={page.source}
              style={[StyleSheet.absoluteFill, { width: size, height: size }]}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
        )}
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
