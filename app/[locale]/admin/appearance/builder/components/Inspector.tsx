/**
 * NewsCore Builder - Inspector Component
 * لوحة إعدادات العنصر المحدد
 */

'use client';

import { useState } from 'react';
import {
  Settings,
  Database,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Eye,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { useBuilderStore, selectSelectedBlock, selectSelectedSection } from '@/stores/builder-store';
import { getBlockMeta, getBlockVariants } from '@/lib/template-engine/registry';
import type { Block, Section } from '@/lib/template-engine/types';
import { cn } from '@/lib/utils/cn';

type Tab = 'settings' | 'data' | 'style';

export default function BuilderInspector() {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['variant', 'display']));

  const { selectedElement, updateBlock, updateSection, clearSelection } = useBuilderStore();
  
  const selectedBlock = useBuilderStore(selectSelectedBlock);
  const selectedSection = useBuilderStore(selectSelectedSection);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              اختر عنصراً لتعديل إعداداته
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedElement.type === 'section' && selectedSection) {
    return (
      <SectionInspector
        section={selectedSection}
        onUpdate={(updates) => updateSection(selectedSection.id, updates)}
        onClose={clearSelection}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
      />
    );
  }

  if (selectedElement.type === 'block' && selectedBlock && selectedSection) {
    return (
      <BlockInspector
        block={selectedBlock}
        sectionId={selectedSection.id}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUpdate={(updates) => updateBlock(selectedSection.id, selectedBlock.id, updates)}
        onClose={clearSelection}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
      />
    );
  }

  return null;
}

interface SectionInspectorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onClose: () => void;
  expandedGroups: Set<string>;
  toggleGroup: (groupId: string) => void;
}

function SectionInspector({ section, onUpdate, onClose, expandedGroups, toggleGroup }: SectionInspectorProps) {
  const hasCustomLayout = section.layout?.type && section.layout.type !== 'full-width';
  
  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">إعدادات القسم</h3>
          <p className="text-sm text-gray-500">{section.nameAr || section.name}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <FieldGroup id="info" title="المعلومات الأساسية" icon={<Settings className="w-4 h-4" />} expanded={expandedGroups.has('info')} onToggle={() => toggleGroup('info')}>
          <TextField label="الاسم" value={section.nameAr || section.name} onChange={(value) => onUpdate({ nameAr: value })} />
        </FieldGroup>

        <FieldGroup id="layout" title="تخطيط القسم" icon={<Layout className="w-4 h-4" />} expanded={expandedGroups.has('layout')} onToggle={() => toggleGroup('layout')}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdate({ layout: { type: 'full-width' } })}
              className={cn('p-3 border-2 rounded-lg text-center', !hasCustomLayout ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700')}
            >
              <div className="w-full h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <span className="text-xs">عرض كامل</span>
            </button>
            <button
              onClick={() => onUpdate({ layout: { type: 'sidebar-right', sidebarWidth: '320px' } })}
              className={cn('p-3 border-2 rounded-lg text-center', section.layout?.type === 'sidebar-right' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700')}
            >
              <div className="flex gap-1 h-8 mb-2">
                <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="w-6 bg-primary/30 rounded" />
              </div>
              <span className="text-xs">+ Sidebar</span>
            </button>
          </div>
        </FieldGroup>

        <FieldGroup id="header" title="عنوان القسم" icon={<Type className="w-4 h-4" />} expanded={expandedGroups.has('header')} onToggle={() => toggleGroup('header')}>
          <ToggleField label="إظهار العنوان" value={section.header?.enabled || false} onChange={(value) => onUpdate({ header: { ...section.header, enabled: value, title: '', titleAr: '', style: 'bordered', showMore: false, alignment: 'start' } })} />
          {section.header?.enabled && (
            <TextField label="نص العنوان" value={section.header?.titleAr || ''} onChange={(value) => onUpdate({ header: { ...section.header!, titleAr: value } })} />
          )}
        </FieldGroup>

        <FieldGroup id="background" title="الخلفية" icon={<Palette className="w-4 h-4" />} expanded={expandedGroups.has('background')} onToggle={() => toggleGroup('background')}>
          <SelectField
            label="نوع الخلفية"
            value={section.background?.type || 'none'}
            options={[{ value: 'none', label: 'بدون' }, { value: 'color', label: 'لون' }]}
            onChange={(value) => onUpdate({ background: { ...section.background, type: value as 'none' | 'color' | 'gradient' | 'image' | 'pattern' } })}
          />
          {section.background?.type === 'color' && (
            <div className="flex gap-2">
              <input type="color" value={section.background?.color || '#f8fafc'} onChange={(e) => onUpdate({ background: { type: 'color', ...section.background, color: e.target.value } })} className="w-10 h-10 rounded border cursor-pointer" />
              <input type="text" value={section.background?.color || '#f8fafc'} onChange={(e) => onUpdate({ background: { type: 'color', ...section.background, color: e.target.value } })} className="flex-1 px-3 py-2 text-sm border rounded-lg" dir="ltr" />
            </div>
          )}
        </FieldGroup>
      </div>
    </div>
  );
}

interface BlockInspectorProps {
  block: Block;
  sectionId: string;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onUpdate: (updates: Partial<Block>) => void;
  onClose: () => void;
  expandedGroups: Set<string>;
  toggleGroup: (groupId: string) => void;
}

function BlockInspector({ block, activeTab, setActiveTab, onUpdate, onClose, expandedGroups, toggleGroup }: BlockInspectorProps) {
  const meta = getBlockMeta(block.type);
  const variants = getBlockVariants(block.type);

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 dark:text-white">{meta?.nameAr || block.type}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">{block.variant}</p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings className="w-4 h-4" />} label="الإعدادات" />
        {meta?.hasDataSource && <TabButton active={activeTab === 'data'} onClick={() => setActiveTab('data')} icon={<Database className="w-4 h-4" />} label="البيانات" />}
        <TabButton active={activeTab === 'style'} onClick={() => setActiveTab('style')} icon={<Palette className="w-4 h-4" />} label="التصميم" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'settings' && (
          <>
            <FieldGroup id="variant" title="التنويعة" icon={<Layout className="w-4 h-4" />} expanded={expandedGroups.has('variant')} onToggle={() => toggleGroup('variant')}>
              <div className="grid grid-cols-2 gap-2">
                {variants.slice(0, 8).map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => onUpdate({ variant: variant.id })}
                    className={cn('p-2 border rounded-lg text-center text-xs', block.variant === variant.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-700')}
                  >
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded mb-1" />
                    <span className="line-clamp-1">{variant.nameAr}</span>
                  </button>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup id="display" title="خيارات العرض" icon={<Eye className="w-4 h-4" />} expanded={expandedGroups.has('display')} onToggle={() => toggleGroup('display')}>
              <ToggleField label="إظهار الصورة" value={block.config.display?.showImage !== false} onChange={(value) => onUpdate({ config: { ...block.config, display: { ...block.config.display, showImage: value } } })} />
              <ToggleField label="إظهار العنوان" value={block.config.display?.showTitle !== false} onChange={(value) => onUpdate({ config: { ...block.config, display: { ...block.config.display, showTitle: value } } })} />
              <ToggleField label="إظهار المقتطف" value={block.config.display?.showExcerpt !== false} onChange={(value) => onUpdate({ config: { ...block.config, display: { ...block.config.display, showExcerpt: value } } })} />
              <ToggleField label="إظهار القسم" value={block.config.display?.showCategory !== false} onChange={(value) => onUpdate({ config: { ...block.config, display: { ...block.config.display, showCategory: value } } })} />
              <ToggleField label="إظهار التاريخ" value={block.config.display?.showDate !== false} onChange={(value) => onUpdate({ config: { ...block.config, display: { ...block.config.display, showDate: value } } })} />
            </FieldGroup>
          </>
        )}

        {activeTab === 'data' && block.dataSource && (
          <FieldGroup id="datasource" title="مصدر البيانات" icon={<Database className="w-4 h-4" />} expanded={expandedGroups.has('datasource')} onToggle={() => toggleGroup('datasource')}>
            <SelectField
              label="النوع"
              value={block.dataSource.mode}
              options={[{ value: 'latest', label: 'آخر المقالات' }, { value: 'category', label: 'من قسم' }, { value: 'trending', label: 'الأكثر قراءة' }, { value: 'featured', label: 'المميزة' }]}
              onChange={(value) => onUpdate({ dataSource: { ...block.dataSource!, mode: value as 'latest' | 'category' | 'trending' | 'featured' | 'manual' | 'related' | 'author' } })}
            />
            <NumberField label="عدد المقالات" value={block.dataSource.limit} min={1} max={20} onChange={(value) => onUpdate({ dataSource: { ...block.dataSource!, limit: value } })} />
          </FieldGroup>
        )}

        {activeTab === 'style' && (
          <>
            <FieldGroup id="image" title="إعدادات الصورة" icon={<ImageIcon className="w-4 h-4" />} expanded={expandedGroups.has('image')} onToggle={() => toggleGroup('image')}>
              <SelectField
                label="نسبة العرض"
                value={block.config.image?.aspectRatio || '16:9'}
                options={[{ value: '16:9', label: '16:9' }, { value: '4:3', label: '4:3' }, { value: '1:1', label: '1:1' }]}
                onChange={(value) => onUpdate({ config: { ...block.config, image: { ...block.config.image, aspectRatio: value as '16:9' | '4:3' | '1:1' | '3:2' | '3:4' | '21:9' | '9:16' | 'auto' | 'original' } } })}
              />
            </FieldGroup>

            <FieldGroup id="card" title="نمط البطاقة" icon={<Palette className="w-4 h-4" />} expanded={expandedGroups.has('card')} onToggle={() => toggleGroup('card')}>
              <SelectField
                label="النمط"
                value={block.config.card?.style || 'elevated'}
                options={[{ value: 'flat', label: 'مسطح' }, { value: 'elevated', label: 'مرتفع' }, { value: 'outlined', label: 'محدد' }]}
                onChange={(value) => onUpdate({ config: { ...block.config, card: { ...block.config.card, style: value as 'flat' | 'elevated' | 'outlined' | 'glass' } } })}
              />
            </FieldGroup>
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={cn('flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium', active ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700')}>
      {icon}
      {label}
    </button>
  );
}

interface FieldGroupProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FieldGroup({ title, icon, expanded, onToggle, children }: FieldGroupProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
        <span className="text-gray-500">{icon}</span>
        <span className="flex-1 text-right text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && <div className="p-3 space-y-3 bg-white dark:bg-gray-900">{children}</div>}
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800" />
    </div>
  );
}

function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800" />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <button onClick={() => onChange(!value)} className={cn('relative w-10 h-6 rounded-full transition-colors', value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600')}>
        <span className={cn('absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow', value ? 'right-1' : 'left-1')} />
      </button>
    </div>
  );
}
