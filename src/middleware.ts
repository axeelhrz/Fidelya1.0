import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware deshabilitado - sin autenticación
export function middleware() {
  // No hacer nada, permitir acceso a todas las rutas
  return;
}

export const config = {
  matcher: [],
};