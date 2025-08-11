import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/sign-in', '/auth/sign-up'];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/leagues', '/clubs', '/members', '/sports'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // Get the session cookie (this is a simple check, in production you might want to verify the token)
  const sessionCookie = request.cookies.get('laravel_session');

  // If accessing a protected route without a session, redirect to sign-in
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // If accessing a public auth route while authenticated, redirect to dashboard
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect root to dashboard if authenticated, otherwise to sign-in
  if (pathname === '/') {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};