import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that REQUIRE login
const protectedRoutes = ['/settings', '/profile', '/onboarding', '/match'];

// Next 16: proxy.ts replaces the deprecated middleware.ts convention.
// Runs before routes render — use for route-level auth protection.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exact segment matching — '/settings' must not also protect '/settings-foo'
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const sessionToken = request.cookies.get('better-auth.session_token');
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
