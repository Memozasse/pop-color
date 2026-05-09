import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import type { Artwork, RegionColors } from '@/data/types';

const STORAGE_KEY = '@pop-color/artworks/v1';

export interface ArtworksState {
  artworks: Artwork[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  saveArtwork: (input: {
    id?: string;
    pageId: string;
    regionColors: RegionColors;
  }) => Promise<Artwork>;
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

export const useArtworksStore = create<ArtworksState>((set, get) => ({
  artworks: [],
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const artworks: Artwork[] = raw ? JSON.parse(raw) : [];
      set({ artworks, hydrated: true });
    } catch (error) {
      console.warn('[artworksStore] failed to hydrate artworks', error);
      set({ artworks: [], hydrated: true });
    }
  },

  saveArtwork: async ({ id, pageId, regionColors }) => {
    const now = Date.now();
    const existing = id ? get().artworks.find((a) => a.id === id) : undefined;
    const artwork: Artwork = existing
      ? { ...existing, regionColors: { ...regionColors }, updatedAt: now }
      : {
          id: id ?? generateId(),
          pageId,
          regionColors: { ...regionColors },
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
