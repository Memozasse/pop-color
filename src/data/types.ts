import type { ComponentType } from 'react';

export type RegionColors = Record<string, string>;

export interface PageRenderProps {
  regionColors: RegionColors;
  onRegionPress?: (regionId: string) => void;
}

export type RegionShape =
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx?: number }
  | { type: 'polygon'; points: [number, number][] }
  | { type: 'path'; d: string };

export type RegionGeometry = Record<string, RegionShape>;

export interface PageDefinition {
  id: string;
  title: string;
  themeId: string;
  emoji: string;
  width: number;
  height: number;
  regions: string[];
  regionGeometry: RegionGeometry;
  Component: ComponentType<PageRenderProps>;
}

export interface ThemeGroup {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
  pageIds: string[];
}

export interface StrokePoint {
  x: number;
  y: number;
}

export type StrokeMode = 'draw' | 'erase';

export interface Stroke {
  id: string;
  color: string;
  size: number;
  mode: StrokeMode;
  regionId: string | null;
  points: StrokePoint[];
}

export interface Artwork {
  id: string;
  pageId: string;
  strokes: Stroke[];
  /**
   * Legacy V1 region-fill colors. Kept so artworks saved by the v1 tap-to-fill
   * build can still be opened. New V2 artworks rely on `strokes` only.
   */
  regionColors?: RegionColors;
  createdAt: number;
  updatedAt: number;
}
