'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import type { Article } from '@/lib/api/types';

interface CategorySectionProps {
  categoryName: string;
  categorySlug: string;
  articles: Article[];
  color?: string;
  icon?: React.ReactNode;
}

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

export default function CategorySection({
  categoryName,
  categorySlug,
  articles,
  color = 'primary',
  icon,
}: CategorySectionProps) {
  const locale = useLocale();

  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  const colorClasses = {
    primary: 'text-primary border-primary bg-primary',
    blue: 'text-blue-600 border-blue-600 bg-blue-600',
    green: 'text-green-600 border-green-600 bg-green-600',
    red: 'text-red-600 border-red-600 bg-red-600',
    purple: 'text-purple-600 border-purple-600 bg-purple-600',
    orange: 'text-orange-600 border-orange-600 bg-orange-600',
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {icon && <span className={colorClass.split(' ')[0]}>{icon}</span>}
            <h2 className={`text-3xl font-bold ${colorClass.split(' ')[0]} border-l-4 ${colorClass.split(' ')[1]} pl-4`}>
              {categoryName}
            </h2>
          </div>
          <Link
            href={`/${locale}/category/${categorySlug}`}
            className={`flex items-center gap-2 ${colorClass.split(' ')[0]} hover:underline font-medium`}
          >
            <span>المزيد</span>
            {locale === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Article */}
          {mainArticle && (
            <div className="lg:col-span-2">
              <Link
                href={`/${locale}/article/${mainArticle.slug}`}
                className="group block relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                {(mainArticle.coverImageUrl || mainArticle.featuredImage) && (
                  <div className="aspect-[16/9] bg-gray-200 relative overflow-hidden">
                    <img
                      src={mainArticle.coverImageUrl || mainArticle.featuredImage}
                      alt={mainArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2">
                    {mainArticle.title}
                  </h3>
                  {mainArticle.excerpt && (
                    <p className="text-base text-white/90 mb-3 line-clamp-2">
                      {mainArticle.excerpt}
                    </p>
                  )}
                  {mainArticle.publishedAt && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Clock className="w-4 h-4" />
                      <TimeAgo date={mainArticle.publishedAt} locale={locale} />
                    </div>
                  )}
                </div>
              </Link>
            </div>
          )}

          {/* Side Articles */}
          <div className="space-y-4">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/article/${article.slug}`}
                className="group block pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="flex gap-4">
                  {(article.coverImageUrl || article.featuredImage) && (
                    <div className="w-28 h-20 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                      <img
                        src={article.coverImageUrl || article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h4>
                    {article.publishedAt && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <TimeAgo date={article.publishedAt} locale={locale} />
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
