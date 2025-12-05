'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import { breakingNewsApi, type BreakingNewsItem } from '@/lib/api/breaking-news';
import type { Article } from '@/lib/api/types';

interface BreakingNewsProps {
  articles?: Article[]; // Optional for backward compatibility
  useApi?: boolean; // Use API instead of props
}

export default function BreakingNews({ articles, useApi = true }: BreakingNewsProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('');

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

  // Fetch breaking news from API if useApi is true
  useEffect(() => {
    setMounted(true);
    if (useApi) {
      breakingNewsApi
        .getActive()
        .then((data) => {
          setBreakingNews(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [useApi]);

  const items = useApi ? breakingNews : (articles || []);
  const current = items[currentIndex];

  // Update time ago when current item changes
  useEffect(() => {
    if (current && 'publishedAt' in current && current.publishedAt) {
      setTimeAgo(
        formatDistanceToNow(new Date(current.publishedAt), {
          addSuffix: true,
          locale: getLocale(),
        })
      );
    } else {
      setTimeAgo('');
    }
  }, [current, locale]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews, articles, useApi, items.length]);

  if (loading || !mounted || !items || items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  // Get URL - either from breaking news item or article slug
  const getUrl = () => {
    if (useApi && 'url' in current) {
      return (current as BreakingNewsItem).url;
    }
    if ('slug' in current) {
      return `/${locale}/article/${(current as Article).slug}`;
    }
    return '#';
  };

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
              href={getUrl()}
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
          {items.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Previous news"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="text-xs whitespace-nowrap">
                {currentIndex + 1} / {items.length}
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
