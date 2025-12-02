import apiClient from './client';
import { Tag } from './types';

export const tagsApi = {
  /**
   * Get all tags
   */
  getAll: async (): Promise<Tag[]> => {
    const { data } = await apiClient.get('/tags');
    return data;
  },

  /**
   * Get a single tag by ID
   */
  getById: async (id: string): Promise<Tag> => {
    const { data } = await apiClient.get(`/tags/${id}`);
    return data;
  },

  /**
   * Get a single tag by slug
   */
  getBySlug: async (slug: string): Promise<Tag> => {
    const { data } = await apiClient.get(`/tags/slug/${slug}`);
    return data;
  },

  /**
   * Get popular tags (most articles)
   */
  getPopular: async (limit: number = 20): Promise<Tag[]> => {
    const tags = await tagsApi.getAll();
    return tags.sort((a, b) => b.articlesCount - a.articlesCount).slice(0, limit);
  },
};
