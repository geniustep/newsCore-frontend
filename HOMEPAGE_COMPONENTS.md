# دليل مكونات الصفحة الرئيسية الإخبارية

هذا المستند يوثق جميع المكونات المتاحة للصفحة الرئيسية الإخبارية الشاملة.

## 📦 المكونات المتاحة

### 1. Top Bar (الشريط العلوي)
**الموقع:** `components/homepage/TopBar.tsx`

**الوصف:** شريط علوي يحتوي على:
- التاريخ الميلادي والهجري
- عرض الطقس (درجة الحرارة والحالة الجوية)
- شريط العملات المتحرك (دولار، يورو، ذهب، نفط)
- روابط تسجيل الدخول والاشتراك
- مُبدّل الوضع الداكن/الفاتح
- مُبدّل اللغة

**الاستخدام:**
```tsx
import TopBar from '@/components/homepage/TopBar';

<TopBar />
```

---

### 2. SearchBar (شريط البحث المحسّن)
**الموقع:** `components/homepage/SearchBar.tsx`

**الوصف:** شريط بحث منبثق بتصميم حديث يتضمن:
- نافذة بحث بملء الشاشة
- اقتراحات بحث شائعة
- تكامل مع صفحة البحث

**الاستخدام:**
```tsx
import SearchBar from '@/components/homepage/SearchBar';

<SearchBar />
```

---

### 3. BreakingNews (الأخبار العاجلة)
**الموقع:** `components/articles/BreakingNews.tsx`

**الوصف:** شريط أخبار عاجلة محسّن يتضمن:
- تبديل تلقائي بين الأخبار
- أسهم تنقل يدوية
- طابع زمني (منذ كم دقيقة)
- عداد الأخبار

**الاستخدام:**
```tsx
import BreakingNews from '@/components/articles/BreakingNews';

<BreakingNews articles={trendingArticles} />
```

---

### 4. HeroSection (القسم الرئيسي)
**الموقع:** `components/homepage/HeroSection.tsx`

**الوصف:** قسم رئيسي بثلاثة تخطيطات مختلفة:
- **Classic**: 60% خبر رئيسي + 40% أخبار جانبية
- **Grid**: شبكة 3×2 بأحجام متفاوتة
- **Magazine**: عرض كامل بأسلوب المجلات

**الاستخدام:**
```tsx
import HeroSection from '@/components/homepage/HeroSection';

<HeroSection
  mainArticle={mainFeatured}
  sideArticles={sideArticles}
  layout="classic" // or "grid" or "magazine"
/>
```

---

### 5. VideoSection (قسم الفيديو)
**الموقع:** `components/homepage/VideoSection.tsx`

**الوصف:** قسم فيديو تفاعلي يتضمن:
- مشغل فيديو رئيسي
- قائمة تشغيل جانبية
- تبويبات (الأحدث، الأكثر مشاهدة)
- عرض المدة وعدد المشاهدات

**الاستخدام:**
```tsx
import VideoSection from '@/components/homepage/VideoSection';

const videos = [
  {
    id: '1',
    title: 'عنوان الفيديو',
    thumbnail: '/path/to/thumbnail.jpg',
    duration: '5:30',
    url: '/video-url',
    views: 1250,
  },
];

<VideoSection videos={videos} />
```

---

### 6. CategorySection (أقسام الفئات)
**الموقع:** `components/homepage/CategorySection.tsx`

**الوصف:** قسم لعرض أخبار فئة معينة بـ:
- خبر رئيسي كبير
- 3-4 أخبار فرعية
- أيقونة ولون مميز لكل فئة
- رابط "المزيد"

**الاستخدام:**
```tsx
import CategorySection from '@/components/homepage/CategorySection';
import { Newspaper } from 'lucide-react';

<CategorySection
  categoryName="سياسة"
  categorySlug="politics"
  articles={politicsArticles}
  color="blue"
  icon={<Newspaper className="w-8 h-8" />}
/>
```

**الألوان المتاحة:** `primary`, `blue`, `green`, `red`, `purple`, `orange`

---

### 7. Sidebar Widgets (عناصر الشريط الجانبي)
**الموقع:** `components/homepage/SidebarWidgets.tsx`

**المكونات المتاحة:**

#### MostReadWidget
```tsx
import { MostReadWidget } from '@/components/homepage/SidebarWidgets';

<MostReadWidget articles={articles} />
```

#### NewsletterWidget
```tsx
import { NewsletterWidget } from '@/components/homepage/SidebarWidgets';

<NewsletterWidget />
```

#### PollWidget
```tsx
import { PollWidget } from '@/components/homepage/SidebarWidgets';

const pollData = {
  question: 'ما رأيك في الأداء الاقتصادي؟',
  options: [
    { id: '1', text: 'ممتاز', votes: 150 },
    { id: '2', text: 'جيد', votes: 320 },
  ],
};

<PollWidget question={pollData.question} options={pollData.options} />
```

---

### 8. OpinionSection (قسم الرأي والمقالات)
**الموقع:** `components/homepage/OpinionSection.tsx`

**الوصف:** قسم لعرض مقالات الرأي مع:
- بطاقات الكتّاب (صورة، اسم، منصب)
- سلايدر أفقي
- رابط لصفحة جميع الكتّاب

**الاستخدام:**
```tsx
import OpinionSection from '@/components/homepage/OpinionSection';

const opinions = [
  {
    id: '1',
    title: 'عنوان المقال',
    excerpt: 'مقتطف من المقال',
    slug: 'article-slug',
    author: {
      id: '1',
      name: 'اسم الكاتب',
      avatar: '/avatar.jpg',
      title: 'خبير اقتصادي',
    },
  },
];

<OpinionSection articles={opinions} />
```

---

### 9. FeaturesSection (التقارير والتحقيقات)
**الموقع:** `components/homepage/FeaturesSection.tsx`

**الوصف:** قسم للتقارير الخاصة والتحقيقات الاستقصائية:
- بطاقات كبيرة بصور عالية الجودة
- وسم "تقرير خاص" أو "تحقيق"
- وقت القراءة المتوقع
- اسم المحرر

**الاستخدام:**
```tsx
import FeaturesSection from '@/components/homepage/FeaturesSection';

const features = [
  {
    id: '1',
    title: 'عنوان التقرير',
    excerpt: 'وصف التقرير',
    image: '/feature-image.jpg',
    slug: 'feature-slug',
    author: { name: 'اسم المحرر' },
    readTime: 15, // بالدقائق
    type: 'report', // or 'investigation'
  },
];

<FeaturesSection features={features} />
```

---

### 10. PhotoGallery (معرض الصور)
**الموقع:** `components/homepage/PhotoGallery.tsx`

**الوصف:** معرض صور تفاعلي مع:
- شبكة صور مصغرة
- Lightbox لعرض الصور بحجم كامل
- أسهم تنقل
- عنوان ووصف لكل صورة

**الاستخدام:**
```tsx
import PhotoGallery from '@/components/homepage/PhotoGallery';

const galleries = [
  {
    id: '1',
    title: 'عنوان الألبوم',
    photos: [
      { id: '1', url: '/photo1.jpg', title: 'عنوان الصورة', caption: 'وصف' },
      { id: '2', url: '/photo2.jpg', title: 'عنوان الصورة' },
    ],
  },
];

<PhotoGallery galleries={galleries} />
```

---

### 11. PodcastSection (قسم البودكاست)
**الموقع:** `components/homepage/PodcastSection.tsx`

**الوصف:** قسم البودكاست مع:
- غلاف البودكاست
- قائمة الحلقات
- مشغل صوتي
- روابط المنصات (Apple Podcasts, Spotify)

**الاستخدام:**
```tsx
import PodcastSection from '@/components/homepage/PodcastSection';

<PodcastSection
  cover="/podcast-cover.jpg"
  title="اسم البودكاست"
  description="وصف البودكاست"
  episodes={[
    { id: '1', title: 'الحلقة 1', duration: '25:30', publishDate: '2024-12-04', audioUrl: '#' },
  ]}
/>
```

---

### 12. LiveSection (قسم البث المباشر)
**الموقع:** `components/homepage/LiveSection.tsx`

**الوصف:** قسم البث المباشر مع:
- مؤشر "مباشر الآن"
- مشغل البث
- جدول البرامج القادمة

**الاستخدام:**
```tsx
import LiveSection from '@/components/homepage/LiveSection';

<LiveSection
  isLive={true}
  liveTitle="عنوان البث"
  liveUrl="/live-url"
  upcomingEvents={[
    { id: '1', title: 'برنامج قادم', startTime: '8:00 PM', thumbnail: '/thumb.jpg' },
  ]}
/>
```

---

### 13. PartnersSection (قسم الشركاء)
**الموقع:** `components/homepage/PartnersSection.tsx`

**الوصف:** عرض شعارات الشركاء ووكالات الأنباء

**الاستخدام:**
```tsx
import PartnersSection from '@/components/homepage/PartnersSection';

const partners = [
  { id: '1', name: 'Reuters', logo: '/reuters.png', url: '#' },
];

<PartnersSection partners={partners} />
```

---

### 14. SocialHub (مركز التواصل الاجتماعي)
**الموقع:** `components/homepage/SocialHub.tsx`

**الوصف:** عرض محتوى من:
- Twitter
- Facebook
- Instagram
- هاشتاقات رائجة

**الاستخدام:**
```tsx
import SocialHub from '@/components/homepage/SocialHub';

<SocialHub />
```

---

### 15. NewsletterSection (قسم النشرة الإخبارية)
**الموقع:** `components/homepage/NewsletterSection.tsx`

**الوصف:** قسم الاشتراك في النشرة الإخبارية مع:
- خيار نوع النشرة (يومية، أسبوعية، عاجلة)
- حقل البريد الإلكتروني
- رسالة تأكيد

**الاستخدام:**
```tsx
import NewsletterSection from '@/components/homepage/NewsletterSection';

<NewsletterSection />
```

---

### 16. AppsSection (قسم التطبيقات)
**الموقع:** `components/homepage/AppsSection.tsx`

**الوصف:** قسم تحميل التطبيقات مع:
- صورة التطبيق على الهاتف
- مميزات التطبيق
- روابط App Store و Google Play

**الاستخدام:**
```tsx
import AppsSection from '@/components/homepage/AppsSection';

<AppsSection />
```

---

### 17. Floating Elements (العناصر العائمة)
**الموقع:** `components/homepage/FloatingElements.tsx`

**المكونات:**

#### BackToTop (زر العودة للأعلى)
```tsx
import { BackToTop } from '@/components/homepage/FloatingElements';

<BackToTop />
```

#### ChatWidget (نافذة الدردشة)
```tsx
import { ChatWidget } from '@/components/homepage/FloatingElements';

<ChatWidget />
```

#### CookieNotice (إشعار الكوكيز)
```tsx
import { CookieNotice } from '@/components/homepage/FloatingElements';

<CookieNotice />
```

---

## 🎨 التخصيص

### الألوان
يمكنك تخصيص الألوان في `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#1a365d',
    light: '#2b6cb0',
    dark: '#1a202c',
  },
  secondary: '#c53030',
  accent: '#d69e2e',
}
```

### الرسوم المتحركة
تم إضافة رسوم متحركة مخصصة:
- `animate-fade-in`: ظهور تدريجي
- `animate-slide-left`: انزلاق من اليمين
- `animate-pulse-slow`: نبض بطيء

---

## 📱 الاستجابة للأجهزة

جميع المكونات مُصممة بطريقة responsive تعمل على:
- الهواتف المحمولة (< 640px)
- الأجهزة اللوحية (640px - 1024px)
- أجهزة سطح المكتب (> 1024px)

---

## 🌍 الترجمة

جميع النصوص قابلة للترجمة باستخدام `next-intl`. أضف المفاتيح التالية إلى ملفات الترجمة:

```json
{
  "sections": {
    "videos": "الفيديوهات",
    "opinions": "آراء ومقالات",
    "features": "تقارير وتحقيقات",
    "photoGalleries": "معرض الصور",
    "podcast": "بودكاست",
    "live": "البث المباشر",
    "partners": "شركاؤنا",
    "socialMedia": "تواصل معنا"
  },
  "news": {
    "breaking": "عاجل"
  },
  "apps": {
    "title": "حمّل التطبيق",
    "subtitle": "احصل على آخر الأخبار على هاتفك",
    "feature1": "إشعارات فورية",
    "feature2": "قراءة بدون اتصال",
    "feature3": "واجهة سريعة"
  }
}
```

---

## 🚀 مثال صفحة شاملة

انظر إلى `app/[locale]/comprehensive-homepage.tsx` لمثال كامل على كيفية دمج جميع المكونات في صفحة واحدة.

---

## 📝 ملاحظات

1. **البيانات الوهمية**: معظم المكونات تستخدم بيانات وهمية في المثال. استبدلها ببيانات حقيقية من API.
2. **التحسين**: تأكد من تحسين الصور باستخدام Next.js Image component.
3. **الأمان**: تحقق من المدخلات قبل إرسالها إلى API (خاصة النماذج).
4. **الأداء**: استخدم lazy loading للمكونات الثقيلة.

---

**تم إنشاؤه بواسطة:** Claude AI
**التاريخ:** 4 ديسمبر 2024
**الإصدار:** 1.0.0
