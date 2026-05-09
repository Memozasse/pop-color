import type { ImageSourcePropType } from 'react-native';

import type { RasterPageDefinition } from './types';

const rasterPage = (
  page: Omit<RasterPageDefinition, 'kind'>,
): RasterPageDefinition => ({ ...page, kind: 'raster' });

/**
 * Animals theme — cute baby line-art pages (cropped + padded to 1024×1024).
 * Sit alongside the vector animal pages in the Animals theme.
 */
export const ANIMAL_RASTER_PAGES: RasterPageDefinition[] = [
  rasterPage({
    id: 'elephant',
    title: 'Elephant',
    themeId: 'animals',
    emoji: '🐘',
    width: 1024,
    height: 1024,
    source: require('../../assets/pages/animals/elephant.png') as ImageSourcePropType,
  }),
  rasterPage({
    id: 'zebra',
    title: 'Zebra',
    themeId: 'animals',
    emoji: '🦓',
    width: 1024,
    height: 1024,
    source: require('../../assets/pages/animals/zebra.png') as ImageSourcePropType,
  }),
  rasterPage({
    id: 'monkey',
    title: 'Monkey',
    themeId: 'animals',
    emoji: '🐵',
    width: 1024,
    height: 1024,
    source: require('../../assets/pages/animals/monkey.png') as ImageSourcePropType,
  }),
];

/**
 * Women & Flowers theme — detailed adult-style portrait line art (1024×1024).
 * 20 numbered pages "Beauty 1" through "Beauty 20".
 */
const BEAUTY_SOURCES: Record<number, ImageSourcePropType> = {
  1: require('../../assets/pages/women-flowers/beauty-01.png') as ImageSourcePropType,
  2: require('../../assets/pages/women-flowers/beauty-02.png') as ImageSourcePropType,
  3: require('../../assets/pages/women-flowers/beauty-03.png') as ImageSourcePropType,
  4: require('../../assets/pages/women-flowers/beauty-04.png') as ImageSourcePropType,
  5: require('../../assets/pages/women-flowers/beauty-05.png') as ImageSourcePropType,
  6: require('../../assets/pages/women-flowers/beauty-06.png') as ImageSourcePropType,
  7: require('../../assets/pages/women-flowers/beauty-07.png') as ImageSourcePropType,
  8: require('../../assets/pages/women-flowers/beauty-08.png') as ImageSourcePropType,
  9: require('../../assets/pages/women-flowers/beauty-09.png') as ImageSourcePropType,
  10: require('../../assets/pages/women-flowers/beauty-10.png') as ImageSourcePropType,
  11: require('../../assets/pages/women-flowers/beauty-11.png') as ImageSourcePropType,
  12: require('../../assets/pages/women-flowers/beauty-12.png') as ImageSourcePropType,
  13: require('../../assets/pages/women-flowers/beauty-13.png') as ImageSourcePropType,
  14: require('../../assets/pages/women-flowers/beauty-14.png') as ImageSourcePropType,
  15: require('../../assets/pages/women-flowers/beauty-15.png') as ImageSourcePropType,
  16: require('../../assets/pages/women-flowers/beauty-16.png') as ImageSourcePropType,
  17: require('../../assets/pages/women-flowers/beauty-17.png') as ImageSourcePropType,
  18: require('../../assets/pages/women-flowers/beauty-18.png') as ImageSourcePropType,
  19: require('../../assets/pages/women-flowers/beauty-19.png') as ImageSourcePropType,
  20: require('../../assets/pages/women-flowers/beauty-20.png') as ImageSourcePropType,
};

export const BEAUTY_RASTER_PAGES: RasterPageDefinition[] = Array.from(
  { length: 20 },
  (_, i) => {
    const n = i + 1;
    const id = `beauty-${String(n).padStart(2, '0')}`;
    return rasterPage({
      id,
      title: `Beauty ${n}`,
      themeId: 'women-flowers',
      emoji: '🌸',
      width: 1024,
      height: 1024,
      source: BEAUTY_SOURCES[n],
    });
  },
);
