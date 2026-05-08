import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion, PolygonRegion } from '../Region';

export const SUN_REGIONS = [
  'background',
  'core',
  'face',
  'ray1',
  'ray2',
  'ray3',
  'ray4',
  'ray5',
  'ray6',
  'ray7',
  'ray8',
];

export const Sun: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PolygonRegion
      id="ray1"
      points="200,40 220,100 180,100"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="ray2"
      points="200,360 180,300 220,300"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="ray3"
      points="40,200 100,180 100,220"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="ray4"
      points="360,200 300,220 300,180"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="ray5"
      points="80,80 130,110 110,130"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="ray6"
      points="320,80 290,130 270,110"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="ray7"
      points="80,320 110,270 130,290"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="ray8"
      points="320,320 270,290 290,270"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="core"
      cx={200}
      cy={200}
      r={90}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="face"
      cx={200}
      cy={200}
      r={50}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const SUN_PAGE = {
  id: 'sun',
  title: 'Sun',
  themeId: 'shapes',
  emoji: '☀️',
  width: 400,
  height: 400,
  regions: SUN_REGIONS,
  Component: Sun,
};
