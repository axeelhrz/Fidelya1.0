import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/',
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
  '/auth/verify-email',
  '/pricing',
  '/subscribe',
  '/contact',
  '/terminos',
  '/privacidad',
  '/sobre-nosotros',
  '/caracteristicas',
  '/seguridad',
  '/ayuda',
  '/blog',
  '/cookies',
  '/licencias',
  '/estado',
  '/actualizaciones'
];

// Uncomment the following if you plan to use these routes in the future
// // Rutas que requieren autenticación pero no verificación de email
// const authRoutes = [
//   '/auth/verify-email'
// ];

// Rutas que requieren roles específicos
const adminRoutes = [
  '/admin',
  '/admin/support'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta es pública
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }
  
  // Obtener token de autenticación de la cookie
  const authToken = request.cookies.get('authToken')?.value;
  
  // Si no hay token y la ruta requiere autenticación
  if (!authToken) {
    const url = new URL('/auth/sign-in', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Verificar si el usuario tiene acceso a rutas de administrador
  if (adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    // Aquí deberías verificar si el usuario tiene rol de administrador
    // Como no podemos verificar el rol en el middleware (requeriría una llamada a Firestore),
    // esta verificación se debe hacer en el componente AuthGuard
    
    // Si quisieras implementar una verificación básica, podrías usar una cookie específica
    const isAdmin = request.cookies.get('userRole')?.value === 'admin';
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Permitir acceso a todas las demás rutas si el usuario está autenticado
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};