import {
  BlurMask,
  Circle,
  Group,
  Path as SkiaPath,
  type SkPath,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';

import { getBrush } from '@/data/brushes';
import type { Stroke } from '@/data/types';
import { generateStamps } from '@/utils/brushRender';

interface SkiaStrokeViewProps {
  stroke: Stroke;
  /**
   * Pre-computed Skia path of the smoothed brush trail (or null if the stroke
   * is rendered via stamps or a region fill). Caller owns the path.
   */
  pathTrail: SkPath | null;
  /** Optional clip path (e.g. for stay-inside-lines). */
  clip?: SkPath | null;
  /**
   * Region path used for 'fill' (bucket) strokes. Required when brush.kind
   * is 'fill'.
   */
  regionPath?: SkPath | null;
}

/**
 * Render one committed brush stroke on the Skia canvas, dispatching on the
 * stroke's `brushTypeId` to apply the right paint properties:
 *
 *   - 'path' brushes  → a smooth Path with strokeWidth/opacity/blur.
 *   - 'stamp' brushes → a deterministic burst of Circles along the trail.
 *   - 'fill' brushes  → solid fill of the captured region path.
 *
 * Strokes that pre-date the brush registry (no `brushTypeId`) default to the
 * basic 'brush' so existing V2 artworks keep rendering identically.
 */
export const SkiaStrokeView: React.FC<SkiaStrokeViewProps> = ({
  stroke,
  pathTrail,
  clip = null,
  regionPath = null,
}) => {
  const brush = getBrush(stroke.brushTypeId ?? 'brush');
  const safeBrush = brush ?? getBrush('brush')!;

  const stamps = useMemo(
    () => (safeBrush.kind === 'stamp' ? generateStamps(stroke, safeBrush) : []),
    [stroke, safeBrush],
  );

  const opacity = stroke.opacity ?? safeBrush.opacity ?? 1;
  const color = stroke.color;

  let body: React.ReactNode = null;

  if (safeBrush.kind === 'fill') {
    if (!regionPath) return null;
    body = (
      <SkiaPath
        path={regionPath}
        color={color}
        style="fill"
        opacity={opacity}
      />
    );
  } else if (safeBrush.kind === 'stamp') {
    if (stamps.length === 0) return null;
    body = (
      <Group opacity={opacity}>
        {stamps.map((s, i) => (
          <Circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={Math.max(0.5, s.diameter / 2)}
            color={color}
            opacity={s.alpha}
          />
        ))}
      </Group>
    );
  } else {
    if (!pathTrail) return null;
    body = (
      <SkiaPath
        path={pathTrail}
        color={color}
        style="stroke"
        strokeWidth={stroke.size}
        strokeCap="round"
        strokeJoin="round"
        opacity={opacity}
      >
        {safeBrush.blur > 0 ? (
          <BlurMask blur={safeBrush.blur} style="normal" />
        ) : null}
      </SkiaPath>
    );
  }

  if (clip) {
    return <Group clip={clip}>{body}</Group>;
  }
  return <>{body}</>;
};
