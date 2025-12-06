/**
 * NewsCore - Breaking News Management Page
 * صفحة إدارة الأخبار العاجلة
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  AlertTriangle,
  Trash2,
  Edit,
  X,
  Check,
  Zap,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import { breakingNewsApi } from '@/lib/api/admin';
import { cn } from '@/lib/utils/cn';

interface BreakingNewsItem {
  id: string;
  title: string;
  content?: string;
  url?: string;
  isActive: boolean;
  priority: number;
  expiresAt?: string;
  createdAt: string;
}

function BreakingNewsCard({ 
  item, 
  onEdit, 
  onDelete, 
  onToggle 
}: { 
  item: BreakingNewsItem; 
  onEdit: (item: BreakingNewsItem) => void; 
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date();

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all",
      item.isActive && !isExpired
        ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
        : "border-gray-200 dark:border-gray-700"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            item.isActive && !isExpired
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-gray-100 dark:bg-gray-700"
          )}>
            <Zap className={cn(
              "w-5 h-5",
              item.isActive && !isExpired ? "text-red-600" : "text-gray-400"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {item.title}
              </h3>
              {item.isActive && !isExpired && (
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs rounded-full animate-pulse">
                  نشط
                </span>
              )}
              {isExpired && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-full">
                  منتهي
                </span>
              )}
            </div>
            {item.content && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {item.content}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(item.createdAt).toLocaleDateString('ar-SA')}
              </span>
              {item.expiresAt && (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  ينتهي: {new Date(item.expiresAt).toLocaleDateString('ar-SA')}
                </span>
              )}
              {item.url && (
                <a href={item.url} target="_blank" className="flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="w-3 h-3" />
                  رابط
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle(item.id)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              item.isActive 
                ? "hover:bg-gray-100 dark:hover:bg-gray-700" 
                : "hover:bg-green-50 dark:hover:bg-green-900/20"
            )}
            title={item.isActive ? 'إيقاف' : 'تفعيل'}
          >
            {item.isActive ? (
              <EyeOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Eye className="w-4 h-4 text-green-600" />
            )}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BreakingNewsPage() {
  const queryClient = useQueryClient();
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BreakingNewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    url: '',
    expiresAt: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-breaking-news'],
    queryFn: async () => {
      const result = await breakingNewsApi.getAll();
      return result as unknown as BreakingNewsItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => breakingNewsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-breaking-news'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof formData }) => breakingNewsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-breaking-news'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => breakingNewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-breaking-news'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => breakingNewsApi.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-breaking-news'] });
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ title: '', content: '', url: '', expiresAt: '' });
  };

  const openEditModal = (item: BreakingNewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content || '',
      url: item.url || '',
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : '',
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الخبر العاجل؟')) {
      deleteMutation.mutate(id);
    }
  };

  const items = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-red-500" />
            الأخبار العاجلة
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إدارة الأخبار العاجلة والتنبيهات
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormData({ title: '', content: '', url: '', expiresAt: '' }); }}
          className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-600/20"
        >
          <Plus className="w-5 h-5" />
          خبر عاجل جديد
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">جاري التحميل...</p>
          </div>
        ) : items.length > 0 ? (
          items.map((item: BreakingNewsItem) => (
            <BreakingNewsCard
              key={item.id}
              item={item}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggle={(id) => toggleMutation.mutate(id)}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
            <Zap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">لا توجد أخبار عاجلة</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">أضف خبراً عاجلاً ليظهر للزوار</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة خبر عاجل
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'تعديل الخبر العاجل' : 'خبر عاجل جديد'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="عنوان الخبر العاجل"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المحتوى
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="تفاصيل إضافية (اختياري)"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رابط (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ الانتهاء (اختياري)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {editingItem ? 'حفظ التغييرات' : 'إنشاء'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

