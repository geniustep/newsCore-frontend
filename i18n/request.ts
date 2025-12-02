import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { requestLocale } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async () => {
  // Get locale using the new API
  const locale = await requestLocale();
  
  // Validate that the incoming locale parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./dictionaries/${locale}.json`)).default,
  };
});
