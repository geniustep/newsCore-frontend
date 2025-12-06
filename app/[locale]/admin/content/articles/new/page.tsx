/**
 * NewsCore - New Article Page
 * صفحة إنشاء مقالة جديدة
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Save,
  Eye,
  Clock,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  Heading1,
  Heading2,
  Plus,
  X,
  Upload,
  FolderOpen,
  Tag,
} from 'lucide-react';
import { articlesApi, categoriesApi, tagsApi } from '@/lib/api/admin';
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

export default function NewArticlePage() {
  const router = useRouter();
  const locale = useLocale();
  const basePath = `/${locale}/admin/content/articles`;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImageUrl: '',
    status: 'DRAFT',
    categoryIds: [] as string[],
    tagIds: [] as string[],
    seo: {
      title: '',
      description: '',
      keywords: '',
    },
  });

  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showTagSelect, setShowTagSelect] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const result = await categoriesApi.getAll();
      return result as unknown as Category[];
    },
  });

  // Fetch tags
  const { data: tags } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const result = await tagsApi.getAll();
      return result as unknown as TagItem[];
    },
  });

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => articlesApi.create(data),
    onSuccess: () => {
      router.push(basePath);
    },
  });

  const handleSubmit = (status: string = 'DRAFT') => {
    createMutation.mutate({ ...formData, status });
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

  const toggleCategory = (categoryId: string) => {
    setFormData({
      ...formData,
      categoryIds: formData.categoryIds.includes(categoryId)
        ? formData.categoryIds.filter(id => id !== categoryId)
        : [...formData.categoryIds, categoryId],
    });
  };

  const toggleTag = (tagId: string) => {
    setFormData({
      ...formData,
      tagIds: formData.tagIds.includes(tagId)
        ? formData.tagIds.filter(id => id !== tagId)
        : [...formData.tagIds, tagId],
    });
  };

  const categoriesList = Array.isArray(categories) ? categories : [];
  const tagsList = Array.isArray(tags) ? tags : [];

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
                <p className="text-sm text-gray-500 dark:text-gray-400">إنشاء مقالة جديدة</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit('DRAFT')}
                disabled={createMutation.isPending}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                حفظ كمسودة
              </button>
              <button
                onClick={() => handleSubmit('PENDING_REVIEW')}
                disabled={createMutation.isPending}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                إرسال للمراجعة
              </button>
              <button
                onClick={() => handleSubmit('PUBLISHED')}
                disabled={createMutation.isPending}
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="عنوان المقالة"
                className="w-full text-3xl font-bold bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">الرابط:</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 text-sm bg-gray-50 dark:bg-gray-700 border-0 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300"
                />
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex flex-wrap gap-1">
                {[
                  { icon: Bold, label: 'غامق' },
                  { icon: Italic, label: 'مائل' },
                  { icon: Heading1, label: 'عنوان 1' },
                  { icon: Heading2, label: 'عنوان 2' },
                  { icon: List, label: 'قائمة' },
                  { icon: ListOrdered, label: 'قائمة مرقمة' },
                  { icon: Quote, label: 'اقتباس' },
                  { icon: LinkIcon, label: 'رابط' },
                  { icon: Code, label: 'كود' },
                  { icon: ImageIcon, label: 'صورة' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={label}
                  >
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="اكتب محتوى المقالة هنا..."
                rows={20}
                className="w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
              />
            </div>

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
                    value={formData.seo.title}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
                    placeholder={formData.title || 'عنوان الصفحة'}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">وصف SEO</label>
                  <textarea
                    value={formData.seo.description}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })}
                    placeholder={formData.excerpt || 'وصف الصفحة'}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">الكلمات المفتاحية</label>
                  <input
                    type="text"
                    value={formData.seo.keywords}
                    onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })}
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

