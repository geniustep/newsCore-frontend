import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ArticleGrid from '@/components/articles/ArticleGrid';
import { categoriesApi, articlesApi } from '@/lib/api';
import { locales } from '@/i18n/config';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

// Enable dynamic params - allow pages to be generated on-demand
export const dynamicParams = true;

// Revalidate pages every 60 seconds (ISR)
export const revalidate = 60;

// Generate static params for all categories at build time
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  
  try {
    // Get all categories
    const categories = await categoriesApi.getAll();
    
    // Generate params for each locale and category
    for (const locale of locales) {
      for (const category of categories) {
        params.push({
          locale,
          slug: category.slug,
        });
      }
    }
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    // Return empty array if API is not available at build time
    // Next.js will generate pages on-demand thanks to dynamicParams = true
  }
  
  return params;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = params;
  const page = parseInt(searchParams.page || '1', 10);
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations();

  try {
    // Fetch category and articles
    const [categoryResult, articlesDataResult] = await Promise.allSettled([
      categoriesApi.getBySlug(slug),
      articlesApi.getByCategory(slug, { page, limit: 12 }),
    ]);

    // Handle category fetch
    if (categoryResult.status === 'rejected') {
      console.error('Error fetching category:', slug, categoryResult.reason);
      notFound();
    }

    const category = categoryResult.value;
    if (!category) {
      console.error('Category not found:', slug);
      notFound();
    }

    // Handle articles fetch
    let articlesData;
    if (articlesDataResult.status === 'fulfilled') {
      articlesData = articlesDataResult.value;
    } else {
      console.error('Error fetching articles:', articlesDataResult.reason);
      // Use empty data if articles fetch fails
      articlesData = { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

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
