import AsyncStorage from '@react-native-async-storage/async-storage';

import { useArtworksStore } from '@/state/artworksStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const RED = '#FF0000';
const BLUE = '#0000FF';

describe('artworksStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useArtworksStore.setState({ artworks: [], hydrated: false });
  });

  it('saves a new artwork with generated id', async () => {
    const artwork = await useArtworksStore.getState().saveArtwork({
      pageId: 'cat',
      regionColors: { face: RED },
    });
    expect(artwork.id).toMatch(/^aw_/);
    expect(artwork.pageId).toBe('cat');
    expect(artwork.regionColors).toEqual({ face: RED });
    expect(artwork.createdAt).toBeGreaterThan(0);
    expect(useArtworksStore.getState().artworks).toHaveLength(1);
  });

  it('updates an existing artwork by id', async () => {
    const first = await useArtworksStore.getState().saveArtwork({
      pageId: 'cat',
      regionColors: { face: RED },
    });
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = await useArtworksStore.getState().saveArtwork({
      id: first.id,
      pageId: 'cat',
      regionColors: { face: BLUE, leftEar: RED },
    });
    expect(second.id).toBe(first.id);
    expect(second.regionColors).toEqual({ face: BLUE, leftEar: RED });
    expect(second.updatedAt).toBeGreaterThanOrEqual(first.updatedAt);
    expect(useArtworksStore.getState().artworks).toHaveLength(1);
  });

  it('deletes an artwork', async () => {
    const a = await useArtworksStore.getState().saveArtwork({
      pageId: 'cat',
      regionColors: { face: RED },
    });
    await useArtworksStore.getState().saveArtwork({
      pageId: 'dog',
      regionColors: { face: BLUE },
    });
    await useArtworksStore.getState().deleteArtwork(a.id);
    expect(useArtworksStore.getState().artworks).toHaveLength(1);
    expect(useArtworksStore.getState().artworks[0].pageId).toBe('dog');
  });

  it('hydrates artworks from storage', async () => {
    const seed = [
      {
        id: 'aw_test_1',
        pageId: 'cat',
        regionColors: { face: RED },
        createdAt: 1,
        updatedAt: 1,
      },
    ];
    await AsyncStorage.setItem('@pop-color/artworks/v1', JSON.stringify(seed));
    await useArtworksStore.getState().hydrate();
    expect(useArtworksStore.getState().hydrated).toBe(true);
    expect(useArtworksStore.getState().artworks).toEqual(seed);
  });

  it('hydrate is idempotent', async () => {
    await useArtworksStore.getState().saveArtwork({
      pageId: 'cat',
      regionColors: { face: RED },
    });
    await useArtworksStore.getState().hydrate();
    const after = useArtworksStore.getState().artworks;
    await useArtworksStore.getState().hydrate();
    expect(useArtworksStore.getState().artworks).toBe(after);
  });

  it('returns the most recent artwork for a page', async () => {
    const first = await useArtworksStore.getState().saveArtwork({
      pageId: 'cat',
      regionColors: { face: RED },
    });
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = await useArtworksStore.getState().saveArtwork({
      pageId: 'cat',
      regionColors: { face: BLUE },
    });
    const found = useArtworksStore.getState().getArtworkForPage('cat');
    expect(found?.id).toBe(second.id);
    expect(found?.id).not.toBe(first.id);
  });

  it('getArtwork returns undefined for unknown id', () => {
    expect(useArtworksStore.getState().getArtwork('does-not-exist')).toBeUndefined();
  });
});
