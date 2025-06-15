import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is not signed in and the current path is not /login, redirect to /login
    if (!session && req.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // If user is signed in and the current path is /login, redirect to /dashboard
    if (session && req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    // If there's an error with the session, redirect to login
    console.error('Middleware error:', error)
    if (req.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}