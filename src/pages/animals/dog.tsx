import React from 'react';
import { Path } from 'react-native-svg';

import type { PageRenderProps } from '@/data/types';

import { CircleRegion, OUTLINE_COLOR, PathRegion } from '../Region';

export const DOG_REGIONS = [
  'background',
  'face',
  'leftEar',
  'rightEar',
  'snout',
  'nose',
  'leftEye',
  'rightEye',
  'tongue',
];

export const Dog: React.FC<PageRenderProps> = ({ regionColors, onRegionPress }) => (
  <>
    <PathRegion
      id="background"
      d="M0 0 H400 V400 H0 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={0}
    />
    {/* Floppy ears */}
    <PathRegion
      id="leftEar"
      d="M110 130 Q70 120 70 200 Q70 270 130 260 Q150 200 140 150 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    <PathRegion
      id="rightEar"
      d="M290 130 Q330 120 330 200 Q330 270 270 260 Q250 200 260 150 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Face */}
    <CircleRegion
      id="face"
      cx={200}
      cy={210}
      r={110}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Snout */}
    <PathRegion
      id="snout"
      d="M150 250 Q200 320 250 250 Q230 280 200 280 Q170 280 150 250 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
    />
    {/* Eyes */}
    <CircleRegion
      id="leftEye"
      cx={165}
      cy={200}
      r={12}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    <CircleRegion
      id="rightEye"
      cx={235}
      cy={200}
      r={12}
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Nose */}
    <PathRegion
      id="nose"
      d="M188 240 Q200 256 212 240 Q200 250 188 240 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Tongue */}
    <PathRegion
      id="tongue"
      d="M192 280 Q200 305 208 280 Q204 295 192 280 Z"
      regionColors={regionColors}
      onRegionPress={onRegionPress}
      strokeWidth={2}
    />
    {/* Mouth line */}
    <Path
      d="M200 256 L200 270"
      stroke={OUTLINE_COLOR}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </>
);

export const DOG_PAGE = {
  id: 'dog',
  title: 'Dog',
  themeId: 'animals',
  emoji: '🐶',
  width: 400,
  height: 400,
  regions: DOG_REGIONS,
  Component: Dog,
};
