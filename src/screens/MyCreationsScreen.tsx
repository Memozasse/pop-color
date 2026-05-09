import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { PageThumbnail } from '@/components/PageThumbnail';
import { ScreenHeader } from '@/components/ScreenHeader';
import { getPage } from '@/data/pages';
import type { RootStackParamList } from '@/navigation/types';
import { useArtworksStore } from '@/state/artworksStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MyCreations'>;

export const MyCreationsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const artworks = useArtworksStore((s) => s.artworks);
  const deleteArtwork = useArtworksStore((s) => s.deleteArtwork);
  const { width } = useWindowDimensions();
  const numColumns = width >= 600 ? 3 : 2;
  const gap = spacing.md;
  const horizontalPadding = spacing.lg;
  const tileSize = Math.floor(
    (width - horizontalPadding * 2 - gap * (numColumns - 1)) / numColumns,
  );

  const handleDelete = (id: string) => {
    Alert.alert('Delete artwork?', 'You cannot undo this.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deleteArtwork(id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="My Creations" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {artworks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎨</Text>
            <Text style={styles.emptyTitle}>No creations yet</Text>
            <Text style={styles.emptyText}>
              Pick a coloring page and tap to fill — your saved artwork will show up here.
            </Text>
            <Button
              label="Pick a page"
              size="lg"
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        ) : (
          <View style={[styles.grid, { gap }]}>
            {artworks.map((artwork) => {
              const page = getPage(artwork.pageId);
              if (!page) return null;
              return (
                <View key={artwork.id} style={[styles.cardWrap, { width: tileSize }]}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('Coloring', {
                        pageId: artwork.pageId,
                        artworkId: artwork.id,
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`${page.title} \u2014 saved artwork, tap to resume`}
                    style={({ pressed }) => [pressed && styles.pressed]}
                    testID={`artwork-${artwork.id}`}
                  >
                    <PageThumbnail
                      page={page}
                      size={tileSize}
                      regionColors={artwork.regionColors}
                      strokes={artwork.strokes}
                    />
                  </Pressable>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {page.emoji} {page.title}
                    </Text>
                    <Pressable
                      onPress={() => handleDelete(artwork.id)}
                      hitSlop={12}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${page.title}`}
                      style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
                      testID={`delete-${artwork.id}`}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
  cardMeta: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...shadow.button,
  },
  cardTitle: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
});
