/**
 * NewsCore Builder - Canvas Component
 * منطقة التصميم والمعاينة
 */

'use client';

import { useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Copy, 
  Settings,
  ChevronUp,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useBuilderStore } from '@/stores/builder-store';
import type { Section, Block, BlockType } from '@/lib/template-engine/types';
import { getBlockMeta, getVariant } from '@/lib/template-engine/registry';
import { cn } from '@/lib/utils/cn';

const ArticleGrid = dynamic(() => import('@/components/template-engine/blocks/ArticleGrid'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});
const BigHero = dynamic(() => import('@/components/template-engine/blocks/BigHero'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});
const ArticleList = dynamic(() => import('@/components/template-engine/blocks/ArticleList'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});
const ArticleSlider = dynamic(() => import('@/components/template-engine/blocks/ArticleSlider'), {
  loading: () => <BlockLoadingPlaceholder />,
  ssr: false,
});

function BlockLoadingPlaceholder() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-[200px] animate-pulse">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

const VIEWPORT_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function BuilderCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
    template,
    selectedElement,
    hoveredElement,
    previewMode,
    viewportSize,
    zoom,
    showGrid,
    showOutlines,
    isDragging,
    dropTarget,
    selectElement,
    hoverElement,
    addSection,
    addBlockFromType,
    deleteSection,
    deleteBlock,
    duplicateSection,
    duplicateBlock,
    moveSection,
    updateDropTarget,
    endDrag,
  } = useBuilderStore();

  const sections = template?.sections || [];

  const handleDragOver = useCallback((e: React.DragEvent, sectionId?: string, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    if (sectionId !== undefined || index !== undefined) {
      updateDropTarget({ sectionId, index: index || 0 });
    }
  }, [updateDropTarget]);

  const handleDrop = useCallback((e: React.DragEvent, sectionId?: string) => {
    e.preventDefault();
    
    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    
    if (blockType && sectionId) {
      addBlockFromType(sectionId, blockType);
    }
    
    endDrag();
  }, [addBlockFromType, endDrag]);

  const handleDragLeave = useCallback(() => {
    updateDropTarget(null);
  }, [updateDropTarget]);

  const handleSectionClick = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    selectElement({ type: 'section', id: sectionId });
  }, [selectElement]);

  const handleBlockClick = useCallback((e: React.MouseEvent, sectionId: string, blockId: string) => {
    e.stopPropagation();
    selectElement({ type: 'block', id: blockId, sectionId });
  }, [selectElement]);

  const handleCanvasClick = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Settings className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            لا يوجد قالب محدد
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            قم بإنشاء قالب جديد أو تحميل قالب موجود
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800"
      onClick={handleCanvasClick}
    >
      <div 
        ref={canvasRef}
        className="min-h-full p-8 transition-all duration-300"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <div
          className={cn(
            'bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300',
            viewportSize !== 'desktop' && 'rounded-lg'
          )}
          style={{
            width: VIEWPORT_WIDTHS[viewportSize],
            maxWidth: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <div className={cn(
            'min-h-[600px]',
            showGrid && 'bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]'
          )}>
            {sections.length === 0 ? (
              <EmptyState onAddSection={() => addSection()} />
            ) : (
              <>
                {sections.map((section, index) => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    index={index}
                    isSelected={selectedElement?.type === 'section' && selectedElement.id === section.id}
                    isHovered={hoveredElement?.type === 'section' && hoveredElement.id === section.id}
                    showOutlines={showOutlines}
                    previewMode={previewMode}
                    isDragging={isDragging}
                    isDropTarget={dropTarget?.sectionId === section.id}
                    onSectionClick={handleSectionClick}
                    onBlockClick={handleBlockClick}
                    onHover={hoverElement}
                    onDelete={() => deleteSection(section.id)}
                    onDuplicate={() => duplicateSection(section.id)}
                    onMoveUp={() => index > 0 && moveSection(index, index - 1)}
                    onMoveDown={() => index < sections.length - 1 && moveSection(index, index + 1)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                    selectedBlockId={selectedElement?.type === 'block' ? selectedElement.id : undefined}
                    onDeleteBlock={(blockId) => deleteBlock(section.id, blockId)}
                    onDuplicateBlock={(blockId) => duplicateBlock(section.id, blockId)}
                  />
                ))}
                
                {!previewMode && (
                  <button
                    onClick={() => addSection()}
                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة قسم جديد
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type SelectedElement = { type: 'section'; id: string } | { type: 'block'; id: string; sectionId: string };

interface SectionItemProps {
  section: Section;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  showOutlines: boolean;
  previewMode: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  selectedBlockId?: string;
  onSectionClick: (e: React.MouseEvent, sectionId: string) => void;
  onBlockClick: (e: React.MouseEvent, sectionId: string, blockId: string) => void;
  onHover: (element: SelectedElement | null) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragOver: (e: React.DragEvent, sectionId?: string, index?: number) => void;
  onDrop: (e: React.DragEvent, sectionId?: string) => void;
  onDragLeave: () => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
}

function SectionItem({
  section,
  index,
  isSelected,
  isHovered,
  showOutlines,
  previewMode,
  isDragging,
  isDropTarget,
  selectedBlockId,
  onSectionClick,
  onBlockClick,
  onHover,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDragOver,
  onDrop,
  onDragLeave,
  onDeleteBlock,
  onDuplicateBlock,
}: SectionItemProps) {
  return (
    <div
      className={cn(
        'relative group transition-all',
        !previewMode && 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
        isSelected && 'ring-2 ring-primary ring-inset',
        isHovered && !isSelected && 'ring-1 ring-primary/30 ring-inset',
        showOutlines && 'outline outline-1 outline-dashed outline-gray-300 dark:outline-gray-600',
        isDropTarget && 'bg-primary/10'
      )}
      onClick={(e) => onSectionClick(e, section.id)}
      onMouseEnter={() => !previewMode && onHover({ type: 'section', id: section.id })}
      onMouseLeave={() => onHover(null)}
      onDragOver={(e) => onDragOver(e, section.id)}
      onDrop={(e) => onDrop(e, section.id)}
      onDragLeave={onDragLeave}
    >
      {!previewMode && (isSelected || isHovered) && (
        <div className="absolute -top-8 right-0 flex items-center gap-1 bg-primary text-white text-xs px-2 py-1 rounded-t-md z-10">
          <GripVertical className="w-3 h-3 cursor-grab" />
          <span>{section.nameAr || section.name}</span>
        </div>
      )}

      {!previewMode && isSelected && (
        <div className="absolute -top-8 left-0 flex items-center gap-1 z-10">
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} className="p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="نقل لأعلى">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} className="p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="نقل لأسفل">
            <ChevronDown className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="تكرار">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 rounded" title="حذف">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="p-4">
        {section.header?.enabled && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-r-4 border-primary pr-3">
              {section.header.titleAr || section.header.title}
            </h2>
          </div>
        )}

        <div className={cn('flex gap-4', section.layout?.type === 'sidebar-left' && 'flex-row', section.layout?.type === 'sidebar-right' && 'flex-row-reverse')}>
          <div className={cn(section.layout?.type?.includes('sidebar') ? 'flex-1' : 'w-full')}>
            {section.blocks.length === 0 ? (
              <div className={cn('border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center', isDragging && 'border-primary bg-primary/5')}>
                <p className="text-gray-500 dark:text-gray-400">
                  {isDragging ? 'أفلت هنا لإضافة البلوك' : 'اسحب بلوك من القائمة الجانبية'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                {section.blocks.map((block) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    sectionId={section.id}
                    isSelected={selectedBlockId === block.id}
                    showOutlines={showOutlines}
                    previewMode={previewMode}
                    onClick={onBlockClick}
                    onDelete={() => onDeleteBlock(block.id)}
                    onDuplicate={() => onDuplicateBlock(block.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {(section.layout?.type === 'sidebar-right' || section.layout?.type === 'sidebar-left') && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50" style={{ width: section.layout.sidebarWidth || '320px', minHeight: '200px' }}>
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">📋</div>
                <p className="text-sm font-medium">Sidebar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface BlockItemProps {
  block: Block;
  sectionId: string;
  isSelected: boolean;
  showOutlines: boolean;
  previewMode: boolean;
  onClick: (e: React.MouseEvent, sectionId: string, blockId: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function BlockItem({ block, sectionId, isSelected, showOutlines, previewMode, onClick, onDelete, onDuplicate }: BlockItemProps) {
  const meta = getBlockMeta(block.type);
  const colSpan = block.gridArea?.column?.span || 12;

  return (
    <div
      className={cn('relative group', `col-span-${colSpan}`, !previewMode && 'cursor-pointer', isSelected && 'ring-2 ring-primary', showOutlines && 'outline outline-1 outline-dashed outline-gray-300 dark:outline-gray-600')}
      style={{ gridColumn: `span ${colSpan}` }}
      onClick={(e) => onClick(e, sectionId, block.id)}
    >
      {!previewMode && isSelected && (
        <>
          <div className="absolute -top-6 right-0 flex items-center gap-1 bg-primary text-white text-xs px-2 py-0.5 rounded-t z-10">
            <span>{meta?.nameAr || block.type}</span>
          </div>
          <div className="absolute -top-6 left-0 flex items-center gap-1 z-10">
            <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="تكرار">
              <Copy className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 rounded" title="حذف">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </>
      )}

      {previewMode ? (
        <BlockPreview block={block} />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2 opacity-50">📰</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{meta?.nameAr || block.type}</p>
            <p className="text-xs text-gray-500">{block.variant}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockPreview({ block }: { block: Block }) {
  const variantConfig = getVariant(block.type, block.variant);
  const mergedConfig = { ...variantConfig?.defaultConfig, ...block.config };
  const emptyData = { articles: [], total: 0, page: 1, totalPages: 0, hasMore: false };

  switch (block.type) {
    case 'article-grid':
      return <ArticleGrid variant={block.variant} config={mergedConfig} data={emptyData} />;
    case 'big-hero':
      return <BigHero variant={block.variant} config={mergedConfig} data={emptyData} />;
    case 'article-list':
      return <ArticleList variant={block.variant} config={mergedConfig} data={emptyData} />;
    case 'article-slider':
      return <ArticleSlider variant={block.variant} config={mergedConfig} data={emptyData} />;
    default:
      return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 min-h-[150px]">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-3xl mb-2">🧩</div>
            <p className="font-medium">{getBlockMeta(block.type)?.nameAr || block.type}</p>
          </div>
        </div>
      );
  }
}

function EmptyState({ onAddSection }: { onAddSection: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">ابدأ ببناء القالب</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">أضف قسماً جديداً ثم اسحب البلوكات إليه</p>
        <button onClick={onAddSection} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">إضافة قسم</button>
      </div>
    </div>
  );
}
