import React from 'react';
import { Path } from 'react-native-svg';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, OUTLINE_COLOR, PathRegion } from '../Region';

export const FISH_REGIONS = [
  'water',
  'body',
  'tail',
  'topFin',
  'bottomFin',
  'eye',
  'bubble1',
  'bubble2',
  'bubble3',
];

export const Fish: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="water"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="tail"
      d="M310 200 L380 130 L380 270 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="body"
      d="M50 200 Q120 90 250 110 Q330 130 320 200 Q330 270 250 290 Q120 310 50 200 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="topFin"
      d="M170 130 L210 70 L240 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="bottomFin"
      d="M170 270 L210 330 L240 270 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="eye"
      cx={110}
      cy={180}
      r={14}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="bubble1"
      cx={70}
      cy={120}
      r={10}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="bubble2"
      cx={45}
      cy={70}
      r={14}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="bubble3"
      cx={90}
      cy={50}
      r={8}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Decorative gill */}
    <Path
      d="M150 150 Q140 200 150 250"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
  </>
);

export const FISH_PAGE = {
  id: 'fish',
  title: 'Fish',
  themeId: 'animals',
  emoji: '🐟',
  width: 400,
  height: 400,
  regions: FISH_REGIONS,
  Component: Fish,
};
