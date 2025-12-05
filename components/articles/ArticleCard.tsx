'use client';

import { useState, useEffect } from 'react';
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

// Helper to get image URL from article
const getImageUrl = (article: Article): string | undefined => {
  return article.coverImageUrl || article.featuredImage;
};

// Helper to get category from article
const getCategory = (article: Article) => {
  return article.category || article.categories?.[0];
};

// Helper to get author name
const getAuthorName = (article: Article): string => {
  const author = article.author;
  if (!author) return '';
  if ('displayName' in author && author.displayName) return author.displayName;
  if ('name' in author && author.name) return author.name;
  if ('firstName' in author) return `${author.firstName} ${author.lastName}`.trim();
  return '';
};

export default function ArticleCard({
  article,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showExcerpt = true,
}: ArticleCardProps) {
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (article.publishedAt) {
      setRelativeTime(formatRelativeTime(article.publishedAt, locale));
    }
  }, [article.publishedAt, locale]);

  const isHorizontal = variant === 'horizontal';
  const isCompact = variant === 'compact';
  
  const imageUrl = getImageUrl(article);
  const category = getCategory(article);
  const authorName = getAuthorName(article);

  return (
    <article
      className={`group ${
        isHorizontal
          ? 'flex gap-4'
          : 'flex flex-col'
      } hover:shadow-lg transition-shadow rounded-lg overflow-hidden bg-white border border-gray-200`}
    >
      {/* Image */}
      {imageUrl && (
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
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showCategory && category && (
            <div className="absolute top-3 start-3">
              <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                {category.name}
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
          {showAuthor && authorName && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{authorName}</span>
            </div>
          )}
          {mounted && article.publishedAt && relativeTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{relativeTime}</span>
            </div>
          )}
          {(article.viewCount ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatCompactNumber(article.viewCount!, locale)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
