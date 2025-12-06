/**
 * NewsCore Template Engine - Block Renderer
 * مكون عرض الـ Block
 */

'use client';

import { useMemo, lazy, Suspense } from 'react';
import type { Block, BlockType, BlockConfig } from '@/lib/template-engine/types';
import type { FetchResult } from '@/lib/template-engine/data-source';
import { getBlockMeta, getVariant } from '@/lib/template-engine/registry';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface BlockRendererProps {
  block: Block;
  data?: FetchResult;
  pageData?: Record<string, any>;
  className?: string;
  isPreview?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC BLOCK COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// تحميل ديناميكي للـ Block components
const BLOCK_COMPONENTS: Partial<Record<BlockType, React.LazyExoticComponent<any>>> = {
  'article-grid': lazy(() => import('./blocks/ArticleGrid')),
  'article-list': lazy(() => import('./blocks/ArticleList')),
  'article-slider': lazy(() => import('./blocks/ArticleSlider')),
  'big-hero': lazy(() => import('./blocks/BigHero')),
  // سيتم إضافة المزيد من الـ blocks
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK SKELETON
// ═══════════════════════════════════════════════════════════════════════════════

function BlockSkeleton({ type }: { type: BlockType }) {
  const meta = getBlockMeta(type);
  
  return (
    <div className="block-skeleton animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
      {meta && (
        <div className="mt-2 text-xs text-gray-400">
          جاري تحميل {meta.nameAr}...
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNKNOWN BLOCK
// ═══════════════════════════════════════════════════════════════════════════════

function UnknownBlock({ type }: { type: BlockType }) {
  return (
    <div className="unknown-block p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <svg 
          className="w-12 h-12 mx-auto mb-2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="text-sm font-medium">نوع Block غير معروف</p>
        <p className="text-xs mt-1 font-mono">{type}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

interface BlockWrapperProps {
  block: Block;
  children: React.ReactNode;
  isPreview?: boolean;
}

function BlockWrapper({ block, children, isPreview }: BlockWrapperProps) {
  // حساب grid area إذا كان محدداً
  const gridStyles = useMemo(() => {
    if (!block.gridArea) return {};
    
    const styles: React.CSSProperties = {};
    
    if (block.gridArea.column) {
      styles.gridColumn = `${block.gridArea.column.start} / span ${block.gridArea.column.span}`;
    }
    if (block.gridArea.row) {
      styles.gridRow = `${block.gridArea.row.start} / span ${block.gridArea.row.span}`;
    }
    
    return styles;
  }, [block.gridArea]);

  // التحقق من الإظهار حسب حجم الشاشة
  const visibilityClasses = useMemo(() => {
    if (!block.config.visibility) return '';
    
    const { desktop, tablet, mobile } = block.config.visibility;
    const classes: string[] = [];
    
    if (!desktop) classes.push('lg:hidden');
    if (!tablet) classes.push('md:hidden lg:block');
    if (!mobile) classes.push('hidden md:block');
    
    return classes.join(' ');
  }, [block.config.visibility]);

  return (
    <div
      className={cn(
        'block-wrapper relative',
        visibilityClasses,
        isPreview && 'ring-2 ring-transparent hover:ring-primary/30 rounded-lg transition-all'
      )}
      style={gridStyles}
      data-block-id={block.id}
      data-block-type={block.type}
      data-block-variant={block.variant}
    >
      {children}
      
      {/* Preview Mode Overlay */}
      {isPreview && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs bg-black/70 text-white px-2 py-1 rounded">
            {block.type}
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function BlockRenderer({
  block,
  data,
  pageData,
  className,
  isPreview = false,
}: BlockRendererProps) {
  // الحصول على معلومات الـ Block
  const blockMeta = getBlockMeta(block.type);
  const variant = getVariant(block.type, block.variant);
  
  // دمج الإعدادات الافتراضية مع إعدادات الـ Block
  const mergedConfig = useMemo(() => {
    const defaultConfig = variant?.defaultConfig || {};
    return deepMerge(defaultConfig, block.config);
  }, [variant, block.config]);

  // الحصول على مكون الـ Block
  const BlockComponent = BLOCK_COMPONENTS[block.type];

  // التحقق من وجود المكون
  if (!BlockComponent) {
    return (
      <BlockWrapper block={block} isPreview={isPreview}>
        <UnknownBlock type={block.type} />
      </BlockWrapper>
    );
  }

  const Component = BlockComponent as React.ComponentType<{
    variant: string;
    config: Partial<BlockConfig>;
    data?: FetchResult;
    pageData?: Record<string, any>;
    className?: string;
  }>;

  return (
    <BlockWrapper block={block} isPreview={isPreview}>
      <Suspense fallback={<BlockSkeleton type={block.type} />}>
        <Component
          variant={block.variant}
          config={mergedConfig}
          data={data}
          pageData={pageData}
          className={className}
        />
      </Suspense>
    </BlockWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * دمج الكائنات بشكل عميق
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        sourceValue !== undefined &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        (result as any)[key] = deepMerge(targetValue as object, sourceValue as object);
      } else if (sourceValue !== undefined) {
        (result as any)[key] = sourceValue;
      }
    }
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default BlockRenderer;
