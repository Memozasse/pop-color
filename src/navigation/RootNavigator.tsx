import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ColoringScreen } from '@/screens/ColoringScreen';
import { GalleryScreen } from '@/screens/GalleryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MyCreationsScreen } from '@/screens/MyCreationsScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { useSettingsStore } from '@/state/settingsStore';
import { colors } from '@/theme';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const onboardingSeen = useSettingsStore((s) => s.onboardingSeen);
  const hydrated = useSettingsStore((s) => s.hydrated);
  if (!hydrated) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={onboardingSeen ? 'Home' : 'Onboarding'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
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
