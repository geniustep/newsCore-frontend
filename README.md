# 📰 NewsCore Frontend

<div align="center">

![NewsCore Frontend](https://img.shields.io/badge/NewsCore-Frontend-blue?style=for-the-badge&logo=next.js&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**واجهة موقع إخباري احترافية قابلة للتخصيص مع دعم كامل للقوالب الديناميكية**

</div>

---

## 🚀 البداية السريعة

### المتطلبات
- Node.js 20.x أو أحدث
- npm أو yarn

### التثبيت

```bash
# تثبيت الـ Dependencies
npm install

# تشغيل السيرفر المحلي
npm run dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

### البناء للإنتاج

```bash
npm run build
npm start
```

---

## 🏗️ البنية التقنية

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand + React Query
- **i18n**: next-intl
- **HTTP Client**: Axios

---

## ✨ الميزات

### 🆕 النظام المتقدم (v2.0)

#### 🎨 نظام القوالب الديناميكي (Theme System)
- **ThemeProvider** لإدارة إعدادات القالب
- **ThemeLoader** لتحميل القوالب ديناميكياً
- **CSS Variables** لتطبيق الألوان والخطوط
- دعم **الوضع الداكن** مع حفظ التفضيل
- **Templates** متعددة لكل نوع صفحة
- **Regions** لتوزيع الودجات

#### 🧩 دعم الوحدات (Modules)
- تحميل مكونات الوحدات ديناميكياً
- عرض ودجات الوحدات في المناطق المخصصة
- دعم hooks من الوحدات

#### 🌍 نظام الترجمة المحسّن
- تحميل الترجمات من API
- دعم **Namespaces** متعددة
- **Fallback** للغة الافتراضية
- **Caching** للترجمات

### 🚨 الأخبار العاجلة
- مكون `BreakingNews` مع دعم API
- تحديث تلقائي كل 30 ثانية
- دعم عرض متعدد الأخبار مع التنقل
- تكامل كامل مع Backend API

### 📊 التحليلات
- API clients جاهزة للتحليلات
- دعم جميع endpoints (Overview, Pageviews, Top Articles, Traffic Sources, Realtime)

### 🔄 سير العمل
- API clients جاهزة لسير العمل التحريري
- دعم جميع عمليات Workflow

---

## 📁 بنية المشروع

```
NewsCore-frontend/
├── 📂 app/
│   └── 📂 [locale]/           # صفحات متعددة اللغات
│       ├── layout.tsx         # Root Layout مع ThemeProvider
│       ├── page.tsx           # الصفحة الرئيسية
│       ├── 📂 article/        # صفحات المقالات
│       └── 📂 category/       # صفحات التصنيفات
├── 📂 components/
│   ├── 📂 layout/             # Header, Footer
│   ├── 📂 menus/              # MenuRenderer, MegaMenu
│   └── 📂 widgets/            # مكونات الودجات
├── 📂 core/                   # 🆕 النظام الأساسي
│   ├── ThemeProvider.tsx      # مزود القالب
│   └── ThemeLoader.ts         # محمّل القوالب
├── 📂 themes/                 # 🆕 القوالب
│   └── 📂 default/
│       ├── theme.json         # manifest القالب
│       ├── 📂 templates/      # قوالب الصفحات
│       └── 📂 components/     # مكونات القالب
├── 📂 lib/
│   └── 📂 api/               # API clients
├── 📂 i18n/
│   └── config.ts             # إعدادات الترجمة
└── 📄 middleware.ts          # Middleware للترجمة
```

---

## 🌍 اللغات المدعومة

| اللغة | الكود | الاتجاه |
|-------|-------|---------|
| العربية | `ar` | RTL |
| English | `en` | LTR |
| Français | `fr` | LTR |

---

## 🎨 استخدام نظام القوالب

### ThemeProvider

```tsx
import { ThemeProvider, useTheme } from '@/core/ThemeProvider';

// في layout.tsx
export default function Layout({ children }) {
  return (
    <ThemeProvider initialTheme={themeSettings}>
      {children}
    </ThemeProvider>
  );
}

// في أي مكون
function MyComponent() {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <div style={{ color: theme.primaryColor }}>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
```

### تحميل القالب

```tsx
import { themeLoader } from '@/core/ThemeLoader';

// جلب القالب النشط
const theme = await themeLoader.loadActiveTheme();

// جلب template معين
const template = themeLoader.getTemplate('article', 'article-full');

// التحقق من ميزة
if (themeLoader.supportsFeature('dark-mode')) {
  // ...
}
```

---

## 🔌 API Clients

### Breaking News

```typescript
import { breakingNewsApi } from '@/lib/api/breaking-news';

// جلب الأخبار النشطة
const news = await breakingNewsApi.getActive();

// استخدام في المكون
<BreakingNews useApi={true} />
```

### Themes 🆕

```typescript
// جلب إعدادات القالب النشط
const response = await fetch('/api/v1/themes/active');
const theme = await response.json();
```

### Translations 🆕

```typescript
// جلب ترجمات namespace معين
const response = await fetch('/api/v1/i18n/translations/common/ar');
const translations = await response.json();
```

### Widgets 🆕

```typescript
// جلب ودجات منطقة معينة
const response = await fetch('/api/v1/widgets/region/sidebar-right?isActive=true');
const widgets = await response.json();
```

---

## 🔗 الروابط

- [NewsCore Backend](https://github.com/geniustep/NewsCore)
- [NewsCore Admin](https://github.com/geniustep/newsCore-admin)
- [API Docs](https://admin.sahara2797.com/api/docs)
- [Advanced System Docs](../docs/ADVANCED_SYSTEM.md)

---

## 📝 الترخيص

MIT License

---

<div align="center">

**صُنع بـ ❤️ للمجتمع العربي**

</div>
