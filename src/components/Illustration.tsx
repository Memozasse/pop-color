// Hand-authored flat-vector illustrations used across the redesigned chrome
// (Onboarding hero, Home featured card, theme card decorations). Built on
// react-native-svg primitives so they scale infinitely and re-tint cleanly
// without external image assets.
//
// All illustrations share a single colour palette — raspberry brand, cream
// skin, yellow shirt, blue pants, raspberry flowers — matching the
// reference design the user shared.

import React from 'react';
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Rect,
  type SvgProps,
} from 'react-native-svg';

// ---- Palette --------------------------------------------------------------
// Kept local to the illustration so colour changes here don't ripple into
// the rest of the theme by accident.

const ILLUS_COLORS = {
  skin: '#F8D7C2',
  skinShade: '#EFC2A8',
  hair: '#2A2540',
  shirt: '#FFD24C',
  shirtShade: '#E5B53A',
  pants: '#5870B8',
  pantsShade: '#3F5396',
  paletteWood: '#E5C28E',
  paletteWoodShade: '#C5A172',
  brushHandle: '#3A3548',
  brushFerrule: '#B8B3C7',
  raspberry: '#C14A68',
  raspberryDeep: '#A53450',
  leafGreen: '#5DA170',
  paintBlue: '#8999D5',
  paintYellow: '#FFD24C',
  paintGreen: '#7BD389',
  outline: '#1F1B30',
  cheek: '#F6A4B5',
} as const;

// ---- PainterKidIllustration -----------------------------------------------

export interface PainterKidIllustrationProps extends SvgProps {
  /** Square render size in points. Defaults to 200. */
  size?: number;
  /** Override the brush tip + main palette dot colour (defaults to raspberry). */
  brushTipColor?: string;
}

/**
 * A friendly kid character sitting cross-legged, holding a paint palette
 * in their left hand and a paintbrush in their right. Two flowers + a paint
 * splash sit on either side for decoration. Inspired by the meditator
 * illustration in the reference design.
 */
export const PainterKidIllustration: React.FC<PainterKidIllustrationProps> = ({
  size = 200,
  brushTipColor = ILLUS_COLORS.raspberry,
  ...rest
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      {...rest}
    >
      {/* ---- Decorative side flowers + paint splashes ---- */}
      {/* Left side flower */}
      <G transform="translate(20 130)">
        <Path
          d="M0 -8 L0 18"
          stroke={ILLUS_COLORS.leafGreen}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Path
          d="M-1 4 Q -8 4 -8 -2"
          stroke={ILLUS_COLORS.leafGreen}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={0} cy={-10} r={6} fill={ILLUS_COLORS.raspberry} />
        <Circle cx={0} cy={-10} r={2.2} fill={ILLUS_COLORS.paintYellow} />
      </G>

      {/* Right side flower */}
      <G transform="translate(180 135)">
        <Path
          d="M0 -8 L0 18"
          stroke={ILLUS_COLORS.leafGreen}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Path
          d="M1 4 Q 8 4 8 -2"
          stroke={ILLUS_COLORS.leafGreen}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={0} cy={-10} r={6} fill={ILLUS_COLORS.raspberry} />
        <Circle cx={0} cy={-10} r={2.2} fill={ILLUS_COLORS.paintYellow} />
      </G>

      {/* Paint splash dots scattered for energy */}
      <Circle cx={32} cy={80} r={3} fill={ILLUS_COLORS.paintBlue} />
      <Circle cx={168} cy={70} r={3.5} fill={ILLUS_COLORS.raspberry} />
      <Circle cx={175} cy={95} r={2.2} fill={ILLUS_COLORS.paintYellow} />
      <Circle cx={28} cy={105} r={2.5} fill={ILLUS_COLORS.paintGreen} />

      {/* ---- Crossed legs (drawn first so torso sits in front) ---- */}
      <G>
        {/* Left leg (going right) */}
        <Path
          d="M 92 132
             Q 110 138 138 142
             Q 152 144 150 152
             Q 148 158 130 156
             Q 105 154 88 148 Z"
          fill={ILLUS_COLORS.pants}
        />
        {/* Right leg (going left) — sits in front */}
        <Path
          d="M 108 132
             Q 90 138 62 142
             Q 48 144 50 152
             Q 52 158 70 156
             Q 95 154 112 148 Z"
          fill={ILLUS_COLORS.pantsShade}
        />
        {/* Tiny feet */}
        <Ellipse cx={51} cy={154} rx={6} ry={4} fill={ILLUS_COLORS.skin} />
        <Ellipse cx={149} cy={154} rx={6} ry={4} fill={ILLUS_COLORS.skin} />
      </G>

      {/* ---- Torso / shirt ---- */}
      <G>
        <Path
          d="M 76 92
             Q 76 78 100 78
             Q 124 78 124 92
             L 124 130
             Q 124 138 100 138
             Q 76 138 76 130 Z"
          fill={ILLUS_COLORS.shirt}
        />
        {/* Shirt collar shadow */}
        <Path
          d="M 86 84 Q 100 92 114 84"
          stroke={ILLUS_COLORS.shirtShade}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        {/* Paint smudge on shirt */}
        <Circle cx={92} cy={110} r={3} fill={ILLUS_COLORS.raspberry} opacity={0.65} />
        <Circle cx={108} cy={118} r={2.4} fill={ILLUS_COLORS.paintBlue} opacity={0.65} />
      </G>

      {/* ---- Right arm holding paintbrush ---- */}
      <G>
        {/* Arm */}
        <Path
          d="M 122 96
             Q 142 100 156 116
             Q 162 122 158 128
             Q 152 132 146 126
             Q 132 116 118 112 Z"
          fill={ILLUS_COLORS.skin}
        />
        {/* Brush — tilted toward palette */}
        <G transform="translate(158 122) rotate(-30)">
          <Rect x={-3} y={0} width={6} height={32} rx={3} fill={ILLUS_COLORS.brushHandle} />
          <Rect
            x={-4}
            y={-6}
            width={8}
            height={8}
            rx={1.5}
            fill={ILLUS_COLORS.brushFerrule}
          />
          <Path
            d="M -4 -6 Q 0 -16 4 -6 Z"
            fill={brushTipColor}
          />
          {/* tiny paint drop dripping off the brush */}
          <Circle cx={0} cy={-18} r={2} fill={brushTipColor} />
        </G>
      </G>

      {/* ---- Left arm holding paint palette ---- */}
      <G>
        {/* Arm */}
        <Path
          d="M 78 96
             Q 58 100 44 116
             Q 38 122 42 128
             Q 48 132 54 126
             Q 68 116 82 112 Z"
          fill={ILLUS_COLORS.skin}
        />
        {/* Paint palette */}
        <G transform="translate(42 124)">
          {/* Palette body (kidney shape) */}
          <Path
            d="M -16 -2
               Q -22 -10 -14 -16
               Q -4 -22 8 -18
               Q 20 -14 18 -4
               Q 16 6 4 6
               Q -10 6 -16 2 Z"
            fill={ILLUS_COLORS.paletteWood}
            stroke={ILLUS_COLORS.paletteWoodShade}
            strokeWidth={1.5}
          />
          {/* Thumb hole */}
          <Ellipse
            cx={-10}
            cy={-2}
            rx={4}
            ry={3}
            fill={ILLUS_COLORS.skin}
          />
          {/* Paint dots */}
          <Circle cx={-2} cy={-12} r={3} fill={brushTipColor} />
          <Circle cx={6} cy={-10} r={2.6} fill={ILLUS_COLORS.paintBlue} />
          <Circle cx={10} cy={-2} r={2.6} fill={ILLUS_COLORS.paintYellow} />
          <Circle cx={3} cy={2} r={2.4} fill={ILLUS_COLORS.paintGreen} />
        </G>
      </G>

      {/* ---- Head + face (drawn last so it sits on top of shirt collar) ---- */}
      <G>
        {/* Hair back (behind head) */}
        <Path
          d="M 72 48
             Q 72 26 100 26
             Q 128 26 128 48
             L 128 62
             Q 128 64 124 64
             L 76 64
             Q 72 64 72 62 Z"
          fill={ILLUS_COLORS.hair}
        />
        {/* Face */}
        <Circle cx={100} cy={56} r={20} fill={ILLUS_COLORS.skin} />
        {/* Hair fringe over forehead */}
        <Path
          d="M 82 50
             Q 90 36 100 38
             Q 110 36 118 50
             Q 116 46 108 44
             Q 100 42 92 44
             Q 84 46 82 50 Z"
          fill={ILLUS_COLORS.hair}
        />
        {/* Cheeks */}
        <Circle cx={88} cy={62} r={3} fill={ILLUS_COLORS.cheek} opacity={0.75} />
        <Circle cx={112} cy={62} r={3} fill={ILLUS_COLORS.cheek} opacity={0.75} />
        {/* Eyes — small happy closed crescents */}
        <Path
          d="M 90 56 Q 93 53 96 56"
          stroke={ILLUS_COLORS.outline}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 104 56 Q 107 53 110 56"
          stroke={ILLUS_COLORS.outline}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        {/* Smile */}
        <Path
          d="M 96 66 Q 100 70 104 66"
          stroke={ILLUS_COLORS.outline}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </G>
    </Svg>
  );
};

// ---- PaintFlower ----------------------------------------------------------

export interface PaintFlowerProps extends SvgProps {
  size?: number;
  /** Override the petal colour. Defaults to raspberry brand. */
  color?: string;
}

/**
 * A tiny flat-vector 5-petal flower with a green stem. Sprinkled as
 * decoration around the hero panels.
 */
export const PaintFlower: React.FC<PaintFlowerProps> = ({
  size = 32,
  color = ILLUS_COLORS.raspberry,
  ...rest
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      {...rest}
    >
      {/* Stem */}
      <Path
        d="M 16 14 L 16 30"
        stroke={ILLUS_COLORS.leafGreen}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Leaf */}
      <Path
        d="M 16 22 Q 22 22 22 17"
        stroke={ILLUS_COLORS.leafGreen}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      {/* 5 petals */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <Ellipse
          key={angle}
          cx={16}
          cy={6}
          rx={3.4}
          ry={5}
          fill={color}
          transform={`rotate(${angle} 16 12)`}
        />
      ))}
      {/* Centre */}
      <Circle cx={16} cy={12} r={2.4} fill={ILLUS_COLORS.paintYellow} />
    </Svg>
  );
};

// ---- PaintSwirl -----------------------------------------------------------

export interface PaintSwirlProps extends SvgProps {
  width?: number;
  height?: number;
  /** Override the swirl colour. Defaults to a slightly lighter raspberry. */
  color?: string;
  opacity?: number;
}

/**
 * Soft wavy swirl pattern used as a backdrop ornament on the raspberry
 * hero panels. Three nested arcs stacked vertically. Renders inside its
 * given width/height (defaults to 200×220) — caller is responsible for
 * positioning + clipping.
 */
export const PaintSwirl: React.FC<PaintSwirlProps> = ({
  width = 200,
  height = 220,
  color = '#A53450',
  opacity = 0.55,
  ...rest
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 200 220"
      fill="none"
      {...rest}
    >
      <G opacity={opacity}>
        <Path
          d="M -20 60
             C 40 30, 80 110, 140 80
             S 220 50, 240 80"
          stroke={color}
          strokeWidth={28}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M -20 120
             C 40 90, 80 170, 140 140
             S 220 110, 240 140"
          stroke={color}
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
      </G>
    </Svg>
  );
};
