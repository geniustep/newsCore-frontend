'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import type { Article } from '@/lib/api/types';
import type { Locale } from '@/i18n/config';
import { formatRelativeTime, formatCompactNumber } from '@/lib/utils';

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('article');

  return (
    <article className="relative group overflow-hidden rounded-lg shadow-lg">
      {/* Background Image */}
      {article.featuredImage && (
        <div className="relative h-[500px]">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-8 text-white">
        {/* Category */}
        <div className="mb-3">
          <span className="px-4 py-2 bg-primary rounded-full text-sm font-semibold">
            {article.category.name}
          </span>
        </div>

        {/* Title */}
        <Link href={`/${locale}/article/${article.slug}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-accent transition-colors">
            {article.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-gray-200 mb-6 line-clamp-2">
            {article.excerpt}
          </p>
        )}

        {/* Meta & Read More */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            {article.publishedAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatRelativeTime(article.publishedAt, locale)}</span>
              </div>
            )}
            {article.viewCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatCompactNumber(article.viewCount, locale)}</span>
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/article/${article.slug}`}
            className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-full font-semibold hover:bg-accent hover:text-white transition-colors"
          >
            {t('readMore')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
