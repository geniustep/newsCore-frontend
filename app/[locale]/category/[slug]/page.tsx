import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleGrid from '@/components/articles/ArticleGrid';
import { categoriesApi, articlesApi } from '@/lib/api';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = params;
  const page = parseInt(searchParams.page || '1', 10);
  const t = await getTranslations();

  try {
    // Fetch category and articles
    const [category, categories, articlesData] = await Promise.all([
      categoriesApi.getBySlug(slug),
      categoriesApi.getTopLevel().catch(() => []),
      articlesApi.getByCategory(slug, { page, limit: 12 }),
    ]);

    if (!category) {
      notFound();
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />

        <main className="flex-1 bg-gray-50">
          {/* Category Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-12">
              {/* Breadcrumb */}
              <nav className="mb-4 text-sm text-gray-600">
                <Link href={`/${locale}`} className="hover:text-primary">
                  {t('nav.home')}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{category.name}</span>
              </nav>

              <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-gray-600">{category.description}</p>
              )}
              <div className="mt-4 text-sm text-gray-500">
                {articlesData.meta.total} {t('article.readMore')}
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            {articlesData.data.length > 0 ? (
              <>
                <ArticleGrid articles={articlesData.data} columns={3} />

                {/* Pagination */}
                {articlesData.meta.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: articlesData.meta.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/${locale}/category/${slug}?page=${pageNum}`}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">{t('search.noResults')}</p>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading category:', error);
    notFound();
  }
}
