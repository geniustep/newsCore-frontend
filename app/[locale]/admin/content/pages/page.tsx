/**
 * NewsCore - Pages Management Page
 * صفحة إدارة الصفحات
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
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
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Globe,
  Home,
} from 'lucide-react';
import { pagesApi } from '@/lib/api/admin';
import { useAdminAuthStore } from '@/stores/admin-auth';
import { cn } from '@/lib/utils/cn';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  template?: string;
  language: string;
  isHomepage?: boolean;
  createdAt: string;
  updatedAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: typeof CheckCircle; label: string }> = {
    PUBLISHED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle, label: 'منشور' },
    DRAFT: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-400', icon: FileText, label: 'مسودة' },
    PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock, label: 'قيد المراجعة' },
    ARCHIVED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle, label: 'مؤرشف' },
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

function PageRow({ page, locale, onDelete }: { page: Page; locale: string; onDelete: (id: string) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const basePath = `/${locale}/admin/content/pages`;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {page.isHomepage ? (
              <Home className="w-5 h-5 text-primary" />
            ) : (
              <FileText className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <Link href={`${basePath}/${page.id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary">
              {page.title}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">/{page.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={page.status} />
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
          <Globe className="w-3 h-3" />
          {page.language}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
        {page.template || 'افتراضي'}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
        {new Date(page.updatedAt).toLocaleDateString('ar-SA')}
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
                  href={`${basePath}/${page.id}`}
                  className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </Link>
                <Link
                  href={`/${locale}/page/${page.slug}`}
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
                  onClick={() => { onDelete(page.id); setShowMenu(false); }}
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

export default function PagesManagementPage() {
  const locale = useLocale();
  const basePath = `/${locale}/admin/content/pages`;
  const { isAuthenticated } = useAdminAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pages', searchQuery, statusFilter],
    queryFn: async () => {
      const result = await pagesApi.getAll({
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      return result as unknown as { data: Page[]; meta: { total: number } };
    },
    enabled: isAuthenticated,
  });

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
      console.log('Delete page:', id);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'PUBLISHED', label: 'منشور' },
    { value: 'DRAFT', label: 'مسودة' },
    { value: 'ARCHIVED', label: 'مؤرشف' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة الصفحات
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إنشاء وتعديل صفحات الموقع الثابتة
          </p>
        </div>
        <Link
          href={`${basePath}/new`}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          صفحة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في الصفحات..."
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

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
        ) : (data?.data?.length ?? 0) > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">الصفحة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">الحالة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">اللغة</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">القالب</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">آخر تحديث</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.data?.map((page: Page) => (
                  <PageRow key={page.id} page={page} locale={locale} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد صفحات</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">ابدأ بإنشاء صفحتك الأولى</p>
            <Link
              href={`${basePath}/new`}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إنشاء صفحة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

