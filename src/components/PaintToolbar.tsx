import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';

import {
  BRUSHES,
  QUICK_ACCESS_BRUSH_IDS,
  type BrushConfig,
} from '@/data/brushes';
import { PALETTES, type Palette } from '@/data/palettes';
import { applyTint } from '@/state/brushStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';
import { isLight } from '@/utils/brushRender';

interface PaintToolbarProps {
  /** Current brush registry id (e.g. 'brush'). */
  activeBrushId: string;
  /** Current palette id (e.g. 'sky'). */
  paletteId: string;
  /** Currently selected swatch (hex, before tint). */
  activeColor: string;
  /** Tint slider value 0..1; 0.5 = no tint. */
  tint: number;
  /** Most-recently-used colours (newest first). */
  recentColors: string[];
  /** True when the eyedropper is active and the next canvas tap samples a colour. */
  eyedropperActive: boolean;
  /** Brush ids to hide in the quick-access row (e.g. ['bucket'] on raster pages). */
  hiddenBrushIds?: string[];

  onSelectBrush: (brushId: string) => void;
  onOpenBrushPicker: () => void;
  onSelectPalette: (paletteId: string) => void;
  onSelectColor: (hex: string) => void;
  onTintChange: (value: number) => void;
  onToggleEyedropper: () => void;
  style?: ViewStyle;
}

/**
 * The big bottom panel of the coloring screen. Built to mirror the reference
 * screenshot the user shared (Happy Color / ColorJoy style):
 *
 *   ┌───────────────────────────────────────────────┐
 *   │  [eraser] [bucket] [brush] [pencil] … [more]  │  ← quick-access tools
 *   ├───────────────────────────────────────────────┤
 *   │  ◐━━━━━━○━━━━━━●  (tint: white → ●color → black)│  ← tint slider
 *   ├───────────────────────────────────────────────┤
 *   │  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●                  │  ← palette swatches
 *   ├───────────────────────────────────────────────┤
 *   │  ‹ Sky ›    [eyedropper]   ● ● ● ● ●          │  ← palette nav + recents
 *   └───────────────────────────────────────────────┘
 */
export const PaintToolbar: React.FC<PaintToolbarProps> = ({
  activeBrushId,
  paletteId,
  activeColor,
  tint,
  recentColors,
  eyedropperActive,
  hiddenBrushIds = [],
  onSelectBrush,
  onOpenBrushPicker,
  onSelectPalette,
  onSelectColor,
  onTintChange,
  onToggleEyedropper,
  style,
}) => {
  const quickBrushes = useMemo<BrushConfig[]>(() => {
    const hidden = new Set(hiddenBrushIds);
    return QUICK_ACCESS_BRUSH_IDS.map((id) =>
      BRUSHES.find((b) => b.id === id),
    ).filter((b): b is BrushConfig => !!b && !hidden.has(b.id));
  }, [hiddenBrushIds]);

  const activePalette: Palette = useMemo(
    () => PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0],
    [paletteId],
  );

  const paletteIndex = PALETTES.findIndex((p) => p.id === activePalette.id);
  const onPrevPalette = () => {
    const i = (paletteIndex - 1 + PALETTES.length) % PALETTES.length;
    onSelectPalette(PALETTES[i].id);
  };
  const onNextPalette = () => {
    const i = (paletteIndex + 1) % PALETTES.length;
    onSelectPalette(PALETTES[i].id);
  };

  return (
    <View style={[styles.panel, style]}>
      {/* Row 1: Tools quick-access */}
      <View style={styles.toolsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolsScroll}
        >
          {quickBrushes.map((b) => (
            <ToolTile
              key={b.id}
              emoji={b.emoji}
              label={b.label}
              active={b.id === activeBrushId}
              onPress={() => onSelectBrush(b.id)}
              testID={`tool-${b.id}`}
            />
          ))}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open brush picker"
          onPress={onOpenBrushPicker}
          style={({ pressed }) => [
            styles.moreBtn,
            pressed && styles.tilePressed,
          ]}
          testID="tool-more"
        >
          <Text style={styles.moreEmoji}>＋</Text>
        </Pressable>
      </View>

      {/* Row 2: Tint slider */}
      <TintSlider
        baseColor={activeColor}
        value={tint}
        onChange={onTintChange}
      />

      {/* Row 3: Palette swatches */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.swatchesScroll}
      >
        {activePalette.swatches.map((sw) => (
          <SwatchTile
            key={sw.id}
            color={sw.hex}
            active={sw.hex.toUpperCase() === activeColor.toUpperCase()}
            onPress={() => onSelectColor(sw.hex)}
            testID={`swatch-${sw.id}`}
          />
        ))}
      </ScrollView>

      {/* Row 4: Palette nav + eyedropper + recent colors */}
      <View style={styles.bottomRow}>
        <View style={styles.paletteNav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous palette"
            hitSlop={8}
            onPress={onPrevPalette}
            style={({ pressed }) => [
              styles.navBtn,
              pressed && styles.tilePressed,
            ]}
            testID="palette-prev"
          >
            <Text style={styles.navArrow}>‹</Text>
          </Pressable>
          <View style={styles.paletteLabelBox}>
            <Text style={styles.paletteEmoji}>{activePalette.emoji}</Text>
            <Text style={styles.paletteLabel} numberOfLines={1}>
              {activePalette.title}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next palette"
            hitSlop={8}
            onPress={onNextPalette}
            style={({ pressed }) => [
              styles.navBtn,
              pressed && styles.tilePressed,
            ]}
            testID="palette-next"
          >
            <Text style={styles.navArrow}>›</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: eyedropperActive }}
          accessibilityLabel="Eyedropper"
          onPress={onToggleEyedropper}
          style={({ pressed }) => [
            styles.eyedropperBtn,
            eyedropperActive && styles.eyedropperBtnActive,
            pressed && styles.tilePressed,
          ]}
          testID="tool-eyedropper"
        >
          <Text style={styles.eyedropperEmoji}>💧</Text>
        </Pressable>

        <View style={styles.recentRow}>
          {recentColors.slice(0, 5).map((hex, i) => (
            <Pressable
              key={`${hex}-${i}`}
              accessibilityRole="button"
              accessibilityLabel={`Recent colour ${hex}`}
              onPress={() => onSelectColor(hex)}
              style={[styles.recentDot, { backgroundColor: hex }]}
              testID={`recent-${i}`}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// ---- Sub-components --------------------------------------------------------

const ToolTile: React.FC<{
  emoji: string;
  label: string;
  active: boolean;
  onPress: () => void;
  testID?: string;
}> = ({ emoji, label, active, onPress, testID }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    accessibilityLabel={label}
    onPress={onPress}
    style={({ pressed }) => [
      styles.tile,
      active && styles.tileActive,
      pressed && styles.tilePressed,
    ]}
    testID={testID}
  >
    <Text style={styles.tileEmoji}>{emoji}</Text>
  </Pressable>
);

const SwatchTile: React.FC<{
  color: string;
  active: boolean;
  onPress: () => void;
  testID?: string;
}> = ({ color, active, onPress, testID }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    accessibilityLabel={`Colour ${color}`}
    onPress={onPress}
    style={({ pressed }) => [
      styles.swatch,
      { backgroundColor: color },
      active && styles.swatchActive,
      pressed && styles.tilePressed,
    ]}
    testID={testID}
  />
);

// ---- Tint slider ----------------------------------------------------------

interface TintSliderProps {
  baseColor: string;
  value: number;
  onChange: (v: number) => void;
}

/**
 * Lightweight horizontal tint slider. We don't pull in
 * `@react-native-community/slider` — a single Pressable that maps tap/drag x
 * to 0..1 is enough for this UI. The track is split into white / colour /
 * black thirds so the user can see what each end of the slider does.
 */
const TintSlider: React.FC<TintSliderProps> = ({
  baseColor,
  value,
  onChange,
}) => {
  const trackRef = React.useRef<View>(null);
  const widthRef = React.useRef<number>(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
  };

  const updateFromEvent = (e: GestureResponderEvent) => {
    const w = widthRef.current;
    if (!w) return;
    const x = Math.max(0, Math.min(w, e.nativeEvent.locationX));
    onChange(x / w);
  };

  const lightHalf = applyTint(baseColor, 0);
  const darkHalf = applyTint(baseColor, 1);
  const thumbColor = applyTint(baseColor, value);

  return (
    <View style={styles.tintRow}>
      <View
        ref={trackRef}
        onLayout={handleLayout}
        style={styles.tintTrack}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={updateFromEvent}
        onResponderMove={updateFromEvent}
      >
        <View style={[styles.tintSegment, { backgroundColor: lightHalf }]} />
        <View style={[styles.tintSegment, { backgroundColor: baseColor }]} />
        <View style={[styles.tintSegment, { backgroundColor: darkHalf }]} />
        <View
          pointerEvents="none"
          style={[
            styles.tintThumb,
            {
              left: `${value * 100}%`,
              backgroundColor: thumbColor,
              borderColor: isLight(thumbColor) ? colors.text : colors.surface,
            },
          ]}
        />
      </View>
    </View>
  );
};

// ---- Styles ---------------------------------------------------------------

const SWATCH_SIZE = 36;
const TILE_SIZE = 52;

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    ...shadow.card,
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  toolsScroll: {
    paddingRight: spacing.sm,
    alignItems: 'center',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileActive: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
  },
  tilePressed: {
    opacity: 0.7,
  },
  tileEmoji: {
    fontSize: 26,
  },
  moreBtn: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  moreEmoji: {
    fontSize: 28,
    color: colors.textOnBrand,
    fontWeight: '700',
    lineHeight: 30,
  },
  tintRow: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  tintTrack: {
    flexDirection: 'row',
    height: 22,
    borderRadius: 11,
    overflow: 'visible',
    backgroundColor: colors.border,
    position: 'relative',
  },
  tintSegment: {
    flex: 1,
    height: '100%',
  },
  tintThumb: {
    position: 'absolute',
    top: -3,
    width: 28,
    height: 28,
    marginLeft: -14,
    borderRadius: 14,
    borderWidth: 3,
    ...shadow.button,
  },
  swatchesScroll: {
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
    marginRight: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border,
  },
  swatchActive: {
    borderColor: colors.brandDeep,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  paletteNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
  },
  navBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontSize: 22,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '700',
  },
  paletteLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'center',
  },
  paletteEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  paletteLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  eyedropperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  eyedropperBtnActive: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
  },
  eyedropperEmoji: {
    fontSize: 18,
  },
  recentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  recentDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
});
