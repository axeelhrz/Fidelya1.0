import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware modificado para permitir acceso a todas las rutas sin autenticación
export function middleware(request: NextRequest) {
  // Permitir acceso a todas las rutas
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
