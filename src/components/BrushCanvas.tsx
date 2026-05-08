import {
  Canvas,
  Group,
  Path as SkiaPath,
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
import { StyleSheet, View, type ViewStyle } from 'react-native';
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

import type {
  PageDefinition,
  Stroke,
  StrokePoint,
} from '@/data/types';
import { OutlineOnlyContext } from '@/pages/Region';
import { createStroke } from '@/state/brushStore';
import { colors, radius, shadow } from '@/theme';
import {
  compileRegionGeometry,
  findRegionAt,
} from '@/utils/regionToSkPath';

const PAPER = '#FFFFFF';

interface BrushCanvasProps {
  page: PageDefinition;
  size: number;
  strokes: Stroke[];
  activeColor: string;
  brushSize: number;
  isErasing: boolean;
  stayInside: boolean;
  onStrokeEnd: (stroke: Stroke) => void;
  onTwoFingerTap?: () => void;
  onThreeFingerTap?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export interface BrushCanvasHandle {
  resetTransform: () => void;
}

/**
 * V2 brush engine.
 *
 * Renders an Skia canvas with all committed brush strokes (clipped to their
 * captured regions when stay-inside-lines was on) plus the in-progress draft
 * stroke, then overlays the page outline as a transparent-fill SVG.
 *
 * Multi-touch gestures (composed via react-native-gesture-handler):
 *   - 1-finger pan          → freehand brush stroke
 *   - 2-finger pinch        → zoom
 *   - 2-finger rotation     → rotate
 *   - 2-finger pan          → translate
 *   - 2-finger tap          → undo (via onTwoFingerTap)
 *   - 3-finger tap          → redo (via onThreeFingerTap)
 */
export const BrushCanvas = forwardRef<BrushCanvasHandle, BrushCanvasProps>(
  (
    {
      page,
      size,
      strokes,
      activeColor,
      brushSize,
      isErasing,
      stayInside,
      onStrokeEnd,
      onTwoFingerTap,
      onThreeFingerTap,
      style,
      testID,
    },
    ref,
  ) => {
    const Component = page.Component;

    // Pre-compile region paths for hit-testing and clipping.
    const compiledRegions = useMemo(
      () => compileRegionGeometry(page.regionGeometry),
      [page.regionGeometry],
    );
    const regionPathsById = useMemo(() => {
      const map: Record<string, SkPath> = {};
      for (const r of compiledRegions) map[r.id] = r.path;
      return map;
    }, [compiledRegions]);

    // Logical-coordinate mapping: gesture coords are in detector pixels, the
    // Skia canvas + SVG share a logical coordinate space (page.width × page.height).
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

    // ----- Inverse transform: detector px → canvas px (then logical) -----
    // This compensates for the user's current zoom/rotate/pan so the brush
    // lands where their finger visually is, even when the canvas is zoomed
    // 2x or rotated 45°.
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
    }
    const [draft, setDraft] = useState<Draft | null>(null);
    const draftRef = useRef<Draft | null>(null);

    const beginStroke = useCallback(
      (touchX: number, touchY: number) => {
        const { x, y } = detectorToCanvas(touchX, touchY);
        const regionId = stayInside
          ? findRegionAt(
              compiledRegions,
              page.regionGeometry,
              x,
              y,
              page.width,
              page.height,
            )
          : null;
        const next: Draft = {
          points: [{ x, y }],
          regionId,
          color: isErasing ? PAPER : activeColor,
          sizePx: brushSize,
          mode: isErasing ? 'erase' : 'draw',
        };
        draftRef.current = next;
        setDraft(next);
      },
      [
        activeColor,
        brushSize,
        compiledRegions,
        detectorToCanvas,
        isErasing,
        page.regionGeometry,
        page.height,
        page.width,
        stayInside,
      ],
    );

    const addPoint = useCallback(
      (touchX: number, touchY: number) => {
        const current = draftRef.current;
        if (!current) return;
        const { x, y } = detectorToCanvas(touchX, touchY);
        // Skip super-close points to avoid jitter and reduce stroke size.
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

    const commitStroke = useCallback(() => {
      const current = draftRef.current;
      if (current && current.points.length > 0) {
        const stroke = createStroke({
          color: current.color,
          size: current.sizePx,
          mode: current.mode,
          regionId: current.regionId,
          points: current.points,
        });
        onStrokeEnd(stroke);
      }
      draftRef.current = null;
      setDraft(null);
    }, [onStrokeEnd]);

    // ----- Gestures -----
    const brushPan = useMemo(
      () =>
        Gesture.Pan()
          .maxPointers(1)
          .averageTouches(true)
          .onBegin((e) => {
            runOnJS(beginStroke)(e.x, e.y);
          })
          .onUpdate((e) => {
            runOnJS(addPoint)(e.x, e.y);
          })
          .onEnd(() => {
            runOnJS(commitStroke)();
          })
          .onFinalize(() => {
            runOnJS(commitStroke)();
          }),
      [beginStroke, addPoint, commitStroke],
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

    // ----- Render committed strokes as Skia paths -----
    const committedPaths = useMemo(() => {
      return strokes.map((stroke) => ({
        stroke,
        skPath: pointsToSkPath(stroke.points),
        clipPath:
          stroke.regionId && stayInsideClip(stroke, regionPathsById)
            ? regionPathsById[stroke.regionId]
            : null,
      }));
    }, [strokes, regionPathsById]);

    // Draft stroke uses the *current* tool settings captured in `draft`.
    const draftSkPath = useMemo(
      () =>
        draft && draft.points.length > 0 ? pointsToSkPath(draft.points) : null,
      [draft],
    );
    const draftClipPath = useMemo(() => {
      if (!draft || !draft.regionId) return null;
      return regionPathsById[draft.regionId] ?? null;
    }, [draft, regionPathsById]);

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
              {/* Paint layer */}
              <Canvas style={[styles.absoluteFill, containerStyle]}>
                <Group
                  transform={[{ scale: size / page.width }]}
                  origin={{ x: 0, y: 0 }}
                >
                  {committedPaths.map(({ stroke, skPath, clipPath }) => (
                    <StrokePathView
                      key={stroke.id}
                      path={skPath}
                      color={stroke.color}
                      width={stroke.size}
                      clip={clipPath}
                    />
                  ))}
                  {draftSkPath && draft ? (
                    <StrokePathView
                      path={draftSkPath}
                      color={draft.color}
                      width={draft.sizePx}
                      clip={draftClipPath}
                    />
                  ) : null}
                </Group>
              </Canvas>

              {/* Outline overlay (transparent fill so paint shows through) */}
              <View style={[styles.absoluteFill, containerStyle]} pointerEvents="none">
                <Svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${page.width} ${page.height}`}
                >
                  <OutlineOnlyContext.Provider value>
                    <Component regionColors={{}} />
                  </OutlineOnlyContext.Provider>
                </Svg>
              </View>
            </Animated.View>
          </View>
        </GestureDetector>
      </View>
    );
  },
);

BrushCanvas.displayName = 'BrushCanvas';

// Render a stroke as a single Skia <Path> with optional clip.
const StrokePathView: React.FC<{
  path: SkPath;
  color: string;
  width: number;
  clip: SkPath | null;
}> = ({ path, color, width, clip }) => {
  const inner = (
    <SkiaPath
      path={path}
      color={color}
      style="stroke"
      strokeWidth={width}
      strokeCap="round"
      strokeJoin="round"
    />
  );
  if (clip) {
    return (
      <Group clip={clip}>
        {inner}
      </Group>
    );
  }
  return inner;
};

const pointsToSkPath = (points: StrokePoint[]): SkPath => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;
  path.moveTo(points[0].x, points[0].y);
  if (points.length === 1) {
    // Single dot — draw as a tiny line so it renders.
    path.lineTo(points[0].x + 0.01, points[0].y + 0.01);
    return path;
  }
  // Smooth via quadratic curves through midpoints (better than poly-lines).
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

const stayInsideClip = (
  stroke: Stroke,
  regionPaths: Record<string, SkPath>,
): boolean => stroke.regionId !== null && !!regionPaths[stroke.regionId];

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
