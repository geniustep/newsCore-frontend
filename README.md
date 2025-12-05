# 📰 NewsCore Frontend

واجهة موقع إخباري احترافية متوافقة مع NewsCore Backend API.

## 🚀 البداية السريعة

### المتطلبات
- Node.js 18.x أو أحدث
- npm أو yarn

### التثبيت

\`\`\`bash
# تثبيت الـ Dependencies
npm install

# تشغيل السيرفر المحلي
npm run dev
\`\`\`

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

### البناء للإنتاج

\`\`\`bash
npm run build
npm start
\`\`\`

## 🏗️ البنية التقنية

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand + React Query
- **i18n**: next-intl
- **HTTP Client**: Axios

## ✨ الميزات

### 🚨 الأخبار العاجلة
- مكون `BreakingNews` مع دعم API
- تحديث تلقائي كل 30 ثانية
- دعم عرض متعدد الأخبار مع التنقل
- تكامل كامل مع Backend API

### 📊 التحليلات (للمستقبل)
- API clients جاهزة للتحليلات
- دعم جميع endpoints (Overview, Pageviews, Top Articles, Traffic Sources, Realtime)

### 🔄 سير العمل (للمستقبل)
- API clients جاهزة لسير العمل التحريري
- دعم جميع عمليات Workflow

## 🌍 اللغات المدعومة

- العربية (الافتراضية) - RTL
- English - LTR
- Français - LTR

## 📚 الوثائق

راجع الدليل الشامل في الملف الأساسي للمشروع.

## 🔌 API Clients

### Breaking News

```typescript
import { breakingNewsApi } from '@/lib/api/breaking-news';

// جلب الأخبار النشطة
const news = await breakingNewsApi.getActive();

// استخدام في المكون
<BreakingNews useApi={true} />
```

### Analytics

```typescript
import { analyticsApi } from '@/lib/api/analytics';

// نظرة عامة
const overview = await analyticsApi.getOverview({ period: '7days' });

// المشاهدات
const pageviews = await analyticsApi.getPageviews({ period: '30days' });

// أفضل المقالات
const topArticles = await analyticsApi.getTopArticles({ limit: 10 });
```

## 🔗 الروابط

- [NewsCore Backend](https://github.com/geniustep/NewsCore)
- [NewsCore Admin](https://github.com/geniustep/newsCore-admin)
- [API Docs](https://admin.sahara2797.com/api/docs)

## 📝 الترخيص

MIT License
