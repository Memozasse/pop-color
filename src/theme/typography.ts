import { TextStyle } from 'react-native';

// Pop Color uses Quicksand across every weight. The font is loaded
// asynchronously at app startup by `useFonts(...)` in `App.tsx`; before
// it loads we render `null` to avoid a Flash Of Unstyled Text.
//
// Quicksand variants we actually use:
//   - Quicksand_500Medium   (body, captions)
//   - Quicksand_600SemiBold (button labels, brush names)
//   - Quicksand_700Bold     (titles, headings, display)
//
// The DESIGN.md at the repo root is the source-of-truth spec for these
// tokens. Keep this file in sync with the `typography` block in
// DESIGN.md when adjusting sizes / weights.

const FONT_REGULAR = 'Quicksand_500Medium';
const FONT_SEMIBOLD = 'Quicksand_600SemiBold';
const FONT_BOLD = 'Quicksand_700Bold';

export const typography = {
  display: {
    fontFamily: FONT_BOLD,
    fontSize: 36,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: 24,
    letterSpacing: -0.2,
  },
  heading: {
    fontFamily: FONT_BOLD,
    fontSize: 20,
  },
  body: {
    fontFamily: FONT_REGULAR,
    fontSize: 16,
  },
  caption: {
    fontFamily: FONT_REGULAR,
    fontSize: 13,
  },
  button: {
    fontFamily: FONT_BOLD,
    fontSize: 16,
  },
} satisfies Record<string, TextStyle>;

export const FONT_FAMILIES = {
  regular: FONT_REGULAR,
  semibold: FONT_SEMIBOLD,
  bold: FONT_BOLD,
} as const;

export type TypographyKey = keyof typeof typography;
