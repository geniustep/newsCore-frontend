import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingNews from '@/components/articles/BreakingNews';
import FeaturedArticle from '@/components/articles/FeaturedArticle';
import ArticleGrid from '@/components/articles/ArticleGrid';
import ArticleList from '@/components/articles/ArticleList';
import { articlesApi, categoriesApi } from '@/lib/api';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations();

  try {
    // Fetch data
    const [categories, featuredArticles, latestArticles, trendingArticles] = await Promise.all([
      categoriesApi.getTopLevel().catch(() => []),
      articlesApi.getFeatured(1).catch(() => []),
      articlesApi.getPublic({ page: 1, limit: 6 }).catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 6, totalPages: 0 } })),
      articlesApi.getTrending(5).catch(() => []),
    ]);

    const mainFeatured = featuredArticles[0];

    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />

        {/* Breaking News */}
        {trendingArticles.length > 0 && (
          <BreakingNews articles={trendingArticles.slice(0, 3)} />
        )}

        <main className="flex-1">
          {/* Featured Article */}
          {mainFeatured && (
            <section className="max-w-7xl mx-auto px-4 py-8">
              <FeaturedArticle article={mainFeatured} />
            </section>
          )}

          {/* Latest Articles */}
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">{t('common.latest')}</h2>
            </div>

            {latestArticles.data.length > 0 ? (
              <ArticleGrid articles={latestArticles.data} columns={3} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                {t('search.noResults')}
              </div>
            )}
          </section>

          {/* Sidebar Section */}
          <section className="bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">{t('common.popular')}</h2>
                  {trendingArticles.length > 0 && (
                    <ArticleList articles={trendingArticles} />
                  )}
                </div>

                {/* Sidebar */}
                <div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">{t('common.trending')}</h3>
                    <div className="space-y-4">
                      {trendingArticles.slice(0, 5).map((article, index) => (
                        <div key={article.id} className="flex gap-3">
                          <span className="text-2xl font-bold text-primary">{index + 1}</span>
                          <div>
                            <a href={`/${article.slug}`} className="font-semibold hover:text-primary line-clamp-2">
                              {article.title}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading home page:', error);
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={[]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
            <p className="text-gray-600">{t('common.retry')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
