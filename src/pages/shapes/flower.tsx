import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, EllipseRegion, PathRegion } from '../Region';

export const FLOWER_REGIONS = [
  'background',
  'topPetal',
  'rightPetal',
  'bottomPetal',
  'leftPetal',
  'topRightPetal',
  'bottomRightPetal',
  'bottomLeftPetal',
  'topLeftPetal',
  'center',
  'stem',
  'leaf',
];

export const Flower: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    {/* 8 petals around center (200, 170) */}
    <EllipseRegion
      id="topPetal"
      cx={200}
      cy={90}
      rx={28}
      ry={50}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <EllipseRegion
      id="bottomPetal"
      cx={200}
      cy={250}
      rx={28}
      ry={50}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <EllipseRegion
      id="leftPetal"
      cx={120}
      cy={170}
      rx={50}
      ry={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <EllipseRegion
      id="rightPetal"
      cx={280}
      cy={170}
      rx={50}
      ry={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="topRightPetal"
      d="M225 110 Q280 100 280 130 Q260 155 230 155 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="bottomRightPetal"
      d="M225 230 Q280 240 280 210 Q260 185 230 185 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="bottomLeftPetal"
      d="M175 230 Q120 240 120 210 Q140 185 170 185 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="topLeftPetal"
      d="M175 110 Q120 100 120 130 Q140 155 170 155 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="center"
      cx={200}
      cy={170}
      r={32}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="stem"
      d="M196 220 Q200 320 196 380 L204 380 Q200 320 204 220 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="leaf"
      d="M204 320 Q280 290 290 340 Q230 350 204 320 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
  </>
);

export const FLOWER_PAGE = {
  id: 'flower',
  title: 'Flower',
  themeId: 'shapes',
  emoji: '🌸',
  width: 400,
  height: 400,
  regions: FLOWER_REGIONS,
  Component: Flower,
};
