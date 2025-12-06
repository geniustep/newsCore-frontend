'use client';

import { Eye, AlertTriangle } from 'lucide-react';

interface PreviewBannerProps {
  status: string;
}

export default function PreviewBanner({ status }: PreviewBannerProps) {
  const statusLabels: Record<string, { label: string; color: string; icon: typeof Eye }> = {
    DRAFT: { label: 'مسودة', color: 'bg-yellow-500', icon: AlertTriangle },
    PENDING: { label: 'قيد المراجعة', color: 'bg-blue-500', icon: Eye },
    ARCHIVED: { label: 'مؤرشف', color: 'bg-red-500', icon: AlertTriangle },
  };

  const statusInfo = statusLabels[status] || statusLabels.DRAFT;
  const Icon = statusInfo.icon;

  return (
    <div className={`${statusInfo.color} text-white py-3 px-4 text-center sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">
          وضع المعاينة - هذه الصفحة {statusInfo.label} وغير منشورة للعموم
        </span>
      </div>
    </div>
  );
}

