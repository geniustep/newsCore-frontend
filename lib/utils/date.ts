import { format, formatDistanceToNow } from 'date-fns';
import { ar, enUS, fr } from 'date-fns/locale';
import type { Locale } from '@/i18n/config';

const localeMap = {
  ar: ar,
  en: enUS,
  fr: fr,
};

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, locale: Locale = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PPP', { locale: localeMap[locale] });
}

/**
 * Format date to relative time (e.g., "3 hours ago")
 */
export function formatRelativeTime(date: string | Date, locale: Locale = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: localeMap[locale],
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date, locale: Locale = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PPP p', { locale: localeMap[locale] });
}
