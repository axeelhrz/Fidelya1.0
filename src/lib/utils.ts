import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda
 * @param valor El valor a formatear
 * @returns El valor formateado como string
 */
export function formatoMoneda(valor: number | undefined | null): string {
  // Si el valor es undefined o null, mostrar 0
  if (valor === undefined || valor === null) {
    return '0';
  }
  
  // Intentar formatear el número
  try {
    return valor.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  } catch (error) {
    console.error('Error al formatear valor como moneda:', error);
    return '0';
  }
}
