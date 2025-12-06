'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import type { Article } from '@/lib/api/types';

interface HeroSectionProps {
  mainArticle: Article;
  sideArticles?: Article[];
  layout?: 'classic' | 'grid' | 'magazine';
}

// Helper to get image URL from article
const getImageUrl = (article: Article): string | undefined => {
  return article.coverImageUrl || article.featuredImage;
};

// Helper to get author name
const getAuthorName = (author: Article['author']): string => {
  if ('displayName' in author && author.displayName) return author.displayName;
  if ('name' in author && author.name) return author.name;
  if ('firstName' in author) return `${author.firstName} ${author.lastName}`;
  return '';
};

// Client-only time formatting component to avoid hydration mismatch
function TimeAgo({ date, locale }: { date: string; locale: string }) {
  const [mounted, setMounted] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const getLocale = () => {
      switch (locale) {
        case 'ar': return ar;
        case 'fr': return fr;
        default: return enUS;
      }
    };
    setTimeAgo(formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: getLocale(),
    }));
  }, [date, locale]);

  if (!mounted) return null;
  return <>{timeAgo}</>;
}

export default function HeroSection({
  mainArticle,
  sideArticles = [],
  layout = 'classic',
}: HeroSectionProps) {
  const locale = useLocale();

  // Classic Layout: 60% main + 40% side
  if (layout === 'classic') {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <Link
              href={`/${locale}/article/${mainArticle.slug}`}
              className="group block relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            >
              {getImageUrl(mainArticle) && (
                <div className="aspect-[16/9] bg-gray-200 relative overflow-hidden">
                  <img
                    src={getImageUrl(mainArticle)}
                    alt={mainArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {mainArticle.category && (
                  <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-semibold rounded mb-3">
                    {mainArticle.category.name}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-bold mb-3 line-clamp-3">
                  {mainArticle.title}
                </h2>
                {mainArticle.excerpt && (
                  <p className="text-lg text-white/90 mb-3 line-clamp-2">
                    {mainArticle.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-white/80">
                  {mainArticle.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {getAuthorName(mainArticle.author)}
                    </span>
                  )}
                  {mainArticle.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <TimeAgo date={mainArticle.publishedAt} locale={locale} />
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-4">
            {sideArticles.slice(0, 4).map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/article/${article.slug}`}
                className="group block"
              >
                <div className="flex gap-4">
                  {getImageUrl(article) && (
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                      <img
                        src={getImageUrl(article)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {article.category && (
                      <span className="text-xs font-semibold text-primary mb-1 block">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="font-bold text-sm md:text-base group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    {article.publishedAt && (
                      <p className="text-xs text-gray-500">
                        <TimeAgo date={article.publishedAt} locale={locale} />
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Grid Layout: 3x2 with varying sizes
  if (layout === 'grid') {
    const gridArticles = [mainArticle, ...sideArticles].slice(0, 6);
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/${locale}/article/${article.slug}`}
              className={`group block relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {getImageUrl(article) && (
                <div className={`bg-gray-200 relative overflow-hidden ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {article.category && (
                  <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-semibold rounded mb-2">
                    {article.category.name}
                  </span>
                )}
                <h3 className={`font-bold mb-2 line-clamp-2 ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                  {article.title}
                </h3>
                {index === 0 && article.excerpt && (
                  <p className="text-sm text-white/90 mb-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // Magazine Layout: Full width with overlay
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href={`/${locale}/article/${mainArticle.slug}`}
        className="group block relative overflow-hidden rounded-lg shadow-2xl"
      >
        {getImageUrl(mainArticle) && (
          <div className="aspect-[21/9] bg-gray-200 relative overflow-hidden">
            <img
              src={getImageUrl(mainArticle)}
              alt={mainArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white max-w-4xl">
          {mainArticle.category && (
            <span className="inline-block px-4 py-2 bg-primary text-white font-semibold rounded mb-4 text-sm md:text-base">
              {mainArticle.category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            {mainArticle.title}
          </h1>
          {mainArticle.excerpt && (
            <p className="text-lg md:text-xl text-white/95 mb-4 md:mb-6 max-w-3xl">
              {mainArticle.excerpt}
            </p>
          )}
          <div className="flex items-center gap-6 text-sm md:text-base text-white/90">
            {mainArticle.author && (
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {getAuthorName(mainArticle.author)}
              </span>
            )}
            {mainArticle.publishedAt && (
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <TimeAgo date={mainArticle.publishedAt} locale={locale} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
