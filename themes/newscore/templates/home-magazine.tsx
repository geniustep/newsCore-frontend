'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingNews from '@/components/articles/BreakingNews';
import { MostReadWidget, NewsletterWidget } from '@/components/homepage/SidebarWidgets';
import VideoSection from '@/components/homepage/VideoSection';
import CategorySection from '@/components/homepage/CategorySection';
import OpinionSection from '@/components/homepage/OpinionSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import PhotoGallery from '@/components/homepage/PhotoGallery';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import { BackToTop, CookieNotice } from '@/components/homepage/FloatingElements';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User } from 'lucide-react';
import type { Article, Category } from '@/lib/api/types';

interface HomeMagazineTemplateProps {
  featuredArticles: Article[];
  latestArticles: Article[];
  trendingArticles: Article[];
  categories: Category[];
}

// Helper function to get author name from Author | User union type
function getAuthorDisplayName(author: Article['author']): string {
  if ('displayName' in author) {
    return author.displayName || `${author.firstName} ${author.lastName}`;
  }
  if ('name' in author) {
    return author.name;
  }
  return 'فريق التحرير';
}

export default function HomeMagazineTemplate({
  featuredArticles,
  latestArticles,
  trendingArticles,
  categories,
}: HomeMagazineTemplateProps) {
  const t = useTranslations();

  const mainFeatured = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 3);
  const gridArticles = featuredArticles.slice(3, 7);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      {/* Breaking News */}
      {trendingArticles.length > 0 && (
        <BreakingNews articles={trendingArticles.slice(0, 5)} />
      )}

      <main className="flex-1">
        {/* Magazine Hero Section */}
        <section className="relative bg-gray-900">
          {/* Main Featured Article - Full Width */}
          {mainFeatured && (
            <div className="relative h-[70vh] min-h-[500px]">
              <Image
                src={mainFeatured.coverImageUrl || 'https://placehold.co/1920x1080/1a365d/ffffff?text=Featured'}
                alt={mainFeatured.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-7xl mx-auto">
                  {mainFeatured.categories?.[0] && (
                    <Link
                      href={`/category/${mainFeatured.categories[0].slug}`}
                      className="inline-block bg-primary text-white px-4 py-1.5 text-sm font-bold rounded mb-4 hover:bg-primary/90 transition-colors"
                    >
                      {mainFeatured.categories[0].nameAr || mainFeatured.categories[0].name}
                    </Link>
                  )}
                  
                  <Link href={`/article/${mainFeatured.slug}`}>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight hover:text-primary transition-colors">
                      {mainFeatured.title}
                    </h1>
                  </Link>
                  
                  {mainFeatured.excerpt && (
                    <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl line-clamp-2">
                      {mainFeatured.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-6 text-gray-300 text-sm">
                    {mainFeatured.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{getAuthorDisplayName(mainFeatured.author)}</span>
                      </div>
                    )}
                    {mainFeatured.publishedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(mainFeatured.publishedAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                    {mainFeatured.readingTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{mainFeatured.readingTime} دقائق</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Featured Grid */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryFeatured.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group relative h-[300px] rounded-xl overflow-hidden"
                >
                  <Image
                    src={article.coverImageUrl || 'https://placehold.co/800x600/1a365d/ffffff?text=Article'}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {article.categories?.[0] && (
                      <span className="inline-block bg-primary/90 text-white px-3 py-1 text-xs font-bold rounded mb-3">
                        {article.categories[0].nameAr || article.categories[0].name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Content with Sidebar */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-r-4 border-primary pr-4">
                {t('common.latest')}
              </h2>
              
              {/* Grid Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestArticles.slice(0, 8).map((article) => (
                  <article
                    key={article.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <Link href={`/article/${article.slug}`} className="block">
                      <div className="relative h-48">
                        <Image
                          src={article.coverImageUrl || 'https://placehold.co/600x400/1a365d/ffffff?text=Article'}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {article.categories?.[0] && (
                          <span className="absolute top-3 right-3 bg-primary text-white px-3 py-1 text-xs font-bold rounded">
                            {article.categories[0].nameAr || article.categories[0].name}
                          </span>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {article.publishedAt && (
                            <span>{new Date(article.publishedAt).toLocaleDateString('ar-SA')}</span>
                          )}
                          {article.readingTime && (
                            <span>{article.readingTime} دقائق للقراءة</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <MostReadWidget articles={trendingArticles} />
              <NewsletterWidget />
            </aside>
          </div>
        </section>

        {/* Category Sections */}
        {categories.slice(0, 3).map((category, index) => {
          const categoryArticles = latestArticles.filter(
            (article) => article.categories?.some((c) => c.id === category.id)
          );
          
          if (categoryArticles.length < 2) return null;

          const colors = ['blue', 'green', 'red', 'purple'];
          return (
            <CategorySection
              key={category.id}
              categoryName={category.nameAr || category.name}
              categorySlug={category.slug}
              articles={categoryArticles.slice(0, 4)}
              color={colors[index % colors.length]}
            />
          );
        })}

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
