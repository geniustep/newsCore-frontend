/**
 * NewsCore Template Builder - Main Page
 * صفحة بناء القوالب الرئيسية
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBuilderStore } from '@/stores/builder-store';
import BuilderToolbar from './components/Toolbar';
import BuilderSidebar from './components/Sidebar';
import BuilderCanvas from './components/Canvas';
import BuilderInspector from './components/Inspector';
import type { Template } from '@/lib/template-engine/types';
import { generateId, DEFAULT_TEMPLATE_SETTINGS } from '@/lib/template-engine/types';

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE TEMPLATE (للتجربة)
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLE_TEMPLATE: Template = {
  id: 'home-default',
  name: 'Default Home',
  nameAr: 'الرئيسية الافتراضية',
  description: 'Default homepage template',
  descriptionAr: 'قالب الصفحة الرئيسية الافتراضي',
  type: 'home',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
  isActive: true,
  preview: '/templates/home-default.png',
  
  layout: {
    type: 'sidebar-right',
    sidebarWidth: '320px',
  },
  
  regions: {
    header: { enabled: true },
    breakingNews: { enabled: true },
    sidebar: { enabled: true, sticky: true },
    footer: { enabled: true },
  },
  
  settings: DEFAULT_TEMPLATE_SETTINGS,
  
  sections: [
    {
      id: generateId('section'),
      name: 'Hero Section',
      nameAr: 'القسم الرئيسي',
      order: 0,
      container: 'normal',
      grid: {
        columns: { desktop: 12, tablet: 12, mobile: 12 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      padding: {
        desktop: { top: 'lg', bottom: 'lg', left: 'md', right: 'md' },
      },
      margin: {
        desktop: { top: 'none', bottom: 'none' },
      },
      blocks: [
        {
          id: generateId('block'),
          type: 'big-hero',
          variant: 'hero-classic',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: true,
              showAuthor: true,
              showDate: true,
            },
          },
          dataSource: {
            mode: 'featured',
            limit: 5,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
    {
      id: generateId('section'),
      name: 'Latest News',
      nameAr: 'آخر الأخبار',
      order: 1,
      container: 'normal',
      header: {
        enabled: true,
        title: 'Latest News',
        titleAr: 'آخر الأخبار',
        style: 'bordered',
        showMore: true,
        moreLink: '/latest',
        alignment: 'start',
      },
      grid: {
        columns: { desktop: 12, tablet: 12, mobile: 12 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      padding: {
        desktop: { top: 'xl', bottom: 'xl', left: 'md', right: 'md' },
      },
      margin: {
        desktop: { top: 'none', bottom: 'none' },
      },
      blocks: [
        {
          id: generateId('block'),
          type: 'article-grid',
          variant: 'grid-1',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: true,
              showDate: true,
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
            },
          },
          dataSource: {
            mode: 'latest',
            limit: 6,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
    {
      id: generateId('section'),
      name: 'Politics Section',
      nameAr: 'قسم السياسة',
      order: 2,
      container: 'normal',
      header: {
        enabled: true,
        title: 'Politics',
        titleAr: 'سياسة',
        style: 'decorated',
        showMore: true,
        moreLink: '/category/politics',
        alignment: 'start',
        accentColor: '#1e40af',
      },
      grid: {
        columns: { desktop: 12, tablet: 12, mobile: 12 },
        gap: { desktop: 'lg', tablet: 'md', mobile: 'md' },
      },
      padding: {
        desktop: { top: 'xl', bottom: 'xl', left: 'md', right: 'md' },
      },
      margin: {
        desktop: { top: 'none', bottom: 'none' },
      },
      background: {
        type: 'color',
        color: '#f8fafc',
      },
      blocks: [
        {
          id: generateId('block'),
          type: 'article-grid',
          variant: 'grid-6',
          config: {
            display: {
              showImage: true,
              showTitle: true,
              showExcerpt: true,
              showCategory: false,
              showDate: true,
            },
          },
          dataSource: {
            mode: 'category',
            categoryIds: ['politics'],
            limit: 5,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
          },
          gridArea: { column: { start: 1, span: 12 } },
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const { setTemplate, previewMode } = useBuilderStore();

  useEffect(() => {
    const currentTemplate = useBuilderStore.getState().template;
    if (currentTemplate && !templateId) {
      return;
    }
    
    const savedTemplate = localStorage.getItem('builder_template');
    
    if (savedTemplate) {
      try {
        const parsed = JSON.parse(savedTemplate);
        if (!templateId || parsed.id === templateId) {
          setTemplate(parsed);
          localStorage.removeItem('builder_template');
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved template:', e);
      }
    }
    
    if (!currentTemplate) {
      setTemplate(SAMPLE_TEMPLATE);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        useBuilderStore.getState().save();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useBuilderStore.getState().undo();
      }
      
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        useBuilderStore.getState().redo();
      }
      
      if (e.key === 'Escape') {
        useBuilderStore.getState().clearSelection();
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const state = useBuilderStore.getState();
        if (state.selectedElement) {
          if (state.selectedElement.type === 'section') {
            state.deleteSection(state.selectedElement.id);
          } else if (state.selectedElement.type === 'block') {
            const sectionId = (state.selectedElement as { sectionId: string }).sectionId;
            state.deleteBlock(sectionId, state.selectedElement.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="-m-4 lg:-m-6 h-[calc(100vh-4rem)] flex flex-col bg-gray-100 dark:bg-gray-950 overflow-hidden" dir="rtl">
      <BuilderToolbar />

      <div className="flex-1 flex overflow-hidden">
        {!previewMode && <BuilderSidebar />}
        <BuilderCanvas />
        {!previewMode && <BuilderInspector />}
      </div>
    </div>
  );
}

