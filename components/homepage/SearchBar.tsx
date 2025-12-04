'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-gray-700" />
      </button>

      {/* Expanded Search Input */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full px-6 py-4 pr-20 text-lg border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="submit"
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                  aria-label="Submit search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Search Suggestions (optional) */}
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">{t('search.popular')}:</p>
              <div className="flex flex-wrap gap-2">
                {['سياسة', 'اقتصاد', 'رياضة', 'تقنية'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
