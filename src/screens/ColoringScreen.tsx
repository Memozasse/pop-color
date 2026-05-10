import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrushCanvas, type BrushCanvasHandle } from '@/components/BrushCanvas';
import { BrushPickerModal } from '@/components/BrushPickerModal';
import { PaintToolbar } from '@/components/PaintToolbar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Toolbar, type ToolbarAction } from '@/components/Toolbar';
import {
  BRUSHES,
  DEFAULT_BRUSH_ID,
  getBrush,
  type BrushConfig,
} from '@/data/brushes';
import { getPage } from '@/data/pages';
import type { RootStackParamList } from '@/navigation/types';
import { useArtworksStore } from '@/state/artworksStore';
import { useBrushStore } from '@/state/brushStore';
import { colors, radius, spacing, typography } from '@/theme';

type ColoringRoute = RouteProp<RootStackParamList, 'Coloring'>;
type ColoringNav = NativeStackNavigationProp<RootStackParamList, 'Coloring'>;

const FALLBACK_BRUSH: BrushConfig =
  getBrush(DEFAULT_BRUSH_ID) ?? BRUSHES[0];

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
  const activeBrushId = useBrushStore((s) => s.activeBrushId);
  const paletteId = useBrushStore((s) => s.paletteId);
  const tint = useBrushStore((s) => s.tint);
  const sizeMultiplier = useBrushStore((s) => s.sizeMultiplier);
  const eyedropperActive = useBrushStore((s) => s.eyedropperActive);
  const recentColors = useBrushStore((s) => s.recentColors);
  const stayInside = useBrushStore((s) => s.stayInside);

  const startPage = useBrushStore((s) => s.startPage);
  const clearPage = useBrushStore((s) => s.clearPage);
  const setActiveColor = useBrushStore((s) => s.setActiveColor);
  const setActiveBrushId = useBrushStore((s) => s.setActiveBrushId);
  const setPaletteId = useBrushStore((s) => s.setPaletteId);
  const setTint = useBrushStore((s) => s.setTint);
  const setEyedropperActive = useBrushStore((s) => s.setEyedropperActive);
  const toggleStayInside = useBrushStore((s) => s.toggleStayInside);
  const pushStroke = useBrushStore((s) => s.pushStroke);
  const undo = useBrushStore((s) => s.undo);
  const redo = useBrushStore((s) => s.redo);
  const reset = useBrushStore((s) => s.reset);

  const saveArtwork = useArtworksStore((s) => s.saveArtwork);
  const getArtwork = useArtworksStore((s) => s.getArtwork);

  const [persistedArtworkId, setPersistedArtworkId] = useState<string | undefined>(artworkId);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [pickerVisible, setPickerVisible] = useState(false);

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
    },
    [pushStroke],
  );

  const handleEyedropperSample = useCallback(
    (hex: string) => {
      setActiveColor(hex);
    },
    [setActiveColor],
  );

  // Bucket only makes sense on vector pages (where regions exist).
  const hiddenBrushIds = useMemo<string[]>(
    () => (page?.kind === 'raster' ? ['bucket'] : []),
    [page?.kind],
  );

  const activeBrush = useMemo<BrushConfig>(
    () => getBrush(activeBrushId) ?? FALLBACK_BRUSH,
    [activeBrushId],
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

  // Stay-inside-lines is meaningless on raster pages (no regions) — hide the
  // toggle and force-disable clipping.
  const supportsStayInside = page.kind === 'vector';
  const effectiveStayInside = supportsStayInside && stayInside;

  const canvasSize = Math.min(width - spacing.lg * 2, height * 0.45);

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
          activeBrush={activeBrush}
          activeColor={activeColor}
          tint={tint}
          sizeMultiplier={sizeMultiplier}
          eyedropperActive={eyedropperActive}
          stayInside={effectiveStayInside}
          onStrokeEnd={handleStrokeEnd}
          onEyedropperSample={handleEyedropperSample}
          onTwoFingerTap={undo}
          onThreeFingerTap={redo}
          testID="brush-canvas"
        />
        {supportsStayInside ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: effectiveStayInside }}
            accessibilityLabel="Toggle stay inside the lines"
            onPress={toggleStayInside}
            style={({ pressed }) => [
              styles.stayInsideBtn,
              effectiveStayInside && styles.stayInsideBtnActive,
              pressed && styles.stayInsidePressed,
            ]}
            testID="btn-stay-inside"
          >
            <Text style={styles.stayInsideEmoji}>
              {effectiveStayInside ? '🔒' : '🔓'}
            </Text>
            <Text style={styles.stayInsideLabel}>
              {effectiveStayInside ? 'Inside lines' : 'Free paint'}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Toolbar actions={actions} />
      <PaintToolbar
        activeBrushId={activeBrushId}
        paletteId={paletteId}
        activeColor={activeColor}
        tint={tint}
        recentColors={recentColors}
        eyedropperActive={eyedropperActive}
        hiddenBrushIds={hiddenBrushIds}
        onSelectBrush={setActiveBrushId}
        onOpenBrushPicker={() => setPickerVisible(true)}
        onSelectPalette={setPaletteId}
        onSelectColor={setActiveColor}
        onTintChange={setTint}
        onToggleEyedropper={() => setEyedropperActive(!eyedropperActive)}
      />
      <BrushPickerModal
        visible={pickerVisible}
        activeBrushId={activeBrushId}
        activePaintColor={activeColor}
        excludeIds={hiddenBrushIds}
        onSelect={setActiveBrushId}
        onClose={() => setPickerVisible(false)}
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
  stayInsideBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  stayInsideBtnActive: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
  },
  stayInsidePressed: {
    opacity: 0.7,
  },
  stayInsideEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  stayInsideLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
});
