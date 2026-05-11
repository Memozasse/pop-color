// Splash / welcome screen.
//
// Renders for ~4 seconds on every app launch:
//   - lion painter mascot at top center
//   - app name + tagline
//   - progress bar that animates 0 -> 100% over 4s
//
// When the bar fills, we route forward:
//   - first launch (no audience saved yet) -> Audience picker
//   - returning user (audience set)        -> Home
//
// Uses `Animated` from RN core so we don't pull in any new deps. The bar
// width is driven by a single shared driver so the visual progress and the
// auto-advance timing stay in sync.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaintFlower, PaintSwirl } from '@/components/Illustration';
import type { RootStackParamList } from '@/navigation/types';
import { useAudienceStore } from '@/state/audienceStore';
import { colors, radius, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const SPLASH_DURATION_MS = 4000;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const audience = useAudienceStore((s) => s.audience);

  // Single driver: 0 -> 1 over SPLASH_DURATION_MS. Drives the bar width AND
  // signals when we should auto-advance to the next route.
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: SPLASH_DURATION_MS,
      useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      if (finished) {
        navigation.replace(audience ? 'Home' : 'Audience');
      }
    });
    return () => {
      anim.stop();
    };
    // We intentionally only want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Decorative raspberry swirl tucked behind the lion */}
      <View style={styles.swirl} pointerEvents="none">
        <PaintSwirl width={320} height={260} opacity={0.4} />
      </View>

      <View style={styles.content}>
        <Image
          source={require('../../assets/lion-painter.png')}
          style={styles.mascot}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />

        <Text style={styles.brand}>Pop Color</Text>
        <Text style={styles.tagline}>
          Relax, paint, and have a little fun.
        </Text>

        {/* Decorative flowers on either side of the brand block */}
        <View style={styles.flowerLeft} pointerEvents="none">
          <PaintFlower size={26} />
        </View>
        <View style={styles.flowerRight} pointerEvents="none">
          <PaintFlower size={22} color={colors.accent} />
        </View>
      </View>

      <View style={styles.barWrap}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>
        <Text style={styles.barLabel}>Mixing colors…</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  swirl: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  mascot: {
    // The PNG is roughly 1181x1650 (taller than wide). Lock the width and
    // let `aspectRatio` drive height so the lion renders large and crisp
    // on every screen size without any white border.
    width: 300,
    aspectRatio: 1181 / 1650,
    marginBottom: spacing.lg,
  },
  brand: {
    ...typography.title,
    fontSize: 40,
    fontWeight: '900',
    color: colors.brand,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 280,
  },
  flowerLeft: {
    position: 'absolute',
    left: spacing.xl,
    bottom: '20%',
  },
  flowerRight: {
    position: 'absolute',
    right: spacing.xl,
    bottom: '30%',
  },
  barWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  barTrack: {
    width: '100%',
    height: 8,
    backgroundColor: colors.brandSoft,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
});
