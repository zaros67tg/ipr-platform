import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /match and /submit routes
  if (pathname.startsWith('/match') || pathname.startsWith('/submit')) {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value || 
                         request.cookies.get('__Secure-better-auth.session_token')?.value;

    // If no session token present and in production/authenticated mode, redirect to /auth
    if (!sessionToken && process.env.NODE_ENV === 'production') {
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(authUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/match/:path*', '/submit/:path*'],
};
