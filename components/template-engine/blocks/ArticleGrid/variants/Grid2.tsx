/**
 * Article Grid - Variant 2: Compact Grid
 * الشبكة المدمجة - 4 أعمدة بدون مقتطف
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArticleGridProps } from '../index';
import { cn } from '@/lib/utils/cn';

export default function Grid2({
  variant,
  config,
  data,
  className,
}: ArticleGridProps) {
  const { grid = {}, display = {}, image = {}, text = {}, card = {} } = config;
  const articles = data?.articles || [];

  // حساب الأعمدة
  const gridCols = useMemo(() => {
    const cols = grid.columns || { desktop: 4, tablet: 2, mobile: 1 };
    return {
      desktop: typeof cols === 'object' && 'desktop' in cols ? cols.desktop : 4,
      tablet: typeof cols === 'object' && 'tablet' in cols ? cols.tablet : 2,
      mobile: typeof cols === 'object' && 'mobile' in cols ? cols.mobile : 1,
    };
  }, [grid.columns]);

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  return (
    <div 
      className={cn('article-grid-2', className)}
      style={{
        '--grid-cols-desktop': gridCols.desktop,
        '--grid-cols-tablet': gridCols.tablet,
        '--grid-cols-mobile': gridCols.mobile,
      } as React.CSSProperties}
    >
      <div className="grid grid-cols-[repeat(var(--grid-cols-mobile),1fr)] md:grid-cols-[repeat(var(--grid-cols-tablet),1fr)] lg:grid-cols-[repeat(var(--grid-cols-desktop),1fr)] gap-4 md:gap-4 lg:gap-5">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group"
          >
            {/* الصورة */}
            <Link
              href={`/article/${article.slug}`}
              className="block relative aspect-[4/3] overflow-hidden rounded-md mb-3"
            >
              <Image
                src={article.coverImageUrl || 'https://placehold.co/400x300/1a365d/ffffff?text=News'}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              
              {/* Category */}
              {display.showCategory !== false && article.categories?.[0] && (
                <span className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-0.5 text-xs font-medium rounded">
                  {article.categories[0].nameAr || article.categories[0].name}
                </span>
              )}
            </Link>

            {/* العنوان */}
            <Link href={`/article/${article.slug}`}>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
            </Link>

            {/* التاريخ */}
            {display.showDate !== false && article.publishedAt && (
              <time 
                dateTime={article.publishedAt}
                className="text-xs text-gray-500 dark:text-gray-400 mt-1 block"
              >
                {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
