/**
 * Article Grid - Variant 9: Side Image Grid
 * شبكة الصورة الجانبية - الصورة على الجانب
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArticleGridProps } from '../index';
import { cn } from '@/lib/utils/cn';

export default function Grid9({
  variant,
  config,
  data,
  className,
}: ArticleGridProps) {
  const { display = {}, card = {}, custom = {}, grid = {} } = config;
  const articles = data?.articles || [];

  // عرض الصورة
  const imageWidth = custom.imageWidth || { desktop: '200px', tablet: '150px', mobile: '100px' };

  // حساب الأعمدة
  const gridCols = useMemo(() => {
    const cols = grid.columns || { desktop: 2, tablet: 1, mobile: 1 };
    return {
      desktop: typeof cols === 'object' && 'desktop' in cols ? cols.desktop : 2,
      tablet: typeof cols === 'object' && 'tablet' in cols ? cols.tablet : 1,
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

  // Variant 10: Alternating
  const isAlternating = variant === 'grid-10';
  
  // Variant 11: Compact Horizontal
  const isCompact = variant === 'grid-11';
  
  // Variant 15: News Ticker
  const isTicker = variant === 'grid-15';

  if (isTicker) {
    return (
      <div className={cn('article-grid-ticker', className)}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className={cn(
                'flex items-center gap-3 py-2 px-3',
                'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                index % 2 === 1 && custom.alternateBackground && 'bg-gray-50 dark:bg-gray-800/30'
              )}
            >
              {/* الصورة المصغرة */}
              <Link
                href={`/article/${article.slug}`}
                className="flex-shrink-0"
              >
                <div className="relative w-[80px] aspect-video rounded overflow-hidden">
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/160x90/1a365d/ffffff?text=News'}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </Link>

              {/* المحتوى */}
              <div className="flex-1 min-w-0">
                <Link href={`/article/${article.slug}`}>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </Link>
              </div>

              {/* الوقت */}
              {article.publishedAt && (
                <time 
                  dateTime={article.publishedAt}
                  className="flex-shrink-0 text-xs text-gray-500"
                >
                  {formatTimeAgo(new Date(article.publishedAt))}
                </time>
              )}
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn('article-grid-horizontal', className)}
      style={{
        '--grid-cols-desktop': gridCols.desktop,
        '--grid-cols-tablet': gridCols.tablet,
        '--grid-cols-mobile': gridCols.mobile,
        '--image-width-desktop': typeof imageWidth === 'string' ? imageWidth : imageWidth.desktop,
        '--image-width-tablet': typeof imageWidth === 'string' ? imageWidth : imageWidth.tablet,
        '--image-width-mobile': typeof imageWidth === 'string' ? imageWidth : imageWidth.mobile,
      } as React.CSSProperties}
    >
      <div className={cn(
        'grid gap-6',
        `grid-cols-[repeat(var(--grid-cols-mobile),1fr)]`,
        `md:grid-cols-[repeat(var(--grid-cols-tablet),1fr)]`,
        `lg:grid-cols-[repeat(var(--grid-cols-desktop),1fr)]`
      )}>
        {articles.map((article, index) => {
          // تحديد موضع الصورة للـ Alternating
          const imageOnRight = isAlternating && index % 2 === 1;
          
          return (
            <article
              key={article.id}
              className={cn(
                'group',
                isCompact ? 'flex gap-3' : 'flex gap-4 md:gap-6',
                imageOnRight && 'flex-row-reverse',
                card.style === 'elevated' && 'bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-4',
                card.style === 'outlined' && 'border border-gray-200 dark:border-gray-700 rounded-xl p-4',
                showDivider && !card.style && 'pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0',
                card.hoverEffect === 'lift' && 'hover:-translate-y-1 transition-transform duration-300'
              )}
            >
              {/* الصورة */}
              <Link
                href={`/article/${article.slug}`}
                className="flex-shrink-0"
                style={{
                  width: isCompact 
                    ? (typeof custom.imageWidth === 'string' ? custom.imageWidth : '120px')
                    : 'var(--image-width-mobile)',
                }}
              >
                <div className={cn(
                  'relative overflow-hidden rounded-lg',
                  isCompact ? 'aspect-square' : 'aspect-[4/3]',
                  'w-[var(--image-width-mobile)] md:w-[var(--image-width-tablet)] lg:w-[var(--image-width-desktop)]'
                )}>
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/400x300/1a365d/ffffff?text=News'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="200px"
                  />
                </div>
              </Link>

              {/* المحتوى */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {/* Category */}
                {display.showCategory !== false && article.categories?.[0] && (
                  <span className="text-xs font-medium text-primary mb-1">
                    {article.categories[0].nameAr || article.categories[0].name}
                  </span>
                )}

                {/* العنوان */}
                <Link href={`/article/${article.slug}`}>
                  <h3 className={cn(
                    'font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors',
                    isCompact ? 'text-sm line-clamp-2' : 'text-base md:text-lg line-clamp-2'
                  )}>
                    {article.title}
                  </h3>
                </Link>

                {/* المقتطف */}
                {display.showExcerpt !== false && article.excerpt && !isCompact && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                {/* Meta */}
                <div className={cn(
                  'flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400',
                  isCompact ? 'mt-1' : 'mt-3'
                )}>
                  {display.showAuthor !== false && article.author && (
                    <span>{article.author.displayName || article.author.name}</span>
                  )}
                  
                  {display.showDate !== false && article.publishedAt && (
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// دالة مساعدة لحساب الوقت المنقضي
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'الآن';
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} د`;
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} س`;
  if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} ي`;
  
  return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
}
