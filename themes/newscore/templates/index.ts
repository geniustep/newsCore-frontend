// NewsCore Theme Templates Index
// Export all available templates for easy import

export { default as HomeMagazineTemplate } from './home-magazine';
export { default as HomeGridTemplate } from './home-grid';
export { default as ArticleFullTemplate } from './article-full';

// Template types
export type TemplateType = 'home' | 'article' | 'category' | 'page' | 'search' | 'error';

export interface Template {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  file: string;
  type: TemplateType;
  isDefault?: boolean;
  preview?: string;
}

// Available templates configuration
export const templates: Template[] = [
  {
    id: 'home-classic',
    name: 'Classic Home',
    nameAr: 'الرئيسية الكلاسيكية',
    description: 'Classic news homepage with featured article on left and sidebar articles',
    descriptionAr: 'صفحة رئيسية كلاسيكية مع مقال مميز على اليسار وأخبار جانبية',
    file: 'app/[locale]/page.tsx',
    type: 'home',
    isDefault: true,
  },
  {
    id: 'home-magazine',
    name: 'Magazine Home',
    nameAr: 'الرئيسية المجلة',
    description: 'Magazine-style homepage with large hero images',
    descriptionAr: 'صفحة رئيسية بأسلوب المجلات مع صور بطولية كبيرة',
    file: 'templates/home-magazine.tsx',
    type: 'home',
  },
  {
    id: 'home-grid',
    name: 'Grid Home',
    nameAr: 'الرئيسية الشبكية',
    description: 'Grid-based homepage with multiple article sizes',
    descriptionAr: 'صفحة رئيسية شبكية مع أحجام متعددة للمقالات',
    file: 'templates/home-grid.tsx',
    type: 'home',
  },
  {
    id: 'article-default',
    name: 'Default Article',
    nameAr: 'المقال الافتراضي',
    description: 'Standard article page with sidebar',
    descriptionAr: 'صفحة مقال قياسية مع شريط جانبي',
    file: 'app/[locale]/article/[slug]/page.tsx',
    type: 'article',
    isDefault: true,
  },
  {
    id: 'article-full-width',
    name: 'Full Width Article',
    nameAr: 'مقال بعرض كامل',
    description: 'Full-width article page without sidebar',
    descriptionAr: 'صفحة مقال بعرض كامل بدون شريط جانبي',
    file: 'templates/article-full.tsx',
    type: 'article',
  },
];

// Get template by ID
export function getTemplate(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

// Get templates by type
export function getTemplatesByType(type: TemplateType): Template[] {
  return templates.filter(t => t.type === type);
}

// Get default template for a type
export function getDefaultTemplate(type: TemplateType): Template | undefined {
  return templates.find(t => t.type === type && t.isDefault);
}
