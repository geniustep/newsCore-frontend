'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme Settings Interface
export interface ThemeSettings {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headerBackground: string;
  footerBackground: string;
  
  // Typography
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  
  // Layout
  containerWidth: string;
  sidebarPosition: 'right' | 'left' | 'none';
  borderRadius: string;
  
  // Header
  headerStyle: 'default' | 'centered' | 'minimal';
  stickyHeader: boolean;
  showTopBar: boolean;
  showSearch: boolean;
  
  // Footer
  footerColumns: string;
  showSocialLinks: boolean;
  showNewsletter: boolean;
  
  // Homepage
  showHero: boolean;
  heroStyle: 'slider' | 'featured' | 'grid';
  showBreakingNews: boolean;
  articlesPerSection: number;
  
  // Article
  showAuthor: boolean;
  showDate: boolean;
  showReadingTime: boolean;
  showShareButtons: boolean;
  showRelatedArticles: boolean;
  relatedArticlesCount: number;
  
  // Dark Mode
  darkModeEnabled: boolean;
  darkPrimaryColor: string;
  darkBackgroundColor: string;
  darkTextColor: string;
  
  // Logos (from site settings)
  logoAr?: string;
  logoEn?: string;
  logoFr?: string;
  favicon?: string;
}

// Default Theme Settings
export const defaultThemeSettings: ThemeSettings = {
  // Colors
  primaryColor: '#ed7520',
  secondaryColor: '#0ea5e9',
  accentColor: '#f59e0b',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  headerBackground: '#ffffff',
  footerBackground: '#1f2937',
  
  // Typography
  fontFamily: 'Cairo',
  headingFont: 'Cairo',
  fontSize: '16px',
  
  // Layout
  containerWidth: '1280px',
  sidebarPosition: 'right',
  borderRadius: '0.5rem',
  
  // Header
  headerStyle: 'default',
  stickyHeader: true,
  showTopBar: true,
  showSearch: true,
  
  // Footer
  footerColumns: '4',
  showSocialLinks: true,
  showNewsletter: true,
  
  // Homepage
  showHero: true,
  heroStyle: 'slider',
  showBreakingNews: true,
  articlesPerSection: 6,
  
  // Article
  showAuthor: true,
  showDate: true,
  showReadingTime: true,
  showShareButtons: true,
  showRelatedArticles: true,
  relatedArticlesCount: 4,
  
  // Dark Mode
  darkModeEnabled: true,
  darkPrimaryColor: '#f59e0b',
  darkBackgroundColor: '#111827',
  darkTextColor: '#f9fafb',
};

// Theme Context
interface ThemeContextType {
  theme: ThemeSettings;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  getCssVariables: () => Record<string, string>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<ThemeSettings>;
}

// Theme Provider Component
export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeSettings>({
    ...defaultThemeSettings,
    ...initialTheme,
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        setIsDarkMode(stored === 'true');
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', String(newValue));
      }
      return newValue;
    });
  };

  // Update theme settings
  const updateTheme = (settings: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...settings }));
  };

  // Generate CSS variables
  const getCssVariables = (): Record<string, string> => {
    const vars: Record<string, string> = {
      '--color-primary': isDarkMode ? theme.darkPrimaryColor : theme.primaryColor,
      '--color-secondary': theme.secondaryColor,
      '--color-accent': theme.accentColor,
      '--color-background': isDarkMode ? theme.darkBackgroundColor : theme.backgroundColor,
      '--color-text': isDarkMode ? theme.darkTextColor : theme.textColor,
      '--color-header-bg': isDarkMode ? theme.darkBackgroundColor : theme.headerBackground,
      '--color-footer-bg': theme.footerBackground,
      '--font-family': theme.fontFamily,
      '--font-heading': theme.headingFont,
      '--font-size': theme.fontSize,
      '--container-width': theme.containerWidth,
      '--border-radius': theme.borderRadius,
    };
    return vars;
  };

  // Apply CSS variables to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const vars = getCssVariables();
      const root = document.documentElement;
      
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Apply dark mode class
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleDarkMode,
        updateTheme,
        getCssVariables,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Export for server-side use
export async function getThemeSettings(): Promise<ThemeSettings> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const response = await fetch(`${apiUrl}/settings/theme`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return defaultThemeSettings;
    }
    
    const data = await response.json();
    return { ...defaultThemeSettings, ...data };
  } catch (error) {
    console.error('Failed to fetch theme settings:', error);
    return defaultThemeSettings;
  }
}
