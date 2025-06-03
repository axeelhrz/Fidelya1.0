import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/lib/supabase/types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Verificar sesión
  const {
    data: { session },
  } = await supabase.auth.getSession()

// Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/pedidos', '/perfil', '/admin']
  const adminRoutes = ['/admin']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirigir a login si no hay sesión en ruta protegida
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Verificar permisos de admin
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

  // Redirigir a dashboard si ya está logueado y trata de acceder a auth
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
