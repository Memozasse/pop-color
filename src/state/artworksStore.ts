import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import type { Artwork, RegionColors, Stroke } from '@/data/types';

const STORAGE_KEY = '@pop-color/artworks/v1';

export interface SaveArtworkInput {
  id?: string;
  pageId: string;
  /** V2 stroke-based painting data. Required for new saves. */
  strokes?: Stroke[];
  /** Legacy V1 region-fill colors. Optional; kept so old saves still hydrate. */
  regionColors?: RegionColors;
}

export interface ArtworksState {
  artworks: Artwork[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  saveArtwork: (input: SaveArtworkInput) => Promise<Artwork>;
  deleteArtwork: (id: string) => Promise<void>;
  getArtwork: (id: string) => Artwork | undefined;
  getArtworkForPage: (pageId: string) => Artwork | undefined;
}

const persist = async (artworks: Artwork[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
  } catch (error) {
    console.warn('[artworksStore] failed to persist artworks', error);
  }
};

const generateId = () =>
  `aw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** Old V1 entries persisted only `regionColors`; default `strokes` to `[]`. */
const normalize = (raw: Artwork & { strokes?: Stroke[] }): Artwork => ({
  ...raw,
  strokes: raw.strokes ?? [],
});

export const useArtworksStore = create<ArtworksState>((set, get) => ({
  artworks: [],
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: Artwork[] = raw ? JSON.parse(raw) : [];
      const artworks = parsed.map(normalize);
      set({ artworks, hydrated: true });
    } catch (error) {
      console.warn('[artworksStore] failed to hydrate artworks', error);
      set({ artworks: [], hydrated: true });
    }
  },

  saveArtwork: async ({ id, pageId, strokes, regionColors }) => {
    const now = Date.now();
    const existing = id ? get().artworks.find((a) => a.id === id) : undefined;
    const nextStrokes = strokes ? [...strokes] : (existing?.strokes ?? []);
    const nextRegionColors = regionColors
      ? { ...regionColors }
      : existing?.regionColors;
    const artwork: Artwork = existing
      ? {
          ...existing,
          strokes: nextStrokes,
          regionColors: nextRegionColors,
          updatedAt: now,
        }
      : {
          id: id ?? generateId(),
          pageId,
          strokes: nextStrokes,
          regionColors: nextRegionColors,
          createdAt: now,
          updatedAt: now,
        };
    const others = get().artworks.filter((a) => a.id !== artwork.id);
    const next = [artwork, ...others].sort((a, b) => b.updatedAt - a.updatedAt);
    set({ artworks: next });
    await persist(next);
    return artwork;
  },

  deleteArtwork: async (id) => {
    const next = get().artworks.filter((a) => a.id !== id);
    set({ artworks: next });
    await persist(next);
  },

  getArtwork: (id) => get().artworks.find((a) => a.id === id),

  getArtworkForPage: (pageId) =>
    get()
      .artworks.filter((a) => a.pageId === pageId)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0],
}));
