import React from 'react';
import { Path } from 'react-native-svg';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, EllipseRegion, OUTLINE_COLOR, PathRegion } from '../Region';

export const BUNNY_REGIONS = [
  'background',
  'leftEar',
  'rightEar',
  'leftEarInner',
  'rightEarInner',
  'face',
  'leftCheek',
  'rightCheek',
  'nose',
];

export const Bunny: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    {/* Ears */}
    <EllipseRegion
      id="leftEar"
      cx={150}
      cy={120}
      rx={28}
      ry={80}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <EllipseRegion
      id="rightEar"
      cx={250}
      cy={120}
      rx={28}
      ry={80}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <EllipseRegion
      id="leftEarInner"
      cx={150}
      cy={130}
      rx={14}
      ry={55}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <EllipseRegion
      id="rightEarInner"
      cx={250}
      cy={130}
      rx={14}
      ry={55}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Face */}
    <CircleRegion
      id="face"
      cx={200}
      cy={250}
      r={100}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Cheeks */}
    <CircleRegion
      id="leftCheek"
      cx={155}
      cy={275}
      r={20}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="rightCheek"
      cx={245}
      cy={275}
      r={20}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Nose */}
    <PathRegion
      id="nose"
      d="M188 250 Q200 268 212 250 Q200 258 188 250 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Eyes (decorative dots) */}
    <Path d="M170 230 a4 4 0 1 1 8 0 a4 4 0 1 1 -8 0" fill={OUTLINE_COLOR} />
    <Path d="M222 230 a4 4 0 1 1 8 0 a4 4 0 1 1 -8 0" fill={OUTLINE_COLOR} />
    {/* Mouth */}
    <Path
      d="M200 262 L200 278"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M186 282 Q200 296 214 282"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
  </>
);

export const BUNNY_PAGE = {
  id: 'bunny',
  title: 'Bunny',
  themeId: 'animals',
  emoji: '🐰',
  width: 400,
  height: 400,
  regions: BUNNY_REGIONS,
  Component: Bunny,
};
