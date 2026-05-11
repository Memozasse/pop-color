import {
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
  useFonts,
} from '@expo-google-fonts/quicksand';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation/RootNavigator';
import { useArtworksStore } from '@/state/artworksStore';
import { useAudienceStore } from '@/state/audienceStore';
import { useSettingsStore } from '@/state/settingsStore';

export default function App() {
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateArtworks = useArtworksStore((s) => s.hydrate);
  const hydrateAudience = useAudienceStore((s) => s.hydrate);

  // Quicksand is the single brand font for every screen. Until the
  // weights load we render `null` so we never flash the system font.
  const [fontsLoaded] = useFonts({
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    void hydrateSettings();
    void hydrateArtworks();
    void hydrateAudience();
  }, [hydrateSettings, hydrateArtworks, hydrateAudience]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
