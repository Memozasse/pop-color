import React from 'react';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, PathRegion, RectRegion } from '../Region';

export const TRUCK_REGIONS = [
  'background',
  'road',
  'cargo',
  'cab',
  'cabWindow',
  'leftWheel',
  'rightWheel',
];

export const Truck: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
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
      y={320}
      width={400}
      height={80}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <RectRegion
      id="cargo"
      x={40}
      y={170}
      width={210}
      height={150}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      rx={10}
    />
    <PathRegion
      id="cab"
      d="M250 220 L320 220 L360 270 L360 320 L250 320 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="cabWindow"
      d="M260 235 L310 235 L335 270 L260 270 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="leftWheel"
      cx={110}
      cy={325}
      r={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="rightWheel"
      cx={300}
      cy={325}
      r={28}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
  </>
);

export const TRUCK_PAGE = {
  id: 'truck',
  title: 'Truck',
  themeId: 'vehicles',
  emoji: '🚚',
  width: 400,
  height: 400,
  regions: TRUCK_REGIONS,
  Component: Truck,
};
