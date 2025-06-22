import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('🔍 Middleware ejecutándose para:', request.nextUrl.pathname);
  
  // Verificar si el usuario está autenticado
  const userCookie = request.cookies.get('user');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isRootPage = request.nextUrl.pathname === '/';

  console.log('🍪 Cookie de usuario:', userCookie ? 'Presente' : 'Ausente');
  console.log('📍 Página actual:', {
    isLoginPage,
    isDashboardPage,
    isRootPage,
    pathname: request.nextUrl.pathname
  });

  // Verificar si la cookie contiene datos válidos
  let isAuthenticated = false;
  if (userCookie?.value) {
    try {
      const userData = JSON.parse(userCookie.value);
      isAuthenticated = !!(userData && userData.id && userData.role);
      console.log('✅ Usuario autenticado:', isAuthenticated);
    } catch{
      console.log('❌ Cookie corrupta, eliminando...');
      // Cookie corrupta, crear respuesta para eliminarla
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

  // Redirigir página raíz a login si no está autenticado, o al dashboard si está autenticado
  if (isRootPage) {
    if (isAuthenticated) {
      console.log('🔄 Redirigiendo desde raíz al dashboard');
      return NextResponse.redirect(new URL('/dashboard/ceo', request.url));
    } else {
      console.log('🔄 Redirigiendo desde raíz al login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si está en login y ya está autenticado, redirigir al dashboard
  if (isLoginPage && isAuthenticated) {
    console.log('🔄 Usuario autenticado en login, redirigiendo al dashboard');
    return NextResponse.redirect(new URL('/dashboard/ceo', request.url));
  }

  // Si está en dashboard y no está autenticado, redirigir al login
  if (isDashboardPage && !isAuthenticated) {
    console.log('🔄 Usuario no autenticado en dashboard, redirigiendo al login');
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Asegurar que la cookie se elimine
    response.cookies.set('user', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: false,
      sameSite: 'lax'
    });
    return response;
  }

  console.log('✅ Permitiendo acceso a:', request.nextUrl.pathname);
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