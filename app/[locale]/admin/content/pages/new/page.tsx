/**
 * NewsCore - New Page Creator
 * صفحة إنشاء صفحة جديدة باستخدام Page Builder
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  FileText,
  Layout,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Palette,
} from 'lucide-react';
import { pagesApi } from '@/lib/api/admin';
import { useBuilderStore } from '@/stores/builder-store';
import { cn } from '@/lib/utils/cn';
import type { Template } from '@/lib/template-engine/types';
import { generateId, DEFAULT_TEMPLATE_SETTINGS } from '@/lib/template-engine/types';

// Page templates to choose from
const PAGE_TEMPLATES = [
  {
    id: 'blank',
    name: 'صفحة فارغة',
    nameEn: 'Blank Page',
    description: 'ابدأ من الصفر مع صفحة فارغة',
    icon: FileText,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'about',
    name: 'من نحن',
    nameEn: 'About Us',
    description: 'صفحة تعريفية عن الموقع أو الشركة',
    icon: Layout,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'contact',
    name: 'اتصل بنا',
    nameEn: 'Contact Us',
    description: 'صفحة معلومات الاتصال ونموذج التواصل',
    icon: Globe,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'custom',
    name: 'صفحة مخصصة',
    nameEn: 'Custom Page',
    description: 'استخدم الـ Builder لتصميم صفحة مخصصة',
    icon: Palette,
    color: 'bg-purple-100 text-purple-600',
  },
];

// Generate blank page template
const generateBlankPageTemplate = (title: string, titleAr: string): Template => ({
  id: generateId('page'),
  name: title || 'New Page',
  nameAr: titleAr || 'صفحة جديدة',
  description: '',
  descriptionAr: '',
  type: 'page',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: false,
  isActive: true,
  preview: '',
  
  layout: {
    type: 'full-width',
  },
  
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
});

export default function NewPagePage() {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const basePath = `/${locale}/admin/content/pages`;
  const builderPath = `/${locale}/admin/appearance/builder`;
  const { setTemplate } = useBuilderStore();

  const [step, setStep] = useState<'info' | 'template'>('info');
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    slug: '',
    language: locale,
    template: 'blank',
  });
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Generate slug from title
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

  // Create page mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // API requires only title, status, and content (as string)
      const pageData = {
        title: data.title || data.titleAr,
        status: 'DRAFT',
        content: '', // API requires content to be a string
      };
      
      return pagesApi.create(pageData);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
      const pageResult = result as unknown as { id: string };
      
      if (formData.template === 'custom' || formData.template === 'blank') {
        // Create a template for the builder
        const pageTemplate = generateBlankPageTemplate(formData.title, formData.titleAr);
        
        // Save template to localStorage for builder to pick up
        localStorage.setItem('builder_template', JSON.stringify(pageTemplate));
        localStorage.setItem('builder_page_id', pageResult.id);
        
        // Set template in store
        setTemplate(pageTemplate);
        
        // Redirect to builder
        router.push(`${builderPath}?mode=page&pageId=${pageResult.id}`);
      } else {
        // Redirect to page edit
        router.push(`${basePath}/${pageResult.id}`);
      }
    },
    onError: (error: Error) => {
      setSaveMessage({ type: 'error', text: error.message || 'فشل في إنشاء الصفحة' });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  const handleOpenBuilder = () => {
    if (!formData.title && !formData.titleAr) {
      setSaveMessage({ type: 'error', text: 'يرجى إدخال عنوان الصفحة' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    // Create a template for the builder
    const pageTemplate = generateBlankPageTemplate(formData.title, formData.titleAr);
    
    // Save template and page info to localStorage
    localStorage.setItem('builder_template', JSON.stringify(pageTemplate));
    localStorage.setItem('builder_page_info', JSON.stringify({
      title: formData.title,
      titleAr: formData.titleAr,
      slug: formData.slug,
      language: formData.language,
      isNewPage: true,
    }));
    
    // Set template in store
    setTemplate(pageTemplate);
    
    // Redirect to builder
    router.push(`${builderPath}?mode=page&new=true`);
  };

  const handleSubmit = () => {
    if (!formData.title && !formData.titleAr) {
      setSaveMessage({ type: 'error', text: 'يرجى إدخال عنوان الصفحة' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    if (formData.template === 'custom' || formData.template === 'blank') {
      handleOpenBuilder();
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={basePath}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">إنشاء صفحة جديدة</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step === 'info' ? 'الخطوة 1: معلومات الصفحة' : 'الخطوة 2: اختر القالب'}
                </p>
              </div>
            </div>

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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-bold',
              step === 'info' ? 'bg-primary text-white' : 'bg-green-500 text-white'
            )}>
              {step === 'template' ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={cn(
              'w-24 h-1 rounded',
              step === 'template' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            )} />
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-bold',
              step === 'template' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            )}>
              2
            </div>
          </div>
        </div>

        {step === 'info' ? (
          /* Step 1: Page Information */
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">معلومات الصفحة</h2>
            
            <div className="space-y-6">
              {/* Title Arabic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان الصفحة (عربي) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="مثال: من نحن"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                />
              </div>

              {/* Title English */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان الصفحة (إنجليزي)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Example: About Us"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  dir="ltr"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرابط (Slug)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">/page/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="about-us"
                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اللغة
                </label>
                <div className="flex gap-4">
                  {[
                    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
                    { value: 'en', label: 'English', flag: '🇺🇸' },
                    { value: 'fr', label: 'Français', flag: '🇫🇷' },
                  ].map((lang) => (
                    <label
                      key={lang.value}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all',
                        formData.language === lang.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary/50'
                      )}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={lang.value}
                        checked={formData.language === lang.value}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="sr-only"
                      />
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  if (!formData.title && !formData.titleAr) {
                    setSaveMessage({ type: 'error', text: 'يرجى إدخال عنوان الصفحة' });
                    setTimeout(() => setSaveMessage(null), 3000);
                    return;
                  }
                  setStep('template');
                }}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                التالي: اختر القالب
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Choose Template */
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">اختر نوع الصفحة</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PAGE_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setFormData({ ...formData, template: template.id })}
                      className={cn(
                        'p-6 border-2 rounded-2xl text-right transition-all',
                        formData.template === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn('p-3 rounded-xl', template.color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                        </div>
                        {formData.template === template.id && (
                          <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('info')}
                className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                السابق
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : formData.template === 'custom' || formData.template === 'blank' ? (
                  <>
                    <Palette className="w-5 h-5" />
                    فتح الـ Builder
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    إنشاء الصفحة
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

