'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import type { Article } from '@/lib/api/types';

interface BreakingNewsProps {
  articles: Article[];
}

export default function BreakingNews({ articles }: BreakingNewsProps) {
  const locale = useLocale();

  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-secondary text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Label */}
          <div className="flex items-center gap-2 font-bold text-sm whitespace-nowrap">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span>عاجل</span>
          </div>

          {/* News Ticker */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${locale}/article/${article.slug}`}
                  className="inline-block hover:text-accent transition-colors"
                >
                  <span className="mx-8">• {article.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
