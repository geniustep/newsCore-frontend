import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAdminAuthStore } from '@/stores/admin-auth';

// API Base URL - Use relative path for proxy support
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// Create axios instance for admin API
const createAdminApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  // Request interceptor to add auth token
  api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = useAdminAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Response interceptor to handle errors
  api.interceptors.response.use(
    (response) => response.data?.data ?? response.data,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Try to refresh token
        const refreshToken = useAdminAuthStore.getState().refreshToken;
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            useAdminAuthStore.getState().setTokens(accessToken, newRefreshToken);

            // Retry the original request
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              return axios(error.config);
            }
          } catch {
            useAdminAuthStore.getState().logout();
          }
        } else {
          useAdminAuthStore.getState().logout();
        }
      }

      const message = (error.response?.data as any)?.error?.message || 'حدث خطأ غير متوقع';
      return Promise.reject(new Error(message));
    }
  );

  return api;
};

const api = createAdminApiClient();

// ============================================
// Auth API
// ============================================
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// ============================================
// Articles API
// ============================================
export const articlesApi = {
  getAll: (params?: any) => api.get('/articles', { params }),
  getOne: (id: string) => api.get(`/articles/${id}`),
  create: (data: any) => api.post('/articles', data),
  update: (id: string, data: any) => api.patch(`/articles/${id}`, data),
  delete: (id: string) => api.delete(`/articles/${id}`),
  publish: (id: string) => api.post(`/articles/${id}/publish`),
  unpublish: (id: string) => api.post(`/articles/${id}/unpublish`),
  archive: (id: string) => api.post(`/articles/${id}/archive`),
};

// ============================================
// Categories API
// ============================================
export const categoriesApi = {
  getAll: (includeInactive?: boolean) =>
    api.get('/categories', { params: { includeInactive } }),
  getTree: () => api.get('/categories/tree'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ============================================
// Tags API
// ============================================
export const tagsApi = {
  getAll: (search?: string, type?: string) =>
    api.get('/tags', { params: { search, type } }),
  getPopular: (limit?: number) => api.get('/tags/popular', { params: { limit } }),
  getOne: (id: string) => api.get(`/tags/${id}`),
  create: (data: any) => api.post('/tags', data),
  update: (id: string, data: any) => api.patch(`/tags/${id}`, data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

// ============================================
// Media API
// ============================================
export const mediaApi = {
  getAll: (params?: any) => api.get('/media', { params }),
  getOne: (id: string) => api.get(`/media/${id}`),
  upload: async (file: File, data?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    if (data) {
      Object.keys(data).forEach((key) => {
        if (data[key]) formData.append(key, data[key]);
      });
    }
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: string, data: any) => api.patch(`/media/${id}`, data),
  delete: (id: string) => api.delete(`/media/${id}`),
  getFolders: (parentId?: string) =>
    api.get('/media/folders', { params: { parentId } }),
  createFolder: (name: string, parentId?: string) =>
    api.post('/media/folders', { name, parentId }),
  deleteFolder: (id: string) => api.delete(`/media/folders/${id}`),
};

// ============================================
// Users API
// ============================================
export const usersApi = {
  getAll: (params?: any) => api.get('/users', { params }),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ============================================
// Pages API
// ============================================
export const pagesApi = {
  getAll: (params?: any) => api.get('/pages', { params }),
  getTree: (language?: string) => api.get('/pages/tree', { params: { language } }),
  getOne: (id: string) => api.get(`/pages/${id}`),
  getBySlug: (slug: string, language?: string) =>
    api.get(`/pages/slug/${slug}`, { params: { language } }),
  create: (data: any) => api.post('/pages', data),
  update: (id: string, data: any) => api.patch(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
  publish: (id: string) => api.post(`/pages/${id}/publish`),
  archive: (id: string) => api.post(`/pages/${id}/archive`),
};

// ============================================
// Menus API
// ============================================
export const menusApi = {
  getAll: (params?: any) => api.get('/menus', { params }),
  getOne: (id: string) => api.get(`/menus/${id}`),
  getByLocation: (location: string, params?: any) =>
    api.get(`/menus/location/${location}`, { params }),
  getBySlug: (slug: string, params?: any) =>
    api.get(`/menus/slug/${slug}`, { params }),
  create: (data: any) => api.post('/menus', data),
  update: (id: string, data: any) => api.patch(`/menus/${id}`, data),
  delete: (id: string) => api.delete(`/menus/${id}`),
  createItem: (menuId: string, data: any) =>
    api.post(`/menus/${menuId}/items`, data),
  updateItem: (itemId: string, data: any) =>
    api.patch(`/menus/items/${itemId}`, data),
  deleteItem: (itemId: string) => api.delete(`/menus/items/${itemId}`),
  reorderItems: (menuId: string, items: any[]) =>
    api.post(`/menus/${menuId}/items/reorder`, items),
};

// ============================================
// Settings API
// ============================================
export const settingsApi = {
  getAll: (isPublic?: boolean) => api.get('/settings', { params: { public: isPublic } }),
  getByGroup: (group: string) => api.get(`/settings/group/${group}`),
  getByKey: (key: string) => api.get(`/settings/${key}`),
  create: (data: any) => api.post('/settings', data),
  update: (key: string, data: any) => api.put(`/settings/${key}`, data),
  delete: (key: string) => api.delete(`/settings/${key}`),
  getTheme: () => api.get('/settings/theme'),
  updateTheme: (data: any) => api.put('/settings/theme', data),
};

// ============================================
// Breaking News API
// ============================================
export const breakingNewsApi = {
  getActive: () => api.get('/breaking-news/active'),
  getAll: (params?: any) => api.get('/breaking-news', { params }),
  create: (data: any) => api.post('/breaking-news', data),
  update: (id: string, data: any) => api.patch(`/breaking-news/${id}`, data),
  delete: (id: string) => api.delete(`/breaking-news/${id}`),
  toggle: (id: string) => api.post(`/breaking-news/${id}/toggle`),
};

// ============================================
// Analytics API
// ============================================
export const analyticsApi = {
  getOverview: (params: any) => api.get('/analytics/overview', { params }),
  getPageviews: (params: any) => api.get('/analytics/pageviews', { params }),
  getTopArticles: (params: any) => api.get('/analytics/top-articles', { params }),
  getTrafficSources: (params: any) => api.get('/analytics/traffic-sources', { params }),
  getRealtimeVisitors: () => api.get('/analytics/realtime'),
};

// ============================================
// Themes API
// ============================================
export const themesApi = {
  getAll: () => api.get('/themes'),
  getActive: () => api.get('/themes/active'),
  getOne: (id: string) => api.get(`/themes/${id}`),
  activate: (id: string) => api.post(`/themes/${id}/activate`),
  getSettings: (id: string) => api.get(`/themes/${id}/settings`),
  updateSettings: (id: string, data: any) => api.put(`/themes/${id}/settings`, data),
};

// ============================================
// Modules API
// ============================================
export const modulesApi = {
  getAll: () => api.get('/modules'),
  getOne: (id: string) => api.get(`/modules/${id}`),
  enable: (id: string) => api.post(`/modules/${id}/enable`),
  disable: (id: string) => api.post(`/modules/${id}/disable`),
  getSettings: (id: string) => api.get(`/modules/${id}/settings`),
  updateSettings: (id: string, data: any) => api.put(`/modules/${id}/settings`, data),
};

// ============================================
// Translations API
// ============================================
export const translationsApi = {
  getLanguages: () => api.get('/i18n/languages'),
  getNamespaces: () => api.get('/i18n/namespaces'),
  getTranslations: (namespace: string, language: string) =>
    api.get(`/i18n/translations/${namespace}/${language}`),
  updateTranslation: (id: string, data: any) =>
    api.patch(`/i18n/translations/${id}`, data),
  createTranslation: (data: any) => api.post('/i18n/translations', data),
};

// ============================================
// Combined Admin API Export
// ============================================
export const adminApi = {
  // Auth
  login: authApi.login,
  logout: authApi.logout,
  getProfile: authApi.getProfile,
  
  // Articles
  getArticles: articlesApi.getAll,
  getArticle: articlesApi.getOne,
  createArticle: articlesApi.create,
  updateArticle: articlesApi.update,
  deleteArticle: articlesApi.delete,
  publishArticle: articlesApi.publish,
  
  // Categories
  getCategories: categoriesApi.getAll,
  getCategoryTree: categoriesApi.getTree,
  getCategory: categoriesApi.getOne,
  createCategory: categoriesApi.create,
  updateCategory: categoriesApi.update,
  deleteCategory: categoriesApi.delete,
  
  // Tags
  getTags: tagsApi.getAll,
  getPopularTags: tagsApi.getPopular,
  getTag: tagsApi.getOne,
  createTag: tagsApi.create,
  updateTag: tagsApi.update,
  deleteTag: tagsApi.delete,
  
  // Media
  getMedia: mediaApi.getAll,
  uploadMedia: mediaApi.upload,
  deleteMedia: mediaApi.delete,
  
  // Users
  getUsers: usersApi.getAll,
  getUser: usersApi.getOne,
  createUser: usersApi.create,
  updateUser: usersApi.update,
  deleteUser: usersApi.delete,
  
  // Pages
  getPages: pagesApi.getAll,
  getPage: pagesApi.getOne,
  createPage: pagesApi.create,
  updatePage: pagesApi.update,
  deletePage: pagesApi.delete,
  
  // Menus
  getMenus: menusApi.getAll,
  getMenu: menusApi.getOne,
  createMenu: menusApi.create,
  updateMenu: menusApi.update,
  deleteMenu: menusApi.delete,
  
  // Settings
  getSettings: settingsApi.getAll,
  updateSettings: settingsApi.update,
  getThemeSettings: settingsApi.getTheme,
  updateThemeSettings: settingsApi.updateTheme,
  
  // Breaking News
  getBreakingNews: breakingNewsApi.getAll,
  createBreakingNews: breakingNewsApi.create,
  updateBreakingNews: breakingNewsApi.update,
  deleteBreakingNews: breakingNewsApi.delete,
  
  // Analytics
  getAnalyticsOverview: analyticsApi.getOverview,
  getTopArticles: analyticsApi.getTopArticles,
  
  // Themes
  getThemes: themesApi.getAll,
  activateTheme: themesApi.activate,
  
  // Modules
  getModules: modulesApi.getAll,
  enableModule: modulesApi.enable,
  disableModule: modulesApi.disable,
  
  // Translations
  getLanguages: translationsApi.getLanguages,
  getTranslations: translationsApi.getTranslations,
};

export default adminApi;
