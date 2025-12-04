'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, PenTool } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  avatar: string;
  title: string;
}

interface OpinionArticle {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  author: Author;
}

interface OpinionSectionProps {
  articles: OpinionArticle[];
}

export default function OpinionSection({ articles }: OpinionSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  if (!articles || articles.length === 0) return null;

  const visibleArticles = articles.slice(currentIndex, currentIndex + itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(articles.length - itemsPerPage, prev + itemsPerPage)
    );
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <PenTool className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">{t('sections.opinions')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= articles.length}
              className="p-2 bg-white rounded-full shadow hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Articles Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleArticles.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/article/${article.slug}`}
              className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Author Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {article.author.name}
                    </h4>
                    <p className="text-sm text-gray-600">{article.author.title}</p>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 text-sm">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* All Writers Link */}
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/writers`}
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
          >
            <span>{t('sections.allWriters')}</span>
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
