/**
 * NewsCore Template Engine - API Layer
 * طبقة API للتعامل مع القوالب
 */

import { cache } from 'react';
import type { Template, TemplateType } from './types';
import { DEFAULT_TEMPLATE_SETTINGS, generateId } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
const USE_LOCAL_TEMPLATES = process.env.USE_LOCAL_TEMPLATES === 'true' || true; // للتطوير

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL TEMPLATES (للتطوير والـ Fallback)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * قالب الصفحة الرئيسية الافتراضي
 */
const DEFAULT_HOME_TEMPLATE: Template = {
  id: 'home-default',
  name: 'Default Home',
  nameAr: 'الرئيسية الافتراضية',
  description: 'Default homepage template',
  descriptionAr: 'قالب الصفحة الرئيسية الافتراضي',
  type: 'home',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  preview: '/templates/home-default.png',
  
  layout: {
    type: 'sidebar-right',
    sidebarWidth: '320px',
  },
  
  regions: {
    header: { enabled: true },
    breakingNews: { enabled: true },
    sidebar: { enabled: true, sticky: true },
    footer: { enabled: true },
  },
  
  settings: DEFAULT_TEMPLATE_SETTINGS,
  
  sections: [
    {
      id: 'hero-section',
      name: 'Hero Section',
      nameAr: 'القسم الرئيسي',
      order: 0,
      container: 'normal',
      grid: {
        columns: { desktop: 12, tablet: 12, mobile: 12 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      padding: {
        desktop: { top: 'lg', bottom: 'lg', left: 'md', right: 'md' },
      },
      margin: {
        desktop: { top: 'none', bottom: 'none' },
      },
      blocks: [
        {
          id: 'hero-block',
          type: 'big-hero',
          variant: 'hero-classic',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: true,
              showAuthor: true,
              showDate: true,
            },
          },
          dataSource: {
            mode: 'featured',
            limit: 5,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
    {
      id: 'latest-section',
      name: 'Latest News',
      nameAr: 'آخر الأخبار',
      order: 1,
      container: 'normal',
      header: {
        enabled: true,
        title: 'Latest News',
        titleAr: 'آخر الأخبار',
        style: 'bordered',
        showMore: true,
        moreLink: '/latest',
        alignment: 'start',
      },
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
      blocks: [
        {
          id: 'latest-grid',
          type: 'article-grid',
          variant: 'grid-1',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: true,
              showDate: true,
            },
            grid: {
              columns: { desktop: 3, tablet: 2, mobile: 1 },
              gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
            },
            card: {
              style: 'elevated',
              shadow: 'md',
              radius: 'lg',
              hoverEffect: 'lift',
            },
          },
          dataSource: {
            mode: 'latest',
            limit: 6,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
    {
      id: 'trending-section',
      name: 'Trending',
      nameAr: 'الأكثر قراءة',
      order: 2,
      container: 'normal',
      header: {
        enabled: true,
        title: 'Most Read',
        titleAr: 'الأكثر قراءة',
        style: 'decorated',
        showMore: false,
        alignment: 'start',
      },
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
      background: {
        type: 'color',
        color: '#f8fafc',
      },
      blocks: [
        {
          id: 'trending-slider',
          type: 'article-slider',
          variant: 'slider-3',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: true,
              showDate: true,
            },
            custom: {
              slidesPerView: { desktop: 3, tablet: 2, mobile: 1 },
              autoplay: true,
              showArrows: true,
            },
          },
          dataSource: {
            mode: 'trending',
            limit: 8,
            sortBy: 'views',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
  ],
};

/**
 * قالب صفحة القسم الافتراضي
 */
const DEFAULT_CATEGORY_TEMPLATE: Template = {
  id: 'category-default',
  name: 'Default Category',
  nameAr: 'القسم الافتراضي',
  description: 'Default category page template',
  descriptionAr: 'قالب صفحة القسم الافتراضي',
  type: 'category',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  preview: '/templates/category-default.png',
  
  layout: {
    type: 'sidebar-right',
    sidebarWidth: '320px',
  },
  
  regions: {
    header: { enabled: true },
    sidebar: { enabled: true, sticky: true },
    footer: { enabled: true },
  },
  
  settings: {
    ...DEFAULT_TEMPLATE_SETTINGS,
    showBreadcrumb: true,
    loadMoreButton: true,
  },
  
  sections: [
    {
      id: 'category-hero',
      name: 'Category Hero',
      nameAr: 'بطل القسم',
      order: 0,
      container: 'normal',
      grid: {
        columns: { desktop: 12, tablet: 12, mobile: 12 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      padding: {
        desktop: { top: 'lg', bottom: 'lg', left: 'md', right: 'md' },
      },
      margin: {
        desktop: { top: 'none', bottom: 'none' },
      },
      blocks: [
        {
          id: 'category-featured',
          type: 'article-grid',
          variant: 'grid-6',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: false,
              showAuthor: true,
              showDate: true,
            },
          },
          dataSource: {
            mode: 'category',
            // categoryIds سيتم تحديده ديناميكياً من pageData
            limit: 5,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
    {
      id: 'category-articles',
      name: 'Category Articles',
      nameAr: 'مقالات القسم',
      order: 1,
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
      blocks: [
        {
          id: 'category-grid',
          type: 'article-grid',
          variant: 'grid-1',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: false,
              showDate: true,
            },
            grid: {
              columns: { desktop: 3, tablet: 2, mobile: 1 },
              gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
            },
          },
          dataSource: {
            mode: 'category',
            limit: 12,
            offset: 5, // تخطي المقالات المعروضة في Hero
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
  ],
};

/**
 * قالب صفحة المقال الافتراضي
 */
const DEFAULT_ARTICLE_TEMPLATE: Template = {
  id: 'article-default',
  name: 'Default Article',
  nameAr: 'المقال الافتراضي',
  description: 'Default article page template',
  descriptionAr: 'قالب صفحة المقال الافتراضي',
  type: 'article',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  preview: '/templates/article-default.png',
  
  layout: {
    type: 'sidebar-right',
    sidebarWidth: '320px',
  },
  
  regions: {
    header: { enabled: true },
    sidebar: { enabled: true, sticky: true },
    footer: { enabled: true },
  },
  
  settings: {
    ...DEFAULT_TEMPLATE_SETTINGS,
    showBreadcrumb: true,
    readingProgress: true,
  },
  
  sections: [
    {
      id: 'related-articles',
      name: 'Related Articles',
      nameAr: 'مقالات ذات صلة',
      order: 0,
      container: 'normal',
      header: {
        enabled: true,
        title: 'Related Articles',
        titleAr: 'مقالات ذات صلة',
        style: 'bordered',
        showMore: false,
        alignment: 'start',
      },
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
      blocks: [
        {
          id: 'related-grid',
          type: 'article-grid',
          variant: 'grid-2',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: false,
              showCategory: true,
              showDate: true,
            },
            grid: {
              columns: { desktop: 4, tablet: 2, mobile: 1 },
              gap: { desktop: 'md', tablet: 'md', mobile: 'sm' },
            },
          },
          dataSource: {
            mode: 'related',
            limit: 4,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
  ],
};

/**
 * خريطة القوالب الافتراضية
 */
const DEFAULT_TEMPLATES: Record<TemplateType, Template> = {
  home: DEFAULT_HOME_TEMPLATE,
  category: DEFAULT_CATEGORY_TEMPLATE,
  article: DEFAULT_ARTICLE_TEMPLATE,
  tag: DEFAULT_CATEGORY_TEMPLATE, // يستخدم نفس قالب القسم
  author: DEFAULT_CATEGORY_TEMPLATE,
  search: DEFAULT_CATEGORY_TEMPLATE,
  page: DEFAULT_ARTICLE_TEMPLATE,
  error: DEFAULT_ARTICLE_TEMPLATE,
  archive: DEFAULT_CATEGORY_TEMPLATE,
  custom: DEFAULT_HOME_TEMPLATE,
};

// ═══════════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * جلب قالب للصفحة حسب النوع
 */
export const getTemplateForPage = cache(async (
  pageType: TemplateType,
  locale: string = 'ar'
): Promise<Template | null> => {
  // للتطوير: استخدام القوالب المحلية
  if (USE_LOCAL_TEMPLATES) {
    return DEFAULT_TEMPLATES[pageType] || null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/templates?type=${pageType}&locale=${locale}&default=true`,
      {
        next: { revalidate: 60 }, // cache لمدة دقيقة
      }
    );

    if (!response.ok) {
      console.warn(`No template found for ${pageType}, using default`);
      return DEFAULT_TEMPLATES[pageType] || null;
    }

    const data = await response.json();
    return data.template || DEFAULT_TEMPLATES[pageType];
  } catch (error) {
    console.error('Error fetching template:', error);
    return DEFAULT_TEMPLATES[pageType] || null;
  }
});

/**
 * جلب قالب بالـ ID
 */
export const getTemplateById = cache(async (
  templateId: string
): Promise<Template | null> => {
  // للتطوير
  if (USE_LOCAL_TEMPLATES) {
    const allTemplates = Object.values(DEFAULT_TEMPLATES);
    return allTemplates.find(t => t.id === templateId) || null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/templates/${templateId}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.template;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    return null;
  }
});

/**
 * جلب جميع القوالب
 */
export const getAllTemplates = cache(async (
  type?: TemplateType
): Promise<Template[]> => {
  if (USE_LOCAL_TEMPLATES) {
    const templates = Object.values(DEFAULT_TEMPLATES);
    return type ? templates.filter(t => t.type === type) : templates;
  }

  try {
    const url = type 
      ? `${API_BASE_URL}/templates?type=${type}`
      : `${API_BASE_URL}/templates`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return Object.values(DEFAULT_TEMPLATES);
    }

    const data = await response.json();
    return data.templates || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return Object.values(DEFAULT_TEMPLATES);
  }
});

/**
 * حفظ قالب
 */
export async function saveTemplate(template: Template): Promise<Template> {
  if (USE_LOCAL_TEMPLATES) {
    // للتطوير: فقط نعيد القالب
    console.log('Template saved (local mode):', template.id);
    return template;
  }

  const response = await fetch(`${API_BASE_URL}/templates/${template.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });

  if (!response.ok) {
    throw new Error('Failed to save template');
  }

  const data = await response.json();
  return data.template;
}

/**
 * إنشاء قالب جديد
 */
export async function createTemplate(
  template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Template> {
  const newTemplate: Template = {
    ...template,
    id: generateId('template'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Template;

  if (USE_LOCAL_TEMPLATES) {
    console.log('Template created (local mode):', newTemplate.id);
    return newTemplate;
  }

  const response = await fetch(`${API_BASE_URL}/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTemplate),
  });

  if (!response.ok) {
    throw new Error('Failed to create template');
  }

  const data = await response.json();
  return data.template;
}

/**
 * حذف قالب
 */
export async function deleteTemplate(templateId: string): Promise<void> {
  if (USE_LOCAL_TEMPLATES) {
    console.log('Template deleted (local mode):', templateId);
    return;
  }

  const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete template');
  }
}

/**
 * نسخ قالب
 */
export async function duplicateTemplate(templateId: string): Promise<Template> {
  const original = await getTemplateById(templateId);
  
  if (!original) {
    throw new Error('Template not found');
  }

  const duplicate: Template = {
    ...original,
    id: generateId('template'),
    name: `${original.name} (Copy)`,
    nameAr: `${original.nameAr} (نسخة)`,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: original.sections.map(s => ({
      ...s,
      id: generateId('section'),
      blocks: s.blocks.map(b => ({
        ...b,
        id: generateId('block'),
      })),
    })),
  };

  return createTemplate(duplicate);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { DEFAULT_TEMPLATES };
