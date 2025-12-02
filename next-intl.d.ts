import 'next-intl';

declare module 'next-intl' {
  interface AppConfig {
    locales: readonly ['ar', 'en', 'fr'];
    defaultLocale: 'ar';
  }
}
