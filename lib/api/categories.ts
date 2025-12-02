import apiClient from './client';
import { Category } from './types';

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories');
    return data;
  },

  /**
   * Get a single category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/${id}`);
    return data;
  },

  /**
   * Get a single category by slug
   */
  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/slug/${slug}`);
    return data;
  },

  /**
   * Get top-level categories (no parent)
   */
  getTopLevel: async (): Promise<Category[]> => {
    const categories = await categoriesApi.getAll();
    return categories.filter((cat) => !cat.parentId);
  },
};
