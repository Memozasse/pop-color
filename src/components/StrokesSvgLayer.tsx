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

import type {
  RegionGeometry,
  RegionShape,
  Stroke,
  StrokePoint,
} from '@/data/types';

interface StrokesSvgLayerProps {
  strokes: Stroke[];
  geometry: RegionGeometry;
}

/**
 * Render a list of brush strokes as `<Path>` elements inside an existing
 * `<Svg>` container. Strokes that captured a `regionId` are clipped to the
 * matching region from `geometry`. Used by `PageThumbnail` so saved artworks
 * display correctly without instantiating Skia for every tile.
 */
export const StrokesSvgLayer: React.FC<StrokesSvgLayerProps> = ({
  strokes,
  geometry,
}) => {
  const clipped = strokes.filter(
    (s) => s.regionId !== null && geometry[s.regionId] !== undefined,
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
        <Path
          key={s.id}
          d={strokeToD(s.points)}
          stroke={s.color}
          strokeWidth={s.size}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={
            s.regionId && geometry[s.regionId]
              ? `url(#cp-${s.id})`
              : undefined
          }
        />
      ))}
    </>
  );
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
      return <Ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />;
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
