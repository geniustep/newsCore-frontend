export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'أخبار اليوم',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
  description: 'موقعك الإخباري الأول',
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'ar',
} as const;

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://admin.sahara2797.com/api/v1',
  timeout: 10000,
} as const;

export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 50,
} as const;

export const CACHE_TIMES = {
  articles: 60 * 5, // 5 minutes
  categories: 60 * 30, // 30 minutes
  tags: 60 * 30, // 30 minutes
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
} as const;
