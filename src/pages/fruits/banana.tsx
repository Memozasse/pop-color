import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { PathRegion } from '../Region';

export const BANANA_REGIONS = ['background', 'body', 'topTip', 'bottomTip'];

export const Banana: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
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
      d="M90 90 Q60 230 200 330 Q340 330 320 230 Q260 280 200 270 Q140 250 130 180 Q120 130 130 100 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="topTip"
      d="M90 90 L130 100 L130 75 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="bottomTip"
      d="M320 230 L340 250 L325 260 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
  </>
);

export const BANANA_PAGE = {
  id: 'banana',
  title: 'Banana',
  themeId: 'fruits',
  emoji: '🍌',
  width: 400,
  height: 400,
  regions: BANANA_REGIONS,
  Component: Banana,
};
