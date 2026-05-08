import React from 'react';
import { Path } from 'react-native-svg';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, OUTLINE_COLOR, PathRegion } from '../Region';

export const BUTTERFLY_REGIONS = [
  'background',
  'leftWingTop',
  'leftWingBottom',
  'rightWingTop',
  'rightWingBottom',
  'body',
  'leftSpot',
  'rightSpot',
];

export const Butterfly: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    <PathRegion
      id="leftWingTop"
      d="M200 200 Q120 80 60 130 Q40 180 110 220 Q150 230 200 200 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="leftWingBottom"
      d="M200 200 Q140 270 90 320 Q70 280 130 230 Q170 215 200 200 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="rightWingTop"
      d="M200 200 Q280 80 340 130 Q360 180 290 220 Q250 230 200 200 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="rightWingBottom"
      d="M200 200 Q260 270 310 320 Q330 280 270 230 Q230 215 200 200 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <CircleRegion
      id="leftSpot"
      cx={120}
      cy={160}
      r={18}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="rightSpot"
      cx={280}
      cy={160}
      r={18}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <PathRegion
      id="body"
      d="M194 130 Q200 100 206 130 L206 280 Q200 300 194 280 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Antennae */}
    <Path
      d="M196 130 Q186 90 170 80"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M204 130 Q214 90 230 80"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
  </>
);

export const BUTTERFLY_PAGE = {
  id: 'butterfly',
  title: 'Butterfly',
  themeId: 'animals',
  emoji: '🦋',
  width: 400,
  height: 400,
  regions: BUTTERFLY_REGIONS,
  Component: Butterfly,
};
