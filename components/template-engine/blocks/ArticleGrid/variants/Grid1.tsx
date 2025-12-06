/**
 * Article Grid - Variant 1: Standard Grid
 * الشبكة القياسية - 3 أعمدة مع صورة في الأعلى
 */

'use client';

import { useMemo } from 'react';
import type { ArticleGridProps, ArticleCardProps } from '../index';
import { ArticleCard } from '../index';
import { cn } from '@/lib/utils/cn';

export default function Grid1({
  variant,
  config,
  data,
  className,
}: ArticleGridProps) {
  const { grid = {}, card = {} } = config;
  const articles = data?.articles || [];

  // حساب الأعمدة
  const gridCols = useMemo(() => {
    const cols = grid.columns || { desktop: 3, tablet: 2, mobile: 1 };
    return {
      desktop: typeof cols === 'object' && 'desktop' in cols ? cols.desktop : cols,
      tablet: typeof cols === 'object' && 'tablet' in cols ? cols.tablet : 2,
      mobile: typeof cols === 'object' && 'mobile' in cols ? cols.mobile : 1,
    };
  }, [grid.columns]);

  // حساب المسافة
  const gapSize = useMemo(() => {
    const gap = grid.gap || { desktop: 'lg', tablet: 'md', mobile: 'md' };
    const gapMap = {
      none: '0',
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    };
    
    if (typeof gap === 'string') {
      return gapMap[gap as keyof typeof gapMap] || '1.5rem';
    }
    
    return {
      desktop: gapMap[(gap as any).desktop as keyof typeof gapMap] || '1.5rem',
      tablet: gapMap[(gap as any).tablet as keyof typeof gapMap] || '1rem',
      mobile: gapMap[(gap as any).mobile as keyof typeof gapMap] || '1rem',
    };
  }, [grid.gap]);

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  return (
    <div 
      className={cn('article-grid-1', className)}
      style={{
        '--grid-cols-desktop': gridCols.desktop,
        '--grid-cols-tablet': gridCols.tablet,
        '--grid-cols-mobile': gridCols.mobile,
        '--grid-gap-desktop': typeof gapSize === 'string' ? gapSize : gapSize.desktop,
        '--grid-gap-tablet': typeof gapSize === 'string' ? gapSize : gapSize.tablet,
        '--grid-gap-mobile': typeof gapSize === 'string' ? gapSize : gapSize.mobile,
      } as React.CSSProperties}
    >
      <div className="grid grid-cols-[repeat(var(--grid-cols-mobile),1fr)] md:grid-cols-[repeat(var(--grid-cols-tablet),1fr)] lg:grid-cols-[repeat(var(--grid-cols-desktop),1fr)] gap-[var(--grid-gap-mobile)] md:gap-[var(--grid-gap-tablet)] lg:gap-[var(--grid-gap-desktop)]">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            config={config}
            size="md"
            imagePosition="top"
          />
        ))}
      </div>
    </div>
  );
}
