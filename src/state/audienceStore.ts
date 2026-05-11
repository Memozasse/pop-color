import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = '@pop-color/audience/v1';

export type Audience = 'kids' | 'adults';

export interface AudienceState {
  /**
   * The currently-selected audience. `null` means the user has not yet
   * made a choice — Welcome should route them to the Audience picker
   * on the next launch.
   */
  audience: Audience | null;
  /** Whether we've finished reading the previous choice from AsyncStorage. */
  hydrated: boolean;

  hydrate: () => Promise<void>;
  setAudience: (audience: Audience) => void;
  clearAudience: () => void;
}

const persist = async (audience: Audience | null) => {
  try {
    if (audience === null) {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, audience);
    }
  } catch (error) {
    console.warn('[audienceStore] failed to persist audience', error);
  }
};

export const useAudienceStore = create<AudienceState>((set, get) => ({
  audience: null,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw === 'kids' || raw === 'adults') {
        set({ audience: raw, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch (error) {
      console.warn('[audienceStore] failed to hydrate', error);
      set({ hydrated: true });
    }
  },

  setAudience: (audience) => {
    set({ audience });
    void persist(audience);
  },

  clearAudience: () => {
    set({ audience: null });
    void persist(null);
  },
}));

/**
 * Theme IDs included for each audience. Themes not in either list will
 * be excluded from both audiences (which currently never happens —
 * every theme belongs to exactly one audience).
 */
export const AUDIENCE_THEMES: Record<Audience, string[]> = {
  kids: ['animals', 'fruits', 'vehicles', 'shapes'],
  adults: ['women-flowers'],
};
