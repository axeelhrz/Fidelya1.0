import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
      if (!isPublicRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      return res;
    }

    const { pathname } = request.nextUrl;

    // Rutas públicas
    if (isPublicRoute(pathname)) {
      return res;
    }

    // Si no hay sesión y trata de acceder a ruta protegida
    if (!session && isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verificar acceso admin
    if (session && isAdminRoute(pathname)) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, is_active')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single();

      if (userError || !userData || !['admin', 'super_admin'].includes(userData.role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    if (!isPublicRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return res;
  }
}

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/registro',
    '/auth/callback'
  ];
  return publicRoutes.includes(pathname);
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/pedidos',
    '/perfil',
    '/menu'
  ];
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};