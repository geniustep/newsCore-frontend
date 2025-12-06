# 🎨 دليل تطوير السمات والقوالب

دليل شامل لتطوير السمات والقوالب في NewsCore.

---

## 📋 جدول المحتويات

1. [نظرة عامة](#-نظرة-عامة)
2. [هيكل السمة](#-هيكل-السمة)
3. [إنشاء سمة جديدة](#-إنشاء-سمة-جديدة)
4. [نظام القوالب](#-نظام-القوالب)
5. [البلوكات](#-البلوكات)
6. [التخصيص](#-التخصيص)
7. [أفضل الممارسات](#-أفضل-الممارسات)

---

## 🌟 نظرة عامة

نظام السمات في NewsCore يوفر:

- ✅ **قوالب قابلة للتخصيص** - تصميم صفحات بدون كود
- ✅ **بلوكات جاهزة** - مكونات قابلة لإعادة الاستخدام
- ✅ **باني مرئي** - سحب وإفلات
- ✅ **دعم RTL** - تصميم ثنائي الاتجاه
- ✅ **وضع ليلي** - دعم كامل للوضع الداكن

---

## 📁 هيكل السمة

```
themes/
└── newscore/                    # اسم السمة
    ├── 📄 index.ts              # تصدير السمة
    ├── 📄 theme.json            # إعدادات السمة
    ├── 📁 components/           # مكونات السمة
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── Sidebar.tsx
    │   └── ...
    ├── 📁 templates/            # قوالب الصفحات
    │   ├── index.ts
    │   ├── home.ts
    │   ├── article.ts
    │   └── category.ts
    ├── 📁 blocks/               # بلوكات مخصصة
    │   └── CustomBlock.tsx
    └── 📁 styles/               # أنماط السمة
        └── theme.css
```

---

## 🆕 إنشاء سمة جديدة

### الخطوة 1: إنشاء المجلد

```bash
mkdir -p themes/my-theme/{components,templates,blocks,styles}
```

### الخطوة 2: إنشاء ملف الإعدادات

```json
// themes/my-theme/theme.json
{
  "name": "My Theme",
  "nameAr": "سمتي",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "سمة مخصصة لـ NewsCore",
  "preview": "/themes/my-theme/preview.png",
  "colors": {
    "primary": "#e91e8c",
    "secondary": "#1e3a5f",
    "accent": "#f59e0b"
  },
  "fonts": {
    "heading": "Cairo",
    "body": "Tajawal"
  },
  "features": {
    "darkMode": true,
    "rtl": true,
    "animations": true
  }
}
```

### الخطوة 3: إنشاء مكونات السمة

```typescript
// themes/my-theme/components/Header.tsx
'use client';

import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            NewsCore
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/category/politics">سياسة</Link>
            <Link href="/category/economy">اقتصاد</Link>
            <Link href="/category/sports">رياضة</Link>
          </nav>
          
          <button onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
```

### الخطوة 4: تصدير السمة

```typescript
// themes/my-theme/index.ts
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import * as templates from './templates';

export const theme = {
  name: 'my-theme',
  components: {
    Header,
    Footer,
    Sidebar,
  },
  templates,
};

export default theme;
```

---

## 📄 نظام القوالب

### أنواع القوالب

| النوع | الوصف | الاستخدام |
|-------|-------|-----------|
| `home` | الصفحة الرئيسية | `/` |
| `article` | صفحة المقال | `/article/:slug` |
| `category` | صفحة التصنيف | `/category/:slug` |
| `tag` | صفحة الوسم | `/tag/:slug` |
| `author` | صفحة الكاتب | `/author/:slug` |
| `page` | صفحة ثابتة | `/page/:slug` |
| `search` | صفحة البحث | `/search` |

### هيكل القالب

```typescript
// templates/home.ts
import type { Template } from '@/lib/template-engine/types';

export const homeTemplate: Template = {
  id: 'home-default',
  name: 'Default Home',
  nameAr: 'الرئيسية الافتراضية',
  description: 'قالب الصفحة الرئيسية',
  descriptionAr: 'قالب الصفحة الرئيسية الافتراضي',
  type: 'home',
  version: '1.0.0',
  preview: '/templates/home-default.png',
  
  // التخطيط
  layout: {
    type: 'full-width',  // full-width | sidebar-right | sidebar-left
  },
  
  // المناطق
  regions: {
    header: { enabled: true },
    footer: { enabled: true },
    sidebar: { enabled: false },
  },
  
  // الإعدادات
  settings: {
    showBreakingNews: true,
    showBreadcrumb: false,
    showLastUpdated: true,
    infiniteScroll: false,
    loadMoreButton: true,
    stickyHeader: true,
    stickySidebar: false,
    backToTop: true,
    readingProgress: false,
  },
  
  // الأقسام
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      nameAr: 'قسم البطل',
      order: 0,
      container: 'full',
      blocks: [
        {
          id: 'hero-block',
          type: 'big-hero',
          variant: 'hero-magazine',
          config: {
            dataSource: {
              mode: 'featured',
              limit: 5,
            },
          },
        },
      ],
    },
    {
      id: 'latest-news',
      name: 'Latest News',
      nameAr: 'آخر الأخبار',
      order: 1,
      container: 'normal',
      header: {
        enabled: true,
        title: 'Latest News',
        titleAr: 'آخر الأخبار',
        style: 'bordered',
        showMore: true,
        moreLink: '/category/latest',
        alignment: 'start',
      },
      blocks: [
        {
          id: 'latest-grid',
          type: 'article-grid',
          variant: 'grid-4',
          config: {
            dataSource: {
              mode: 'latest',
              limit: 8,
            },
          },
        },
      ],
    },
  ],
  
  // البيانات الوصفية
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
};
```

---

## 🧩 البلوكات

### البلوكات المتاحة

#### ArticleGrid - شبكة المقالات

```typescript
{
  type: 'article-grid',
  variant: 'grid-4',  // grid-1 إلى grid-6
  config: {
    dataSource: {
      mode: 'latest',      // latest | featured | trending | category | tag
      limit: 8,
      categoryId: 'uuid',  // اختياري
    },
    display: {
      showImage: true,
      showCategory: true,
      showAuthor: true,
      showDate: true,
      showExcerpt: true,
      excerptLength: 100,
    },
    image: {
      aspectRatio: '16:9',
      position: 'top',
    },
  },
}
```

#### BigHero - البطل الكبير

```typescript
{
  type: 'big-hero',
  variant: 'hero-magazine',  // hero-classic | hero-magazine | hero-minimal
  config: {
    dataSource: {
      mode: 'featured',
      limit: 5,
    },
    display: {
      showCategory: true,
      showAuthor: true,
      showDate: true,
    },
    image: {
      aspectRatio: '21:9',
      overlay: {
        type: 'gradient',
        direction: 'to-top',
      },
    },
  },
}
```

#### ArticleList - قائمة المقالات

```typescript
{
  type: 'article-list',
  variant: 'list-2',  // list-1 إلى list-4
  config: {
    dataSource: {
      mode: 'category',
      categoryId: 'uuid',
      limit: 10,
    },
    display: {
      showImage: true,
      showExcerpt: true,
      layout: 'horizontal',  // horizontal | vertical
    },
  },
}
```

#### ArticleSlider - سلايدر المقالات

```typescript
{
  type: 'article-slider',
  variant: 'slider-1',
  config: {
    dataSource: {
      mode: 'trending',
      limit: 6,
    },
    slider: {
      autoplay: true,
      interval: 5000,
      showDots: true,
      showArrows: true,
    },
  },
}
```

### إنشاء بلوك مخصص

```typescript
// themes/my-theme/blocks/NewsCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { BlockProps } from '@/lib/template-engine/types';

interface NewsCardProps extends BlockProps {
  // خصائص إضافية
}

export default function NewsCard({ 
  variant, 
  config, 
  data 
}: NewsCardProps) {
  const articles = data?.articles || [];
  
  if (articles.length === 0) {
  return (
      <div className="text-center py-8 text-gray-500">
        لا توجد مقالات
            </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <article 
          key={article.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
        >
          {article.featuredImage && (
            <div className="relative aspect-video">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-4">
            {article.category && (
                  <Link
                href={`/category/${article.category.slug}`}
                className="text-sm text-primary font-medium"
                  >
                {article.category.name}
                  </Link>
            )}
            
            <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h3>
            
            {config?.display?.showExcerpt && article.excerpt && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                {article.excerpt}
              </p>
            )}
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              {article.author && (
                <span>{article.author.displayName}</span>
              )}
              <time>{new Date(article.publishedAt).toLocaleDateString('ar')}</time>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
```

### تسجيل البلوك

```typescript
// lib/template-engine/registry.ts
import NewsCard from '@/themes/my-theme/blocks/NewsCard';

export const BLOCK_REGISTRY = {
  // البلوكات الموجودة...
  'news-card': {
    component: NewsCard,
    meta: {
      name: 'News Card',
      nameAr: 'بطاقة الأخبار',
      description: 'بطاقة أخبار مخصصة',
      icon: 'newspaper',
      category: 'articles',
    },
    variants: [
      { id: 'default', name: 'Default', nameAr: 'افتراضي' },
      { id: 'compact', name: 'Compact', nameAr: 'مضغوط' },
    ],
    defaultConfig: {
      display: {
        showImage: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: true,
        showDate: true,
      },
    },
  },
};
```

---

## 🎨 التخصيص

### الألوان

```css
/* themes/my-theme/styles/theme.css */
:root {
  /* الألوان الأساسية */
  --color-primary: #e91e8c;
  --color-primary-light: #f472b6;
  --color-primary-dark: #be185d;
  
  --color-secondary: #1e3a5f;
  --color-secondary-light: #3b5998;
  --color-secondary-dark: #0f172a;
  
  /* ألوان النص */
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-text-dark: #111827;
  
  /* ألوان الخلفية */
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  
  /* الظلال */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* الوضع الداكن */
.dark {
  --color-text: #f9fafb;
  --color-text-light: #9ca3af;
  --color-text-dark: #ffffff;
  
  --color-bg: #111827;
  --color-bg-secondary: #1f2937;
}
```

### الخطوط

```css
/* استيراد الخطوط */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap');

:root {
  --font-heading: 'Cairo', sans-serif;
  --font-body: 'Tajawal', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body {
  font-family: var(--font-body);
}
```

### التخطيط

```typescript
// تخصيص Tailwind
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
        },
      },
    },
  },
};
```

---

## ✅ أفضل الممارسات

### 1. الأداء

```typescript
// ✅ استخدم التحميل الكسول للصور
import Image from 'next/image';

<Image
  src={article.image}
  alt={article.title}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>

// ✅ استخدم التحميل الديناميكي للمكونات الكبيرة
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

### 2. إمكانية الوصول

```typescript
// ✅ أضف نصوص بديلة
<Image alt="وصف الصورة" ... />

// ✅ استخدم عناصر HTML الدلالية
<article>
  <header>
    <h2>العنوان</h2>
  </header>
  <main>المحتوى</main>
  <footer>التذييل</footer>
</article>

// ✅ أضف أدوار ARIA
<nav aria-label="التنقل الرئيسي">
  ...
</nav>
```

### 3. RTL

```typescript
// ✅ استخدم الخصائص المنطقية
className="ms-4"  // بدلاً من ml-4
className="me-4"  // بدلاً من mr-4
className="ps-4"  // بدلاً من pl-4
className="pe-4"  // بدلاً من pr-4

// ✅ استخدم start/end بدلاً من left/right
className="text-start"  // بدلاً من text-left
className="float-end"   // بدلاً من float-right
```

### 4. الوضع الداكن

```typescript
// ✅ استخدم فئات dark:
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-white"
className="border-gray-200 dark:border-gray-700"
```

### 5. التنظيم

```typescript
// ✅ فصل المنطق عن العرض
// hooks/useArticles.ts
export function useArticles(params) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => fetchArticles(params),
  });
}

// components/ArticleList.tsx
export function ArticleList() {
  const { data, isLoading } = useArticles({ limit: 10 });
  
  if (isLoading) return <Skeleton />;
  
  return <ArticleListView articles={data} />;
}
```

---

## 📚 موارد إضافية

- [توثيق Next.js](https://nextjs.org/docs)
- [توثيق Tailwind CSS](https://tailwindcss.com/docs)
- [أيقونات Lucide](https://lucide.dev/icons)
- [خطوط Google](https://fonts.google.com)

---

## 🤝 المساهمة

لإضافة سمة جديدة:

1. Fork المشروع
2. أنشئ السمة في `themes/your-theme/`
3. أضف توثيقاً للسمة
4. افتح Pull Request

---

<div align="center">

صنع بـ ❤️ بواسطة فريق NewsCore

</div>
