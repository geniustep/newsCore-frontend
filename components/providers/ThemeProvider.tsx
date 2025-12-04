'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

const defaultTheme: ThemeSettings = {
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

interface ThemeContextType {
  theme: ThemeSettings;
  isLoading: boolean;
  getLogo: (locale: string) => string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  isLoading: true,
  getLogo: () => '',
});

export const useTheme = () => useContext(ThemeContext);

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
  }
  return '0 0 0';
}

// Apply theme to CSS variables
function applyThemeToDocument(theme: ThemeSettings) {
  const root = document.documentElement;
  
  // Primary color
  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-primary-rgb', hexToRgb(theme.primaryColor));
  
  // Secondary color
  root.style.setProperty('--color-secondary', theme.secondaryColor);
  root.style.setProperty('--color-secondary-rgb', hexToRgb(theme.secondaryColor));
  
  // Accent color
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-accent-rgb', hexToRgb(theme.accentColor));
  
  // Background color
  root.style.setProperty('--color-background', theme.backgroundColor);
  root.style.setProperty('--color-background-rgb', hexToRgb(theme.backgroundColor));
  
  // Text color
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-text-rgb', hexToRgb(theme.textColor));
  
  // Typography
  root.style.setProperty('--font-family', theme.fontFamily);
  root.style.setProperty('--font-size-base', theme.fontSize);
  root.style.setProperty('--font-heading', theme.headingFont);
  
  // Layout
  root.style.setProperty('--border-radius', theme.borderRadius);
  
  // Spacing
  const spacingMap: Record<string, string> = {
    compact: '0.75',
    normal: '1',
    relaxed: '1.25',
    spacious: '1.5',
  };
  root.style.setProperty('--spacing-multiplier', spacingMap[theme.spacing] || '1');
  
  // Dark mode colors
  if (theme.darkModeEnabled) {
    root.style.setProperty('--color-dark-primary', theme.darkPrimaryColor);
    root.style.setProperty('--color-dark-background', theme.darkBackgroundColor);
    root.style.setProperty('--color-dark-text', theme.darkTextColor);
  }

  // Update favicon if provided
  if (theme.favicon) {
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.setAttribute('href', theme.favicon);
    }
  }
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeSettings;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme || defaultTheme);
  const [isLoading, setIsLoading] = useState(!initialTheme);

  useEffect(() => {
    // If we have initial theme from server, just apply it
    if (initialTheme) {
      applyThemeToDocument(initialTheme);
      return;
    }

    // Otherwise, fetch from API
    const fetchTheme = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.sahara2797.com/api/v1';
        const response = await fetch(`${apiUrl}/settings/public/theme`, {
          next: { revalidate: 300 }, // Cache for 5 minutes
        });
        
        if (response.ok) {
          const data = await response.json();
          const themeData = data.data || data;
          setTheme(themeData);
          applyThemeToDocument(themeData);
        }
      } catch (error) {
        console.error('Failed to fetch theme settings:', error);
        // Apply default theme on error
        applyThemeToDocument(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, [initialTheme]);

  // Get logo based on locale
  const getLogo = (locale: string): string => {
    switch (locale) {
      case 'ar':
        return theme.logoAr || theme.logoEn || '';
      case 'fr':
        return theme.logoFr || theme.logoEn || '';
      case 'en':
      default:
        return theme.logoEn || theme.logoAr || '';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isLoading, getLogo }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Server component to fetch theme
export async function getThemeSettings(): Promise<ThemeSettings> {
  // During build time, return default theme to avoid API calls
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    // Check if we're in build phase
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
    if (isBuildTime) {
      return defaultTheme;
    }
  }
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.sahara2797.com/api/v1';
    const response = await fetch(`${apiUrl}/settings/public/theme`, {
      cache: 'no-store', // Don't cache during SSR to always get fresh data
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data || data;
    }
  } catch (error) {
    console.error('Failed to fetch theme settings:', error);
  }
  
  return defaultTheme;
}

