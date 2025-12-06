/**
 * NewsCore Template Engine - Template Schema
 * مخططات التحقق من صحة القوالب
 */

import type { 
  Template,
  Section,
  Block,
} from '../types';
import type { FieldGroup, SelectOption } from './block.schema';

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE TYPE OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const TEMPLATE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'home', label: 'Home Page', labelAr: 'الصفحة الرئيسية' },
  { value: 'category', label: 'Category Page', labelAr: 'صفحة القسم' },
  { value: 'tag', label: 'Tag Page', labelAr: 'صفحة الوسم' },
  { value: 'author', label: 'Author Page', labelAr: 'صفحة الكاتب' },
  { value: 'search', label: 'Search Results', labelAr: 'نتائج البحث' },
  { value: 'article', label: 'Article Page', labelAr: 'صفحة المقال' },
  { value: 'page', label: 'Static Page', labelAr: 'صفحة ثابتة' },
  { value: 'error', label: 'Error Page', labelAr: 'صفحة الخطأ' },
  { value: 'archive', label: 'Archive Page', labelAr: 'صفحة الأرشيف' },
  { value: 'custom', label: 'Custom Page', labelAr: 'صفحة مخصصة' },
];

export const LAYOUT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'full-width', label: 'Full Width', labelAr: 'عرض كامل' },
  { value: 'sidebar-right', label: 'Sidebar Right', labelAr: 'شريط جانبي يمين' },
  { value: 'sidebar-left', label: 'Sidebar Left', labelAr: 'شريط جانبي يسار' },
  { value: 'sidebar-both', label: 'Both Sidebars', labelAr: 'شريطان جانبيان' },
  { value: 'centered', label: 'Centered', labelAr: 'متمركز' },
];

export const CONTAINER_OPTIONS: SelectOption[] = [
  { value: 'full', label: 'Full Width (100%)', labelAr: 'عرض كامل (100%)' },
  { value: 'wide', label: 'Wide (1536px)', labelAr: 'عريض (1536px)' },
  { value: 'normal', label: 'Normal (1280px)', labelAr: 'عادي (1280px)' },
  { value: 'narrow', label: 'Narrow (1024px)', labelAr: 'ضيق (1024px)' },
  { value: 'custom', label: 'Custom', labelAr: 'مخصص' },
];

export const SECTION_HEADER_STYLE_OPTIONS: SelectOption[] = [
  { value: 'simple', label: 'Simple', labelAr: 'بسيط' },
  { value: 'bordered', label: 'Bordered', labelAr: 'محدد' },
  { value: 'decorated', label: 'Decorated', labelAr: 'مزخرف' },
  { value: 'gradient', label: 'Gradient', labelAr: 'متدرج' },
  { value: 'badge', label: 'Badge', labelAr: 'شارة' },
  { value: 'underlined', label: 'Underlined', labelAr: 'مسطر' },
  { value: 'boxed', label: 'Boxed', labelAr: 'مربع' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE FIELDS
// ═══════════════════════════════════════════════════════════════════════════════

export const TEMPLATE_INFO_FIELDS: FieldGroup = {
  id: 'info',
  label: 'Template Info',
  labelAr: 'معلومات القالب',
  icon: 'Info',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Template Name',
      labelAr: 'اسم القالب',
      placeholder: 'Enter template name',
      placeholderAr: 'أدخل اسم القالب',
      required: true,
    },
    {
      id: 'nameAr',
      type: 'text',
      label: 'Template Name (Arabic)',
      labelAr: 'اسم القالب (عربي)',
      placeholder: 'أدخل اسم القالب بالعربية',
      required: true,
    },
    {
      id: 'description',
      type: 'textarea',
      label: 'Description',
      labelAr: 'الوصف',
      placeholder: 'Brief description of the template',
      placeholderAr: 'وصف مختصر للقالب',
    },
    {
      id: 'type',
      type: 'select',
      label: 'Template Type',
      labelAr: 'نوع القالب',
      options: TEMPLATE_TYPE_OPTIONS,
      required: true,
    },
    {
      id: 'isDefault',
      type: 'toggle',
      label: 'Set as Default',
      labelAr: 'تعيين كافتراضي',
      description: 'Use this template as default for its type',
      descriptionAr: 'استخدام هذا القالب كافتراضي لنوعه',
      defaultValue: false,
    },
  ],
};

export const TEMPLATE_LAYOUT_FIELDS: FieldGroup = {
  id: 'layout',
  label: 'Layout',
  labelAr: 'التخطيط',
  icon: 'Layout',
  fields: [
    {
      id: 'layout.type',
      type: 'select',
      label: 'Layout Type',
      labelAr: 'نوع التخطيط',
      options: LAYOUT_TYPE_OPTIONS,
      defaultValue: 'full-width',
    },
    {
      id: 'layout.sidebarWidth',
      type: 'text',
      label: 'Sidebar Width',
      labelAr: 'عرض الشريط الجانبي',
      placeholder: '320px',
      defaultValue: '320px',
      showIf: { field: 'layout.type', operator: 'contains', value: 'sidebar' },
    },
    {
      id: 'layout.maxWidth',
      type: 'text',
      label: 'Max Width',
      labelAr: 'الحد الأقصى للعرض',
      placeholder: '1280px',
      defaultValue: '1280px',
    },
  ],
};

export const TEMPLATE_SETTINGS_FIELDS: FieldGroup = {
  id: 'settings',
  label: 'Settings',
  labelAr: 'الإعدادات',
  icon: 'Settings',
  fields: [
    {
      id: 'settings.showBreakingNews',
      type: 'toggle',
      label: 'Show Breaking News',
      labelAr: 'إظهار الأخبار العاجلة',
      defaultValue: true,
    },
    {
      id: 'settings.showBreadcrumb',
      type: 'toggle',
      label: 'Show Breadcrumb',
      labelAr: 'إظهار مسار التنقل',
      defaultValue: true,
    },
    {
      id: 'settings.stickyHeader',
      type: 'toggle',
      label: 'Sticky Header',
      labelAr: 'ترويسة ثابتة',
      defaultValue: true,
    },
    {
      id: 'settings.stickySidebar',
      type: 'toggle',
      label: 'Sticky Sidebar',
      labelAr: 'شريط جانبي ثابت',
      defaultValue: true,
      showIf: { field: 'layout.type', operator: 'contains', value: 'sidebar' },
    },
    {
      id: 'settings.backToTop',
      type: 'toggle',
      label: 'Back to Top Button',
      labelAr: 'زر العودة للأعلى',
      defaultValue: true,
    },
    {
      id: 'settings.infiniteScroll',
      type: 'toggle',
      label: 'Infinite Scroll',
      labelAr: 'التمرير اللانهائي',
      defaultValue: false,
    },
    {
      id: 'settings.loadMoreButton',
      type: 'toggle',
      label: 'Load More Button',
      labelAr: 'زر تحميل المزيد',
      defaultValue: true,
      showIf: { field: 'settings.infiniteScroll', operator: 'equals', value: false },
    },
  ],
};

export const TEMPLATE_SEO_FIELDS: FieldGroup = {
  id: 'seo',
  label: 'SEO',
  labelAr: 'تحسين محركات البحث',
  icon: 'Search',
  fields: [
    {
      id: 'seo.titleTemplate',
      type: 'text',
      label: 'Title Template',
      labelAr: 'قالب العنوان',
      placeholder: '{title} | {siteName}',
      description: 'Use {title}, {siteName}, {category} as placeholders',
      descriptionAr: 'استخدم {title}, {siteName}, {category} كعناصر نائبة',
    },
    {
      id: 'seo.descriptionTemplate',
      type: 'textarea',
      label: 'Description Template',
      labelAr: 'قالب الوصف',
      placeholder: '{excerpt}',
    },
    {
      id: 'seo.noIndex',
      type: 'toggle',
      label: 'No Index',
      labelAr: 'عدم الفهرسة',
      description: 'Prevent search engines from indexing',
      descriptionAr: 'منع محركات البحث من الفهرسة',
      defaultValue: false,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION FIELDS
// ═══════════════════════════════════════════════════════════════════════════════

export const SECTION_INFO_FIELDS: FieldGroup = {
  id: 'info',
  label: 'Section Info',
  labelAr: 'معلومات القسم',
  icon: 'Info',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Section Name',
      labelAr: 'اسم القسم',
      placeholder: 'Enter section name',
      placeholderAr: 'أدخل اسم القسم',
      required: true,
    },
    {
      id: 'nameAr',
      type: 'text',
      label: 'Section Name (Arabic)',
      labelAr: 'اسم القسم (عربي)',
      placeholder: 'أدخل اسم القسم بالعربية',
      required: true,
    },
  ],
};

export const SECTION_HEADER_FIELDS: FieldGroup = {
  id: 'header',
  label: 'Section Header',
  labelAr: 'عنوان القسم',
  icon: 'Type',
  fields: [
    {
      id: 'header.enabled',
      type: 'toggle',
      label: 'Show Header',
      labelAr: 'إظهار العنوان',
      defaultValue: false,
    },
    {
      id: 'header.title',
      type: 'text',
      label: 'Title',
      labelAr: 'العنوان',
      showIf: { field: 'header.enabled', operator: 'equals', value: true },
    },
    {
      id: 'header.titleAr',
      type: 'text',
      label: 'Title (Arabic)',
      labelAr: 'العنوان (عربي)',
      showIf: { field: 'header.enabled', operator: 'equals', value: true },
    },
    {
      id: 'header.style',
      type: 'select',
      label: 'Header Style',
      labelAr: 'نمط العنوان',
      options: SECTION_HEADER_STYLE_OPTIONS,
      defaultValue: 'bordered',
      showIf: { field: 'header.enabled', operator: 'equals', value: true },
    },
    {
      id: 'header.showMore',
      type: 'toggle',
      label: 'Show More Link',
      labelAr: 'إظهار رابط المزيد',
      defaultValue: false,
      showIf: { field: 'header.enabled', operator: 'equals', value: true },
    },
    {
      id: 'header.moreLink',
      type: 'text',
      label: 'More Link URL',
      labelAr: 'رابط المزيد',
      showIf: { field: 'header.showMore', operator: 'equals', value: true },
    },
  ],
};

export const SECTION_CONTAINER_FIELDS: FieldGroup = {
  id: 'container',
  label: 'Container',
  labelAr: 'الحاوية',
  icon: 'Box',
  fields: [
    {
      id: 'container',
      type: 'select',
      label: 'Container Width',
      labelAr: 'عرض الحاوية',
      options: CONTAINER_OPTIONS,
      defaultValue: 'normal',
    },
    {
      id: 'customWidth',
      type: 'text',
      label: 'Custom Width',
      labelAr: 'عرض مخصص',
      placeholder: '1400px',
      showIf: { field: 'container', operator: 'equals', value: 'custom' },
    },
  ],
};

export const SECTION_GRID_FIELDS: FieldGroup = {
  id: 'grid',
  label: 'Grid',
  labelAr: 'الشبكة',
  icon: 'LayoutGrid',
  fields: [
    {
      id: 'grid.columns',
      type: 'responsive-number',
      label: 'Columns',
      labelAr: 'الأعمدة',
      min: 1,
      max: 12,
      defaultValue: { desktop: 12, tablet: 12, mobile: 12 },
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
    {
      id: 'grid.gap',
      type: 'responsive-select',
      label: 'Gap',
      labelAr: 'المسافة',
      options: [
        { value: 'none', label: 'None', labelAr: 'بدون' },
        { value: 'xs', label: 'Extra Small', labelAr: 'صغير جداً' },
        { value: 'sm', label: 'Small', labelAr: 'صغير' },
        { value: 'md', label: 'Medium', labelAr: 'متوسط' },
        { value: 'lg', label: 'Large', labelAr: 'كبير' },
        { value: 'xl', label: 'Extra Large', labelAr: 'كبير جداً' },
      ],
      defaultValue: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      breakpoints: ['desktop', 'tablet', 'mobile'],
    },
  ],
};

export const SECTION_BACKGROUND_FIELDS: FieldGroup = {
  id: 'background',
  label: 'Background',
  labelAr: 'الخلفية',
  icon: 'Paintbrush',
  fields: [
    {
      id: 'background.type',
      type: 'select',
      label: 'Background Type',
      labelAr: 'نوع الخلفية',
      options: [
        { value: 'none', label: 'None', labelAr: 'بدون' },
        { value: 'color', label: 'Color', labelAr: 'لون' },
        { value: 'gradient', label: 'Gradient', labelAr: 'تدرج' },
        { value: 'image', label: 'Image', labelAr: 'صورة' },
        { value: 'pattern', label: 'Pattern', labelAr: 'نمط' },
      ],
      defaultValue: 'none',
    },
    {
      id: 'background.color',
      type: 'color',
      label: 'Background Color',
      labelAr: 'لون الخلفية',
      showIf: { field: 'background.type', operator: 'equals', value: 'color' },
    },
    {
      id: 'background.image.url',
      type: 'image',
      label: 'Background Image',
      labelAr: 'صورة الخلفية',
      showIf: { field: 'background.type', operator: 'equals', value: 'image' },
    },
  ],
};

export const SECTION_SPACING_FIELDS: FieldGroup = {
  id: 'spacing',
  label: 'Spacing',
  labelAr: 'المسافات',
  icon: 'MoveVertical',
  fields: [
    {
      id: 'padding',
      type: 'spacing',
      label: 'Padding',
      labelAr: 'الحشو الداخلي',
      defaultValue: {
        desktop: { top: 'xl', bottom: 'xl', left: 'md', right: 'md' },
        tablet: { top: 'lg', bottom: 'lg', left: 'md', right: 'md' },
        mobile: { top: 'md', bottom: 'md', left: 'sm', right: 'sm' },
      },
    },
    {
      id: 'margin',
      type: 'spacing',
      label: 'Margin',
      labelAr: 'الهامش الخارجي',
      defaultValue: {
        desktop: { top: 'none', bottom: 'none' },
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════

export interface TemplateSchema {
  fieldGroups: FieldGroup[];
}

export const TEMPLATE_SCHEMA: TemplateSchema = {
  fieldGroups: [
    TEMPLATE_INFO_FIELDS,
    TEMPLATE_LAYOUT_FIELDS,
    TEMPLATE_SETTINGS_FIELDS,
    TEMPLATE_SEO_FIELDS,
  ],
};

export interface SectionSchema {
  fieldGroups: FieldGroup[];
}

export const SECTION_SCHEMA: SectionSchema = {
  fieldGroups: [
    SECTION_INFO_FIELDS,
    SECTION_HEADER_FIELDS,
    SECTION_CONTAINER_FIELDS,
    SECTION_GRID_FIELDS,
    SECTION_BACKGROUND_FIELDS,
    SECTION_SPACING_FIELDS,
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface ValidationError {
  field: string;
  message: string;
  messageAr: string;
}

export function validateTemplate(template: Partial<Template>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!template.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Template name is required',
      messageAr: 'اسم القالب مطلوب',
    });
  }
  
  if (!template.type) {
    errors.push({
      field: 'type',
      message: 'Template type is required',
      messageAr: 'نوع القالب مطلوب',
    });
  }
  
  return errors;
}

export function validateSection(section: Partial<Section>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!section.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Section name is required',
      messageAr: 'اسم القسم مطلوب',
    });
  }
  
  return errors;
}

export function validateBlock(block: Partial<Block>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!block.type) {
    errors.push({
      field: 'type',
      message: 'Block type is required',
      messageAr: 'نوع الـ Block مطلوب',
    });
  }
  
  if (!block.variant) {
    errors.push({
      field: 'variant',
      message: 'Block variant is required',
      messageAr: 'تنويعة الـ Block مطلوبة',
    });
  }
  
  return errors;
}
