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

interface BrushPickerModalProps {
  visible: boolean;
  activeBrushId: string;
  /** Hide brushes that don't apply on the current page (e.g. Bucket on raster). */
  excludeIds?: string[];
  onSelect: (brushId: string) => void;
  onClose: () => void;
}

const COLUMNS = 3;

/**
 * Full-screen brush picker. Shows every brush in {@link BRUSH_PICKER_ORDER}
 * as a 3-column grid of round tiles with the brush emoji and label. Tapping
 * a tile selects the brush and dismisses the modal. Brushes listed in
 * `excludeIds` are hidden (used to drop Bucket on raster pages where there
 * are no regions to fill).
 */
export const BrushPickerModal: React.FC<BrushPickerModalProps> = ({
  visible,
  activeBrushId,
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
            <Text style={styles.title}>Brushes</Text>
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
                  <Text style={styles.tileEmoji}>{b.emoji}</Text>
                  <Text
                    style={[
                      styles.tileLabel,
                      active && styles.tileLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {b.label}
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
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    maxHeight: '80%',
    ...shadow.card,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
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
    aspectRatio: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileActive: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
  },
  tilePressed: {
    opacity: 0.85,
  },
  tileEmoji: {
    fontSize: 38,
    marginBottom: spacing.xs,
  },
  tileLabel: {
    ...typography.caption,
    color: colors.text,
  },
  tileLabelActive: {
    color: colors.brandDeep,
    fontWeight: '700',
  },
});
