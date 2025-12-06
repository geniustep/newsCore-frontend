/**
 * NewsCore Template Engine - Core Types
 * نظام القوالب المتقدم لـ NewsCore
 * 
 * @version 2.0.0
 * @author NewsCore Team
 */

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * قيمة متجاوبة لمختلف أحجام الشاشات
 */
export interface ResponsiveValue<T> {
  desktop: T;
  tablet?: T;
  mobile?: T;
}

/**
 * Breakpoints للتصميم المتجاوب
 */
export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export const BREAKPOINTS = {
  desktop: 1280,
  tablet: 768,
  mobile: 0,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DATA SOURCE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * أنماط مصادر البيانات
 */
export type DataSourceMode =
  | 'latest'           // آخر المقالات
  | 'category'         // من قسم معين
  | 'categories'       // من عدة أقسام
  | 'tag'              // من وسم
  | 'tags'             // من عدة وسوم
  | 'author'           // من كاتب
  | 'authors'          // من عدة كتّاب
  | 'manual'           // اختيار يدوي
  | 'trending'         // الأكثر قراءة
  | 'featured'         // المميزة
  | 'breaking'         // العاجلة
  | 'related'          // ذات صلة (للمقالات)
  | 'mixed';           // مزيج من المصادر

/**
 * ترتيب النتائج
 */
export type SortBy = 
  | 'publishedAt'      // تاريخ النشر
  | 'updatedAt'        // تاريخ التحديث
  | 'views'            // المشاهدات
  | 'comments'         // التعليقات
  | 'shares'           // المشاركات
  | 'manual'           // ترتيب يدوي
  | 'random';          // عشوائي

export type SortOrder = 'asc' | 'desc';

/**
 * فلاتر إضافية للبيانات
 */
export interface DataSourceFilters {
  hasImage?: boolean;
  hasVideo?: boolean;
  hasGallery?: boolean;
  minReadingTime?: number;
  maxReadingTime?: number;
  language?: string;
  status?: 'published' | 'featured' | 'pinned';
}

/**
 * نطاق التاريخ
 */
export interface DateRange {
  from?: string;  // ISO date string
  to?: string;    // ISO date string
  preset?: 'today' | 'yesterday' | 'this_week' | 'this_month' | 'this_year';
}

/**
 * مصدر البيانات للـ Block
 */
export interface DataSource {
  mode: DataSourceMode;
  
  // معرفات المصادر
  categoryIds?: string[];
  tagIds?: string[];
  authorIds?: string[];
  articleIds?: string[];      // للاختيار اليدوي
  
  // إعدادات الاستعلام
  limit: number;
  offset?: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  
  // استثناءات
  excludeIds?: string[];      // استثناء مقالات معينة
  excludeFromOther?: boolean; // استثناء المقالات المعروضة في blocks أخرى
  
  // فلاتر
  dateRange?: DateRange;
  filters?: DataSourceFilters;
  
  // للـ mixed mode
  mixedSources?: Array<{
    mode: Exclude<DataSourceMode, 'mixed'>;
    categoryIds?: string[];
    tagIds?: string[];
    weight?: number;  // نسبة المقالات من هذا المصدر
  }>;
}

/**
 * DataSource الافتراضي
 */
export const DEFAULT_DATA_SOURCE: DataSource = {
  mode: 'latest',
  limit: 6,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * أنواع الـ Blocks المتاحة
 */
export type BlockType =
  // عرض المقالات
  | 'article-grid'
  | 'article-list'
  | 'article-slider'
  | 'article-tabs'
  | 'article-carousel'
  | 'article-masonry'
  
  // Hero sections
  | 'big-hero'
  | 'featured-story'
  | 'spotlight'
  
  // أخبار عاجلة
  | 'breaking-ticker'
  | 'breaking-banner'
  
  // التنقل
  | 'category-nav'
  | 'tag-cloud'
  | 'breadcrumb'
  
  // إعلانات
  | 'ad-unit'
  | 'ad-banner'
  | 'ad-native'
  
  // محتوى مخصص
  | 'html-embed'
  | 'video-player'
  | 'video-playlist'
  | 'photo-gallery'
  | 'podcast-player'
  | 'live-stream'
  
  // كتّاب ورأي
  | 'opinion-cards'
  | 'author-spotlight'
  | 'author-list'
  
  // تفاعل
  | 'newsletter-form'
  | 'social-feed'
  | 'comments-section'
  | 'poll-widget'
  
  // معلومات
  | 'weather-widget'
  | 'currency-ticker'
  | 'stocks-ticker'
  | 'sports-scores'
  
  // تخطيط
  | 'spacer'
  | 'divider'
  | 'heading'
  | 'text-block';

/**
 * فئات الـ Blocks
 */
export type BlockCategory =
  | 'articles'
  | 'hero'
  | 'breaking'
  | 'navigation'
  | 'ads'
  | 'media'
  | 'authors'
  | 'engagement'
  | 'widgets'
  | 'layout';

/**
 * معلومات الـ Block في الـ Registry
 */
export interface BlockMeta {
  type: BlockType;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: BlockCategory;
  icon: string;
  hasDataSource: boolean;
  defaultVariant: string;
  variants: string[];
  preview: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * معلومات الـ Variant
 */
export interface BlockVariant {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  preview: string;
  defaultConfig: Partial<BlockConfig>;
}

/**
 * مواضع الصورة
 */
export type ImagePosition = 
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'background'
  | 'overlay'
  | 'none';

/**
 * نسب الصورة
 */
export type ImageAspectRatio = 
  | '21:9'
  | '16:9'
  | '4:3'
  | '3:2'
  | '1:1'
  | '3:4'
  | '9:16'
  | 'auto'
  | 'original';

/**
 * ملاءمة الصورة
 */
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';

/**
 * أحجام النص
 */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/**
 * أحجام المسافات
 */
export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * الظلال
 */
export type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * استدارة الحواف
 */
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * إعدادات عرض عناصر المقال
 */
export interface ArticleDisplayConfig {
  showImage: boolean;
  showTitle: boolean;
  showExcerpt: boolean;
  showCategory: boolean;
  showAuthor: boolean;
  showAuthorImage: boolean;
  showDate: boolean;
  showReadingTime: boolean;
  showViews: boolean;
  showComments: boolean;
  showShareButtons: boolean;
  showTags: boolean;
}

/**
 * إعدادات الصورة
 */
export interface ImageConfig {
  aspectRatio: ImageAspectRatio;
  position: ImagePosition;
  fit: ImageFit;
  lazy: boolean;
  placeholder: 'blur' | 'empty' | 'shimmer';
  overlay?: {
    type: 'gradient' | 'solid' | 'none';
    color?: string;
    opacity?: number;
    direction?: 'to-top' | 'to-bottom' | 'to-left' | 'to-right';
  };
  hover?: {
    scale?: number;
    brightness?: number;
    overlay?: boolean;
  };
}

/**
 * إعدادات النص
 */
export interface TextConfig {
  titleSize: ResponsiveValue<TextSize>;
  titleLines: 1 | 2 | 3 | 4;
  titleWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  excerptSize: ResponsiveValue<TextSize>;
  excerptLines: 1 | 2 | 3 | 4 | 5;
  metaSize: TextSize;
  alignment: 'start' | 'center' | 'end';
}

/**
 * إعدادات الشبكة/التخطيط
 */
export interface GridConfig {
  columns: ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6>;
  rows?: number;
  gap: ResponsiveValue<SpacingSize>;
  columnGap?: ResponsiveValue<SpacingSize>;
  rowGap?: ResponsiveValue<SpacingSize>;
}

/**
 * إعدادات البطاقة
 */
export interface CardConfig {
  style: 'flat' | 'elevated' | 'outlined' | 'glass';
  shadow: ShadowSize;
  radius: BorderRadius;
  padding: ResponsiveValue<SpacingSize>;
  hoverEffect: 'none' | 'lift' | 'glow' | 'border';
}

/**
 * إعدادات الخلفية
 */
export interface BackgroundConfig {
  type: 'none' | 'color' | 'gradient' | 'image' | 'pattern' | 'video';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    direction?: string;
  };
  image?: {
    url: string;
    position?: string;
    size?: 'cover' | 'contain' | 'auto';
    repeat?: boolean;
    fixed?: boolean;
  };
  pattern?: string;
  overlay?: {
    color: string;
    opacity: number;
  };
}

/**
 * إعدادات الهوامش والحشو
 */
export interface SpacingConfig {
  margin: ResponsiveValue<{
    top: SpacingSize;
    bottom: SpacingSize;
    left: SpacingSize;
    right: SpacingSize;
  }>;
  padding: ResponsiveValue<{
    top: SpacingSize;
    bottom: SpacingSize;
    left: SpacingSize;
    right: SpacingSize;
  }>;
}

/**
 * إعدادات الحدود
 */
export interface BorderConfig {
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  radius?: BorderRadius;
  sides?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
}

/**
 * إعدادات الرسوم المتحركة
 */
export interface AnimationConfig {
  enabled: boolean;
  type: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'flip';
  duration: number;
  delay?: number;
  stagger?: number;  // للعناصر المتعددة
  trigger: 'load' | 'scroll' | 'hover';
  once?: boolean;
}

/**
 * إعدادات الإظهار/الإخفاء
 */
export interface VisibilityConfig {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
  loggedInOnly?: boolean;
  guestOnly?: boolean;
  schedule?: {
    startDate?: string;
    endDate?: string;
    daysOfWeek?: number[];  // 0-6
    timeRange?: {
      start: string;  // HH:mm
      end: string;    // HH:mm
    };
  };
}

/**
 * إعدادات الـ Block الكاملة
 */
export interface BlockConfig {
  // عرض العناصر
  display: Partial<ArticleDisplayConfig>;
  
  // الصورة
  image: Partial<ImageConfig>;
  
  // النص
  text: Partial<TextConfig>;
  
  // الشبكة
  grid: Partial<GridConfig>;
  
  // البطاقة
  card: Partial<CardConfig>;
  
  // الخلفية
  background?: BackgroundConfig;
  
  // الهوامش
  spacing?: Partial<SpacingConfig>;
  
  // الحدود
  border?: BorderConfig;
  
  // الرسوم المتحركة
  animation?: AnimationConfig;
  
  // الإظهار
  visibility?: VisibilityConfig;
  
  // إعدادات إضافية خاصة بالنوع
  custom?: Record<string, unknown>;
}

/**
 * الإعدادات الافتراضية للـ Block
 */
export const DEFAULT_BLOCK_CONFIG: BlockConfig = {
  display: {
    showImage: true,
    showTitle: true,
    showExcerpt: true,
    showCategory: true,
    showAuthor: false,
    showAuthorImage: false,
    showDate: true,
    showReadingTime: false,
    showViews: false,
    showComments: false,
    showShareButtons: false,
    showTags: false,
  },
  image: {
    aspectRatio: '16:9',
    position: 'top',
    fit: 'cover',
    lazy: true,
    placeholder: 'shimmer',
    hover: {
      scale: 1.05,
    },
  },
  text: {
    titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
    titleLines: 2,
    titleWeight: 'bold',
    excerptSize: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
    excerptLines: 2,
    metaSize: 'xs',
    alignment: 'start',
  },
  grid: {
    columns: { desktop: 3, tablet: 2, mobile: 1 },
    gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
  },
  card: {
    style: 'elevated',
    shadow: 'md',
    radius: 'lg',
    padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
    hoverEffect: 'lift',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * تعريف الـ Block الكامل
 */
export interface Block {
  id: string;
  type: BlockType;
  variant: string;
  name?: string;           // اسم مخصص للـ block
  nameAr?: string;
  
  // مصدر البيانات
  dataSource?: DataSource;
  
  // الإعدادات
  config: Partial<BlockConfig>;
  
  // إعدادات responsive (تتجاوز config)
  responsive?: {
    tablet?: Partial<BlockConfig>;
    mobile?: Partial<BlockConfig>;
  };
  
  // موقع في الشبكة
  gridArea?: {
    column?: { start: number; span: number };
    row?: { start: number; span: number };
  };
  
  // metadata
  createdAt?: string;
  updatedAt?: string;
  isLocked?: boolean;      // لا يمكن تعديله
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * أنماط عنوان القسم
 */
export type SectionHeaderStyle = 
  | 'simple'
  | 'bordered'
  | 'decorated'
  | 'gradient'
  | 'badge'
  | 'underlined'
  | 'boxed';

/**
 * عنوان القسم
 */
export interface SectionHeader {
  enabled: boolean;
  title: string;
  titleAr: string;
  subtitle?: string;
  subtitleAr?: string;
  style: SectionHeaderStyle;
  icon?: string;
  showMore: boolean;
  moreText?: string;
  moreTextAr?: string;
  moreLink?: string;
  alignment: 'start' | 'center' | 'end';
  accentColor?: string;
}

/**
 * أنواع حاويات القسم
 */
export type ContainerType = 'full' | 'wide' | 'normal' | 'narrow' | 'custom';

export const CONTAINER_WIDTHS: Record<ContainerType, string> = {
  full: '100%',
  wide: '1536px',
  normal: '1280px',
  narrow: '1024px',
  custom: 'var(--container-width)',
};

/**
 * تعريف القسم
 */
export interface Section {
  id: string;
  name: string;
  nameAr: string;
  
  // العنوان
  header?: SectionHeader;
  
  // التخطيط (جديد - لدعم Sidebar والأعمدة)
  layout?: {
    type: 'full-width' | 'sidebar-right' | 'sidebar-left' | 'two-columns' | 'three-columns';
    sidebarWidth?: string;  // مثل '320px' أو '25%'
    mainWidth?: string;
    columnsRatio?: string;  // مثل '2:1' أو '1:1:1'
  };
  
  // الحاوية
  container: ContainerType;
  customWidth?: string;
  
  // الشبكة
  grid?: {
    columns?: ResponsiveValue<number>;  // 1-12
    rows?: number | 'auto';
    gap?: ResponsiveValue<SpacingSize>;
    template?: string;  // CSS grid-template-areas
  };
  
  // الخلفية
  background?: BackgroundConfig;
  
  // الهوامش والحشو
  padding?: ResponsiveValue<{
    top: SpacingSize;
    bottom: SpacingSize;
    left: SpacingSize;
    right: SpacingSize;
  }>;
  margin?: ResponsiveValue<{
    top: SpacingSize;
    bottom: SpacingSize;
  }>;
  
  // الحدود
  border?: {
    top?: string;
    bottom?: string;
  };
  
  // البلوكات
  blocks: Block[];
  
  // الإظهار
  visibility?: VisibilityConfig;
  
  // metadata
  order: number;
  createdAt?: string;
  updatedAt?: string;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
}

/**
 * القسم الافتراضي
 */
export const DEFAULT_SECTION: Omit<Section, 'id' | 'name' | 'nameAr' | 'blocks' | 'order'> = {
  container: 'normal',
  grid: {
    columns: { desktop: 12, tablet: 12, mobile: 12 },
    gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
  },
  padding: {
    desktop: { top: 'xl', bottom: 'xl', left: 'md', right: 'md' },
    tablet: { top: 'lg', bottom: 'lg', left: 'md', right: 'md' },
    mobile: { top: 'md', bottom: 'md', left: 'sm', right: 'sm' },
  },
  margin: {
    desktop: { top: 'none', bottom: 'none' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * أنواع القوالب
 */
export type TemplateType =
  | 'home'
  | 'category'
  | 'tag'
  | 'author'
  | 'search'
  | 'article'
  | 'page'
  | 'error'
  | 'archive'
  | 'custom';

/**
 * أنواع التخطيط
 */
export type LayoutType =
  | 'full-width'
  | 'sidebar-right'
  | 'sidebar-left'
  | 'sidebar-both'
  | 'centered';

/**
 * إعدادات المنطقة (Region)
 */
export interface RegionConfig {
  enabled: boolean;
  sticky?: boolean;
  stickyOffset?: number;
  blocks?: Block[];
  className?: string;
}

/**
 * المناطق المتاحة
 */
export interface TemplateRegions {
  header: RegionConfig;
  topBar?: RegionConfig;
  breakingNews?: RegionConfig;
  beforeContent?: RegionConfig;
  sidebar?: RegionConfig;
  sidebarSecondary?: RegionConfig;
  afterContent?: RegionConfig;
  footer: RegionConfig;
  floating?: RegionConfig;
}

/**
 * إعدادات التخطيط
 */
export interface LayoutConfig {
  type: LayoutType;
  sidebarWidth?: string;
  sidebarSecondaryWidth?: string;
  maxWidth?: string;
  minHeight?: string;
}

/**
 * إعدادات SEO
 */
export interface TemplateSEO {
  titleTemplate: string;
  titleTemplateAr?: string;
  descriptionTemplate?: string;
  descriptionTemplateAr?: string;
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * إعدادات القالب
 */
export interface TemplateSettings {
  showBreakingNews: boolean;
  showBreadcrumb: boolean;
  showLastUpdated: boolean;
  infiniteScroll: boolean;
  loadMoreButton: boolean;
  stickyHeader: boolean;
  stickySidebar: boolean;
  backToTop: boolean;
  readingProgress: boolean;  // شريط تقدم القراءة للمقالات
}

/**
 * تعريف القالب الكامل
 */
export interface Template {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: TemplateType;
  
  // الوراثة
  extends?: string;
  
  // التخطيط
  layout: LayoutConfig;
  
  // المناطق
  regions: Partial<TemplateRegions>;
  
  // الأقسام
  sections: Section[];
  
  // الإعدادات
  settings: TemplateSettings;
  
  // SEO
  seo?: TemplateSEO;
  
  // التصميم
  styles?: {
    cssVariables?: Record<string, string>;
    customCSS?: string;
  };
  
  // metadata
  preview: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isDefault: boolean;
  isActive: boolean;
  isLocked?: boolean;
  
  // للـ multi-tenant
  tenantId?: string;
}

/**
 * القالب الافتراضي
 */
export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  showBreakingNews: true,
  showBreadcrumb: true,
  showLastUpdated: false,
  infiniteScroll: false,
  loadMoreButton: true,
  stickyHeader: true,
  stickySidebar: true,
  backToTop: true,
  readingProgress: false,
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUILDER STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * عنصر محدد في الـ Builder
 */
export type SelectedElement =
  | { type: 'template'; id: string }
  | { type: 'section'; id: string }
  | { type: 'block'; id: string; sectionId: string };

/**
 * تاريخ التغييرات للـ Undo/Redo
 */
export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  actionAr: string;
  state: Template;
}

/**
 * حالة الـ Builder
 */
export interface BuilderState {
  // القالب الحالي
  template: Template | null;
  originalTemplate: Template | null;  // للمقارنة
  
  // التحديد
  selectedElement: SelectedElement | null;
  hoveredElement: SelectedElement | null;
  
  // السحب والإفلات
  isDragging: boolean;
  draggedItem: { type: 'block' | 'section'; data: unknown } | null;
  dropTarget: { sectionId?: string; index: number } | null;
  
  // العرض
  viewportSize: Breakpoint;
  zoom: number;
  showGrid: boolean;
  showOutlines: boolean;
  previewMode: boolean;
  
  // الحالة
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: string | null;
  
  // التاريخ
  history: HistoryEntry[];
  historyIndex: number;
  
  // الأخطاء
  errors: Array<{ id: string; message: string; messageAr: string }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * استجابة API للقوالب
 */
export interface TemplateApiResponse {
  template: Template;
  resolvedData?: Record<string, unknown>;  // البيانات المحللة للـ blocks
}

/**
 * طلب حفظ القالب
 */
export interface SaveTemplateRequest {
  template: Template;
  publish?: boolean;
}

/**
 * استجابة حفظ القالب
 */
export interface SaveTemplateResponse {
  success: boolean;
  template?: Template;
  errors?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Deep Partial - يجعل كل الخصائص اختيارية بشكل عميق
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * معرف فريد
 */
export type UniqueId = string;

/**
 * دالة إنشاء معرف فريد
 */
export function generateId(prefix: string = ''): UniqueId {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * التحقق من أن القيمة responsive
 */
export function isResponsiveValue<T>(value: unknown): value is ResponsiveValue<T> {
  return value && typeof value === 'object' && 'desktop' in value;
}

/**
 * الحصول على القيمة حسب الـ breakpoint
 */
export function getResponsiveValue<T>(
  value: T | ResponsiveValue<T>,
  breakpoint: Breakpoint
): T {
  if (!isResponsiveValue(value)) {
    return value;
  }
  
  if (breakpoint === 'mobile' && value.mobile !== undefined) {
    return value.mobile;
  }
  if (breakpoint === 'tablet' && value.tablet !== undefined) {
    return value.tablet;
  }
  return value.desktop;
}
