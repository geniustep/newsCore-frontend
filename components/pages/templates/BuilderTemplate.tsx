'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Page } from '@/lib/api';
import type { Template, Section, Block, BlockType } from '@/lib/template-engine/types';
import { getBlockMeta, getVariant } from '@/lib/template-engine/registry';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

// Dynamically import block components
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

interface BuilderTemplateProps {
  page: Page;
  locale: string;
}

export default function BuilderTemplate({ page }: BuilderTemplateProps) {
  // Parse the template from page content
  const template = useMemo<Template | null>(() => {
    try {
      if (!page.content) return null;
      const parsed = JSON.parse(page.content);
      // Check if it's a valid template structure
      if (parsed.sections && Array.isArray(parsed.sections)) {
        return parsed as Template;
      }
      return null;
    } catch {
      return null;
    }
  }, [page.content]);

  // If content is not a valid template, return null (will fallback to default)
  if (!template) {
    return null;
  }

  const sections = template.sections || [];

  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
              {page.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Render Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {sections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">
              هذه الصفحة فارغة
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </div>
    </div>
  );
}

interface SectionRendererProps {
  section: Section;
}

function SectionRenderer({ section }: SectionRendererProps) {
  const sectionStyle: React.CSSProperties = {};
  
  // Apply background
  if (section.background) {
    if (section.background.type === 'color' && section.background.color) {
      sectionStyle.backgroundColor = section.background.color;
    } else if (section.background.type === 'gradient' && section.background.gradient) {
      // Convert gradient object to CSS string
      const { type, colors, direction } = section.background.gradient;
      if (type === 'linear') {
        sectionStyle.background = `linear-gradient(${direction || 'to bottom'}, ${colors.join(', ')})`;
      } else if (type === 'radial') {
        sectionStyle.background = `radial-gradient(${colors.join(', ')})`;
      }
    } else if (section.background.type === 'image' && section.background.image) {
      const img = section.background.image;
      const imageUrl = typeof img === 'string' ? img : img.url;
      sectionStyle.backgroundImage = `url(${imageUrl})`;
      sectionStyle.backgroundSize = typeof img === 'object' ? (img.size || 'cover') : 'cover';
      sectionStyle.backgroundPosition = typeof img === 'object' ? (img.position || 'center') : 'center';
      if (typeof img === 'object' && img.fixed) {
        sectionStyle.backgroundAttachment = 'fixed';
      }
    }
  }

  return (
    <section 
      className={cn(
        'py-8',
        section.container === 'full' && 'max-w-none px-0',
        section.container === 'normal' && 'max-w-7xl mx-auto',
        section.container === 'narrow' && 'max-w-4xl mx-auto',
      )}
      style={sectionStyle}
    >
      {/* Section Header */}
      {section.header?.enabled && (
        <div className="mb-6">
          <div 
            className={cn(
              'flex items-center justify-between',
              section.header.alignment === 'center' && 'justify-center text-center',
              section.header.alignment === 'end' && 'justify-end text-left',
            )}
          >
            <h2 
              className={cn(
                'text-2xl font-bold text-gray-900 dark:text-white',
                section.header.style === 'bordered' && 'border-r-4 border-primary pr-3',
                section.header.style === 'decorated' && 'relative after:content-[""] after:absolute after:bottom-0 after:right-0 after:w-16 after:h-1 after:bg-primary',
              )}
              style={section.header.accentColor ? { borderColor: section.header.accentColor } : undefined}
            >
              {section.header.titleAr || section.header.title}
            </h2>
            
            {section.header.showMore && section.header.moreLink && (
              <a 
                href={section.header.moreLink}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                المزيد ←
              </a>
            )}
          </div>
        </div>
      )}

      {/* Section Blocks */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {section.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}

interface BlockRendererProps {
  block: Block;
}

function BlockRenderer({ block }: BlockRendererProps) {
  const colSpan = block.gridArea?.column?.span || 12;
  const variantConfig = getVariant(block.type, block.variant);
  const mergedConfig = { ...variantConfig?.defaultConfig, ...block.config };

  return (
    <div 
      className="col-span-12"
      style={{ gridColumn: `span ${Math.min(colSpan, 12)}` }}
    >
      <BlockContent type={block.type} variant={block.variant} config={mergedConfig} />
    </div>
  );
}

function BlockContent({ 
  type, 
  variant, 
  config 
}: { 
  type: BlockType | string; 
  variant: string; 
  config: Record<string, unknown>;
}) {
  // For blocks that need data, show a placeholder for now
  // In production, this would use useSWR or React Query to fetch data
  const emptyData = { articles: [] as never[], total: 0, hasMore: false };

  switch (type) {
    case 'article-grid':
      return <ArticleGrid variant={variant} config={config} data={emptyData} />;
    case 'big-hero':
      return <BigHero variant={variant} config={config} data={emptyData} />;
    case 'article-list':
      return <ArticleList variant={variant} config={config} data={emptyData} />;
    case 'article-slider':
      return <ArticleSlider variant={variant} config={config} data={emptyData} />;
    default:
      return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 min-h-[150px]">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-3xl mb-2">🧩</div>
            <p className="font-medium">{getBlockMeta(type as BlockType)?.nameAr || type}</p>
            <p className="text-sm">{variant}</p>
          </div>
        </div>
      );
  }
}

