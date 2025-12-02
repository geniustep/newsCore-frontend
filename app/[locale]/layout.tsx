import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo } from 'next/font/google';
import { locales, localeConfig } from '@/i18n/config';
import '@/styles/globals.css';

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

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
  // Validate locale
  if (!locales.some(l => l === locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch messages for the locale
  const messages = await getMessages();

  // Get direction from locale config
  const localeKey = locale as keyof typeof localeConfig;
  const direction = localeConfig[localeKey].direction;

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
