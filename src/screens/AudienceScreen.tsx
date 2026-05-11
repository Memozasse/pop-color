import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/types';
import { useAudienceStore, type Audience } from '@/state/audienceStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Audience'>;

// Built at runtime via fromCodePoint so Metro doesn't re-escape the chars in
// the emitted web bundle (which surfaces as the literal text "\uD83E\uDDF8").
const KIDS_EMOJI = String.fromCodePoint(0x1f9f8); // teddy bear
const ADULTS_EMOJI = String.fromCodePoint(0x1f338); // cherry blossom

interface AudienceButtonProps {
  label: string;
  caption: string;
  emoji: string;
  background: string;
  pressedBackground: string;
  testID: string;
  onPress: () => void;
}

const AudienceButton: React.FC<AudienceButtonProps> = ({
  label,
  caption,
  emoji,
  background,
  pressedBackground,
  testID,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${label} \u2014 ${caption}`}
    style={({ pressed }) => [
      styles.audienceBtn,
      { backgroundColor: pressed ? pressedBackground : background },
      pressed && styles.audienceBtnPressed,
    ]}
    testID={testID}
  >
    <Text style={styles.audienceEmoji}>{emoji}</Text>
    <View style={styles.audienceTextBlock}>
      <Text style={styles.audienceLabel}>{label}</Text>
      <Text style={styles.audienceCaption}>{caption}</Text>
    </View>
    <Text style={styles.audienceChevron}>{'\u203A'}</Text>
  </Pressable>
);

/**
 * Audience picker shown immediately after the Welcome splash on first launch.
 *
 * Two large pill-shaped buttons:
 *   - Kids    (raspberry)  -> filters Home to the kid-friendly themes
 *   - Adults  (periwinkle) -> filters Home to the detailed adult themes
 *
 * Underneath the buttons sits the lion-duo illustration (papa + cub painting
 * together) which is the literal asset the user provided.
 *
 * The choice is persisted via `audienceStore`; once set, future cold starts
 * route from Welcome -> Home directly and the user can change the choice
 * any time from Settings.
 */
export const AudienceScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const setAudience = useAudienceStore((s) => s.setAudience);

  const pick = (audience: Audience) => {
    setAudience(audience);
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.kicker}>Pop Color</Text>
          <Text style={styles.title}>Who&rsquo;s painting today?</Text>
          <Text style={styles.subtitle}>
            Pick the experience that fits you best. You can change it any time
            from Settings.
          </Text>
        </View>

        <View style={styles.buttonsBlock}>
          <AudienceButton
            label="Kids"
            caption="Cute animals, fruits, vehicles & shapes"
            emoji={KIDS_EMOJI}
            background={colors.brand}
            pressedBackground={colors.brandDeep}
            testID="audience-kids"
            onPress={() => pick('kids')}
          />
          <AudienceButton
            label="Adults"
            caption="Detailed women & flowers portraits"
            emoji={ADULTS_EMOJI}
            background={colors.accent}
            pressedBackground={colors.accentDeep}
            testID="audience-adults"
            onPress={() => pick('adults')}
          />
        </View>

        <View style={styles.imageBlock} pointerEvents="none">
          <Image
            source={require('../../assets/lion-duo.png')}
            style={styles.image}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  headerBlock: {
    marginBottom: spacing.xl,
  },
  kicker: {
    ...typography.caption,
    color: colors.brand,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },

  buttonsBlock: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  audienceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    minHeight: 96,
    ...shadow.card,
  },
  audienceBtnPressed: {
    transform: [{ scale: 0.98 }],
  },
  audienceEmoji: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  audienceTextBlock: {
    flex: 1,
  },
  audienceLabel: {
    ...typography.heading,
    color: colors.textOnBrand,
    fontSize: 22,
  },
  audienceCaption: {
    ...typography.caption,
    color: colors.textOnBrand,
    fontSize: 13,
    opacity: 0.88,
    marginTop: 2,
  },
  audienceChevron: {
    ...typography.heading,
    color: colors.textOnBrand,
    fontSize: 32,
    opacity: 0.85,
    marginLeft: spacing.sm,
  },

  imageBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  image: {
    width: '100%',
    height: '100%',
    maxWidth: 420,
  },
});
