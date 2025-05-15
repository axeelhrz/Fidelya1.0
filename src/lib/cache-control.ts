import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Aplica encabezados de caché para recursos estáticos
 * @param request Solicitud entrante
 * @param response Respuesta a modificar
 */
export function applyCacheHeaders(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const url = request.nextUrl.pathname;
  
  // Aplicar caché agresiva para recursos estáticos
  if (
    url.includes('/_next/static/') || 
    url.includes('/images/') ||
    url.endsWith('.js') ||
    url.endsWith('.css')
  ) {
    // Caché por 1 año para recursos estáticos (365 días)
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  return response;
}