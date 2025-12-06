/**
 * NewsCore - Template Preview Page
 * صفحة معاينة القالب
 */

import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PreviewClient from './PreviewClient';

export const dynamic = 'force-dynamic';

interface PreviewPageProps {
  params: {
    locale: string;
    templateId: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `معاينة القالب | NewsCore`,
    description: 'معاينة القالب قبل النشر',
  };
}

export default async function PreviewPage({ params: { locale, templateId } }: PreviewPageProps) {
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Preview Banner */}
      <div className="bg-amber-500 text-black px-4 py-2 text-center text-sm font-medium">
        <span>🔍 وضع المعاينة - </span>
        <span>هذه معاينة للقالب ولن تظهر للزوار</span>
        <a 
          href={`/${locale}/admin/builder?template=${templateId}`}
          className="mr-4 underline hover:no-underline"
        >
          تعديل في Builder
        </a>
      </div>

      <Header />
      
      <main className="flex-1">
        <PreviewClient templateId={templateId} locale={locale} />
      </main>

      <Footer />
    </div>
  );
}
