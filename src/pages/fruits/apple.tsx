import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion } from '../Region';

export const APPLE_REGIONS = ['background', 'leftBody', 'rightBody', 'leaf', 'stem', 'highlight'];

export const Apple: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="leftBody"
      d="M200 130 Q90 130 80 230 Q70 330 200 350 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="rightBody"
      d="M200 130 Q310 130 320 230 Q330 330 200 350 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="stem"
      d="M196 110 Q200 70 210 70 Q204 90 204 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="leaf"
      d="M210 100 Q260 70 280 110 Q230 130 210 100 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="highlight"
      cx={150}
      cy={200}
      r={20}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const APPLE_PAGE = {
  id: 'apple',
  title: 'Apple',
  themeId: 'fruits',
  emoji: '🍎',
  width: 400,
  height: 400,
  regions: APPLE_REGIONS,
  Component: Apple,
};
