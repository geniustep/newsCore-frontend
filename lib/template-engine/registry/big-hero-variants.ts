/**
 * NewsCore Template Engine - Big Hero Variants
 * تنويعات القسم الرئيسي (Hero)
 */

import type { BlockVariant } from '../types';

/**
 * جميع variants القسم الرئيسي
 * 8 تنويعات مختلفة للصفحة الرئيسية
 */
export const BIG_HERO_VARIANTS: BlockVariant[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Classic Heroes
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'hero-classic',
    name: 'Classic Hero',
    nameAr: 'البطل الكلاسيكي',
    description: 'Classic 60/40 split with main article and sidebar',
    descriptionAr: 'تقسيم كلاسيكي 60/40 مع مقال رئيسي وشريط جانبي',
    preview: '/variants/big-hero/hero-classic.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: true,
        showDate: true,
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.5,
        },
      },
      text: {
        titleSize: { desktop: '2xl', tablet: 'xl', mobile: 'lg' },
        titleLines: 3,
        excerptLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'lg',
        radius: 'xl',
        hoverEffect: 'lift',
      },
      custom: {
        layout: 'classic',
        mainWidth: '60%',
        sidebarWidth: '40%',
        sidebarArticles: 4,
        mainConfig: {
          showExcerpt: true,
          showAuthor: true,
          showAuthorImage: true,
          showReadingTime: true,
        },
        sidebarConfig: {
          showExcerpt: false,
          showAuthor: false,
          imagePosition: 'left',
          imageWidth: '100px',
        },
      },
    },
  },
  
  {
    id: 'hero-newspaper',
    name: 'Newspaper Hero',
    nameAr: 'بطل الجريدة',
    description: 'Traditional newspaper style with 3 columns',
    descriptionAr: 'أسلوب الجريدة التقليدي مع 3 أعمدة',
    preview: '/variants/big-hero/hero-newspaper.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showDate: true,
      },
      image: {
        aspectRatio: '4:3',
        position: 'top',
      },
      text: {
        titleSize: { desktop: 'xl', tablet: 'lg', mobile: 'md' },
        titleLines: 3,
        excerptLines: 2,
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'none',
        hoverEffect: 'none',
      },
      custom: {
        layout: 'newspaper',
        columns: 3,
        columnRatio: '3-6-3',
        mainColumn: 'center',
        showColumnDividers: true,
        dividerStyle: 'solid',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Magazine Heroes
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'hero-magazine',
    name: 'Magazine Hero',
    nameAr: 'بطل المجلة',
    description: 'Full-width main with bottom grid',
    descriptionAr: 'رئيسي بعرض كامل مع شبكة سفلية',
    preview: '/variants/big-hero/hero-magazine.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: true,
        showDate: true,
      },
      image: {
        aspectRatio: '21:9',
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.7,
        },
        hover: {
          scale: 1.02,
        },
      },
      text: {
        titleSize: { desktop: '3xl', tablet: '2xl', mobile: 'xl' },
        titleLines: 2,
        excerptLines: 2,
        alignment: 'start',
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'none',
        hoverEffect: 'none',
      },
      custom: {
        layout: 'magazine',
        mainHeight: { desktop: '70vh', tablet: '50vh', mobile: '40vh' },
        minHeight: '400px',
        bottomGrid: {
          enabled: true,
          columns: { desktop: 4, tablet: 2, mobile: 1 },
          articles: 4,
          gap: 'md',
        },
        textPosition: 'bottom-start',
        textWidth: '60%',
        showGradientOverlay: true,
      },
    },
  },
  
  {
    id: 'hero-immersive',
    name: 'Immersive Hero',
    nameAr: 'البطل الغامر',
    description: 'Full-screen immersive hero',
    descriptionAr: 'بطل غامر بملء الشاشة',
    preview: '/variants/big-hero/hero-immersive.png',
    defaultConfig: {
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
      image: {
        aspectRatio: 'auto',
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.8,
        },
      },
      text: {
        titleSize: { desktop: '4xl', tablet: '3xl', mobile: '2xl' },
        titleLines: 3,
        excerptLines: 3,
        alignment: 'center',
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'none',
        hoverEffect: 'none',
      },
      custom: {
        layout: 'immersive',
        fullScreen: true,
        minHeight: '100vh',
        textPosition: 'center',
        textMaxWidth: '800px',
        scrollIndicator: true,
        parallax: true,
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Mosaic Heroes
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'hero-mosaic',
    name: 'Mosaic Hero',
    nameAr: 'بطل الفسيفساء',
    description: 'Mosaic grid with 1 large + 4 small',
    descriptionAr: 'شبكة فسيفسائية مع 1 كبير + 4 صغار',
    preview: '/variants/big-hero/hero-mosaic.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      image: {
        aspectRatio: '16:9',
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.6,
        },
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
      },
      card: {
        style: 'flat',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'none',
      },
      custom: {
        layout: 'mosaic',
        pattern: '1-big-4-small',
        mainPosition: 'left',
        mainSpan: { rows: 2, cols: 2 },
        gap: 'sm',
        height: { desktop: '500px', tablet: '400px', mobile: '600px' },
        mainConfig: {
          titleSize: { desktop: '2xl', tablet: 'xl', mobile: 'lg' },
          showExcerpt: true,
          excerptLines: 2,
        },
      },
    },
  },
  
  {
    id: 'hero-bento',
    name: 'Bento Hero',
    nameAr: 'بطل بينتو',
    description: 'Bento box style grid layout',
    descriptionAr: 'تخطيط شبكي على طراز صندوق بينتو',
    preview: '/variants/big-hero/hero-bento.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: false,
      },
      image: {
        aspectRatio: 'auto',
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.5,
        },
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'sm' },
        titleLines: 2,
      },
      card: {
        style: 'flat',
        shadow: 'sm',
        radius: 'xl',
        hoverEffect: 'none',
      },
      custom: {
        layout: 'bento',
        pattern: 'asymmetric',
        areas: `
          "main main side1"
          "main main side2"
          "bottom1 bottom2 side3"
        `,
        gap: 'md',
        height: { desktop: '600px', tablet: '500px', mobile: '800px' },
        items: [
          { area: 'main', titleSize: '2xl', showExcerpt: true },
          { area: 'side1', titleSize: 'md' },
          { area: 'side2', titleSize: 'md' },
          { area: 'side3', titleSize: 'md' },
          { area: 'bottom1', titleSize: 'md' },
          { area: 'bottom2', titleSize: 'md' },
        ],
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Slider Heroes
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'hero-slider',
    name: 'Slider Hero',
    nameAr: 'بطل السلايدر',
    description: 'Full-width sliding hero carousel',
    descriptionAr: 'سلايدر بطل بعرض كامل',
    preview: '/variants/big-hero/hero-slider.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: true,
        showDate: true,
      },
      image: {
        aspectRatio: '21:9',
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.7,
        },
      },
      text: {
        titleSize: { desktop: '3xl', tablet: '2xl', mobile: 'xl' },
        titleLines: 2,
        excerptLines: 2,
        alignment: 'start',
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'none',
        hoverEffect: 'none',
      },
      custom: {
        layout: 'slider',
        height: { desktop: '70vh', tablet: '50vh', mobile: '40vh' },
        minHeight: '400px',
        autoplay: true,
        autoplayDelay: 5000,
        showArrows: true,
        showDots: true,
        dotsPosition: 'bottom',
        transition: 'fade',
        transitionDuration: 500,
        pauseOnHover: true,
        textPosition: 'bottom-start',
        textWidth: '60%',
        thumbnails: {
          enabled: true,
          position: 'bottom',
          count: 5,
        },
      },
    },
  },
  
  {
    id: 'hero-cards-slider',
    name: 'Cards Slider Hero',
    nameAr: 'سلايدر البطاقات',
    description: 'Sliding cards with peek preview',
    descriptionAr: 'بطاقات منزلقة مع معاينة جزئية',
    preview: '/variants/big-hero/hero-cards-slider.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showAuthor: false,
        showDate: true,
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
      },
      text: {
        titleSize: { desktop: 'xl', tablet: 'lg', mobile: 'md' },
        titleLines: 2,
        excerptLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'xl',
        radius: '2xl',
        hoverEffect: 'lift',
      },
      custom: {
        layout: 'cards-slider',
        visibleCards: { desktop: 2.5, tablet: 1.5, mobile: 1.1 },
        cardWidth: { desktop: '500px', tablet: '400px', mobile: '300px' },
        gap: 'lg',
        centered: true,
        loop: true,
        autoplay: false,
        showArrows: true,
        arrowStyle: 'rounded',
        showDots: true,
        activeScale: 1.05,
        inactiveOpacity: 0.7,
      },
    },
  },
];

/**
 * الحصول على variant محدد
 */
export function getBigHeroVariant(variantId: string): BlockVariant | undefined {
  return BIG_HERO_VARIANTS.find(v => v.id === variantId);
}

/**
 * الحصول على الـ variants حسب النوع
 */
export function getBigHeroVariantsByType(type: 'classic' | 'magazine' | 'mosaic' | 'slider'): BlockVariant[] {
  const types: Record<string, string[]> = {
    classic: ['hero-classic', 'hero-newspaper'],
    magazine: ['hero-magazine', 'hero-immersive'],
    mosaic: ['hero-mosaic', 'hero-bento'],
    slider: ['hero-slider', 'hero-cards-slider'],
  };
  
  const ids = types[type] || [];
  return BIG_HERO_VARIANTS.filter(v => ids.includes(v.id));
}
