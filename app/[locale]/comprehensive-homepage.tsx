import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BreakingNews from '@/components/articles/BreakingNews';
import HeroSection from '@/components/homepage/HeroSection';
import VideoSection from '@/components/homepage/VideoSection';
import CategorySection from '@/components/homepage/CategorySection';
import { MostReadWidget, NewsletterWidget, PollWidget } from '@/components/homepage/SidebarWidgets';
import OpinionSection from '@/components/homepage/OpinionSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import PhotoGallery from '@/components/homepage/PhotoGallery';
import PodcastSection from '@/components/homepage/PodcastSection';
import LiveSection from '@/components/homepage/LiveSection';
import PartnersSection from '@/components/homepage/PartnersSection';
import SocialHub from '@/components/homepage/SocialHub';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import AppsSection from '@/components/homepage/AppsSection';
import { BackToTop, ChatWidget, CookieNotice } from '@/components/homepage/FloatingElements';
import ArticleGrid from '@/components/articles/ArticleGrid';
import { articlesApi } from '@/lib/api';
import { locales } from '@/i18n/config';
import { Newspaper, DollarSign, Trophy, Cpu } from 'lucide-react';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ComprehensiveHomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations();

  try {
    // Fetch data
    const [featuredArticles, latestArticles, trendingArticles] = await Promise.all([
      articlesApi.getFeatured(6).catch(() => []),
      articlesApi.getPublic({ page: 1, limit: 12 }).catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } })),
      articlesApi.getTrending(10).catch(() => []),
    ]);

    const mainFeatured = featuredArticles[0];
    const sideArticles = featuredArticles.slice(1, 5);

    // Mock data for sections (replace with real API calls)
    const mockVideos = [
      {
        id: '1',
        title: 'أهم أخبار اليوم',
        thumbnail: 'https://placehold.co/1280x720/1a365d/ffffff?text=Video+1',
        duration: '5:30',
        url: '#',
        views: 1250,
      },
      {
        id: '2',
        title: 'تحليل الأحداث الاقتصادية',
        thumbnail: 'https://placehold.co/1280x720/2b6cb0/ffffff?text=Video+2',
        duration: '8:15',
        url: '#',
        views: 890,
      },
      {
        id: '3',
        title: 'لقاء خاص مع الخبراء',
        thumbnail: 'https://placehold.co/1280x720/1a365d/ffffff?text=Video+3',
        duration: '12:45',
        url: '#',
        views: 2100,
      },
    ];

    const mockOpinions = [
      {
        id: '1',
        title: 'التحديات الاقتصادية في العالم العربي',
        excerpt: 'تحليل معمق للوضع الاقتصادي الحالي والتوقعات المستقبلية',
        slug: 'economic-challenges',
        author: {
          id: '1',
          name: 'د. محمد الأحمد',
          avatar: 'https://placehold.co/100x100/1a365d/ffffff?text=MA',
          title: 'خبير اقتصادي',
        },
      },
      {
        id: '2',
        title: 'مستقبل التقنية والذكاء الاصطناعي',
        excerpt: 'نظرة على كيفية تأثير التقنية على حياتنا اليومية',
        slug: 'tech-future',
        author: {
          id: '2',
          name: 'سارة العلي',
          avatar: 'https://placehold.co/100x100/2b6cb0/ffffff?text=SA',
          title: 'كاتبة تقنية',
        },
      },
      {
        id: '3',
        title: 'السياسة الدولية والتحولات الجديدة',
        excerpt: 'قراءة في المشهد السياسي العالمي',
        slug: 'politics',
        author: {
          id: '3',
          name: 'أحمد السالم',
          avatar: 'https://placehold.co/100x100/1a365d/ffffff?text=AS',
          title: 'محلل سياسي',
        },
      },
    ];

    const mockFeatures = [
      {
        id: '1',
        title: 'تحقيق استقصائي: الفساد في القطاع العام',
        excerpt: 'تقرير مفصل يكشف عن حالات فساد وسوء استخدام للسلطة في عدة قطاعات حكومية',
        image: 'https://placehold.co/1200x675/c53030/ffffff?text=Investigation',
        slug: 'corruption-investigation',
        author: { name: 'فريق التحقيقات' },
        readTime: 15,
        type: 'investigation' as const,
      },
      {
        id: '2',
        title: 'تقرير خاص: مستقبل الطاقة المتجددة',
        excerpt: 'دراسة شاملة حول مشاريع الطاقة المتجددة وتأثيرها على الاقتصاد والبيئة',
        image: 'https://placehold.co/1200x675/2b6cb0/ffffff?text=Report',
        slug: 'renewable-energy',
        author: { name: 'قسم التقارير الخاصة' },
        readTime: 12,
        type: 'report' as const,
      },
    ];

    const mockGalleries = [
      {
        id: '1',
        title: 'صور من قمة المناخ',
        photos: [
          { id: '1', url: 'https://placehold.co/600x600/1a365d/ffffff?text=Photo+1', title: 'افتتاح القمة' },
          { id: '2', url: 'https://placehold.co/600x600/2b6cb0/ffffff?text=Photo+2', title: 'الجلسة الرئيسية' },
          { id: '3', url: 'https://placehold.co/600x600/1a365d/ffffff?text=Photo+3', title: 'المشاركون' },
          { id: '4', url: 'https://placehold.co/600x600/2b6cb0/ffffff?text=Photo+4', title: 'العروض' },
          { id: '5', url: 'https://placehold.co/600x600/1a365d/ffffff?text=Photo+5', title: 'الختام' },
          { id: '6', url: 'https://placehold.co/600x600/2b6cb0/ffffff?text=Photo+6', title: 'بيان ختامي' },
        ],
      },
    ];

    const mockPodcast = {
      cover: 'https://placehold.co/500x500/1a365d/ffffff?text=Podcast',
      title: 'بودكاست الأخبار اليومي',
      description: 'حلقات يومية تغطي أهم الأحداث والتحليلات',
      episodes: [
        { id: '1', title: 'الحلقة 45: التطورات الاقتصادية', duration: '25:30', publishDate: '2024-12-04', audioUrl: '#' },
        { id: '2', title: 'الحلقة 44: المشهد السياسي', duration: '30:15', publishDate: '2024-12-03', audioUrl: '#' },
        { id: '3', title: 'الحلقة 43: الابتكار التقني', duration: '28:45', publishDate: '2024-12-02', audioUrl: '#' },
      ],
    };

    const mockPartners = [
      { id: '1', name: 'Reuters', logo: 'https://placehold.co/200x80/ffffff/000000?text=Reuters', url: '#' },
      { id: '2', name: 'AFP', logo: 'https://placehold.co/200x80/ffffff/000000?text=AFP', url: '#' },
      { id: '3', name: 'AP', logo: 'https://placehold.co/200x80/ffffff/000000?text=AP', url: '#' },
      { id: '4', name: 'Bloomberg', logo: 'https://placehold.co/200x80/ffffff/000000?text=Bloomberg', url: '#' },
      { id: '5', name: 'Al Jazeera', logo: 'https://placehold.co/200x80/ffffff/000000?text=Al+Jazeera', url: '#' },
      { id: '6', name: 'BBC', logo: 'https://placehold.co/200x80/ffffff/000000?text=BBC', url: '#' },
    ];

    const mockPoll = {
      question: 'ما رأيك في الأداء الاقتصادي الحالي؟',
      options: [
        { id: '1', text: 'ممتاز', votes: 150 },
        { id: '2', text: 'جيد', votes: 320 },
        { id: '3', text: 'متوسط', votes: 280 },
        { id: '4', text: 'ضعيف', votes: 90 },
      ],
    };

    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        {/* Breaking News */}
        {trendingArticles.length > 0 && (
          <BreakingNews articles={trendingArticles.slice(0, 5)} />
        )}

        <main className="flex-1">
          {/* Hero Section */}
          {mainFeatured && (
            <HeroSection
              mainArticle={mainFeatured}
              sideArticles={sideArticles}
              layout="classic"
            />
          )}

          {/* Latest News with Sidebar */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-6">{t('common.latest')}</h2>
                {latestArticles.data.length > 0 ? (
                  <ArticleGrid articles={latestArticles.data} columns={3} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {t('search.noResults')}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <MostReadWidget articles={trendingArticles} />
                <NewsletterWidget />
                <PollWidget question={mockPoll.question} options={mockPoll.options} />
              </aside>
            </div>
          </section>

          {/* Video Section */}
          <VideoSection videos={mockVideos} />

          {/* Category Sections */}
          {latestArticles.data.length >= 4 && (
            <>
              <CategorySection
                categoryName="سياسة"
                categorySlug="politics"
                articles={latestArticles.data.slice(0, 4)}
                color="blue"
                icon={<Newspaper className="w-8 h-8" />}
              />

              <CategorySection
                categoryName="اقتصاد"
                categorySlug="economy"
                articles={latestArticles.data.slice(4, 8)}
                color="green"
                icon={<DollarSign className="w-8 h-8" />}
              />

              <CategorySection
                categoryName="رياضة"
                categorySlug="sports"
                articles={latestArticles.data.slice(0, 4)}
                color="red"
                icon={<Trophy className="w-8 h-8" />}
              />

              <CategorySection
                categoryName="تقنية"
                categorySlug="technology"
                articles={latestArticles.data.slice(4, 8)}
                color="purple"
                icon={<Cpu className="w-8 h-8" />}
              />
            </>
          )}

          {/* Opinion Section */}
          <OpinionSection articles={mockOpinions} />

          {/* Features/Reports Section */}
          <FeaturesSection features={mockFeatures} />

          {/* Photo Gallery */}
          <PhotoGallery galleries={mockGalleries} />

          {/* Podcast Section */}
          <PodcastSection
            cover={mockPodcast.cover}
            title={mockPodcast.title}
            description={mockPodcast.description}
            episodes={mockPodcast.episodes}
          />

          {/* Live Section */}
          <LiveSection
            isLive={false}
            liveTitle="البث المباشر"
            liveUrl="#"
            upcomingEvents={[]}
          />

          {/* Partners Section */}
          <PartnersSection partners={mockPartners} />

          {/* Social Hub */}
          <SocialHub />

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Apps Section */}
          <AppsSection />
        </main>

        <Footer />

        {/* Floating Elements */}
        <BackToTop />
        <ChatWidget />
        <CookieNotice />
      </div>
    );
  } catch (error) {
    console.error('Error loading comprehensive home page:', error);
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
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
