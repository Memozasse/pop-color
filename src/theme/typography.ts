import { Platform, TextStyle } from 'react-native';

const family = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

const familyBold = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  display: {
    fontFamily: familyBold,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: familyBold,
    fontSize: 24,
    fontWeight: '800',
  },
  heading: {
    fontFamily: familyBold,
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    fontFamily: family,
    fontSize: 16,
    fontWeight: '500',
  },
  caption: {
    fontFamily: family,
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    fontFamily: familyBold,
    fontSize: 16,
    fontWeight: '700',
  },
} satisfies Record<string, TextStyle>;

export type TypographyKey = keyof typeof typography;
