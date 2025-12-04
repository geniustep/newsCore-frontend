import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo } from 'next/font/google';
import { locales, localeConfig } from '@/i18n/config';
import { ThemeProvider, getThemeSettings } from '@/components/providers';
import '@/styles/globals.css';

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

// Return empty to avoid static generation issues
// Locales will be handled dynamically
export function generateStaticParams() {
  return [];
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.some(l => l === locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Import messages directly to avoid using headers
  const messages = (await import(`@/i18n/dictionaries/${locale}.json`)).default;

  // Fetch theme settings from API
  const themeSettings = await getThemeSettings();

  // Get direction from locale config
  const localeKey = locale as keyof typeof localeConfig;
  const direction = localeConfig[localeKey].direction;

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <link rel="icon" href={themeSettings.favicon || "/favicon.svg"} type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <ThemeProvider initialTheme={themeSettings}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
