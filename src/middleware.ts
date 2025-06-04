import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // DESHABILITADO: Permitir acceso libre a toda la app para desarrollo
  return NextResponse.next()

  // Código original comentado para referencia futura
  /*
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si el usuario está autenticado y está intentando acceder a una ruta de auth
  if (!session && !request.nextUrl.pathname.includes("/auth/login") && !request.nextUrl.pathname.includes("/auth/registro")) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
  */
}

// Rutas que requieren autenticación
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/pedidos',
    '/menu',
    '/perfil',
  ]
  return protectedRoutes.some(route => pathname.startsWith(route))
}

// Rutas de autenticación (login/registro)
function isAuthRoute(pathname: string): boolean {
  const authRoutes = ['/auth/login', '/auth/registro']
  return authRoutes.includes(pathname)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
