'use client';

import { Page } from '@/lib/api';
import { Calendar, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TemplateProps {
  page: Page;
  locale: string;
}

export default function SidebarTemplate({ page, locale }: TemplateProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-6">
            {/* Navigation */}
            {page.children && page.children.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  في هذا القسم
                </h3>
                <nav className="space-y-2">
                  {page.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/page/${child.slug}`}
                      className="flex items-center gap-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* Parent Link */}
            {page.parent && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  هذه الصفحة جزء من
                </p>
                <Link
                  href={`/page/${page.parent.slug}`}
                  className="font-semibold text-primary-600 hover:underline"
                >
                  {page.parent.title}
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-4">روابط سريعة</h3>
              <nav className="space-y-2">
                <Link href="/page/contact" className="block hover:underline">
                  تواصل معنا
                </Link>
                <Link href="/page/about" className="block hover:underline">
                  من نحن
                </Link>
                <Link href="/page/privacy" className="block hover:underline">
                  سياسة الخصوصية
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <article className="lg:col-span-3 order-1 lg:order-2">
          {/* Featured Image */}
          {page.featuredImageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg relative w-full h-[350px]">
              <Image
                src={page.featuredImageUrl}
                alt={page.featuredImageAlt || page.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 75vw"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {page.excerpt}
              </p>
            )}
            {page.publishedAt && (
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>آخر تحديث: {formatDate(page.publishedAt)}</span>
              </div>
            )}
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold
              prose-a:text-primary-600
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: page.contentHtml || page.content }}
          />
        </article>
      </div>
    </div>
  );
}

