/**
 * NewsCore Template Engine - Article Grid Block
 * بلوك شبكة المقالات - أكثر Block استخداماً
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockConfig, ResponsiveValue } from '@/lib/template-engine/types';
import type { FetchResult, Article } from '@/lib/template-engine/data-source';
import { getMockArticles } from '@/lib/template-engine/data-source';
import { cn } from '@/lib/utils/cn';

// Variants
import Grid1 from './variants/Grid1';
import Grid2 from './variants/Grid2';
import Grid3 from './variants/Grid3';
import Grid6 from './variants/Grid6';
import Grid9 from './variants/Grid9';
import Grid12 from './variants/Grid12';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ArticleGridProps {
  variant: string;
  config: Partial<BlockConfig>;
  data?: FetchResult;
  pageData?: Record<string, any>;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANT COMPONENTS MAP
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANT_COMPONENTS: Record<string, React.ComponentType<ArticleGridProps>> = {
  'grid-1': Grid1,
  'grid-2': Grid2,
  'grid-3': Grid3,
  'grid-4': Grid1, // يستخدم نفس المكون مع config مختلف
  'grid-5': Grid2,
  'grid-6': Grid6,
  'grid-7': Grid6,
  'grid-8': Grid6,
  'grid-9': Grid9,
  'grid-10': Grid9,
  'grid-11': Grid9,
  'grid-12': Grid12,
  'grid-13': Grid12,
  'grid-14': Grid1, // Masonry
  'grid-15': Grid9, // Ticker
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ArticleGrid({
  variant,
  config,
  data,
  pageData,
  className,
}: ArticleGridProps) {
  // استخدام بيانات وهمية إذا لم تتوفر بيانات حقيقية
  const articles = useMemo(() => {
    if (data?.articles?.length) {
      return data.articles;
    }
    // بيانات وهمية للتطوير
    return getMockArticles(config.custom?.limit || 6);
  }, [data, config.custom?.limit]);

  // الحصول على مكون الـ variant
  const VariantComponent = VARIANT_COMPONENTS[variant] || Grid1;

  return (
    <VariantComponent
      variant={variant}
      config={config}
      data={{ articles, total: articles.length, hasMore: false }}
      pageData={pageData}
      className={className}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ArticleCardProps {
  article: Article;
  config: Partial<BlockConfig>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  imagePosition?: 'top' | 'left' | 'right' | 'background';
  className?: string;
}

export function ArticleCard({
  article,
  config,
  size = 'md',
  imagePosition = 'top',
  className,
}: ArticleCardProps) {
  const { display = {}, image = {}, text = {}, card = {} } = config;

  // حجم العنوان حسب الحجم
  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base lg:text-lg',
    lg: 'text-lg lg:text-xl',
    xl: 'text-xl lg:text-2xl',
  };

  // نسبة الصورة
  const aspectRatios = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    '9:16': 'aspect-[9/16]',
    auto: '',
    original: '',
  };

  // أنماط البطاقة
  const cardStyles = {
    flat: 'bg-transparent',
    elevated: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
  };

  // استدارة الحواف
  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  // تأثير التحويم
  const hoverEffects = {
    none: '',
    lift: 'hover:-translate-y-1 transition-transform duration-300',
    glow: 'hover:ring-2 hover:ring-primary/30 transition-all duration-300',
    border: 'hover:border-primary transition-colors duration-300',
  };

  const isHorizontal = imagePosition === 'left' || imagePosition === 'right';

  return (
    <article
      className={cn(
        'article-card group',
        cardStyles[card.style as keyof typeof cardStyles || 'elevated'],
        radiusStyles[card.radius as keyof typeof radiusStyles || 'lg'],
        hoverEffects[card.hoverEffect as keyof typeof hoverEffects || 'lift'],
        isHorizontal && 'flex gap-4',
        className
      )}
    >
      {/* الصورة */}
      {display.showImage !== false && (
        <Link
          href={`/article/${article.slug}`}
          className={cn(
            'block relative overflow-hidden',
            radiusStyles[card.radius as keyof typeof radiusStyles || 'lg'],
            isHorizontal ? 'flex-shrink-0' : '',
            !isHorizontal && aspectRatios[image.aspectRatio as keyof typeof aspectRatios || '16:9']
          )}
          style={isHorizontal ? { width: config.custom?.imageWidth || '120px' } : undefined}
        >
          <div className={cn(
            'relative w-full h-full',
            isHorizontal && aspectRatios[image.aspectRatio as keyof typeof aspectRatios || '1:1']
          )}>
            <Image
              src={article.coverImageUrl || 'https://placehold.co/600x400/1a365d/ffffff?text=News'}
              alt={article.title}
              fill
              className={cn(
                'object-cover',
                'transition-transform duration-500',
                image.hover?.scale && 'group-hover:scale-105'
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          {/* Category Badge */}
          {display.showCategory !== false && article.categories?.[0] && (
            <span className="absolute top-3 right-3 bg-primary text-white px-3 py-1 text-xs font-bold rounded">
              {article.categories[0].nameAr || article.categories[0].name}
            </span>
          )}
        </Link>
      )}

      {/* المحتوى */}
      <div className={cn(
        'content',
        !isHorizontal && 'p-4',
        isHorizontal && 'flex-1 py-1'
      )}>
        {/* العنوان */}
        {display.showTitle !== false && (
          <Link href={`/article/${article.slug}`}>
            <h3
              className={cn(
                'font-bold text-gray-900 dark:text-white mb-2',
                'group-hover:text-primary transition-colors',
                titleSizes[size],
                text.titleLines && `line-clamp-${text.titleLines}`
              )}
            >
              {article.title}
            </h3>
          </Link>
        )}

        {/* المقتطف */}
        {display.showExcerpt !== false && article.excerpt && (
          <p
            className={cn(
              'text-gray-600 dark:text-gray-400 mb-3',
              size === 'sm' ? 'text-xs' : 'text-sm',
              text.excerptLines && `line-clamp-${text.excerptLines}`
            )}
          >
            {article.excerpt}
          </p>
        )}

        {/* البيانات الوصفية */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {/* الكاتب */}
          {display.showAuthor && article.author && (
            <div className="flex items-center gap-2">
              {display.showAuthorImage && article.author.avatar && (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
              <span>{article.author.displayName || article.author.name}</span>
            </div>
          )}

          {/* التاريخ */}
          {display.showDate !== false && article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          )}

          {/* وقت القراءة */}
          {display.showReadingTime && article.readingTime && (
            <span>{article.readingTime} دقائق للقراءة</span>
          )}

          {/* المشاهدات */}
          {display.showViews && article.views && (
            <span>{article.views.toLocaleString('ar-SA')} مشاهدة</span>
          )}
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { ArticleGrid };
