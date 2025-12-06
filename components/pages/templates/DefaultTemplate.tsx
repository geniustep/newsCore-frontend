'use client';

import { Page } from '@/lib/api';
import { Calendar, Share2, Printer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TemplateProps {
  page: Page;
  locale: string;
}

export default function DefaultTemplate({ page, locale }: TemplateProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: page.title,
        text: page.excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      {page.parent && (
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-primary-600">
            الرئيسية
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/page/${page.parent.slug}`} className="hover:text-primary-600">
            {page.parent.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{page.title}</span>
        </nav>
      )}

      {/* Featured Image */}
      {page.featuredImageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg relative w-full h-[400px]">
          <Image
            src={page.featuredImageUrl}
            alt={page.featuredImageAlt || page.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {page.title}
        </h1>

        {page.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {page.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
          {page.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(page.publishedAt)}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mr-auto">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-primary-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 hover:text-primary-600 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-lg
          prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:rounded-r-lg prose-blockquote:py-1
          prose-ul:list-disc prose-ol:list-decimal
          prose-table:border prose-th:bg-gray-100 dark:prose-th:bg-gray-800"
        dangerouslySetInnerHTML={{ __html: page.contentHtml || page.content }}
      />

      {/* Child Pages */}
      {page.children && page.children.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            صفحات ذات صلة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.children.map((child) => (
              <Link
                key={child.id}
                href={`/page/${child.slug}`}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {child.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Translation Notice */}
      {page.translations && page.translations.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            هذه الصفحة متوفرة أيضاً بـ:{' '}
            {page.translations.map((t, index) => (
              <span key={t.id}>
                {index > 0 && '، '}
                <Link
                  href={`?lang=${t.language}`}
                  className="font-medium hover:underline"
                >
                  {t.language === 'en' ? 'English' : t.language === 'fr' ? 'Français' : t.language}
                </Link>
              </span>
            ))}
          </p>
        </div>
      )}
    </article>
  );
}

