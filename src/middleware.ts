import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/patient',
    '/dashboard/patient/payments', // Nueva ruta protegida
    '/dashboard/therapist',
    '/dashboard/ceo',
    '/dashboard/reception'
  ];

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // En un entorno real, verificarías el token de autenticación aquí
    // Por ahora, permitimos el acceso para desarrollo
    const token = request.cookies.get('auth-token');
    
    if (!token && pathname !== '/login') {
      // Redirigir al login si no hay token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificación específica para rutas de paciente
    if (pathname.startsWith('/dashboard/patient')) {
      // Aquí verificarías que el usuario tiene rol 'patient'
      // Por ahora permitimos el acceso para desarrollo
      const userRole = request.cookies.get('user-role')?.value;
      
      if (userRole && userRole !== 'patient') {
        // Redirigir a la página apropiada según el rol
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};