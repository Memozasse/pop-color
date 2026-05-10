import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BRUSHES,
  BRUSH_PICKER_ORDER,
  type BrushConfig,
} from '@/data/brushes';
import { colors, radius, shadow, spacing, typography } from '@/theme';

import { BrushIcon } from './BrushIcon';

interface BrushPickerModalProps {
  visible: boolean;
  activeBrushId: string;
  /** Active paint colour to tint each brush's "business end" in its icon. */
  activePaintColor?: string;
  /** Hide brushes that don't apply on the current page (e.g. Bucket on raster). */
  excludeIds?: string[];
  onSelect: (brushId: string) => void;
  onClose: () => void;
}

const COLUMNS = 3;

/** One-line iOS-Settings-style hint shown under each brush label. */
const BRUSH_HINTS: Record<string, string> = {
  eraser: 'Lift colour off the page',
  bucket: 'Fill a whole region',
  brush: 'Smooth, even strokes',
  'big-brush': 'Cover large areas fast',
  pencil: 'Crisp, light pencil lines',
  marker: 'Bold, opaque marker',
  'tech-pen': 'Sharp, fine ink lines',
  'ball-pen': 'Everyday ballpoint',
  watercolor: 'Soft, translucent washes',
  airbrush: 'Misty, soft-edged spray',
  spray: 'Coarse, gritty spray',
  pastel: 'Soft, dusty pastel',
  splatter: 'Random paint splash',
};

/**
 * iOS-premium brush picker. Bottom-sheet card with a grab handle, a big
 * heading + subtitle, and a 3-column grid of hand-authored vector icons
 * (one per brush) plus a one-line hint describing what each tool does.
 *
 * Tapping a tile selects the brush and dismisses the modal. Brushes
 * listed in `excludeIds` are hidden (used to drop Bucket on raster pages
 * where there are no regions to fill).
 */
export const BrushPickerModal: React.FC<BrushPickerModalProps> = ({
  visible,
  activeBrushId,
  activePaintColor = colors.brand,
  excludeIds = [],
  onSelect,
  onClose,
}) => {
  const tiles = useMemo<BrushConfig[]>(() => {
    const excluded = new Set(excludeIds);
    return BRUSH_PICKER_ORDER.map((id) => BRUSHES.find((b) => b.id === id))
      .filter((b): b is BrushConfig => !!b && !excluded.has(b.id));
  }, [excludeIds]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Brushes</Text>
              <Text style={styles.subtitle}>Pick a tool to paint with</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close brush picker"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          >
            {tiles.map((b) => {
              const active = b.id === activeBrushId;
              return (
                <Pressable
                  key={b.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={b.label}
                  onPress={() => {
                    onSelect(b.id);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.tile,
                    active && styles.tileActive,
                    pressed && styles.tilePressed,
                  ]}
                  testID={`brush-tile-${b.id}`}
                >
                  <View style={styles.tileIconBox}>
                    <BrushIcon
                      brushId={b.id}
                      size={64}
                      paintColor={activePaintColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.tileLabel,
                      active && styles.tileLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {b.label}
                  </Text>
                  <Text style={styles.tileHint} numberOfLines={1}>
                    {BRUSH_HINTS[b.id] ?? ''}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl + 8,
    borderTopRightRadius: radius.xl + 8,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    maxHeight: '86%',
    ...shadow.card,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  closeBtnPressed: {
    opacity: 0.6,
  },
  closeText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
  },
  tile: {
    width: `${100 / COLUMNS - 2}%`,
    aspectRatio: 0.92,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg + 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  tileActive: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
  },
  tilePressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  tileIconBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  tileLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: -0.1,
  },
  tileLabelActive: {
    color: colors.brandDeep,
    fontWeight: '700',
  },
  tileHint: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10.5,
    marginTop: 1,
    textAlign: 'center',
  },
});
