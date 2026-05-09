import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg from 'react-native-svg';

import type { PageDefinition, RegionColors } from '@/data/types';
import { colors, radius, shadow } from '@/theme';

interface ColoringCanvasProps {
  page: PageDefinition;
  regionColors: RegionColors;
  onRegionPress?: (regionId: string) => void;
  size: number;
  style?: ViewStyle;
  testID?: string;
}

export const ColoringCanvas = forwardRef<View, ColoringCanvasProps>(
  ({ page, regionColors, onRegionPress, size, style, testID }, ref) => {
    const Page = page.Component;
    const containerStyle = useMemo(
      () => [
        styles.container,
        { width: size, height: size, borderRadius: radius.lg },
        style,
      ],
      [size, style],
    );

    return (
      <View ref={ref} style={containerStyle} collapsable={false} testID={testID}>
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${page.width} ${page.height}`}
          accessibilityLabel={`${page.title} coloring page`}
        >
          <Page regionColors={regionColors} onRegionPress={onRegionPress} />
        </Svg>
      </View>
    );
  },
);

ColoringCanvas.displayName = 'ColoringCanvas';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.paperWhite,
    overflow: 'hidden',
    ...shadow.card,
  },
});
