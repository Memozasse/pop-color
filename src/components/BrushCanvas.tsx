import {
  Canvas,
  Group,
  Skia,
  type SkPath,
} from '@shopify/react-native-skia';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, StyleSheet, View, type ViewStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';

import { SkiaStrokeView } from '@/components/SkiaStrokeView';
import type { BrushConfig } from '@/data/brushes';
import { ERASER_COLOR } from '@/data/palettes';
import type {
  PageDefinition,
  Stroke,
  StrokePoint,
} from '@/data/types';
import { OutlineOnlyContext } from '@/pages/Region';
import { applyTint, createStroke } from '@/state/brushStore';
import { colors, radius, shadow } from '@/theme';
import { sampleColorAt } from '@/utils/brushRender';
import {
  compileRegionGeometry,
  findRegionAt,
} from '@/utils/regionToSkPath';

interface BrushCanvasProps {
  page: PageDefinition;
  size: number;
  strokes: Stroke[];
  /** Active brush configuration (registry id, kind, paint properties). */
  activeBrush: BrushConfig;
  /** User's selected colour BEFORE tint is applied. */
  activeColor: string;
  /** Tint slider position 0..1; 0.5 = no tint. */
  tint: number;
  /** Multiplier on the brush's baseSize (0.4..2.0). */
  sizeMultiplier: number;
  /** When true, the next tap samples a colour and triggers `onEyedropperSample`. */
  eyedropperActive: boolean;
  stayInside: boolean;
  onStrokeEnd: (stroke: Stroke) => void;
  onEyedropperSample?: (color: string) => void;
  onTwoFingerTap?: () => void;
  onThreeFingerTap?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export interface BrushCanvasHandle {
  resetTransform: () => void;
}

type GestureMode = 'paint' | 'fill' | 'eyedrop' | 'idle';

/**
 * V3 brush engine.
 *
 * Renders an Skia canvas with all committed brush strokes (clipped to their
 * captured regions when stay-inside-lines was on) plus the in-progress draft
 * stroke, then overlays the page outline as a transparent-fill SVG (vector)
 * or PNG (raster).
 *
 * Multi-touch gestures (composed via react-native-gesture-handler):
 *   - 1-finger pan          → freehand brush stroke (path / stamp brushes)
 *   - 1-finger tap          → bucket fill (vector pages) or eyedropper sample
 *   - 2-finger pinch        → zoom
 *   - 2-finger rotation     → rotate
 *   - 2-finger pan          → translate
 *   - 2-finger tap          → undo (via onTwoFingerTap)
 *   - 3-finger tap          → redo (via onThreeFingerTap)
 *
 * Brush behaviour is driven by `activeBrush.kind`:
 *   - 'path'  → smooth Bézier stroke with strokeWidth=baseSize*sizeMultiplier
 *               and the brush's opacity / blur.
 *   - 'stamp' → drop deterministic stamp dots along the trail.
 *   - 'fill'  → on tap, fill the tapped region (vector pages only).
 */
export const BrushCanvas = forwardRef<BrushCanvasHandle, BrushCanvasProps>(
  (
    {
      page,
      size,
      strokes,
      activeBrush,
      activeColor,
      tint,
      sizeMultiplier,
      eyedropperActive,
      stayInside,
      onStrokeEnd,
      onEyedropperSample,
      onTwoFingerTap,
      onThreeFingerTap,
      style,
      testID,
    },
    ref,
  ) => {
    // Stay-inside-lines is only meaningful on vector pages.
    const effectiveStayInside = page.kind === 'vector' && stayInside;

    const regionGeometry = useMemo(
      () => (page.kind === 'vector' ? page.regionGeometry : {}),
      [page],
    );
    const compiledRegions = useMemo(
      () => compileRegionGeometry(regionGeometry),
      [regionGeometry],
    );
    const regionPathsById = useMemo(() => {
      const map: Record<string, SkPath> = {};
      for (const r of compiledRegions) map[r.id] = r.path;
      return map;
    }, [compiledRegions]);

    // Effective paint colour (tint applied; eraser overrides to paper).
    const effectiveColor = useMemo(
      () =>
        activeBrush.isEraser ? ERASER_COLOR : applyTint(activeColor, tint),
      [activeBrush.isEraser, activeColor, tint],
    );

    // Effective stroke width = brush.baseSize * user multiplier.
    const effectiveSize = useMemo(
      () => Math.max(1, activeBrush.baseSize * sizeMultiplier),
      [activeBrush.baseSize, sizeMultiplier],
    );

    // Logical-coordinate mapping.
    const toLogical = useCallback(
      (px: number, py: number): { x: number; y: number } => ({
        x: (px / size) * page.width,
        y: (py / size) * page.height,
      }),
      [page.width, page.height, size],
    );

    // ----- Transform shared values (zoom/rotate/pan) -----
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const savedRotation = useSharedValue(0);
    const translateX = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const resetTransform = useCallback(() => {
      scale.value = 1;
      savedScale.value = 1;
      rotation.value = 0;
      savedRotation.value = 0;
      translateX.value = 0;
      savedTranslateX.value = 0;
      translateY.value = 0;
      savedTranslateY.value = 0;
    }, [
      scale,
      savedScale,
      rotation,
      savedRotation,
      translateX,
      savedTranslateX,
      translateY,
      savedTranslateY,
    ]);

    useImperativeHandle(
      ref,
      () => ({ resetTransform }),
      [resetTransform],
    );

    const transformStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}rad` },
      ],
    }));

    // ----- Inverse transform: detector px → canvas px (then logical). -----
    const detectorToCanvas = useCallback(
      (touchX: number, touchY: number): { x: number; y: number } => {
        const tx = translateX.value;
        const ty = translateY.value;
        const s = scale.value;
        const r = rotation.value;
        const pivot = size / 2;

        let x = touchX - tx - pivot;
        let y = touchY - ty - pivot;

        const cos = Math.cos(-r);
        const sin = Math.sin(-r);
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;

        x = rx / s + pivot;
        y = ry / s + pivot;

        return toLogical(x, y);
      },
      [
        size,
        toLogical,
        translateX,
        translateY,
        scale,
        rotation,
      ],
    );

    // ----- Draft stroke (in-progress) -----
    interface Draft {
      points: StrokePoint[];
      regionId: string | null;
      color: string;
      sizePx: number;
      mode: 'draw' | 'erase';
      brushTypeId: string;
      opacity: number;
    }
    const [draft, setDraft] = useState<Draft | null>(null);
    const draftRef = useRef<Draft | null>(null);
    const gestureModeRef = useRef<GestureMode>('idle');

    const beginPaintStroke = useCallback(
      (touchX: number, touchY: number) => {
        const { x, y } = detectorToCanvas(touchX, touchY);
        const regionId = effectiveStayInside
          ? findRegionAt(
              compiledRegions,
              regionGeometry,
              x,
              y,
              page.width,
              page.height,
            )
          : null;
        const next: Draft = {
          points: [{ x, y }],
          regionId,
          color: effectiveColor,
          sizePx: effectiveSize,
          mode: activeBrush.isEraser ? 'erase' : 'draw',
          brushTypeId: activeBrush.id,
          opacity: activeBrush.opacity,
        };
        draftRef.current = next;
        setDraft(next);
      },
      [
        activeBrush,
        compiledRegions,
        detectorToCanvas,
        effectiveColor,
        effectiveSize,
        effectiveStayInside,
        regionGeometry,
        page.height,
        page.width,
      ],
    );

    const addPointToDraft = useCallback(
      (touchX: number, touchY: number) => {
        const current = draftRef.current;
        if (!current) return;
        const { x, y } = detectorToCanvas(touchX, touchY);
        const last = current.points[current.points.length - 1];
        if (last) {
          const dx = x - last.x;
          const dy = y - last.y;
          if (dx * dx + dy * dy < 1) return;
        }
        const next: Draft = {
          ...current,
          points: [...current.points, { x, y }],
        };
        draftRef.current = next;
        setDraft(next);
      },
      [detectorToCanvas],
    );

    const commitPaintStroke = useCallback(() => {
      const current = draftRef.current;
      if (current && current.points.length > 0) {
        const stroke = createStroke({
          color: current.color,
          size: current.sizePx,
          mode: current.mode,
          regionId: current.regionId,
          points: current.points,
          brushTypeId: current.brushTypeId,
          opacity: current.opacity,
        });
        onStrokeEnd(stroke);
      }
      draftRef.current = null;
      setDraft(null);
    }, [onStrokeEnd]);

    const handleBucketTap = useCallback(
      (touchX: number, touchY: number) => {
        if (page.kind !== 'vector') return;
        const { x, y } = detectorToCanvas(touchX, touchY);
        const regionId = findRegionAt(
          compiledRegions,
          regionGeometry,
          x,
          y,
          page.width,
          page.height,
        );
        if (!regionId) return;
        const stroke = createStroke({
          color: effectiveColor,
          size: 0,
          mode: 'draw',
          regionId,
          points: [{ x, y }],
          brushTypeId: activeBrush.id,
          opacity: activeBrush.opacity,
        });
        onStrokeEnd(stroke);
      },
      [
        activeBrush,
        compiledRegions,
        detectorToCanvas,
        effectiveColor,
        onStrokeEnd,
        page,
        regionGeometry,
      ],
    );

    const handleEyedropper = useCallback(
      (touchX: number, touchY: number) => {
        if (!onEyedropperSample) return;
        const { x, y } = detectorToCanvas(touchX, touchY);
        const sampled = sampleColorAt({ x, y }, strokes, ERASER_COLOR);
        onEyedropperSample(sampled);
      },
      [detectorToCanvas, onEyedropperSample, strokes],
    );

    // ----- Pointer dispatch (chooses paint / fill / eyedrop on touch begin) -----
    const handlePointerBegin = useCallback(
      (touchX: number, touchY: number) => {
        if (eyedropperActive) {
          gestureModeRef.current = 'eyedrop';
          handleEyedropper(touchX, touchY);
          return;
        }
        if (activeBrush.kind === 'fill') {
          gestureModeRef.current = 'fill';
          handleBucketTap(touchX, touchY);
          return;
        }
        gestureModeRef.current = 'paint';
        beginPaintStroke(touchX, touchY);
      },
      [
        activeBrush.kind,
        beginPaintStroke,
        eyedropperActive,
        handleBucketTap,
        handleEyedropper,
      ],
    );

    const handlePointerUpdate = useCallback(
      (touchX: number, touchY: number) => {
        if (gestureModeRef.current !== 'paint') return;
        addPointToDraft(touchX, touchY);
      },
      [addPointToDraft],
    );

    const handlePointerEnd = useCallback(() => {
      if (gestureModeRef.current === 'paint') commitPaintStroke();
      gestureModeRef.current = 'idle';
    }, [commitPaintStroke]);

    // ----- Gestures -----
    const brushPan = useMemo(
      () =>
        Gesture.Pan()
          .maxPointers(1)
          .averageTouches(true)
          .onBegin((e) => {
            runOnJS(handlePointerBegin)(e.x, e.y);
          })
          .onUpdate((e) => {
            runOnJS(handlePointerUpdate)(e.x, e.y);
          })
          .onEnd(() => {
            runOnJS(handlePointerEnd)();
          })
          .onFinalize(() => {
            runOnJS(handlePointerEnd)();
          }),
      [handlePointerBegin, handlePointerUpdate, handlePointerEnd],
    );

    const pinch = useMemo(
      () =>
        Gesture.Pinch()
          .onUpdate((e) => {
            scale.value = Math.max(0.4, Math.min(5, savedScale.value * e.scale));
          })
          .onEnd(() => {
            savedScale.value = scale.value;
          }),
      [scale, savedScale],
    );

    const rotate = useMemo(
      () =>
        Gesture.Rotation()
          .onUpdate((e) => {
            rotation.value = savedRotation.value + e.rotation;
          })
          .onEnd(() => {
            savedRotation.value = rotation.value;
          }),
      [rotation, savedRotation],
    );

    const transformPan = useMemo(
      () =>
        Gesture.Pan()
          .minPointers(2)
          .averageTouches(true)
          .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
          })
          .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
          }),
      [translateX, translateY, savedTranslateX, savedTranslateY],
    );

    const twoFingerTap = useMemo(
      () =>
        Gesture.Tap()
          .numberOfTaps(1)
          .minPointers(2)
          .maxDuration(250)
          .onEnd((_e: unknown, success: boolean) => {
            if (success && onTwoFingerTap) runOnJS(onTwoFingerTap)();
          }),
      [onTwoFingerTap],
    );

    const threeFingerTap = useMemo(
      () =>
        Gesture.Tap()
          .numberOfTaps(1)
          .minPointers(3)
          .maxDuration(250)
          .onEnd((_e: unknown, success: boolean) => {
            if (success && onThreeFingerTap) runOnJS(onThreeFingerTap)();
          }),
      [onThreeFingerTap],
    );

    const composed = useMemo(
      () =>
        Gesture.Race(
          brushPan,
          Gesture.Exclusive(
            threeFingerTap,
            twoFingerTap,
            Gesture.Simultaneous(pinch, rotate, transformPan),
          ),
        ),
      [brushPan, threeFingerTap, twoFingerTap, pinch, rotate, transformPan],
    );

    // ----- Render committed strokes -----
    interface PreparedStroke {
      stroke: Stroke;
      pathTrail: SkPath | null;
      clip: SkPath | null;
      regionPath: SkPath | null;
    }
    const committed = useMemo<PreparedStroke[]>(() => {
      return strokes.map((stroke) => {
        const isFill = stroke.brushTypeId === 'bucket';
        return {
          stroke,
          pathTrail: isFill ? null : pointsToSkPath(stroke.points),
          clip:
            !isFill && stroke.regionId
              ? regionPathsById[stroke.regionId] ?? null
              : null,
          regionPath: stroke.regionId
            ? regionPathsById[stroke.regionId] ?? null
            : null,
        };
      });
    }, [strokes, regionPathsById]);

    // Live draft stroke.
    const draftPathTrail = useMemo(
      () =>
        draft && draft.points.length > 0 ? pointsToSkPath(draft.points) : null,
      [draft],
    );
    const draftClip = useMemo(() => {
      if (!draft || !draft.regionId) return null;
      return regionPathsById[draft.regionId] ?? null;
    }, [draft, regionPathsById]);
    const draftAsStroke = useMemo<Stroke | null>(() => {
      if (!draft) return null;
      return {
        id: 'draft',
        color: draft.color,
        size: draft.sizePx,
        mode: draft.mode,
        regionId: draft.regionId,
        points: draft.points,
        brushTypeId: draft.brushTypeId,
        opacity: draft.opacity,
      };
    }, [draft]);

    const containerStyle = useMemo<ViewStyle>(
      () => ({
        width: size,
        height: size,
        borderRadius: radius.lg,
      }),
      [size],
    );

    return (
      <View style={[styles.outer, containerStyle, style]} testID={testID}>
        <GestureDetector gesture={composed}>
          <View style={containerStyle} collapsable={false}>
            <Animated.View
              style={[styles.transformLayer, containerStyle, transformStyle]}
              collapsable={false}
            >
              {/* Paint layer (Skia). */}
              <Canvas style={[styles.absoluteFill, containerStyle]}>
                <Group
                  transform={[{ scale: size / page.width }]}
                  origin={{ x: 0, y: 0 }}
                >
                  {committed.map(
                    ({ stroke, pathTrail, clip, regionPath }) => (
                      <SkiaStrokeView
                        key={stroke.id}
                        stroke={stroke}
                        pathTrail={pathTrail}
                        clip={clip}
                        regionPath={regionPath}
                      />
                    ),
                  )}
                  {draftAsStroke ? (
                    <SkiaStrokeView
                      stroke={draftAsStroke}
                      pathTrail={draftPathTrail}
                      clip={draftClip}
                      regionPath={null}
                    />
                  ) : null}
                </Group>
              </Canvas>

              {/* Outline overlay. */}
              <View
                style={[styles.absoluteFill, containerStyle]}
                pointerEvents="none"
              >
                {page.kind === 'vector' ? (
                  <Svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${page.width} ${page.height}`}
                  >
                    <OutlineOnlyContext.Provider value>
                      <page.Component regionColors={{}} />
                    </OutlineOnlyContext.Provider>
                  </Svg>
                ) : (
                  <Image
                    source={page.source}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: size,
                      height: size,
                      borderRadius: radius.lg,
                    }}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                )}
              </View>
            </Animated.View>
          </View>
        </GestureDetector>
      </View>
    );
  },
);

BrushCanvas.displayName = 'BrushCanvas';

const pointsToSkPath = (points: StrokePoint[]): SkPath => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;
  path.moveTo(points[0].x, points[0].y);
  if (points.length === 1) {
    path.lineTo(points[0].x + 0.01, points[0].y + 0.01);
    return path;
  }
  for (let i = 1; i < points.length - 1; i += 1) {
    const cx = points[i].x;
    const cy = points[i].y;
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    path.quadTo(cx, cy, mx, my);
  }
  const last = points[points.length - 1];
  path.lineTo(last.x, last.y);
  return path;
};

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.paperWhite,
    overflow: 'hidden',
    ...shadow.card,
  },
  transformLayer: {
    backgroundColor: colors.paperWhite,
    overflow: 'hidden',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
