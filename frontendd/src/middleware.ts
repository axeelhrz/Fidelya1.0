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

  // For now, let's disable the session-based redirects to prevent infinite loops
  // The AuthContext will handle authentication state and redirects
  
  // Only redirect root path to sign-in (simple redirect without session check)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // Allow all other routes to proceed - AuthContext will handle authentication
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