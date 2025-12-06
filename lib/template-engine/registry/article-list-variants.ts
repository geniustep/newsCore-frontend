/**
 * NewsCore Template Engine - Article List Variants
 * تنويعات قائمة المقالات
 */

import type { BlockVariant } from '../types';

/**
 * جميع variants قائمة المقالات
 * 8 تنويعات مختلفة
 */
export const ARTICLE_LIST_VARIANTS: BlockVariant[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Standard Lists
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'list-1',
    name: 'Standard List',
    nameAr: 'القائمة القياسية',
    description: 'Classic vertical list with thumbnails',
    descriptionAr: 'قائمة عمودية كلاسيكية مع صور مصغرة',
    preview: '/variants/article-list/list-1.png',
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
        style: 'flat',
        shadow: 'none',
        radius: 'lg',
        hoverEffect: 'none',
        padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      custom: {
        imageWidth: { desktop: '200px', tablet: '150px', mobile: '100px' },
        showDivider: true,
        dividerStyle: 'dashed',
      },
    },
  },
  
  {
    id: 'list-2',
    name: 'Compact List',
    nameAr: 'القائمة المدمجة',
    description: 'Compact list with small thumbnails',
    descriptionAr: 'قائمة مدمجة مع صور مصغرة صغيرة',
    preview: '/variants/article-list/list-2.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: false,
        showDate: true,
      },
      image: {
        aspectRatio: '1:1',
        position: 'left',
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
        padding: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
      },
      custom: {
        imageWidth: { desktop: '80px', tablet: '70px', mobile: '60px' },
        showDivider: true,
        dividerStyle: 'solid',
        dividerColor: 'gray-100',
      },
    },
  },
  
  {
    id: 'list-3',
    name: 'Numbered List',
    nameAr: 'القائمة المرقمة',
    description: 'List with large numbers',
    descriptionAr: 'قائمة مع أرقام كبيرة',
    preview: '/variants/article-list/list-3.png',
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
        position: 'left',
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
        padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      custom: {
        showNumber: true,
        numberStyle: 'large',
        numberSize: { desktop: '3xl', tablet: '2xl', mobile: 'xl' },
        numberColor: 'primary',
        numberPosition: 'start',
        imageWidth: { desktop: '150px', tablet: '120px', mobile: '100px' },
        showDivider: true,
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Featured Lists
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'list-4',
    name: 'Featured First List',
    nameAr: 'القائمة بمقال مميز',
    description: 'First article featured, rest in list',
    descriptionAr: 'المقال الأول مميز والباقي في قائمة',
    preview: '/variants/article-list/list-4.png',
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
        titleSize: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
        titleLines: 2,
        excerptLines: 2,
      },
      card: {
        style: 'elevated',
        shadow: 'md',
        radius: 'lg',
        hoverEffect: 'lift',
        padding: { desktop: 'none', tablet: 'none', mobile: 'none' },
      },
      custom: {
        layout: 'featured-first',
        featuredConfig: {
          image: { aspectRatio: '16:9', position: 'top' },
          text: {
            titleSize: { desktop: 'xl', tablet: 'lg', mobile: 'lg' },
            excerptLines: 3,
          },
          display: {
            showAuthor: true,
            showAuthorImage: true,
            showReadingTime: true,
          },
        },
        listConfig: {
          imageWidth: { desktop: '120px', tablet: '100px', mobile: '80px' },
          showDivider: true,
        },
      },
    },
  },
  
  {
    id: 'list-5',
    name: 'Timeline List',
    nameAr: 'قائمة الخط الزمني',
    description: 'List with timeline indicator',
    descriptionAr: 'قائمة مع مؤشر خط زمني',
    preview: '/variants/article-list/list-5.png',
    defaultConfig: {
      display: {
        showImage: true,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      image: {
        aspectRatio: '1:1',
        position: 'left',
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
        padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      },
      custom: {
        layout: 'timeline',
        showTimeline: true,
        timelinePosition: 'start',
        timelineColor: 'primary',
        timelineDotSize: 'md',
        showTimeAgo: true,
        imageWidth: { desktop: '100px', tablet: '80px', mobile: '60px' },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Special Lists
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'list-6',
    name: 'Card List',
    nameAr: 'قائمة البطاقات',
    description: 'Full card style list items',
    descriptionAr: 'عناصر قائمة بنمط البطاقة الكاملة',
    preview: '/variants/article-list/list-6.png',
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
        radius: 'xl',
        hoverEffect: 'lift',
        padding: { desktop: 'lg', tablet: 'md', mobile: 'sm' },
      },
      grid: {
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      custom: {
        imageWidth: { desktop: '40%', tablet: '35%', mobile: '100%' },
        mobileImagePosition: 'top',
      },
    },
  },
  
  {
    id: 'list-7',
    name: 'Minimal List',
    nameAr: 'القائمة البسيطة',
    description: 'Clean minimal list without images',
    descriptionAr: 'قائمة نظيفة بدون صور',
    preview: '/variants/article-list/list-7.png',
    defaultConfig: {
      display: {
        showImage: false,
        showTitle: true,
        showExcerpt: false,
        showCategory: true,
        showDate: true,
      },
      text: {
        titleSize: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
        titleLines: 1,
        titleWeight: 'medium',
      },
      card: {
        style: 'flat',
        shadow: 'none',
        radius: 'none',
        hoverEffect: 'none',
        padding: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
      },
      custom: {
        showBullet: true,
        bulletStyle: 'dot',
        bulletColor: 'primary',
        showDivider: true,
        dividerStyle: 'dashed',
      },
    },
  },
  
  {
    id: 'list-8',
    name: 'News Wire',
    nameAr: 'شريط الأخبار',
    description: 'Breaking news wire style',
    descriptionAr: 'أسلوب شريط الأخبار العاجلة',
    preview: '/variants/article-list/list-8.png',
    defaultConfig: {
      display: {
        showImage: false,
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
        padding: { desktop: 'xs', tablet: 'xs', mobile: 'xs' },
      },
      custom: {
        layout: 'wire',
        showTimestamp: true,
        timestampFormat: 'relative',
        showFlashIcon: true,
        flashIconColor: 'red',
        alternateBackground: true,
        compactMode: true,
      },
    },
  },
];

/**
 * الحصول على variant محدد
 */
export function getArticleListVariant(variantId: string): BlockVariant | undefined {
  return ARTICLE_LIST_VARIANTS.find(v => v.id === variantId);
}
