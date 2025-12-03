'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MenuItem } from '@/lib/api/menus';

interface MegaMenuProps {
  item: MenuItem;
  onClose?: () => void;
}

export default function MegaMenu({ item, onClose }: MegaMenuProps) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const getLabel = (menuItem: MenuItem): string => {
    if (locale === 'ar' && menuItem.labelAr) return menuItem.labelAr;
    if (locale === 'en' && menuItem.labelEn) return menuItem.labelEn;
    if (locale === 'fr' && menuItem.labelFr) return menuItem.labelFr;
    return menuItem.label;
  };

  const getUrl = (menuItem: MenuItem): string => {
    if (menuItem.type === 'CUSTOM' && menuItem.url) {
      return menuItem.url.startsWith('http') ? menuItem.url : `/${locale}${menuItem.url}`;
    }
    if (menuItem.type === 'CATEGORY' && menuItem.category) {
      return `/${locale}/category/${menuItem.category.slug}`;
    }
    if (menuItem.type === 'TAG' && menuItem.tag) {
      return `/${locale}/tag/${menuItem.tag.slug}`;
    }
    if (menuItem.type === 'ARTICLE' && menuItem.article) {
      return `/${locale}/article/${menuItem.article.slug}`;
    }
    return '#';
  };

  if (!item.isMegaMenu || !item.children || item.children.length === 0) {
    return null;
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        id={`mega-menu-dropdown-button-${item.id}`}
        data-dropdown-toggle={`mega-menu-dropdown-${item.id}`}
        className="flex items-center justify-between w-full py-2 px-3 font-medium text-heading border-b border-light md:w-auto hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0"
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        <span>{getLabel(item)}</span>
        <ChevronDown className="w-4 h-4 ms-1.5" />
      </button>

      {isOpen && (
        <div
          id={`mega-menu-dropdown-${item.id}`}
          className="absolute z-10 grid hidden w-auto grid-cols-2 text-sm bg-neutral-primary-soft border border-default rounded-base shadow md:grid-cols-3"
          style={{ display: 'grid' }}
        >
          {item.children.map((child) => (
            <div key={child.id} className="p-4 pb-0 text-heading md:pb-4">
              <ul className="space-y-3" aria-labelledby={`mega-menu-dropdown-button-${item.id}`}>
                <li>
                  <Link
                    href={getUrl(child)}
                    className="text-body hover:text-fg-brand font-semibold"
                    onClick={onClose}
                  >
                    {getLabel(child)}
                  </Link>
                </li>
                {child.children &&
                  child.children.map((subChild) => (
                    <li key={subChild.id}>
                      <Link
                        href={getUrl(subChild)}
                        className="text-body hover:text-fg-brand"
                        onClick={onClose}
                      >
                        {getLabel(subChild)}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

