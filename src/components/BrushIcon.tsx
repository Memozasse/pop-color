// Premium iOS-style brush icons.
//
// Each brush in the registry has a hand-authored SVG icon here, replacing the
// emoji we used in V3. The visual language:
//
//   - Tool body in a dark "graphite" tone with a subtle highlight stripe.
//   - Metallic ferrule / cap in a soft silver.
//   - The "business end" (bristles, nib, paint, etc.) picks up the user's
//     active brush colour so the tile in the picker reflects what the brush
//     will actually paint.
//   - Soft drop shadow under the tool for depth (mimics SF Symbols /
//     Procreate's tool icons).
//   - Hand-held tools (brushes, pens, pencil) are tilted -25° so they feel
//     like they're being held, the way Procreate Pocket renders them.
//
// The component takes only the brush id + a paint colour, and renders
// `<Svg>` content sized to fit a square `size` box. The caller is
// responsible for layout — typically a 56×56 box on toolbar tiles, 72×72 in
// the picker modal.

import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { colors as theme } from '@/theme';

interface BrushIconProps {
  /** Brush id from the registry (e.g. 'brush', 'pencil', …). */
  brushId: string;
  /** Pixel size of the rendered square icon. */
  size?: number;
  /** Active paint colour applied to the brush's "business end". */
  paintColor?: string;
  /** Optional override for the dark tool body. */
  bodyColor?: string;
  /** Optional override for ferrule / metal accents. */
  metalColor?: string;
  /** Whether to render the soft drop shadow under the tool. */
  shadow?: boolean;
}

const DEFAULT_BODY = '#3A3548';
const DEFAULT_METAL = '#B8B3C7';
const DEFAULT_WOOD = '#E5C28E';
const DEFAULT_PAPER_WRAP = '#F2E2C8';
const DEFAULT_GRAPHITE = '#2A2540';
const DEFAULT_HIGHLIGHT = 'rgba(255, 255, 255, 0.18)';
const DEFAULT_SHADOW = 'rgba(31, 27, 48, 0.16)';

/**
 * Premium iOS-style icon for one brush in the registry. Falls back to a
 * neutral round dot for unknown ids so the toolbar never crashes if a new
 * brush is added before its icon.
 */
export const BrushIcon: React.FC<BrushIconProps> = ({
  brushId,
  size = 56,
  paintColor = theme.brand,
  bodyColor = DEFAULT_BODY,
  metalColor = DEFAULT_METAL,
  shadow = true,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {shadow ? (
        <Ellipse
          cx={50}
          cy={84}
          rx={28}
          ry={4}
          fill={DEFAULT_SHADOW}
        />
      ) : null}
      {renderBrushBody(brushId, paintColor, bodyColor, metalColor)}
    </Svg>
  );
};

function renderBrushBody(
  brushId: string,
  paint: string,
  body: string,
  metal: string,
): React.ReactNode {
  switch (brushId) {
    case 'eraser':
      return <EraserBody body={body} band={'#FFD0DD'} />;
    case 'bucket':
      return <BucketBody paint={paint} metal={metal} />;
    case 'brush':
      return <BrushBody paint={paint} body={body} metal={metal} thick={false} />;
    case 'big-brush':
      return <BrushBody paint={paint} body={body} metal={metal} thick />;
    case 'pencil':
      return <PencilBody />;
    case 'marker':
      return <MarkerBody paint={paint} body={body} />;
    case 'tech-pen':
      return <TechPenBody paint={paint} body={body} metal={metal} />;
    case 'ball-pen':
      return <BallPenBody paint={paint} body={body} metal={metal} />;
    case 'watercolor':
      return <WatercolorBody paint={paint} body={body} metal={metal} />;
    case 'airbrush':
      return <AirbrushBody paint={paint} body={body} metal={metal} />;
    case 'spray':
      return <SprayBody paint={paint} body={body} />;
    case 'pastel':
      return <PastelBody paint={paint} />;
    case 'splatter':
      return <SplatterBody paint={paint} />;
    case 'eyedropper':
      return <EyedropperBody paint={paint} metal={metal} />;
    default:
      return <Circle cx={50} cy={50} r={18} fill={paint} />;
  }
}

// ---------------------------------------------------------------------------
// Tool bodies. Each function takes its tool colours and returns the inner
// `<G>` of the SVG (no <Svg> wrapper, no shadow, no sizing — those live in
// the parent). Coordinates use a 100×100 viewBox.
// ---------------------------------------------------------------------------

const EraserBody: React.FC<{ body: string; band: string }> = ({ body, band }) => (
  <G transform="rotate(-22 50 50)">
    {/* Eraser body */}
    <Rect
      x={20}
      y={32}
      width={60}
      height={32}
      rx={6}
      ry={6}
      fill={body}
    />
    {/* Pink rubber band */}
    <Rect
      x={20}
      y={32}
      width={60}
      height={12}
      rx={6}
      ry={6}
      fill={band}
    />
    {/* Cover the bottom radius of the band so the seam looks crisp */}
    <Rect x={20} y={40} width={60} height={4} fill={band} />
    {/* Top highlight */}
    <Rect
      x={22}
      y={34}
      width={56}
      height={2}
      rx={1}
      ry={1}
      fill={DEFAULT_HIGHLIGHT}
    />
  </G>
);

const BucketBody: React.FC<{ paint: string; metal: string }> = ({
  paint,
  metal,
}) => (
  <G>
    {/* Handle */}
    <Path
      d="M 24 26 Q 50 4 76 26"
      stroke={metal}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
    />
    {/* Bucket body — slight trapezoid */}
    <Path
      d="M 22 28 L 78 28 L 70 78 L 30 78 Z"
      fill={metal}
    />
    {/* Inner shadow lip */}
    <Path
      d="M 22 28 L 78 28 L 76 34 L 24 34 Z"
      fill="rgba(0,0,0,0.18)"
    />
    {/* Paint inside (drop) */}
    <Path
      d="M 28 38 Q 50 30 72 38 L 68 70 Q 50 76 32 70 Z"
      fill={paint}
    />
    {/* Paint drip running down the side */}
    <Path
      d="M 70 38 Q 80 50 78 60 Q 74 56 72 50 Q 70 44 70 38 Z"
      fill={paint}
    />
    {/* Highlight stripe */}
    <Path
      d="M 28 30 L 36 30 L 32 76 L 30 76 Z"
      fill={DEFAULT_HIGHLIGHT}
    />
  </G>
);

const BrushBody: React.FC<{
  paint: string;
  body: string;
  metal: string;
  thick: boolean;
}> = ({ paint, body, metal, thick }) => {
  const tipWidth = thick ? 28 : 18;
  const ferruleWidth = thick ? 24 : 16;
  return (
    <G transform="rotate(-30 50 50)">
      {/* Wooden handle */}
      <Rect
        x={62}
        y={46}
        width={26}
        height={8}
        rx={4}
        ry={4}
        fill={body}
      />
      {/* Handle highlight */}
      <Rect
        x={64}
        y={47}
        width={22}
        height={1.5}
        rx={0.75}
        ry={0.75}
        fill={DEFAULT_HIGHLIGHT}
      />
      {/* Ferrule */}
      <Rect
        x={48}
        y={50 - ferruleWidth / 2}
        width={16}
        height={ferruleWidth}
        rx={2}
        ry={2}
        fill={metal}
      />
      <Rect
        x={48}
        y={50 - ferruleWidth / 2 + 2}
        width={16}
        height={1.5}
        fill={DEFAULT_HIGHLIGHT}
      />
      {/* Bristles — a tapered trapezoid */}
      <Path
        d={`M 50 ${50 - tipWidth / 2}
            L 12 ${50 - tipWidth / 4 - 1}
            Q 8 50 12 ${50 + tipWidth / 4 + 1}
            L 50 ${50 + tipWidth / 2} Z`}
        fill={paint}
      />
      {/* Bristle texture lines */}
      <Path
        d={`M 14 ${50 - tipWidth / 6}
            L 46 ${50 - tipWidth / 4}`}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <Path
        d={`M 14 ${50 + tipWidth / 6}
            L 46 ${50 + tipWidth / 4}`}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={1}
        strokeLinecap="round"
      />
    </G>
  );
};

const PencilBody: React.FC = () => (
  <G transform="rotate(-30 50 50)">
    <Defs>
      <LinearGradient id="pencilWood" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F4D08B" />
        <Stop offset="1" stopColor={DEFAULT_WOOD} />
      </LinearGradient>
    </Defs>
    {/* Eraser end (pink) */}
    <Rect x={78} y={45} width={10} height={10} rx={2} ry={2} fill="#FF8AA8" />
    {/* Metal ferrule */}
    <Rect x={72} y={45} width={6} height={10} fill={DEFAULT_METAL} />
    <Rect x={72} y={47} width={6} height={1.5} fill={DEFAULT_HIGHLIGHT} />
    {/* Wooden hex barrel */}
    <Path
      d="M 24 45 L 72 45 L 72 55 L 24 55 Z"
      fill="url(#pencilWood)"
    />
    {/* Hex top edge highlight */}
    <Path
      d="M 24 45 L 72 45 L 72 47 L 24 47 Z"
      fill="rgba(255,255,255,0.25)"
    />
    {/* Sharpened cone (raw wood) */}
    <Path
      d="M 24 45 L 14 50 L 24 55 Z"
      fill="#FBE5BB"
    />
    {/* Graphite tip */}
    <Path
      d="M 18 47.5 L 14 50 L 18 52.5 Z"
      fill={DEFAULT_GRAPHITE}
    />
  </G>
);

const MarkerBody: React.FC<{ paint: string; body: string }> = ({
  paint,
  body,
}) => (
  <G transform="rotate(-30 50 50)">
    {/* Cap */}
    <Rect
      x={68}
      y={42}
      width={20}
      height={16}
      rx={4}
      ry={4}
      fill={body}
    />
    <Rect x={68} y={44} width={20} height={1.5} fill={DEFAULT_HIGHLIGHT} />
    {/* Body — usually marker body matches cap colour but here we pick paint */}
    <Rect
      x={28}
      y={44}
      width={40}
      height={12}
      rx={2}
      ry={2}
      fill={paint}
    />
    <Rect x={28} y={45} width={40} height={1.5} fill={DEFAULT_HIGHLIGHT} />
    {/* Brand band */}
    <Rect x={36} y={44} width={6} height={12} fill={body} />
    {/* Chisel tip */}
    <Path
      d="M 28 44 L 14 47 L 14 53 L 28 56 Z"
      fill={paint}
    />
  </G>
);

const TechPenBody: React.FC<{
  paint: string;
  body: string;
  metal: string;
}> = ({ paint, body, metal }) => (
  <G transform="rotate(-30 50 50)">
    {/* Body */}
    <Rect x={36} y={47} width={40} height={6} rx={3} ry={3} fill={body} />
    <Rect x={38} y={47.5} width={36} height={1.2} fill={DEFAULT_HIGHLIGHT} />
    {/* End cap */}
    <Rect x={74} y={45.5} width={10} height={9} rx={2} ry={2} fill={metal} />
    {/* Front cone (metal) */}
    <Path
      d="M 36 47 L 22 49 L 22 51 L 36 53 Z"
      fill={metal}
    />
    {/* Nib */}
    <Path
      d="M 22 49.5 L 14 50 L 22 50.5 Z"
      fill={paint}
    />
  </G>
);

const BallPenBody: React.FC<{
  paint: string;
  body: string;
  metal: string;
}> = ({ paint, body, metal }) => (
  <G transform="rotate(-30 50 50)">
    {/* Body */}
    <Rect x={32} y={47} width={42} height={6} rx={3} ry={3} fill={body} />
    <Rect x={34} y={47.5} width={38} height={1.2} fill={DEFAULT_HIGHLIGHT} />
    {/* Clip */}
    <Rect x={56} y={44} width={2} height={6} rx={1} ry={1} fill={metal} />
    {/* End cap */}
    <Rect x={72} y={46} width={6} height={8} rx={2} ry={2} fill={metal} />
    {/* Tapered tip */}
    <Path
      d="M 32 47 L 18 49.5 L 18 50.5 L 32 53 Z"
      fill={metal}
    />
    {/* Ball tip */}
    <Circle cx={16.5} cy={50} r={1.6} fill={paint} />
  </G>
);

const WatercolorBody: React.FC<{
  paint: string;
  body: string;
  metal: string;
}> = ({ paint, body, metal }) => (
  <G>
    {/* Brush, mostly upright with a soft tip */}
    <G transform="rotate(-30 50 50)">
      <Rect x={62} y={46} width={26} height={8} rx={4} ry={4} fill={body} />
      <Rect x={64} y={47} width={22} height={1.5} fill={DEFAULT_HIGHLIGHT} />
      <Rect x={48} y={42} width={16} height={16} rx={2} ry={2} fill={metal} />
      {/* Soft, rounded bristles (no harsh tip) */}
      <Path
        d="M 50 38 Q 18 38 12 50 Q 18 62 50 62 Z"
        fill={paint}
        opacity={0.85}
      />
    </G>
    {/* Water droplet floating beside the brush */}
    <Path
      d="M 22 70 Q 18 78 22 84 Q 26 78 22 70 Z"
      fill={paint}
      opacity={0.55}
    />
  </G>
);

const AirbrushBody: React.FC<{
  paint: string;
  body: string;
  metal: string;
}> = ({ paint, body, metal }) => (
  <G>
    {/* Spray gun body */}
    <G>
      {/* Tank */}
      <Circle cx={62} cy={36} r={8} fill={metal} />
      <Circle cx={60} cy={34} r={2.5} fill={DEFAULT_HIGHLIGHT} />
      {/* Barrel */}
      <Rect x={36} y={42} width={36} height={10} rx={3} ry={3} fill={body} />
      <Rect x={38} y={43} width={32} height={1.5} fill={DEFAULT_HIGHLIGHT} />
      {/* Trigger */}
      <Path
        d="M 60 52 L 64 52 L 62 62 L 58 62 Z"
        fill={body}
      />
      {/* Nozzle */}
      <Rect x={28} y={45} width={8} height={4} fill={metal} />
    </G>
    {/* Spray cloud */}
    <Circle cx={20} cy={47} r={2} fill={paint} opacity={0.9} />
    <Circle cx={14} cy={43} r={1.5} fill={paint} opacity={0.7} />
    <Circle cx={14} cy={51} r={1.4} fill={paint} opacity={0.7} />
    <Circle cx={8} cy={47} r={1} fill={paint} opacity={0.55} />
    <Circle cx={9} cy={40} r={1} fill={paint} opacity={0.45} />
    <Circle cx={10} cy={55} r={1.2} fill={paint} opacity={0.5} />
  </G>
);

const SprayBody: React.FC<{ paint: string; body: string }> = ({
  paint,
  body,
}) => (
  <G>
    {/* Can body */}
    <Rect x={48} y={28} width={28} height={48} rx={4} ry={4} fill={body} />
    {/* Top cap */}
    <Rect x={52} y={20} width={20} height={10} rx={3} ry={3} fill={DEFAULT_METAL} />
    {/* Nozzle */}
    <Rect x={42} y={24} width={8} height={4} fill={DEFAULT_METAL} />
    {/* Label */}
    <Rect x={50} y={42} width={24} height={20} fill={DEFAULT_HIGHLIGHT} />
    {/* Body highlight */}
    <Rect x={50} y={30} width={2.5} height={44} fill={DEFAULT_HIGHLIGHT} />
    {/* Spray particles aimed left */}
    <Circle cx={32} cy={26} r={1.3} fill={paint} opacity={0.85} />
    <Circle cx={26} cy={20} r={1} fill={paint} opacity={0.7} />
    <Circle cx={26} cy={32} r={1.2} fill={paint} opacity={0.7} />
    <Circle cx={18} cy={26} r={0.9} fill={paint} opacity={0.55} />
    <Circle cx={18} cy={36} r={0.8} fill={paint} opacity={0.5} />
    <Circle cx={18} cy={16} r={0.8} fill={paint} opacity={0.5} />
    <Circle cx={10} cy={26} r={0.7} fill={paint} opacity={0.4} />
  </G>
);

const PastelBody: React.FC<{ paint: string }> = ({ paint }) => (
  <G transform="rotate(-30 50 50)">
    {/* Wax core (full length) */}
    <Rect x={18} y={44} width={64} height={12} rx={3} ry={3} fill={paint} />
    {/* Paper wrapper across the middle */}
    <Rect x={36} y={43} width={28} height={14} fill={DEFAULT_PAPER_WRAP} />
    {/* Wrapper top stripe */}
    <Rect x={36} y={43} width={28} height={2} fill="#D9C3A4" />
    {/* Wrapper bottom stripe */}
    <Rect x={36} y={55} width={28} height={2} fill="#D9C3A4" />
    {/* Tapered/rounded tip on the left */}
    <Path
      d="M 18 44 L 12 50 L 18 56 Z"
      fill={paint}
      opacity={0.85}
    />
    {/* Body highlight */}
    <Rect x={20} y={45} width={62} height={2} fill={DEFAULT_HIGHLIGHT} />
  </G>
);

const SplatterBody: React.FC<{ paint: string }> = ({ paint }) => (
  <G>
    {/* Center mass */}
    <Path
      d="M 50 30
         Q 60 38 56 48
         Q 70 50 66 60
         Q 60 70 50 66
         Q 40 70 36 60
         Q 30 50 42 48
         Q 38 38 50 30 Z"
      fill={paint}
    />
    {/* Outer droplets */}
    <Circle cx={28} cy={28} r={3} fill={paint} />
    <Circle cx={74} cy={32} r={2.4} fill={paint} />
    <Circle cx={80} cy={62} r={2.8} fill={paint} />
    <Circle cx={22} cy={64} r={2.2} fill={paint} />
    <Circle cx={50} cy={20} r={2} fill={paint} />
    <Circle cx={86} cy={48} r={1.6} fill={paint} />
    <Circle cx={14} cy={48} r={1.6} fill={paint} />
    {/* Small specks */}
    <Circle cx={36} cy={20} r={1} fill={paint} />
    <Circle cx={66} cy={20} r={0.8} fill={paint} />
    <Circle cx={76} cy={74} r={1} fill={paint} />
    <Circle cx={26} cy={76} r={0.9} fill={paint} />
  </G>
);

const EyedropperBody: React.FC<{ paint: string; metal: string }> = ({
  paint,
  metal,
}) => (
  <G transform="rotate(-30 50 50)">
    {/* Bulb (top end) */}
    <Rect x={70} y={42} width={18} height={16} rx={4} ry={4} fill={metal} />
    {/* Bulb highlight */}
    <Rect x={72} y={43} width={14} height={2} fill={DEFAULT_HIGHLIGHT} />
    {/* Stem (glass) */}
    <Rect x={28} y={47} width={42} height={6} rx={2} ry={2} fill={metal} opacity={0.55} />
    {/* Glass highlight */}
    <Rect x={30} y={47.5} width={38} height={1.2} fill={DEFAULT_HIGHLIGHT} />
    {/* Tapered tip */}
    <Path
      d="M 28 47 L 14 49.5 L 14 50.5 L 28 53 Z"
      fill={metal}
    />
    {/* Drop being sampled */}
    <Path
      d="M 14 50 Q 8 56 12 60 Q 16 56 14 50 Z"
      fill={paint}
    />
  </G>
);
