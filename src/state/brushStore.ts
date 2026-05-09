import { create } from 'zustand';

import { DEFAULT_COLOR } from '@/data/palettes';
import type { Stroke, StrokePoint } from '@/data/types';

const HISTORY_LIMIT = 80;

export const BRUSH_SIZES = {
  small: 8,
  medium: 18,
  large: 32,
} as const;

export type BrushSizeKey = keyof typeof BRUSH_SIZES;

export interface BrushState {
  pageId: string | null;
  activeColor: string;
  brushSize: number;
  isErasing: boolean;
  stayInside: boolean;
  strokes: Stroke[];
  redoStack: Stroke[];

  startPage: (pageId: string, initialStrokes?: Stroke[]) => void;
  clearPage: () => void;
  setActiveColor: (hex: string) => void;
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
}): Stroke => ({
  id: generateStrokeId(),
  color: input.color,
  size: input.size,
  mode: input.mode,
  regionId: input.regionId,
  points: input.points,
});

const cap = (arr: Stroke[]): Stroke[] =>
  arr.length > HISTORY_LIMIT ? arr.slice(arr.length - HISTORY_LIMIT) : arr;

export const useBrushStore = create<BrushState>((set, get) => ({
  pageId: null,
  activeColor: DEFAULT_COLOR,
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

  setActiveColor: (hex) => set({ activeColor: hex, isErasing: false }),
  setBrushSize: (size) => set({ brushSize: size }),
  setIsErasing: (erasing) => set({ isErasing: erasing }),
  toggleEraser: () => set((s) => ({ isErasing: !s.isErasing })),
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
