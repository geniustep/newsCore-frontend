/**
 * NewsCore Builder - Toolbar Component
 * شريط الأدوات العلوي
 */

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Save,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Grid,
  Square,
  MoreVertical,
  ArrowLeft,
  Check,
  Loader2,
} from 'lucide-react';
import { useBuilderStore, selectCanUndo, selectCanRedo } from '@/stores/builder-store';
import { cn } from '@/lib/utils/cn';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function BuilderToolbar() {
  const locale = useLocale();
  const {
    template,
    viewportSize,
    zoom,
    showGrid,
    showOutlines,
    previewMode,
    isDirty,
    isSaving,
    setViewportSize,
    setZoom,
    toggleGrid,
    toggleOutlines,
    togglePreviewMode,
    undo,
    redo,
    save,
  } = useBuilderStore();

  const canUndo = useBuilderStore(selectCanUndo);
  const canRedo = useBuilderStore(selectCanRedo);

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Back Button */}
        <Link
          href={`/${locale}/nc-admin/templates`}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">رجوع</span>
        </Link>

        {/* Template Name */}
        {template && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {template.nameAr || template.name}
            </span>
            {isDirty && (
              <span className="w-2 h-2 bg-orange-500 rounded-full" title="غير محفوظ" />
            )}
          </div>
        )}
      </div>

      {/* Center - Viewport & Zoom */}
      <div className="flex items-center gap-2">
        {/* Viewport Switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <ViewportButton
            active={viewportSize === 'desktop'}
            onClick={() => setViewportSize('desktop')}
            icon={<Monitor className="w-4 h-4" />}
            title="سطح المكتب"
          />
          <ViewportButton
            active={viewportSize === 'tablet'}
            onClick={() => setViewportSize('tablet')}
            icon={<Tablet className="w-4 h-4" />}
            title="جهاز لوحي"
          />
          <ViewportButton
            active={viewportSize === 'mobile'}
            onClick={() => setViewportSize('mobile')}
            icon={<Smartphone className="w-4 h-4" />}
            title="هاتف"
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1">
          <button
            onClick={() => setZoom(zoom - 10)}
            disabled={zoom <= 25}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(zoom + 10)}
            disabled={zoom >= 200}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* View Options */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={toggleGrid}
            className={cn(
              'p-1.5 rounded transition-colors',
              showGrid 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            title="إظهار الشبكة"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={toggleOutlines}
            className={cn(
              'p-1.5 rounded transition-colors',
              showOutlines 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            title="إظهار الحدود"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* History */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="تراجع (Ctrl+Z)"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="إعادة (Ctrl+Y)"
          >
            <Redo className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

        {/* Preview Toggle */}
        <button
          onClick={togglePreviewMode}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
            previewMode 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          {previewMode ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">إنهاء المعاينة</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="text-sm">معاينة</span>
            </>
          )}
        </button>

        {/* Save Button */}
        <button
          onClick={save}
          disabled={!isDirty || isSaving}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            isDirty
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">جاري الحفظ...</span>
            </>
          ) : isDirty ? (
            <>
              <Save className="w-4 h-4" />
              <span className="text-sm">حفظ</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">محفوظ</span>
            </>
          )}
        </button>

        {/* More Options */}
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          title="خيارات إضافية"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEWPORT BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

interface ViewportButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}

function ViewportButton({ active, onClick, icon, title }: ViewportButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-1.5 rounded transition-colors',
        active 
          ? 'bg-primary text-white' 
          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      )}
      title={title}
    >
      {icon}
    </button>
  );
}
