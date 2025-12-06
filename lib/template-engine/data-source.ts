/**
 * NewsCore Template Engine - Data Source Engine
 * محرك جلب البيانات للـ Blocks
 */

import { cache } from 'react';
import type { DataSource, DataSourceMode, SortBy, DateRange } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
  views?: number;
  commentsCount?: number;
  author?: {
    id: string;
    name: string;
    displayName?: string;
    avatar?: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface FetchResult {
  articles: Article[];
  total: number;
  hasMore: boolean;
}

interface QueryParams {
  mode: DataSourceMode;
  categoryIds?: string[];
  tagIds?: string[];
  authorIds?: string[];
  articleIds?: string[];
  limit: number;
  offset: number;
  sortBy: SortBy;
  sortOrder: 'asc' | 'desc';
  excludeIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  hasImage?: boolean;
  hasVideo?: boolean;
  status?: string;
  language?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

/**
 * أوقات إعادة التحقق من الكاش حسب نوع المصدر
 */
const REVALIDATE_TIMES: Record<DataSourceMode, number> = {
  breaking: 30,       // 30 ثانية للعاجل
  trending: 60,       // دقيقة للأكثر قراءة
  latest: 60,         // دقيقة لآخر الأخبار
  featured: 120,      // دقيقتين للمميزة
  category: 180,      // 3 دقائق للأقسام
  categories: 180,
  tag: 180,
  tags: 180,
  author: 300,        // 5 دقائق للكتّاب
  authors: 300,
  manual: 300,        // 5 دقائق للاختيار اليدوي
  related: 300,       // 5 دقائق للمقالات ذات الصلة
  mixed: 120,         // دقيقتين للمختلط
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * تحويل النطاق الزمني المُعد مسبقاً إلى تواريخ
 */
function resolveDateRange(dateRange?: DateRange): { from?: string; to?: string } {
  if (!dateRange) return {};
  
  if (dateRange.from || dateRange.to) {
    return { from: dateRange.from, to: dateRange.to };
  }
  
  if (!dateRange.preset) return {};
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (dateRange.preset) {
    case 'today':
      return {
        from: today.toISOString(),
        to: now.toISOString(),
      };
    
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        from: yesterday.toISOString(),
        to: today.toISOString(),
      };
    }
    
    case 'this_week': {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return {
        from: weekStart.toISOString(),
        to: now.toISOString(),
      };
    }
    
    case 'this_month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        from: monthStart.toISOString(),
        to: now.toISOString(),
      };
    }
    
    case 'this_year': {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return {
        from: yearStart.toISOString(),
        to: now.toISOString(),
      };
    }
    
    default:
      return {};
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * بناء معاملات الاستعلام من DataSource
 */
function buildQueryParams(dataSource: DataSource): QueryParams {
  const dates = resolveDateRange(dataSource.dateRange);
  
  return {
    mode: dataSource.mode,
    categoryIds: dataSource.categoryIds,
    tagIds: dataSource.tagIds,
    authorIds: dataSource.authorIds,
    articleIds: dataSource.articleIds,
    limit: dataSource.limit,
    offset: dataSource.offset || 0,
    sortBy: dataSource.sortBy,
    sortOrder: dataSource.sortOrder,
    excludeIds: dataSource.excludeIds,
    dateFrom: dates.from,
    dateTo: dates.to,
    hasImage: dataSource.filters?.hasImage,
    hasVideo: dataSource.filters?.hasVideo,
    status: dataSource.filters?.status,
    language: dataSource.filters?.language,
  };
}

/**
 * تحويل المعاملات إلى query string
 */
function toQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  
  // المعاملات الأساسية
  searchParams.set('mode', params.mode);
  searchParams.set('limit', params.limit.toString());
  searchParams.set('offset', params.offset.toString());
  searchParams.set('sortBy', params.sortBy);
  searchParams.set('sortOrder', params.sortOrder);
  
  // المصفوفات
  if (params.categoryIds?.length) {
    searchParams.set('categoryIds', params.categoryIds.join(','));
  }
  if (params.tagIds?.length) {
    searchParams.set('tagIds', params.tagIds.join(','));
  }
  if (params.authorIds?.length) {
    searchParams.set('authorIds', params.authorIds.join(','));
  }
  if (params.articleIds?.length) {
    searchParams.set('articleIds', params.articleIds.join(','));
  }
  if (params.excludeIds?.length) {
    searchParams.set('excludeIds', params.excludeIds.join(','));
  }
  
  // التواريخ
  if (params.dateFrom) {
    searchParams.set('dateFrom', params.dateFrom);
  }
  if (params.dateTo) {
    searchParams.set('dateTo', params.dateTo);
  }
  
  // الفلاتر
  if (params.hasImage !== undefined) {
    searchParams.set('hasImage', params.hasImage.toString());
  }
  if (params.hasVideo !== undefined) {
    searchParams.set('hasVideo', params.hasVideo.toString());
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.language) {
    searchParams.set('language', params.language);
  }
  
  return searchParams.toString();
}

/**
 * بناء cache tags للاستعلام
 */
function buildCacheTags(dataSource: DataSource): string[] {
  const tags = ['articles'];
  
  // tags حسب المصدر
  switch (dataSource.mode) {
    case 'category':
    case 'categories':
      if (dataSource.categoryIds?.length) {
        tags.push(...dataSource.categoryIds.map(id => `category:${id}`));
      }
      break;
    
    case 'tag':
    case 'tags':
      if (dataSource.tagIds?.length) {
        tags.push(...dataSource.tagIds.map(id => `tag:${id}`));
      }
      break;
    
    case 'author':
    case 'authors':
      if (dataSource.authorIds?.length) {
        tags.push(...dataSource.authorIds.map(id => `author:${id}`));
      }
      break;
    
    case 'manual':
      if (dataSource.articleIds?.length) {
        tags.push(...dataSource.articleIds.map(id => `article:${id}`));
      }
      break;
    
    case 'breaking':
      tags.push('breaking');
      break;
    
    case 'trending':
      tags.push('trending');
      break;
    
    case 'featured':
      tags.push('featured');
      break;
  }
  
  return tags;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA FETCHING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * جلب البيانات من API
 * مع استخدام React cache للتخزين المؤقت في نفس الطلب
 */
export const fetchBlockData = cache(async (dataSource: DataSource): Promise<FetchResult> => {
  try {
    const queryParams = buildQueryParams(dataSource);
    const queryString = toQueryString(queryParams);
    const revalidateTime = REVALIDATE_TIMES[dataSource.mode];
    const cacheTags = buildCacheTags(dataSource);
    
    const response = await fetch(`${API_BASE_URL}/articles/query?${queryString}`, {
      next: {
        revalidate: revalidateTime,
        tags: cacheTags,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      articles: data.articles || data.data || [],
      total: data.total || data.meta?.total || 0,
      hasMore: data.hasMore || data.meta?.hasMore || false,
    };
  } catch (error) {
    console.error('Error fetching block data:', error);
    return {
      articles: [],
      total: 0,
      hasMore: false,
    };
  }
});

/**
 * جلب بيانات لعدة مصادر مختلطة
 */
export async function fetchMixedData(dataSource: DataSource): Promise<FetchResult> {
  if (dataSource.mode !== 'mixed' || !dataSource.mixedSources?.length) {
    return fetchBlockData(dataSource);
  }
  
  // حساب عدد المقالات من كل مصدر بناءً على الوزن
  const totalWeight = dataSource.mixedSources.reduce((sum, s) => sum + (s.weight || 1), 0);
  
  // جلب البيانات من كل مصدر
  const results = await Promise.all(
    dataSource.mixedSources.map(async (source) => {
      const weight = source.weight || 1;
      const limit = Math.ceil((dataSource.limit * weight) / totalWeight);
      
      const subDataSource: DataSource = {
        mode: source.mode,
        categoryIds: source.categoryIds,
        tagIds: source.tagIds,
        limit,
        sortBy: dataSource.sortBy,
        sortOrder: dataSource.sortOrder,
        excludeIds: dataSource.excludeIds,
        filters: dataSource.filters,
      };
      
      return fetchBlockData(subDataSource);
    })
  );
  
  // دمج النتائج
  const allArticles = results.flatMap(r => r.articles);
  
  // إزالة التكرارات
  const uniqueArticles = Array.from(
    new Map(allArticles.map(a => [a.id, a])).values()
  );
  
  // ترتيب حسب التاريخ أو المشاهدات
  uniqueArticles.sort((a, b) => {
    if (dataSource.sortBy === 'views') {
      return dataSource.sortOrder === 'desc' 
        ? (b.views || 0) - (a.views || 0)
        : (a.views || 0) - (b.views || 0);
    }
    
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dataSource.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });
  
  // قص النتائج للحد المطلوب
  const articles = uniqueArticles.slice(0, dataSource.limit);
  
  return {
    articles,
    total: uniqueArticles.length,
    hasMore: uniqueArticles.length > dataSource.limit,
  };
}

/**
 * جلب المقالات ذات الصلة
 */
export async function fetchRelatedArticles(
  articleId: string,
  categoryIds: string[],
  tagIds: string[],
  limit: number = 4
): Promise<Article[]> {
  const dataSource: DataSource = {
    mode: 'related',
    categoryIds,
    tagIds,
    limit,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    excludeIds: [articleId],
  };
  
  const result = await fetchBlockData(dataSource);
  return result.articles;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREFETCHING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * تحميل مسبق لبيانات Template كامل
 */
export async function prefetchTemplateData(
  dataSources: Array<{ blockId: string; dataSource: DataSource }>
): Promise<Map<string, FetchResult>> {
  const results = new Map<string, FetchResult>();
  
  // تتبع المقالات المعروضة لتجنب التكرار
  const displayedIds = new Set<string>();
  
  for (const { blockId, dataSource } of dataSources) {
    // إضافة المقالات المعروضة للاستثناء إذا كان مطلوباً
    const enrichedDataSource: DataSource = {
      ...dataSource,
      excludeIds: dataSource.excludeFromOther 
        ? [...(dataSource.excludeIds || []), ...displayedIds]
        : dataSource.excludeIds,
    };
    
    // جلب البيانات
    const result = dataSource.mode === 'mixed'
      ? await fetchMixedData(enrichedDataSource)
      : await fetchBlockData(enrichedDataSource);
    
    results.set(blockId, result);
    
    // تحديث المقالات المعروضة
    result.articles.forEach(a => displayedIds.add(a.id));
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA (للتطوير)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * بيانات وهمية للتطوير
 */
export function getMockArticles(count: number): Article[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `article-${i + 1}`,
    slug: `article-${i + 1}`,
    title: `عنوان المقال رقم ${i + 1} - هذا عنوان تجريبي للمقال`,
    excerpt: 'هذا مقتطف تجريبي للمقال يعرض ملخصاً قصيراً عن محتوى المقال الكامل.',
    coverImageUrl: `https://picsum.photos/seed/${i + 1}/800/450`,
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    readingTime: Math.floor(Math.random() * 10) + 2,
    views: Math.floor(Math.random() * 10000),
    commentsCount: Math.floor(Math.random() * 100),
    author: {
      id: `author-${(i % 5) + 1}`,
      name: ['أحمد محمد', 'سارة علي', 'محمد خالد', 'فاطمة حسن', 'عمر يوسف'][i % 5],
      avatar: `https://i.pravatar.cc/100?img=${(i % 5) + 1}`,
    },
    categories: [
      {
        id: `category-${(i % 4) + 1}`,
        name: ['Politics', 'Sports', 'Technology', 'Entertainment'][i % 4],
        nameAr: ['سياسة', 'رياضة', 'تكنولوجيا', 'ترفيه'][i % 4],
        slug: ['politics', 'sports', 'technology', 'entertainment'][i % 4],
      },
    ],
    tags: [
      { id: 'tag-1', name: 'أخبار', slug: 'news' },
      { id: 'tag-2', name: 'عاجل', slug: 'breaking' },
    ],
  }));
}

/**
 * جلب بيانات وهمية (للتطوير بدون backend)
 */
export async function fetchMockBlockData(dataSource: DataSource): Promise<FetchResult> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const articles = getMockArticles(dataSource.limit);
  
  return {
    articles,
    total: 100,
    hasMore: true,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type { Article, FetchResult, QueryParams };
