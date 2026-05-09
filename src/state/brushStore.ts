import { create } from 'zustand';

import { DEFAULT_BRUSH_ID, getBrush } from '@/data/brushes';
import { DEFAULT_COLOR, DEFAULT_PALETTE_ID } from '@/data/palettes';
import type { Stroke, StrokePoint } from '@/data/types';

const HISTORY_LIMIT = 80;
const RECENT_COLORS_LIMIT = 5;

export const BRUSH_SIZES = {
  small: 8,
  medium: 18,
  large: 32,
} as const;

export type BrushSizeKey = keyof typeof BRUSH_SIZES;

export interface BrushState {
  pageId: string | null;
  /** Selected brush registry id (e.g. 'brush', 'pencil', 'spray'). */
  activeBrushId: string;
  /** Selected palette id for the bottom-row swatches. */
  paletteId: string;
  /** Active swatch colour (the colour the brush will paint with). */
  activeColor: string;
  /**
   * Tint slider position: 0 = pure white (lightest), 0.5 = pure activeColor,
   * 1 = pure black (darkest). Used by `getEffectiveColor` to mix `activeColor`
   * toward white or black before stroke render. Saved per stroke.
   */
  tint: number;
  /** Multiplier on the brush's baseSize (0.4..2.0). */
  sizeMultiplier: number;
  /** Eyedropper mode — when true, the next canvas tap samples a pixel. */
  eyedropperActive: boolean;
  /** Most-recently-used colours, newest first (deduped). */
  recentColors: string[];
  /** Legacy: kept so older callers still work (eraser is now a brush). */
  brushSize: number;
  isErasing: boolean;
  stayInside: boolean;
  strokes: Stroke[];
  redoStack: Stroke[];

  startPage: (pageId: string, initialStrokes?: Stroke[]) => void;
  clearPage: () => void;
  setActiveBrushId: (id: string) => void;
  setPaletteId: (id: string) => void;
  setActiveColor: (hex: string) => void;
  setTint: (tint: number) => void;
  setSizeMultiplier: (mult: number) => void;
  setEyedropperActive: (on: boolean) => void;
  setBrushSize: (size: number) => void;
  setIsErasing: (erasing: boolean) => void;
  toggleEraser: () => void;
  setStayInside: (on: boolean) => void;
  toggleStayInside: () => void;
  pushStroke: (stroke: Stroke) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const generateStrokeId = () =>
  `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const createStroke = (input: {
  color: string;
  size: number;
  mode: 'draw' | 'erase';
  regionId: string | null;
  points: StrokePoint[];
  brushTypeId?: string;
  opacity?: number;
}): Stroke => ({
  id: generateStrokeId(),
  color: input.color,
  size: input.size,
  mode: input.mode,
  regionId: input.regionId,
  points: input.points,
  brushTypeId: input.brushTypeId,
  opacity: input.opacity,
});

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

const toHex = (r: number, g: number, b: number): string => {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const h = (clamp(r) << 16) | (clamp(g) << 8) | clamp(b);
  return `#${h.toString(16).padStart(6, '0').toUpperCase()}`;
};

/**
 * Mix `hex` toward white (when t < 0.5) or black (when t > 0.5). t = 0.5
 * returns the hex unchanged. Used to apply the tint slider to the active
 * colour before painting.
 */
export const applyTint = (hex: string, t: number): string => {
  const c = parseHex(hex);
  if (!c) return hex;
  const clamped = Math.max(0, Math.min(1, t));
  if (clamped < 0.5) {
    // Mix toward white. amt: 0 = full white, 1 = original.
    const amt = clamped * 2;
    return toHex(
      255 - (255 - c.r) * amt,
      255 - (255 - c.g) * amt,
      255 - (255 - c.b) * amt,
    );
  }
  // Mix toward black. amt: 0 = original, 1 = full black.
  const amt = (clamped - 0.5) * 2;
  return toHex(c.r * (1 - amt), c.g * (1 - amt), c.b * (1 - amt));
};

const dedupeColors = (
  next: string,
  existing: string[],
  cap: number,
): string[] => {
  const upper = next.toUpperCase();
  const filtered = existing.filter((c) => c.toUpperCase() !== upper);
  return [next, ...filtered].slice(0, cap);
};

const cap = (arr: Stroke[]): Stroke[] =>
  arr.length > HISTORY_LIMIT ? arr.slice(arr.length - HISTORY_LIMIT) : arr;

export const useBrushStore = create<BrushState>((set, get) => ({
  pageId: null,
  activeBrushId: DEFAULT_BRUSH_ID,
  paletteId: DEFAULT_PALETTE_ID,
  activeColor: DEFAULT_COLOR,
  tint: 0.5,
  sizeMultiplier: 1,
  eyedropperActive: false,
  recentColors: [DEFAULT_COLOR],
  brushSize: BRUSH_SIZES.medium,
  isErasing: false,
  stayInside: true,
  strokes: [],
  redoStack: [],

  startPage: (pageId, initialStrokes = []) =>
    set({
      pageId,
      strokes: [...initialStrokes],
      redoStack: [],
    }),

  clearPage: () =>
    set({
      pageId: null,
      strokes: [],
      redoStack: [],
    }),

  setActiveBrushId: (id) => {
    const brush = getBrush(id);
    if (!brush) return;
    set({
      activeBrushId: id,
      isErasing: !!brush.isEraser,
      // Turning on the eyedropper while a brush is active is fine; it stays
      // until the user samples or taps it off explicitly.
    });
  },
  setPaletteId: (id) => set({ paletteId: id }),
  setActiveColor: (hex) =>
    set((s) => ({
      activeColor: hex,
      isErasing: false,
      eyedropperActive: false,
      recentColors: dedupeColors(hex, s.recentColors, RECENT_COLORS_LIMIT),
      // Switching to a paint colour from the eraser should re-select a paint
      // brush so the next stroke isn't silently erasing.
      activeBrushId:
        s.activeBrushId === 'eraser' ? DEFAULT_BRUSH_ID : s.activeBrushId,
    })),
  setTint: (tint) => set({ tint: Math.max(0, Math.min(1, tint)) }),
  setSizeMultiplier: (mult) =>
    set({ sizeMultiplier: Math.max(0.4, Math.min(2.0, mult)) }),
  setEyedropperActive: (on) => set({ eyedropperActive: on }),
  setBrushSize: (size) => set({ brushSize: size }),
  setIsErasing: (erasing) =>
    set({
      isErasing: erasing,
      activeBrushId: erasing ? 'eraser' : DEFAULT_BRUSH_ID,
    }),
  toggleEraser: () =>
    set((s) => ({
      isErasing: !s.isErasing,
      activeBrushId: s.isErasing ? DEFAULT_BRUSH_ID : 'eraser',
    })),
  setStayInside: (on) => set({ stayInside: on }),
  toggleStayInside: () => set((s) => ({ stayInside: !s.stayInside })),

  pushStroke: (stroke) => {
    const { strokes } = get();
    set({
      strokes: cap([...strokes, stroke]),
      redoStack: [],
    });
  },

  undo: () => {
    const { strokes, redoStack } = get();
    if (strokes.length === 0) return;
    const popped = strokes[strokes.length - 1];
    set({
      strokes: strokes.slice(0, -1),
      redoStack: cap([...redoStack, popped]),
    });
  },

  redo: () => {
    const { strokes, redoStack } = get();
    if (redoStack.length === 0) return;
    const popped = redoStack[redoStack.length - 1];
    set({
      strokes: cap([...strokes, popped]),
      redoStack: redoStack.slice(0, -1),
    });
  },

  reset: () => {
    const { strokes } = get();
    if (strokes.length === 0) return;
    // Push current strokes onto redo so reset is undoable.
    set({
      strokes: [],
      redoStack: cap([...get().redoStack, ...strokes]),
    });
  },

  canUndo: () => get().strokes.length > 0,
  canRedo: () => get().redoStack.length > 0,
}));
