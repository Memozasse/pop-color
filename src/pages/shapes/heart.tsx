import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion } from '../Region';

export const HEART_REGIONS = ['background', 'heart', 'shine', 'tinyHeart'];

export const Heart: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="heart"
      d="M200 340 C40 230 60 80 200 150 C340 80 360 230 200 340 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="shine"
      d="M120 160 Q140 130 170 140 Q160 170 130 180 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="tinyHeart"
      cx={310}
      cy={90}
      r={20}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const HEART_PAGE = {
  id: 'heart',
  title: 'Heart',
  themeId: 'shapes',
  emoji: '❤️',
  width: 400,
  height: 400,
  regions: HEART_REGIONS,
  Component: Heart,
};
