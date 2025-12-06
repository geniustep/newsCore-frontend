# 📚 دليل تطوير القوالب لنظام NewsCore

هذا الدليل موجه للمبرمجين والمصممين الذين يريدون إنشاء قوالب جديدة لنظام NewsCore.

---

## 📋 المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [هيكل القالب](#هيكل-القالب)
3. [ملف theme.json](#ملف-themejson)
4. [إنشاء القوالب (Templates)](#إنشاء-القوالب-templates)
5. [المكونات المتاحة](#المكونات-المتاحة)
6. [نظام التخصيص (Customizer)](#نظام-التخصيص-customizer)
7. [دعم اللغات (i18n)](#دعم-اللغات-i18n)
8. [الوضع الداكن](#الوضع-الداكن)
9. [أفضل الممارسات](#أفضل-الممارسات)
10. [تسجيل القالب](#تسجيل-القالب)
11. [أمثلة عملية](#أمثلة-عملية)

---

## 🌟 نظرة عامة

نظام القوالب في NewsCore مبني على:

- **Next.js 14** - إطار عمل React للـ SSR و SSG
- **Tailwind CSS** - للتصميم
- **TypeScript** - للكتابة الآمنة
- **next-intl** - لدعم تعدد اللغات

### المتطلبات الأساسية

- Node.js 18+
- معرفة بـ React و TypeScript
- معرفة بـ Tailwind CSS
- فهم أساسي لـ Next.js App Router

---

## 📁 هيكل القالب

```
themes/
└── your-theme-name/
    ├── theme.json              # ملف التكوين الرئيسي (مطلوب)
    ├── README.md               # توثيق القالب
    ├── preview.png             # صورة معاينة القالب (800x600)
    │
    ├── templates/              # قوالب الصفحات
    │   ├── index.ts            # تصدير القوالب
    │   ├── home-default.tsx    # الصفحة الرئيسية
    │   ├── home-magazine.tsx   # تخطيط بديل
    │   ├── article-default.tsx # صفحة المقال
    │   ├── article-full.tsx    # مقال بعرض كامل
    │   ├── category.tsx        # صفحة التصنيف
    │   ├── page-default.tsx    # صفحة ثابتة
    │   ├── search.tsx          # نتائج البحث
    │   └── error-404.tsx       # صفحة الخطأ
    │
    ├── components/             # مكونات خاصة بالقالب (اختياري)
    │   ├── CustomHeader.tsx
    │   ├── CustomFooter.tsx
    │   └── ...
    │
    ├── styles/                 # أنماط إضافية (اختياري)
    │   └── custom.css
    │
    ├── screenshots/            # لقطات شاشة للقالب
    │   ├── home.png
    │   ├── article.png
    │   └── dark-mode.png
    │
    └── previews/               # معاينات القوالب الفرعية
        ├── home-default.png
        └── home-magazine.png
```

---

## ⚙️ ملف theme.json

هذا الملف الأساسي الذي يعرّف القالب للنظام.

### البنية الأساسية

```json
{
  "id": "your-theme-id",
  "name": "Your Theme Name",
  "nameAr": "اسم القالب بالعربية",
  "version": "1.0.0",
  "author": "Your Name",
  "authorUrl": "https://yourwebsite.com",
  "description": "Theme description in English",
  "descriptionAr": "وصف القالب بالعربية",
  "previewImage": "/themes/your-theme/preview.png",
  "screenshots": [
    "/themes/your-theme/screenshots/home.png",
    "/themes/your-theme/screenshots/article.png"
  ],
  
  "features": [...],
  "templates": [...],
  "regions": [...],
  "components": [...],
  "customizer": {...},
  
  "supportedLanguages": ["ar", "en", "fr"],
  "defaultLanguage": "ar",
  "direction": "rtl",
  
  "minCoreVersion": "1.0.0",
  "requiredModules": []
}
```

### الميزات (features)

قائمة الميزات التي يدعمها القالب:

```json
{
  "features": [
    "articles",           // دعم المقالات
    "pages",              // دعم الصفحات الثابتة
    "categories",         // دعم التصنيفات
    "tags",               // دعم الوسوم
    "menus",              // دعم القوائم
    "mega-menu",          // القوائم الكبيرة
    "widgets",            // الودجات
    "breaking-news",      // الأخبار العاجلة
    "search",             // البحث
    "dark-mode",          // الوضع الداكن
    "rtl",                // دعم RTL
    "multi-language",     // تعدد اللغات
    "seo-optimized",      // تحسين SEO
    "responsive",         // تصميم متجاوب
    "video-section",      // قسم الفيديو
    "podcast-section",    // قسم البودكاست
    "live-streaming",     // البث المباشر
    "photo-gallery",      // معرض الصور
    "opinion-section",    // قسم الرأي
    "newsletter",         // النشرة الإخبارية
    "social-hub",         // التواصل الاجتماعي
    "weather-widget",     // ودجة الطقس
    "currency-ticker",    // شريط العملات
    "accessibility"       // إمكانية الوصول
  ]
}
```

### القوالب (templates)

```json
{
  "templates": [
    {
      "id": "home-default",
      "name": "Default Home",
      "nameAr": "الرئيسية الافتراضية",
      "description": "Standard homepage layout",
      "descriptionAr": "تخطيط الصفحة الرئيسية القياسي",
      "file": "templates/home-default.tsx",
      "type": "home",
      "isDefault": true,
      "preview": "/themes/your-theme/previews/home-default.png"
    },
    {
      "id": "article-default",
      "name": "Default Article",
      "nameAr": "المقال الافتراضي",
      "file": "templates/article-default.tsx",
      "type": "article",
      "isDefault": true
    }
  ]
}
```

#### أنواع القوالب (type)

| النوع | الوصف |
|-------|-------|
| `home` | الصفحة الرئيسية |
| `article` | صفحة المقال |
| `category` | صفحة التصنيف |
| `tag` | صفحة الوسم |
| `page` | صفحة ثابتة |
| `search` | نتائج البحث |
| `author` | صفحة الكاتب |
| `error` | صفحات الأخطاء |

### المناطق (regions)

المناطق هي أماكن يمكن إضافة الودجات إليها:

```json
{
  "regions": [
    {
      "id": "header",
      "name": "Header",
      "nameAr": "الترويسة",
      "description": "Main header area",
      "type": "header"
    },
    {
      "id": "sidebar-right",
      "name": "Right Sidebar",
      "nameAr": "الشريط الجانبي الأيمن",
      "type": "sidebar",
      "maxWidgets": 10
    },
    {
      "id": "footer-widgets",
      "name": "Footer Widgets",
      "nameAr": "ودجات التذييل",
      "type": "widget-area",
      "maxWidgets": 4
    },
    {
      "id": "footer",
      "name": "Footer",
      "nameAr": "التذييل",
      "type": "footer"
    }
  ]
}
```

#### أنواع المناطق (type)

| النوع | الوصف |
|-------|-------|
| `header` | منطقة الترويسة |
| `footer` | منطقة التذييل |
| `sidebar` | شريط جانبي |
| `widget-area` | منطقة ودجات عامة |

---

## 🎨 إنشاء القوالب (Templates)

### قالب الصفحة الرئيسية

```tsx
// templates/home-default.tsx
'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/homepage/HeroSection';
import ArticleGrid from '@/components/articles/ArticleGrid';
import { MostReadWidget, NewsletterWidget } from '@/components/homepage/SidebarWidgets';
import type { Article, Category } from '@/lib/api/types';

interface HomeTemplateProps {
  featuredArticles: Article[];
  latestArticles: Article[];
  trendingArticles: Article[];
  categories: Category[];
}

export default function HomeTemplate({
  featuredArticles,
  latestArticles,
  trendingArticles,
  categories,
}: HomeTemplateProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          mainArticle={featuredArticles[0]}
          sideArticles={featuredArticles.slice(1, 5)}
          layout="classic"
        />

        {/* Content with Sidebar */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                {t('common.latest')}
              </h2>
              <ArticleGrid articles={latestArticles} columns={3} />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <MostReadWidget articles={trendingArticles} />
              <NewsletterWidget />
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

### قالب صفحة المقال

```tsx
// templates/article-default.tsx
'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MostReadWidget } from '@/components/homepage/SidebarWidgets';
import { Calendar, Clock, User, Share2 } from 'lucide-react';
import type { Article } from '@/lib/api/types';

interface ArticleTemplateProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleTemplate({
  article,
  relatedArticles,
}: ArticleTemplateProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Article Header */}
          <header className="mb-8">
            {/* Categories */}
            {article.categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="inline-block bg-primary text-white px-3 py-1 text-sm rounded mb-4 mr-2"
              >
                {cat.nameAr || cat.name}
              </Link>
            ))}

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              {article.author && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author.displayName}
                </span>
              )}
              {article.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString('ar-SA')}
                </span>
              )}
              {article.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readingTime} دقائق
                </span>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {article.coverImageUrl && (
            <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.contentHtml || article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t dark:border-gray-700">
              <h3 className="font-bold mb-4">{t('article.tags')}:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
                    #{tag.nameAr || tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-800 py-12">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="text-2xl font-bold mb-8">{t('article.related')}</h3>
              {/* Render related articles */}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
```

### ملف تصدير القوالب

```tsx
// templates/index.ts
export { default as HomeDefaultTemplate } from './home-default';
export { default as HomeMagazineTemplate } from './home-magazine';
export { default as ArticleDefaultTemplate } from './article-default';
export { default as ArticleFullTemplate } from './article-full';
export { default as CategoryTemplate } from './category';
export { default as SearchTemplate } from './search';
export { default as Error404Template } from './error-404';

// Types
export type TemplateType = 'home' | 'article' | 'category' | 'page' | 'search' | 'error';

export interface Template {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  file: string;
  type: TemplateType;
  isDefault?: boolean;
}

// Template registry
export const templates: Template[] = [
  {
    id: 'home-default',
    name: 'Default Home',
    nameAr: 'الرئيسية الافتراضية',
    description: 'Standard homepage layout',
    file: 'templates/home-default.tsx',
    type: 'home',
    isDefault: true,
  },
  // ... more templates
];

// Helper functions
export function getTemplate(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByType(type: TemplateType): Template[] {
  return templates.filter(t => t.type === type);
}

export function getDefaultTemplate(type: TemplateType): Template | undefined {
  return templates.find(t => t.type === type && t.isDefault);
}
```

---

## 🧩 المكونات المتاحة

### مكونات التخطيط (Layout)

```tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
```

### مكونات المقالات

```tsx
import ArticleCard from '@/components/articles/ArticleCard';
import ArticleGrid from '@/components/articles/ArticleGrid';
import ArticleList from '@/components/articles/ArticleList';
import FeaturedArticle from '@/components/articles/FeaturedArticle';
import BreakingNews from '@/components/articles/BreakingNews';
```

### مكونات الصفحة الرئيسية

```tsx
import HeroSection from '@/components/homepage/HeroSection';
import VideoSection from '@/components/homepage/VideoSection';
import CategorySection from '@/components/homepage/CategorySection';
import OpinionSection from '@/components/homepage/OpinionSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import PhotoGallery from '@/components/homepage/PhotoGallery';
import PodcastSection from '@/components/homepage/PodcastSection';
import LiveSection from '@/components/homepage/LiveSection';
import PartnersSection from '@/components/homepage/PartnersSection';
import SocialHub from '@/components/homepage/SocialHub';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import AppsSection from '@/components/homepage/AppsSection';
```

### الودجات (Widgets)

```tsx
import { 
  MostReadWidget, 
  NewsletterWidget, 
  PollWidget 
} from '@/components/homepage/SidebarWidgets';
import WeatherWidget from '@/components/homepage/WeatherWidget';
import CurrencyTicker from '@/components/homepage/CurrencyTicker';
```

### العناصر العائمة

```tsx
import { 
  BackToTop, 
  ChatWidget, 
  CookieNotice 
} from '@/components/homepage/FloatingElements';
```

### القوائم

```tsx
import MegaMenu from '@/components/menus/MegaMenu';
import MenuRenderer from '@/components/menus/MenuRenderer';
```

---

## 🎛️ نظام التخصيص (Customizer)

### تعريف حقول التخصيص

```json
{
  "customizer": {
    "sections": [
      {
        "id": "colors",
        "title": "Colors",
        "titleAr": "الألوان",
        "description": "Customize site colors",
        "descriptionAr": "تخصيص ألوان الموقع",
        "icon": "Palette",
        "fields": [
          {
            "id": "primaryColor",
            "type": "color",
            "label": "Primary Color",
            "labelAr": "اللون الأساسي",
            "description": "Main brand color",
            "default": "#ed7520"
          },
          {
            "id": "fontFamily",
            "type": "select",
            "label": "Font Family",
            "labelAr": "نوع الخط",
            "default": "Cairo",
            "options": [
              { "value": "Cairo", "label": "Cairo" },
              { "value": "Tajawal", "label": "Tajawal" },
              { "value": "Almarai", "label": "Almarai" }
            ]
          },
          {
            "id": "stickyHeader",
            "type": "toggle",
            "label": "Sticky Header",
            "labelAr": "ترويسة ثابتة",
            "default": true
          },
          {
            "id": "articlesPerPage",
            "type": "number",
            "label": "Articles per Page",
            "labelAr": "المقالات لكل صفحة",
            "default": 12,
            "min": 6,
            "max": 24
          },
          {
            "id": "siteLogo",
            "type": "image",
            "label": "Site Logo",
            "labelAr": "شعار الموقع",
            "default": "/logo.svg"
          },
          {
            "id": "copyrightText",
            "type": "text",
            "label": "Copyright Text",
            "labelAr": "نص حقوق النشر",
            "default": "© 2024 All rights reserved."
          }
        ]
      }
    ]
  }
}
```

### أنواع الحقول

| النوع | الوصف | الخصائص |
|-------|-------|---------|
| `color` | منتقي الألوان | `default` |
| `text` | حقل نصي | `default`, `placeholder` |
| `textarea` | منطقة نصية | `default`, `rows` |
| `number` | حقل رقمي | `default`, `min`, `max`, `step` |
| `select` | قائمة منسدلة | `default`, `options` |
| `toggle` | مفتاح تشغيل/إيقاف | `default` |
| `image` | رفع صورة | `default` |
| `font` | اختيار خط | `default`, `options` |

### استخدام الإعدادات في القالب

```tsx
// استيراد الإعدادات من الـ API أو Context
import { useThemeSettings } from '@/hooks/useThemeSettings';

export default function MyComponent() {
  const settings = useThemeSettings();
  
  return (
    <div 
      style={{ 
        '--primary-color': settings.primaryColor,
        fontFamily: settings.fontFamily,
      }}
    >
      {settings.showNewsletter && <NewsletterWidget />}
    </div>
  );
}
```

---

## 🌍 دعم اللغات (i18n)

### استخدام الترجمات

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('common.latest')}</h1>
      <p>{t('article.readMore')}</p>
      <span>{t('common.minutes', { count: 5 })}</span>
    </div>
  );
}
```

### ملفات الترجمة

```json
// i18n/dictionaries/ar.json
{
  "common": {
    "latest": "أحدث المقالات",
    "readMore": "اقرأ المزيد",
    "minutes": "{count} دقائق",
    "search": "بحث",
    "categories": "التصنيفات",
    "tags": "الوسوم"
  },
  "article": {
    "publishedAt": "نُشر في",
    "author": "الكاتب",
    "readingTime": "وقت القراءة",
    "share": "مشاركة",
    "related": "مقالات ذات صلة"
  },
  "newsletter": {
    "title": "اشترك في نشرتنا",
    "description": "احصل على آخر الأخبار في بريدك",
    "placeholder": "بريدك الإلكتروني",
    "subscribe": "اشترك الآن"
  }
}
```

### دعم RTL

```tsx
// تحقق من اتجاه اللغة
import { useLocale } from 'next-intl';

export default function MyComponent() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* المحتوى */}
    </div>
  );
}
```

---

## 🌙 الوضع الداكن

### استخدام الوضع الداكن

```tsx
// استخدام Tailwind CSS dark mode
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">العنوان</h1>
  <p className="text-gray-600 dark:text-gray-400">النص</p>
</div>
```

### تبديل الوضع الداكن

```tsx
import { useTheme } from '@/components/providers/ThemeProvider';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}
```

### ألوان الوضع الداكن في theme.json

```json
{
  "customizer": {
    "sections": [
      {
        "id": "darkMode",
        "title": "Dark Mode",
        "titleAr": "الوضع الداكن",
        "fields": [
          {
            "id": "darkModeEnabled",
            "type": "toggle",
            "label": "Enable Dark Mode",
            "labelAr": "تفعيل الوضع الداكن",
            "default": true
          },
          {
            "id": "darkPrimaryColor",
            "type": "color",
            "label": "Primary Color (Dark)",
            "labelAr": "اللون الأساسي (داكن)",
            "default": "#f59e0b"
          },
          {
            "id": "darkBackgroundColor",
            "type": "color",
            "label": "Background (Dark)",
            "labelAr": "لون الخلفية (داكن)",
            "default": "#111827"
          }
        ]
      }
    ]
  }
}
```

---

## ✅ أفضل الممارسات

### 1. الأداء

```tsx
// ✅ استخدم next/image للصور
import Image from 'next/image';
<Image src={url} alt={alt} fill className="object-cover" />

// ✅ استخدم lazy loading للمكونات الثقيلة
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// ✅ استخدم React.memo للمكونات التي لا تتغير كثيراً
const ArticleCard = React.memo(function ArticleCard({ article }) {
  // ...
});
```

### 2. إمكانية الوصول (Accessibility)

```tsx
// ✅ استخدم semantic HTML
<article>
  <header>
    <h1>{title}</h1>
  </header>
  <main>{content}</main>
  <footer>{author}</footer>
</article>

// ✅ أضف alt للصور
<Image src={url} alt="وصف الصورة" />

// ✅ استخدم aria labels
<button aria-label="القائمة الرئيسية">
  <MenuIcon />
</button>
```

### 3. التصميم المتجاوب

```tsx
// ✅ استخدم Tailwind responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {articles.map(article => (
    <ArticleCard key={article.id} article={article} />
  ))}
</div>

// ✅ استخدم container queries عند الحاجة
<div className="@container">
  <div className="@lg:flex @lg:gap-4">
    {/* محتوى */}
  </div>
</div>
```

### 4. معالجة الأخطاء

```tsx
// ✅ تعامل مع البيانات الفارغة
{articles?.length > 0 ? (
  <ArticleGrid articles={articles} />
) : (
  <EmptyState message={t('common.noResults')} />
)}

// ✅ تعامل مع الصور المفقودة
<Image
  src={article.coverImageUrl || '/images/placeholder.jpg'}
  alt={article.title}
/>
```

### 5. TypeScript

```tsx
// ✅ عرّف الأنواع بشكل صحيح
interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  showExcerpt?: boolean;
}

export default function ArticleCard({ 
  article, 
  variant = 'default',
  showExcerpt = true 
}: ArticleCardProps) {
  // ...
}
```

---

## 📝 تسجيل القالب

### 1. إنشاء ملف seed للقالب

```typescript
// prisma/seed-theme.ts
import { PrismaClient } from '@prisma/client';
import themeJson from '../NewsCore-frontend/themes/your-theme/theme.json';

const prisma = new PrismaClient();

async function seedTheme() {
  const theme = {
    slug: themeJson.id,
    name: themeJson.name,
    version: themeJson.version,
    author: themeJson.author,
    description: themeJson.descriptionAr || themeJson.description,
    previewImage: themeJson.previewImage,
    screenshots: themeJson.screenshots,
    manifest: themeJson,
    features: themeJson.features,
    path: `/themes/${themeJson.id}`,
    isActive: false,
    isDefault: false,
    isSystem: false,
    defaultSettings: extractDefaultSettings(themeJson),
  };

  await prisma.theme.upsert({
    where: { slug: theme.slug },
    update: theme,
    create: theme,
  });

  console.log(`Theme "${theme.name}" registered successfully`);
}

function extractDefaultSettings(themeJson: any) {
  const settings: Record<string, any> = {};
  
  themeJson.customizer?.sections?.forEach((section: any) => {
    section.fields?.forEach((field: any) => {
      if (field.default !== undefined) {
        settings[field.id] = field.default;
      }
    });
  });
  
  return settings;
}

seedTheme();
```

### 2. تشغيل الـ seed

```bash
npx ts-node prisma/seed-theme.ts
```

### 3. التحقق من التسجيل

```bash
curl http://localhost:3000/api/v1/themes
```

---

## 💡 أمثلة عملية

### مثال 1: قالب بسيط للمدونة

```
themes/
└── simple-blog/
    ├── theme.json
    ├── preview.png
    └── templates/
        ├── index.ts
        ├── home.tsx
        ├── post.tsx
        └── archive.tsx
```

### مثال 2: قالب إخباري متقدم

```
themes/
└── news-pro/
    ├── theme.json
    ├── preview.png
    ├── README.md
    │
    ├── templates/
    │   ├── index.ts
    │   ├── home-classic.tsx
    │   ├── home-magazine.tsx
    │   ├── home-video.tsx
    │   ├── article-default.tsx
    │   ├── article-longform.tsx
    │   ├── article-video.tsx
    │   ├── category.tsx
    │   ├── author.tsx
    │   ├── search.tsx
    │   └── error-404.tsx
    │
    ├── components/
    │   ├── LiveTicker.tsx
    │   ├── TrendingTopics.tsx
    │   └── StockWidget.tsx
    │
    └── styles/
        └── animations.css
```

---

## 🔗 روابط مفيدة

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Lucide Icons](https://lucide.dev/icons/)
- [NewsCore API Documentation](/api/docs)

---

## 🤝 المساهمة

نرحب بمساهماتكم! إذا أنشأت قالباً جديداً وتريد مشاركته:

1. Fork المستودع
2. أنشئ branch جديد
3. أضف قالبك في مجلد `themes/`
4. أرسل Pull Request

---

## 📞 الدعم

- **GitHub Issues**: للإبلاغ عن المشاكل
- **Discord**: للمناقشات والمساعدة
- **Email**: developers@newscore.dev

---

**صُنع بـ ❤️ بواسطة فريق NewsCore**

آخر تحديث: ديسمبر 2024


