/**
 * NewsCore Template Engine - Section Renderer
 * مكون عرض القسم
 */

'use client';

import { Suspense, useMemo } from 'react';
import type { Section, SpacingSize, ResponsiveValue, Breakpoint } from '@/lib/template-engine/types';
import { BlockRenderer } from './BlockRenderer';
import { cn } from '@/lib/utils/cn';
import type { FetchResult } from '@/lib/template-engine/data-source';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionRendererProps {
  section: Section;
  index: number;
  prefetchedData?: Map<string, FetchResult>;
  pageData?: Record<string, unknown>;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const spacingMap: Record<SpacingSize, string> = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

// Spacing classes for future use
// const spacingClasses: Record<SpacingSize, { padding: string; margin: string; gap: string }> = {
//   none: { padding: 'p-0', margin: 'm-0', gap: 'gap-0' },
//   xs: { padding: 'p-1', margin: 'm-1', gap: 'gap-1' },
//   sm: { padding: 'p-2', margin: 'm-2', gap: 'gap-2' },
//   md: { padding: 'p-4', margin: 'm-4', gap: 'gap-4' },
//   lg: { padding: 'p-6', margin: 'm-6', gap: 'gap-6' },
//   xl: { padding: 'p-8', margin: 'm-8', gap: 'gap-8' },
//   '2xl': { padding: 'p-12', margin: 'm-12', gap: 'gap-12' },
// };

function getResponsiveValue<T>(value: T | ResponsiveValue<T>, breakpoint: Breakpoint): T {
  if (typeof value !== 'object' || value === null || !('desktop' in value)) {
    return value as T;
  }
  
  const responsive = value as ResponsiveValue<T>;
  if (breakpoint === 'mobile' && responsive.mobile !== undefined) {
    return responsive.mobile;
  }
  if (breakpoint === 'tablet' && responsive.tablet !== undefined) {
    return responsive.tablet;
  }
  return responsive.desktop;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTAINER STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const containerStyles = {
  full: 'w-full',
  wide: 'max-w-[1536px] mx-auto px-4',
  normal: 'max-w-7xl mx-auto px-4',
  narrow: 'max-w-5xl mx-auto px-4',
  custom: 'mx-auto px-4',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionHeaderProps {
  header: Section['header'];
}

function SectionHeader({ header }: SectionHeaderProps) {
  if (!header?.enabled) return null;

  const headerStyles = {
    simple: 'text-2xl font-bold',
    bordered: 'text-2xl font-bold border-r-4 border-primary pr-4',
    decorated: 'text-2xl font-bold relative before:absolute before:bottom-0 before:left-0 before:w-16 before:h-1 before:bg-primary',
    gradient: 'text-2xl font-bold bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent',
    badge: 'inline-block text-lg font-bold bg-primary text-white px-4 py-2 rounded-lg',
    underlined: 'text-2xl font-bold border-b-2 border-primary pb-2',
    boxed: 'text-xl font-bold bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg',
  };

  return (
    <div className={cn(
      'section-header mb-6 flex items-center justify-between',
      header.alignment === 'center' && 'justify-center',
      header.alignment === 'end' && 'justify-end'
    )}>
      <h2 
        className={cn(headerStyles[header.style])}
        style={header.accentColor ? { '--tw-border-opacity': 1, borderColor: header.accentColor } as React.CSSProperties : undefined}
      >
        {header.icon && (
          <span className="inline-block mr-2">{header.icon}</span>
        )}
        {header.titleAr || header.title}
      </h2>
      
      {header.showMore && header.moreLink && (
        <a 
          href={header.moreLink}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {header.moreTextAr || header.moreText || 'المزيد'}
          <span className="mr-1">←</span>
        </a>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK SKELETON
// ═══════════════════════════════════════════════════════════════════════════════

function BlockSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function SectionRenderer({
  section,
  index,
  prefetchedData,
  pageData,
  className,
}: SectionRendererProps) {
  // التحقق من الإظهار
  if (section.visibility) {
    // يمكن إضافة منطق التحقق من الإظهار هنا
    // مثل التحقق من الجدولة أو حالة تسجيل الدخول
  }

  // حساب أنماط الشبكة
  const gridStyles = useMemo(() => {
    const cols = section.grid?.columns || { desktop: 12 };
    const gap = section.grid?.gap || { desktop: 'lg' };
    
    return {
      '--grid-cols-desktop': getResponsiveValue(cols, 'desktop'),
      '--grid-cols-tablet': getResponsiveValue(cols, 'tablet') || getResponsiveValue(cols, 'desktop'),
      '--grid-cols-mobile': getResponsiveValue(cols, 'mobile') || 1,
      '--grid-gap-desktop': spacingMap[getResponsiveValue(gap, 'desktop') as SpacingSize],
      '--grid-gap-tablet': spacingMap[getResponsiveValue(gap, 'tablet') as SpacingSize || getResponsiveValue(gap, 'desktop') as SpacingSize],
      '--grid-gap-mobile': spacingMap[getResponsiveValue(gap, 'mobile') as SpacingSize || 'md'],
    } as React.CSSProperties;
  }, [section.grid]);

  // حساب أنماط الخلفية
  const backgroundStyles = useMemo(() => {
    if (!section.background || section.background.type === 'none') {
      return {};
    }

    switch (section.background.type) {
      case 'color':
        return { backgroundColor: section.background.color };
      
      case 'gradient':
        if (section.background.gradient) {
          const { type, colors, direction } = section.background.gradient;
          const colorStops = colors.join(', ');
          return {
            background: type === 'radial'
              ? `radial-gradient(${colorStops})`
              : `linear-gradient(${direction || 'to bottom'}, ${colorStops})`,
          };
        }
        return {};
      
      case 'image':
        if (section.background.image?.url) {
          return {
            backgroundImage: `url(${section.background.image.url})`,
            backgroundPosition: section.background.image.position || 'center',
            backgroundSize: section.background.image.size || 'cover',
            backgroundRepeat: section.background.image.repeat ? 'repeat' : 'no-repeat',
            backgroundAttachment: section.background.image.fixed ? 'fixed' : 'scroll',
          };
        }
        return {};
      
      default:
        return {};
    }
  }, [section.background]);

  // حساب أنماط الحشو
  const paddingStyles = useMemo(() => {
    if (!section.padding) return {};
    
    const desktop = getResponsiveValue(section.padding, 'desktop');
    return {
      '--section-pt': spacingMap[desktop.top],
      '--section-pb': spacingMap[desktop.bottom],
      '--section-pl': spacingMap[desktop.left],
      '--section-pr': spacingMap[desktop.right],
    } as React.CSSProperties;
  }, [section.padding]);

  // حساب أنماط الهامش
  const marginStyles = useMemo(() => {
    if (!section.margin) return {};
    
    const desktop = getResponsiveValue(section.margin, 'desktop');
    return {
      '--section-mt': spacingMap[desktop.top],
      '--section-mb': spacingMap[desktop.bottom],
    } as React.CSSProperties;
  }, [section.margin]);

  return (
    <section
      id={`section-${section.id}`}
      className={cn(
        'section-wrapper relative',
        containerStyles[section.container],
        section.container === 'custom' && section.customWidth && `max-w-[${section.customWidth}]`,
        className
      )}
      style={{
        ...backgroundStyles,
        ...paddingStyles,
        ...marginStyles,
        paddingTop: 'var(--section-pt, 2rem)',
        paddingBottom: 'var(--section-pb, 2rem)',
        paddingLeft: 'var(--section-pl, 1rem)',
        paddingRight: 'var(--section-pr, 1rem)',
        marginTop: 'var(--section-mt, 0)',
        marginBottom: 'var(--section-mb, 0)',
      }}
      data-section-id={section.id}
      data-section-index={index}
    >
      {/* Background Overlay */}
      {section.background?.overlay && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: section.background.overlay.color,
            opacity: section.background.overlay.opacity,
          }}
        />
      )}

      {/* Content Container */}
      <div className="relative z-10">
        {/* Section Header */}
        <SectionHeader header={section.header} />

        {/* Border Top */}
        {section.border?.top && (
          <div 
            className="absolute top-0 left-0 right-0"
            style={{ borderTop: section.border.top }}
          />
        )}

        {/* Blocks Grid */}
        <div 
          className="section-grid grid"
          style={{
            ...gridStyles,
            gridTemplateColumns: `repeat(var(--grid-cols-desktop, 12), minmax(0, 1fr))`,
            gap: 'var(--grid-gap-desktop, 1.5rem)',
          }}
        >
          {section.blocks.map((block) => {
            const blockData = prefetchedData?.get(block.id);
            
            return (
              <Suspense key={block.id} fallback={<BlockSkeleton />}>
                <BlockRenderer 
                  block={block}
                  data={blockData}
                  pageData={pageData}
                />
              </Suspense>
            );
          })}
        </div>

        {/* Border Bottom */}
        {section.border?.bottom && (
          <div 
            className="absolute bottom-0 left-0 right-0"
            style={{ borderBottom: section.border.bottom }}
          />
        )}
      </div>

      {/* Responsive Grid Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .section-grid {
            grid-template-columns: repeat(var(--grid-cols-tablet, var(--grid-cols-desktop)), minmax(0, 1fr));
            gap: var(--grid-gap-tablet, var(--grid-gap-desktop));
          }
        }
        @media (max-width: 640px) {
          .section-grid {
            grid-template-columns: repeat(var(--grid-cols-mobile, 1), minmax(0, 1fr));
            gap: var(--grid-gap-mobile, 1rem);
          }
        }
      `}</style>
    </section>
  );
}

export default SectionRenderer;
