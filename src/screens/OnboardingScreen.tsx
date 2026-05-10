import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaintFlower, PainterKidIllustration, PaintSwirl } from '@/components/Illustration';
import type { RootStackParamList } from '@/navigation/types';
import { useSettingsStore } from '@/state/settingsStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const markOnboardingSeen = useSettingsStore((s) => s.markOnboardingSeen);

  const handleStart = () => {
    markOnboardingSeen();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Raspberry hero panel — rounded bottom corners, mirrors the
          left phone in the reference design. */}
      <View style={styles.hero}>
        {/* Decorative swirls behind the title */}
        <View style={styles.heroSwirl} pointerEvents="none">
          <PaintSwirl width={320} height={260} />
        </View>
        <View style={styles.heroContent}>
          <Text style={styles.welcomeKicker}>Welcome To,</Text>
          <Text style={styles.brand}>Pop Color</Text>
          <View style={styles.startInline}>
            <Text style={styles.startInlineText}>Let{'\u2019'}s start</Text>
            <Text style={styles.startInlineArrow}>→</Text>
          </View>
        </View>
      </View>

      {/* Painter kid illustration sits on the cream-pink page bg */}
      <View style={styles.illustrationWrap}>
        <View style={styles.flowerLeft} pointerEvents="none">
          <PaintFlower size={28} />
        </View>
        <View style={styles.flowerRight} pointerEvents="none">
          <PaintFlower size={24} color="#8999D5" />
        </View>
        <PainterKidIllustration size={260} />
      </View>

      {/* Single big primary CTA at the bottom — kid-friendly tap target */}
      <View style={styles.ctaWrap}>
        <View style={styles.dots} pointerEvents="none">
          <View style={[styles.dot, styles.dotInactive]} />
          <View style={[styles.dot, styles.dotInactive]} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <Pressable
          onPress={handleStart}
          accessibilityRole="button"
          accessibilityLabel="Start coloring"
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          testID="onboarding-start"
        >
          <Text style={styles.ctaLabel}>Start coloring</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const HERO_RADIUS = 36;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    backgroundColor: colors.brand,
    paddingTop: spacing.xxxl + spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: HERO_RADIUS,
    borderBottomRightRadius: HERO_RADIUS,
    overflow: 'hidden',
  },
  heroSwirl: {
    position: 'absolute',
    right: -60,
    top: -20,
  },
  heroContent: {
    marginTop: spacing.xl,
  },
  welcomeKicker: {
    ...typography.heading,
    color: colors.textOnBrand,
    fontWeight: '600',
    opacity: 0.9,
  },
  brand: {
    ...typography.display,
    color: colors.textOnBrand,
    marginTop: 2,
  },
  startInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  startInlineText: {
    ...typography.body,
    color: colors.textOnBrand,
    opacity: 0.95,
  },
  startInlineArrow: {
    color: colors.textOnBrand,
    fontSize: 18,
    fontWeight: '700',
  },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  flowerLeft: {
    position: 'absolute',
    left: spacing.xl,
    top: spacing.xl,
  },
  flowerRight: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
  },
  ctaWrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  dot: {
    height: 6,
    borderRadius: radius.pill,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.brandSoft,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.brand,
  },
  cta: {
    backgroundColor: colors.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    gap: spacing.sm,
    ...shadow.button,
  },
  ctaPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.brandDeep,
  },
  ctaLabel: {
    ...typography.button,
    color: colors.textOnBrand,
    fontSize: 18,
  },
  ctaArrow: {
    color: colors.textOnBrand,
    fontSize: 22,
    fontWeight: '800',
  },
});
