/**
 * NewsCore - Menus Management Page
 * صفحة إدارة القوائم
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Link as LinkIcon,
  FolderOpen,
  FileText,
  Tag,
  Eye,
  EyeOff,
  Save,
  ListOrdered,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface MenuItem {
  id: string;
  label: string;
  labelAr?: string;
  type: 'custom' | 'category' | 'page' | 'article' | 'tag';
  url?: string;
  target?: '_self' | '_blank';
  isActive: boolean;
  children?: MenuItem[];
}

interface Menu {
  id: string;
  name: string;
  slug: string;
  location: string;
  items: MenuItem[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLE_MENUS: Menu[] = [
  {
    id: 'main-menu',
    name: 'القائمة الرئيسية',
    slug: 'main-menu',
    location: 'header',
    items: [
      { id: '1', label: 'الرئيسية', labelAr: 'الرئيسية', type: 'custom', url: '/', isActive: true },
      { 
        id: '2', 
        label: 'سياسة', 
        labelAr: 'سياسة', 
        type: 'category', 
        url: '/category/politics', 
        isActive: true,
        children: [
          { id: '2-1', label: 'أخبار محلية', labelAr: 'أخبار محلية', type: 'category', url: '/category/local', isActive: true },
          { id: '2-2', label: 'أخبار دولية', labelAr: 'أخبار دولية', type: 'category', url: '/category/world', isActive: true },
        ]
      },
      { id: '3', label: 'اقتصاد', labelAr: 'اقتصاد', type: 'category', url: '/category/economy', isActive: true },
      { id: '4', label: 'رياضة', labelAr: 'رياضة', type: 'category', url: '/category/sports', isActive: true },
      { id: '5', label: 'تقنية', labelAr: 'تقنية', type: 'category', url: '/category/technology', isActive: true },
    ],
  },
  {
    id: 'footer-menu',
    name: 'قائمة التذييل',
    slug: 'footer-menu',
    location: 'footer',
    items: [
      { id: '1', label: 'من نحن', type: 'page', url: '/about', isActive: true },
      { id: '2', label: 'اتصل بنا', type: 'page', url: '/contact', isActive: true },
      { id: '3', label: 'سياسة الخصوصية', type: 'page', url: '/privacy', isActive: true },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function MenuItemRow({ 
  item, 
  level = 0,
  onEdit,
  onDelete,
  onToggle,
}: { 
  item: MenuItem; 
  level?: number;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  const typeIcons = {
    custom: LinkIcon,
    category: FolderOpen,
    page: FileText,
    article: FileText,
    tag: Tag,
  };
  const TypeIcon = typeIcons[item.type];

  return (
    <>
      <div 
        className={cn(
          'flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
          'hover:shadow-md transition-all group',
          !item.isActive && 'opacity-50'
        )}
        style={{ marginRight: `${level * 24}px` }}
      >
        <button className="p-1 cursor-grab opacity-0 group-hover:opacity-100">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>

        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}

        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <TypeIcon className="w-4 h-4 text-gray-500" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {item.labelAr || item.label}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {item.url}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggle(item.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title={item.isActive ? 'إخفاء' : 'إظهار'}
          >
            {item.isActive ? (
              <Eye className="w-4 h-4 text-gray-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="space-y-2 mt-2">
          {item.children?.map((child) => (
            <MenuItemRow
              key={child.id}
              item={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </>
  );
}

function AddItemModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Partial<MenuItem>) => void;
}) {
  const [type, setType] = useState<MenuItem['type']>('custom');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ type, label, labelAr: label, url, isActive: true });
    setLabel('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            إضافة عنصر جديد
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع العنصر
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'custom', label: 'رابط مخصص', icon: LinkIcon },
                { value: 'category', label: 'تصنيف', icon: FolderOpen },
                { value: 'page', label: 'صفحة', icon: FileText },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value as MenuItem['type'])}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                    type === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  )}
                >
                  <option.icon className={cn('w-5 h-5', type === option.value ? 'text-primary' : 'text-gray-500')} />
                  <span className={cn('text-xs', type === option.value ? 'text-primary font-medium' : 'text-gray-600')}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              العنوان
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الرابط
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              dir="ltr"
              required
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            إضافة
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function MenusPage() {
  const t = useTranslations('admin');
  const [menus] = useState<Menu[]>(SAMPLE_MENUS);
  const [activeMenu, setActiveMenu] = useState<string>(SAMPLE_MENUS[0].id);
  const [showAddModal, setShowAddModal] = useState(false);

  const currentMenu = menus.find(m => m.id === activeMenu);

  const handleEdit = (item: MenuItem) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      console.log('Delete item:', id);
    }
  };

  const handleToggle = (id: string) => {
    console.log('Toggle item:', id);
  };

  const handleAddItem = (item: Partial<MenuItem>) => {
    console.log('Add item:', item);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('nav.menus')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إدارة قوائم التنقل في الموقع
          </p>
        </div>
        <button
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Save className="w-5 h-5" />
          حفظ القائمة
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu Selector */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-gray-400" />
              القوائم
            </h3>
            <div className="space-y-2">
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu.id)}
                  className={cn(
                    'w-full p-3 rounded-xl text-right transition-all',
                    activeMenu === menu.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  <p className="font-medium">{menu.name}</p>
                  <p className={cn('text-xs mt-1', activeMenu === menu.id ? 'text-white/70' : 'text-gray-500')}>
                    {menu.location === 'header' ? 'الترويسة' : 'التذييل'} • {menu.items.length} عنصر
                  </p>
                </button>
              ))}
            </div>
            
            <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              قائمة جديدة
            </button>
          </div>
        </div>

        {/* Menu Editor */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {currentMenu?.name}
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة عنصر
              </button>
            </div>

            {currentMenu && currentMenu.items.length > 0 ? (
              <div className="space-y-2">
                {currentMenu.items.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ListOrdered className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  لا توجد عناصر في هذه القائمة
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  إضافة عنصر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}

