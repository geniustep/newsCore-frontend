'use client';

import { Page } from '@/lib/api';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface TemplateProps {
  page: Page;
  locale: string;
}

export default function FullWidthTemplate({ page, locale }: TemplateProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article>
      {/* Hero Section */}
      {page.featuredImageUrl && (
        <div className="relative h-[60vh] min-h-[400px]">
          <img
            src={page.featuredImageUrl}
            alt={page.featuredImageAlt || page.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {page.title}
              </h1>
              {page.excerpt && (
                <p className="text-xl text-white/90 max-w-3xl">
                  {page.excerpt}
                </p>
              )}
              {page.publishedAt && (
                <div className="flex items-center gap-2 mt-6 text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(page.publishedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {!page.featuredImageUrl && (
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {page.excerpt}
              </p>
            )}
          </header>
        )}

        <div
          className="prose prose-xl dark:prose-invert max-w-none
            prose-headings:font-bold
            prose-p:leading-relaxed
            prose-a:text-primary-600
            prose-img:rounded-2xl prose-img:shadow-xl
            prose-blockquote:border-l-4 prose-blockquote:border-primary-500
            prose-blockquote:pl-6 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: page.contentHtml || page.content }}
        />
      </div>

      {/* Child Pages */}
      {page.children && page.children.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              اكتشف المزيد
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {page.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/page/${child.slug}`}
                  className="group p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {child.title}
                  </h3>
                  <span className="inline-flex items-center mt-4 text-primary-600 font-medium">
                    اقرأ المزيد
                    <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

