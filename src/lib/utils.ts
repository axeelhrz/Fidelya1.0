import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatear moneda en pesos chilenos
 */
export function formatoMoneda(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Formatear fecha en español
 */
export function formatearFecha(fecha: string | Date): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return date.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formatear fecha corta
 */
export function formatearFechaCorta(fecha: string | Date): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Capitalizar primera letra
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Generar ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Validar RUT chileno
 */
export function validarRUT(rut: string): boolean {
  if (!rut) return false
  
  // Limpiar RUT
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toLowerCase()
  
  if (cleanRut.length < 2) return false
  
  const body = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1)
  
  // Calcular dígito verificador
  let sum = 0
  let multiplier = 2
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  
  const expectedDv = 11 - (sum % 11)
  const finalDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'k' : expectedDv.toString()
  
  return dv === finalDv
}

/**
 * Formatear RUT
 */
export function formatearRUT(rut: string): string {
  const cleanRut = rut.replace(/[^0-9kK]/g, '')
  if (cleanRut.length < 2) return rut
  
  const body = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1)
  
  // Agregar puntos cada 3 dígitos
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `${formattedBody}-${dv.toUpperCase()}`
}