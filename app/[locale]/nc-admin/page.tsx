'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  FolderOpen,
  Tag,
  Eye,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { cn } from '@/lib/utils/cn';

export default function DashboardPage() {
  const t = useTranslations('admin');

  const { data: articlesData } = useQuery({
    queryKey: ['admin-articles-stats'],
    queryFn: () => adminApi.getArticles({ limit: 1 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['admin-tags-popular'],
    queryFn: () => adminApi.getPopularTags(10),
  });

  const { data: recentArticles } = useQuery({
    queryKey: ['admin-recent-articles'],
    queryFn: () => adminApi.getArticles({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
  });

  const articlesResponse = (articlesData as { data?: unknown } | undefined)?.data || articlesData;
  const categoriesResponse = (categoriesData as { data?: unknown[] } | undefined)?.data || categoriesData;
  const tagsResponse = (tagsData as { data?: Array<{ id: string; name: string; usageCount: number }> } | undefined)?.data || tagsData;

  const stats = [
    {
      name: t('stats.articles'),
      value: articlesResponse?.meta?.total || 0,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      name: t('stats.categories'),
      value: categoriesResponse?.data?.length || categoriesResponse?.length || 0,
      icon: FolderOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      name: t('stats.tags'),
      value: tagsResponse?.data?.length || tagsResponse?.length || 0,
      icon: Tag,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      name: t('stats.views'),
      value: '—',
      icon: Eye,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PUBLISHED: {
        label: t('dashboard.status.published'),
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      },
      DRAFT: {
        label: t('dashboard.status.draft'),
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
      },
      PENDING_REVIEW: {
        label: t('dashboard.status.pending'),
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      },
      SCHEDULED: {
        label: t('dashboard.status.scheduled'),
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      },
    };
    return statusMap[status] || statusMap.DRAFT;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('welcome')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className={cn('p-3 rounded-lg', stat.color)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              {t('dashboard.recentArticles')}
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {(() => {
              type ArticleType = { id: string; title: string; status: string; author?: { displayName?: string } };
              const recentData = recentArticles as { data?: { data?: ArticleType[] } | ArticleType[] } | undefined;
              const recent: ArticleType[] = (recentData?.data as { data?: ArticleType[] })?.data || (recentData?.data as ArticleType[]) || [];
              return recent.length > 0 ? recent.map((article) => {
                const status = getStatusBadge(article.status);
                return (
                  <div
                    key={article.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {article.author?.displayName}
                      </span>
                    </div>
                  </div>
                );
              }) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {t('dashboard.noArticles')}
              </div>
            );
            })()}
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              {t('dashboard.popularTags')}
            </h2>
          </div>
          <div className="p-6">
            {(() => {
              type TagType = { id: string; name: string; usageCount: number };
              const tags: TagType[] = (tagsResponse as { data?: TagType[] })?.data || (tagsResponse as TagType[]) || [];
              return tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    {tag.name}
                    <span className="text-xs text-gray-400">
                      ({tag.usageCount})
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                {t('dashboard.noTags')}
              </div>
            );
            })()}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          icon={FileText}
          label={t('articles.new')}
          href="articles/new"
          color="bg-blue-500"
        />
        <QuickActionCard
          icon={FolderOpen}
          label={t('categories.new')}
          href="categories?action=new"
          color="bg-green-500"
        />
        <QuickActionCard
          icon={Users}
          label={t('users.new')}
          href="users?action=new"
          color="bg-purple-500"
        />
        <QuickActionCard
          icon={BarChart3}
          label={t('nav.analytics')}
          href="analytics"
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:scale-[1.02]"
    >
      <div className={cn('p-3 rounded-lg', color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
        {label}
      </span>
    </a>
  );
}
