export const colors = {
  background: '#F4F7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF6F1',
  primary: '#1C9B72',
  primaryDark: '#137052',
  primarySoft: '#DDF4EA',
  text: '#17211C',
  textMuted: '#64736B',
  border: '#D9E4DD',
  danger: '#D95D5D',
  warning: '#D58F2D',
  shadow: '#0F1713',
  black: '#000000',
  white: '#FFFFFF',
} as const;

export type AppColors = typeof colors;
