import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('better-auth.session_token');
  
  // Routes that REQUIRE login
  const protectedRoutes = ['/settings', '/profile', '/onboarding', '/match'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};