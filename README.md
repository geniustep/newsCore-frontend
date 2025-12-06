<div align="center">

# 🎨 NewsCore Frontend

### واجهة المستخدم لنظام إدارة المحتوى الإخباري

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)

</div>

---

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [هيكل المشروع](#-هيكل-المشروع)
- [التثبيت](#-التثبيت)
- [التطوير](#-التطوير)
- [لوحة الإدارة](#-لوحة-الإدارة)
- [نظام القوالب](#-نظام-القوالب)
- [تعدد اللغات](#-تعدد-اللغات)
- [النشر](#-النشر)

---

## 🌟 نظرة عامة

واجهة NewsCore الأمامية مبنية بـ **Next.js 14** مع **App Router** لتوفير تجربة مستخدم سلسة وأداء فائق. تدعم الواجهة تعدد اللغات مع دعم كامل للـ RTL.

---

## ✨ المميزات

### 🎯 للمستخدمين
- ✅ تصميم متجاوب يعمل على جميع الأجهزة
- ✅ وضع ليلي/نهاري
- ✅ دعم كامل للعربية والـ RTL
- ✅ سرعة تحميل فائقة
- ✅ تحسين SEO متقدم

### 🛠️ للمطورين
- ✅ TypeScript للأمان والإنتاجية
- ✅ Tailwind CSS للتصميم السريع
- ✅ نظام قوالب قابل للتوسع
- ✅ باني صفحات مرئي (Drag & Drop)
- ✅ React Query لإدارة البيانات
- ✅ Zustand لإدارة الحالة

### 🎛️ لوحة الإدارة
- ✅ واجهة حديثة وسهلة الاستخدام
- ✅ إدارة المقالات والتصنيفات
- ✅ باني الصفحات المرئي
- ✅ إدارة القوالب والسمات
- ✅ إحصائيات ولوحة معلومات

---

## 📁 هيكل المشروع

```
NewsCore-frontend/
├── 📁 app/                      # صفحات Next.js (App Router)
│   └── [locale]/                # دعم تعدد اللغات
│       ├── admin/               # 🆕 لوحة الإدارة الجديدة
│       │   ├── layout.tsx       # تخطيط الإدارة
│       │   ├── page.tsx         # لوحة المعلومات
│       │   ├── login/           # تسجيل الدخول
│       │   ├── content/         # إدارة المحتوى
│       │   │   ├── articles/    # المقالات
│       │   │   └── categories/  # التصنيفات
│       │   ├── appearance/      # المظهر
│       │   │   ├── builder/     # باني الصفحات
│       │   │   ├── templates/   # القوالب
│       │   │   └── menus/       # القوائم
│       │   └── system/          # النظام
│       │       └── settings/    # الإعدادات
│       ├── article/             # صفحات المقالات
│       ├── category/            # صفحات التصنيفات
│       └── page.tsx             # الصفحة الرئيسية
│
├── 📁 components/               # المكونات
│   ├── template-engine/         # محرك القوالب
│   │   ├── blocks/              # البلوكات (ArticleGrid, BigHero, etc.)
│   │   ├── BlockRenderer.tsx    # عارض البلوكات
│   │   └── SectionRenderer.tsx  # عارض الأقسام
│   ├── layout/                  # مكونات التخطيط
│   ├── ui/                      # مكونات الواجهة
│   └── providers/               # موفرو السياق
│
├── 📁 lib/                      # المكتبات
│   ├── api/                     # عملاء API
│   │   ├── admin.ts             # API الإدارة
│   │   └── client.ts            # العميل الأساسي
│   ├── template-engine/         # محرك القوالب
│   │   ├── types.ts             # الأنواع
│   │   ├── registry.ts          # سجل البلوكات
│   │   └── data-source.ts       # مصادر البيانات
│   └── utils/                   # الأدوات المساعدة
│
├── 📁 i18n/                     # الترجمة
│   ├── dictionaries/            # ملفات الترجمة
│   │   ├── ar.json              # العربية
│   │   ├── en.json              # الإنجليزية
│   │   └── fr.json              # الفرنسية
│   └── request.ts               # إعدادات next-intl
│
├── 📁 stores/                   # إدارة الحالة (Zustand)
│   ├── admin-auth.ts            # حالة المصادقة
│   └── builder-store.ts         # حالة الباني
│
├── 📁 themes/                   # السمات
│   └── newscore/                # السمة الافتراضية
│       ├── components/          # مكونات السمة
│       └── templates/           # قوالب السمة
│
├── 📁 styles/                   # الأنماط
│   └── globals.css              # الأنماط العامة
│
├── 📄 next.config.mjs           # إعدادات Next.js
├── 📄 tailwind.config.ts        # إعدادات Tailwind
└── 📄 middleware.ts             # Middleware للغات
```

---

## 🚀 التثبيت

### المتطلبات
- Node.js 18.x أو أحدث
- npm أو yarn أو pnpm

### الخطوات

```bash
# 1. الانتقال لمجلد Frontend
cd NewsCore-frontend

# 2. تثبيت الاعتماديات
npm install

# 3. إنشاء ملف البيئة
cp .env.example .env.local

# 4. تعديل الإعدادات
nano .env.local
```

### متغيرات البيئة

```env
# API Backend
NEXT_PUBLIC_API_URL=/api/v1

# الموقع
NEXT_PUBLIC_SITE_NAME=أخبار اليوم
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_DEFAULT_LOCALE=ar

# اختياري
USE_LOCAL_TEMPLATES=true
```

---

## 💻 التطوير

### تشغيل خادم التطوير

```bash
npm run dev
```

الموقع متاح على: http://localhost:3000

### الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء الإنتاج |
| `npm run start` | تشغيل خادم الإنتاج |
| `npm run lint` | فحص الكود |
| `npm run type-check` | فحص الأنواع |

---

## 🎛️ لوحة الإدارة

### الوصول
- **الرابط**: `/ar/admin` أو `/en/admin`
- **البريد**: `admin@example.com`
- **كلمة المرور**: `admin123`

### الأقسام الرئيسية

```
📊 لوحة المعلومات     → /admin
├── 📝 المحتوى
│   ├── المقالات      → /admin/content/articles
│   ├── الصفحات       → /admin/content/pages
│   ├── التصنيفات     → /admin/content/categories
│   ├── الوسوم        → /admin/content/tags
│   └── الوسائط       → /admin/content/media
├── 🎨 المظهر
│   ├── باني الصفحات  → /admin/appearance/builder
│   ├── القوالب       → /admin/appearance/templates
│   ├── القوائم       → /admin/appearance/menus
│   └── السمات        → /admin/appearance/themes
└── ⚙️ النظام
    ├── المستخدمين    → /admin/system/users
    ├── الإعدادات     → /admin/system/settings
    └── التحليلات     → /admin/system/analytics
```

---

## 🧩 نظام القوالب

### البلوكات المتاحة

| البلوك | الوصف | المتغيرات |
|--------|-------|-----------|
| `ArticleGrid` | شبكة مقالات | grid-1 إلى grid-6 |
| `BigHero` | بطل كبير | hero-classic, hero-magazine |
| `ArticleList` | قائمة مقالات | list-1 إلى list-4 |
| `ArticleSlider` | سلايدر | slider-1 إلى slider-3 |

### إنشاء بلوك جديد

```typescript
// components/template-engine/blocks/MyBlock.tsx
import { BlockProps } from '@/lib/template-engine/types';

export default function MyBlock({ variant, config, data }: BlockProps) {
  return (
    <div className="my-block">
      {data?.articles.map(article => (
        <article key={article.id}>
          <h2>{article.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

### تسجيل البلوك

```typescript
// lib/template-engine/registry.ts
registerBlock('my-block', {
  name: 'My Block',
  nameAr: 'بلوك مخصص',
  variants: [
    { id: 'default', name: 'Default', nameAr: 'افتراضي' }
  ]
});
```

---

## 🌍 تعدد اللغات

### اللغات المدعومة
- 🇸🇦 العربية (ar) - RTL
- 🇬🇧 الإنجليزية (en) - LTR
- 🇫🇷 الفرنسية (fr) - LTR

### إضافة ترجمة

```json
// i18n/dictionaries/ar.json
{
  "admin": {
    "title": "لوحة الإدارة",
    "nav": {
      "dashboard": "لوحة المعلومات",
      "articles": "المقالات"
    }
  }
}
```

### استخدام الترجمة

```typescript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('admin');
  
  return <h1>{t('title')}</h1>;
}
```

---

## 📦 النشر

### Vercel (موصى به)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### متغيرات الإنتاج

```env
NEXT_PUBLIC_API_URL=https://api.yoursite.com/api/v1
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NODE_ENV=production
```

---

## 🔧 التخصيص

### تغيير الألوان

```css
/* styles/globals.css */
:root {
  --color-primary: #e91e8c;
  --color-secondary: #1e3a5f;
}
```

### تخصيص Tailwind

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#e91e8c',
        secondary: '#1e3a5f',
      },
    },
  },
};
```

---

## 📚 التوثيق الإضافي

- [دليل تطوير السمات](./docs/THEME_DEVELOPMENT_GUIDE.md)
- [مكونات الصفحة الرئيسية](./HOMEPAGE_COMPONENTS.md)
- [توثيق API](../docs/API.md)

---

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى:

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📄 الترخيص

MIT License - راجع ملف [LICENSE](../LICENSE) للتفاصيل.

---

<div align="center">

صنع بـ ❤️ بواسطة فريق NewsCore

</div>
