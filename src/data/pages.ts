import { BUNNY_PAGE } from '@/pages/animals/bunny';
import { BUTTERFLY_PAGE } from '@/pages/animals/butterfly';
import { CAT_PAGE } from '@/pages/animals/cat';
import { DOG_PAGE } from '@/pages/animals/dog';
import { FISH_PAGE } from '@/pages/animals/fish';
import { APPLE_PAGE } from '@/pages/fruits/apple';
import { BANANA_PAGE } from '@/pages/fruits/banana';
import { PINEAPPLE_PAGE } from '@/pages/fruits/pineapple';
import { STRAWBERRY_PAGE } from '@/pages/fruits/strawberry';
import { WATERMELON_PAGE } from '@/pages/fruits/watermelon';
import { FLOWER_PAGE } from '@/pages/shapes/flower';
import { HEART_PAGE } from '@/pages/shapes/heart';
import { RAINBOW_PAGE } from '@/pages/shapes/rainbow';
import { STAR_PAGE } from '@/pages/shapes/star';
import { SUN_PAGE } from '@/pages/shapes/sun';
import { AIRPLANE_PAGE } from '@/pages/vehicles/airplane';
import { BOAT_PAGE } from '@/pages/vehicles/boat';
import { CAR_PAGE } from '@/pages/vehicles/car';
import { TRAIN_PAGE } from '@/pages/vehicles/train';
import { TRUCK_PAGE } from '@/pages/vehicles/truck';

import { ANIMAL_RASTER_PAGES, BEAUTY_RASTER_PAGES } from './rasterPages';
import { REGION_GEOMETRY } from './regionGeometryRegistry';
import type {
  PageDefinition,
  RegionGeometry,
  ThemeGroup,
  VectorPageDefinition,
} from './types';

const withGeometry = (
  page: Omit<VectorPageDefinition, 'regionGeometry' | 'kind'>,
): VectorPageDefinition => {
  const geometry: RegionGeometry | undefined = REGION_GEOMETRY[page.id];
  if (!geometry) {
    throw new Error(`[pages] missing region geometry for "${page.id}"`);
  }
  for (const id of page.regions) {
    if (!geometry[id]) {
      throw new Error(`[pages] region geometry for "${page.id}" is missing region "${id}"`);
    }
  }
  return { ...page, kind: 'vector', regionGeometry: geometry };
};

export const PAGES: PageDefinition[] = [
  // Animals — vector pages
  withGeometry(CAT_PAGE),
  withGeometry(DOG_PAGE),
  withGeometry(FISH_PAGE),
  withGeometry(BUTTERFLY_PAGE),
  withGeometry(BUNNY_PAGE),
  // Animals — raster pages (cute baby line art)
  ...ANIMAL_RASTER_PAGES,
  // Fruits
  withGeometry(APPLE_PAGE),
  withGeometry(BANANA_PAGE),
  withGeometry(STRAWBERRY_PAGE),
  withGeometry(WATERMELON_PAGE),
  withGeometry(PINEAPPLE_PAGE),
  // Vehicles
  withGeometry(CAR_PAGE),
  withGeometry(TRUCK_PAGE),
  withGeometry(BOAT_PAGE),
  withGeometry(AIRPLANE_PAGE),
  withGeometry(TRAIN_PAGE),
  // Shapes
  withGeometry(STAR_PAGE),
  withGeometry(HEART_PAGE),
  withGeometry(FLOWER_PAGE),
  withGeometry(SUN_PAGE),
  withGeometry(RAINBOW_PAGE),
  // Women & Flowers — adult-style raster pages
  ...BEAUTY_RASTER_PAGES,
];

const PAGE_INDEX: Map<string, PageDefinition> = new Map(PAGES.map((p) => [p.id, p]));

export const getPage = (id: string): PageDefinition | undefined => PAGE_INDEX.get(id);

export const THEMES: ThemeGroup[] = [
  {
    id: 'animals',
    title: 'Animals',
    emoji: '🐾',
    bgColor: '#FFE5B4',
    pageIds: [
      'cat',
      'dog',
      'fish',
      'butterfly',
      'bunny',
      ...ANIMAL_RASTER_PAGES.map((p) => p.id),
    ],
  },
  {
    id: 'fruits',
    title: 'Fruits',
    emoji: '🍓',
    bgColor: '#FFD6E5',
    pageIds: ['apple', 'banana', 'strawberry', 'watermelon', 'pineapple'],
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    emoji: '🚗',
    bgColor: '#BEE3F8',
    pageIds: ['car', 'truck', 'boat', 'airplane', 'train'],
  },
  {
    id: 'shapes',
    title: 'Shapes',
    emoji: '⭐',
    bgColor: '#D6C4FF',
    pageIds: ['star', 'heart', 'flower', 'sun', 'rainbow'],
  },
  {
    id: 'women-flowers',
    title: 'Women & Flowers',
    emoji: '🌸',
    bgColor: '#FCE4F0',
    pageIds: BEAUTY_RASTER_PAGES.map((p) => p.id),
  },
];

const THEME_INDEX: Map<string, ThemeGroup> = new Map(THEMES.map((t) => [t.id, t]));

export const getTheme = (id: string): ThemeGroup | undefined => THEME_INDEX.get(id);

export const getPagesForTheme = (themeId: string): PageDefinition[] => {
  const theme = getTheme(themeId);
  if (!theme) return [];
  return theme.pageIds.map((id) => PAGE_INDEX.get(id)).filter((p): p is PageDefinition => !!p);
};
