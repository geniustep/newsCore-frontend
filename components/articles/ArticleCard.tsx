'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Clock, Eye, User } from 'lucide-react';
import type { Article } from '@/lib/api/types';
import type { Locale } from '@/i18n/config';
import { formatRelativeTime, formatCompactNumber, truncateText } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'horizontal';
  showCategory?: boolean;
  showAuthor?: boolean;
  showExcerpt?: boolean;
}

export default function ArticleCard({
  article,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showExcerpt = true,
}: ArticleCardProps) {
  const locale = useLocale() as Locale;

  const isHorizontal = variant === 'horizontal';
  const isCompact = variant === 'compact';

  return (
    <article
      className={`group ${
        isHorizontal
          ? 'flex gap-4'
          : 'flex flex-col'
      } hover:shadow-lg transition-shadow rounded-lg overflow-hidden bg-white border border-gray-200`}
    >
      {/* Image */}
      {article.featuredImage && (
        <Link
          href={`/${locale}/article/${article.slug}`}
          className={`relative overflow-hidden ${
            isHorizontal
              ? 'w-48 flex-shrink-0'
              : isCompact
              ? 'h-40'
              : 'h-56'
          }`}
        >
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showCategory && (
            <div className="absolute top-3 start-3">
              <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                {article.category.name}
              </span>
            </div>
          )}
        </Link>
      )}

      {/* Content */}
      <div className={`p-4 flex flex-col ${isHorizontal ? 'flex-1' : ''}`}>
        {/* Title */}
        <Link href={`/${locale}/article/${article.slug}`}>
          <h3
            className={`font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 ${
              isCompact ? 'text-base' : 'text-xl'
            }`}
          >
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {showExcerpt && !isCompact && article.excerpt && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {truncateText(article.excerpt, 120)}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-gray-500">
          {showAuthor && article.author && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{article.author.name}</span>
            </div>
          )}
          {article.publishedAt && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(article.publishedAt, locale)}</span>
            </div>
          )}
          {article.viewCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatCompactNumber(article.viewCount, locale)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
