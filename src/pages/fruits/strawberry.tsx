import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion } from '../Region';

export const STRAWBERRY_REGIONS = [
  'background',
  'body',
  'leftLeaf',
  'centerLeaf',
  'rightLeaf',
  'seed1',
  'seed2',
  'seed3',
  'seed4',
];

export const Strawberry: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="body"
      d="M200 130 Q90 140 100 230 Q120 340 200 350 Q280 340 300 230 Q310 140 200 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="leftLeaf"
      d="M150 130 Q120 90 100 110 Q140 130 150 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="centerLeaf"
      d="M180 120 Q200 70 220 120 Q200 140 180 120 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="rightLeaf"
      d="M250 130 Q280 90 300 110 Q260 130 250 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="seed1"
      cx={160}
      cy={200}
      r={6}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="seed2"
      cx={240}
      cy={200}
      r={6}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="seed3"
      cx={180}
      cy={260}
      r={6}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="seed4"
      cx={220}
      cy={260}
      r={6}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const STRAWBERRY_PAGE = {
  id: 'strawberry',
  title: 'Strawberry',
  themeId: 'fruits',
  emoji: '🍓',
  width: 400,
  height: 400,
  regions: STRAWBERRY_REGIONS,
  Component: Strawberry,
};
