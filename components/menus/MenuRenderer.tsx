'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Menu, MenuItem } from '@/lib/api/menus';

interface MenuRendererProps {
  menu: Menu;
  className?: string;
}

export default function MenuRenderer({
  menu,
  className = '',
}: MenuRendererProps) {
  const locale = useLocale();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getLabel = (item: MenuItem): string => {
    if (locale === 'ar' && item.labelAr) return item.labelAr;
    if (locale === 'en' && item.labelEn) return item.labelEn;
    if (locale === 'fr' && item.labelFr) return item.labelFr;
    return item.label;
  };

  const getUrl = (item: MenuItem): string => {
    if (item.type === 'CUSTOM' && item.url) {
      return item.url.startsWith('http') ? item.url : `/${locale}${item.url}`;
    }
    if (item.type === 'CATEGORY' && item.category) {
      return `/${locale}/category/${item.category.slug}`;
    }
    if (item.type === 'TAG' && item.tag) {
      return `/${locale}/tag/${item.tag.slug}`;
    }
    if (item.type === 'ARTICLE' && item.article) {
      return `/${locale}/article/${item.article.slug}`;
    }
    return '#';
  };

  const renderMenuItem = (item: MenuItem, level = 0): React.ReactNode => {
    if (!item.isVisible) return null;

    // Check device visibility
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      if (isMobile && !item.showOnMobile) return null;
      if (!isMobile && !item.showOnDesktop) return null;
    }

    if (item.type === 'DIVIDER') {
      return <div key={item.id} className="border-t my-2" />;
    }

    if (item.type === 'HEADING') {
      return (
        <div key={item.id} className="font-semibold text-gray-700 px-4 py-2">
          {getLabel(item)}
        </div>
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const isMegaMenu = item.isMegaMenu && hasChildren;
    const isActive = activeDropdown === item.id;

    if (isMegaMenu) {
      return (
        <li key={item.id} className="relative group">
          <button
            id={`mega-menu-dropdown-button-${item.id}`}
            data-dropdown-toggle={`mega-menu-dropdown-${item.id}`}
            className={`flex items-center justify-between w-full py-2 px-3 font-medium text-heading border-b border-light md:w-auto hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 ${item.cssClass || ''}`}
            onMouseEnter={() => setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="flex items-center gap-2">
              {item.icon && <span>{item.icon}</span>}
              <span>{getLabel(item)}</span>
            </span>
            {hasChildren && <ChevronDown className="w-4 h-4 ms-1.5" />}
          </button>
          {isActive && (
            <div
              id={`mega-menu-dropdown-${item.id}`}
              className="absolute z-10 grid w-auto grid-cols-2 text-sm bg-neutral-primary-soft border border-default rounded-base shadow md:grid-cols-3"
              style={{ display: 'grid' }}
            >
              {item.children?.map((child) => (
                <div key={child.id} className="p-4 pb-0 text-heading md:pb-4">
                  <ul className="space-y-3" aria-labelledby={`mega-menu-dropdown-button-${item.id}`}>
                    <li>
                      <Link
                        href={getUrl(child)}
                        className="text-body hover:text-fg-brand font-semibold"
                      >
                        {getLabel(child)}
                      </Link>
                    </li>
                    {child.children && child.children.length > 0 && (
                      <>
                        {child.children.map((subChild) => (
                          <li key={subChild.id}>
                            <Link
                              href={getUrl(subChild)}
                              className="text-body hover:text-fg-brand"
                            >
                              {getLabel(subChild)}
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </li>
      );
    }

    if (hasChildren) {
      return (
        <li
          key={item.id}
          className="relative group"
          onMouseEnter={() => setActiveDropdown(item.id)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${item.cssClass || ''}`}
          >
            {item.icon && <span className="mr-1">{item.icon}</span>}
            <span>{getLabel(item)}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {isActive && (
            <div className="absolute top-full left-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
              <ul className="py-2">
                {item.children.map((child) => (
                  <li key={child.id}>
                    {renderMenuItem(child, level + 1)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      );
    }

    return (
      <li key={item.id}>
        <Link
          href={getUrl(item)}
          target={item.target || '_self'}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${item.cssClass || ''}`}
        >
          {item.icon && <span>{item.icon}</span>}
          <span>{getLabel(item)}</span>
        </Link>
      </li>
    );
  };

  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      <ul className="flex items-center gap-2 flex-wrap">
        {menu.items
          .filter((item) => item.isActive && item.isVisible)
          .map((item) => renderMenuItem(item))}
      </ul>
    </nav>
  );
}

