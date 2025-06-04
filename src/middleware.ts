import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/verify-email',
    '/api/payment/notify', // GetNet webhook
  ]

  // Admin routes that require admin role
  const adminRoutes = ['/admin']
  // API routes that require authentication
  const protectedApiRoutes = ['/api/orders', '/api/students', '/api/profile']

  // Check if route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // If user is already logged in and trying to access auth pages, redirect to dashboard
    if (session && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return res
}

  // Check if user is authenticated
  if (!session) {
    // Redirect to login for protected routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Check email verification
  if (!session.user.email_confirmed_at && !pathname.startsWith('/auth/verify-email')) {
    return NextResponse.redirect(new URL('/auth/verify-email', req.url))
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Get user role from database
    const { data: guardian } = await supabase
      .from('guardians')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!guardian || !['admin', 'staff'].includes(guardian.role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Check protected API routes
  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    // Additional API-specific checks can be added here
    return res
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}