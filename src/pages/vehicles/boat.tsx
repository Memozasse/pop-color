import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion } from '../Region';

export const BOAT_REGIONS = [
  'sky',
  'sea',
  'hull',
  'mast',
  'sailLeft',
  'sailRight',
  'sun',
];

export const Boat: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="sky"
      d="M0 0 H400 V260 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="sea"
      d="M0 260 Q100 240 200 260 Q300 280 400 260 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="sun"
      cx={330}
      cy={80}
      r={36}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="sailLeft"
      d="M200 80 L200 240 L100 240 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="sailRight"
      d="M210 100 L210 240 L300 240 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="mast"
      d="M198 80 L202 80 L202 250 L198 250 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="hull"
      d="M70 250 L330 250 L290 320 L110 320 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
  </>
);

export const BOAT_PAGE = {
  id: 'boat',
  title: 'Sailboat',
  themeId: 'vehicles',
  emoji: '⛵',
  width: 400,
  height: 400,
  regions: BOAT_REGIONS,
  Component: Boat,
};
