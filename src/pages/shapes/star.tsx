import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion, PolygonRegion } from '../Region';

export const STAR_REGIONS = [
  'background',
  'star',
  'centerCircle',
  'sparkle1',
  'sparkle2',
  'sparkle3',
];

export const Star: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PolygonRegion
      id="star"
      points="200,60 240,160 350,160 260,220 295,330 200,260 105,330 140,220 50,160 160,160"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="centerCircle"
      cx={200}
      cy={210}
      r={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="sparkle1"
      cx={70}
      cy={80}
      r={12}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="sparkle2"
      cx={340}
      cy={90}
      r={10}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="sparkle3"
      cx={350}
      cy={310}
      r={14}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const STAR_PAGE = {
  id: 'star',
  title: 'Star',
  themeId: 'shapes',
  emoji: '⭐',
  width: 400,
  height: 400,
  regions: STAR_REGIONS,
  Component: Star,
};
