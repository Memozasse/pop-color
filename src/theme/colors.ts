// Pop Color UI theme — soft kid-friendly palette for the app chrome
// (separate from the user-facing coloring palette in src/data/palettes.ts)

export const colors = {
  // surfaces
  background: '#FFF7F0',
  surface: '#FFFFFF',
  surfaceMuted: '#FFEFE0',

  // text
  text: '#2A2540',
  textMuted: '#6B6485',
  textOnBrand: '#FFFFFF',

  // brand
  brand: '#FF6FA3',
  brandDeep: '#E94F8A',
  brandSoft: '#FFD6E5',

  // accents
  accentYellow: '#FFD24C',
  accentBlue: '#6FC1FF',
  accentGreen: '#7BD389',
  accentPurple: '#B07CFF',

  // semantic
  border: '#F0DFD0',
  shadow: 'rgba(42, 37, 64, 0.12)',
  overlay: 'rgba(42, 37, 64, 0.45)',

  // canvas
  paperWhite: '#FFFFFF',
  outline: '#1F1B30',
} as const;

export type ColorKey = keyof typeof colors;
