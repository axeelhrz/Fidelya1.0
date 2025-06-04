import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Obtener la sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/auth/login',
    '/auth/registro',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/terminos',
    '/privacidad',
    '/'
  ]

  // Rutas de autenticación
  const authRoutes = [
    '/auth/login',
    '/auth/registro',
    '/auth/forgot-password'
  ]

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/perfil',
    '/pedidos',
    '/menu'
  ]

  // Rutas de administrador
  const adminRoutes = [
    '/admin'
  ]

  // Si el usuario está autenticado y trata de acceder a rutas de auth, redirigir al dashboard
  if (session && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Si el usuario no está autenticado y trata de acceder a rutas protegidas
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Verificar email confirmado para rutas protegidas
  if (session && protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session.user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/verify-email', req.url))
    }
  }

  // Verificar permisos de administrador
  if (session && adminRoutes.some(route => pathname.startsWith(route))) {
    // Aquí puedes agregar lógica adicional para verificar roles de admin
    // Por ahora, permitimos el acceso si está autenticado
    if (!session.user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return res
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
}