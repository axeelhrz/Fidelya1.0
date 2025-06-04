import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/perfil', '/pedidos', '/admin']
  
  // Rutas de autenticación (redirigir si ya está autenticado)
  const authRoutes = ['/auth/login', '/auth/registro']
  
  // Rutas de administrador
  const adminRoutes = ['/admin']

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirigir a login si no está autenticado y trata de acceder a ruta protegida
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirigir a dashboard si está autenticado y trata de acceder a rutas de auth
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Verificar si es administrador para rutas de admin
  if (isAdminRoute && session) {
    const { data: guardian } = await supabase
      .from('guardians')
      .select('is_staff')
      .eq('user_id', session.user.id)
      .single()

    if (!guardian?.is_staff) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Verificar email confirmado para rutas protegidas
  if (isProtectedRoute && session && !session.user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/auth/verify-email', req.url))
  }

  return res
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}