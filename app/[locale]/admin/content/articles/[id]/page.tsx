/**
 * NewsCore - Edit Article Page
 * صفحة تعديل المقالة
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
  Clock,
  Image as ImageIcon,
  X,
  Upload,
  FolderOpen,
  Tag,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  CloudOff,
  Cloud,
} from 'lucide-react';
import { articlesApi, categoriesApi, tagsApi } from '@/lib/api/admin';
import { useAdminAuthStore } from '@/stores/admin-auth';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { cn } from '@/lib/utils/cn';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  status: string;
  categories?: Array<{ categoryId: string; category?: Category }>;
  tags?: Array<{ tagId: string; tag?: TagItem }>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Helper to validate UUID
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const articleId = params.id as string;
  const basePath = `/${locale}/admin/content/articles`;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImageUrl: '',
    status: 'DRAFT',
    categoryIds: [] as string[],
    tagIds: [] as string[],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const [showTagSelect, setShowTagSelect] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [hasChanges, setHasChanges] = useState(false);
  const { isAuthenticated } = useAdminAuthStore();
  
  // Refs for auto-save
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Fetch article
  const { data: article, isLoading: isLoadingArticle, error: articleError } = useQuery({
    queryKey: ['admin-article', articleId],
    queryFn: async () => {
      const result = await articlesApi.getOne(articleId);
      return result as unknown as Article;
    },
    enabled: isAuthenticated && !!articleId,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const result = await categoriesApi.getAll();
      return result as unknown as Category[];
    },
    enabled: isAuthenticated,
  });

  // Fetch tags
  const { data: tags } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const result = await tagsApi.getAll();
      return result as unknown as TagItem[];
    },
    enabled: isAuthenticated,
  });

  // Update form data when article is loaded
  useEffect(() => {
    if (article) {
      const newFormData = {
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        coverImageUrl: article.coverImageUrl || '',
        status: article.status || 'DRAFT',
        categoryIds: article.categories?.map(c => c.categoryId).filter(isValidUUID) || [],
        tagIds: article.tags?.map(t => t.tagId).filter(isValidUUID) || [],
        seoTitle: article.seoTitle || '',
        seoDescription: article.seoDescription || '',
        seoKeywords: article.seoKeywords || '',
      };
      setFormData(newFormData);
      lastSavedDataRef.current = JSON.stringify(newFormData);
    }
  }, [article]);

  // Prepare data for API (filter valid UUIDs only)
  const prepareDataForApi = useCallback((data: typeof formData) => {
    return {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || undefined,
      coverImageUrl: data.coverImageUrl || undefined,
      status: data.status,
      categoryIds: data.categoryIds.filter(isValidUUID),
      tagIds: data.tagIds.filter(isValidUUID),
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      seoKeywords: data.seoKeywords || undefined,
    };
  }, []);

  // Update article mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => articlesApi.update(articleId, prepareDataForApi(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-article', articleId] });
      lastSavedDataRef.current = JSON.stringify(formData);
      setHasChanges(false);
      setAutoSaveStatus('saved');
    },
    onError: (error: Error) => {
      setAutoSaveStatus('error');
      setSaveMessage({ type: 'error', text: error.message || 'فشل في حفظ التغييرات' });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: () => articlesApi.delete(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      router.push(basePath);
    },
  });

  // Auto-save function
  const performAutoSave = useCallback(() => {
    if (!formData.title) return; // Don't auto-save if no title
    
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
    setHasChanges(hasUnsavedChanges);
    
    if (hasUnsavedChanges && formData.title) {
      setAutoSaveStatus('unsaved');
      
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set new auto-save timer (3 seconds after last change)
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
    // Clear auto-save timer
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
    if (confirm('هل أنت متأكد من حذف هذه المقالة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteMutation.mutate();
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (!isValidUUID(categoryId)) return;
    setFormData({
      ...formData,
      categoryIds: formData.categoryIds.includes(categoryId)
        ? formData.categoryIds.filter(id => id !== categoryId)
        : [...formData.categoryIds, categoryId],
    });
  };

  const toggleTag = (tagId: string) => {
    if (!isValidUUID(tagId)) return;
    setFormData({
      ...formData,
      tagIds: formData.tagIds.includes(tagId)
        ? formData.tagIds.filter(id => id !== tagId)
        : [...formData.tagIds, tagId],
    });
  };

  const categoriesList = Array.isArray(categories) ? categories : [];
  const tagsList = Array.isArray(tags) ? tags : [];

  const statusOptions = [
    { value: 'DRAFT', label: 'مسودة', color: 'bg-gray-100 text-gray-700' },
    { value: 'PENDING_REVIEW', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'PUBLISHED', label: 'منشور', color: 'bg-green-100 text-green-700' },
    { value: 'SCHEDULED', label: 'مجدول', color: 'bg-blue-100 text-blue-700' },
  ];

  // Auto-save status indicator
  const AutoSaveIndicator = () => {
    const statusConfig = {
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
  if (isLoadingArticle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">جاري تحميل المقالة...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (articleError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">خطأ في تحميل المقالة</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {articleError instanceof Error ? articleError.message : 'حدث خطأ غير متوقع'}
          </p>
          <Link
            href={basePath}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للمقالات
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">تعديل المقالة</h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    آخر تحديث: {article?.updatedAt ? new Date(article.updatedAt).toLocaleDateString('ar-SA') : '-'}
                  </p>
                  <AutoSaveIndicator />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save Message */}
              {saveMessage && (
                <div className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm',
                  saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
                  {saveMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {saveMessage.text}
                </div>
              )}

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
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="عنوان المقالة"
                className="w-full text-3xl font-bold bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>

            {/* Content Editor with Tiptap */}
            <TiptapEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="اكتب محتوى المقالة هنا..."
            />

            {/* Excerpt */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المقتطف
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="وصف مختصر للمقالة..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                الحالة
              </h3>
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

            {/* Featured Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                الصورة البارزة
              </h3>
              {formData.coverImageUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.coverImageUrl} alt="" className="w-full rounded-xl" />
                  <button
                    onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">اضغط لرفع صورة</p>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                placeholder="أو أدخل رابط الصورة"
                className="w-full mt-4 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                التصنيفات
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categoriesList.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                  </label>
                ))}
              </div>
              {categoriesList.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">لا توجد تصنيفات</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                الوسوم
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tagIds.map((tagId) => {
                  const tag = tagsList.find(t => t.id === tagId);
                  return tag ? (
                    <span key={tagId} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {tag.name}
                      <button onClick={() => toggleTag(tagId)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowTagSelect(!showTagSelect)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-right text-sm text-gray-500 hover:border-primary"
                >
                  + إضافة وسم
                </button>
                {showTagSelect && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    {tagsList.filter(t => !formData.tagIds.includes(t.id)).map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => { toggleTag(tag.id); setShowTagSelect(false); }}
                        className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
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
                    placeholder={formData.excerpt || 'وصف الصفحة'}
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
