import React from 'react';
import { Path } from 'react-native-svg';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, OUTLINE_COLOR, PathRegion, PolygonRegion } from '../Region';

export const CAT_REGIONS = [
  'face',
  'leftEar',
  'rightEar',
  'leftCheek',
  'rightCheek',
  'nose',
  'leftEye',
  'rightEye',
  'background',
];

export const Cat: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    {/* Background */}
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    {/* Ears (drawn before face so face overlaps them) */}
    <PolygonRegion
      id="leftEar"
      points="120,150 100,60 180,120"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PolygonRegion
      id="rightEar"
      points="280,150 300,60 220,120"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Face */}
    <CircleRegion
      id="face"
      cx={200}
      cy={220}
      r={120}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Cheeks */}
    <CircleRegion
      id="leftCheek"
      cx={140}
      cy={250}
      r={22}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="rightCheek"
      cx={260}
      cy={250}
      r={22}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Eyes */}
    <CircleRegion
      id="leftEye"
      cx={160}
      cy={195}
      r={14}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="rightEye"
      cx={240}
      cy={195}
      r={14}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Nose */}
    <PathRegion
      id="nose"
      d="M188 232 Q200 250 212 232 Q200 240 188 232 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Decorative whiskers (not colorable) */}
    <Path d="M120 248 L80 240" stroke={OUTLINE_COLOR} strokeWidth={2} strokeLinecap="round" />
    <Path d="M120 258 L78 264" stroke={OUTLINE_COLOR} strokeWidth={2} strokeLinecap="round" />
    <Path d="M280 248 L320 240" stroke={OUTLINE_COLOR} strokeWidth={2} strokeLinecap="round" />
    <Path d="M280 258 L322 264" stroke={OUTLINE_COLOR} strokeWidth={2} strokeLinecap="round" />
    {/* Mouth */}
    <Path
      d="M188 248 Q200 260 212 248"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M200 244 L200 252"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </>
);

export const CAT_PAGE = {
  id: 'cat',
  title: 'Cat',
  themeId: 'animals',
  emoji: '🐱',
  width: 400,
  height: 400,
  regions: CAT_REGIONS,
  Component: Cat,
};
