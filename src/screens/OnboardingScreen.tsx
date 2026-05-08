import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import type { RootStackParamList } from '@/navigation/types';
import { useSettingsStore } from '@/state/settingsStore';
import { colors, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const HIGHLIGHTS = [
  { emoji: '👆', text: 'Pick a color, then tap a part of the picture' },
  { emoji: '🌈', text: 'Choose from bright and pastel colors' },
  { emoji: '💾', text: 'Save your art to revisit and finish later' },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const markOnboardingSeen = useSettingsStore((s) => s.markOnboardingSeen);

  const handleStart = () => {
    markOnboardingSeen();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.heroBlock}>
          <Text style={styles.emoji}>🎨</Text>
          <Text style={styles.title}>Pop Color</Text>
          <Text style={styles.subtitle}>Tap. Color. Smile.</Text>
        </View>

        <View style={styles.highlights}>
          {HIGHLIGHTS.map((item) => (
            <View key={item.emoji} style={styles.highlightRow}>
              <Text style={styles.highlightEmoji}>{item.emoji}</Text>
              <Text style={styles.highlightText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Button
          label="Let's go!"
          size="lg"
          onPress={handleStart}
          style={styles.cta}
          testID="onboarding-start"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl,
  },
  heroBlock: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  emoji: {
    fontSize: 84,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.brandDeep,
  },
  subtitle: {
    ...typography.heading,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  highlights: {
    gap: spacing.lg,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  highlightEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  highlightText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  cta: {
    alignSelf: 'stretch',
  },
});
