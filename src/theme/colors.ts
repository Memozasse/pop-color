// Pop Color UI theme — "Raspberry Bento" palette.
//
// Sampled from the reference design the user shared (meditation-app
// screenshot). Brand = deep raspberry pink, surfaces are cream-pink, and
// the periwinkle accent is reserved for the single featured / spotlight
// card on Home. The user-facing painting swatches live separately in
// src/data/palettes.ts and are unchanged by this redesign.

export const colors = {
  // surfaces — cream-pink page bg + warm-white cards in the reference
  background: '#FCEFEF',
  surface: '#FFFAF2',
  surfaceMuted: '#F7E3E7',

  // text
  text: '#1F1B30',
  textMuted: '#6B6485',
  textOnBrand: '#FFFFFF',

  // brand — raspberry sampled from the reference hero panel
  brand: '#C14A68',
  brandDeep: '#A53450',
  brandSoft: '#F7D9E1',

  // accent — periwinkle for the single featured card on Home
  // (matches the "Ready to start your first session" card in the reference).
  accent: '#8999D5',
  accentDeep: '#6F7FC2',
  accentSoft: '#E2E6F4',

  // legacy accent ramp — kept so older screens / components keep compiling
  // through the migration. Each screen drops these as it's redesigned.
  accentYellow: '#FFD24C',
  accentBlue: '#8999D5',
  accentGreen: '#7BD389',
  accentPurple: '#B07CFF',

  // semantic
  border: '#F0D7DD',
  shadow: 'rgba(31, 27, 48, 0.10)',
  overlay: 'rgba(31, 27, 48, 0.45)',

  // canvas
  paperWhite: '#FFFFFF',
  outline: '#1F1B30',
} as const;

export type ColorKey = keyof typeof colors;
