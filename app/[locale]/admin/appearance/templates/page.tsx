/**
 * NewsCore - Templates Management Page
 * صفحة إدارة القوالب
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { 
  Plus, 
  Layout, 
  FileText, 
  Tag, 
  User, 
  Search as SearchIcon,
  Home,
  AlertCircle,
  Archive,
  Settings,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  Check,
  X,
  Grid3X3,
  List,
} from 'lucide-react';
import type { Template, TemplateType } from '@/lib/template-engine/types';
import { generateId, DEFAULT_TEMPLATE_SETTINGS } from '@/lib/template-engine/types';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
  onSetDefault: (template: Template) => void;
  locale: string;
  viewMode: 'grid' | 'list';
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE TYPE CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const TEMPLATE_TYPES: { type: TemplateType; label: string; labelAr: string; icon: typeof Home; color: string }[] = [
  { type: 'home', label: 'Home', labelAr: 'الرئيسية', icon: Home, color: 'bg-blue-500' },
  { type: 'category', label: 'Category', labelAr: 'قسم', icon: Layout, color: 'bg-green-500' },
  { type: 'article', label: 'Article', labelAr: 'مقال', icon: FileText, color: 'bg-purple-500' },
  { type: 'tag', label: 'Tag', labelAr: 'وسم', icon: Tag, color: 'bg-orange-500' },
  { type: 'author', label: 'Author', labelAr: 'كاتب', icon: User, color: 'bg-pink-500' },
  { type: 'search', label: 'Search', labelAr: 'بحث', icon: SearchIcon, color: 'bg-cyan-500' },
  { type: 'page', label: 'Page', labelAr: 'صفحة', icon: FileText, color: 'bg-indigo-500' },
  { type: 'error', label: 'Error', labelAr: 'خطأ', icon: AlertCircle, color: 'bg-red-500' },
  { type: 'archive', label: 'Archive', labelAr: 'أرشيف', icon: Archive, color: 'bg-amber-500' },
  { type: 'custom', label: 'Custom', labelAr: 'مخصص', icon: Settings, color: 'bg-gray-500' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'home-default',
    name: 'Default Home',
    nameAr: 'الرئيسية الافتراضية',
    description: 'Default homepage with hero, latest news, and category sections',
    descriptionAr: 'الصفحة الرئيسية الافتراضية مع البطل والأخبار وأقسام الفئات',
    type: 'home',
    version: '1.0.0',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-05T00:00:00Z',
    isDefault: true,
    isActive: true,
    preview: '/templates/home-default.png',
    layout: { type: 'full-width' },
    regions: { header: { enabled: true }, footer: { enabled: true } },
    settings: DEFAULT_TEMPLATE_SETTINGS,
    sections: [],
  },
  {
    id: 'home-magazine',
    name: 'Magazine Home',
    nameAr: 'الرئيسية المجلة',
    description: 'Magazine-style homepage with large visuals',
    descriptionAr: 'صفحة رئيسية بنمط المجلة مع صور كبيرة',
    type: 'home',
    version: '1.0.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    isDefault: false,
    isActive: true,
    preview: '/templates/home-magazine.png',
    layout: { type: 'full-width' },
    regions: { header: { enabled: true }, footer: { enabled: true } },
    settings: DEFAULT_TEMPLATE_SETTINGS,
    sections: [],
  },
  {
    id: 'category-default',
    name: 'Default Category',
    nameAr: 'القسم الافتراضي',
    description: 'Standard category page with featured article and grid',
    descriptionAr: 'صفحة القسم الافتراضية مع مقال مميز وشبكة',
    type: 'category',
    version: '1.0.0',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    isDefault: true,
    isActive: true,
    preview: '/templates/category-default.png',
    layout: { type: 'sidebar-right', sidebarWidth: '320px' },
    regions: { header: { enabled: true }, sidebar: { enabled: true }, footer: { enabled: true } },
    settings: DEFAULT_TEMPLATE_SETTINGS,
    sections: [],
  },
  {
    id: 'article-full',
    name: 'Full Article',
    nameAr: 'المقال الكامل',
    description: 'Full-width article page with related articles',
    descriptionAr: 'صفحة مقال بعرض كامل مع مقالات ذات صلة',
    type: 'article',
    version: '1.0.0',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
    isDefault: true,
    isActive: true,
    preview: '/templates/article-full.png',
    layout: { type: 'sidebar-right', sidebarWidth: '300px' },
    regions: { header: { enabled: true }, sidebar: { enabled: true }, footer: { enabled: true } },
    settings: { ...DEFAULT_TEMPLATE_SETTINGS, readingProgress: true },
    sections: [],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function TemplateCard({ template, onEdit, onDuplicate, onDelete, onSetDefault, locale, viewMode }: TemplateCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const typeConfig = TEMPLATE_TYPES.find(t => t.type === template.type);
  const TypeIcon = typeConfig?.icon || FileText;

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
        <div className="w-24 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
          {template.preview ? (
            <img src={template.preview} alt={template.nameAr} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TypeIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {template.nameAr}
            </h3>
            {template.isDefault && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                الافتراضي
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {template.descriptionAr || template.description}
          </p>
        </div>

        <span className={cn('px-2 py-1 text-xs font-medium text-white rounded-full', typeConfig?.color || 'bg-gray-500')}>
          {typeConfig?.labelAr || template.type}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(template)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <Link
            href={`/${locale}/preview/${template.id}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-36">
                  <button
                    onClick={() => { onDuplicate(template); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ
                  </button>
                  {!template.isDefault && (
                    <button
                      onClick={() => { onSetDefault(template); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      تعيين كافتراضي
                    </button>
                  )}
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => { onDelete(template); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group">
      {/* Preview */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        {template.preview ? (
          <img 
            src={template.preview} 
            alt={template.nameAr}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TypeIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}
        
        {template.isDefault && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium bg-primary text-white rounded-full shadow-lg">
            الافتراضي
          </span>
        )}
        
        <span className={cn('absolute top-3 left-3 px-2.5 py-1 text-xs font-medium text-white rounded-full shadow-lg', typeConfig?.color || 'bg-gray-500')}>
          {typeConfig?.labelAr || template.type}
        </span>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(template)}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل
          </button>
          <Link
            href={`/${locale}/preview/${template.id}`}
            className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            معاينة
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {template.nameAr}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {template.name}
            </p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-44">
                  <button
                    onClick={() => { onEdit(template); setShowMenu(false); }}
                    className="w-full px-4 py-2.5 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل في Builder
                  </button>
                  <button
                    onClick={() => { onDuplicate(template); setShowMenu(false); }}
                    className="w-full px-4 py-2.5 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ
                  </button>
                  {!template.isDefault && (
                    <button
                      onClick={() => { onSetDefault(template); setShowMenu(false); }}
                      className="w-full px-4 py-2.5 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <Check className="w-4 h-4" />
                      تعيين كافتراضي
                    </button>
                  )}
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => { onDelete(template); setShowMenu(false); }}
                    className="w-full px-4 py-2.5 text-right text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {template.descriptionAr || template.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>v{template.version}</span>
          <span suppressHydrationWarning>
            آخر تعديل: {new Date(template.updatedAt).toLocaleDateString('ar-SA')}
          </span>
        </div>
      </div>
    </div>
  );
}

function NewTemplateModal({ 
  isOpen, 
  onClose, 
  onCreate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onCreate: (template: Partial<Template>) => void;
}) {
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [type, setType] = useState<TemplateType>('home');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name || !nameAr) return;
    
    onCreate({
      name,
      nameAr,
      type,
      description,
      descriptionAr: description,
    });
    
    setName('');
    setNameAr('');
    setType('home');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            إنشاء قالب جديد
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              نوع القالب
            </label>
            <div className="grid grid-cols-5 gap-2">
              {TEMPLATE_TYPES.slice(0, 5).map((t) => (
                <button
                  key={t.type}
                  onClick={() => setType(t.type)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                    type === t.type
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  )}
                >
                  <t.icon className={cn('w-5 h-5', type === t.type ? 'text-primary' : 'text-gray-500')} />
                  <span className={cn('text-xs', type === t.type ? 'text-primary font-medium' : 'text-gray-600')}>
                    {t.labelAr}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم القالب (عربي) *
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: الرئيسية الجديدة"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم القالب (إنجليزي) *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Homepage"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر للقالب..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleCreate}
            disabled={!name || !nameAr}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إنشاء القالب
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function TemplatesPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [filterType, setFilterType] = useState<TemplateType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = templates.filter(temp => {
    const matchesType = filterType === 'all' || temp.type === filterType;
    const matchesSearch = !searchQuery || 
      temp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      temp.nameAr.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const handleEdit = (template: Template) => {
    localStorage.setItem('builder_template', JSON.stringify(template));
    window.location.href = `/${locale}/admin/appearance/builder?template=${template.id}`;
  };

  const handleDuplicate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: generateId('template'),
      name: `${template.name} (Copy)`,
      nameAr: `${template.nameAr} (نسخة)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDelete = (template: Template) => {
    if (template.isDefault) {
      alert('لا يمكن حذف القالب الافتراضي');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف "${template.nameAr}"?`)) {
      setTemplates(templates.filter(temp => temp.id !== template.id));
    }
  };

  const handleSetDefault = (template: Template) => {
    setTemplates(templates.map(temp => ({
      ...temp,
      isDefault: temp.id === template.id ? true : (temp.type === template.type ? false : temp.isDefault),
    })));
  };

  const handleCreate = (data: Partial<Template>) => {
    const newTemplate: Template = {
      id: generateId('template'),
      name: data.name || 'New Template',
      nameAr: data.nameAr || 'قالب جديد',
      description: data.description || '',
      descriptionAr: data.descriptionAr || '',
      type: data.type || 'home',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false,
      isActive: true,
      preview: '',
      layout: { type: 'full-width' },
      regions: { header: { enabled: true }, footer: { enabled: true } },
      settings: DEFAULT_TEMPLATE_SETTINGS,
      sections: [],
    };
    
    setTemplates([...templates, newTemplate]);
    setTimeout(() => handleEdit(newTemplate), 100);
  };

  const typeCounts = TEMPLATE_TYPES.reduce((acc, t) => {
    acc[t.type] = templates.filter(temp => temp.type === t.type).length;
    return acc;
  }, {} as Record<TemplateType, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('nav.templates')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إنشاء وتعديل قوالب الصفحات المختلفة
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          قالب جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                filterType === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              )}
            >
              الكل ({templates.length})
            </button>
            {TEMPLATE_TYPES.slice(0, 5).map((t) => (
              <button
                key={t.type}
                onClick={() => setFilterType(t.type)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
                  filterType === t.type
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.labelAr} ({typeCounts[t.type] || 0})
              </button>
            ))}
          </div>

          {/* Search & View Toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن قالب..."
                className="w-full lg:w-64 pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      {filteredTemplates.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                locale={locale}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                locale={locale}
                viewMode={viewMode}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Layout className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            لا توجد قوالب
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery ? 'لم يتم العثور على قوالب مطابقة' : 'ابدأ بإنشاء قالب جديد'}
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إنشاء قالب جديد
          </button>
        </div>
      )}

      <NewTemplateModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

