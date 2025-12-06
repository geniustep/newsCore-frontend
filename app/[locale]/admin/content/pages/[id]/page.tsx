/**
 * NewsCore - Edit Page
 * صفحة تعديل الصفحة
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  Save,
  Eye,
  Palette,
  Globe,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Cloud,
  CloudOff,
  Home,
  Settings,
} from 'lucide-react';
import { pagesApi } from '@/lib/api/admin';
import { useAdminAuthStore } from '@/stores/admin-auth';
import { useBuilderStore } from '@/stores/builder-store';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { cn } from '@/lib/utils/cn';
import type { Template } from '@/lib/template-engine/types';
import { generateId, DEFAULT_TEMPLATE_SETTINGS } from '@/lib/template-engine/types';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  template?: string;
  language: string;
  isHomepage?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const pageId = params.id as string;
  const basePath = `/${locale}/admin/content/pages`;
  const builderPath = `/${locale}/admin/appearance/builder`;
  const { setTemplate } = useBuilderStore();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'DRAFT',
    template: 'default',
    language: locale,
    isHomepage: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const { isAuthenticated } = useAdminAuthStore();
  
  // Refs for auto-save
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Fetch page
  const { data: page, isLoading: isLoadingPage, error: pageError } = useQuery({
    queryKey: ['admin-page', pageId],
    queryFn: async () => {
      const result = await pagesApi.getOne(pageId);
      return result as unknown as Page;
    },
    enabled: isAuthenticated && !!pageId,
  });

  // Update form data when page is loaded
  useEffect(() => {
    if (page) {
      const newFormData = {
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        status: page.status || 'DRAFT',
        template: page.template || 'default',
        language: page.language || locale,
        isHomepage: page.isHomepage || false,
        seoTitle: page.seoTitle || '',
        seoDescription: page.seoDescription || '',
        seoKeywords: page.seoKeywords || '',
      };
      setFormData(newFormData);
      lastSavedDataRef.current = JSON.stringify(newFormData);
    }
  }, [page, locale]);

  // Prepare data for API
  const prepareDataForApi = useCallback((data: typeof formData) => {
    const apiData: Record<string, unknown> = {
      title: data.title,
      status: data.status,
    };
    
    // Only add optional fields if they have values
    if (data.content) apiData.content = data.content;
    if (data.seoTitle) apiData.seoTitle = data.seoTitle;
    if (data.seoDescription) apiData.seoDescription = data.seoDescription;
    if (data.seoKeywords) apiData.seoKeywords = data.seoKeywords;
    
    return apiData;
  }, []);

  // Update page mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => pagesApi.update(pageId, prepareDataForApi(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-page', pageId] });
      lastSavedDataRef.current = JSON.stringify(formData);
      setAutoSaveStatus('saved');
    },
    onError: (error: Error) => {
      setAutoSaveStatus('error');
      setSaveMessage({ type: 'error', text: error.message || 'فشل في حفظ التغييرات' });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  // Delete page mutation
  const deleteMutation = useMutation({
    mutationFn: () => pagesApi.delete(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      router.push(basePath);
    },
  });

  // Auto-save function
  const performAutoSave = useCallback(() => {
    if (!formData.title) return;
    
    const currentData = JSON.stringify(formData);
    if (currentData !== lastSavedDataRef.current) {
      setAutoSaveStatus('saving');
      updateMutation.mutate(formData);
    }
  }, [formData, updateMutation]);

  // Track changes and trigger auto-save
  useEffect(() => {
    const currentData = JSON.stringify(formData);
    const hasUnsavedChanges = currentData !== lastSavedDataRef.current;
    
    if (hasUnsavedChanges && formData.title) {
      setAutoSaveStatus('unsaved');
      
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave();
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData, performAutoSave]);

  const handleSubmit = (status?: string) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    const dataToSubmit = status ? { ...formData, status } : formData;
    setAutoSaveStatus('saving');
    updateMutation.mutate(dataToSubmit, {
      onSuccess: () => {
        setSaveMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });
        setTimeout(() => setSaveMessage(null), 3000);
      }
    });
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذه الصفحة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteMutation.mutate();
    }
  };

  const handleOpenBuilder = () => {
    // Create a template for the builder based on page content
    const pageTemplate: Template = {
      id: `page-${pageId}`,
      name: formData.title || 'Page',
      nameAr: formData.title || 'صفحة',
      description: '',
      descriptionAr: '',
      type: 'page',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false,
      isActive: true,
      preview: '',
      
      layout: { type: 'full-width' },
      regions: {
        header: { enabled: true },
        breakingNews: { enabled: false },
        sidebar: { enabled: false },
        footer: { enabled: true },
      },
      settings: DEFAULT_TEMPLATE_SETTINGS,
      sections: [
        {
          id: generateId('section'),
          name: 'Main Content',
          nameAr: 'المحتوى الرئيسي',
          order: 0,
          container: 'normal',
          grid: {
            columns: { desktop: 12, tablet: 12, mobile: 12 },
            gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
          },
          padding: {
            desktop: { top: 'xl', bottom: 'xl', left: 'md', right: 'md' },
          },
          margin: {
            desktop: { top: 'none', bottom: 'none' },
          },
          blocks: [],
        },
      ],
    };
    
    localStorage.setItem('builder_template', JSON.stringify(pageTemplate));
    localStorage.setItem('builder_page_id', pageId);
    setTemplate(pageTemplate);
    router.push(`${builderPath}?mode=page&pageId=${pageId}`);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const statusOptions = [
    { value: 'DRAFT', label: 'مسودة', color: 'bg-gray-100 text-gray-700' },
    { value: 'PUBLISHED', label: 'منشور', color: 'bg-green-100 text-green-700' },
    { value: 'ARCHIVED', label: 'مؤرشف', color: 'bg-red-100 text-red-700' },
  ];

  // Auto-save status indicator
  const AutoSaveIndicator = () => {
    const statusConfig: Record<string, { icon: typeof Cloud; text: string; color: string; animate?: boolean }> = {
      saved: { icon: Cloud, text: 'تم الحفظ', color: 'text-green-600' },
      saving: { icon: Loader2, text: 'جاري الحفظ...', color: 'text-blue-600', animate: true },
      unsaved: { icon: CloudOff, text: 'تغييرات غير محفوظة', color: 'text-yellow-600' },
      error: { icon: AlertCircle, text: 'خطأ في الحفظ', color: 'text-red-600' },
    };
    
    const config = statusConfig[autoSaveStatus];
    const Icon = config.icon;
    
    return (
      <div className={cn('flex items-center gap-1.5 text-sm', config.color)}>
        <Icon className={cn('w-4 h-4', config.animate && 'animate-spin')} />
        <span>{config.text}</span>
      </div>
    );
  };

  // Loading state
  if (isLoadingPage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">خطأ في تحميل الصفحة</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {pageError instanceof Error ? pageError.message : 'حدث خطأ غير متوقع'}
          </p>
          <Link
            href={basePath}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للصفحات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={basePath}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">تعديل الصفحة</h1>
                  {formData.isHomepage && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                      <Home className="w-3 h-3" />
                      الصفحة الرئيسية
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    آخر تحديث: {page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString('ar-SA') : '-'}
                  </p>
                  <AutoSaveIndicator />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saveMessage && (
                <div className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm',
                  saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
                  {saveMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {saveMessage.text}
                </div>
              )}

              {/* Preview Button */}
              {page?.slug && (
                <a
                  href={`/${locale}/page/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  معاينة
                </a>
              )}
              <button
                onClick={handleOpenBuilder}
                className="px-4 py-2 border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Builder
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={updateMutation.isPending}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                حفظ
              </button>
              {formData.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handleSubmit('PUBLISHED')}
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Eye className="w-4 h-4" />
                  نشر
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="عنوان الصفحة"
                className="w-full text-3xl font-bold bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">الرابط:</span>
                <span className="text-sm text-gray-400">/page/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 text-sm bg-gray-50 dark:bg-gray-700 border-0 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Content Editor */}
            <TiptapEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="اكتب محتوى الصفحة هنا..."
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                الإعدادات
              </h3>
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">الحالة</label>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={formData.status === option.value}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="text-primary focus:ring-primary"
                        />
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', option.color)}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">اللغة</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{formData.language === 'ar' ? 'العربية' : formData.language === 'en' ? 'English' : formData.language}</span>
                  </div>
                </div>

                {/* Homepage toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isHomepage}
                      onChange={(e) => setFormData({ ...formData, isHomepage: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">تعيين كصفحة رئيسية</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">إعدادات SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">عنوان SEO</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder={formData.title || 'عنوان الصفحة'}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">وصف SEO</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="وصف الصفحة"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الكلمات المفتاحية</label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                    placeholder="كلمة1, كلمة2, كلمة3"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

