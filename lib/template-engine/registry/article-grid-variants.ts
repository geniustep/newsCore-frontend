/**
 * NewsCore Template Engine - Article Grid Variants
 * تنويعات شبكة المقالات (أكثر Block استخداماً)
 */

import type { BlockVariant } from '../types';

/**
 * جميع variants شبكة المقالات
 * 15 تنويع مختلف يغطي جميع سيناريوهات التصميم
 */
export const ARTICLE_GRID_VARIANTS: BlockVariant[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Standard Grids (1-5)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'grid-1',
    name: 'Standard Grid',
    nameAr: 'الشبكة القياسية',
    description: 'Classic 3-column grid with image on top',
    descriptionAr: 'شبكة كلاسيكية من 3 أعمدة مع الصورة في الأعلى',
    preview: '/variants/article-grid/grid-1.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 3, tablet: 2, mobile: 1 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
        excerptLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'lift',
      },
    },
  },
  
  {
    id: 'grid-2',
    name: 'Compact Grid',
    nameAr: 'الشبكة المدمجة',
    description: '4-column compact grid without excerpt',
    descriptionAr: 'شبكة مدمجة من 4 أعمدة بدون مقتطف',
    preview: '/variants/article-grid/grid-2.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 4, tablet: 2, mobile: 1 },
        gap: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      image: {
        aspectRatio: '4:3',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
        titleLines: 2,
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'md',
        hoverEffect: 'none',
      },
    },
  },
  
  {
    id: 'grid-3',
    name: 'Large Cards Grid',
    nameAr: 'شبكة البطاقات الكبيرة',
    description: '2-column grid with large cards and full details',
    descriptionAr: 'شبكة من عمودين مع بطاقات كبيرة وتفاصيل كاملة',
    preview: '/variants/article-grid/grid-3.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 2, tablet: 2, mobile: 1 },
        gap: { desktop: 'xl', tablet: 'lg', mobile: 'md' },
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: true,
        showAuthorImage: true,
        showDate: true,
        showReadingTime: true,
      },
      text: {
        titleSize: { desktop: 'xl', tablet: 'lg', mobile: 'lg' },
        titleLines: 2,
        excerptLines: 3,
      },
      card: {
        style: 'elevated',
        shadow: 'lg',
        radius: 'xl',
        hoverEffect: 'lift',
      },
    },
  },
  
  {
    id: 'grid-4',
    name: 'Minimal Grid',
    nameAr: 'الشبكة البسيطة',
    description: 'Clean minimal grid with subtle styling',
    descriptionAr: 'شبكة نظيفة بتصميم بسيط',
    preview: '/variants/article-grid/grid-4.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 3, tablet: 2, mobile: 1 },
        gap: { desktop: 'xl', tablet: 'lg', mobile: 'md' },
      },
      image: {
        aspectRatio: '3:2',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: false,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
        titleWeight: 'medium',
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'none',
        hoverEffect: 'none',
      },
    },
  },
  
  {
    id: 'grid-5',
    name: 'Dense Grid',
    nameAr: 'الشبكة الكثيفة',
    description: '5-column dense grid for maximum content',
    descriptionAr: 'شبكة كثيفة من 5 أعمدة لعرض أكبر قدر من المحتوى',
    preview: '/variants/article-grid/grid-5.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 5, tablet: 3, mobile: 2 },
        gap: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
      },
      image: {
        aspectRatio: '1:1',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: false,
        showDate: false,
      },
      text: {
        titleSize: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
        titleLines: 2,
      },
      card: {
        style: 'flat',
        shadow: 'sm',
        radius: 'md',
        hoverEffect: 'glow',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Featured First Grids (6-8)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'grid-6',
    name: 'Featured First',
    nameAr: 'المميز أولاً',
    description: 'First article large, rest in grid',
    descriptionAr: 'المقال الأول كبير والباقي في شبكة',
    preview: '/variants/article-grid/grid-6.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 3, tablet: 2, mobile: 1 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
        excerptLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'lift',
      },
      custom: {
        layout: 'featured-first',
        featuredSpan: { desktop: 2, tablet: 2, mobile: 1 },
        featuredConfig: {
          image: { aspectRatio: '16:9' },
          text: {
            titleSize: { desktop: '2xl', tablet: 'xl', mobile: 'lg' },
            excerptLines: 3,
          },
          display: {
            showAuthor: true,
            showReadingTime: true,
          },
        },
      },
    },
  },
  
  {
    id: 'grid-7',
    name: 'Hero + Grid',
    nameAr: 'البطل + الشبكة',
    description: 'Full-width hero followed by grid',
    descriptionAr: 'بطل بعرض كامل متبوع بشبكة',
    preview: '/variants/article-grid/grid-7.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 4, tablet: 2, mobile: 1 },
        gap: { desktop: 'md', tablet: 'md', mobile: 'sm' },
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
        titleLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'sm',
        radius: 'lg',
        hoverEffect: 'lift',
      },
      custom: {
        layout: 'hero-grid',
        heroConfig: {
          fullWidth: true,
          height: '400px',
          image: {
            aspectRatio: 'auto',
            position: 'background',
            overlay: {
              type: 'gradient',
              direction: 'to-top',
              opacity: 0.7,
            },
          },
          text: {
            titleSize: { desktop: '3xl', tablet: '2xl', mobile: 'xl' },
            alignment: 'start',
          },
          display: {
            showAuthor: true,
            showReadingTime: true,
            showExcerpt: true,
          },
        },
      },
    },
  },
  
  {
    id: 'grid-8',
    name: 'Split Featured',
    nameAr: 'المميز المقسوم',
    description: 'Two featured articles side by side, rest below',
    descriptionAr: 'مقالان مميزان جنباً إلى جنب والباقي أسفل',
    preview: '/variants/article-grid/grid-8.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 4, tablet: 2, mobile: 1 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
        titleLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'lift',
      },
      custom: {
        layout: 'split-featured',
        featuredCount: 2,
        featuredConfig: {
          image: { aspectRatio: '16:9' },
          text: {
            titleSize: { desktop: 'xl', tablet: 'lg', mobile: 'md' },
            excerptLines: 2,
          },
          display: {
            showExcerpt: true,
            showAuthor: true,
          },
        },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Horizontal/Side Image Grids (9-11)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'grid-9',
    name: 'Side Image Grid',
    nameAr: 'شبكة الصورة الجانبية',
    description: 'Grid with image on the side',
    descriptionAr: 'شبكة مع الصورة على الجانب',
    preview: '/variants/article-grid/grid-9.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 2, tablet: 1, mobile: 1 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      image: {
        aspectRatio: '4:3',
        position: 'left',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
        excerptLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'lift',
      },
      custom: {
        imageWidth: '40%',
      },
    },
  },
  
  {
    id: 'grid-10',
    name: 'Alternating Grid',
    nameAr: 'الشبكة المتناوبة',
    description: 'Alternating image position (left/right)',
    descriptionAr: 'موضع الصورة متناوب (يسار/يمين)',
    preview: '/variants/article-grid/grid-10.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 1, tablet: 1, mobile: 1 },
        gap: { desktop: 'xl', tablet: 'lg', mobile: 'md' },
      },
      image: {
        aspectRatio: '16:9',
        position: 'left',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: true,
        showAuthorImage: true,
        showDate: true,
        showReadingTime: true,
      },
      text: {
        titleSize: { desktop: 'xl', tablet: 'lg', mobile: 'lg' },
        titleLines: 2,
        excerptLines: 3,
      },
      card: {
        style: 'elevated',
        shadow: 'lg',
        radius: 'xl',
        hoverEffect: 'lift',
      },
      custom: {
        layout: 'alternating',
        imageWidth: '50%',
      },
    },
  },
  
  {
    id: 'grid-11',
    name: 'Compact Horizontal',
    nameAr: 'الأفقي المدمج',
    description: 'Compact horizontal cards',
    descriptionAr: 'بطاقات أفقية مدمجة',
    preview: '/variants/article-grid/grid-11.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 2, tablet: 2, mobile: 1 },
        gap: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      image: {
        aspectRatio: '1:1',
        position: 'left',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
        titleLines: 2,
      },
      card: {
        style: 'outlined',
        shadow: 'none',
        radius: 'lg',
        hoverEffect: 'border',
      },
      custom: {
        imageWidth: '120px',
        imageHeight: '120px',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Overlay/Background Image Grids (12-13)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'grid-12',
    name: 'Overlay Grid',
    nameAr: 'شبكة الطبقات',
    description: 'Text overlay on background image',
    descriptionAr: 'نص فوق صورة الخلفية',
    preview: '/variants/article-grid/grid-12.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 3, tablet: 2, mobile: 1 },
        gap: { desktop: 'md', tablet: 'md', mobile: 'sm' },
      },
      image: {
        aspectRatio: '4:3',
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.7,
        },
        hover: {
          scale: 1.05,
          brightness: 1.1,
        },
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
        alignment: 'start',
      },
      card: {
        style: 'flat',
        shadow: 'lg',
        radius: 'xl',
        hoverEffect: 'none',
      },
      custom: {
        textPosition: 'bottom',
        textColor: 'white',
        categoryStyle: 'badge',
      },
    },
  },
  
  {
    id: 'grid-13',
    name: 'Magazine Overlay',
    nameAr: 'طبقات المجلة',
    description: 'Magazine-style overlay with varied sizes',
    descriptionAr: 'تصميم طبقات على طراز المجلات بأحجام متنوعة',
    preview: '/variants/article-grid/grid-13.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 4, tablet: 2, mobile: 1 },
        gap: { desktop: 'sm', tablet: 'sm', mobile: 'sm' },
      },
      image: {
        aspectRatio: '3:4',
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.6,
        },
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: false,
      },
      text: {
        titleSize: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
        titleLines: 3,
        alignment: 'start',
      },
      card: {
        style: 'flat',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'none',
      },
      custom: {
        layout: 'magazine',
        variedHeights: true,
        textPosition: 'bottom',
        textColor: 'white',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Special Layouts (14-15)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'grid-14',
    name: 'Masonry Grid',
    nameAr: 'شبكة الفسيفساء',
    description: 'Pinterest-style masonry layout',
    descriptionAr: 'تخطيط فسيفسائي على طراز Pinterest',
    preview: '/variants/article-grid/grid-14.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 3, tablet: 2, mobile: 1 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      image: {
        aspectRatio: 'original',
        position: 'top',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 3,
        excerptLines: 4,
      },
      card: {
        style: 'elevated',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'lift',
      },
      custom: {
        layout: 'masonry',
      },
    },
  },
  
  {
    id: 'grid-15',
    name: 'News Ticker Grid',
    nameAr: 'شبكة الأخبار السريعة',
    description: 'Compact grid for quick news scanning',
    descriptionAr: 'شبكة مدمجة للتصفح السريع للأخبار',
    preview: '/variants/article-grid/grid-15.png',
    defaultConfig: {
      grid: {
        columns: { desktop: 1, tablet: 1, mobile: 1 },
        gap: { desktop: 'xs', tablet: 'xs', mobile: 'xs' },
      },
      image: {
        aspectRatio: '16:9',
        position: 'left',
      },
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
        titleLines: 1,
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'none',
        hoverEffect: 'none',
        padding: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
      },
      custom: {
        layout: 'ticker',
        imageWidth: '100px',
        showDivider: true,
        dividerColor: 'border-gray-200',
      },
    },
  },
];

/**
 * الحصول على variant محدد
 */
export function getArticleGridVariant(variantId: string): BlockVariant | undefined {
  return ARTICLE_GRID_VARIANTS.find(v => v.id === variantId);
}

/**
 * الحصول على الـ variants حسب الفئة
 */
export function getArticleGridVariantsByCategory(category: 'standard' | 'featured' | 'horizontal' | 'overlay' | 'special'): BlockVariant[] {
  const categories: Record<string, string[]> = {
    standard: ['grid-1', 'grid-2', 'grid-3', 'grid-4', 'grid-5'],
    featured: ['grid-6', 'grid-7', 'grid-8'],
    horizontal: ['grid-9', 'grid-10', 'grid-11'],
    overlay: ['grid-12', 'grid-13'],
    special: ['grid-14', 'grid-15'],
  };
  
  const ids = categories[category] || [];
  return ARTICLE_GRID_VARIANTS.filter(v => ids.includes(v.id));
}
