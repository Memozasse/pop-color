import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { RefObject } from 'react';
import { Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';

interface CaptureOptions {
  format?: 'png' | 'jpg';
  quality?: number;
}

export const captureArtwork = async (
  ref: RefObject<unknown>,
  options: CaptureOptions = {},
): Promise<string | null> => {
  if (!ref.current) return null;
  try {
    const uri = await captureRef(ref as RefObject<View>, {
      format: options.format ?? 'png',
      quality: options.quality ?? 1,
      result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
    });
    return uri;
  } catch (error) {
    console.warn('[saveArtwork] capture failed', error);
    return null;
  }
};

export const shareArtwork = async (uri: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      // Web fallback: open in a new tab so user can save / share manually.
      if (typeof window !== 'undefined' && uri.startsWith('data:')) {
        window.open(uri, '_blank');
        return true;
      }
      return false;
    }
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return false;
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: 'Share your masterpiece',
    });
    return true;
  } catch (error) {
    console.warn('[saveArtwork] share failed', error);
    return false;
  }
};

export const persistArtworkFile = async (sourceUri: string, name: string): Promise<string | null> => {
  if (Platform.OS === 'web') return sourceUri;
  try {
    const dir = `${FileSystem.documentDirectory}artworks/`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    const target = `${dir}${name}.png`;
    await FileSystem.copyAsync({ from: sourceUri, to: target });
    return target;
  } catch (error) {
    console.warn('[saveArtwork] persist failed', error);
    return null;
  }
};

// Avoid pulling RN types into utils file — we only need a structural type for ref.
type View = unknown;
