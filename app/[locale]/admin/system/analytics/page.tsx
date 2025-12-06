/**
 * NewsCore - Analytics Dashboard Page
 * صفحة لوحة التحليلات
 */

'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  FileText,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react';
import { analyticsApi } from '@/lib/api/admin';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            isPositive && "bg-green-100 dark:bg-green-900/30 text-green-600",
            isNegative && "bg-red-100 dark:bg-red-900/30 text-red-600",
            !isPositive && !isNegative && "bg-gray-100 dark:bg-gray-700 text-gray-600"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : isNegative ? <TrendingDown className="w-4 h-4" /> : null}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  );
}

function TopArticleRow({ article, index }: { article: { title: string; views: number; slug: string }; index: number }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
        index === 0 && "bg-yellow-100 text-yellow-600",
        index === 1 && "bg-gray-100 text-gray-600",
        index === 2 && "bg-orange-100 text-orange-600",
        index > 2 && "bg-gray-50 text-gray-500"
      )}>
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">{article.title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">/{article.slug}</p>
      </div>
      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
        <Eye className="w-4 h-4" />
        <span className="font-medium">{article.views.toLocaleString('ar-SA')}</span>
      </div>
    </div>
  );
}

function DeviceChart({ data }: { data: { device: string; percentage: number }[] }) {
  const icons: Record<string, React.ReactNode> = {
    desktop: <Monitor className="w-5 h-5" />,
    mobile: <Smartphone className="w-5 h-5" />,
    tablet: <Tablet className="w-5 h-5" />,
  };

  const colors: Record<string, string> = {
    desktop: 'bg-blue-500',
    mobile: 'bg-green-500',
    tablet: 'bg-purple-500',
  };

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.device} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {icons[item.device] || <Globe className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{item.device}</span>
              <span className="text-sm text-gray-500">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full", colors[item.device] || 'bg-gray-500')}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const locale = useLocale();
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');

  const { data: overview, isLoading } = useQuery({
    queryKey: ['admin-analytics-overview', period],
    queryFn: async () => {
      try {
        const result = await analyticsApi.getOverview({ period });
        return result;
      } catch {
        // Return mock data if API fails
        return {
          pageviews: 12543,
          pageviewsChange: 12.5,
          visitors: 4521,
          visitorsChange: 8.3,
          avgDuration: '2:45',
          durationChange: -3.2,
          bounceRate: 42,
          bounceRateChange: -5.1,
        };
      }
    },
  });

  const { data: topArticles } = useQuery({
    queryKey: ['admin-analytics-top-articles', period],
    queryFn: async () => {
      try {
        const result = await analyticsApi.getTopArticles({ period, limit: 10 });
        return result as { title: string; views: number; slug: string }[];
      } catch {
        return [
          { title: 'أهم أخبار اليوم في المنطقة العربية', views: 2543, slug: 'top-news-today' },
          { title: 'تحليل اقتصادي: مستقبل العملات الرقمية', views: 1876, slug: 'crypto-analysis' },
          { title: 'رياضة: نتائج مباريات الدوري', views: 1432, slug: 'sports-results' },
          { title: 'تقنية: أحدث الهواتف الذكية', views: 1205, slug: 'latest-smartphones' },
          { title: 'صحة: نصائح للحياة الصحية', views: 987, slug: 'health-tips' },
        ];
      }
    },
  });

  const deviceData = [
    { device: 'mobile', percentage: 58 },
    { device: 'desktop', percentage: 32 },
    { device: 'tablet', percentage: 10 },
  ];

  const periodOptions = [
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'year', label: 'هذا العام' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            التحليلات
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إحصائيات وتحليلات الموقع
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value as typeof period)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                period === option.value
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4 h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="مشاهدات الصفحات"
            value={(overview?.pageviews || 0).toLocaleString('ar-SA')}
            change={overview?.pageviewsChange}
            icon={<Eye className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            title="الزوار الفريدون"
            value={(overview?.visitors || 0).toLocaleString('ar-SA')}
            change={overview?.visitorsChange}
            icon={<Users className="w-6 h-6 text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            title="متوسط مدة الجلسة"
            value={overview?.avgDuration || '0:00'}
            change={overview?.durationChange}
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
          <StatCard
            title="معدل الارتداد"
            value={`${overview?.bounceRate || 0}%`}
            change={overview?.bounceRateChange}
            icon={<ArrowUpRight className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100 dark:bg-orange-900/30"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Articles */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              أكثر المقالات مشاهدة
            </h2>
          </div>
          <div className="space-y-1">
            {topArticles?.map((article, index) => (
              <TopArticleRow key={article.slug} article={article} index={index} />
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              الأجهزة
            </h2>
          </div>
          <DeviceChart data={deviceData} />
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            مصادر الزيارات
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { source: 'البحث المباشر', value: 45, color: 'bg-blue-500' },
            { source: 'وسائل التواصل', value: 28, color: 'bg-pink-500' },
            { source: 'محركات البحث', value: 18, color: 'bg-green-500' },
            { source: 'الإحالات', value: 9, color: 'bg-purple-500' },
          ].map((item) => (
            <div key={item.source} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.source}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

