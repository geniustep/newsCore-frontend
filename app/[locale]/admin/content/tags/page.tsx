/**
 * NewsCore - Tags Management Page
 * صفحة إدارة الوسوم
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Tag,
  Trash2,
  Edit,
  X,
  Check,
  Hash,
  TrendingUp,
} from 'lucide-react';
import { tagsApi } from '@/lib/api/admin';
import { useAdminAuthStore } from '@/stores/admin-auth';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  type?: string;
  usageCount?: number;
  createdAt: string;
}

function TagCard({ tag, onEdit, onDelete }: { tag: TagItem; onEdit: (tag: TagItem) => void; onDelete: (id: string) => void }) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Hash className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{tag.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">/{tag.slug}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(tag)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(tag.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          {tag.usageCount || 0} استخدام
        </span>
        {tag.type && (
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            {tag.type}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TagsManagementPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAdminAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [newTagName, setNewTagName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tags', searchQuery],
    queryFn: async () => {
      const result = await tagsApi.getAll(searchQuery || undefined);
      return result as unknown as TagItem[];
    },
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => tagsApi.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setShowAddModal(false);
      setNewTagName('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => tagsApi.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setEditingTag(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الوسم؟')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = () => {
    if (newTagName.trim()) {
      createMutation.mutate(newTagName.trim());
    }
  };

  const handleUpdate = () => {
    if (editingTag && newTagName.trim()) {
      updateMutation.mutate({ id: editingTag.id, name: newTagName.trim() });
    }
  };

  const tags = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الوسوم</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إنشاء وتعديل وسوم المقالات
          </p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setNewTagName(''); }}
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          وسم جديد
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الوسوم..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Tags Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">جاري التحميل...</p>
          </div>
        ) : tags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tags.map((tag: TagItem) => (
              <TagCard 
                key={tag.id} 
                tag={tag} 
                onEdit={(t) => { setEditingTag(t); setNewTagName(t.name); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد وسوم</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">ابدأ بإنشاء وسمك الأول</p>
            <button
              onClick={() => { setShowAddModal(true); setNewTagName(''); }}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إنشاء وسم
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTag) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {editingTag ? 'تعديل الوسم' : 'وسم جديد'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingTag(null); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الوسم
              </label>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="أدخل اسم الوسم"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => { setShowAddModal(false); setEditingTag(null); }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={editingTag ? handleUpdate : handleCreate}
                disabled={!newTagName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingTag ? 'حفظ التغييرات' : 'إنشاء'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

