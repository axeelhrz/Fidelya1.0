import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const { pathname } = request.nextUrl;
  
  // Verificar si el usuario está autenticado mediante la cookie de sesión
  const session = request.cookies.get('session')?.value;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/reset-password',
    '/auth/verify-email',
    '/pricing',
    '/caracteristicas',
    '/sobre-nosotros',
    '/contact',
    '/seguridad',
    '/terminos',
    '/privacidad',
    '/cookies',
  ];
  
  // Verificar si la ruta actual es pública o comienza con /api/
  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.startsWith('/api/') || 
                        pathname.startsWith('/_next/') || 
                        pathname.startsWith('/public/') ||
                        pathname.includes('.') || // archivos estáticos
                        pathname.startsWith('/auth/action');
  
  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
  return NextResponse.next();
}

  // Si no hay sesión y no es una ruta pública, redirigir a login
  if (!session) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  
  // Si hay sesión, permitir acceso
      return NextResponse.next();
    }
    
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
