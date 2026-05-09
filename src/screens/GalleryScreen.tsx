import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageThumbnail } from '@/components/PageThumbnail';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getPagesForTheme, getTheme } from '@/data/pages';
import type { RootStackParamList } from '@/navigation/types';
import { useArtworksStore } from '@/state/artworksStore';
import { colors, spacing, typography } from '@/theme';

type GalleryRoute = RouteProp<RootStackParamList, 'Gallery'>;
type GalleryNav = NativeStackNavigationProp<RootStackParamList, 'Gallery'>;

export const GalleryScreen: React.FC = () => {
  const route = useRoute<GalleryRoute>();
  const navigation = useNavigation<GalleryNav>();
  const { themeId } = route.params;
  const theme = getTheme(themeId);
  const pages = useMemo(() => getPagesForTheme(themeId), [themeId]);
  const getArtworkForPage = useArtworksStore((s) => s.getArtworkForPage);
  const { width } = useWindowDimensions();
  const numColumns = width >= 600 ? 3 : 2;
  const gap = spacing.md;
  const horizontalPadding = spacing.lg;
  const tileSize = Math.floor(
    (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns,
  );

  if (!theme) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Gallery" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Theme not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title={`${theme.emoji} ${theme.title}`}
        subtitle={`${pages.length} pages`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.grid, { gap }]}>
          {pages.map((page) => {
            const inProgress = getArtworkForPage(page.id);
            return (
              <PageThumbnail
                key={page.id}
                page={page}
                size={tileSize}
                regionColors={inProgress?.regionColors}
                strokes={inProgress?.strokes}
                label={page.title}
                onPress={() =>
                  navigation.navigate('Coloring', {
                    pageId: page.id,
                    artworkId: inProgress?.id,
                  })
                }
                testID={`page-tile-${page.id}`}
              />
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
    paddingBottom: spacing.xxxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
