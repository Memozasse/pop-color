import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useSettingsStore } from '@/state/settingsStore';

let popSound: Audio.Sound | null = null;
let loading: Promise<void> | null = null;

const ensureSound = async (): Promise<void> => {
  if (popSound) return;
  if (loading) return loading;
  loading = (async () => {
    try {
      // Use a remote tiny pop sound. Falls back silently if it can't load.
      const { sound } = await Audio.Sound.createAsync(
        // Mixkit: free CC0 short pop sfx
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2882/2882-preview.mp3' },
        { volume: 0.45 },
      );
      popSound = sound;
    } catch (error) {
      console.warn('[sound] failed to load pop sound', error);
      popSound = null;
    } finally {
      loading = null;
    }
  })();
  return loading;
};

export const playPop = async (): Promise<void> => {
  const { soundEnabled, hapticsEnabled } = useSettingsStore.getState();

  if (hapticsEnabled && Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      /* ignore */
    });
  }

  if (!soundEnabled) return;

  try {
    await ensureSound();
    if (!popSound) return;
    await popSound.replayAsync();
  } catch (error) {
    console.warn('[sound] failed to play pop', error);
  }
};

export const unloadSounds = async (): Promise<void> => {
  if (popSound) {
    try {
      await popSound.unloadAsync();
    } catch {
      /* ignore */
    }
    popSound = null;
  }
};
