import apiClient from './client';

// Menu Types
export interface MenuItem {
  id: string;
  label: string;
  labelAr?: string;
  labelEn?: string;
  labelFr?: string;
  type: 'CUSTOM' | 'CATEGORY' | 'TAG' | 'ARTICLE' | 'PAGE' | 'DIVIDER' | 'HEADING' | 'DYNAMIC';
  url?: string;
  target?: string;
  icon?: string;
  imageUrl?: string;
  description?: string;
  cssClass?: string;
  isMegaMenu?: boolean;
  megaMenuLayout?: string;
  megaMenuContent?: Record<string, unknown>;
  isActive: boolean;
  isVisible: boolean;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
  displayConditions?: Record<string, unknown>;
  sortOrder: number;
  children?: MenuItem[];
  category?: {
    id: string;
    slug: string;
    name: string;
    nameAr?: string;
    nameEn?: string;
    nameFr?: string;
    coverImage?: string;
    icon?: string;
  };
  tag?: {
    id: string;
    slug: string;
    name: string;
    nameAr?: string;
    nameEn?: string;
    nameFr?: string;
  };
  article?: {
    id: string;
    slug: string;
    title: string;
    coverImageUrl?: string;
  };
  page?: {
    id: string;
    slug: string;
    title: string;
  };
}

export interface Menu {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  cssClass?: string;
  theme?: string;
  items: MenuItem[];
  locations?: Array<{
    id: string;
    location: string;
    priority: number;
    isActive: boolean;
  }>;
}

// API response wrapper type
interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

// Helper to extract data from API response wrapper
const extractData = <T>(response: ApiResponse<T> | T): T => {
  const res = response as ApiResponse<T>;
  if (res.data !== undefined) {
    return res.data;
  }
  return response as T;
};

export const menusApi = {
  /**
   * Get menu by location (e.g., 'header', 'footer')
   */
  getByLocation: async (location: string, language?: string): Promise<Menu | null> => {
    try {
      const { data } = await apiClient.get(`/menus/location/${location}`, {
        params: { language },
      });
      const result = extractData<Menu>(data);
      return result || null;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  /**
   * Get menu by slug
   */
  getBySlug: async (slug: string, language?: string): Promise<Menu | null> => {
    try {
      const { data } = await apiClient.get(`/menus/slug/${slug}`, {
        params: { language },
      });
      const result = extractData<Menu>(data);
      return result || null;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  /**
   * Get dynamic menu items (e.g., latest categories, trending tags)
   */
  getDynamicItems: async (type: string, limit = 5): Promise<MenuItem[]> => {
    const { data } = await apiClient.get(`/menus/dynamic/${type}`, {
      params: { limit },
    });
    return extractData<MenuItem[]>(data) || [];
  },
};

