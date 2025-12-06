/**
 * NewsCore - Home Page (Template Engine Version)
 * الصفحة الرئيسية - نسخة محرك القوالب
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TemplateRenderer } from '@/components/template-engine';
import { getTemplateForPage } from '@/lib/template-engine/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'الصفحة الرئيسية | NewsCore',
    description: 'أحدث الأخبار والتحليلات',
  };
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  await getTranslations();

  // جلب القالب المخصص للصفحة الرئيسية
  // يمكن أن يأتي من:
  // 1. API (قاعدة البيانات)
  // 2. ملف JSON محلي
  // 3. قالب افتراضي
  const template = await getTemplateForPage('home', locale);

  if (!template) {
    // Fallback إلى القالب الافتراضي
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">لا يوجد قالب</h2>
            <p className="text-gray-600">يرجى إنشاء قالب للصفحة الرئيسية من Builder</p>
            <a 
              href="/ar/admin/builder" 
              className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-lg"
            >
              فتح Builder
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
      <main className="flex-1">
        {/* Template Engine يتولى كل شيء */}
        <TemplateRenderer 
          template={template}
          pageData={{
            locale,
            pageType: 'home',
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
