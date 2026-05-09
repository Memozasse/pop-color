import React, { createContext, useContext } from 'react';
import { Path, Circle, Ellipse, Rect, Polygon } from 'react-native-svg';

import type { RegionColors } from '@/data/types';

const OUTLINE = '#1F1B30';
const DEFAULT_FILL = '#FFFFFF';
const TRANSPARENT_FILL = 'transparent';

/**
 * V2 brush engine renders pages as outline-only on top of a Skia paint
 * layer. Setting this context to `true` makes every Region render with a
 * transparent fill so the strokes underneath show through, while keeping
 * the outline drawn.
 */
export const OutlineOnlyContext = createContext<boolean>(false);

const useFill = (id: string, regionColors: RegionColors, defaultFill: string): string => {
  const outlineOnly = useContext(OutlineOnlyContext);
  if (outlineOnly) return TRANSPARENT_FILL;
  return regionColors[id] ?? defaultFill;
};

interface BaseProps {
  id: string;
  regionColors: RegionColors;
  onRegionPress?: (id: string) => void;
  strokeWidth?: number;
  defaultFill?: string;
}

export const PathRegion: React.FC<BaseProps & { d: string }> = ({
  id,
  d,
  regionColors,
  onRegionPress,
  strokeWidth = 3,
  defaultFill = DEFAULT_FILL,
}) => (
  <Path
    d={d}
    fill={useFill(id, regionColors, defaultFill)}
    stroke={OUTLINE}
    strokeWidth={strokeWidth}
    strokeLinejoin="round"
    strokeLinecap="round"
    onPress={onRegionPress ? () => onRegionPress(id) : undefined}
  />
);

export const CircleRegion: React.FC<
  BaseProps & { cx: number; cy: number; r: number }
> = ({ id, cx, cy, r, regionColors, onRegionPress, strokeWidth = 3, defaultFill = DEFAULT_FILL }) => (
  <Circle
    cx={cx}
    cy={cy}
    r={r}
    fill={useFill(id, regionColors, defaultFill)}
    stroke={OUTLINE}
    strokeWidth={strokeWidth}
    onPress={onRegionPress ? () => onRegionPress(id) : undefined}
  />
);

export const EllipseRegion: React.FC<
  BaseProps & { cx: number; cy: number; rx: number; ry: number }
> = ({
  id,
  cx,
  cy,
  rx,
  ry,
  regionColors,
  onRegionPress,
  strokeWidth = 3,
  defaultFill = DEFAULT_FILL,
}) => (
  <Ellipse
    cx={cx}
    cy={cy}
    rx={rx}
    ry={ry}
    fill={useFill(id, regionColors, defaultFill)}
    stroke={OUTLINE}
    strokeWidth={strokeWidth}
    onPress={onRegionPress ? () => onRegionPress(id) : undefined}
  />
);

export const RectRegion: React.FC<
  BaseProps & { x: number; y: number; width: number; height: number; rx?: number }
> = ({
  id,
  x,
  y,
  width,
  height,
  rx = 0,
  regionColors,
  onRegionPress,
  strokeWidth = 3,
  defaultFill = DEFAULT_FILL,
}) => (
  <Rect
    x={x}
    y={y}
    width={width}
    height={height}
    rx={rx}
    fill={useFill(id, regionColors, defaultFill)}
    stroke={OUTLINE}
    strokeWidth={strokeWidth}
    onPress={onRegionPress ? () => onRegionPress(id) : undefined}
  />
);

export const PolygonRegion: React.FC<BaseProps & { points: string }> = ({
  id,
  points,
  regionColors,
  onRegionPress,
  strokeWidth = 3,
  defaultFill = DEFAULT_FILL,
}) => (
  <Polygon
    points={points}
    fill={useFill(id, regionColors, defaultFill)}
    stroke={OUTLINE}
    strokeWidth={strokeWidth}
    strokeLinejoin="round"
    onPress={onRegionPress ? () => onRegionPress(id) : undefined}
  />
);

export const OUTLINE_COLOR = OUTLINE;
