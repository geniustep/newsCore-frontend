'use client';

import { useState } from 'react';
import { Page } from '@/lib/api';
import { 
  CheckCircle, 
  ArrowLeft,
  Star,
  Play,
  Zap,
  Shield,
  Clock,
  Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TemplateProps {
  page: Page;
  locale: string;
}

const features = [
  {
    icon: Zap,
    title: 'سريع وموثوق',
    description: 'أخبار فورية من مصادر موثوقة حول العالم',
  },
  {
    icon: Shield,
    title: 'محتوى آمن',
    description: 'محتوى مُراجع ومُدقق من فريق تحريري محترف',
  },
  {
    icon: Clock,
    title: 'تحديث مستمر',
    description: 'تغطية إخبارية على مدار الساعة',
  },
  {
    icon: Users,
    title: 'مجتمع نشط',
    description: 'انضم لملايين القراء حول العالم',
  },
];

const testimonials = [
  {
    name: 'أحمد الراشد',
    role: 'رجل أعمال',
    content: 'أفضل مصدر للأخبار الاقتصادية والمالية. أعتمد عليه يومياً في قراراتي.',
    avatar: 'https://placehold.co/100x100/1a365d/ffffff?text=AR',
    rating: 5,
  },
  {
    name: 'نورة السعيد',
    role: 'أكاديمية',
    content: 'تغطية شاملة ومتوازنة للأحداث. أنصح به لكل من يبحث عن الحقيقة.',
    avatar: 'https://placehold.co/100x100/2b6cb0/ffffff?text=NS',
    rating: 5,
  },
  {
    name: 'محمد العمري',
    role: 'صحفي',
    content: 'منصة احترافية بمعايير عالمية. فخور بأن أكون من متابعيها.',
    avatar: 'https://placehold.co/100x100/1a365d/ffffff?text=MA',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'مجاني',
    price: '0',
    period: 'للأبد',
    features: [
      'الوصول للأخبار العاجلة',
      '10 مقالات يومياً',
      'النشرة الإخبارية الأسبوعية',
      'تطبيق الهاتف',
    ],
    cta: 'ابدأ مجاناً',
    highlighted: false,
  },
  {
    name: 'بريميوم',
    price: '29',
    period: 'شهرياً',
    features: [
      'وصول غير محدود',
      'بدون إعلانات',
      'التحليلات الحصرية',
      'البودكاست الخاص',
      'النشرة اليومية',
      'دعم أولوية',
    ],
    cta: 'اشترك الآن',
    highlighted: true,
  },
  {
    name: 'مؤسسات',
    price: '99',
    period: 'شهرياً',
    features: [
      'كل مميزات بريميوم',
      'حسابات متعددة',
      'API للتكامل',
      'تقارير مخصصة',
      'مدير حساب مخصص',
      'تدريب الفريق',
    ],
    cta: 'تواصل معنا',
    highlighted: false,
  },
];

export default function LandingTemplate({ page }: TemplateProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2),transparent_50%)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>أكثر من 10 مليون قارئ شهرياً</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {page.title}
              </h1>
              
              {page.excerpt && (
                <p className="text-xl text-white/80 mb-8 leading-relaxed">
                  {page.excerpt}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold transition-colors"
                >
                  ابدأ الآن مجاناً
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold transition-colors">
                  <Play className="w-5 h-5" />
                  شاهد الفيديو
                </button>
              </div>
            </div>
            
            {page.featuredImageUrl && (
              <div className="relative aspect-video">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
                <Image
                  src={page.featuredImageUrl}
                  alt={page.featuredImageAlt || page.title}
                  fill
                  className="relative rounded-3xl shadow-2xl object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              لماذا تختارنا؟
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              نقدم لك تجربة إخبارية فريدة تجمع بين السرعة والدقة والشمولية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {page.content && (
        <div className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-4xl mx-auto px-4">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.contentHtml || page.content }}
            />
          </div>
        </div>
      )}

      {/* Testimonials */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ماذا يقول قراؤنا
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              خطط الاشتراك
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              اختر الخطة المناسبة لاحتياجاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl scale-105'
                    : 'bg-white dark:bg-gray-800 shadow-lg'
                }`}
              >
                <h3 className={`text-xl font-bold mb-2 ${
                  plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${
                    plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={plan.highlighted ? 'text-white/80' : 'text-gray-500'}>
                    {' '}ر.س / {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${
                        plan.highlighted ? 'text-white' : 'text-primary-600'
                      }`} />
                      <span className={plan.highlighted ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-bold transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ابق على اطلاع دائم
          </h2>
          <p className="text-xl text-white/90 mb-8">
            اشترك في نشرتنا الإخبارية واحصل على أهم الأخبار مباشرة في بريدك
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle subscription
            }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              اشترك الآن
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

