import { ThemeSettings } from './ThemeProvider';

export interface ThemeManifest {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  previewImage?: string;
  features: string[];
  templates: ThemeTemplate[];
  regions: ThemeRegion[];
  customizer?: ThemeCustomizer;
}

export interface ThemeTemplate {
  id: string;
  name: string;
  description?: string;
  file: string;
  type: string;
  isDefault?: boolean;
}

export interface ThemeRegion {
  id: string;
  name: string;
  description?: string;
  type: string;
  maxWidgets?: number;
}

export interface ThemeCustomizer {
  sections: ThemeCustomizerSection[];
}

export interface ThemeCustomizerSection {
  id: string;
  title: string;
  description?: string;
  fields: ThemeCustomizerField[];
}

export interface ThemeCustomizerField {
  id: string;
  type: string;
  label: string;
  description?: string;
  default?: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface LoadedTheme {
  manifest: ThemeManifest;
  settings: ThemeSettings;
  path: string;
}

// Theme Loader Class
export class ThemeLoader {
  private static instance: ThemeLoader;
  private activeTheme: LoadedTheme | null = null;
  private availableThemes: Map<string, ThemeManifest> = new Map();

  private constructor() {}

  static getInstance(): ThemeLoader {
    if (!ThemeLoader.instance) {
      ThemeLoader.instance = new ThemeLoader();
    }
    return ThemeLoader.instance;
  }

  /**
   * Load theme from API
   */
  async loadActiveTheme(): Promise<LoadedTheme | null> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/themes/active`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        return null;
      }

      const theme = await response.json();
      this.activeTheme = {
        manifest: theme.manifest,
        settings: theme.settings || {},
        path: theme.path,
      };

      return this.activeTheme;
    } catch (error) {
      console.error('Failed to load active theme:', error);
      return null;
    }
  }

  /**
   * Get active theme
   */
  getActiveTheme(): LoadedTheme | null {
    return this.activeTheme;
  }

  /**
   * Get template for type
   */
  getTemplate(type: string, templateId?: string): ThemeTemplate | null {
    if (!this.activeTheme) return null;

    const templates = this.activeTheme.manifest.templates.filter(t => t.type === type);
    
    if (templateId) {
      return templates.find(t => t.id === templateId) || null;
    }

    // Return default template for this type
    return templates.find(t => t.isDefault) || templates[0] || null;
  }

  /**
   * Get regions for theme
   */
  getRegions(): ThemeRegion[] {
    return this.activeTheme?.manifest.regions || [];
  }

  /**
   * Get region by ID
   */
  getRegion(regionId: string): ThemeRegion | null {
    return this.getRegions().find(r => r.id === regionId) || null;
  }

  /**
   * Check if theme supports feature
   */
  supportsFeature(feature: string): boolean {
    return this.activeTheme?.manifest.features.includes(feature) || false;
  }

  /**
   * Get customizer schema
   */
  getCustomizerSchema(): ThemeCustomizer | null {
    return this.activeTheme?.manifest.customizer || null;
  }

  /**
   * Get default settings from customizer schema
   */
  getDefaultSettings(): Record<string, any> {
    const schema = this.getCustomizerSchema();
    if (!schema) return {};

    const defaults: Record<string, any> = {};
    for (const section of schema.sections) {
      for (const field of section.fields) {
        if (field.default !== undefined) {
          defaults[field.id] = field.default;
        }
      }
    }
    return defaults;
  }

  /**
   * Load available themes list
   */
  async loadAvailableThemes(): Promise<ThemeManifest[]> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/themes`);

      if (!response.ok) {
        return [];
      }

      const themes = await response.json();
      this.availableThemes.clear();
      
      for (const theme of themes) {
        this.availableThemes.set(theme.slug, theme.manifest);
      }

      return themes.map((t: any) => t.manifest);
    } catch (error) {
      console.error('Failed to load available themes:', error);
      return [];
    }
  }

  /**
   * Get theme manifest by slug
   */
  getThemeManifest(slug: string): ThemeManifest | undefined {
    return this.availableThemes.get(slug);
  }
}

// Export singleton instance
export const themeLoader = ThemeLoader.getInstance();
