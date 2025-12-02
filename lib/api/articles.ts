import apiClient from './client';
import { Article, PaginatedResponse, ArticleQueryParams } from './types';

export const articlesApi = {
  /**
   * Get all published articles with pagination and filters
   */
  getPublic: async (params?: ArticleQueryParams): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get('/articles/public', { params });
    return data;
  },

  /**
   * Get a single article by slug
   */
  getBySlug: async (slug: string): Promise<Article> => {
    const { data } = await apiClient.get(`/articles/slug/${slug}`);
    return data;
  },

  /**
   * Get articles by category slug
   */
  getByCategory: async (
    categorySlug: string,
    params?: ArticleQueryParams
  ): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get(`/articles/public/category/${categorySlug}`, { params });
    return data;
  },

  /**
   * Get articles by tag slug
   */
  getByTag: async (
    tagSlug: string,
    params?: ArticleQueryParams
  ): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get(`/articles/public/tag/${tagSlug}`, { params });
    return data;
  },

  /**
   * Search articles
   */
  search: async (query: string, params?: ArticleQueryParams): Promise<PaginatedResponse<Article>> => {
    const { data } = await apiClient.get('/articles/public', {
      params: { search: query, ...params },
    });
    return data;
  },

  /**
   * Get featured articles (most viewed or latest)
   */
  getFeatured: async (limit: number = 5): Promise<Article[]> => {
    const { data } = await apiClient.get('/articles/public', {
      params: {
        limit,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      },
    });
    return data.data;
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
    return data.data;
  },
};
