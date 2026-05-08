// Kid-friendly coloring palette.
// 16 colors split into "Brights" and "Pastels" — selected to read clearly
// against a black outline on white paper.

export interface Swatch {
  id: string;
  hex: string;
  name: string;
}

export interface Palette {
  id: string;
  title: string;
  swatches: Swatch[];
}

const brights: Swatch[] = [
  { id: 'b-red', hex: '#FF4D6D', name: 'Strawberry' },
  { id: 'b-orange', hex: '#FF9F43', name: 'Tangerine' },
  { id: 'b-yellow', hex: '#FFD93D', name: 'Sunshine' },
  { id: 'b-green', hex: '#3CCF4E', name: 'Grass' },
  { id: 'b-teal', hex: '#1ABCFE', name: 'Sea' },
  { id: 'b-blue', hex: '#3A86FF', name: 'Blueberry' },
  { id: 'b-purple', hex: '#9B5DE5', name: 'Grape' },
  { id: 'b-pink', hex: '#FF6FA3', name: 'Bubblegum' },
];

const pastels: Swatch[] = [
  { id: 'p-pink', hex: '#FFC9D1', name: 'Cotton Candy' },
  { id: 'p-peach', hex: '#FFD6B0', name: 'Peach' },
  { id: 'p-yellow', hex: '#FFF1A8', name: 'Lemon' },
  { id: 'p-mint', hex: '#B6EDC8', name: 'Mint' },
  { id: 'p-sky', hex: '#BEE3F8', name: 'Sky' },
  { id: 'p-lavender', hex: '#D6C4FF', name: 'Lavender' },
  { id: 'p-brown', hex: '#C9A37A', name: 'Cocoa' },
  { id: 'p-gray', hex: '#D9D9D9', name: 'Cloud' },
];

export const PALETTES: Palette[] = [
  { id: 'brights', title: 'Brights', swatches: brights },
  { id: 'pastels', title: 'Pastels', swatches: pastels },
];

export const ALL_SWATCHES: Swatch[] = [...brights, ...pastels];

export const DEFAULT_COLOR = brights[0].hex;

export const ERASER_COLOR = '#FFFFFF';
