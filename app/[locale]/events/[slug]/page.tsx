/**
 * NewsCore - Event Page
 * صفحة الفعاليات الخاصة
 */

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TemplateRenderer } from '@/components/template-engine';
import { getTemplateById, getTemplateForPage } from '@/lib/template-engine/api';
import type { Template } from '@/lib/template-engine/types';

export const dynamic = 'force-dynamic';

interface EventPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function EventPage({ params: { locale, slug } }: EventPageProps) {
  setRequestLocale(locale);

  // 1. جلب بيانات الفعالية من API
  const eventData = await fetchEventData(slug);
  
  if (!eventData) {
    notFound();
  }

  // 2. جلب القالب المخصص للفعالية، أو القالب الافتراضي
  let template = eventData.templateId 
    ? await getTemplateById(eventData.templateId)
    : await getTemplateForPage('custom', locale);

  if (!template) {
    template = await getTemplateForPage('home', locale);
  }

  // 3. تمرير بيانات الفعالية للـ Template
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      
      <main className="flex-1">
        <TemplateRenderer 
          template={template!}
          pageData={{
            locale,
            pageType: 'event',
            event: eventData,
            // يمكن تمرير أي بيانات إضافية
            categoryId: eventData.categoryId,
            tagIds: eventData.tags,
          }}
        />
      </main>

      <Footer />
    </div>
  );
}

// دالة وهمية لجلب بيانات الفعالية
async function fetchEventData(slug: string) {
  // في الواقع، هذا سيأتي من API
  return {
    id: slug,
    title: 'فعالية خاصة',
    description: 'وصف الفعالية',
    templateId: null, // أو ID قالب مخصص
    categoryId: 'events',
    tags: ['special', 'live'],
    startDate: new Date(),
    endDate: new Date(),
  };
}
