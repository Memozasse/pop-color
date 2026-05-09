// Shared helpers for rendering brush strokes in both the live coloring canvas
// (Skia, full-resolution) and the saved-artwork thumbnails (SVG, downscaled).

import type { BrushConfig } from '@/data/brushes';
import type { Stroke, StrokePoint } from '@/data/types';

/** A single stamp dot to render along a 'stamp' brush stroke. */
export interface Stamp {
  /** Logical x,y in page coordinates. */
  x: number;
  y: number;
  /** Per-stamp alpha 0..1 (multiplied by brush opacity at draw time). */
  alpha: number;
  /** Stamp diameter in logical px. */
  diameter: number;
}

// ---- Deterministic RNG ----------------------------------------------------
// We need stamp positions for a given stroke to be stable across renders so
// the user doesn't see them re-shuffle every frame while painting.

const hashString = (s: string): number => {
  // FNV-1a 32-bit hash
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 0x1_0000_0000;
  };
};

const segLen = (a: StrokePoint, b: StrokePoint): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Deterministically generate stamp positions for a 'stamp'-kind brush stroke
 * (Spray / Airbrush / Splatter). Stamps are seeded by stroke.id so they stay
 * fixed across renders.
 */
export const generateStamps = (
  stroke: Stroke,
  brush: BrushConfig,
): Stamp[] => {
  if (brush.kind !== 'stamp') return [];
  const radius = brush.baseSize / 2;
  const density = brush.stampDensity ?? 0.3;
  const jitter = brush.stampJitter ?? 1;
  const minAlpha = brush.stampMinAlpha ?? 0.7;
  const maxAlpha = brush.stampMaxAlpha ?? 1;
  const minScale = brush.stampMinScale ?? 0.2;
  const maxScale = brush.stampMaxScale ?? 0.4;
  const rng = mulberry32(hashString(stroke.id));

  const stamps: Stamp[] = [];
  // For each segment, drop stamps at intervals.
  for (let i = 1; i < stroke.points.length; i += 1) {
    const a = stroke.points[i - 1];
    const b = stroke.points[i];
    const len = segLen(a, b);
    if (len === 0) continue;
    const count = Math.max(1, Math.floor(len * density));
    for (let k = 0; k < count; k += 1) {
      const t = (k + 0.5) / count;
      const cx = a.x + (b.x - a.x) * t;
      const cy = a.y + (b.y - a.y) * t;
      const ang = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * radius * jitter;
      stamps.push({
        x: cx + Math.cos(ang) * r,
        y: cy + Math.sin(ang) * r,
        alpha: minAlpha + rng() * (maxAlpha - minAlpha),
        diameter: brush.baseSize * (minScale + rng() * (maxScale - minScale)),
      });
    }
  }
  // For single-point strokes (taps), still spawn a small burst.
  if (stamps.length === 0 && stroke.points.length > 0) {
    const p = stroke.points[0];
    for (let k = 0; k < 12; k += 1) {
      const ang = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * radius * jitter;
      stamps.push({
        x: p.x + Math.cos(ang) * r,
        y: p.y + Math.sin(ang) * r,
        alpha: minAlpha + rng() * (maxAlpha - minAlpha),
        diameter: brush.baseSize * (minScale + rng() * (maxScale - minScale)),
      });
    }
  }
  return stamps;
};

// ---- Color / tint ---------------------------------------------------------

const HEX = /^#?([0-9a-f]{6})$/i;

const parseHex = (hex: string): { r: number; g: number; b: number } | null => {
  const m = HEX.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: n & 0xff,
  };
};

/** Distance squared between two points. */
const dist2 = (
  a: { x: number; y: number },
  b: { x: number; y: number },
): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

/**
 * Sample the colour underneath a logical point on the page. Walks the strokes
 * top-down (most recent first) and returns the colour of the first stroke
 * that contains the point within its half-width radius. Falls back to white
 * (paper) if no stroke is touched.
 */
export const sampleColorAt = (
  point: { x: number; y: number },
  strokes: Stroke[],
  paperColor: string,
): string => {
  for (let i = strokes.length - 1; i >= 0; i -= 1) {
    const s = strokes[i];
    const radius = (s.size || 1) / 2;
    const hitR2 = (radius + 1) * (radius + 1);
    for (const p of s.points) {
      if (dist2(point, p) <= hitR2) {
        return s.mode === 'erase' ? paperColor : s.color;
      }
    }
  }
  return paperColor;
};

export const isStrokeRenderable = (s: Stroke): boolean => s.points.length > 0;

/** Black/white check used by the tint slider thumb contrast. */
export const isLight = (hex: string): boolean => {
  const c = parseHex(hex);
  if (!c) return false;
  // Rec. 601 luma
  const y = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
  return y > 160;
};
