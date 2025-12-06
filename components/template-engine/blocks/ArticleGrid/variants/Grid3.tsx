/**
 * Article Grid - Variant 3: Large Cards Grid
 * شبكة البطاقات الكبيرة - عمودين مع تفاصيل كاملة
 */

'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { ArticleGridProps } from '../index';
import { cn } from '@/lib/utils/cn';

export default function Grid3({
  config,
  data,
  className,
}: ArticleGridProps) {
  const { display = {} } = config;
  const articles = data?.articles || [];

  if (!articles.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد مقالات للعرض
      </div>
    );
  }

  return (
    <div className={cn('article-grid-3', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* الصورة */}
            <Link
              href={`/article/${article.slug}`}
              className="block relative aspect-video overflow-hidden"
            >
              <Image
                src={article.coverImageUrl || 'https://placehold.co/800x450/1a365d/ffffff?text=News'}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Category Badge */}
              {display.showCategory !== false && article.categories?.[0] && (
                <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 text-sm font-bold rounded-lg shadow-lg">
                  {article.categories[0].nameAr || article.categories[0].name}
                </span>
              )}
            </Link>

            {/* المحتوى */}
            <div className="p-6">
              {/* العنوان */}
              <Link href={`/article/${article.slug}`}>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </Link>

              {/* المقتطف */}
              {display.showExcerpt !== false && article.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              {/* معلومات الكاتب والتاريخ */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                {/* الكاتب */}
                {display.showAuthor !== false && article.author && (
                  <div className="flex items-center gap-3">
                    {display.showAuthorImage !== false && article.author.avatar && (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {article.author.displayName || article.author.name}
                      </p>
                      {display.showDate !== false && article.publishedAt && (
                        <time 
                          dateTime={article.publishedAt}
                          className="text-xs text-gray-500 dark:text-gray-400"
                        >
                          {new Date(article.publishedAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                    </div>
                  </div>
                )}

                {/* وقت القراءة */}
                {display.showReadingTime !== false && article.readingTime && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {article.readingTime} دقائق
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
