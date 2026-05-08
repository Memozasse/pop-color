import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion } from '../Region';

export const WATERMELON_REGIONS = [
  'background',
  'rind',
  'whiteLayer',
  'flesh',
  'seed1',
  'seed2',
  'seed3',
];

export const Watermelon: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="rind"
      d="M50 280 Q200 100 350 280 L350 300 Q200 360 50 300 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="whiteLayer"
      d="M70 270 Q200 130 330 270 Q200 320 70 270 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="flesh"
      d="M90 260 Q200 150 310 260 Q200 300 90 260 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="seed1"
      cx={150}
      cy={240}
      r={8}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="seed2"
      cx={200}
      cy={220}
      r={8}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="seed3"
      cx={250}
      cy={240}
      r={8}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const WATERMELON_PAGE = {
  id: 'watermelon',
  title: 'Watermelon',
  themeId: 'fruits',
  emoji: '🍉',
  width: 400,
  height: 400,
  regions: WATERMELON_REGIONS,
  Component: Watermelon,
};
