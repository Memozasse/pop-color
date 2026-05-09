import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation/RootNavigator';
import { useArtworksStore } from '@/state/artworksStore';
import { useSettingsStore } from '@/state/settingsStore';

export default function App() {
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateArtworks = useArtworksStore((s) => s.hydrate);

  useEffect(() => {
    void hydrateSettings();
    void hydrateArtworks();
  }, [hydrateSettings, hydrateArtworks]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
