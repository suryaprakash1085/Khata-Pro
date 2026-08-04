import { colors } from './colors';

export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: colors.text,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: colors.text,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: colors.text,
    },
    h4: {
      fontSize: 18,
      fontWeight: '500' as const,
      color: colors.text,
    },
    body: {
      fontSize: 14,
      color: colors.text,
    },
    caption: {
      fontSize: 12,
      color: colors.textLight,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  shadows: {
    small: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};