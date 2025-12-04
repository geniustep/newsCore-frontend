'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { UserPlus, LogIn, Moon, Sun } from 'lucide-react';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import WeatherWidget from './WeatherWidget';
import CurrencyTicker from './CurrencyTicker';
import { formatDate } from '@/lib/utils/date';

export default function TopBar() {
  const t = useTranslations();
  const locale = useLocale();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Set Gregorian date
    setCurrentDate(formatDate(new Date(), locale as 'ar' | 'en' | 'fr'));

    // Set Hijri date (placeholder - you can integrate with a Hijri calendar library)
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    setHijriDate(hijri);
  }, [locale]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // TODO: Implement theme switching with Tailwind dark mode
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="bg-primary text-white border-b border-primary-dark">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          {/* Left Section - Dates and Weather */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span>{currentDate}</span>
              {locale === 'ar' && (
                <>
                  <span className="text-white/60">|</span>
                  <span className="text-white/90">{hijriDate}</span>
                </>
              )}
            </div>
            <span className="hidden sm:inline text-white/60">|</span>
            <WeatherWidget />
            <span className="hidden md:inline text-white/60">|</span>
            <div className="hidden md:block">
              <CurrencyTicker />
            </div>
          </div>

          {/* Right Section - Auth Links and Settings */}
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/subscribe`}
              className="hover:text-white/80 transition-colors font-medium"
            >
              {t('auth.subscribe')}
            </Link>
            <span className="text-white/60">|</span>
            <Link
              href={`/${locale}/login`}
              className="flex items-center gap-1 hover:text-white/80 transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>{t('auth.login')}</span>
            </Link>
            <Link
              href={`/${locale}/register`}
              className="flex items-center gap-1 hover:text-white/80 transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              <span>{t('auth.register')}</span>
            </Link>
            <span className="text-white/60">|</span>
            <button
              onClick={toggleTheme}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
