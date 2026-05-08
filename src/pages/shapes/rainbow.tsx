import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { PathRegion } from '../Region';

export const RAINBOW_REGIONS = [
  'sky',
  'arc1',
  'arc2',
  'arc3',
  'arc4',
  'arc5',
  'cloudLeft',
  'cloudRight',
];

export const Rainbow: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="sky"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    {/* Five rainbow arcs (concentric semicircles) */}
    <PathRegion
      id="arc1"
      d="M50 280 A150 150 0 0 1 350 280 L320 280 A120 120 0 0 0 80 280 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="arc2"
      d="M80 280 A120 120 0 0 1 320 280 L290 280 A90 90 0 0 0 110 280 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="arc3"
      d="M110 280 A90 90 0 0 1 290 280 L260 280 A60 60 0 0 0 140 280 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="arc4"
      d="M140 280 A60 60 0 0 1 260 280 L230 280 A30 30 0 0 0 170 280 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="arc5"
      d="M170 280 A30 30 0 0 1 230 280 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Clouds at the bases */}
    <PathRegion
      id="cloudLeft"
      d="M20 270 Q30 250 60 250 Q80 230 110 250 Q130 250 130 280 Q90 300 50 295 Q20 295 20 270 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="cloudRight"
      d="M270 270 Q280 250 310 250 Q330 230 360 250 Q380 250 380 280 Q340 300 300 295 Q270 295 270 270 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
  </>
);

export const RAINBOW_PAGE = {
  id: 'rainbow',
  title: 'Rainbow',
  themeId: 'shapes',
  emoji: '🌈',
  width: 400,
  height: 400,
  regions: RAINBOW_REGIONS,
  Component: Rainbow,
};
