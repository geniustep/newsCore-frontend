/**
 * NewsCore - New Article Page
 * صفحة إنشاء مقالة جديدة مع الحفظ التلقائي كمسودة
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  Loader2,
  Cloud,
  CloudOff,
  AlertCircle,
  CheckCircle,
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

interface CreatedArticle {
  id: string;
  title: string;
  status: string;
}

// Helper to validate UUID
const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export default function NewArticlePage() {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
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
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saved' | 'saving' | 'unsaved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [createdArticleId, setCreatedArticleId] = useState<string | null>(null);
  const { isAuthenticated } = useAdminAuthStore();
  
  // Refs for auto-save
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isFirstSaveRef = useRef(true);

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

  // Create article mutation (first save)
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => articlesApi.create(prepareDataForApi(data)),
    onSuccess: (result) => {
      const article = result as unknown as CreatedArticle;
      setCreatedArticleId(article.id);
      isFirstSaveRef.current = false;
      lastSavedDataRef.current = JSON.stringify(formData);
      setAutoSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    },
    onError: (error: Error) => {
      setAutoSaveStatus('error');
      setSaveMessage({ type: 'error', text: error.message || 'فشل في إنشاء المقالة' });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  // Update article mutation (subsequent saves)
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      if (!createdArticleId) throw new Error('No article ID');
      return articlesApi.update(createdArticleId, prepareDataForApi(data));
    },
    onSuccess: () => {
      lastSavedDataRef.current = JSON.stringify(formData);
      setAutoSaveStatus('saved');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    },
    onError: (error: Error) => {
      setAutoSaveStatus('error');
      setSaveMessage({ type: 'error', text: error.message || 'فشل في حفظ التغييرات' });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  // Auto-save function
  const performAutoSave = useCallback(() => {
    if (!formData.title) return; // Don't auto-save if no title
    
    const currentData = JSON.stringify(formData);
    if (currentData !== lastSavedDataRef.current) {
      setAutoSaveStatus('saving');
      
      if (isFirstSaveRef.current && !createdArticleId) {
        // First save - create the article as draft
        createMutation.mutate({ ...formData, status: 'DRAFT' });
      } else if (createdArticleId) {
        // Subsequent saves - update the article
        updateMutation.mutate(formData);
      }
    }
  }, [formData, createdArticleId, createMutation, updateMutation]);

  // Track changes and trigger auto-save
  useEffect(() => {
    if (!formData.title) return; // Don't track changes until there's a title
    
    const currentData = JSON.stringify(formData);
    const hasUnsavedChanges = currentData !== lastSavedDataRef.current;
    
    if (hasUnsavedChanges) {
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

  const handleSubmit = (status: string = 'DRAFT') => {
    // Clear auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    const dataToSubmit = { ...formData, status };
    
    if (isFirstSaveRef.current && !createdArticleId) {
      // First save
      createMutation.mutate(dataToSubmit, {
        onSuccess: (result) => {
          const article = result as unknown as CreatedArticle;
          setSaveMessage({ type: 'success', text: status === 'PUBLISHED' ? 'تم نشر المقالة بنجاح' : 'تم حفظ المقالة بنجاح' });
          setTimeout(() => {
            router.push(`${basePath}/${article.id}`);
          }, 1000);
        }
      });
    } else if (createdArticleId) {
      // Update existing draft
      updateMutation.mutate(dataToSubmit, {
        onSuccess: () => {
          setSaveMessage({ type: 'success', text: status === 'PUBLISHED' ? 'تم نشر المقالة بنجاح' : 'تم حفظ المقالة بنجاح' });
          setTimeout(() => {
            router.push(`${basePath}/${createdArticleId}`);
          }, 1000);
        }
      });
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

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Auto-save status indicator
  const AutoSaveIndicator = () => {
    if (autoSaveStatus === 'idle') return null;
    
    const statusConfig: Record<string, { icon: typeof Cloud; text: string; color: string; animate?: boolean }> = {
      idle: { icon: Cloud, text: '', color: 'text-gray-400' },
      saved: { icon: Cloud, text: 'تم الحفظ التلقائي', color: 'text-green-600' },
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">مقالة جديدة</h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">إنشاء مقالة جديدة</p>
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
                onClick={() => handleSubmit('DRAFT')}
                disabled={isPending}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                حفظ كمسودة
              </button>
              <button
                onClick={() => handleSubmit('PENDING_REVIEW')}
                disabled={isPending}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                إرسال للمراجعة
              </button>
              <button
                onClick={() => handleSubmit('PUBLISHED')}
                disabled={isPending}
                className="px-5 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Eye className="w-4 h-4" />
                نشر
              </button>
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
