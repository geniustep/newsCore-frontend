import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Cairo } from 'next/font/google';
import { locales, localeConfig, Locale } from '@/i18n/config';
import { ThemeProvider, getThemeSettings } from '@/components/providers';
import '@/styles/globals.css';

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

// Generate static params for locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale - default to 'ar' if invalid
  const validLocale = locales.includes(locale as Locale) ? locale : 'ar';

  // Enable static rendering
  setRequestLocale(validLocale);

  // Import messages with fallback
  let messages;
  try {
    messages = (await import(`@/i18n/dictionaries/${validLocale}.json`)).default;
  } catch {
    // Fallback to Arabic if locale file not found
    messages = (await import(`@/i18n/dictionaries/ar.json`)).default;
  }

  // Fetch theme settings from API with error handling
  let themeSettings;
  try {
    themeSettings = await getThemeSettings();
  } catch (error) {
    console.error('Failed to fetch theme settings:', error);
    themeSettings = {
      logoAr: '',
      logoEn: '',
      logoFr: '',
      favicon: '',
      primaryColor: '#ed7520',
      secondaryColor: '#0ea5e9',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'IBM Plex Sans Arabic',
      fontSize: '16px',
      headingFont: 'IBM Plex Sans Arabic',
      borderRadius: '0.5rem',
      spacing: 'normal',
      darkModeEnabled: false,
      darkPrimaryColor: '#f59e0b',
      darkBackgroundColor: '#111827',
      darkTextColor: '#f9fafb',
    };
  }

  // Get direction from locale config
  const localeKey = validLocale as keyof typeof localeConfig;
  const direction = localeConfig[localeKey]?.direction || 'rtl';

  return (
    <html lang={validLocale} dir={direction} suppressHydrationWarning>
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
