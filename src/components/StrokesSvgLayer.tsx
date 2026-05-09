import React from 'react';
import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  Path,
  Polygon,
  Rect,
} from 'react-native-svg';

import { getBrush } from '@/data/brushes';
import type {
  RegionGeometry,
  RegionShape,
  Stroke,
  StrokePoint,
} from '@/data/types';
import { generateStamps } from '@/utils/brushRender';

interface StrokesSvgLayerProps {
  strokes: Stroke[];
  geometry: RegionGeometry;
}

/**
 * Render a list of brush strokes as SVG primitives inside an existing `<Svg>`
 * container. Dispatches on each stroke's `brushTypeId`:
 *
 *   - 'path'  → smooth `<Path>` (Bézier through midpoints).
 *   - 'stamp' → scatter of `<Circle>` stamps along the trail.
 *   - 'fill'  → solid region fill (uses the stroke's regionId).
 *
 * Strokes that captured a `regionId` (stay-inside-lines) are clipped to the
 * matching region. Used by `PageThumbnail` so saved artworks display in
 * Gallery/My Creations without instantiating Skia per tile.
 */
export const StrokesSvgLayer: React.FC<StrokesSvgLayerProps> = ({
  strokes,
  geometry,
}) => {
  const clipped = strokes.filter(
    (s) =>
      s.brushTypeId !== 'bucket' &&
      s.regionId !== null &&
      geometry[s.regionId] !== undefined,
  );
  return (
    <>
      <Defs>
        {clipped.map((s) => (
          <ClipPath key={`cp-${s.id}`} id={`cp-${s.id}`}>
            {regionToSvg(geometry[s.regionId as string])}
          </ClipPath>
        ))}
      </Defs>
      {strokes.map((s) => (
        <StrokeShape
          key={s.id}
          stroke={s}
          geometry={geometry}
          clipUrl={
            s.brushTypeId !== 'bucket' && s.regionId && geometry[s.regionId]
              ? `url(#cp-${s.id})`
              : undefined
          }
        />
      ))}
    </>
  );
};

const StrokeShape: React.FC<{
  stroke: Stroke;
  geometry: RegionGeometry;
  clipUrl: string | undefined;
}> = ({ stroke, geometry, clipUrl }) => {
  const brush = getBrush(stroke.brushTypeId ?? 'brush') ?? getBrush('brush')!;
  const opacity = stroke.opacity ?? brush.opacity ?? 1;

  if (brush.kind === 'fill') {
    if (!stroke.regionId || !geometry[stroke.regionId]) return null;
    return (
      <FillShape
        shape={geometry[stroke.regionId]}
        color={stroke.color}
        opacity={opacity}
      />
    );
  }

  if (brush.kind === 'stamp') {
    const stamps = generateStamps(stroke, brush);
    return (
      <>
        {stamps.map((s, i) => (
          <Circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={Math.max(0.5, s.diameter / 2)}
            fill={stroke.color}
            opacity={opacity * s.alpha}
            clipPath={clipUrl}
          />
        ))}
      </>
    );
  }

  return (
    <Path
      d={strokeToD(stroke.points)}
      stroke={stroke.color}
      strokeWidth={stroke.size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      clipPath={clipUrl}
    />
  );
};

const FillShape: React.FC<{
  shape: RegionShape;
  color: string;
  opacity: number;
}> = ({ shape, color, opacity }) => {
  switch (shape.type) {
    case 'circle':
      return (
        <Circle
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={color}
          opacity={opacity}
        />
      );
    case 'ellipse':
      return (
        <Ellipse
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          fill={color}
          opacity={opacity}
        />
      );
    case 'rect':
      return (
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx ?? 0}
          fill={color}
          opacity={opacity}
        />
      );
    case 'polygon':
      return (
        <Polygon
          points={shape.points.map(([x, y]) => `${x},${y}`).join(' ')}
          fill={color}
          opacity={opacity}
        />
      );
    case 'path':
      return <Path d={shape.d} fill={color} opacity={opacity} />;
    default:
      return null;
  }
};

const strokeToD = (points: StrokePoint[]): string => {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const { x, y } = points[0];
    return `M${x} ${y} L${x + 0.01} ${y + 0.01}`;
  }
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const cx = points[i].x;
    const cy = points[i].y;
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    d += ` Q${cx} ${cy} ${mx} ${my}`;
  }
  const last = points[points.length - 1];
  d += ` L${last.x} ${last.y}`;
  return d;
};

const regionToSvg = (shape: RegionShape): React.ReactElement | null => {
  switch (shape.type) {
    case 'circle':
      return <Circle cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'ellipse':
      return (
        <Ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />
      );
    case 'rect':
      return (
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx ?? 0}
        />
      );
    case 'polygon':
      return (
        <Polygon
          points={shape.points.map(([x, y]) => `${x},${y}`).join(' ')}
        />
      );
    case 'path':
      return <Path d={shape.d} />;
    default:
      return null;
  }
};
