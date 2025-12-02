import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, User, Share2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleGrid from '@/components/articles/ArticleGrid';
import { articlesApi, categoriesApi } from '@/lib/api';
import { formatDate, formatCompactNumber } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

interface ArticlePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations();

  try {
    // Fetch article and related data
    const [article, categories, relatedArticles] = await Promise.all([
      articlesApi.getBySlug(slug),
      categoriesApi.getTopLevel().catch(() => []),
      articlesApi.getPublic({ page: 1, limit: 3 }).catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 3, totalPages: 0 } })),
    ]);

    if (!article) {
      notFound();
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />

        <main className="flex-1 bg-gray-50">
          <article className="max-w-4xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-600">
              <Link href={`/${locale}`} className="hover:text-primary">
                {t('nav.home')}
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/${locale}/category/${article.category.slug}`}
                className="hover:text-primary"
              >
                {article.category.name}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{article.title}</span>
            </nav>

            {/* Category Badge */}
            <div className="mb-4">
              <Link
                href={`/${locale}/category/${article.category.slug}`}
                className="inline-block px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-light transition-colors"
              >
                {article.category.name}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{article.author.name}</span>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(article.publishedAt, locale as Locale)}</span>
                </div>
              )}
              {article.viewCount > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatCompactNumber(article.viewCount, locale)}</span>
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm font-medium text-gray-700">{t('article.share')}:</span>
              <button className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="relative w-full h-[500px] mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8 pt-8 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">{t('nav.home')}:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/tag/${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Related Articles */}
          {relatedArticles.data.length > 0 && (
            <section className="bg-white py-12">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">{t('article.related')}</h2>
                <ArticleGrid articles={relatedArticles.data} columns={3} />
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
