import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/pedidos', '/perfil'];
  
  // Rutas que requieren permisos de admin
  const adminRoutes = ['/admin'];
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/registro', '/'];

  const { pathname } = req.nextUrl;

  // Verificar si la ruta actual requiere protección
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  try {
    // Obtener sesión del usuario
    const { data: { session }, error } = await supabase.auth.getSession();

    // Si hay error en la sesión, redirigir a login
    if (error) {
      console.error('Session error:', error);
      if (!isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      return res;
    }

    // Si no hay sesión y la ruta está protegida, redirigir a login
    if (!session && (isProtectedRoute || isAdminRoute)) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Si hay sesión y está en ruta pública, permitir acceso
    if (session && isPublicRoute) {
      return res;
    }

    // Verificar permisos de admin para rutas administrativas
    if (isAdminRoute && session) {
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('rol')
        .eq('correo_apoderado', session.user.email)
        .single();

      if (clienteError || !clienteData) {
        console.error('Error getting user role:', clienteError);
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Verificar si el usuario tiene rol de admin
      if (!clienteData.rol || !['admin', 'super_admin'].includes(clienteData.rol)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // En caso de error, redirigir a login si no es ruta pública
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};