/**
 * Big Hero - Variant: Magazine
 * بطل المجلة - عرض كامل مع شبكة سفلية
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BigHeroProps } from '../index';
import { HeroArticle } from '../index';
import { cn } from '@/lib/utils/cn';

export default function HeroMagazine({
  variant,
  config,
  data,
  className,
}: BigHeroProps) {
  const { display = {}, custom = {} } = config;
  const articles = data?.articles || [];

  // تقسيم المقالات
  const mainArticle = articles[0];
  const bottomArticles = articles.slice(1, 5);

  // إعدادات
  const isImmersive = variant === 'hero-immersive';
  const mainHeight = custom.mainHeight || { desktop: '70vh', tablet: '50vh', mobile: '40vh' };

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  if (isImmersive) {
    // Immersive - ملء الشاشة مع محتوى مركزي
    return (
      <div className={cn('hero-immersive relative', className)}>
        <div 
          className="relative"
          style={{ minHeight: '100vh' }}
        >
          {/* الصورة */}
          <div className="absolute inset-0">
            <Image
              src={mainArticle.coverImageUrl || 'https://placehold.co/1920x1080/1a365d/ffffff?text=Hero'}
              alt={mainArticle.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

          {/* المحتوى المركزي */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-6">
              {mainArticle.categories?.[0] && (
                <span className="inline-block bg-primary text-white px-4 py-1.5 text-sm font-bold rounded-full mb-6">
                  {mainArticle.categories[0].nameAr || mainArticle.categories[0].name}
                </span>
              )}

              <Link href={`/article/${mainArticle.slug}`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight hover:text-primary/90 transition-colors">
                  {mainArticle.title}
                </h1>
              </Link>

              {mainArticle.excerpt && (
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto line-clamp-3">
                  {mainArticle.excerpt}
                </p>
              )}

              <div className="flex items-center justify-center gap-6 text-gray-300">
                {mainArticle.author && (
                  <div className="flex items-center gap-3">
                    {mainArticle.author.avatar && (
                      <Image
                        src={mainArticle.author.avatar}
                        alt={mainArticle.author.name}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-white/30"
                      />
                    )}
                    <span className="font-medium">
                      {mainArticle.author.displayName || mainArticle.author.name}
                    </span>
                  </div>
                )}

                {mainArticle.publishedAt && (
                  <time dateTime={mainArticle.publishedAt}>
                    {new Date(mainArticle.publishedAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}

                {mainArticle.readingTime && (
                  <span>{mainArticle.readingTime} دقائق للقراءة</span>
                )}
              </div>
            </div>
          </div>

          {/* مؤشر التمرير */}
          {custom.scrollIndicator !== false && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <svg 
                className="w-8 h-8 text-white/70" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Magazine Style
  return (
    <div className={cn('hero-magazine', className)}>
      {/* القسم الرئيسي */}
      <div 
        className="relative mb-4 md:mb-6"
        style={{
          height: typeof mainHeight === 'string' ? mainHeight : undefined,
          minHeight: custom.minHeight || '400px',
        }}
      >
        <div className="absolute inset-0 h-[40vh] md:h-[50vh] lg:h-[70vh]">
          <Image
            src={mainArticle.coverImageUrl || 'https://placehold.co/1920x800/1a365d/ffffff?text=Hero'}
            alt={mainArticle.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 h-[40vh] md:h-[50vh] lg:h-[70vh] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* المحتوى */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12 h-[40vh] md:h-[50vh] lg:h-[70vh] flex items-end">
          <div className="max-w-7xl mx-auto w-full">
            <div style={{ maxWidth: custom.textWidth || '60%' }}>
              {mainArticle.categories?.[0] && (
                <span className="inline-block bg-primary text-white px-4 py-1.5 text-sm font-bold rounded mb-4">
                  {mainArticle.categories[0].nameAr || mainArticle.categories[0].name}
                </span>
              )}

              <Link href={`/article/${mainArticle.slug}`}>
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight hover:text-primary/90 transition-colors">
                  {mainArticle.title}
                </h1>
              </Link>

              {mainArticle.excerpt && (
                <p className="text-gray-200 text-base md:text-lg mb-4 line-clamp-2">
                  {mainArticle.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-300">
                {mainArticle.author && (
                  <div className="flex items-center gap-2">
                    {mainArticle.author.avatar && (
                      <Image
                        src={mainArticle.author.avatar}
                        alt={mainArticle.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span>{mainArticle.author.displayName || mainArticle.author.name}</span>
                  </div>
                )}

                {mainArticle.publishedAt && (
                  <time dateTime={mainArticle.publishedAt}>
                    {new Date(mainArticle.publishedAt).toLocaleDateString('ar-SA')}
                  </time>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الشبكة السفلية */}
      {custom.bottomGrid?.enabled !== false && bottomArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bottomArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href={`/article/${article.slug}`} className="block">
                  <div className="relative aspect-video">
                    <Image
                      src={article.coverImageUrl || 'https://placehold.co/400x225/1a365d/ffffff?text=News'}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {article.categories?.[0] && (
                      <span className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-0.5 text-xs font-medium rounded">
                        {article.categories[0].nameAr || article.categories[0].name}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
