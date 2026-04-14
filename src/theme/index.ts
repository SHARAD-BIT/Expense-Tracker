import { colors } from './colors';
import { shadows } from './shadows';
import { radii, spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} as const;

export type AppTheme = typeof theme;
