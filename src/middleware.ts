import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole, ROLE_PERMISSIONS } from '@/types/user';

export function middleware(request: NextRequest) {
  console.log('🔍 Middleware ejecutándose para:', request.nextUrl.pathname);
  
  const userCookie = request.cookies.get('user');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isRegisterPage = request.nextUrl.pathname === '/register';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isRootPage = request.nextUrl.pathname === '/';

  console.log('🍪 Cookie de usuario:', userCookie ? 'Presente' : 'Ausente');
  console.log('📍 Página actual:', {
    isLoginPage,
    isRegisterPage,
    isDashboardPage,
    isRootPage,
    pathname: request.nextUrl.pathname
  });

  let isAuthenticated = false;
  let userRole: UserRole | null = null;
  
  if (userCookie?.value) {
    try {
      const userData = JSON.parse(userCookie.value);
      isAuthenticated = !!(userData && userData.id && userData.role);
      userRole = userData.role;
      console.log('✅ Usuario autenticado:', isAuthenticated, 'Rol:', userRole);
    } catch {
      console.log('❌ Cookie corrupta, eliminando...');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('user', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: false,
        sameSite: 'lax'
      });
      return response;
    }
  }

  // Redirigir página raíz según autenticación
  if (isRootPage) {
    if (isAuthenticated && userRole) {
      const defaultRoute = ROLE_PERMISSIONS[userRole].defaultRoute;
      console.log('🔄 Redirigiendo desde raíz al dashboard:', defaultRoute);
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    } else {
      console.log('🔄 Redirigiendo desde raíz al login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si está en login/register y ya está autenticado, redirigir al dashboard correspondiente
  if ((isLoginPage || isRegisterPage) && isAuthenticated && userRole) {
    const defaultRoute = ROLE_PERMISSIONS[userRole].defaultRoute;
    console.log('🔄 Usuario autenticado en login/register, redirigiendo al dashboard:', defaultRoute);
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // Si está en dashboard y no está autenticado, redirigir al login
  if (isDashboardPage && !isAuthenticated) {
    console.log('🔄 Usuario no autenticado en dashboard, redirigiendo al login');
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('user', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: false,
      sameSite: 'lax'
    });
    return response;
  }

  // Verificar permisos de ruta para usuarios autenticados
  if (isDashboardPage && isAuthenticated && userRole) {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    const hasAccess = rolePermissions.allowedRoutes.some(allowedRoute => 
      request.nextUrl.pathname.startsWith(allowedRoute)
    );

    if (!hasAccess) {
      console.log('🚫 Acceso denegado a la ruta:', request.nextUrl.pathname, 'para rol:', userRole);
      const defaultRoute = rolePermissions.defaultRoute;
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
  }

  console.log('✅ Permitiendo acceso a:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};