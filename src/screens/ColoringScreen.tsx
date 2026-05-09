import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type View as ViewType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorPalette } from '@/components/ColorPalette';
import { ColoringCanvas } from '@/components/ColoringCanvas';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Toolbar, type ToolbarAction } from '@/components/Toolbar';
import { getPage } from '@/data/pages';
import type { RootStackParamList } from '@/navigation/types';
import { useArtworksStore } from '@/state/artworksStore';
import { useColoringStore } from '@/state/coloringStore';
import { colors, spacing, typography } from '@/theme';
import { captureArtwork, persistArtworkFile, shareArtwork } from '@/utils/saveArtwork';
import { playPop } from '@/utils/sound';

type ColoringRoute = RouteProp<RootStackParamList, 'Coloring'>;
type ColoringNav = NativeStackNavigationProp<RootStackParamList, 'Coloring'>;

export const ColoringScreen: React.FC = () => {
  const route = useRoute<ColoringRoute>();
  const navigation = useNavigation<ColoringNav>();
  const { pageId, artworkId } = route.params;
  const page = getPage(pageId);

  const canvasRef = useRef<ViewType>(null);
  const { width, height } = useWindowDimensions();

  const regionColors = useColoringStore((s) => s.regionColors);
  const activeColor = useColoringStore((s) => s.activeColor);
  const history = useColoringStore((s) => s.history);
  const future = useColoringStore((s) => s.future);
  const startPage = useColoringStore((s) => s.startPage);
  const paintRegion = useColoringStore((s) => s.paintRegion);
  const setActiveColor = useColoringStore((s) => s.setActiveColor);
  const undo = useColoringStore((s) => s.undo);
  const redo = useColoringStore((s) => s.redo);
  const reset = useColoringStore((s) => s.reset);
  const clearPage = useColoringStore((s) => s.clearPage);

  const saveArtwork = useArtworksStore((s) => s.saveArtwork);
  const getArtwork = useArtworksStore((s) => s.getArtwork);

  const [persistedArtworkId, setPersistedArtworkId] = useState<string | undefined>(artworkId);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (!page) return;
    const initial = artworkId ? getArtwork(artworkId)?.regionColors : undefined;
    startPage(page.id, initial);
    return () => {
      clearPage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.id, artworkId]);

  if (!page) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Coloring" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>This coloring page is missing.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleRegionPress = (regionId: string) => {
    paintRegion(regionId);
    void playPop();
  };

  const persist = async (): Promise<string> => {
    const artwork = await saveArtwork({
      id: persistedArtworkId,
      pageId: page.id,
      regionColors,
    });
    setPersistedArtworkId(artwork.id);
    return artwork.id;
  };

  const handleSave = async () => {
    setSavingState('saving');
    try {
      await persist();
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 1500);
    } catch (error) {
      console.warn('[ColoringScreen] save failed', error);
      setSavingState('idle');
      Alert.alert('Save failed', 'Something went wrong. Please try again.');
    }
  };

  const handleShare = async () => {
    setSavingState('saving');
    try {
      await persist();
      const uri = await captureArtwork(canvasRef);
      if (!uri) {
        Alert.alert('Share failed', 'Could not prepare your artwork.');
        return;
      }
      await persistArtworkFile(uri, `pop-color-${page.id}-${Date.now()}`);
      await shareArtwork(uri);
    } catch (error) {
      console.warn('[ColoringScreen] share failed', error);
      Alert.alert('Share failed', 'Something went wrong. Please try again.');
    } finally {
      setSavingState('idle');
    }
  };

  const handleReset = () => {
    Alert.alert('Start over?', 'This will clear all the colors on this page.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => reset() },
    ]);
  };

  const canvasSize = Math.min(
    width - spacing.lg * 2,
    height * 0.55,
  );

  const actions: ToolbarAction[] = [
    {
      id: 'undo',
      icon: '↶',
      label: 'Undo',
      onPress: undo,
      disabled: history.length === 0,
      testID: 'btn-undo',
    },
    {
      id: 'redo',
      icon: '↷',
      label: 'Redo',
      onPress: redo,
      disabled: future.length === 0,
      testID: 'btn-redo',
    },
    {
      id: 'reset',
      icon: '🧽',
      label: 'Clear',
      onPress: handleReset,
      disabled: Object.keys(regionColors).length === 0,
      testID: 'btn-reset',
    },
    {
      id: 'save',
      icon: '💾',
      label: savingState === 'saved' ? 'Saved!' : 'Save',
      onPress: handleSave,
      disabled: savingState === 'saving',
      testID: 'btn-save',
    },
    {
      id: 'share',
      icon: '📤',
      label: 'Share',
      onPress: handleShare,
      emphasized: true,
      disabled: savingState === 'saving',
      testID: 'btn-share',
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title={`${page.emoji} ${page.title}`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.canvasArea}>
        <ColoringCanvas
          ref={canvasRef}
          page={page}
          regionColors={regionColors}
          onRegionPress={handleRegionPress}
          size={canvasSize}
          testID="coloring-canvas"
        />
      </View>
      <Toolbar actions={actions} />
      <ColorPalette
        activeColor={activeColor}
        onSelect={setActiveColor}
        testID="color-palette"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  canvasArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
