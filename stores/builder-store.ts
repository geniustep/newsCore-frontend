/**
 * NewsCore Template Engine - Builder Store
 * متجر حالة الـ Builder باستخدام Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  Template, 
  Section, 
  Block, 
  BlockType,
  Breakpoint,
  SelectedElement,
  HistoryEntry,
  BuilderState,
  DataSource,
} from '@/lib/template-engine/types';
import { generateId, DEFAULT_BLOCK_CONFIG, DEFAULT_SECTION, DEFAULT_TEMPLATE_SETTINGS } from '@/lib/template-engine/types';
import { getBlockMeta, getDefaultVariant } from '@/lib/template-engine/registry';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface BuilderActions {
  // Template Actions
  setTemplate: (template: Template | null) => void;
  updateTemplate: (updates: Partial<Template>) => void;
  resetTemplate: () => void;
  
  // Section Actions
  addSection: (section?: Partial<Section>) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  
  // Block Actions
  addBlock: (sectionId: string, block?: Partial<Block>) => void;
  addBlockFromType: (sectionId: string, type: BlockType) => void;
  updateBlock: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (sectionId: string, blockId: string) => void;
  moveBlock: (fromSectionId: string, toSectionId: string, fromIndex: number, toIndex: number) => void;
  duplicateBlock: (sectionId: string, blockId: string) => void;
  
  // Selection Actions
  selectElement: (element: SelectedElement | null) => void;
  hoverElement: (element: SelectedElement | null) => void;
  clearSelection: () => void;
  
  // Drag & Drop Actions
  startDrag: (item: { type: 'block' | 'section'; data: any }) => void;
  updateDropTarget: (target: { sectionId?: string; index: number } | null) => void;
  endDrag: () => void;
  
  // View Actions
  setViewportSize: (size: Breakpoint) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleOutlines: () => void;
  togglePreviewMode: () => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  pushHistory: (action: string, actionAr: string) => void;
  clearHistory: () => void;
  
  // Save/Load Actions
  save: () => Promise<void>;
  load: (templateId: string) => Promise<void>;
  setDirty: (dirty: boolean) => void;
  
  // Error Actions
  addError: (message: string, messageAr: string) => void;
  clearErrors: () => void;
}

type BuilderStore = BuilderState & BuilderActions;

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState: BuilderState = {
  template: null,
  originalTemplate: null,
  selectedElement: null,
  hoveredElement: null,
  isDragging: false,
  draggedItem: null,
  dropTarget: null,
  viewportSize: 'desktop',
  zoom: 100,
  showGrid: true,
  showOutlines: false,
  previewMode: false,
  isDirty: false,
  isSaving: false,
  isLoading: false,
  lastSaved: null,
  history: [],
  historyIndex: -1,
  errors: [],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════════

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // ─────────────────────────────────────────────────────────────────────
        // Template Actions
        // ─────────────────────────────────────────────────────────────────────
        setTemplate: (template) => set((state) => {
          state.template = template;
          state.originalTemplate = template ? JSON.parse(JSON.stringify(template)) : null;
          state.selectedElement = null;
          state.isDirty = false;
          state.history = [];
          state.historyIndex = -1;
        }),

        updateTemplate: (updates) => set((state) => {
          if (!state.template) return;
          Object.assign(state.template, updates);
          state.isDirty = true;
        }),

        resetTemplate: () => set((state) => {
          if (state.originalTemplate) {
            state.template = JSON.parse(JSON.stringify(state.originalTemplate));
            state.isDirty = false;
          }
        }),

        // ─────────────────────────────────────────────────────────────────────
        // Section Actions
        // ─────────────────────────────────────────────────────────────────────
        addSection: (sectionData) => set((state) => {
          if (!state.template) return;
          
          const newSection: Section = {
            id: generateId('section'),
            name: sectionData?.name || 'New Section',
            nameAr: sectionData?.nameAr || 'قسم جديد',
            blocks: [],
            order: state.template.sections.length,
            ...DEFAULT_SECTION,
            ...sectionData,
          };
          
          state.template.sections.push(newSection);
          state.isDirty = true;
          get().pushHistory('Add Section', 'إضافة قسم');
        }),

        updateSection: (sectionId, updates) => set((state) => {
          if (!state.template) return;
          
          const section = state.template.sections.find(s => s.id === sectionId);
          if (section) {
            Object.assign(section, updates);
            state.isDirty = true;
          }
        }),

        deleteSection: (sectionId) => set((state) => {
          if (!state.template) return;
          
          const index = state.template.sections.findIndex(s => s.id === sectionId);
          if (index !== -1) {
            state.template.sections.splice(index, 1);
            // Update order
            state.template.sections.forEach((s, i) => { s.order = i; });
            state.isDirty = true;
            
            // Clear selection if deleted section was selected
            if (state.selectedElement?.type === 'section' && state.selectedElement.id === sectionId) {
              state.selectedElement = null;
            }
            
            get().pushHistory('Delete Section', 'حذف قسم');
          }
        }),

        moveSection: (fromIndex, toIndex) => set((state) => {
          if (!state.template) return;
          
          const sections = state.template.sections;
          const [removed] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, removed);
          
          // Update order
          sections.forEach((s, i) => { s.order = i; });
          state.isDirty = true;
          get().pushHistory('Move Section', 'نقل قسم');
        }),

        duplicateSection: (sectionId) => set((state) => {
          if (!state.template) return;
          
          const section = state.template.sections.find(s => s.id === sectionId);
          if (section) {
            const newSection: Section = {
              ...JSON.parse(JSON.stringify(section)),
              id: generateId('section'),
              name: `${section.name} (Copy)`,
              nameAr: `${section.nameAr} (نسخة)`,
              order: state.template.sections.length,
              blocks: section.blocks.map(b => ({
                ...JSON.parse(JSON.stringify(b)),
                id: generateId('block'),
              })),
            };
            
            const index = state.template.sections.findIndex(s => s.id === sectionId);
            state.template.sections.splice(index + 1, 0, newSection);
            
            // Update order
            state.template.sections.forEach((s, i) => { s.order = i; });
            state.isDirty = true;
            get().pushHistory('Duplicate Section', 'تكرار قسم');
          }
        }),

        // ─────────────────────────────────────────────────────────────────────
        // Block Actions
        // ─────────────────────────────────────────────────────────────────────
        addBlock: (sectionId, blockData) => set((state) => {
          if (!state.template) return;
          
          const section = state.template.sections.find(s => s.id === sectionId);
          if (section) {
            const newBlock: Block = {
              id: generateId('block'),
              type: blockData?.type || 'article-grid',
              variant: blockData?.variant || 'grid-1',
              config: { ...DEFAULT_BLOCK_CONFIG, ...blockData?.config },
              ...blockData,
            };
            
            section.blocks.push(newBlock);
            state.isDirty = true;
            get().pushHistory('Add Block', 'إضافة بلوك');
          }
        }),

        addBlockFromType: (sectionId, type) => set((state) => {
          if (!state.template) return;
          
          const section = state.template.sections.find(s => s.id === sectionId);
          const meta = getBlockMeta(type);
          const defaultVariant = getDefaultVariant(type);
          
          if (section && meta) {
            const newBlock: Block = {
              id: generateId('block'),
              type,
              variant: meta.defaultVariant,
              config: defaultVariant?.defaultConfig || DEFAULT_BLOCK_CONFIG,
              dataSource: meta.hasDataSource ? {
                mode: 'latest',
                limit: 6,
                sortBy: 'publishedAt',
                sortOrder: 'desc',
              } : undefined,
            };
            
            section.blocks.push(newBlock);
            state.isDirty = true;
            
            // Select the new block
            state.selectedElement = {
              type: 'block',
              id: newBlock.id,
              sectionId,
            };
            
            get().pushHistory(`Add ${meta.name}`, `إضافة ${meta.nameAr}`);
          }
        }),

        updateBlock: (sectionId, blockId, updates) => set((state) => {
          if (!state.template) return;
          
          const section = state.template.sections.find(s => s.id === sectionId);
          if (section) {
            const block = section.blocks.find(b => b.id === blockId);
            if (block) {
              // Deep merge for config
              if (updates.config) {
                block.config = deepMerge(block.config, updates.config);
                delete updates.config;
              }
              Object.assign(block, updates);
              state.isDirty = true;
            }
          }
        }),

        deleteBlock: (sectionId, blockId) => set((state) => {
          if (!state.template) return;
          
          const section = state.template.sections.find(s => s.id === sectionId);
          if (section) {
            const index = section.blocks.findIndex(b => b.id === blockId);
            if (index !== -1) {
              section.blocks.splice(index, 1);
              state.isDirty = true;
              
              // Clear selection if deleted block was selected
              if (state.selectedElement?.type === 'block' && state.selectedElement.id === blockId) {
                state.selectedElement = null;
              }
              
              get().pushHistory('Delete Block', 'حذف بلوك');
            }
          }
        }),

        moveBlock: (fromSectionId, toSectionId, fromIndex, toIndex) => set((state) => {
          if (!state.template) return;
          
          const fromSection = state.template.sections.find(s => s.id === fromSectionId);
          const toSection = state.template.sections.find(s => s.id === toSectionId);
          
          if (fromSection && toSection) {
            const [removed] = fromSection.blocks.splice(fromIndex, 1);
            toSection.blocks.splice(toIndex, 0, removed);
            state.isDirty = true;
            get().pushHistory('Move Block', 'نقل بلوك');
          }
        }),

        duplicateBlock: (sectionId, blockId) => set((state) => {
          if (!state.template) return;
          
          const section = state.template.sections.find(s => s.id === sectionId);
          if (section) {
            const block = section.blocks.find(b => b.id === blockId);
            if (block) {
              const newBlock: Block = {
                ...JSON.parse(JSON.stringify(block)),
                id: generateId('block'),
                name: block.name ? `${block.name} (Copy)` : undefined,
                nameAr: block.nameAr ? `${block.nameAr} (نسخة)` : undefined,
              };
              
              const index = section.blocks.findIndex(b => b.id === blockId);
              section.blocks.splice(index + 1, 0, newBlock);
              state.isDirty = true;
              get().pushHistory('Duplicate Block', 'تكرار بلوك');
            }
          }
        }),

        // ─────────────────────────────────────────────────────────────────────
        // Selection Actions
        // ─────────────────────────────────────────────────────────────────────
        selectElement: (element) => set((state) => {
          state.selectedElement = element;
        }),

        hoverElement: (element) => set((state) => {
          state.hoveredElement = element;
        }),

        clearSelection: () => set((state) => {
          state.selectedElement = null;
        }),

        // ─────────────────────────────────────────────────────────────────────
        // Drag & Drop Actions
        // ─────────────────────────────────────────────────────────────────────
        startDrag: (item) => set((state) => {
          state.isDragging = true;
          state.draggedItem = item;
        }),

        updateDropTarget: (target) => set((state) => {
          state.dropTarget = target;
        }),

        endDrag: () => set((state) => {
          state.isDragging = false;
          state.draggedItem = null;
          state.dropTarget = null;
        }),

        // ─────────────────────────────────────────────────────────────────────
        // View Actions
        // ─────────────────────────────────────────────────────────────────────
        setViewportSize: (size) => set((state) => {
          state.viewportSize = size;
        }),

        setZoom: (zoom) => set((state) => {
          state.zoom = Math.max(25, Math.min(200, zoom));
        }),

        toggleGrid: () => set((state) => {
          state.showGrid = !state.showGrid;
        }),

        toggleOutlines: () => set((state) => {
          state.showOutlines = !state.showOutlines;
        }),

        togglePreviewMode: () => set((state) => {
          state.previewMode = !state.previewMode;
          if (state.previewMode) {
            state.selectedElement = null;
          }
        }),

        // ─────────────────────────────────────────────────────────────────────
        // History Actions
        // ─────────────────────────────────────────────────────────────────────
        undo: () => set((state) => {
          if (state.historyIndex > 0 && state.history.length > 0) {
            state.historyIndex--;
            state.template = JSON.parse(JSON.stringify(state.history[state.historyIndex].state));
            state.isDirty = true;
          }
        }),

        redo: () => set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            state.template = JSON.parse(JSON.stringify(state.history[state.historyIndex].state));
            state.isDirty = true;
          }
        }),

        pushHistory: (action, actionAr) => set((state) => {
          if (!state.template) return;
          
          // Remove any future history if we're not at the end
          if (state.historyIndex < state.history.length - 1) {
            state.history = state.history.slice(0, state.historyIndex + 1);
          }
          
          // Add new history entry
          const entry: HistoryEntry = {
            id: generateId('history'),
            timestamp: Date.now(),
            action,
            actionAr,
            state: JSON.parse(JSON.stringify(state.template)),
          };
          
          state.history.push(entry);
          state.historyIndex = state.history.length - 1;
          
          // Limit history size
          if (state.history.length > 50) {
            state.history.shift();
            state.historyIndex--;
          }
        }),

        clearHistory: () => set((state) => {
          state.history = [];
          state.historyIndex = -1;
        }),

        // ─────────────────────────────────────────────────────────────────────
        // Save/Load Actions
        // ─────────────────────────────────────────────────────────────────────
        save: async () => {
          const { template } = get();
          if (!template) return;
          
          set((state) => { state.isSaving = true; });
          
          try {
            // حفظ في localStorage للتطوير
            const savedTemplates = JSON.parse(localStorage.getItem('newscore_templates') || '{}');
            savedTemplates[template.id] = {
              ...template,
              updatedAt: new Date().toISOString(),
            };
            localStorage.setItem('newscore_templates', JSON.stringify(savedTemplates));
            
            // حفظ القالب الحالي للتعديل لاحقاً
            localStorage.setItem('builder_template', JSON.stringify(template));
            
            console.log('✅ Template saved:', template.id);
            
            set((state) => {
              state.isSaving = false;
              state.isDirty = false;
              state.lastSaved = new Date().toISOString();
              state.originalTemplate = JSON.parse(JSON.stringify(template));
            });
          } catch (error) {
            console.error('Failed to save:', error);
            set((state) => {
              state.isSaving = false;
              state.errors.push({
                id: generateId('error'),
                message: 'Failed to save template',
                messageAr: 'فشل في حفظ القالب',
              });
            });
          }
        },

        load: async (templateId) => {
          set((state) => { state.isLoading = true; });
          
          try {
            // محاولة تحميل من localStorage
            const savedTemplates = JSON.parse(localStorage.getItem('newscore_templates') || '{}');
            const template = savedTemplates[templateId];
            
            if (template) {
              set((state) => {
                state.isLoading = false;
                state.template = template;
                state.originalTemplate = JSON.parse(JSON.stringify(template));
                state.isDirty = false;
              });
              console.log('✅ Template loaded:', templateId);
            } else {
              set((state) => {
                state.isLoading = false;
                state.template = null;
              });
            }
          } catch (error) {
            console.error('Failed to load:', error);
            set((state) => {
              state.isLoading = false;
              state.errors.push({
                id: generateId('error'),
                message: 'Failed to load template',
                messageAr: 'فشل في تحميل القالب',
              });
            });
          }
        },

        setDirty: (dirty) => set((state) => {
          state.isDirty = dirty;
        }),

        // ─────────────────────────────────────────────────────────────────────
        // Error Actions
        // ─────────────────────────────────────────────────────────────────────
        addError: (message, messageAr) => set((state) => {
          state.errors.push({
            id: generateId('error'),
            message,
            messageAr,
          });
        }),

        clearErrors: () => set((state) => {
          state.errors = [];
        }),
      })),
      {
        name: 'newscore-builder',
        partialize: (state) => ({
          template: state.template,
          originalTemplate: state.originalTemplate,
          viewportSize: state.viewportSize,
          zoom: state.zoom,
          showGrid: state.showGrid,
          showOutlines: state.showOutlines,
        }),
      }
    ),
    { name: 'NewsCore Builder' }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════════════════

export const selectTemplate = (state: BuilderStore) => state.template;
export const selectSections = (state: BuilderStore) => state.template?.sections || [];
export const selectSelectedElement = (state: BuilderStore) => state.selectedElement;
export const selectIsDirty = (state: BuilderStore) => state.isDirty;
export const selectViewportSize = (state: BuilderStore) => state.viewportSize;
export const selectCanUndo = (state: BuilderStore) => state.historyIndex > 0;
export const selectCanRedo = (state: BuilderStore) => state.historyIndex < state.history.length - 1;

export const selectSelectedSection = (state: BuilderStore) => {
  if (!state.template || !state.selectedElement) return null;
  if (state.selectedElement.type === 'section') {
    return state.template.sections.find(s => s.id === state.selectedElement!.id);
  }
  if (state.selectedElement.type === 'block') {
    return state.template.sections.find(s => s.id === (state.selectedElement as any).sectionId);
  }
  return null;
};

export const selectSelectedBlock = (state: BuilderStore) => {
  if (!state.template || !state.selectedElement || state.selectedElement.type !== 'block') return null;
  const section = state.template.sections.find(s => s.id === (state.selectedElement as any).sectionId);
  return section?.blocks.find(b => b.id === state.selectedElement!.id);
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        sourceValue !== undefined &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        (result as any)[key] = deepMerge(targetValue as object, sourceValue as object);
      } else if (sourceValue !== undefined) {
        (result as any)[key] = sourceValue;
      }
    }
  }
  
  return result;
}
