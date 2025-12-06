/**
 * NewsCore - Media Library Page
 * صفحة مكتبة الوسائط
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Upload,
  Search,
  Grid,
  List,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Trash2,
  Download,
  Eye,
  FolderPlus,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { mediaApi } from '@/lib/api/admin';
import { cn } from '@/lib/utils/cn';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  folder?: string;
  createdAt: string;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  return FileText;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function MediaCard({ item, onSelect, onDelete }: { item: MediaItem; onSelect: (item: MediaItem) => void; onDelete: (id: string) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const Icon = getFileIcon(item.mimeType);
  const isImage = item.mimeType.startsWith('image/');

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
      <div 
        className="aspect-square bg-gray-100 dark:bg-gray-700 cursor-pointer"
        onClick={() => onSelect(item)}
      >
        {isImage && item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.alt || item.originalName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {item.originalName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(item.size)}
        </p>
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20 min-w-32">
                <button
                  onClick={() => { onSelect(item); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  عرض
                </button>
                <a
                  href={item.url}
                  download
                  className="w-full px-3 py-2 text-right text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  تحميل
                </a>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => { onDelete(item.id); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
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

export default function MediaLibraryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-media', searchQuery, typeFilter],
    queryFn: async () => {
      const result = await mediaApi.getAll({
        search: searchQuery || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
      });
      return result as unknown as { data: MediaItem[]; meta: { total: number } };
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await mediaApi.upload(file);
      }
      refetch();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      try {
        await mediaApi.delete(id);
        refetch();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const typeOptions = [
    { value: 'all', label: 'الكل', icon: Filter },
    { value: 'image', label: 'صور', icon: ImageIcon },
    { value: 'video', label: 'فيديو', icon: Video },
    { value: 'audio', label: 'صوت', icon: Music },
    { value: 'document', label: 'مستندات', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مكتبة الوسائط</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إدارة الصور والملفات المرفوعة
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
            <FolderPlus className="w-5 h-5" />
            مجلد جديد
          </button>
          <label className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer">
            <Upload className="w-5 h-5" />
            رفع ملفات
            <input type="file" multiple className="hidden" onChange={handleUpload} accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
          </label>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في الملفات..."
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Type Filter */}
            <div className="flex gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
                    typeFilter === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2', viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700')}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2', viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700')}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 dark:text-blue-400">جاري رفع الملفات...</span>
        </div>
      )}

      {/* Media Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">جاري التحميل...</p>
          </div>
        ) : (data?.data?.length ?? 0) > 0 ? (
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'space-y-2'
          )}>
            {data?.data?.map((item: MediaItem) => (
              <MediaCard 
                key={item.id} 
                item={item} 
                onSelect={setSelectedItem}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد ملفات</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">ابدأ برفع ملفاتك الأولى</p>
            <label className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              رفع ملفات
              <input type="file" multiple className="hidden" onChange={handleUpload} />
            </label>
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedItem.originalName}</h3>
              <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                ✕
              </button>
            </div>
            <div className="p-6">
              {selectedItem.mimeType.startsWith('image/') ? (
                <img src={selectedItem.url} alt={selectedItem.alt || ''} className="max-w-full max-h-[60vh] mx-auto rounded-lg" />
              ) : (
                <div className="text-center py-12">
                  {(() => { const Icon = getFileIcon(selectedItem.mimeType); return <Icon className="w-24 h-24 text-gray-400 mx-auto" />; })()}
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">الحجم:</span> {formatFileSize(selectedItem.size)}</div>
                <div><span className="text-gray-500">النوع:</span> {selectedItem.mimeType}</div>
                <div className="col-span-2"><span className="text-gray-500">الرابط:</span> <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{selectedItem.url}</code></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

