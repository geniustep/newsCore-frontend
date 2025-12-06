/**
 * Server-side function to fetch theme settings
 * دالة جلب إعدادات الثيم من جهة السيرفر
 */

import { cache } from 'react';

export interface ThemeSettings {
  logoAr: string;
  logoEn: string;
  logoFr: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  headingFont: string;
  borderRadius: string;
  spacing: string;
  darkModeEnabled: boolean;
  darkPrimaryColor: string;
  darkBackgroundColor: string;
  darkTextColor: string;
}

export const defaultTheme: ThemeSettings = {
  logoAr: '',
  logoEn: '',
  logoFr: '',
  favicon: '',
  primaryColor: '#ed7520',
  secondaryColor: '#0ea5e9',
  accentColor: '#f59e0b',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'IBM Plex Sans Arabic',
  fontSize: '16px',
  headingFont: 'IBM Plex Sans Arabic',
  borderRadius: '0.5rem',
  spacing: 'normal',
  darkModeEnabled: false,
  darkPrimaryColor: '#f59e0b',
  darkBackgroundColor: '#111827',
  darkTextColor: '#f9fafb',
};

/**
 * Server-side function to fetch theme settings
 * Cached with React cache to avoid duplicate requests per request
 */
export const getThemeSettings = cache(async (): Promise<ThemeSettings> => {
  // During build time, return default theme to avoid API calls
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
    if (isBuildTime) {
      return defaultTheme;
    }
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.sahara2797.com/api/v1';
    const response = await fetch(`${apiUrl}/settings/public/theme`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data || data;
    }
  } catch (error) {
    console.error('Failed to fetch theme settings:', error);
  }
  
  return defaultTheme;
});
