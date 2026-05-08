import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = '@pop-color/settings/v1';

export interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onboardingSeen: boolean;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  setSoundEnabled: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
  markOnboardingSeen: () => void;
}

interface PersistedSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onboardingSeen: boolean;
}

const persist = async (settings: PersistedSettings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('[settingsStore] failed to persist settings', error);
  }
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: true,
  hapticsEnabled: true,
  onboardingSeen: false,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Partial<PersistedSettings> = JSON.parse(raw);
        set({
          soundEnabled: parsed.soundEnabled ?? true,
          hapticsEnabled: parsed.hapticsEnabled ?? true,
          onboardingSeen: parsed.onboardingSeen ?? false,
          hydrated: true,
        });
      } else {
        set({ hydrated: true });
      }
    } catch (error) {
      console.warn('[settingsStore] failed to hydrate', error);
      set({ hydrated: true });
    }
  },

  setSoundEnabled: (value) => {
    set({ soundEnabled: value });
    const { hapticsEnabled, onboardingSeen } = get();
    void persist({ soundEnabled: value, hapticsEnabled, onboardingSeen });
  },

  setHapticsEnabled: (value) => {
    set({ hapticsEnabled: value });
    const { soundEnabled, onboardingSeen } = get();
    void persist({ soundEnabled, hapticsEnabled: value, onboardingSeen });
  },

  markOnboardingSeen: () => {
    set({ onboardingSeen: true });
    const { soundEnabled, hapticsEnabled } = get();
    void persist({ soundEnabled, hapticsEnabled, onboardingSeen: true });
  },
}));
