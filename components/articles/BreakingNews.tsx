'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import type { Article } from '@/lib/api/types';

interface BreakingNewsProps {
  articles: Article[];
}

export default function BreakingNews({ articles }: BreakingNewsProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!articles || articles.length === 0) return null;

  const current = articles[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const getLocale = () => {
    switch (locale) {
      case 'ar':
        return ar;
      case 'fr':
        return fr;
      default:
        return enUS;
    }
  };

  const timeAgo = current.published_at
    ? formatDistanceToNow(new Date(current.published_at), {
        addSuffix: true,
        locale: getLocale(),
      })
    : '';

  return (
    <div className="bg-secondary text-white py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 font-bold text-sm whitespace-nowrap bg-white text-secondary px-3 py-1 rounded">
            <AlertCircle className="w-4 h-4 animate-pulse-slow" />
            <span>{t('news.breaking')}</span>
          </div>

          {/* News Content */}
          <div className="flex-1 overflow-hidden">
            <Link
              href={`/${locale}/article/${current.slug}`}
              className="block hover:text-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{current.title}</span>
                {timeAgo && (
                  <span className="text-xs text-white/80 whitespace-nowrap">({timeAgo})</span>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation Arrows */}
          {articles.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Previous news"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-xs whitespace-nowrap">
                {currentIndex + 1} / {articles.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Next news"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
