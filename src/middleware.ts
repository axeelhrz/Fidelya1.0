import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Temporalmente deshabilitar middleware para debugging
  console.log('Middleware ejecutándose para:', req.nextUrl.pathname)
  
  // Verificar variables de entorno
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configurada' : 'NO configurada')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configurada' : 'NO configurada')
  return NextResponse.next()
}
  
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}