// Author Type (from API)
export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string;
}

// User Type (legacy)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Category Type
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  articlesCount: number;
  createdAt: string;
  updatedAt: string;
}

// Tag Type
export interface Tag {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  articlesCount: number;
  createdAt: string;
  updatedAt: string;
}

// SEO Type
export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

// Article Type
export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  content?: string;
  excerpt?: string;
  coverImageUrl?: string;
  featuredImage?: string; // legacy alias
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  type?: string;
  language?: string;
  isPinned?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  readingTime?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: Author | User;
  categories?: Category[];
  category?: Category;
  tags?: Tag[];
  viewCount?: number;
  seo?: SEO;
}

// Pagination Meta
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// API Query Params
export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tagId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
