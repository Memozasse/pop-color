import type { ComponentType } from 'react';

export type RegionColors = Record<string, string>;

export interface PageRenderProps {
  regionColors: RegionColors;
  onRegionPress?: (regionId: string) => void;
}

export interface PageDefinition {
  id: string;
  title: string;
  themeId: string;
  emoji: string;
  width: number;
  height: number;
  regions: string[];
  Component: ComponentType<PageRenderProps>;
}

export interface ThemeGroup {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
  pageIds: string[];
}

export interface Artwork {
  id: string;
  pageId: string;
  regionColors: RegionColors;
  createdAt: number;
  updatedAt: number;
}
