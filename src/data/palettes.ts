// Pop Color palettes. Each palette is a named, themed strip of swatches the
// user can swipe through at the bottom of the coloring screen (just like
// Happy Color / ColorJoy). Picking a palette doesn't *limit* what colours
// the user can paint with — they can always tap the eyedropper or scrub the
// tint slider — it's just a friendly entry point.

export interface Swatch {
  id: string;
  hex: string;
  name: string;
}

export interface Palette {
  id: string;
  title: string;
  emoji: string;
  swatches: Swatch[];
}

const sky: Swatch[] = [
  { id: 'sky-1', hex: '#A8D8FF', name: 'Sky' },
  { id: 'sky-2', hex: '#7AB8F5', name: 'Cornflower' },
  { id: 'sky-3', hex: '#5096E2', name: 'Azure' },
  { id: 'sky-4', hex: '#2E6FC3', name: 'Sapphire' },
  { id: 'sky-5', hex: '#1F4FA6', name: 'Deep Sea' },
  { id: 'sky-6', hex: '#C5B8FF', name: 'Periwinkle' },
  { id: 'sky-7', hex: '#9F8DF5', name: 'Lilac' },
  { id: 'sky-8', hex: '#7060D9', name: 'Iris' },
  { id: 'sky-9', hex: '#B8F0F2', name: 'Aqua' },
  { id: 'sky-10', hex: '#FFFFFF', name: 'Cloud' },
];

const sunset: Swatch[] = [
  { id: 'sunset-1', hex: '#FFE3B8', name: 'Cream' },
  { id: 'sunset-2', hex: '#FFC383', name: 'Apricot' },
  { id: 'sunset-3', hex: '#FF9A4F', name: 'Tangerine' },
  { id: 'sunset-4', hex: '#FF7A4A', name: 'Sunset' },
  { id: 'sunset-5', hex: '#F45B5B', name: 'Coral' },
  { id: 'sunset-6', hex: '#D63A5F', name: 'Raspberry' },
  { id: 'sunset-7', hex: '#A21F4A', name: 'Wine' },
  { id: 'sunset-8', hex: '#FFB7B7', name: 'Blush' },
  { id: 'sunset-9', hex: '#FFD86B', name: 'Sunshine' },
  { id: 'sunset-10', hex: '#FFE9E0', name: 'Peach Cream' },
];

const pastel: Swatch[] = [
  { id: 'pastel-1', hex: '#FFC9D1', name: 'Cotton Candy' },
  { id: 'pastel-2', hex: '#FFD6B0', name: 'Peach' },
  { id: 'pastel-3', hex: '#FFF1A8', name: 'Lemon' },
  { id: 'pastel-4', hex: '#B6EDC8', name: 'Mint' },
  { id: 'pastel-5', hex: '#BEE3F8', name: 'Sky' },
  { id: 'pastel-6', hex: '#D6C4FF', name: 'Lavender' },
  { id: 'pastel-7', hex: '#F8C8DC', name: 'Powder Pink' },
  { id: 'pastel-8', hex: '#C9F0E2', name: 'Seafoam' },
  { id: 'pastel-9', hex: '#FBE3F2', name: 'Petal' },
  { id: 'pastel-10', hex: '#FAF6E9', name: 'Vanilla' },
];

const neon: Swatch[] = [
  { id: 'neon-1', hex: '#FF1F5A', name: 'Hot Pink' },
  { id: 'neon-2', hex: '#FF5500', name: 'Volcano' },
  { id: 'neon-3', hex: '#FFE600', name: 'Lightning' },
  { id: 'neon-4', hex: '#39FF14', name: 'Toxic' },
  { id: 'neon-5', hex: '#00F0FF', name: 'Cyan' },
  { id: 'neon-6', hex: '#7B00FF', name: 'Plasma' },
  { id: 'neon-7', hex: '#FF00C8', name: 'Magenta' },
  { id: 'neon-8', hex: '#00FF9C', name: 'Acid Mint' },
  { id: 'neon-9', hex: '#FFD000', name: 'Solar' },
  { id: 'neon-10', hex: '#FF3D00', name: 'Lava' },
];

const beach: Swatch[] = [
  { id: 'beach-1', hex: '#FCEED9', name: 'Sand' },
  { id: 'beach-2', hex: '#F5D9A8', name: 'Driftwood' },
  { id: 'beach-3', hex: '#E5B47B', name: 'Caramel' },
  { id: 'beach-4', hex: '#7DD8D2', name: 'Lagoon' },
  { id: 'beach-5', hex: '#3DB4B0', name: 'Tide' },
  { id: 'beach-6', hex: '#1B7A7E', name: 'Reef' },
  { id: 'beach-7', hex: '#FFD27D', name: 'Sunray' },
  { id: 'beach-8', hex: '#F46A4F', name: 'Sunset Tide' },
  { id: 'beach-9', hex: '#FFFFFF', name: 'Foam' },
  { id: 'beach-10', hex: '#3F3A56', name: 'Twilight' },
];

const forest: Swatch[] = [
  { id: 'forest-1', hex: '#D8E6B4', name: 'New Leaf' },
  { id: 'forest-2', hex: '#A8CC72', name: 'Moss' },
  { id: 'forest-3', hex: '#6FA841', name: 'Fern' },
  { id: 'forest-4', hex: '#3F7A2C', name: 'Pine' },
  { id: 'forest-5', hex: '#1F4D1F', name: 'Evergreen' },
  { id: 'forest-6', hex: '#C49A6A', name: 'Bark' },
  { id: 'forest-7', hex: '#8A5A33', name: 'Cocoa' },
  { id: 'forest-8', hex: '#5A3414', name: 'Oak' },
  { id: 'forest-9', hex: '#FFE7A8', name: 'Honey' },
  { id: 'forest-10', hex: '#F2685C', name: 'Berry' },
];

export const PALETTES: Palette[] = [
  { id: 'sky', title: 'Sky', emoji: '☁️', swatches: sky },
  { id: 'sunset', title: 'Sunset', emoji: '🌅', swatches: sunset },
  { id: 'pastel', title: 'Pastel', emoji: '🍬', swatches: pastel },
  { id: 'neon', title: 'Neon', emoji: '⚡', swatches: neon },
  { id: 'beach', title: 'Beach', emoji: '🏖️', swatches: beach },
  { id: 'forest', title: 'Forest', emoji: '🌲', swatches: forest },
];

const PALETTE_INDEX: Map<string, Palette> = new Map(
  PALETTES.map((p) => [p.id, p]),
);

export const getPalette = (id: string): Palette | undefined =>
  PALETTE_INDEX.get(id);

export const ALL_SWATCHES: Swatch[] = PALETTES.flatMap((p) => p.swatches);

export const DEFAULT_PALETTE_ID: string = 'sky';

export const DEFAULT_COLOR: string = sky[3].hex;

/** Colour painted by the eraser brush. Matches the page's paper background. */
export const ERASER_COLOR: string = '#FFFFFF';
