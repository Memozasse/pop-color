import { create } from 'zustand';

import { DEFAULT_COLOR } from '@/data/palettes';
import type { RegionColors } from '@/data/types';

const HISTORY_LIMIT = 50;

export interface ColoringState {
  pageId: string | null;
  regionColors: RegionColors;
  activeColor: string;
  history: RegionColors[];
  future: RegionColors[];

  startPage: (pageId: string, initial?: RegionColors) => void;
  paintRegion: (regionId: string) => void;
  setActiveColor: (color: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  clearPage: () => void;
}

const pushHistory = (history: RegionColors[], snapshot: RegionColors): RegionColors[] => {
  const next = [...history, snapshot];
  if (next.length > HISTORY_LIMIT) {
    return next.slice(next.length - HISTORY_LIMIT);
  }
  return next;
};

export const useColoringStore = create<ColoringState>((set, get) => ({
  pageId: null,
  regionColors: {},
  activeColor: DEFAULT_COLOR,
  history: [],
  future: [],

  startPage: (pageId, initial = {}) =>
    set({
      pageId,
      regionColors: { ...initial },
      history: [],
      future: [],
    }),

  paintRegion: (regionId) => {
    const { regionColors, activeColor, history } = get();
    if (regionColors[regionId] === activeColor) {
      return;
    }
    set({
      history: pushHistory(history, regionColors),
      future: [],
      regionColors: { ...regionColors, [regionId]: activeColor },
    });
  },

  setActiveColor: (color) => set({ activeColor: color }),

  undo: () => {
    const { history, regionColors, future } = get();
    if (history.length === 0) {
      return;
    }
    const previous = history[history.length - 1];
    set({
      history: history.slice(0, -1),
      future: [regionColors, ...future],
      regionColors: previous,
    });
  },

  redo: () => {
    const { future, regionColors, history } = get();
    if (future.length === 0) {
      return;
    }
    const [next, ...rest] = future;
    set({
      future: rest,
      history: pushHistory(history, regionColors),
      regionColors: next,
    });
  },

  reset: () => {
    const { regionColors, history } = get();
    if (Object.keys(regionColors).length === 0) {
      return;
    }
    set({
      history: pushHistory(history, regionColors),
      future: [],
      regionColors: {},
    });
  },

  clearPage: () =>
    set({
      pageId: null,
      regionColors: {},
      history: [],
      future: [],
    }),
}));
