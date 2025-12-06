/**
 * NewsCore Template Engine - Big Hero Block
 * بلوك البطل الرئيسي للصفحة الرئيسية
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockConfig } from '@/lib/template-engine/types';
import type { FetchResult, Article } from '@/lib/template-engine/data-source';
import { getMockArticles } from '@/lib/template-engine/data-source';
import { cn } from '@/lib/utils/cn';

// Variants
import HeroClassic from './variants/HeroClassic';
import HeroMagazine from './variants/HeroMagazine';
import HeroMosaic from './variants/HeroMosaic';
import HeroSlider from './variants/HeroSlider';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface BigHeroProps {
  variant: string;
  config: Partial<BlockConfig>;
  data?: FetchResult;
  pageData?: Record<string, any>;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANT COMPONENTS MAP
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANT_COMPONENTS: Record<string, React.ComponentType<BigHeroProps>> = {
  'hero-classic': HeroClassic,
  'hero-newspaper': HeroClassic, // uses same component with different config
  'hero-magazine': HeroMagazine,
  'hero-immersive': HeroMagazine,
  'hero-mosaic': HeroMosaic,
  'hero-bento': HeroMosaic,
  'hero-slider': HeroSlider,
  'hero-cards-slider': HeroSlider,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BigHero({
  variant,
  config,
  data,
  pageData,
  className,
}: BigHeroProps) {
  // استخدام بيانات وهمية إذا لم تتوفر بيانات حقيقية
  const articles = useMemo(() => {
    if (data?.articles?.length) {
      return data.articles;
    }
    return getMockArticles(6);
  }, [data]);

  // الحصول على مكون الـ variant
  const VariantComponent = VARIANT_COMPONENTS[variant] || HeroClassic;

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

export interface HeroArticleProps {
  article: Article;
  config: Partial<BlockConfig>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOverlay?: boolean;
  className?: string;
}

export function HeroArticle({
  article,
  config,
  size = 'lg',
  showOverlay = true,
  className,
}: HeroArticleProps) {
  const { display = {} } = config;

  const titleSizes = {
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl lg:text-2xl',
    xl: 'text-xl md:text-2xl lg:text-3xl xl:text-4xl',
  };

  return (
    <article className={cn('hero-article group relative h-full', className)}>
      <Link href={`/article/${article.slug}`} className="block h-full">
        {/* الصورة */}
        <div className="absolute inset-0">
          <Image
            src={article.coverImageUrl || 'https://placehold.co/1200x800/1a365d/ffffff?text=News'}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>

        {/* Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        )}

        {/* المحتوى */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
          {/* Category */}
          {display.showCategory !== false && article.categories?.[0] && (
            <span className="inline-block bg-primary text-white px-3 py-1 text-xs md:text-sm font-bold rounded mb-3">
              {article.categories[0].nameAr || article.categories[0].name}
            </span>
          )}

          {/* العنوان */}
          <h2 className={cn(
            'font-bold text-white mb-2 md:mb-3',
            'group-hover:text-primary/90 transition-colors',
            titleSizes[size],
            size === 'xl' ? 'line-clamp-3' : 'line-clamp-2'
          )}>
            {article.title}
          </h2>

          {/* المقتطف */}
          {display.showExcerpt !== false && article.excerpt && size !== 'sm' && (
            <p className={cn(
              'text-gray-200 mb-3',
              size === 'xl' ? 'text-base md:text-lg line-clamp-2' : 'text-sm line-clamp-2',
              size === 'md' && 'hidden md:block'
            )}>
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-300">
            {display.showAuthor !== false && article.author && (
              <div className="flex items-center gap-2">
                {display.showAuthorImage !== false && article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={size === 'xl' ? 32 : 24}
                    height={size === 'xl' ? 32 : 24}
                    className="rounded-full border border-white/30"
                  />
                )}
                <span>{article.author.displayName || article.author.name}</span>
              </div>
            )}

            {display.showDate !== false && article.publishedAt && (
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            )}

            {display.showReadingTime !== false && article.readingTime && (
              <span>{article.readingTime} دقائق</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { BigHero };
