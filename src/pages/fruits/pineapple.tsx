import React from 'react';
import { Path } from 'react-native-svg';

import type { PageRenderProps } from '@/data/types';

import { OUTLINE_COLOR, PathRegion } from '../Region';

export const PINEAPPLE_REGIONS = [
  'background',
  'body',
  'leafLeft',
  'leafCenter',
  'leafRight',
];

export const Pineapple: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    {/* Leaves */}
    <PathRegion
      id="leafLeft"
      d="M170 140 L130 50 L160 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="leafCenter"
      d="M195 130 L200 30 L210 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="leafRight"
      d="M230 140 L270 50 L240 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Body */}
    <PathRegion
      id="body"
      d="M130 150 Q100 250 130 340 Q200 370 270 340 Q300 250 270 150 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Decorative diamond pattern (not colorable) */}
    <Path
      d="M150 180 L200 165 L250 180 L200 195 Z M150 240 L200 225 L250 240 L200 255 Z M150 300 L200 285 L250 300 L200 315 Z"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      fill="none"
    />
  </>
);

export const PINEAPPLE_PAGE = {
  id: 'pineapple',
  title: 'Pineapple',
  themeId: 'fruits',
  emoji: '🍍',
  width: 400,
  height: 400,
  regions: PINEAPPLE_REGIONS,
  Component: Pineapple,
};
