import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/auth/login',
    '/auth/registro',
    '/auth/forgot-password',
    '/auth/reset-password',
      '/auth/verify-email',
    '/terminos',
    '/privacidad',
    '/'
  ]

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/perfil',
    '/pedidos',
    '/menu',
    '/admin'
  ]

  // Si es una ruta pública, permitir acceso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar autenticación en el cliente
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // El control de autenticación se manejará en el cliente con useAuth
    return NextResponse.next()
  }

  return NextResponse.next()
    }
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}