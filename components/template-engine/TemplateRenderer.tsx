/**
 * NewsCore Template Engine - Template Renderer
 * مكون عرض القالب الرئيسي
 */

import { Suspense } from 'react';
import type { Template, Block, Section } from '@/lib/template-engine/types';
import { SectionRenderer } from './SectionRenderer';
import { prefetchTemplateData } from '@/lib/template-engine/data-source';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface TemplateRendererProps {
  template: Template;
  pageData?: Record<string, any>;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETONS
// ═══════════════════════════════════════════════════════════════════════════════

function SectionSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BreakingNewsSkeleton() {
  return (
    <div className="w-full h-10 bg-red-500/10 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="h-4 w-24 bg-red-500/30 rounded" />
        <div className="h-4 flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const layoutStyles = {
  'full-width': 'w-full',
  'sidebar-right': 'flex flex-col lg:flex-row',
  'sidebar-left': 'flex flex-col lg:flex-row-reverse',
  'sidebar-both': 'flex flex-col xl:flex-row',
  'centered': 'max-w-4xl mx-auto',
};

const containerStyles = {
  full: 'w-full',
  wide: 'max-w-[1536px] mx-auto',
  normal: 'max-w-7xl mx-auto',
  narrow: 'max-w-5xl mx-auto',
  custom: '',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export async function TemplateRenderer({ 
  template, 
  pageData,
  className 
}: TemplateRendererProps) {
  // جمع جميع مصادر البيانات من الـ blocks
  const dataSources = template.sections.flatMap(section =>
    section.blocks
      .filter(block => block.dataSource)
      .map(block => ({
        blockId: block.id,
        dataSource: block.dataSource!,
      }))
  );
  
  // تحميل جميع البيانات مسبقاً
  const prefetchedData = dataSources.length > 0 
    ? await prefetchTemplateData(dataSources)
    : new Map();

  const { layout, settings, regions } = template;

  return (
    <div 
      className={cn('template-wrapper min-h-screen', className)}
      data-template={template.id}
      data-template-type={template.type}
    >
      {/* Breaking News */}
      {settings.showBreakingNews && regions.breakingNews?.enabled && (
        <Suspense fallback={<BreakingNewsSkeleton />}>
          <BreakingNewsRegion blocks={regions.breakingNews.blocks || []} />
        </Suspense>
      )}

      {/* Before Content Region */}
      {regions.beforeContent?.enabled && regions.beforeContent.blocks?.length && (
        <div className="before-content-region">
          {regions.beforeContent.blocks.map(block => (
            <Suspense key={block.id} fallback={<SectionSkeleton />}>
              <BlockRenderer block={block} />
            </Suspense>
          ))}
        </div>
      )}

      {/* Main Layout */}
      <main className={cn('main-layout', layoutStyles[layout.type])}>
        {/* Main Content */}
        <div 
          className={cn(
            'main-content flex-1',
            layout.type.includes('sidebar') && 'lg:flex-1'
          )}
        >
          {template.sections.map((section, index) => (
            <Suspense 
              key={section.id} 
              fallback={<SectionSkeleton />}
            >
              <SectionRenderer 
                section={section}
                index={index}
                prefetchedData={prefetchedData}
                pageData={pageData}
              />
            </Suspense>
          ))}
        </div>

        {/* Right Sidebar */}
        {(layout.type === 'sidebar-right' || layout.type === 'sidebar-both') && 
         regions.sidebar?.enabled && (
          <aside 
            className={cn(
              'sidebar lg:flex-shrink-0',
              settings.stickySidebar && 'lg:sticky lg:top-20 lg:self-start'
            )}
            style={{ width: layout.sidebarWidth || '320px' }}
          >
            <div className="sidebar-content p-4 space-y-6">
              {regions.sidebar.blocks?.map(block => (
                <Suspense key={block.id} fallback={<WidgetSkeleton />}>
                  <BlockRenderer block={block} />
                </Suspense>
              ))}
            </div>
          </aside>
        )}

        {/* Left Sidebar (for sidebar-both) */}
        {layout.type === 'sidebar-both' && regions.sidebarSecondary?.enabled && (
          <aside 
            className={cn(
              'sidebar-secondary xl:flex-shrink-0 order-first xl:order-none',
              settings.stickySidebar && 'xl:sticky xl:top-20 xl:self-start'
            )}
            style={{ width: layout.sidebarSecondaryWidth || '280px' }}
          >
            <div className="sidebar-content p-4 space-y-6">
              {regions.sidebarSecondary.blocks?.map(block => (
                <Suspense key={block.id} fallback={<WidgetSkeleton />}>
                  <BlockRenderer block={block} />
                </Suspense>
              ))}
            </div>
          </aside>
        )}
      </main>

      {/* After Content Region */}
      {regions.afterContent?.enabled && regions.afterContent.blocks?.length && (
        <div className="after-content-region">
          {regions.afterContent.blocks.map(block => (
            <Suspense key={block.id} fallback={<SectionSkeleton />}>
              <BlockRenderer block={block} />
            </Suspense>
          ))}
        </div>
      )}

      {/* Back to Top */}
      {settings.backToTop && <BackToTopButton />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function WidgetSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakingNewsRegion({ blocks }: { blocks: Block[] }) {
  // سيتم تنفيذه مع BlockRenderer
  return (
    <div className="breaking-news-region bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm px-2 py-1 bg-white/20 rounded">
            عاجل
          </span>
          <div className="flex-1 overflow-hidden">
            {/* سيتم إضافة ticker هنا */}
          </div>
        </div>
      </div>
    </div>
  );
}

function BackToTopButton() {
  return (
    <button
      id="back-to-top"
      className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-lg 
                 opacity-0 invisible transition-all duration-300
                 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label="Back to top"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK RENDERER (placeholder - will be in separate file)
// ═══════════════════════════════════════════════════════════════════════════════

function BlockRenderer({ block }: { block: Block }) {
  // Placeholder - actual implementation in BlockRenderer.tsx
  return (
    <div data-block-id={block.id} data-block-type={block.type}>
      {/* Block content will be rendered here */}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default TemplateRenderer;
