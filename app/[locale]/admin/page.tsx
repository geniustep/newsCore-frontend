/**
 * NewsCore Admin Dashboard
 * لوحة التحكم الرئيسية
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  FileText,
  FolderOpen,
  Tag,
  Eye,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  Layers,
  Plus,
  Calendar,
  Activity,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  color,
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={cn('p-3 rounded-xl', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium',
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          )}>
            {changeType === 'increase' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {change}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {title}
        </p>
      </div>
    </Link>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
    >
      <div className={cn('p-3 rounded-xl transition-transform group-hover:scale-110', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </Link>
  );
}

function RecentArticleRow({ article, locale }: { article: { id: string; title: string; status: string; coverImageUrl?: string; author?: { displayName?: string }; createdAt: string }; locale: string }) {
  const getStatusStyles = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      PUBLISHED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'منشور' },
      DRAFT: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-400', label: 'مسودة' },
      PENDING_REVIEW: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'قيد المراجعة' },
      SCHEDULED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'مجدول' },
    };
    return styles[status] || styles.DRAFT;
  };

  const status = getStatusStyles(article.status);

  return (
    <Link
      href={`/${locale}/admin/content/articles/${article.id}`}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors group"
    >
      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-sm">
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.bg, status.text)}>
            {status.label}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {article.author?.displayName}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(article.createdAt).toLocaleDateString('ar-SA')}
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const basePath = `/${locale}/admin`;

  const { data: articlesData } = useQuery({
    queryKey: ['admin-articles-stats'],
    queryFn: async () => adminApi.getArticles({ limit: 1 }) as unknown as { meta?: { total: number }; data?: unknown[] },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => adminApi.getCategories() as unknown as { data?: unknown[] },
  });

  const { data: tagsData } = useQuery({
    queryKey: ['admin-tags-popular'],
    queryFn: async () => adminApi.getPopularTags(10) as unknown as { data?: Array<{ id: string; name: string; usageCount: number }> },
  });

  const { data: recentArticles } = useQuery({
    queryKey: ['admin-recent-articles'],
    queryFn: async () => adminApi.getArticles({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }) as unknown as { data?: Array<{ id: string; title: string; status: string; coverImageUrl?: string; author?: { displayName?: string }; createdAt: string }> },
  });

  const stats = [
    {
      title: t('stats.articles'),
      value: (articlesData as { meta?: { total: number } })?.meta?.total || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase' as const,
      href: `${basePath}/content/articles`,
    },
    {
      title: t('stats.categories'),
      value: categoriesData?.data?.length || 0,
      icon: FolderOpen,
      color: 'bg-green-500',
      href: `${basePath}/content/categories`,
    },
    {
      title: t('stats.tags'),
      value: tagsData?.data?.length || 0,
      icon: Tag,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'increase' as const,
      href: `${basePath}/content/tags`,
    },
    {
      title: t('stats.views'),
      value: '—',
      icon: Eye,
      color: 'bg-orange-500',
      href: `${basePath}/system/analytics`,
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: 'مقالة جديدة',
      description: 'إنشاء مقالة جديدة',
      href: `${basePath}/content/articles/new`,
      color: 'bg-blue-500',
    },
    {
      icon: Layers,
      title: 'باني الصفحات',
      description: 'تخصيص تخطيط الصفحات',
      href: `${basePath}/appearance/builder`,
      color: 'bg-purple-500',
    },
    {
      icon: AlertTriangle,
      title: 'خبر عاجل',
      description: 'إضافة خبر عاجل جديد',
      href: `${basePath}/content/breaking-news`,
      color: 'bg-red-500',
    },
    {
      icon: Users,
      title: 'المستخدمين',
      description: 'إدارة المستخدمين والصلاحيات',
      href: `${basePath}/system/users`,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('welcome')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('ar-SA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            إجراءات سريعة
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <QuickAction key={action.title} {...action} />
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              {t('dashboard.recentArticles')}
            </h2>
            <Link
              href={`${basePath}/content/articles`}
              className="text-sm text-primary hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
            {(recentArticles?.data?.length ?? 0) > 0 ? (
              recentArticles?.data?.map((article) => (
                <RecentArticleRow key={article.id} article={article} locale={locale} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>{t('dashboard.noArticles')}</p>
                <Link
                  href={`${basePath}/content/articles/new`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إنشاء مقالة
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            {t('dashboard.popularTags')}
          </h2>
          <Link
            href={`${basePath}/content/tags`}
            className="text-sm text-primary hover:underline"
          >
            إدارة الوسوم
          </Link>
        </div>
        
        {(tagsData?.data?.length ?? 0) > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tagsData?.data?.map((tag) => (
              <Link
                key={tag.id}
                href={`${basePath}/content/tags/${tag.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag.name}
                <span className="text-xs opacity-60">({tag.usageCount})</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            {t('dashboard.noTags')}
          </div>
        )}
      </div>
    </div>
  );
}

