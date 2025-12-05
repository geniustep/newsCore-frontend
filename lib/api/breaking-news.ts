import apiClient from './client';

export interface BreakingNewsItem {
  id: string;
  title: string;
  url: string;
  priority: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt?: string;
  author?: {
    id: string;
    displayName: string;
  };
}

export const breakingNewsApi = {
  /**
   * Get active breaking news (public endpoint)
   */
  getActive: async (): Promise<BreakingNewsItem[]> => {
    const { data } = await apiClient.get('/breaking-news/active');
    return data.data || data;
  },

  /**
   * Get all breaking news (admin only)
   */
  getAll: async (): Promise<BreakingNewsItem[]> => {
    const { data } = await apiClient.get('/breaking-news');
    return data.data || data;
  },

  /**
   * Create a new breaking news item
   */
  create: async (item: {
    title: string;
    url?: string;
    priority?: number;
    isActive?: boolean;
    expiresAt?: string;
  }): Promise<BreakingNewsItem> => {
    const { data } = await apiClient.post('/breaking-news', item);
    return data.data || data;
  },

  /**
   * Update a breaking news item
   */
  update: async (
    id: string,
    item: Partial<BreakingNewsItem>
  ): Promise<BreakingNewsItem> => {
    const { data } = await apiClient.patch(`/breaking-news/${id}`, item);
    return data.data || data;
  },

  /**
   * Delete a breaking news item
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/breaking-news/${id}`);
  },

  /**
   * Toggle breaking news active status
   */
  toggle: async (id: string): Promise<{ id: string; isActive: boolean }> => {
    const { data } = await apiClient.post(`/breaking-news/${id}/toggle`);
    return data.data || data;
  },
};
