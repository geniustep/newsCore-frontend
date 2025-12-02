export const locales = ['ar', 'en', 'fr'] as const;
export const defaultLocale = 'ar';

export type Locale = (typeof locales)[number];

export const localeConfig = {
  ar: {
    name: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
    label: 'العربية',
  },
  en: {
    name: 'English',
    direction: 'ltr',
    flag: '🇬🇧',
    label: 'English',
  },
  fr: {
    name: 'Français',
    direction: 'ltr',
    flag: '🇫🇷',
    label: 'Français',
  },
} as const;

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
