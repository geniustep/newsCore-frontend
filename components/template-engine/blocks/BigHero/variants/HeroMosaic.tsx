/**
 * Big Hero - Variant: Mosaic
 * بطل الفسيفساء - شبكة مع مقال رئيسي كبير
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BigHeroProps } from '../index';
import { cn } from '@/lib/utils/cn';

export default function HeroMosaic({
  variant,
  config,
  data,
  className,
}: BigHeroProps) {
  const { display = {}, custom = {} } = config;
  const articles = data?.articles || [];

  const isBento = variant === 'hero-bento';

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  if (isBento) {
    // Bento Box Style
    return (
      <div className={cn('hero-bento', className)}>
        <div 
          className="grid gap-3 md:gap-4"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, minmax(150px, 1fr))',
            gridTemplateAreas: `
              "main main side1"
              "main main side2"
              "bottom1 bottom2 side3"
            `,
            height: '600px',
          }}
        >
          {articles.slice(0, 6).map((article, index) => {
            const areas = ['main', 'side1', 'side2', 'bottom1', 'bottom2', 'side3'];
            const area = areas[index];
            const isMain = area === 'main';

            return (
              <article
                key={article.id}
                className="group relative rounded-xl overflow-hidden"
                style={{ gridArea: area }}
              >
                <Link href={`/article/${article.slug}`} className="block h-full">
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/600x400/1a365d/ffffff?text=News'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={isMain ? '66vw' : '33vw'}
                    priority={isMain}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    {article.categories?.[0] && (
                      <span className={cn(
                        'inline-block bg-primary/90 text-white px-2 py-0.5 font-medium rounded mb-2',
                        isMain ? 'text-sm' : 'text-xs'
                      )}>
                        {article.categories[0].nameAr || article.categories[0].name}
                      </span>
                    )}

                    <h3 className={cn(
                      'font-bold text-white group-hover:text-primary/90 transition-colors',
                      isMain ? 'text-xl md:text-2xl line-clamp-2' : 'text-sm md:text-base line-clamp-2'
                    )}>
                      {article.title}
                    </h3>

                    {isMain && article.excerpt && (
                      <p className="text-gray-200 text-sm mt-2 line-clamp-2 hidden md:block">
                        {article.excerpt}
                      </p>
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

  // Mosaic Style - 1 كبير + 4 صغار
  const mainArticle = articles[0];
  const smallArticles = articles.slice(1, 5);

  return (
    <div className={cn('hero-mosaic', className)}>
      <div 
        className="grid gap-3 md:gap-4"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, minmax(200px, 250px))',
          height: custom.height?.desktop || '500px',
        }}
      >
        {/* المقال الرئيسي */}
        <article
          className="group relative rounded-xl overflow-hidden col-span-2 row-span-2"
        >
          <Link href={`/article/${mainArticle.slug}`} className="block h-full">
            <Image
              src={mainArticle.coverImageUrl || 'https://placehold.co/800x500/1a365d/ffffff?text=Main'}
              alt={mainArticle.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="50vw"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              {mainArticle.categories?.[0] && (
                <span className="inline-block bg-primary text-white px-3 py-1 text-sm font-bold rounded mb-3">
                  {mainArticle.categories[0].nameAr || mainArticle.categories[0].name}
                </span>
              )}

              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary/90 transition-colors">
                {mainArticle.title}
              </h2>

              {mainArticle.excerpt && (
                <p className="text-gray-200 text-sm line-clamp-2 hidden md:block">
                  {mainArticle.excerpt}
                </p>
              )}

              <div className="flex items-center gap-3 text-sm text-gray-300 mt-3">
                {mainArticle.author && (
                  <span>{mainArticle.author.displayName || mainArticle.author.name}</span>
                )}
                {mainArticle.publishedAt && (
                  <time dateTime={mainArticle.publishedAt}>
                    {new Date(mainArticle.publishedAt).toLocaleDateString('ar-SA')}
                  </time>
                )}
              </div>
            </div>
          </Link>
        </article>

        {/* المقالات الصغيرة */}
        {smallArticles.map((article) => (
          <article
            key={article.id}
            className="group relative rounded-xl overflow-hidden"
          >
            <Link href={`/article/${article.slug}`} className="block h-full">
              <Image
                src={article.coverImageUrl || 'https://placehold.co/400x250/1a365d/ffffff?text=News'}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="25vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-3">
                {article.categories?.[0] && (
                  <span className="inline-block bg-primary/90 text-white px-2 py-0.5 text-xs font-medium rounded mb-2">
                    {article.categories[0].nameAr || article.categories[0].name}
                  </span>
                )}

                <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-primary/90 transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
