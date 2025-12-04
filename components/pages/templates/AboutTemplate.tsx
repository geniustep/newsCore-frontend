'use client';

import { Page } from '@/lib/api';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  TrendingUp,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface TemplateProps {
  page: Page;
  locale: string;
}

// Mock team data - replace with real data
const teamMembers = [
  {
    name: 'أحمد محمد',
    role: 'المدير التنفيذي',
    image: 'https://placehold.co/300x300/1a365d/ffffff?text=CEO',
    bio: 'خبرة أكثر من 20 عاماً في مجال الإعلام',
  },
  {
    name: 'سارة العلي',
    role: 'رئيس التحرير',
    image: 'https://placehold.co/300x300/2b6cb0/ffffff?text=Editor',
    bio: 'صحفية حائزة على جوائز متعددة',
  },
  {
    name: 'محمد الخالد',
    role: 'مدير التقنية',
    image: 'https://placehold.co/300x300/1a365d/ffffff?text=CTO',
    bio: 'خبير في التحول الرقمي والابتكار',
  },
  {
    name: 'نورة السعيد',
    role: 'مديرة التسويق',
    image: 'https://placehold.co/300x300/2b6cb0/ffffff?text=CMO',
    bio: 'متخصصة في استراتيجيات النمو',
  },
];

const stats = [
  { icon: Users, value: '10M+', label: 'قارئ شهرياً' },
  { icon: Globe, value: '50+', label: 'دولة' },
  { icon: TrendingUp, value: '1000+', label: 'مقال يومياً' },
  { icon: Award, value: '25+', label: 'جائزة' },
];

const values = [
  {
    icon: Shield,
    title: 'المصداقية',
    description: 'نلتزم بأعلى معايير الدقة والموضوعية في نقل الأخبار',
  },
  {
    icon: Zap,
    title: 'السرعة',
    description: 'نوصل الخبر أولاً مع الحفاظ على جودة المحتوى',
  },
  {
    icon: Eye,
    title: 'الشفافية',
    description: 'نعمل بشفافية كاملة مع قرائنا وشركائنا',
  },
  {
    icon: Target,
    title: 'الابتكار',
    description: 'نستخدم أحدث التقنيات لتقديم تجربة إخبارية متميزة',
  },
];

export default function AboutTemplate({ page }: TemplateProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{page.title}</h1>
          {page.excerpt && (
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {page.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 py-12 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              قصتنا
            </h2>
            <div
              className="prose prose-lg dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: page.contentHtml || page.content }}
            />
          </div>
          {page.featuredImageUrl && (
            <div className="relative">
              <img
                src={page.featuredImageUrl}
                alt={page.featuredImageAlt || page.title}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-500 rounded-2xl -z-10" />
            </div>
          )}
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
            <p className="text-white/90 leading-relaxed">
              أن نكون المصدر الأول والأكثر موثوقية للأخبار في العالم العربي،
              ونقدم تجربة إخبارية رقمية متكاملة تلبي احتياجات القارئ العصري.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">رسالتنا</h3>
            <p className="text-white/90 leading-relaxed">
              نقل الحقيقة بمهنية وموضوعية، وتمكين القراء من اتخاذ قرارات مستنيرة
              من خلال محتوى إخباري عالي الجودة ومتعدد الوسائط.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            قيمنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            فريق القيادة
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            فريق من الخبراء والمتخصصين يقودون رؤيتنا نحو التميز
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">انضم إلى فريقنا</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            نبحث دائماً عن المواهب المتميزة للانضمام إلى فريقنا المتنامي
          </p>
          <Link
            href="/page/careers"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            استعرض الوظائف المتاحة
          </Link>
        </div>
      </div>

      {/* Child Pages */}
      {page.children && page.children.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              صفحات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {page.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/page/${child.slug}`}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                    {child.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

