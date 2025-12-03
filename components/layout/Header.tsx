'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { formatDate } from '@/lib/utils/date';
import type { Category } from '@/lib/api/types';

interface HeaderProps {
  categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Only render date on client side to avoid hydration mismatch
    setCurrentDate(formatDate(new Date(), locale as 'ar' | 'en' | 'fr'));
  }, [locale]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>{currentDate || '\u00A0'}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl md:text-3xl font-bold text-primary">
            {t('site.name')}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
            <Link
              href={`/${locale}`}
              className="py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
