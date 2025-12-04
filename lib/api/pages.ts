import apiClient from './client';

// Page Types
export interface PageTranslation {
  id: string;
  language: string;
  title: string;
  content: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  isReviewed: boolean;
}

export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  contentHtml?: string;
  excerpt?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  language: string;
  template: string;
  isHomepage: boolean;
  isSystem: boolean;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  allowComments: boolean;
  showInMenu: boolean;
  seo?: PageSEO;
  parent?: {
    id: string;
    title: string;
    slug: string;
  };
  children?: {
    id: string;
    title: string;
    slug: string;
    status: string;
  }[];
  translations?: PageTranslation[];
  sortOrder: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  language?: string;
  template?: string;
  isHomepage?: boolean;
  parentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPagesResponse {
  data: Page[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

export const pagesApi = {
  /**
   * Get all published pages with pagination and filters
   */
  getAll: async (params?: PageQueryParams): Promise<PaginatedPagesResponse> => {
    const formattedParams = params ? {
      ...params,
      page: params.page?.toString(),
      limit: params.limit?.toString(),
      status: params.status || 'PUBLISHED',
    } : { status: 'PUBLISHED' };
    
    const { data } = await apiClient.get('/pages', { params: formattedParams });
    return extractData<PaginatedPagesResponse>(data);
  },

  /**
   * Get page tree structure
   */
  getTree: async (language?: string): Promise<Page[]> => {
    const { data } = await apiClient.get('/pages/tree', {
      params: { language },
    });
    return extractData<Page[]>(data);
  },

  /**
   * Get homepage
   */
  getHomepage: async (language?: string): Promise<Page> => {
    const { data } = await apiClient.get('/pages/homepage', {
      params: { language },
    });
    return extractData<Page>(data);
  },

  /**
   * Get a single page by ID
   */
  getById: async (id: string): Promise<Page> => {
    const { data } = await apiClient.get(`/pages/${id}`);
    return extractData<Page>(data);
  },

  /**
   * Get a single page by slug
   */
  getBySlug: async (slug: string, language?: string): Promise<Page> => {
    const { data } = await apiClient.get(`/pages/slug/${slug}`, {
      params: { language },
    });
    return extractData<Page>(data);
  },

  /**
   * Get page translations
   */
  getTranslations: async (pageId: string): Promise<PageTranslation[]> => {
    const { data } = await apiClient.get(`/pages/${pageId}/translations`);
    return extractData<PageTranslation[]>(data);
  },

  /**
   * Get pages for menu display
   */
  getForMenu: async (language?: string): Promise<Page[]> => {
    const { data } = await apiClient.get('/pages', {
      params: {
        status: 'PUBLISHED',
        showInMenu: 'true',
        language,
        limit: '50',
        sortBy: 'sortOrder',
        sortOrder: 'asc',
      },
    });
    const result = extractData<PaginatedPagesResponse>(data);
    return result.data || [];
  },
};

