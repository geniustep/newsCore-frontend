/**
 * NewsCore - Preview Client Component
 * عرض محتوى القالب في المعاينة
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { Template, Block } from '@/lib/template-engine/types';
import { getBlockMeta, getVariant } from '@/lib/template-engine/registry';

// Dynamic imports for block components
const ArticleGrid = dynamic(() => import('@/components/template-engine/blocks/ArticleGrid'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});
const BigHero = dynamic(() => import('@/components/template-engine/blocks/BigHero'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});
const ArticleList = dynamic(() => import('@/components/template-engine/blocks/ArticleList'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});
const ArticleSlider = dynamic(() => import('@/components/template-engine/blocks/ArticleSlider'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});

function BlockLoadingPlaceholder() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-[200px] animate-pulse">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

// Mock templates for preview
const MOCK_TEMPLATES: Record<string, Template> = {
  'home-default': {
    id: 'home-default',
    name: 'Default Home',
    nameAr: 'الرئيسية الافتراضية',
    description: 'Default home page template',
    descriptionAr: 'قالب الصفحة الرئيسية الافتراضي',
    type: 'home',
    version: '1.0.0',
    preview: '/images/templates/home-default.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true,
    isActive: true,
    layout: { type: 'full-width' },
    regions: { header: { enabled: true }, footer: { enabled: true } },
    settings: { 
      showBreakingNews: false,
      showBreadcrumb: false,
      showLastUpdated: true,
      infiniteScroll: false,
      loadMoreButton: true,
      stickyHeader: true,
      stickySidebar: false,
      backToTop: true,
      readingProgress: true,
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        nameAr: 'البطل',
        order: 0,
        container: 'full',
        blocks: [
          {
            id: 'hero-block',
            type: 'big-hero',
            variant: 'hero-classic',
            config: {},
          },
        ],
      },
      {
        id: 'latest',
        name: 'Latest',
        nameAr: 'آخر الأخبار',
        order: 1,
        container: 'normal',
        header: {
          enabled: true,
          title: 'Latest News',
          titleAr: 'آخر الأخبار',
          style: 'bordered',
          showMore: false,
          alignment: 'start',
        },
        blocks: [
          {
            id: 'latest-grid',
            type: 'article-grid',
            variant: 'grid-1',
            config: {},
          },
        ],
      },
    ],
  },
  'home-magazine': {
    id: 'home-magazine',
    name: 'Magazine Home',
    nameAr: 'الرئيسية المجلة',
    description: 'Magazine style home page template',
    descriptionAr: 'قالب الصفحة الرئيسية بنمط المجلة',
    type: 'home',
    version: '1.0.0',
    preview: '/images/templates/home-magazine.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    isActive: true,
    layout: { type: 'full-width' },
    regions: { header: { enabled: true }, footer: { enabled: true } },
    settings: { 
      showBreakingNews: false,
      showBreadcrumb: false,
      showLastUpdated: true,
      infiniteScroll: false,
      loadMoreButton: true,
      stickyHeader: true,
      stickySidebar: false,
      backToTop: true,
      readingProgress: true,
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        nameAr: 'البطل',
        order: 0,
        container: 'full',
        blocks: [
          {
            id: 'hero-block',
            type: 'big-hero',
            variant: 'hero-magazine',
            config: {},
          },
        ],
      },
      {
        id: 'featured',
        name: 'Featured',
        nameAr: 'المميزة',
        order: 1,
        container: 'normal',
        header: {
          enabled: true,
          title: 'Featured',
          titleAr: 'المقالات المميزة',
          style: 'decorated',
          showMore: false,
          alignment: 'start',
        },
        blocks: [
          {
            id: 'featured-grid',
            type: 'article-grid',
            variant: 'grid-6',
            config: {},
          },
        ],
      },
      {
        id: 'trending',
        name: 'Trending',
        nameAr: 'الأكثر قراءة',
        order: 2,
        container: 'normal',
        header: {
          enabled: true,
          title: 'Trending',
          titleAr: 'الأكثر قراءة',
          style: 'bordered',
          showMore: false,
          alignment: 'start',
        },
        blocks: [
          {
            id: 'trending-slider',
            type: 'article-slider',
            variant: 'slider-3',
            config: {},
          },
        ],
      },
    ],
  },
  'category-default': {
    id: 'category-default',
    name: 'Default Category',
    nameAr: 'القسم الافتراضي',
    description: 'Default category page template',
    descriptionAr: 'قالب صفحة القسم الافتراضي',
    type: 'category',
    version: '1.0.0',
    preview: '/images/templates/category-default.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true,
    isActive: true,
    layout: { type: 'sidebar-right', sidebarWidth: '320px' },
    regions: { header: { enabled: true }, sidebar: { enabled: true }, footer: { enabled: true } },
    settings: { 
      showBreakingNews: false,
      showBreadcrumb: true,
      showLastUpdated: true,
      infiniteScroll: false,
      loadMoreButton: true,
      stickyHeader: true,
      stickySidebar: true,
      backToTop: true,
      readingProgress: false,
    },
    sections: [
      {
        id: 'category-hero',
        name: 'Category Hero',
        nameAr: 'بطل القسم',
        order: 0,
        container: 'normal',
        blocks: [
          {
            id: 'category-featured',
            type: 'article-grid',
            variant: 'grid-6',
            config: {},
          },
        ],
      },
      {
        id: 'category-list',
        name: 'Category Articles',
        nameAr: 'مقالات القسم',
        order: 1,
        container: 'normal',
        blocks: [
          {
            id: 'category-grid',
            type: 'article-list',
            variant: 'list-1',
            config: {},
          },
        ],
      },
    ],
  },
};

interface PreviewClientProps {
  templateId: string;
  locale: string;
}

export default function PreviewClient({ templateId, locale }: PreviewClientProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get template from mock data or localStorage
    const mockTemplate = MOCK_TEMPLATES[templateId];
    
    if (mockTemplate) {
      setTemplate(mockTemplate);
      setLoading(false);
      return;
    }

    // Try localStorage (from builder)
    const savedTemplate = localStorage.getItem('builder_template');
    if (savedTemplate) {
      try {
        const parsed = JSON.parse(savedTemplate);
        if (parsed.id === templateId) {
          setTemplate(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved template:', e);
      }
    }

    setError('القالب غير موجود');
    setLoading(false);
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'القالب غير موجود'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            لم يتم العثور على القالب المطلوب
          </p>
          <a 
            href={`/${locale}/admin/templates`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            العودة للقوالب
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-content">
      {template.sections.map((section) => (
        <section 
          key={section.id}
          className={`py-8 ${section.container === 'full' ? '' : 'max-w-7xl mx-auto px-4'}`}
          style={{
            backgroundColor: section.background?.color,
          }}
        >
          {/* Section Header */}
          {section.header?.enabled && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-r-4 border-primary pr-4">
                {section.header.titleAr || section.header.title}
              </h2>
            </div>
          )}

          {/* Blocks */}
          <div className="space-y-6">
            {section.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  const variantConfig = getVariant(block.type, block.variant);
  const mergedConfig = {
    ...variantConfig?.defaultConfig,
    ...block.config,
  };
  const emptyData = { articles: [], total: 0, page: 1, totalPages: 0, hasMore: false };

  switch (block.type) {
    case 'article-grid':
      return <ArticleGrid variant={block.variant} config={mergedConfig} data={emptyData} />;
    
    case 'big-hero':
      return <BigHero variant={block.variant} config={mergedConfig} data={emptyData} />;
    
    case 'article-list':
      return <ArticleList variant={block.variant} config={mergedConfig} data={emptyData} />;
    
    case 'article-slider':
      return <ArticleSlider variant={block.variant} config={mergedConfig} data={emptyData} />;
    
    default:
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            Block: {getBlockMeta(block.type)?.nameAr || block.type}
          </p>
          <p className="text-sm text-gray-400">{block.variant}</p>
        </div>
      );
  }
}
