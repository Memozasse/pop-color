import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion } from '../Region';

export const AIRPLANE_REGIONS = [
  'sky',
  'cloudLeft',
  'cloudRight',
  'fuselage',
  'wing',
  'tail',
  'window1',
  'window2',
  'window3',
];

export const Airplane: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="sky"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="cloudLeft"
      d="M40 280 Q60 250 100 260 Q120 240 150 260 Q170 290 130 300 Q90 310 40 300 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="cloudRight"
      d="M260 110 Q280 80 320 90 Q340 70 360 100 Q370 130 320 130 Q280 140 260 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="fuselage"
      d="M40 230 L320 200 Q360 200 360 220 Q360 240 320 240 L40 230 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="wing"
      d="M150 225 L260 225 L210 290 L130 285 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="tail"
      d="M40 230 L20 170 L70 220 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="window1"
      cx={130}
      cy={222}
      r={8}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="window2"
      cx={170}
      cy={219}
      r={8}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="window3"
      cx={210}
      cy={216}
      r={8}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const AIRPLANE_PAGE = {
  id: 'airplane',
  title: 'Airplane',
  themeId: 'vehicles',
  emoji: '✈️',
  width: 400,
  height: 400,
  regions: AIRPLANE_REGIONS,
  Component: Airplane,
};
