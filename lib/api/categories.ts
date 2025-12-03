import apiClient from './client';
import { Category } from './types';

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

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories');
    const result = extractData<Category[]>(data);
    return Array.isArray(result) ? result : [];
  },

  /**
   * Get a single category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/${id}`);
    return extractData<Category>(data);
  },

  /**
   * Get a single category by slug
   */
  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/slug/${slug}`);
    return extractData<Category>(data);
  },

  /**
   * Get top-level categories (no parent)
   */
  getTopLevel: async (): Promise<Category[]> => {
    const categories = await categoriesApi.getAll();
    return categories.filter((cat) => !cat.parentId);
  },
};
