/**
 * NewsCore Template Engine - Article Slider Variants
 * تنويعات سلايدر المقالات
 */

import type { BlockVariant } from '../types';

/**
 * جميع variants سلايدر المقالات
 * 6 تنويعات مختلفة
 */
export const ARTICLE_SLIDER_VARIANTS: BlockVariant[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Full Width Sliders
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'slider-1',
    name: 'Full Width Slider',
    nameAr: 'سلايدر بعرض كامل',
    description: 'Full-width image slider with overlay text',
    descriptionAr: 'سلايدر صور بعرض كامل مع نص فوقها',
    preview: '/variants/article-slider/slider-1.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
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
        height: { desktop: '500px', tablet: '400px', mobile: '300px' },
        autoplay: true,
        autoplayDelay: 5000,
        loop: true,
        showArrows: true,
        arrowStyle: 'rounded',
        arrowSize: 'lg',
        showDots: true,
        dotsPosition: 'bottom-center',
        dotsStyle: 'line',
        transition: 'slide',
        transitionDuration: 500,
        pauseOnHover: true,
        textPosition: 'bottom-start',
        textMaxWidth: '60%',
      },
    },
  },
  
  {
    id: 'slider-2',
    name: 'Fade Slider',
    nameAr: 'سلايدر التلاشي',
    description: 'Smooth fade transition slider',
    descriptionAr: 'سلايدر بانتقال تلاشي سلس',
    preview: '/variants/article-slider/slider-2.png',
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
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.8,
        },
      },
      text: {
        titleSize: { desktop: '2xl', tablet: 'xl', mobile: 'lg' },
        titleLines: 2,
        excerptLines: 2,
        alignment: 'center',
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'xl',
        hoverEffect: 'none',
      },
      custom: {
        height: { desktop: '450px', tablet: '350px', mobile: '280px' },
        autoplay: true,
        autoplayDelay: 4000,
        loop: true,
        showArrows: true,
        arrowStyle: 'circle',
        showDots: true,
        dotsPosition: 'bottom-center',
        dotsStyle: 'dot',
        transition: 'fade',
        transitionDuration: 700,
        textPosition: 'center',
        textMaxWidth: '70%',
        showProgress: true,
        progressPosition: 'top',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Card Sliders
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'slider-3',
    name: 'Card Slider',
    nameAr: 'سلايدر البطاقات',
    description: 'Multiple cards sliding with peek',
    descriptionAr: 'بطاقات متعددة منزلقة مع معاينة',
    preview: '/variants/article-slider/slider-3.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showDate: true,
      },
      image: {
        aspectRatio: '16:9',
        position: 'top',
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
        excerptLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'md',
        radius: 'xl',
        hoverEffect: 'lift',
        padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      custom: {
        slidesPerView: { desktop: 3, tablet: 2, mobile: 1.2 },
        spaceBetween: { desktop: 24, tablet: 16, mobile: 12 },
        centeredSlides: false,
        loop: true,
        autoplay: false,
        showArrows: true,
        arrowStyle: 'rounded',
        showDots: false,
        freeMode: false,
        grabCursor: true,
      },
    },
  },
  
  {
    id: 'slider-4',
    name: 'Centered Slider',
    nameAr: 'السلايدر المركزي',
    description: 'Centered active slide with scaled effect',
    descriptionAr: 'الشريحة النشطة في المنتصف مع تأثير التكبير',
    preview: '/variants/article-slider/slider-4.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      image: {
        aspectRatio: '4:3',
        position: 'top',
      },
      text: {
        titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
        titleLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'lg',
        radius: 'xl',
        hoverEffect: 'none',
        padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      custom: {
        slidesPerView: { desktop: 2.5, tablet: 1.8, mobile: 1.3 },
        spaceBetween: { desktop: 30, tablet: 20, mobile: 15 },
        centeredSlides: true,
        loop: true,
        autoplay: true,
        autoplayDelay: 4000,
        showArrows: true,
        arrowStyle: 'minimal',
        showDots: true,
        dotsStyle: 'dash',
        effect: 'coverflow',
        coverflowRotate: 0,
        coverflowDepth: 100,
        coverflowScale: 0.9,
        activeSlideScale: 1.1,
        inactiveOpacity: 0.6,
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Special Sliders
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'slider-5',
    name: 'Thumbnail Slider',
    nameAr: 'سلايدر الصور المصغرة',
    description: 'Main slider with thumbnail navigation',
    descriptionAr: 'سلايدر رئيسي مع تصفح بالصور المصغرة',
    preview: '/variants/article-slider/slider-5.png',
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
        position: 'background',
        overlay: {
          type: 'gradient',
          direction: 'to-top',
          opacity: 0.7,
        },
      },
      text: {
        titleSize: { desktop: '2xl', tablet: 'xl', mobile: 'lg' },
        titleLines: 2,
        excerptLines: 2,
        alignment: 'start',
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'lg',
        hoverEffect: 'none',
      },
      custom: {
        height: { desktop: '500px', tablet: '400px', mobile: '300px' },
        loop: true,
        autoplay: true,
        autoplayDelay: 5000,
        showArrows: true,
        transition: 'slide',
        textPosition: 'bottom-start',
        textMaxWidth: '60%',
        thumbnails: {
          enabled: true,
          position: 'bottom',
          height: { desktop: '100px', tablet: '80px', mobile: '60px' },
          slidesPerView: { desktop: 5, tablet: 4, mobile: 3 },
          spaceBetween: 10,
          activeScale: 1.1,
          activeBorder: true,
          borderColor: 'primary',
        },
      },
    },
  },
  
  {
    id: 'slider-6',
    name: 'Vertical Slider',
    nameAr: 'السلايدر العمودي',
    description: 'Vertical sliding articles',
    descriptionAr: 'مقالات منزلقة عمودياً',
    preview: '/variants/article-slider/slider-6.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: true,
        showCategory: true,
        showDate: true,
      },
      image: {
        aspectRatio: '16:9',
        position: 'left',
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
        padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      custom: {
        direction: 'vertical',
        height: { desktop: '500px', tablet: '400px', mobile: '350px' },
        slidesPerView: { desktop: 2.5, tablet: 2, mobile: 1.5 },
        spaceBetween: 16,
        loop: true,
        autoplay: true,
        autoplayDelay: 3000,
        showArrows: true,
        arrowStyle: 'vertical',
        mousewheel: true,
        freeMode: true,
        imageWidth: '40%',
      },
    },
  },
];

/**
 * الحصول على variant محدد
 */
export function getArticleSliderVariant(variantId: string): BlockVariant | undefined {
  return ARTICLE_SLIDER_VARIANTS.find(v => v.id === variantId);
}
