import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion, RectRegion } from '../Region';

export const CAR_REGIONS = [
  'background',
  'road',
  'body',
  'roof',
  'window',
  'leftWheel',
  'rightWheel',
  'leftWheelHub',
  'rightWheelHub',
  'headlight',
];

export const Car: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <RectRegion
      id="road"
      x={0}
      y={310}
      width={400}
      height={90}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="body"
      d="M40 270 L80 270 L100 230 L300 230 L320 270 L360 270 Q380 270 380 290 L380 320 L20 320 L20 290 Q20 270 40 270 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="roof"
      d="M110 230 L150 180 L260 180 L290 230 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="window"
      d="M125 225 L155 195 L255 195 L280 225 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="leftWheel"
      cx={120}
      cy={320}
      r={36}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="rightWheel"
      cx={280}
      cy={320}
      r={36}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="leftWheelHub"
      cx={120}
      cy={320}
      r={14}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="rightWheelHub"
      cx={280}
      cy={320}
      r={14}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="headlight"
      cx={355}
      cy={285}
      r={10}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
  </>
);

export const CAR_PAGE = {
  id: 'car',
  title: 'Car',
  themeId: 'vehicles',
  emoji: '🚗',
  width: 400,
  height: 400,
  regions: CAR_REGIONS,
  Component: Car,
};
