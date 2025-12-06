/**
 * NewsCore - Articles Management Page
 * صفحة إدارة المقالات
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  FolderOpen,
  ArrowUpDown,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { useAdminAuthStore } from '@/stores/admin-auth';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  author?: { displayName: string; avatarUrl?: string } | null;
  categories?: Array<{ category?: { name: string; slug: string } | null }> | null;
  coverImageUrl?: string;
  publishedAt?: string;
  createdAt: string;
  viewsTotal?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: typeof CheckCircle; label: string }> = {
    PUBLISHED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle, label: 'منشور' },
    DRAFT: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-400', icon: FileText, label: 'مسودة' },
    PENDING_REVIEW: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock, label: 'قيد المراجعة' },
    SCHEDULED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Calendar, label: 'مجدول' },
    REJECTED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle, label: 'مرفوض' },
  };

  const style = styles[status] || styles.DRAFT;
  const Icon = style.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', style.bg, style.text)}>
      <Icon className="w-3.5 h-3.5" />
      {style.label}
    </span>
  );
}

function ArticleRow({ article, locale, onDelete }: { article: Article; locale: string; onDelete: (id: string) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const basePath = `/${locale}/admin/content/articles`;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 relative">
            {article.coverImageUrl ? (
              <Image 
                src={article.coverImageUrl} 
                alt={article.title || ''} 
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link href={`${basePath}/${article.id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary truncate block">
              {article.title}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              /{article.slug}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={article.status} />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
            {article.author?.avatarUrl ? (
              <Image 
                src={article.author.avatarUrl} 
                alt={article.author?.displayName || 'Author'} 
                fill
                className="object-cover rounded-full"
                sizes="32px"
                unoptimized
              />
            ) : (
              <User className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {article.author?.displayName || 'غير معروف'}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        {article.categories?.[0]?.category?.name && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
            <FolderOpen className="w-3 h-3" />
            {article.categories[0]?.category?.name}
          </span>
        )}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
        {new Date(article.createdAt).toLocaleDateString('ar-SA')}
      </td>
      <td className="px-4 py-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-40">
                <Link
                  href={`${basePath}/${article.id}`}
                  className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </Link>
                <Link
                  href={`/${locale}/article/${article.slug}`}
                  target="_blank"
                  className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  معاينة
                </Link>
                <button className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  نسخ
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => { onDelete(article.id); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function ArticlesPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const basePath = `/${locale}/admin/content/articles`;
  const { isAuthenticated } = useAdminAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-articles', page, searchQuery, statusFilter],
    queryFn: async () => {
      try {
        const result = await adminApi.getArticles({
          page,
          limit: 20,
          search: searchQuery || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        }) as unknown as { data?: Article[]; meta?: { total: number; page: number; totalPages: number } };
        
        // Normalize the data structure to ensure all fields are properly typed
        const normalizedData = {
          data: (result?.data || []).map((article: unknown) => {
            const art = article as Article;
            return {
              ...art,
              author: art.author || null,
              categories: art.categories || [],
            };
          }),
          meta: result?.meta || { total: 0, page: 1, totalPages: 1 },
        };
        
        return normalizedData as { data: Article[]; meta: { total: number; page: number; totalPages: number } };
      } catch (err: unknown) {
        console.error('Error fetching articles:', err);
        throw err;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    retryDelay: 1000,
  });

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المقالة؟')) {
      // TODO: Implement delete
      console.log('Delete article:', id);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'PUBLISHED', label: 'منشور' },
    { value: 'DRAFT', label: 'مسودة' },
    { value: 'PENDING_REVIEW', label: 'قيد المراجعة' },
    { value: 'SCHEDULED', label: 'مجدول' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('articles.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إدارة جميع المقالات والأخبار
          </p>
        </div>
        <Link
          href={`${basePath}/new`}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          {t('articles.new')}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المقالات..."
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    statusFilter === option.value
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">جاري التحميل...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              حدث خطأ
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {error instanceof Error ? error.message : 'فشل في تحميل المقالات. يرجى المحاولة مرة أخرى.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (data?.data?.length ?? 0) > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المقالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الكاتب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    التصنيف
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      التاريخ
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.data?.map((article: Article) => (
                  <ArticleRow
                    key={article.id}
                    article={article}
                    locale={locale}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا توجد مقالات
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              ابدأ بإنشاء مقالتك الأولى
            </p>
            <Link
              href={`${basePath}/new`}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إنشاء مقالة
            </Link>
          </div>
        )}

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              عرض {((page - 1) * 20) + 1} - {Math.min(page * 20, data.meta.total)} من {data.meta.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
              >
                السابق
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.meta.totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

