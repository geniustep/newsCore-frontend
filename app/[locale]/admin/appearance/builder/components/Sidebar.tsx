/**
 * NewsCore Builder - Sidebar Component
 * الشريط الجانبي لمكتبة الـ Blocks
 */

'use client';

import { useState } from 'react';
import { 
  LayoutGrid, 
  Maximize, 
  Zap, 
  FolderTree, 
  Megaphone,
  Play,
  Users,
  Mail,
  Cloud,
  MoveVertical,
  ChevronDown,
  ChevronRight,
  Search,
  GripVertical,
} from 'lucide-react';
import { getBlockCategories, getBlocksByCategory } from '@/lib/template-engine/registry';
import type { BlockType, BlockCategory } from '@/lib/template-engine/types';
import { useBuilderStore } from '@/stores/builder-store';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS MAP
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_ICONS: Record<BlockCategory, React.ReactNode> = {
  articles: <LayoutGrid className="w-4 h-4" />,
  hero: <Maximize className="w-4 h-4" />,
  breaking: <Zap className="w-4 h-4" />,
  navigation: <FolderTree className="w-4 h-4" />,
  ads: <Megaphone className="w-4 h-4" />,
  media: <Play className="w-4 h-4" />,
  authors: <Users className="w-4 h-4" />,
  engagement: <Mail className="w-4 h-4" />,
  widgets: <Cloud className="w-4 h-4" />,
  layout: <MoveVertical className="w-4 h-4" />,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BuilderSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['articles', 'hero']));
  const { startDrag } = useBuilderStore();

  const categories = getBlockCategories();

  const filterBlocks = (blocks: ReturnType<typeof getBlocksByCategory>) => {
    if (!searchQuery) return blocks;
    return blocks.filter(block => 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.nameAr.includes(searchQuery)
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, blockType: BlockType) => {
    e.dataTransfer.setData('blockType', blockType);
    e.dataTransfer.effectAllowed = 'copy';
    startDrag({ type: 'block', data: { type: blockType } });
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          مكتبة البلوكات
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="بحث عن بلوك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => {
          const blocks = filterBlocks(getBlocksByCategory(category.id));
          const isExpanded = expandedCategories.has(category.id);

          if (searchQuery && blocks.length === 0) return null;

          return (
            <div key={category.id} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-gray-500">
                  {CATEGORY_ICONS[category.id]}
                </span>
                <span className="flex-1 text-right">{category.nameAr}</span>
                <span className="text-xs text-gray-400 ml-2">{blocks.length}</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Blocks */}
              {isExpanded && (
                <div className="mt-1 space-y-1 pr-2">
                  {blocks.map((block) => (
                    <div
                      key={block.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, block.type)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-grab',
                        'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
                        'border border-transparent hover:border-primary/30',
                        'transition-all duration-200',
                        'active:cursor-grabbing active:scale-95'
                      )}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {block.nameAr}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {block.variants.length} تنويعة
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          اسحب البلوك إلى منطقة التصميم
        </p>
      </div>
    </div>
  );
}
