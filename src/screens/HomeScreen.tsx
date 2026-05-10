import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PainterKidIllustration } from '@/components/Illustration';
import { getPage, THEMES } from '@/data/pages';
import type { RootStackParamList } from '@/navigation/types';
import { useArtworksStore } from '@/state/artworksStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const artworks = useArtworksStore((s) => s.artworks);

  // The featured card resumes the user's most recently-edited painting if
  // there is one, otherwise spotlights starting their first painting.
  const recentArtwork = artworks[0];
  const recentPage = recentArtwork ? getPage(recentArtwork.pageId) : undefined;

  const totalPages = useMemo(
    () => THEMES.reduce((acc, t) => acc + t.pageIds.length, 0),
    [],
  );

  const handleResume = () => {
    if (recentArtwork && recentPage) {
      navigation.navigate('Coloring', {
        pageId: recentPage.id,
        artworkId: recentArtwork.id,
      });
    } else {
      navigation.navigate('Gallery', { themeId: THEMES[0].id });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Top row: menu + avatar (mirrors the reference) ---- */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            testID="open-settings"
            hitSlop={8}
          >
            <View style={styles.menuGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={styles.menuDot} />
              ))}
            </View>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('MyCreations')}
            accessibilityRole="button"
            accessibilityLabel="My Creations"
            style={({ pressed }) => [styles.avatarBtn, pressed && styles.avatarBtnPressed]}
            testID="open-my-creations"
            hitSlop={8}
          >
            <Text style={styles.avatarEmoji}>💖</Text>
          </Pressable>
        </View>

        {/* ---- Greeting ---- */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingKicker}>Welcome Back,</Text>
          <Text style={styles.greetingName}>Painter!</Text>
        </View>

        {/* ---- Category quick-access circles (one per theme) ---- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {THEMES.map((theme, idx) => (
            <Pressable
              key={theme.id}
              onPress={() => navigation.navigate('Gallery', { themeId: theme.id })}
              accessibilityRole="button"
              accessibilityLabel={`${theme.title} theme`}
              style={({ pressed }) => [styles.categoryItem, pressed && styles.categoryItemPressed]}
              testID={`category-${theme.id}`}
            >
              <View
                style={[
                  styles.categoryCircle,
                  idx === 0 && styles.categoryCircleActive,
                ]}
              >
                <Text style={styles.categoryEmoji}>{theme.emoji}</Text>
              </View>
              <Text
                style={[styles.categoryLabel, idx === 0 && styles.categoryLabelActive]}
                numberOfLines={1}
              >
                {theme.title.split(' ')[0]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ---- Featured periwinkle card (mirrors the reference) ---- */}
        <Pressable
          onPress={handleResume}
          accessibilityRole="button"
          accessibilityLabel={
            recentPage ? `Resume ${recentPage.title}` : 'Start your first painting'
          }
          style={({ pressed }) => [styles.featuredCard, pressed && styles.featuredPressed]}
          testID="featured-card"
        >
          <View style={styles.featuredText}>
            <Text style={styles.featuredKicker} numberOfLines={2}>
              {recentPage
                ? 'Pick up where you\u2019ve left off'
                : 'Ready to start your first painting?'}
            </Text>
            <Text style={styles.featuredMeta}>
              {recentPage ? recentPage.title : `${totalPages} pages waiting`}
            </Text>
            <View style={styles.featuredCta}>
              <View style={styles.featuredPlay}>
                <Text style={styles.featuredPlayIcon}>▶</Text>
              </View>
            </View>
          </View>
          <View style={styles.featuredIllus} pointerEvents="none">
            <PainterKidIllustration size={130} brushTipColor="#FFD24C" />
          </View>
        </Pressable>

        {/* ---- "Themes" section header ---- */}
        <View style={styles.themesHeader}>
          <Text style={styles.sectionTitle}>Themes</Text>
        </View>

        {/* ---- Bento grid: 2-col raspberry tiles, one per theme ---- */}
        <View style={styles.bentoGrid}>
          {THEMES.map((theme, idx) => {
            const accent = idx % 2 === 1;
            return (
              <Pressable
                key={theme.id}
                onPress={() => navigation.navigate('Gallery', { themeId: theme.id })}
                accessibilityRole="button"
                accessibilityLabel={`${theme.title}, ${theme.pageIds.length} pages`}
                style={({ pressed }) => [
                  styles.bentoTile,
                  accent ? styles.bentoTileAlt : styles.bentoTileBase,
                  pressed && styles.bentoTilePressed,
                ]}
                testID={`theme-card-${theme.id}`}
              >
                <Text style={styles.bentoEmoji}>{theme.emoji}</Text>
                <Text style={styles.bentoTitle} numberOfLines={2}>
                  {theme.title}
                </Text>
                <Text style={styles.bentoSub} numberOfLines={1}>
                  {theme.pageIds.length} pages
                </Text>
                <View style={styles.bentoCta}>
                  <Text style={styles.bentoSessions}>Open</Text>
                  <View style={styles.bentoPlay}>
                    <Text style={styles.bentoPlayIcon}>▶</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  // Top row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  iconBtnPressed: { transform: [{ scale: 0.94 }], opacity: 0.92 },
  menuGrid: {
    width: 18,
    height: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  avatarBtnPressed: { transform: [{ scale: 0.94 }], opacity: 0.92 },
  avatarEmoji: { fontSize: 20 },

  // Greeting
  greetingBlock: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  greetingKicker: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
    fontSize: 26,
  },
  greetingName: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
    fontSize: 26,
    marginTop: -4,
  },

  // Category circles
  categoryRow: {
    paddingVertical: spacing.sm,
    gap: spacing.lg,
    paddingRight: spacing.lg,
  },
  categoryItem: { alignItems: 'center', width: 64 },
  categoryItemPressed: { transform: [{ scale: 0.95 }] },
  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  categoryCircleActive: {
    backgroundColor: colors.brand,
  },
  categoryEmoji: { fontSize: 26 },
  categoryLabel: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    textAlign: 'center',
    maxWidth: 72,
  },
  categoryLabelActive: {
    color: colors.brand,
    fontWeight: '700',
  },

  // Featured card
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    marginTop: spacing.lg,
    minHeight: 140,
    overflow: 'hidden',
    ...shadow.card,
  },
  featuredPressed: { transform: [{ scale: 0.985 }], opacity: 0.96 },
  featuredText: { flex: 1, paddingRight: spacing.sm },
  featuredKicker: {
    ...typography.heading,
    color: colors.textOnBrand,
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 22,
  },
  featuredMeta: {
    ...typography.caption,
    color: colors.textOnBrand,
    opacity: 0.85,
    marginTop: spacing.xs,
  },
  featuredCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  featuredPlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredPlayIcon: {
    fontSize: 13,
    color: colors.accentDeep,
    fontWeight: '900',
    marginLeft: 2,
  },
  featuredIllus: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Themes section header
  themesHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
    fontSize: 22,
  },

  // Bento grid
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  bentoTile: {
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 150,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  bentoTileBase: { backgroundColor: colors.brand },
  bentoTileAlt: { backgroundColor: colors.brandDeep },
  bentoTilePressed: { transform: [{ scale: 0.97 }] },
  bentoEmoji: { fontSize: 28, marginBottom: spacing.sm },
  bentoTitle: {
    ...typography.heading,
    color: colors.textOnBrand,
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 22,
  },
  bentoSub: {
    ...typography.caption,
    color: colors.textOnBrand,
    opacity: 0.85,
    marginTop: 2,
  },
  bentoCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  bentoSessions: {
    ...typography.caption,
    color: colors.textOnBrand,
    opacity: 0.9,
    fontWeight: '700',
  },
  bentoPlay: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoPlayIcon: {
    fontSize: 11,
    color: colors.brandDeep,
    fontWeight: '900',
    marginLeft: 1.5,
  },
});
