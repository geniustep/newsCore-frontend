'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';
import { menusApi } from '@/lib/api/menus';
import MenuRenderer from '@/components/menus/MenuRenderer';
import type { Menu as MenuType } from '@/lib/api/menus';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [footerMenus, setFooterMenus] = useState<{
    footer1?: MenuType;
    footer2?: MenuType;
    footer3?: MenuType;
    footer4?: MenuType;
  }>({});

  useEffect(() => {
    let isMounted = true;
    
    // Set current year on client side to avoid hydration mismatch
    setCurrentYear(new Date().getFullYear());
    
    const loadFooterMenus = async () => {
      try {
        const [menu1, menu2, menu3, menu4] = await Promise.all([
          menusApi.getByLocation('footer-1', locale).catch(() => null),
          menusApi.getByLocation('footer-2', locale).catch(() => null),
          menusApi.getByLocation('footer-3', locale).catch(() => null),
          menusApi.getByLocation('footer-4', locale).catch(() => null),
        ]);
        
        if (isMounted) {
          setFooterMenus({
            footer1: menu1 || undefined,
            footer2: menu2 || undefined,
            footer3: menu3 || undefined,
            footer4: menu4 || undefined,
          });
        }
      } catch {
        // Silently fail - fallback to default footer
        if (isMounted) {
          setFooterMenus({});
        }
      }
    };
    
    loadFooterMenus();
    
    return () => {
      isMounted = false;
    };
  }, [locale]);

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - About or Footer Menu 1 */}
          <div>
            {footerMenus.footer1 ? (
              <MenuRenderer
                menu={footerMenus.footer1}
                className="flex-col space-y-2 text-sm"
              />
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">{t('site.name')}</h3>
                <p className="text-gray-400 text-sm">{t('site.description')}</p>
              </>
            )}
          </div>

          {/* Column 2 - Quick Links or Footer Menu 2 */}
          <div>
            {footerMenus.footer2 ? (
              <MenuRenderer
                menu={footerMenus.footer2}
                className="flex-col space-y-2 text-sm"
              />
            ) : (
              <>
                <h4 className="font-semibold mb-4">{t('common.seeAll')}</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href={`/${locale}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t('nav.home')}
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>

          {/* Column 3 - Legal or Footer Menu 3 */}
          <div>
            {footerMenus.footer3 ? (
              <MenuRenderer
                menu={footerMenus.footer3}
                className="flex-col space-y-2 text-sm"
              />
            ) : (
              <>
                <h4 className="font-semibold mb-4">{t('footer.terms')}</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-400">
                    {t('footer.privacy')}
                  </li>
                  <li className="text-gray-400">
                    {t('footer.terms')}
                  </li>
                </ul>
              </>
            )}
          </div>

          {/* Column 4 - Newsletter or Footer Menu 4 */}
          <div>
            {footerMenus.footer4 ? (
              <MenuRenderer
                menu={footerMenus.footer4}
                className="flex-col space-y-2 text-sm"
              />
            ) : (
              <>
                <h4 className="font-semibold mb-4">{t('newsletter.title')}</h4>
                <form className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
                  >
                    {t('newsletter.subscribe')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            © {currentYear ?? ''} {t('site.name')}. {t('footer.copyright')}
          </p>
          <div className="flex gap-4">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
