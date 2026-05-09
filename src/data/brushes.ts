// Brush registry — defines the 13 painting tools available in the toolbar
// and their visual behaviour. Each brush maps to one of three rendering
// "kinds":
//
//   - 'path'  — smooth Bézier path through the touch points; vary stroke
//               width, opacity, and an optional Skia BlurMaskFilter for soft
//               edges. Most brushes (Brush, Pencil, Marker, Watercolor, …)
//               are paths.
//   - 'stamp' — emit small "stamp" dots/splats at every touch sample, with
//               a deterministic per-stroke jitter. Used for Spray, Airbrush,
//               and Splatter so they look like real spray-paint scatters.
//   - 'fill'  — single-tap region fill, only on vector pages. The stroke
//               stores the regionId that was tapped; the renderer fills the
//               region's geometry path solid with the chosen colour.

export type BrushKind = 'path' | 'stamp' | 'fill';
export type StampShape = 'dot' | 'splatter';

export interface BrushConfig {
  id: string;
  label: string;
  emoji: string;
  kind: BrushKind;
  /** Logical-px stroke width (or stamp diameter for 'stamp' brushes). */
  baseSize: number;
  /** 0..1 alpha multiplier applied to every stroke render. */
  opacity: number;
  /** Skia mask blur radius in logical px. 0 = crisp edges. */
  blur: number;
  /** Stamps per logical-px of stroke length (only for kind='stamp'). */
  stampDensity?: number;
  /** Random offset radius as fraction of baseSize/2 (e.g. 0.5 = half radius). */
  stampJitter?: number;
  /** Min alpha per stamp (only for stamp). */
  stampMinAlpha?: number;
  /** Max alpha per stamp. */
  stampMaxAlpha?: number;
  /** Min stamp dot diameter as fraction of baseSize. */
  stampMinScale?: number;
  /** Max stamp dot diameter as fraction of baseSize. */
  stampMaxScale?: number;
  /** Visual style of stamp pellets. */
  stampShape?: StampShape;
  /** When true, brush is hidden on raster pages (e.g. Bucket needs regions). */
  vectorOnly?: boolean;
  /** When true, brush ignores the active colour and uses the paper colour. */
  isEraser?: boolean;
}

export const BRUSHES: BrushConfig[] = [
  {
    id: 'eraser',
    label: 'Eraser',
    emoji: '🧽',
    kind: 'path',
    baseSize: 28,
    opacity: 1,
    blur: 0,
    isEraser: true,
  },
  {
    id: 'bucket',
    label: 'Bucket',
    emoji: '🪣',
    kind: 'fill',
    baseSize: 0,
    opacity: 1,
    blur: 0,
    vectorOnly: true,
  },
  {
    id: 'brush',
    label: 'Brush',
    emoji: '🖌️',
    kind: 'path',
    baseSize: 18,
    opacity: 1,
    blur: 0,
  },
  {
    id: 'big-brush',
    label: 'Big Brush',
    emoji: '🎨',
    kind: 'path',
    baseSize: 44,
    opacity: 1,
    blur: 0,
  },
  {
    id: 'pencil',
    label: 'Pencil',
    emoji: '✏️',
    kind: 'path',
    baseSize: 4,
    opacity: 0.85,
    blur: 0,
  },
  {
    id: 'marker',
    label: 'Marker',
    emoji: '🖊️',
    kind: 'path',
    baseSize: 22,
    opacity: 0.95,
    blur: 0,
  },
  {
    id: 'tech-pen',
    label: 'Tech Pen',
    emoji: '🖋️',
    kind: 'path',
    baseSize: 3,
    opacity: 1,
    blur: 0,
  },
  {
    id: 'ball-pen',
    label: 'Ball Pen',
    emoji: '🖊',
    kind: 'path',
    baseSize: 4,
    opacity: 0.92,
    blur: 0,
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    emoji: '💧',
    kind: 'path',
    baseSize: 32,
    opacity: 0.42,
    blur: 4,
  },
  {
    id: 'airbrush',
    label: 'Airbrush',
    emoji: '💨',
    kind: 'stamp',
    baseSize: 32,
    opacity: 1,
    blur: 0,
    stampDensity: 0.28,
    stampJitter: 0.85,
    stampMinAlpha: 0.07,
    stampMaxAlpha: 0.14,
    stampMinScale: 0.18,
    stampMaxScale: 0.32,
    stampShape: 'dot',
  },
  {
    id: 'spray',
    label: 'Spray',
    emoji: '🥫',
    kind: 'stamp',
    baseSize: 36,
    opacity: 1,
    blur: 0,
    stampDensity: 0.45,
    stampJitter: 1.0,
    stampMinAlpha: 0.55,
    stampMaxAlpha: 1.0,
    stampMinScale: 0.06,
    stampMaxScale: 0.16,
    stampShape: 'dot',
  },
  {
    id: 'pastel',
    label: 'Pastel',
    emoji: '🖍️',
    kind: 'path',
    baseSize: 24,
    opacity: 0.7,
    blur: 1.2,
  },
  {
    id: 'splatter',
    label: 'Splatter',
    emoji: '💥',
    kind: 'stamp',
    baseSize: 28,
    opacity: 1,
    blur: 0,
    stampDensity: 0.06,
    stampJitter: 2.4,
    stampMinAlpha: 0.5,
    stampMaxAlpha: 1.0,
    stampMinScale: 0.08,
    stampMaxScale: 0.4,
    stampShape: 'splatter',
  },
];

const BRUSH_INDEX: Map<string, BrushConfig> = new Map(BRUSHES.map((b) => [b.id, b]));

export const getBrush = (id: string): BrushConfig | undefined => BRUSH_INDEX.get(id);

/** Default brush selected when the coloring screen mounts. */
export const DEFAULT_BRUSH_ID = 'brush';

/** Convenience lists for the brush-picker modal grid. */
export const BRUSH_PICKER_ORDER: string[] = [
  'eraser',
  'bucket',
  'brush',
  'big-brush',
  'pencil',
  'watercolor',
  'airbrush',
  'spray',
  'pastel',
  'splatter',
  'marker',
  'tech-pen',
  'ball-pen',
];

/** Quick-access tools that always show in the bottom toolbar (under the canvas). */
export const QUICK_ACCESS_BRUSH_IDS: string[] = [
  'eraser',
  'bucket',
  'brush',
  'pencil',
];
