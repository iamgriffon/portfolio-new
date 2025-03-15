import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
// import { locales } from './app/i18n';


export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'pt-BR', 'zh'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Detect locale from browser settings when possible
  localeDetection: true
});

export const config = {
  // Match all pathnames except for ones starting with
  // - api (API routes)
  // - _next (Next.js internals)
  // - static files like favicon.ico, robots.txt, ...
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname
  
  // Check if this is the skills page
  if (pathname.includes('/skills')) {
    return NextResponse.next();  // Skip processing for skills page to avoid potential loops
  }
  
  // Handle normal locale redirects for other pages
  const locales = ['en', 'pt-BR', 'zh'];
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (!pathnameHasLocale) {
    // ... existing redirect logic ...
  }
  
  return NextResponse.next()
} 