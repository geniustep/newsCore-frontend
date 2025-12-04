'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import TopBar from '@/components/homepage/TopBar';
import SearchBar from '@/components/homepage/SearchBar';
import SocialLinks from '@/components/homepage/SocialLinks';
import { menusApi } from '@/lib/api/menus';
import MenuRenderer from '@/components/menus/MenuRenderer';
import type { Menu as MenuType } from '@/lib/api/menus';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerMenu, setHeaderMenu] = useState<MenuType | null>(null);
  const [mobileMenu, setMobileMenu] = useState<MenuType | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load menus
    const loadMenus = async () => {
      try {
        const [header, mobile] = await Promise.all([
          menusApi.getByLocation('header', locale).catch(() => null),
          menusApi.getByLocation('mobile', locale).catch(() => null),
        ]);
        if (isMounted) {
          if (header) setHeaderMenu(header);
          if (mobile) setMobileMenu(mobile);
        }
      } catch {
        if (isMounted) {
          setHeaderMenu(null);
          setMobileMenu(null);
        }
      }
    };

    loadMenus();

    // Handle sticky header
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [locale]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar */}
      <TopBar />

      {/* Logo Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center gap-4">
          {/* Social Links - Left */}
          <div className="hidden lg:flex">
            <SocialLinks />
          </div>

          {/* Logo - Center */}
          <div className="flex-1 text-center lg:flex-initial">
            <Link href={`/${locale}`} className="inline-block">
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                {t('site.name')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{t('site.tagline')}</p>
            </Link>
          </div>

          {/* Search - Right */}
          <div className="flex items-center gap-2">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`border-t border-gray-200 ${isSticky ? 'sticky top-0 z-40 shadow-md bg-white' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 py-3">
              {headerMenu ? (
                <MenuRenderer menu={headerMenu} />
              ) : (
                <Link href={`/${locale}`} className="hover:text-primary transition-colors font-medium">
                  {t('nav.home')}
                </Link>
              )}
            </div>

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
            <div className="md:hidden pb-4 border-t border-gray-200">
              {mobileMenu ? (
                <MenuRenderer
                  menu={mobileMenu}
                  className="flex-col"
                />
              ) : (
                <Link
                  href={`/${locale}`}
                  className="block py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
