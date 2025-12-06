/**
 * Article Grid - Variant 12: Overlay Grid
 * شبكة الطبقات - النص فوق صورة الخلفية
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArticleGridProps } from '../index';
import { cn } from '@/lib/utils/cn';

export default function Grid12({
  variant,
  config,
  data,
  className,
}: ArticleGridProps) {
  const { display = {}, image = {}, text = {}, card = {}, custom = {}, grid = {} } = config;
  const articles = data?.articles || [];

  // حساب الأعمدة
  const gridCols = useMemo(() => {
    const cols = grid.columns || { desktop: 3, tablet: 2, mobile: 1 };
    return {
      desktop: typeof cols === 'object' && 'desktop' in cols ? cols.desktop : 3,
      tablet: typeof cols === 'object' && 'tablet' in cols ? cols.tablet : 2,
      mobile: typeof cols === 'object' && 'mobile' in cols ? cols.mobile : 1,
    };
  }, [grid.columns]);

  // Variant 13: Magazine Overlay - ارتفاعات متنوعة
  const isMagazine = variant === 'grid-13';

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  return (
    <div 
      className={cn('article-grid-overlay', className)}
      style={{
        '--grid-cols-desktop': gridCols.desktop,
        '--grid-cols-tablet': gridCols.tablet,
        '--grid-cols-mobile': gridCols.mobile,
      } as React.CSSProperties}
    >
      <div className={cn(
        'grid gap-3 md:gap-4',
        `grid-cols-[repeat(var(--grid-cols-mobile),1fr)]`,
        `md:grid-cols-[repeat(var(--grid-cols-tablet),1fr)]`,
        `lg:grid-cols-[repeat(var(--grid-cols-desktop),1fr)]`
      )}>
        {articles.map((article, index) => {
          // حساب ارتفاع متنوع للـ Magazine
          const aspectRatio = isMagazine 
            ? getVariedAspectRatio(index)
            : image.aspectRatio || '4:3';

          const aspectClasses: Record<string, string> = {
            '16:9': 'aspect-video',
            '4:3': 'aspect-[4/3]',
            '3:2': 'aspect-[3/2]',
            '1:1': 'aspect-square',
            '3:4': 'aspect-[3/4]',
            '9:16': 'aspect-[9/16]',
          };

          return (
            <article
              key={article.id}
              className="group relative overflow-hidden rounded-xl"
            >
              <Link
                href={`/article/${article.slug}`}
                className={cn(
                  'block relative w-full',
                  aspectClasses[aspectRatio] || 'aspect-[4/3]'
                )}
              >
                {/* الصورة */}
                <Image
                  src={article.coverImageUrl || 'https://placehold.co/600x800/1a365d/ffffff?text=News'}
                  alt={article.title}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* المحتوى */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  {/* Category Badge */}
                  {display.showCategory !== false && article.categories?.[0] && (
                    <span className={cn(
                      'inline-block px-2 py-0.5 text-xs font-bold rounded mb-2',
                      custom.categoryStyle === 'badge' 
                        ? 'bg-primary text-white' 
                        : 'text-primary'
                    )}>
                      {article.categories[0].nameAr || article.categories[0].name}
                    </span>
                  )}
                  
                  {/* العنوان */}
                  <h3 className={cn(
                    'font-bold text-white group-hover:text-primary/90 transition-colors',
                    isMagazine ? 'text-sm md:text-base line-clamp-3' : 'text-base md:text-lg line-clamp-2'
                  )}>
                    {article.title}
                  </h3>
                  
                  {/* التاريخ */}
                  {display.showDate !== false && article.publishedAt && (
                    <time 
                      dateTime={article.publishedAt}
                      className="text-xs text-gray-300 mt-2 block"
                    >
                      {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// دالة مساعدة للحصول على نسب متنوعة للـ Magazine
function getVariedAspectRatio(index: number): string {
  const ratios = ['3:4', '4:3', '1:1', '3:4', '4:3', '3:4', '1:1', '4:3'];
  return ratios[index % ratios.length];
}
