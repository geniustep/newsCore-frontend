import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use the locale prefix
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Redirect old nc-admin routes to new admin routes
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/nc-admin`)) {
      const newPath = pathname.replace(`/${locale}/nc-admin`, `/${locale}/admin`);
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
