'use client';

import { useTranslations } from 'next-intl';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const t = useTranslations('common');

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center max-w-md p-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('error')}
        </h3>
        {message && (
          <p className="text-gray-600 mb-4">{message}</p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            {t('retry')}
          </button>
        )}
      </div>
    </div>
  );
}
