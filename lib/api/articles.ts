import apiClient from './client';
import { Article, PaginatedResponse, ArticleQueryParams } from './types';

// API response wrapper type
interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

// Helper to extract data from API response wrapper
const extractData = <T>(response: ApiResponse<T> | T): T => {
  // API returns { success: true, data: { data: [...], meta: {...} } }
  const res = response as ApiResponse<T>;
  if (res.data !== undefined) {
    return res.data;
  }
  return response as T;
};

export const articlesApi = {
  /**
   * Get all published articles with pagination and filters
   */
  getPublic: async (params?: ArticleQueryParams): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get('/articles/public', { params });
    return extractData<PaginatedResponse<Article>>(data);
  },

  /**
   * Get a single article by slug
   */
  getBySlug: async (slug: string): Promise<Article> => {
    const { data } = await apiClient.get(`/articles/slug/${slug}`);
    // API returns { success: true, data: {...article} }
    return data.data || data;
  },

  /**
   * Get articles by category slug
   */
  getByCategory: async (
    categorySlug: string,
    params?: ArticleQueryParams
  ): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get(`/articles/public/category/${categorySlug}`, { params });
    return extractData<PaginatedResponse<Article>>(data);
  },

  /**
   * Get articles by tag slug
   */
  getByTag: async (
    tagSlug: string,
    params?: ArticleQueryParams
  ): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get(`/articles/public/tag/${tagSlug}`, { params });
    return extractData<PaginatedResponse<Article>>(data);
  },

  /**
   * Search articles
   */
  search: async (query: string, params?: ArticleQueryParams): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get('/articles/public', {
      params: { search: query, ...params },
    });
    return extractData<PaginatedResponse<Article>>(data);
  },

  /**
   * Get featured articles (isFeatured = true)
   */
  getFeatured: async (limit: number = 5): Promise<Article[]> => {
    const { data } = await apiClient.get('/articles/public', {
      params: {
        limit,
        isFeatured: true,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      },
    });
    const result = extractData<PaginatedResponse<Article>>(data);
    return result.data || [];
  },

  /**
   * Get trending articles (most viewed)
   */
  getTrending: async (limit: number = 10): Promise<Article[]> => {
    const { data } = await apiClient.get('/articles/public', {
      params: {
        limit,
        sortBy: 'viewCount',
        sortOrder: 'desc',
      },
    });
    const result = extractData<PaginatedResponse<Article>>(data);
    return result.data || [];
  },
};
