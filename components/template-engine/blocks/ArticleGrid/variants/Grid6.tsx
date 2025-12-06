/**
 * Article Grid - Variant 6: Featured First
 * المميز أولاً - المقال الأول كبير والباقي في شبكة
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ArticleGridProps } from '../index';
import { ArticleCard } from '../index';
import { cn } from '@/lib/utils/cn';

export default function Grid6({
  variant,
  config,
  data,
  className,
}: ArticleGridProps) {
  const { display = {}, image = {}, text = {}, card = {}, custom = {} } = config;
  const articles = data?.articles || [];

  // تقسيم المقالات
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  // إعدادات المقال المميز
  const featuredConfig = custom.featuredConfig || {};
  const featuredSpan = custom.featuredSpan || { desktop: 2, tablet: 2, mobile: 1 };

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  return (
    <div className={cn('article-grid-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* المقال المميز */}
        {featuredArticle && (
          <article
            className={cn(
              'featured-article group',
              'col-span-1 md:col-span-2',
              'bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'
            )}
          >
            <Link
              href={`/article/${featuredArticle.slug}`}
              className="block relative aspect-[16/9] md:aspect-[21/9] overflow-hidden"
            >
              <Image
                src={featuredArticle.coverImageUrl || 'https://placehold.co/1200x500/1a365d/ffffff?text=Featured'}
                alt={featuredArticle.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                {/* Category */}
                {featuredArticle.categories?.[0] && (
                  <span className="inline-block bg-primary text-white px-4 py-1.5 text-sm font-bold rounded-lg mb-4">
                    {featuredArticle.categories[0].nameAr || featuredArticle.categories[0].name}
                  </span>
                )}
                
                {/* العنوان */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary/90 transition-colors">
                  {featuredArticle.title}
                </h2>
                
                {/* المقتطف */}
                {featuredArticle.excerpt && (
                  <p className="text-gray-200 mb-4 line-clamp-2 hidden md:block">
                    {featuredArticle.excerpt}
                  </p>
                )}
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  {featuredArticle.author && (
                    <div className="flex items-center gap-2">
                      {featuredArticle.author.avatar && (
                        <Image
                          src={featuredArticle.author.avatar}
                          alt={featuredArticle.author.name}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white/30"
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
                  
                  {featuredArticle.readingTime && (
                    <span>{featuredArticle.readingTime} دقائق</span>
                  )}
                </div>
              </div>
            </Link>
          </article>
        )}

        {/* باقي المقالات */}
        {gridArticles.map((article) => (
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
