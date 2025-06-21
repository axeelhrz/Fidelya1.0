import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar si el usuario está autenticado
  const user = request.cookies.get('user');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Si está en login y ya está autenticado, redirigir al dashboard
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/dashboard/ceo', request.url));
  }

  // Si está en dashboard y no está autenticado, redirigir al login
  if (isDashboardPage && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
};
