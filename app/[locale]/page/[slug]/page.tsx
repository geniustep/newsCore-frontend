import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { pagesApi, Page } from '@/lib/api';
import { locales } from '@/i18n/config';
import DefaultTemplate from '@/components/pages/templates/DefaultTemplate';
import FullWidthTemplate from '@/components/pages/templates/FullWidthTemplate';
import SidebarTemplate from '@/components/pages/templates/SidebarTemplate';
import ContactTemplate from '@/components/pages/templates/ContactTemplate';
import AboutTemplate from '@/components/pages/templates/AboutTemplate';
import LandingTemplate from '@/components/pages/templates/LandingTemplate';
import PreviewBanner from '@/components/pages/PreviewBanner';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata
export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  try {
    const page = await pagesApi.getBySlug(slug, locale);
    
    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.excerpt,
      keywords: page.seo?.keywords?.join(', '),
      openGraph: {
        title: page.seo?.title || page.title,
        description: page.seo?.description || page.excerpt,
        images: page.featuredImageUrl ? [page.featuredImageUrl] : [],
        type: 'website',
      },
      alternates: {
        canonical: page.seo?.canonicalUrl,
      },
    };
  } catch {
    return {
      title: 'الصفحة غير موجودة',
    };
  }
}

// Template selector component
function PageTemplate({ page, locale }: { page: Page; locale: string }) {
  const templateProps = { page, locale };

  switch (page.template) {
    case 'full-width':
      return <FullWidthTemplate {...templateProps} />;
    case 'sidebar':
      return <SidebarTemplate {...templateProps} />;
    case 'contact':
      return <ContactTemplate {...templateProps} />;
    case 'about':
      return <AboutTemplate {...templateProps} />;
    case 'landing':
      return <LandingTemplate {...templateProps} />;
    default:
      return <DefaultTemplate {...templateProps} />;
  }
}

export default async function PageView({
  params: { slug, locale },
  searchParams,
}: {
  params: { slug: string; locale: string };
  searchParams: { preview?: string };
}) {
  setRequestLocale(locale);
  await getTranslations();

  const isPreview = searchParams.preview === 'true';

  try {
    const page = await pagesApi.getBySlug(slug, locale, isPreview);

    // Allow viewing if published OR if in preview mode
    if (!page || (!isPreview && page.status !== 'PUBLISHED')) {
      notFound();
    }

    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Preview Banner for non-published pages */}
        {page.status !== 'PUBLISHED' && <PreviewBanner status={page.status} />}
        
        <Header />
        
        <main className="flex-1">
          <PageTemplate page={page} locale={locale} />
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
}

