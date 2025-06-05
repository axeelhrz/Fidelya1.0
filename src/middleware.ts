import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      // If there's a session error and it's not a public route, redirect to login
      if (!isPublicRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
      return res
    }

    const { pathname } = request.nextUrl

    // Define route types
    const isPublic = isPublicRoute(pathname)
    const isProtected = isProtectedRoute(pathname)
    const isAdmin = isAdminRoute(pathname)

    // If it's a public route, allow access
    if (isPublic) {
      return res
    }

    // If no session and trying to access protected route, redirect to login
    if (!session && (isProtected || isAdmin)) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If session exists and trying to access admin routes, check role
    if (session && isAdmin) {
      try {
        // Get user role from users table (not clientes)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, is_active')
          .eq('email', session.user.email)
          .eq('is_active', true)
          .single()

        if (userError || !userData) {
          console.error('User data error:', userError)
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Check if user has admin role
        if (!userData.role || !['admin', 'super_admin'].includes(userData.role)) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch (error) {
        console.error('Error checking user role:', error)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // If there's an error and it's not a public route, redirect to login
    if (!isPublicRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return res
  }
}

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/registro',
    '/auth/callback'
  ]
  return publicRoutes.includes(pathname)
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/pedidos',
    '/perfil',
    '/menu'
  ]
  return protectedRoutes.some(route => pathname.startsWith(route))
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin')
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}