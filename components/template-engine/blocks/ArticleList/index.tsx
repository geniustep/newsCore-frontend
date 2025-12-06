/**
 * NewsCore Template Engine - Article List Block
 * بلوك قائمة المقالات
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockConfig } from '@/lib/template-engine/types';
import type { FetchResult, Article } from '@/lib/template-engine/data-source';
import { getMockArticles } from '@/lib/template-engine/data-source';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ArticleListProps {
  variant: string;
  config: Partial<BlockConfig>;
  data?: FetchResult;
  pageData?: Record<string, any>;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ArticleList({
  variant,
  config,
  data,
  pageData,
  className,
}: ArticleListProps) {
  const articles = useMemo(() => {
    if (data?.articles?.length) {
      return data.articles;
    }
    return getMockArticles(6);
  }, [data]);

  const { display = {}, image = {}, text = {}, card = {}, custom = {} } = config;

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  // Variant-specific rendering
  switch (variant) {
    case 'list-3':
      return <NumberedList articles={articles} config={config} className={className} />;
    case 'list-4':
      return <FeaturedFirstList articles={articles} config={config} className={className} />;
    case 'list-5':
      return <TimelineList articles={articles} config={config} className={className} />;
    case 'list-7':
      return <MinimalList articles={articles} config={config} className={className} />;
    case 'list-8':
      return <NewsWireList articles={articles} config={config} className={className} />;
    default:
      return <StandardList articles={articles} config={config} className={className} variant={variant} />;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STANDARD LIST (list-1, list-2, list-6)
// ═══════════════════════════════════════════════════════════════════════════════

function StandardList({ articles, config, className, variant }: { articles: Article[]; config: Partial<BlockConfig>; className?: string; variant: string }) {
  const { display = {}, image = {}, text = {}, card = {}, custom = {} } = config;
  
  const isCompact = variant === 'list-2';
  const isCardStyle = variant === 'list-6';
  const showDivider = custom.showDivider !== false && !isCardStyle;
  const imageWidth = custom.imageWidth || { desktop: '200px', tablet: '150px', mobile: '100px' };

  return (
    <div className={cn('article-list', className)}>
      <div className={cn(
        isCardStyle ? 'space-y-4' : 'divide-y divide-gray-200 dark:divide-gray-700'
      )}>
        {articles.map((article) => (
          <article
            key={article.id}
            className={cn(
              'group',
              isCardStyle 
                ? 'flex gap-4 md:gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-4 md:p-5 transition-shadow'
                : 'flex gap-3 md:gap-4 py-4 first:pt-0 last:pb-0'
            )}
          >
            {/* الصورة */}
            {display.showImage !== false && (
              <Link
                href={`/article/${article.slug}`}
                className="flex-shrink-0"
                style={{
                  width: isCompact ? '80px' : (typeof imageWidth === 'string' ? imageWidth : imageWidth.desktop),
                }}
              >
                <div className={cn(
                  'relative overflow-hidden rounded-lg',
                  isCompact ? 'aspect-square' : 'aspect-video'
                )}>
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/400x300/1a365d/ffffff?text=News'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="200px"
                  />
                </div>
              </Link>
            )}

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
                isCompact ? 'mt-1' : 'mt-2'
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
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NUMBERED LIST (list-3)
// ═══════════════════════════════════════════════════════════════════════════════

function NumberedList({ articles, config, className }: { articles: Article[]; config: Partial<BlockConfig>; className?: string }) {
  const { display = {}, custom = {} } = config;

  return (
    <div className={cn('article-list-numbered', className)}>
      <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-700">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0"
          >
            {/* الرقم */}
            <span className={cn(
              'flex-shrink-0 font-bold text-primary',
              custom.numberSize?.desktop || 'text-3xl md:text-4xl',
              'w-12 text-center'
            )}>
              {(index + 1).toLocaleString('ar-SA')}
            </span>

            {/* الصورة */}
            {display.showImage !== false && (
              <Link
                href={`/article/${article.slug}`}
                className="flex-shrink-0 w-24 md:w-32"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/300x200/1a365d/ffffff?text=News'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="150px"
                  />
                </div>
              </Link>
            )}

            {/* المحتوى */}
            <div className="flex-1 min-w-0">
              {display.showCategory !== false && article.categories?.[0] && (
                <span className="text-xs font-medium text-primary mb-1 block">
                  {article.categories[0].nameAr || article.categories[0].name}
                </span>
              )}
              <Link href={`/article/${article.slug}`}>
                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </Link>
              {article.publishedAt && (
                <time 
                  dateTime={article.publishedAt}
                  className="text-xs text-gray-500 mt-1 block"
                >
                  {new Date(article.publishedAt).toLocaleDateString('ar-SA')}
                </time>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURED FIRST LIST (list-4)
// ═══════════════════════════════════════════════════════════════════════════════

function FeaturedFirstList({ articles, config, className }: { articles: Article[]; config: Partial<BlockConfig>; className?: string }) {
  const { display = {} } = config;
  const featuredArticle = articles[0];
  const listArticles = articles.slice(1);

  return (
    <div className={cn('article-list-featured', className)}>
      {/* المقال المميز */}
      {featuredArticle && (
        <article className="group mb-6">
          <Link href={`/article/${featuredArticle.slug}`} className="block">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <Image
                src={featuredArticle.coverImageUrl || 'https://placehold.co/800x450/1a365d/ffffff?text=Featured'}
                alt={featuredArticle.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="100%"
                priority
              />
              {featuredArticle.categories?.[0] && (
                <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 text-sm font-bold rounded">
                  {featuredArticle.categories[0].nameAr || featuredArticle.categories[0].name}
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {featuredArticle.title}
            </h2>
            {featuredArticle.excerpt && (
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {featuredArticle.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {featuredArticle.author && (
                <div className="flex items-center gap-2">
                  {featuredArticle.author.avatar && (
                    <Image
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>{featuredArticle.author.displayName || featuredArticle.author.name}</span>
                </div>
              )}
              {featuredArticle.publishedAt && (
                <time dateTime={featuredArticle.publishedAt}>
                  {new Date(featuredArticle.publishedAt).toLocaleDateString('ar-SA')}
                </time>
              )}
            </div>
          </Link>
        </article>
      )}

      {/* القائمة */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {listArticles.map((article) => (
          <article key={article.id} className="group flex gap-3 py-3 first:pt-0">
            <Link href={`/article/${article.slug}`} className="flex-shrink-0 w-20">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={article.coverImageUrl || 'https://placehold.co/200x200/1a365d/ffffff?text=News'}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/article/${article.slug}`}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </Link>
              {article.publishedAt && (
                <time className="text-xs text-gray-500 mt-1 block">
                  {new Date(article.publishedAt).toLocaleDateString('ar-SA')}
                </time>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE LIST (list-5)
// ═══════════════════════════════════════════════════════════════════════════════

function TimelineList({ articles, config, className }: { articles: Article[]; config: Partial<BlockConfig>; className?: string }) {
  const { display = {} } = config;

  return (
    <div className={cn('article-list-timeline relative', className)}>
      {/* خط الزمن */}
      <div className="absolute top-0 bottom-0 right-3 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-4">
        {articles.map((article) => (
          <article key={article.id} className="group relative flex gap-4 pr-8">
            {/* النقطة */}
            <div className="absolute right-1.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-white dark:border-gray-900" />

            {/* الصورة */}
            {display.showImage !== false && (
              <Link href={`/article/${article.slug}`} className="flex-shrink-0 w-16">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/200x200/1a365d/ffffff?text=News'}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </Link>
            )}

            {/* المحتوى */}
            <div className="flex-1 min-w-0">
              {/* الوقت */}
              {article.publishedAt && (
                <time 
                  dateTime={article.publishedAt}
                  className="text-xs font-medium text-primary mb-1 block"
                >
                  {formatTimeAgo(new Date(article.publishedAt))}
                </time>
              )}

              {display.showCategory !== false && article.categories?.[0] && (
                <span className="text-xs text-gray-500 mb-1 block">
                  {article.categories[0].nameAr || article.categories[0].name}
                </span>
              )}

              <Link href={`/article/${article.slug}`}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINIMAL LIST (list-7)
// ═══════════════════════════════════════════════════════════════════════════════

function MinimalList({ articles, config, className }: { articles: Article[]; config: Partial<BlockConfig>; className?: string }) {
  const { display = {}, custom = {} } = config;

  return (
    <div className={cn('article-list-minimal', className)}>
      <ul className="space-y-2">
        {articles.map((article) => (
          <li key={article.id} className="group">
            <Link 
              href={`/article/${article.slug}`}
              className="flex items-start gap-2 py-2 border-b border-dashed border-gray-200 dark:border-gray-700"
            >
              {custom.showBullet !== false && (
                <span className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
              {display.showDate !== false && article.publishedAt && (
                <time className="text-xs text-gray-500 flex-shrink-0">
                  {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS WIRE LIST (list-8)
// ═══════════════════════════════════════════════════════════════════════════════

function NewsWireList({ articles, config, className }: { articles: Article[]; config: Partial<BlockConfig>; className?: string }) {
  const { display = {}, custom = {} } = config;

  return (
    <div className={cn('article-list-wire', className)}>
      <div className="space-y-0">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className={cn(
              'group flex items-center gap-3 py-2 px-3',
              index % 2 === 1 && custom.alternateBackground && 'bg-gray-50 dark:bg-gray-800/50'
            )}
          >
            {/* أيقونة عاجل */}
            {custom.showFlashIcon && (
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            )}

            {/* الوقت */}
            {article.publishedAt && (
              <time 
                dateTime={article.publishedAt}
                className="text-xs font-mono text-gray-500 flex-shrink-0 w-16"
              >
                {formatTimeAgo(new Date(article.publishedAt))}
              </time>
            )}

            {/* Category */}
            {display.showCategory !== false && article.categories?.[0] && (
              <span className="text-xs font-medium text-primary flex-shrink-0">
                [{article.categories[0].nameAr || article.categories[0].name}]
              </span>
            )}

            {/* العنوان */}
            <Link href={`/article/${article.slug}`} className="flex-1 min-w-0">
              <h3 className="text-sm text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                {article.title}
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'الآن';
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} د`;
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} س`;
  if (diffInSeconds < 604800) return `منذ ${Math.floor(diffInSeconds / 86400)} ي`;
  
  return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { ArticleList };
