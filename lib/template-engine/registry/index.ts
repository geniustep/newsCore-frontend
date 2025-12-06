/**
 * NewsCore Template Engine - Block Registry
 * سجل جميع الـ Blocks المتاحة في النظام
 */

import type { BlockMeta, BlockType, BlockCategory, BlockVariant } from '../types';
import { ARTICLE_GRID_VARIANTS } from './article-grid-variants';
import { BIG_HERO_VARIANTS } from './big-hero-variants';
import { ARTICLE_LIST_VARIANTS } from './article-list-variants';
import { ARTICLE_SLIDER_VARIANTS } from './article-slider-variants';

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * معلومات جميع الـ Blocks
 */
export const BLOCK_REGISTRY: Record<BlockType, BlockMeta> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // Articles Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'article-grid': {
    type: 'article-grid',
    name: 'Article Grid',
    nameAr: 'شبكة المقالات',
    description: 'Display articles in a responsive grid layout',
    descriptionAr: 'عرض المقالات في تخطيط شبكي متجاوب',
    category: 'articles',
    icon: 'LayoutGrid',
    hasDataSource: true,
    defaultVariant: 'grid-1',
    variants: ARTICLE_GRID_VARIANTS.map(v => v.id),
    preview: '/blocks/article-grid.png',
  },
  
  'article-list': {
    type: 'article-list',
    name: 'Article List',
    nameAr: 'قائمة المقالات',
    description: 'Display articles in a vertical list',
    descriptionAr: 'عرض المقالات في قائمة عمودية',
    category: 'articles',
    icon: 'List',
    hasDataSource: true,
    defaultVariant: 'list-1',
    variants: ARTICLE_LIST_VARIANTS.map(v => v.id),
    preview: '/blocks/article-list.png',
  },
  
  'article-slider': {
    type: 'article-slider',
    name: 'Article Slider',
    nameAr: 'سلايدر المقالات',
    description: 'Carousel slider for articles',
    descriptionAr: 'عرض المقالات في سلايدر متحرك',
    category: 'articles',
    icon: 'GalleryHorizontal',
    hasDataSource: true,
    defaultVariant: 'slider-1',
    variants: ARTICLE_SLIDER_VARIANTS.map(v => v.id),
    preview: '/blocks/article-slider.png',
  },
  
  'article-tabs': {
    type: 'article-tabs',
    name: 'Article Tabs',
    nameAr: 'تبويبات المقالات',
    description: 'Tabbed article display by category',
    descriptionAr: 'عرض المقالات في تبويبات حسب القسم',
    category: 'articles',
    icon: 'PanelTop',
    hasDataSource: true,
    defaultVariant: 'tabs-1',
    variants: ['tabs-1', 'tabs-2', 'tabs-3'],
    preview: '/blocks/article-tabs.png',
  },
  
  'article-carousel': {
    type: 'article-carousel',
    name: 'Article Carousel',
    nameAr: 'دوّار المقالات',
    description: 'Multi-item carousel for articles',
    descriptionAr: 'عرض عدة مقالات في دوّار',
    category: 'articles',
    icon: 'CircleDot',
    hasDataSource: true,
    defaultVariant: 'carousel-1',
    variants: ['carousel-1', 'carousel-2', 'carousel-3'],
    preview: '/blocks/article-carousel.png',
  },
  
  'article-masonry': {
    type: 'article-masonry',
    name: 'Article Masonry',
    nameAr: 'فسيفساء المقالات',
    description: 'Pinterest-style masonry layout',
    descriptionAr: 'تخطيط فسيفسائي على طراز Pinterest',
    category: 'articles',
    icon: 'LayoutDashboard',
    hasDataSource: true,
    defaultVariant: 'masonry-1',
    variants: ['masonry-1', 'masonry-2'],
    preview: '/blocks/article-masonry.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Hero Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'big-hero': {
    type: 'big-hero',
    name: 'Big Hero',
    nameAr: 'البطل الكبير',
    description: 'Large hero section with featured articles',
    descriptionAr: 'قسم رئيسي كبير مع المقالات المميزة',
    category: 'hero',
    icon: 'Maximize',
    hasDataSource: true,
    defaultVariant: 'hero-classic',
    variants: BIG_HERO_VARIANTS.map(v => v.id),
    preview: '/blocks/big-hero.png',
  },
  
  'featured-story': {
    type: 'featured-story',
    name: 'Featured Story',
    nameAr: 'القصة المميزة',
    description: 'Single featured article with large image',
    descriptionAr: 'مقال مميز واحد مع صورة كبيرة',
    category: 'hero',
    icon: 'Star',
    hasDataSource: true,
    defaultVariant: 'story-1',
    variants: ['story-1', 'story-2', 'story-3'],
    preview: '/blocks/featured-story.png',
  },
  
  'spotlight': {
    type: 'spotlight',
    name: 'Spotlight',
    nameAr: 'تحت الضوء',
    description: 'Spotlight section with main and side articles',
    descriptionAr: 'قسم تحت الضوء مع مقال رئيسي ومقالات جانبية',
    category: 'hero',
    icon: 'Lightbulb',
    hasDataSource: true,
    defaultVariant: 'spotlight-1',
    variants: ['spotlight-1', 'spotlight-2'],
    preview: '/blocks/spotlight.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Breaking News Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'breaking-ticker': {
    type: 'breaking-ticker',
    name: 'Breaking News Ticker',
    nameAr: 'شريط الأخبار العاجلة',
    description: 'Scrolling breaking news ticker',
    descriptionAr: 'شريط متحرك للأخبار العاجلة',
    category: 'breaking',
    icon: 'Zap',
    hasDataSource: true,
    defaultVariant: 'ticker-1',
    variants: ['ticker-1', 'ticker-2', 'ticker-3'],
    preview: '/blocks/breaking-ticker.png',
  },
  
  'breaking-banner': {
    type: 'breaking-banner',
    name: 'Breaking News Banner',
    nameAr: 'بانر الأخبار العاجلة',
    description: 'Fixed breaking news banner',
    descriptionAr: 'بانر ثابت للأخبار العاجلة',
    category: 'breaking',
    icon: 'AlertTriangle',
    hasDataSource: true,
    defaultVariant: 'banner-1',
    variants: ['banner-1', 'banner-2'],
    preview: '/blocks/breaking-banner.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'category-nav': {
    type: 'category-nav',
    name: 'Category Navigation',
    nameAr: 'تصفح الأقسام',
    description: 'Category navigation menu',
    descriptionAr: 'قائمة تصفح الأقسام',
    category: 'navigation',
    icon: 'FolderTree',
    hasDataSource: false,
    defaultVariant: 'nav-1',
    variants: ['nav-1', 'nav-2', 'nav-3'],
    preview: '/blocks/category-nav.png',
  },
  
  'tag-cloud': {
    type: 'tag-cloud',
    name: 'Tag Cloud',
    nameAr: 'سحابة الوسوم',
    description: 'Popular tags cloud',
    descriptionAr: 'سحابة الوسوم الشائعة',
    category: 'navigation',
    icon: 'Tags',
    hasDataSource: false,
    defaultVariant: 'cloud-1',
    variants: ['cloud-1', 'cloud-2'],
    preview: '/blocks/tag-cloud.png',
  },
  
  'breadcrumb': {
    type: 'breadcrumb',
    name: 'Breadcrumb',
    nameAr: 'مسار التنقل',
    description: 'Navigation breadcrumb',
    descriptionAr: 'مسار التنقل في الموقع',
    category: 'navigation',
    icon: 'ChevronRight',
    hasDataSource: false,
    defaultVariant: 'breadcrumb-1',
    variants: ['breadcrumb-1', 'breadcrumb-2'],
    preview: '/blocks/breadcrumb.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Ad Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'ad-unit': {
    type: 'ad-unit',
    name: 'Ad Unit',
    nameAr: 'وحدة إعلانية',
    description: 'Advertisement unit',
    descriptionAr: 'وحدة إعلانية',
    category: 'ads',
    icon: 'Megaphone',
    hasDataSource: false,
    defaultVariant: 'ad-1',
    variants: ['ad-1', 'ad-2', 'ad-3'],
    preview: '/blocks/ad-unit.png',
  },
  
  'ad-banner': {
    type: 'ad-banner',
    name: 'Ad Banner',
    nameAr: 'بانر إعلاني',
    description: 'Full-width ad banner',
    descriptionAr: 'بانر إعلاني بعرض كامل',
    category: 'ads',
    icon: 'Image',
    hasDataSource: false,
    defaultVariant: 'banner-1',
    variants: ['banner-1', 'banner-2'],
    preview: '/blocks/ad-banner.png',
  },
  
  'ad-native': {
    type: 'ad-native',
    name: 'Native Ad',
    nameAr: 'إعلان أصلي',
    description: 'Native advertising that matches content style',
    descriptionAr: 'إعلان أصلي يتناسب مع أسلوب المحتوى',
    category: 'ads',
    icon: 'Newspaper',
    hasDataSource: false,
    defaultVariant: 'native-1',
    variants: ['native-1', 'native-2'],
    preview: '/blocks/ad-native.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Media Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'html-embed': {
    type: 'html-embed',
    name: 'HTML Embed',
    nameAr: 'كود HTML',
    description: 'Embed custom HTML code',
    descriptionAr: 'تضمين كود HTML مخصص',
    category: 'media',
    icon: 'Code',
    hasDataSource: false,
    defaultVariant: 'embed-1',
    variants: ['embed-1'],
    preview: '/blocks/html-embed.png',
  },
  
  'video-player': {
    type: 'video-player',
    name: 'Video Player',
    nameAr: 'مشغل الفيديو',
    description: 'Single video player',
    descriptionAr: 'مشغل فيديو منفرد',
    category: 'media',
    icon: 'Play',
    hasDataSource: false,
    defaultVariant: 'player-1',
    variants: ['player-1', 'player-2'],
    preview: '/blocks/video-player.png',
  },
  
  'video-playlist': {
    type: 'video-playlist',
    name: 'Video Playlist',
    nameAr: 'قائمة الفيديوهات',
    description: 'Video playlist with thumbnails',
    descriptionAr: 'قائمة فيديوهات مع صور مصغرة',
    category: 'media',
    icon: 'PlaySquare',
    hasDataSource: true,
    defaultVariant: 'playlist-1',
    variants: ['playlist-1', 'playlist-2'],
    preview: '/blocks/video-playlist.png',
  },
  
  'photo-gallery': {
    type: 'photo-gallery',
    name: 'Photo Gallery',
    nameAr: 'معرض الصور',
    description: 'Image gallery with lightbox',
    descriptionAr: 'معرض صور مع عرض مكبر',
    category: 'media',
    icon: 'Images',
    hasDataSource: false,
    defaultVariant: 'gallery-1',
    variants: ['gallery-1', 'gallery-2', 'gallery-3'],
    preview: '/blocks/photo-gallery.png',
  },
  
  'podcast-player': {
    type: 'podcast-player',
    name: 'Podcast Player',
    nameAr: 'مشغل البودكاست',
    description: 'Podcast episode player',
    descriptionAr: 'مشغل حلقات البودكاست',
    category: 'media',
    icon: 'Headphones',
    hasDataSource: false,
    defaultVariant: 'podcast-1',
    variants: ['podcast-1', 'podcast-2'],
    preview: '/blocks/podcast-player.png',
  },
  
  'live-stream': {
    type: 'live-stream',
    name: 'Live Stream',
    nameAr: 'البث المباشر',
    description: 'Live streaming video player',
    descriptionAr: 'مشغل البث المباشر',
    category: 'media',
    icon: 'Radio',
    hasDataSource: false,
    defaultVariant: 'live-1',
    variants: ['live-1', 'live-2'],
    preview: '/blocks/live-stream.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Authors Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'opinion-cards': {
    type: 'opinion-cards',
    name: 'Opinion Cards',
    nameAr: 'بطاقات الرأي',
    description: 'Opinion articles with author photos',
    descriptionAr: 'مقالات الرأي مع صور الكتّاب',
    category: 'authors',
    icon: 'MessageSquare',
    hasDataSource: true,
    defaultVariant: 'opinion-1',
    variants: ['opinion-1', 'opinion-2', 'opinion-3'],
    preview: '/blocks/opinion-cards.png',
  },
  
  'author-spotlight': {
    type: 'author-spotlight',
    name: 'Author Spotlight',
    nameAr: 'كاتب مميز',
    description: 'Featured author with articles',
    descriptionAr: 'كاتب مميز مع مقالاته',
    category: 'authors',
    icon: 'UserCircle',
    hasDataSource: true,
    defaultVariant: 'spotlight-1',
    variants: ['spotlight-1', 'spotlight-2'],
    preview: '/blocks/author-spotlight.png',
  },
  
  'author-list': {
    type: 'author-list',
    name: 'Author List',
    nameAr: 'قائمة الكتّاب',
    description: 'List of authors/columnists',
    descriptionAr: 'قائمة الكتّاب والمحررين',
    category: 'authors',
    icon: 'Users',
    hasDataSource: false,
    defaultVariant: 'authors-1',
    variants: ['authors-1', 'authors-2'],
    preview: '/blocks/author-list.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Engagement Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'newsletter-form': {
    type: 'newsletter-form',
    name: 'Newsletter Form',
    nameAr: 'نموذج النشرة البريدية',
    description: 'Email newsletter subscription form',
    descriptionAr: 'نموذج الاشتراك في النشرة البريدية',
    category: 'engagement',
    icon: 'Mail',
    hasDataSource: false,
    defaultVariant: 'newsletter-1',
    variants: ['newsletter-1', 'newsletter-2', 'newsletter-3'],
    preview: '/blocks/newsletter-form.png',
  },
  
  'social-feed': {
    type: 'social-feed',
    name: 'Social Feed',
    nameAr: 'خلاصة التواصل',
    description: 'Social media feed integration',
    descriptionAr: 'تكامل مع وسائل التواصل الاجتماعي',
    category: 'engagement',
    icon: 'Share2',
    hasDataSource: false,
    defaultVariant: 'social-1',
    variants: ['social-1', 'social-2'],
    preview: '/blocks/social-feed.png',
  },
  
  'comments-section': {
    type: 'comments-section',
    name: 'Comments Section',
    nameAr: 'قسم التعليقات',
    description: 'Article comments section',
    descriptionAr: 'قسم التعليقات على المقالات',
    category: 'engagement',
    icon: 'MessageCircle',
    hasDataSource: false,
    defaultVariant: 'comments-1',
    variants: ['comments-1', 'comments-2'],
    preview: '/blocks/comments-section.png',
  },
  
  'poll-widget': {
    type: 'poll-widget',
    name: 'Poll Widget',
    nameAr: 'استطلاع رأي',
    description: 'Interactive poll/survey widget',
    descriptionAr: 'ودجة استطلاع رأي تفاعلية',
    category: 'engagement',
    icon: 'BarChart2',
    hasDataSource: false,
    defaultVariant: 'poll-1',
    variants: ['poll-1', 'poll-2'],
    preview: '/blocks/poll-widget.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Widget Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'weather-widget': {
    type: 'weather-widget',
    name: 'Weather Widget',
    nameAr: 'ودجة الطقس',
    description: 'Current weather display',
    descriptionAr: 'عرض حالة الطقس',
    category: 'widgets',
    icon: 'Cloud',
    hasDataSource: false,
    defaultVariant: 'weather-1',
    variants: ['weather-1', 'weather-2'],
    preview: '/blocks/weather-widget.png',
  },
  
  'currency-ticker': {
    type: 'currency-ticker',
    name: 'Currency Ticker',
    nameAr: 'شريط العملات',
    description: 'Currency exchange rates ticker',
    descriptionAr: 'شريط أسعار العملات',
    category: 'widgets',
    icon: 'DollarSign',
    hasDataSource: false,
    defaultVariant: 'currency-1',
    variants: ['currency-1', 'currency-2'],
    preview: '/blocks/currency-ticker.png',
  },
  
  'stocks-ticker': {
    type: 'stocks-ticker',
    name: 'Stocks Ticker',
    nameAr: 'شريط الأسهم',
    description: 'Stock market ticker',
    descriptionAr: 'شريط أسعار الأسهم',
    category: 'widgets',
    icon: 'TrendingUp',
    hasDataSource: false,
    defaultVariant: 'stocks-1',
    variants: ['stocks-1', 'stocks-2'],
    preview: '/blocks/stocks-ticker.png',
  },
  
  'sports-scores': {
    type: 'sports-scores',
    name: 'Sports Scores',
    nameAr: 'نتائج المباريات',
    description: 'Live sports scores widget',
    descriptionAr: 'ودجة نتائج المباريات الحية',
    category: 'widgets',
    icon: 'Trophy',
    hasDataSource: false,
    defaultVariant: 'sports-1',
    variants: ['sports-1', 'sports-2'],
    preview: '/blocks/sports-scores.png',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Layout Blocks
  // ─────────────────────────────────────────────────────────────────────────────
  'spacer': {
    type: 'spacer',
    name: 'Spacer',
    nameAr: 'مسافة فارغة',
    description: 'Add vertical spacing',
    descriptionAr: 'إضافة مسافة عمودية',
    category: 'layout',
    icon: 'MoveVertical',
    hasDataSource: false,
    defaultVariant: 'spacer-1',
    variants: ['spacer-1'],
    preview: '/blocks/spacer.png',
  },
  
  'divider': {
    type: 'divider',
    name: 'Divider',
    nameAr: 'فاصل',
    description: 'Horizontal divider line',
    descriptionAr: 'خط فاصل أفقي',
    category: 'layout',
    icon: 'Minus',
    hasDataSource: false,
    defaultVariant: 'divider-1',
    variants: ['divider-1', 'divider-2', 'divider-3'],
    preview: '/blocks/divider.png',
  },
  
  'heading': {
    type: 'heading',
    name: 'Heading',
    nameAr: 'عنوان',
    description: 'Section heading text',
    descriptionAr: 'نص عنوان القسم',
    category: 'layout',
    icon: 'Type',
    hasDataSource: false,
    defaultVariant: 'heading-1',
    variants: ['heading-1', 'heading-2', 'heading-3'],
    preview: '/blocks/heading.png',
  },
  
  'text-block': {
    type: 'text-block',
    name: 'Text Block',
    nameAr: 'كتلة نصية',
    description: 'Rich text content block',
    descriptionAr: 'كتلة محتوى نصي منسق',
    category: 'layout',
    icon: 'AlignLeft',
    hasDataSource: false,
    defaultVariant: 'text-1',
    variants: ['text-1'],
    preview: '/blocks/text-block.png',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANTS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * جميع الـ variants مفهرسة حسب نوع الـ Block
 */
export const VARIANTS_REGISTRY: Record<string, BlockVariant[]> = {
  'article-grid': ARTICLE_GRID_VARIANTS,
  'big-hero': BIG_HERO_VARIANTS,
  'article-list': ARTICLE_LIST_VARIANTS,
  'article-slider': ARTICLE_SLIDER_VARIANTS,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * الحصول على معلومات Block
 */
export function getBlockMeta(type: BlockType): BlockMeta | undefined {
  return BLOCK_REGISTRY[type];
}

/**
 * الحصول على جميع الـ Blocks حسب الفئة
 */
export function getBlocksByCategory(category: BlockCategory): BlockMeta[] {
  return Object.values(BLOCK_REGISTRY).filter(block => block.category === category);
}

/**
 * الحصول على variants الـ Block
 */
export function getBlockVariants(type: BlockType): BlockVariant[] {
  return VARIANTS_REGISTRY[type] || [];
}

/**
 * الحصول على variant محدد
 */
export function getVariant(type: BlockType, variantId: string): BlockVariant | undefined {
  const variants = getBlockVariants(type);
  return variants.find(v => v.id === variantId);
}

/**
 * الحصول على الـ variant الافتراضي
 */
export function getDefaultVariant(type: BlockType): BlockVariant | undefined {
  const meta = getBlockMeta(type);
  if (!meta) return undefined;
  return getVariant(type, meta.defaultVariant);
}

/**
 * التحقق من أن الـ Block يحتاج DataSource
 */
export function blockHasDataSource(type: BlockType): boolean {
  return BLOCK_REGISTRY[type]?.hasDataSource ?? false;
}

/**
 * الحصول على فئات الـ Blocks
 */
export function getBlockCategories(): Array<{ id: BlockCategory; name: string; nameAr: string }> {
  return [
    { id: 'articles', name: 'Articles', nameAr: 'المقالات' },
    { id: 'hero', name: 'Hero Sections', nameAr: 'الأقسام الرئيسية' },
    { id: 'breaking', name: 'Breaking News', nameAr: 'الأخبار العاجلة' },
    { id: 'navigation', name: 'Navigation', nameAr: 'التنقل' },
    { id: 'ads', name: 'Advertising', nameAr: 'الإعلانات' },
    { id: 'media', name: 'Media', nameAr: 'الوسائط' },
    { id: 'authors', name: 'Authors', nameAr: 'الكتّاب' },
    { id: 'engagement', name: 'Engagement', nameAr: 'التفاعل' },
    { id: 'widgets', name: 'Widgets', nameAr: 'الودجات' },
    { id: 'layout', name: 'Layout', nameAr: 'التخطيط' },
  ];
}

// Re-export variants
export { ARTICLE_GRID_VARIANTS } from './article-grid-variants';
export { BIG_HERO_VARIANTS } from './big-hero-variants';
export { ARTICLE_LIST_VARIANTS } from './article-list-variants';
export { ARTICLE_SLIDER_VARIANTS } from './article-slider-variants';
