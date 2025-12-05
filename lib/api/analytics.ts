import apiClient from './client';

export interface AnalyticsOverview {
  pageViews: number;
  pageViewsChange: number;
  visitors: number;
  visitorsChange: number;
  avgTimeOnSite: number;
  avgTimeChange: number;
  bounceRate: number;
  bounceRateChange: number;
}

export interface PageviewData {
  date: string;
  views: number;
}

export interface TopArticle {
  id: string;
  title: string;
  slug: string;
  coverImageUrl?: string | null;
  views: number;
  publishedAt?: string | null;
}

export interface TrafficSource {
  name: string;
  count: number;
  percentage: number;
}

export interface RealtimeVisitors {
  count: number;
  timestamp: string;
}

export const analyticsApi = {
  /**
   * Get analytics overview
   */
  getOverview: async (params?: {
    period?: '1day' | '7days' | '30days' | '90days';
  }): Promise<AnalyticsOverview> => {
    const { data } = await apiClient.get('/analytics/overview', { params });
    return data.data || data;
  },

  /**
   * Get pageviews data
   */
  getPageviews: async (params?: {
    period?: '1day' | '7days' | '30days' | '90days';
  }): Promise<PageviewData[]> => {
    const { data } = await apiClient.get('/analytics/pageviews', { params });
    return data.data || data;
  },

  /**
   * Get top articles
   */
  getTopArticles: async (params?: {
    limit?: number;
    period?: '1day' | '7days' | '30days' | '90days';
  }): Promise<TopArticle[]> => {
    const { data } = await apiClient.get('/analytics/top-articles', {
      params: params ? {
        ...params,
        limit: params.limit?.toString(),
      } : undefined,
    });
    return data.data || data;
  },

  /**
   * Get traffic sources
   */
  getTrafficSources: async (params?: {
    period?: '1day' | '7days' | '30days' | '90days';
  }): Promise<TrafficSource[]> => {
    const { data } = await apiClient.get('/analytics/traffic-sources', { params });
    return data.data || data;
  },

  /**
   * Get realtime visitors
   */
  getRealtimeVisitors: async (): Promise<RealtimeVisitors> => {
    const { data } = await apiClient.get('/analytics/realtime');
    return data.data || data;
  },
};
