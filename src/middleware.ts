import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    // Verificar que las variables de entorno estén configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Variables de entorno de Supabase no configuradas')
      // En desarrollo, permitir continuar sin autenticación
      if (process.env.NODE_ENV === 'development') {
  return res
}
      return NextResponse.redirect(new URL('/error', req.url))
}

    const supabase = createMiddlewareClient({ req, res })

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
      try {
        const { data: guardian } = await supabase
          .from('guardians')
          .select('is_staff')
          .eq('user_id', session.user.id)
          .single()

        if (!guardian?.is_staff) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      } catch (error) {
        console.error('Error verificando permisos de admin:', error)
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // Redirigir a dashboard si ya está logueado y trata de acceder a auth
    if (session && req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    console.error('Error en middleware:', error)
    return res
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public|error).*)',
  ],
}