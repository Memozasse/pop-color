import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrushCanvas, type BrushCanvasHandle } from '@/components/BrushCanvas';
import { BrushToolbar } from '@/components/BrushToolbar';
import { ColorPalette } from '@/components/ColorPalette';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Toolbar, type ToolbarAction } from '@/components/Toolbar';
import { getPage } from '@/data/pages';
import type { RootStackParamList } from '@/navigation/types';
import { useArtworksStore } from '@/state/artworksStore';
import { useBrushStore } from '@/state/brushStore';
import { colors, spacing, typography } from '@/theme';
import { playPop } from '@/utils/sound';

type ColoringRoute = RouteProp<RootStackParamList, 'Coloring'>;
type ColoringNav = NativeStackNavigationProp<RootStackParamList, 'Coloring'>;

export const ColoringScreen: React.FC = () => {
  const route = useRoute<ColoringRoute>();
  const navigation = useNavigation<ColoringNav>();
  const { pageId, artworkId } = route.params;
  const page = getPage(pageId);

  const canvasRef = useRef<BrushCanvasHandle>(null);
  const { width, height } = useWindowDimensions();

  const strokes = useBrushStore((s) => s.strokes);
  const redoStack = useBrushStore((s) => s.redoStack);
  const activeColor = useBrushStore((s) => s.activeColor);
  const brushSize = useBrushStore((s) => s.brushSize);
  const isErasing = useBrushStore((s) => s.isErasing);
  const stayInside = useBrushStore((s) => s.stayInside);
  const startPage = useBrushStore((s) => s.startPage);
  const clearPage = useBrushStore((s) => s.clearPage);
  const setActiveColor = useBrushStore((s) => s.setActiveColor);
  const setBrushSize = useBrushStore((s) => s.setBrushSize);
  const toggleEraser = useBrushStore((s) => s.toggleEraser);
  const toggleStayInside = useBrushStore((s) => s.toggleStayInside);
  const pushStroke = useBrushStore((s) => s.pushStroke);
  const undo = useBrushStore((s) => s.undo);
  const redo = useBrushStore((s) => s.redo);
  const reset = useBrushStore((s) => s.reset);

  const saveArtwork = useArtworksStore((s) => s.saveArtwork);
  const getArtwork = useArtworksStore((s) => s.getArtwork);

  const [persistedArtworkId, setPersistedArtworkId] = useState<string | undefined>(artworkId);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (!page) return;
    const initialStrokes = artworkId ? getArtwork(artworkId)?.strokes ?? [] : [];
    startPage(page.id, initialStrokes);
    return () => {
      clearPage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.id, artworkId]);

  const handleStrokeEnd = useCallback(
    (stroke: Parameters<typeof pushStroke>[0]) => {
      pushStroke(stroke);
      void playPop();
    },
    [pushStroke],
  );

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

  const persist = async (): Promise<string> => {
    const artwork = await saveArtwork({
      id: persistedArtworkId,
      pageId: page.id,
      strokes,
    });
    setPersistedArtworkId(artwork.id);
    return artwork.id;
  };

  const handleSave = async () => {
    setSavingState('saving');
    try {
      // Reset zoom/rotate/pan so the saved snapshot is the canonical view.
      canvasRef.current?.resetTransform();
      await persist();
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 1500);
    } catch (error) {
      console.warn('[ColoringScreen] save failed', error);
      setSavingState('idle');
      Alert.alert('Save failed', 'Something went wrong. Please try again.');
    }
  };

  const handleReset = () => {
    Alert.alert('Start over?', 'This will clear everything you painted on this page.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => reset() },
    ]);
  };

  const canvasSize = Math.min(width - spacing.lg * 2, height * 0.5);

  const actions: ToolbarAction[] = [
    {
      id: 'undo',
      icon: '↶',
      label: 'Undo',
      onPress: undo,
      disabled: strokes.length === 0,
      testID: 'btn-undo',
    },
    {
      id: 'redo',
      icon: '↷',
      label: 'Redo',
      onPress: redo,
      disabled: redoStack.length === 0,
      testID: 'btn-redo',
    },
    {
      id: 'reset',
      icon: '🗑️',
      label: 'Clear',
      onPress: handleReset,
      disabled: strokes.length === 0,
      testID: 'btn-reset',
    },
    {
      id: 'save',
      icon: '💾',
      label: savingState === 'saved' ? 'Saved!' : 'Save',
      onPress: handleSave,
      emphasized: true,
      disabled: savingState === 'saving',
      testID: 'btn-save',
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title={`${page.emoji} ${page.title}`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.canvasArea}>
        <BrushCanvas
          ref={canvasRef}
          page={page}
          size={canvasSize}
          strokes={strokes}
          activeColor={activeColor}
          brushSize={brushSize}
          isErasing={isErasing}
          stayInside={stayInside}
          onStrokeEnd={handleStrokeEnd}
          onTwoFingerTap={undo}
          onThreeFingerTap={redo}
          testID="brush-canvas"
        />
      </View>
      <BrushToolbar
        brushSize={brushSize}
        isErasing={isErasing}
        stayInside={stayInside}
        onSelectSize={setBrushSize}
        onToggleEraser={toggleEraser}
        onToggleStayInside={toggleStayInside}
      />
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
