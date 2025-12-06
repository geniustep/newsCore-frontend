/**
 * Big Hero - Variant: Classic
 * البطل الكلاسيكي - 60/40 مع مقال رئيسي وشريط جانبي
 */

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BigHeroProps, HeroArticleProps } from '../index';
import { HeroArticle } from '../index';
import { cn } from '@/lib/utils/cn';

export default function HeroClassic({
  variant,
  config,
  data,
  className,
}: BigHeroProps) {
  const { display = {}, custom = {} } = config;
  const articles = data?.articles || [];

  // تقسيم المقالات
  const mainArticle = articles[0];
  const sidebarArticles = articles.slice(1, (custom.sidebarArticles || 4) + 1);

  // إعدادات النمط
  const isNewspaper = variant === 'hero-newspaper';
  const mainWidth = custom.mainWidth || '60%';
  const sidebarWidth = custom.sidebarWidth || '40%';

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  if (isNewspaper) {
    // Newspaper Style - 3 أعمدة
    return (
      <div className={cn('hero-newspaper', className)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-gray-200 dark:bg-gray-700">
          {/* العمود الأيسر */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-4">
            <div className="space-y-4">
              {articles.slice(1, 3).map((article) => (
                <SideArticle key={article.id} article={article} config={config} />
              ))}
            </div>
          </div>

          {/* العمود الرئيسي */}
          <div className="lg:col-span-6 bg-white dark:bg-gray-900">
            <article className="group">
              <Link href={`/article/${mainArticle.slug}`} className="block">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={mainArticle.coverImageUrl || 'https://placehold.co/800x600/1a365d/ffffff?text=Main'}
                    alt={mainArticle.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-4">
                  {mainArticle.categories?.[0] && (
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {mainArticle.categories[0].nameAr || mainArticle.categories[0].name}
                    </span>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-3 group-hover:text-primary transition-colors">
                    {mainArticle.title}
                  </h2>
                  {mainArticle.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {mainArticle.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          </div>

          {/* العمود الأيمن */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-4">
            <div className="space-y-4">
              {articles.slice(3, 5).map((article) => (
                <SideArticle key={article.id} article={article} config={config} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic Style - 60/40
  return (
    <div className={cn('hero-classic', className)}>
      <div 
        className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6"
        style={{
          '--main-cols': 3,
          '--side-cols': 2,
        } as React.CSSProperties}
      >
        {/* المقال الرئيسي */}
        <div className="lg:col-span-3 h-[400px] md:h-[500px] lg:h-[550px] rounded-xl overflow-hidden shadow-xl">
          <HeroArticle
            article={mainArticle}
            config={{
              ...config,
              display: {
                ...display,
                showAuthor: true,
                showAuthorImage: true,
                showReadingTime: true,
              },
            }}
            size="xl"
          />
        </div>

        {/* الشريط الجانبي */}
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
          {sidebarArticles.map((article, index) => (
            <article
              key={article.id}
              className={cn(
                'group flex gap-3',
                'bg-white dark:bg-gray-800 rounded-lg p-3',
                'shadow-md hover:shadow-lg transition-shadow'
              )}
            >
              <Link
                href={`/article/${article.slug}`}
                className="flex-shrink-0 w-20 md:w-24 lg:w-28"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/200x200/1a365d/ffffff?text=News'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="120px"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {article.categories?.[0] && (
                  <span className="text-xs font-medium text-primary mb-1">
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
                    className="text-xs text-gray-500 mt-1"
                  >
                    {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// مكون مقال جانبي للـ Newspaper
function SideArticle({ article, config }: { article: any; config: any }) {
  return (
    <article className="group pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
      <Link href={`/article/${article.slug}`}>
        {article.categories?.[0] && (
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {article.categories[0].nameAr || article.categories[0].name}
          </span>
        )}
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.publishedAt && (
          <time 
            dateTime={article.publishedAt}
            className="text-xs text-gray-500 mt-1 block"
          >
            {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
              month: 'short',
              day: 'numeric',
            })}
          </time>
        )}
      </Link>
    </article>
  );
}
