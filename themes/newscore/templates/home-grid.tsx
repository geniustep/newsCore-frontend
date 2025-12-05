'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingNews from '@/components/articles/BreakingNews';
import { MostReadWidget, NewsletterWidget, PollWidget } from '@/components/homepage/SidebarWidgets';
import VideoSection from '@/components/homepage/VideoSection';
import OpinionSection from '@/components/homepage/OpinionSection';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import { BackToTop, CookieNotice } from '@/components/homepage/FloatingElements';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, ArrowLeft } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  readingTime?: number;
  author?: {
    displayName?: string;
    firstName?: string;
    lastName?: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
  }>;
}

interface HomeGridTemplateProps {
  featuredArticles: Article[];
  latestArticles: Article[];
  trendingArticles: Article[];
  categories: Array<{
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
    color?: string;
  }>;
}

export default function HomeGridTemplate({
  featuredArticles,
  latestArticles,
  trendingArticles,
  categories,
}: HomeGridTemplateProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Breaking News */}
      {trendingArticles.length > 0 && (
        <BreakingNews articles={trendingArticles.slice(0, 5)} />
      )}

      <main className="flex-1">
        {/* Hero Grid Section */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
            {/* Main Featured - Takes 8 columns and 2 rows */}
            {featuredArticles[0] && (
              <Link
                href={`/article/${featuredArticles[0].slug}`}
                className="col-span-12 lg:col-span-8 row-span-2 group relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={featuredArticles[0].coverImageUrl || 'https://placehold.co/1200x800/1a365d/ffffff?text=Featured'}
                  alt={featuredArticles[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  {featuredArticles[0].categories?.[0] && (
                    <span className="inline-block bg-primary text-white px-4 py-1.5 text-sm font-bold rounded-full mb-4">
                      {featuredArticles[0].categories[0].nameAr || featuredArticles[0].categories[0].name}
                    </span>
                  )}
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {featuredArticles[0].title}
                  </h2>
                  {featuredArticles[0].excerpt && (
                    <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
                      {featuredArticles[0].excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    {featuredArticles[0].publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredArticles[0].publishedAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                    {featuredArticles[0].readingTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{featuredArticles[0].readingTime} دقائق</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Side Articles - 4 columns, 1 row each */}
            {featuredArticles.slice(1, 3).map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="col-span-6 lg:col-span-4 row-span-1 group relative rounded-xl overflow-hidden"
              >
                <Image
                  src={article.coverImageUrl || 'https://placehold.co/600x400/1a365d/ffffff?text=Article'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {article.categories?.[0] && (
                    <span className="inline-block bg-primary/90 text-white px-2 py-0.5 text-xs font-bold rounded mb-2">
                      {article.categories[0].nameAr || article.categories[0].name}
                    </span>
                  )}
                  <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Category Pills */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="px-6 py-2 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors font-medium shadow-sm"
              >
                {category.nameAr || category.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Articles Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('common.latest')}
            </h2>
            <Link
              href="/articles"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              المزيد
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestArticles.slice(0, 12).map((article) => (
              <article
                key={article.id}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <Link href={`/article/${article.slug}`} className="block">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={article.coverImageUrl || 'https://placehold.co/400x300/1a365d/ffffff?text=Article'}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {article.categories?.[0] && (
                      <span className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 text-xs rounded">
                        {article.categories[0].nameAr || article.categories[0].name}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {article.publishedAt && (
                        <span>{new Date(article.publishedAt).toLocaleDateString('ar-SA')}</span>
                      )}
                      {article.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readingTime} د
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">الأكثر قراءة</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {trendingArticles.slice(0, 5).map((article, index) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group flex gap-4 items-start"
                >
                  <span className="text-5xl font-black text-primary/30 group-hover:text-primary transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-white font-bold group-hover:text-primary transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    {article.publishedAt && (
                      <span className="text-gray-500 text-sm mt-2 block">
                        {new Date(article.publishedAt).toLocaleDateString('ar-SA')}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2 Columns */}
            <div className="lg:col-span-2 space-y-8">
              {categories.slice(0, 2).map((category) => {
                const categoryArticles = latestArticles.filter(
                  (article) => article.categories?.some((c) => c.id === category.id)
                );
                
                if (categoryArticles.length < 2) return null;

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white border-r-4 border-primary pr-3">
                        {category.nameAr || category.name}
                      </h3>
                      <Link
                        href={`/category/${category.slug}`}
                        className="text-primary text-sm hover:underline"
                      >
                        المزيد
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {categoryArticles.slice(0, 4).map((article) => (
                        <Link
                          key={article.id}
                          href={`/article/${article.slug}`}
                          className="group flex gap-4"
                        >
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={article.coverImageUrl || 'https://placehold.co/200x200/1a365d/ffffff?text=A'}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            {article.publishedAt && (
                              <span className="text-gray-500 text-xs mt-2 block">
                                {new Date(article.publishedAt).toLocaleDateString('ar-SA')}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <MostReadWidget articles={trendingArticles} />
              <NewsletterWidget />
            </aside>
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      <Footer />

      {/* Floating Elements */}
      <BackToTop />
      <CookieNotice />
    </div>
  );
}
