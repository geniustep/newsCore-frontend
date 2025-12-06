export { ThemeProvider, useTheme } from './ThemeProvider';
export type { ThemeSettings } from './ThemeProvider';

// Server-side function - exported separately to avoid 'use client' issues
export { getThemeSettings, defaultTheme } from '@/lib/theme/getThemeSettings';

