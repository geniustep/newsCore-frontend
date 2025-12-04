import apiClient from './client';

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

export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  contactEmail?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export const settingsApi = {
  /**
   * Get public theme settings (no auth required)
   */
  getTheme: async (): Promise<ThemeSettings> => {
    try {
      const response = await apiClient.get('/settings/public/theme');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      // Return default theme settings
      return {
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
    }
  },

  /**
   * Get public site settings (no auth required)
   */
  getSite: async (): Promise<SiteSettings> => {
    try {
      const response = await apiClient.get('/settings/public/site');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return {};
    }
  },
};

