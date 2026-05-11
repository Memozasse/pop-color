import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AudienceScreen } from '@/screens/AudienceScreen';
import { ColoringScreen } from '@/screens/ColoringScreen';
import { GalleryScreen } from '@/screens/GalleryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MyCreationsScreen } from '@/screens/MyCreationsScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { useAudienceStore } from '@/state/audienceStore';
import { useSettingsStore } from '@/state/settingsStore';
import { colors } from '@/theme';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const settingsHydrated = useSettingsStore((s) => s.hydrated);
  const audienceHydrated = useAudienceStore((s) => s.hydrated);

  // Defer mounting the navigator until persisted state has been read,
  // so the Welcome auto-route picks the right next screen.
  if (!settingsHydrated || !audienceHydrated) {
    return null;
  }

  // Welcome (splash) is always the initial route. It renders for ~4s while
  // the progress bar fills, then `WelcomeScreen` itself navigation.replaces
  // to either Audience (first launch — no audience saved yet) or Home
  // (returning user — audience already chosen).
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Audience"
          component={AudienceScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Coloring" component={ColoringScreen} />
        <Stack.Screen name="MyCreations" component={MyCreationsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
