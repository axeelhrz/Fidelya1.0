import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function middleware(request: NextRequest) {
  // Obtener token de la cookie
  const token = request.cookies.get('token')?.value;
  
  // Si no hay token, redirigir a login
  if (!token) {
    // Permitir acceso a rutas públicas
    if (
      request.nextUrl.pathname.startsWith('/auth') ||
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/pricing') ||
      request.nextUrl.pathname.startsWith('/api')
    ) {
  return NextResponse.next();
}

    // Redirigir a login para rutas protegidas
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  
  try {
    // Verificar token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Si el usuario está verificado, permitir acceso al dashboard
    if (decodedToken.email_verified) {
      return NextResponse.next();
    }
    
    // Si el usuario no está verificado, redirigir a verificación de email
    // excepto si ya está en la página de verificación
    if (!request.nextUrl.pathname.startsWith('/auth/verify-email')) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    
    // Si hay error con el token, eliminar cookie y redirigir a login
    const response = NextResponse.redirect(new URL('/auth/sign-in', request.url));
    response.cookies.delete('token');
    
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
