import type { ComponentType } from 'react';
import type { ImageSourcePropType } from 'react-native';

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

interface PageDefinitionBase {
  id: string;
  title: string;
  themeId: string;
  emoji: string;
  width: number;
  height: number;
}

/**
 * Vector pages render via an SVG `Component` that draws the outline (and, in
 * V1, fillable regions). They support stay-inside-lines clipping because
 * each region has named geometry in `regionGeometry`.
 */
export interface VectorPageDefinition extends PageDefinitionBase {
  kind: 'vector';
  regions: string[];
  regionGeometry: RegionGeometry;
  Component: ComponentType<PageRenderProps>;
}

/**
 * Raster pages render via an `Image` background (PNG/JPG line art). They do
 * NOT support stay-inside-lines because there are no named regions — the
 * brush paints freely over the whole canvas.
 */
export interface RasterPageDefinition extends PageDefinitionBase {
  kind: 'raster';
  source: ImageSourcePropType;
}

export type PageDefinition = VectorPageDefinition | RasterPageDefinition;

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
