import { Skia, type SkPath } from '@shopify/react-native-skia';

import type { RegionGeometry, RegionShape } from '@/data/types';

/**
 * Convert a serializable RegionShape (the data living in regionGeometryRegistry)
 * into a Skia path for clipping + hit-testing on the brush canvas.
 *
 * Returns `null` if Skia rejects the input — callers should treat the region
 * as non-clippable and fall back to "color everywhere" behaviour for it.
 */
export const regionToSkPath = (shape: RegionShape): SkPath | null => {
  switch (shape.type) {
    case 'circle': {
      const path = Skia.Path.Make();
      path.addCircle(shape.cx, shape.cy, shape.r);
      return path;
    }
    case 'ellipse': {
      const path = Skia.Path.Make();
      const rect = Skia.XYWHRect(
        shape.cx - shape.rx,
        shape.cy - shape.ry,
        shape.rx * 2,
        shape.ry * 2,
      );
      path.addOval(rect);
      return path;
    }
    case 'rect': {
      const path = Skia.Path.Make();
      const rect = Skia.XYWHRect(shape.x, shape.y, shape.width, shape.height);
      if (shape.rx && shape.rx > 0) {
        const rrect = Skia.RRectXY(rect, shape.rx, shape.rx);
        path.addRRect(rrect);
      } else {
        path.addRect(rect);
      }
      return path;
    }
    case 'polygon': {
      if (shape.points.length === 0) return null;
      const path = Skia.Path.Make();
      const [firstX, firstY] = shape.points[0];
      path.moveTo(firstX, firstY);
      for (let i = 1; i < shape.points.length; i += 1) {
        const [x, y] = shape.points[i];
        path.lineTo(x, y);
      }
      path.close();
      return path;
    }
    case 'path': {
      const parsed = Skia.Path.MakeFromSVGString(shape.d);
      return parsed ?? null;
    }
    default:
      return null;
  }
};

export interface CompiledRegion {
  id: string;
  path: SkPath;
}

/**
 * Build the per-region SkPath table for a page. Order matches the geometry
 * map's iteration order (which mirrors the order each page draws regions).
 *
 * Background-style regions (full canvas) are still included so they can be
 * used as a "color anywhere" fallback when stay-inside-lines is enabled but
 * the user isn't pointing at any specific feature.
 */
export const compileRegionGeometry = (
  geometry: RegionGeometry,
): CompiledRegion[] => {
  const out: CompiledRegion[] = [];
  for (const id of Object.keys(geometry)) {
    const path = regionToSkPath(geometry[id]);
    if (path) out.push({ id, path });
  }
  return out;
};

/**
 * Topmost-first hit-test. Pages draw earlier regions first (e.g. background
 * → body → details), so the regions closest to the front of the visual stack
 * sit at the END of the geometry array. Iterate in reverse so a tap on an
 * eye doesn't match the face underneath.
 *
 * Rect/round-rect regions are excluded if they look like full-canvas backdrops
 * — those would otherwise swallow every touch.
 */
export const findRegionAt = (
  regions: CompiledRegion[],
  geometry: RegionGeometry,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number,
): string | null => {
  for (let i = regions.length - 1; i >= 0; i -= 1) {
    const { id, path } = regions[i];
    const shape = geometry[id];
    if (isFullCanvasBackdrop(shape, canvasWidth, canvasHeight)) continue;
    try {
      if (path.contains(x, y)) return id;
    } catch {
      // Skia.contains can throw on degenerate paths — skip.
    }
  }
  // Fall back to a backdrop region if there is one (so "color everywhere" mode
  // still has something to clip to when `stayInside` is on but the user is in
  // empty canvas space).
  for (let i = 0; i < regions.length; i += 1) {
    const { id } = regions[i];
    const shape = geometry[id];
    if (isFullCanvasBackdrop(shape, canvasWidth, canvasHeight)) return id;
  }
  return null;
};

const isFullCanvasBackdrop = (
  shape: RegionShape,
  width: number,
  height: number,
): boolean => {
  if (shape.type === 'path') {
    // Common pattern in pages: "M0 0 H400 V400 H0 Z" — only treat as a
    // backdrop when the captured H/V values actually span the full canvas.
    // Otherwise partial-canvas paths (e.g. the boat page's `sky` covering
    // only the top 65% of the canvas) get misclassified and skipped during
    // hit-testing.
    const d = shape.d.replace(/\s+/g, ' ').trim();
    const m = d.match(/^M\s*0\s*0\s*H\s*(\d+)\s*V\s*(\d+)\s*H\s*0\s*Z?$/i);
    return !!m && Number(m[1]) >= width && Number(m[2]) >= height;
  }
  if (shape.type === 'rect') {
    return (
      shape.x === 0 &&
      shape.y === 0 &&
      shape.width === width &&
      shape.height === height
    );
  }
  return false;
};
