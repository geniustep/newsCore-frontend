/**
 * NewsCore Template Engine - Block Schema
 * مخططات التحقق من صحة الـ Blocks
 */

import type { 
  BlockType, 
  BlockConfig, 
  DataSource,
} from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// FIELD TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'toggle'
  | 'select'
  | 'multi-select'
  | 'color'
  | 'image'
  | 'icon'
  | 'range'
  | 'responsive-number'
  | 'responsive-select'
  | 'spacing'
  | 'data-source'
  | 'articles-picker'
  | 'categories-picker'
  | 'tags-picker'
  | 'group';

export interface SelectOption {
  value: string;
  label: string;
  labelAr: string;
  icon?: string;
  preview?: string;
}

export interface FieldDefinition {
  id: string;
  type: FieldType;
  label: string;
  labelAr: string;
  description?: string;
  descriptionAr?: string;
  placeholder?: string;
  placeholderAr?: string;
  defaultValue?: unknown;
  required?: boolean;
  
  // للأرقام
  min?: number;
  max?: number;
  step?: number;
  
  // للقوائم المنسدلة
  options?: SelectOption[];
  
  // للـ responsive
  breakpoints?: ('desktop' | 'tablet' | 'mobile')[];
  
  // للمجموعات
  fields?: FieldDefinition[];
  
  // شروط الإظهار
  showIf?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_empty';
    value?: unknown;
  };
  
  // التحقق
  validation?: {
    pattern?: string;
    message?: string;
    messageAr?: string;
  };
}

export interface FieldGroup {
  id: string;
  label: string;
  labelAr: string;
  icon?: string;
  collapsed?: boolean;
  fields: FieldDefinition[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export interface BlockSchema {
  type: BlockType;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: string;
  
  // هل يحتاج مصدر بيانات
  hasDataSource: boolean;
  
  // مجموعات الحقول
  fieldGroups: FieldGroup[];
  
  // الإعدادات الافتراضية
  defaultConfig: Partial<BlockConfig>;
  defaultDataSource?: Partial<DataSource>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON FIELD OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const IMAGE_POSITION_OPTIONS: SelectOption[] = [
  { value: 'top', label: 'Top', labelAr: 'أعلى' },
  { value: 'bottom', label: 'Bottom', labelAr: 'أسفل' },
  { value: 'left', label: 'Left', labelAr: 'يسار' },
  { value: 'right', label: 'Right', labelAr: 'يمين' },
  { value: 'background', label: 'Background', labelAr: 'خلفية' },
  { value: 'overlay', label: 'Overlay', labelAr: 'طبقة علوية' },
  { value: 'none', label: 'None', labelAr: 'بدون' },
];

export const IMAGE_ASPECT_RATIO_OPTIONS: SelectOption[] = [
  { value: '16:9', label: '16:9 (Widescreen)', labelAr: '16:9 (شاشة عريضة)' },
  { value: '4:3', label: '4:3 (Standard)', labelAr: '4:3 (قياسي)' },
  { value: '3:2', label: '3:2', labelAr: '3:2' },
  { value: '1:1', label: '1:1 (Square)', labelAr: '1:1 (مربع)' },
  { value: '3:4', label: '3:4 (Portrait)', labelAr: '3:4 (عمودي)' },
  { value: '9:16', label: '9:16 (Vertical)', labelAr: '9:16 (عمودي طويل)' },
  { value: 'auto', label: 'Auto', labelAr: 'تلقائي' },
  { value: 'original', label: 'Original', labelAr: 'أصلي' },
];

export const TEXT_SIZE_OPTIONS: SelectOption[] = [
  { value: 'xs', label: 'Extra Small', labelAr: 'صغير جداً' },
  { value: 'sm', label: 'Small', labelAr: 'صغير' },
  { value: 'md', label: 'Medium', labelAr: 'متوسط' },
  { value: 'lg', label: 'Large', labelAr: 'كبير' },
  { value: 'xl', label: 'Extra Large', labelAr: 'كبير جداً' },
  { value: '2xl', label: '2X Large', labelAr: 'كبير جداً جداً' },
  { value: '3xl', label: '3X Large', labelAr: 'ضخم' },
  { value: '4xl', label: '4X Large', labelAr: 'ضخم جداً' },
];

export const SPACING_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None', labelAr: 'بدون' },
  { value: 'xs', label: 'Extra Small', labelAr: 'صغير جداً' },
  { value: 'sm', label: 'Small', labelAr: 'صغير' },
  { value: 'md', label: 'Medium', labelAr: 'متوسط' },
  { value: 'lg', label: 'Large', labelAr: 'كبير' },
  { value: 'xl', label: 'Extra Large', labelAr: 'كبير جداً' },
  { value: '2xl', label: '2X Large', labelAr: 'كبير جداً جداً' },
];

export const BORDER_RADIUS_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None', labelAr: 'بدون' },
  { value: 'sm', label: 'Small', labelAr: 'صغير' },
  { value: 'md', label: 'Medium', labelAr: 'متوسط' },
  { value: 'lg', label: 'Large', labelAr: 'كبير' },
  { value: 'xl', label: 'Extra Large', labelAr: 'كبير جداً' },
  { value: '2xl', label: '2X Large', labelAr: 'كبير جداً جداً' },
  { value: 'full', label: 'Full', labelAr: 'كامل' },
];

export const SHADOW_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None', labelAr: 'بدون' },
  { value: 'sm', label: 'Small', labelAr: 'صغير' },
  { value: 'md', label: 'Medium', labelAr: 'متوسط' },
  { value: 'lg', label: 'Large', labelAr: 'كبير' },
  { value: 'xl', label: 'Extra Large', labelAr: 'كبير جداً' },
  { value: '2xl', label: '2X Large', labelAr: 'كبير جداً جداً' },
];

export const CARD_STYLE_OPTIONS: SelectOption[] = [
  { value: 'flat', label: 'Flat', labelAr: 'مسطح' },
  { value: 'elevated', label: 'Elevated', labelAr: 'مرتفع' },
  { value: 'outlined', label: 'Outlined', labelAr: 'محدد' },
  { value: 'glass', label: 'Glass', labelAr: 'زجاجي' },
];

export const HOVER_EFFECT_OPTIONS: SelectOption[] = [
  { value: 'none', label: 'None', labelAr: 'بدون' },
  { value: 'lift', label: 'Lift', labelAr: 'رفع' },
  { value: 'glow', label: 'Glow', labelAr: 'توهج' },
  { value: 'border', label: 'Border', labelAr: 'حدود' },
];

export const COLUMN_OPTIONS: SelectOption[] = [
  { value: '1', label: '1 Column', labelAr: 'عمود واحد' },
  { value: '2', label: '2 Columns', labelAr: 'عمودان' },
  { value: '3', label: '3 Columns', labelAr: '3 أعمدة' },
  { value: '4', label: '4 Columns', labelAr: '4 أعمدة' },
  { value: '5', label: '5 Columns', labelAr: '5 أعمدة' },
  { value: '6', label: '6 Columns', labelAr: '6 أعمدة' },
];

export const TITLE_LINES_OPTIONS: SelectOption[] = [
  { value: '1', label: '1 Line', labelAr: 'سطر واحد' },
  { value: '2', label: '2 Lines', labelAr: 'سطران' },
  { value: '3', label: '3 Lines', labelAr: '3 أسطر' },
  { value: '4', label: '4 Lines', labelAr: '4 أسطر' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON FIELD GROUPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * مجموعة حقول عرض المقال
 */
export const DISPLAY_FIELDS: FieldGroup = {
  id: 'display',
  label: 'Display Options',
  labelAr: 'خيارات العرض',
  icon: 'Eye',
  fields: [
    {
      id: 'display.showImage',
      type: 'toggle',
      label: 'Show Image',
      labelAr: 'إظهار الصورة',
      defaultValue: true,
    },
    {
      id: 'display.showTitle',
      type: 'toggle',
      label: 'Show Title',
      labelAr: 'إظهار العنوان',
      defaultValue: true,
    },
    {
      id: 'display.showExcerpt',
      type: 'toggle',
      label: 'Show Excerpt',
      labelAr: 'إظهار المقتطف',
      defaultValue: true,
    },
    {
      id: 'display.showCategory',
      type: 'toggle',
      label: 'Show Category',
      labelAr: 'إظهار القسم',
      defaultValue: true,
    },
    {
      id: 'display.showAuthor',
      type: 'toggle',
      label: 'Show Author',
      labelAr: 'إظهار الكاتب',
      defaultValue: false,
    },
    {
      id: 'display.showAuthorImage',
      type: 'toggle',
      label: 'Show Author Image',
      labelAr: 'إظهار صورة الكاتب',
      defaultValue: false,
      showIf: { field: 'display.showAuthor', operator: 'equals', value: true },
    },
    {
      id: 'display.showDate',
      type: 'toggle',
      label: 'Show Date',
      labelAr: 'إظهار التاريخ',
      defaultValue: true,
    },
    {
      id: 'display.showReadingTime',
      type: 'toggle',
      label: 'Show Reading Time',
      labelAr: 'إظهار وقت القراءة',
      defaultValue: false,
    },
    {
      id: 'display.showViews',
      type: 'toggle',
      label: 'Show Views',
      labelAr: 'إظهار المشاهدات',
      defaultValue: false,
    },
    {
      id: 'display.showComments',
      type: 'toggle',
      label: 'Show Comments Count',
      labelAr: 'إظهار عدد التعليقات',
      defaultValue: false,
    },
  ],
};

/**
 * مجموعة حقول الصورة
 */
export const IMAGE_FIELDS: FieldGroup = {
  id: 'image',
  label: 'Image Settings',
  labelAr: 'إعدادات الصورة',
  icon: 'Image',
  fields: [
    {
      id: 'image.aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      labelAr: 'نسبة العرض للارتفاع',
      options: IMAGE_ASPECT_RATIO_OPTIONS,
      defaultValue: '16:9',
    },
    {
      id: 'image.position',
      type: 'select',
      label: 'Position',
      labelAr: 'الموضع',
      options: IMAGE_POSITION_OPTIONS,
      defaultValue: 'top',
    },
    {
      id: 'image.fit',
      type: 'select',
      label: 'Fit',
      labelAr: 'الملاءمة',
      options: [
        { value: 'cover', label: 'Cover', labelAr: 'تغطية' },
        { value: 'contain', label: 'Contain', labelAr: 'احتواء' },
        { value: 'fill', label: 'Fill', labelAr: 'ملء' },
      ],
      defaultValue: 'cover',
    },
    {
      id: 'image.lazy',
      type: 'toggle',
      label: 'Lazy Load',
      labelAr: 'تحميل كسول',
      defaultValue: true,
    },
    {
      id: 'image.hover.scale',
      type: 'range',
      label: 'Hover Scale',
      labelAr: 'تكبير عند التحويم',
      min: 1,
      max: 1.2,
      step: 0.01,
      defaultValue: 1.05,
    },
  ],
};

/**
 * مجموعة حقول النص
 */
export const TEXT_FIELDS: FieldGroup = {
  id: 'text',
  label: 'Text Settings',
  labelAr: 'إعدادات النص',
  icon: 'Type',
  fields: [
    {
      id: 'text.titleSize',
      type: 'responsive-select',
      label: 'Title Size',
      labelAr: 'حجم العنوان',
      options: TEXT_SIZE_OPTIONS,
      defaultValue: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
    {
      id: 'text.titleLines',
      type: 'select',
      label: 'Title Lines',
      labelAr: 'أسطر العنوان',
      options: TITLE_LINES_OPTIONS,
      defaultValue: '2',
    },
    {
      id: 'text.titleWeight',
      type: 'select',
      label: 'Title Weight',
      labelAr: 'وزن العنوان',
      options: [
        { value: 'normal', label: 'Normal', labelAr: 'عادي' },
        { value: 'medium', label: 'Medium', labelAr: 'متوسط' },
        { value: 'semibold', label: 'Semi Bold', labelAr: 'شبه غامق' },
        { value: 'bold', label: 'Bold', labelAr: 'غامق' },
        { value: 'extrabold', label: 'Extra Bold', labelAr: 'غامق جداً' },
      ],
      defaultValue: 'bold',
    },
    {
      id: 'text.excerptSize',
      type: 'responsive-select',
      label: 'Excerpt Size',
      labelAr: 'حجم المقتطف',
      options: TEXT_SIZE_OPTIONS,
      defaultValue: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
    {
      id: 'text.excerptLines',
      type: 'select',
      label: 'Excerpt Lines',
      labelAr: 'أسطر المقتطف',
      options: [
        { value: '1', label: '1 Line', labelAr: 'سطر واحد' },
        { value: '2', label: '2 Lines', labelAr: 'سطران' },
        { value: '3', label: '3 Lines', labelAr: '3 أسطر' },
        { value: '4', label: '4 Lines', labelAr: '4 أسطر' },
        { value: '5', label: '5 Lines', labelAr: '5 أسطر' },
      ],
      defaultValue: '2',
    },
    {
      id: 'text.alignment',
      type: 'select',
      label: 'Text Alignment',
      labelAr: 'محاذاة النص',
      options: [
        { value: 'start', label: 'Start', labelAr: 'بداية' },
        { value: 'center', label: 'Center', labelAr: 'وسط' },
        { value: 'end', label: 'End', labelAr: 'نهاية' },
      ],
      defaultValue: 'start',
    },
  ],
};

/**
 * مجموعة حقول الشبكة
 */
export const GRID_FIELDS: FieldGroup = {
  id: 'grid',
  label: 'Grid Settings',
  labelAr: 'إعدادات الشبكة',
  icon: 'LayoutGrid',
  fields: [
    {
      id: 'grid.columns',
      type: 'responsive-select',
      label: 'Columns',
      labelAr: 'الأعمدة',
      options: COLUMN_OPTIONS,
      defaultValue: { desktop: '3', tablet: '2', mobile: '1' },
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
    {
      id: 'grid.gap',
      type: 'responsive-select',
      label: 'Gap',
      labelAr: 'المسافة',
      options: SPACING_OPTIONS,
      defaultValue: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
  ],
};

/**
 * مجموعة حقول البطاقة
 */
export const CARD_FIELDS: FieldGroup = {
  id: 'card',
  label: 'Card Style',
  labelAr: 'نمط البطاقة',
  icon: 'Square',
  fields: [
    {
      id: 'card.style',
      type: 'select',
      label: 'Style',
      labelAr: 'النمط',
      options: CARD_STYLE_OPTIONS,
      defaultValue: 'elevated',
    },
    {
      id: 'card.shadow',
      type: 'select',
      label: 'Shadow',
      labelAr: 'الظل',
      options: SHADOW_OPTIONS,
      defaultValue: 'md',
    },
    {
      id: 'card.radius',
      type: 'select',
      label: 'Border Radius',
      labelAr: 'استدارة الحواف',
      options: BORDER_RADIUS_OPTIONS,
      defaultValue: 'lg',
    },
    {
      id: 'card.hoverEffect',
      type: 'select',
      label: 'Hover Effect',
      labelAr: 'تأثير التحويم',
      options: HOVER_EFFECT_OPTIONS,
      defaultValue: 'lift',
    },
    {
      id: 'card.padding',
      type: 'responsive-select',
      label: 'Padding',
      labelAr: 'الحشو',
      options: SPACING_OPTIONS,
      defaultValue: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARTICLE GRID SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export const ARTICLE_GRID_SCHEMA: BlockSchema = {
  type: 'article-grid',
  name: 'Article Grid',
  nameAr: 'شبكة المقالات',
  description: 'Display articles in a responsive grid layout',
  descriptionAr: 'عرض المقالات في تخطيط شبكي متجاوب',
  icon: 'LayoutGrid',
  category: 'articles',
  hasDataSource: true,
  
  fieldGroups: [
    DISPLAY_FIELDS,
    IMAGE_FIELDS,
    TEXT_FIELDS,
    GRID_FIELDS,
    CARD_FIELDS,
  ],
  
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
      fit: 'cover',
      lazy: true,
    },
    text: {
      titleSize: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      titleLines: 2,
      titleWeight: 'bold',
      excerptSize: { desktop: 'sm', tablet: 'sm', mobile: 'xs' },
      excerptLines: 2,
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
      hoverEffect: 'lift',
      padding: { desktop: 'md', tablet: 'sm', mobile: 'sm' },
    },
  },
  
  defaultDataSource: {
    mode: 'latest',
    limit: 6,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const BLOCK_SCHEMAS: Record<BlockType, BlockSchema> = {
  'article-grid': ARTICLE_GRID_SCHEMA,
  // سيتم إضافة باقي الـ schemas
} as Record<BlockType, BlockSchema>;

export function getBlockSchema(type: BlockType): BlockSchema | undefined {
  return BLOCK_SCHEMAS[type];
}
