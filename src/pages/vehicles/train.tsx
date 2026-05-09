import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion, RectRegion } from '../Region';

export const TRAIN_REGIONS = [
  'background',
  'tracks',
  'engineBody',
  'engineCab',
  'engineWindow',
  'smokestack',
  'smoke',
  'wheel1',
  'wheel2',
  'wheel3',
];

export const Train: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <RectRegion
      id="tracks"
      x={0}
      y={335}
      width={400}
      height={20}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <RectRegion
      id="engineBody"
      x={50}
      y={210}
      width={300}
      height={120}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      rx={10}
    />
    <PathRegion
      id="engineCab"
      d="M230 150 L320 150 L320 215 L230 215 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <RectRegion
      id="engineWindow"
      x={245}
      y={165}
      width={60}
      height={35}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
      rx={4}
    />
    <RectRegion
      id="smokestack"
      x={90}
      y={150}
      width={40}
      height={70}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="smoke"
      d="M70 130 Q80 90 110 90 Q140 80 150 110 Q160 130 130 140 Q90 150 70 130 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="wheel1"
      cx={100}
      cy={335}
      r={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="wheel2"
      cx={200}
      cy={335}
      r={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="wheel3"
      cx={300}
      cy={335}
      r={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
  </>
);

export const TRAIN_PAGE = {
  id: 'train',
  title: 'Train',
  themeId: 'vehicles',
  emoji: '🚂',
  width: 400,
  height: 400,
  regions: TRAIN_REGIONS,
  Component: Train,
};
