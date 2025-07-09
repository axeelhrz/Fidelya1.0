import { Timestamp } from 'firebase/firestore';

export interface Beneficio {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: number; // Porcentaje de descuento
  tipo: 'porcentaje' | 'monto_fijo' | 'producto_gratis';
  comercioId: string;
  comercioNombre: string;
  comercioLogo?: string;
  asociacionesDisponibles: string[];
  fechaInicio: Timestamp;
  fechaFin: Timestamp;
  estado: 'activo' | 'inactivo' | 'vencido';
  limitePorSocio?: number;
  limiteTotal?: number;
  usosActuales: number;
  condiciones?: string;
  categoria: string;
  tags?: string[];
  creadoEn: Timestamp;
  actualizadoEn: Timestamp;
  asociacionesVinculadas?: {
    id: string;
    nombre: string;
    logo?: string;
    descripcion?: string;
    fechaCreacion: Timestamp;
    fechaActualizacion: Timestamp;
  }[];
  destacado?: boolean;
  asociacionId?: string; // ID de la asociación que creó el beneficio

}

export interface BeneficioUso {
  id: string;
  beneficioId: string;
  socioId: string;
  comercioId: string;
  asociacionId: string;
  fechaUso: Timestamp;
  montoDescuento: number;
  estado: 'usado' | 'pendiente' | 'cancelado';
  validacionId?: string;
  notas?: string;
  detalles?: string;
  destacado?: boolean;
  validadoPor?: string; // Usuario que validó el uso
  creadoEn: Timestamp;
  actualizadoEn: Timestamp;
  comercioNombre: string;

}

export interface BeneficioStats {
  total: number;
  disponibles: number;
  usados: number;
  vencidos: number;
  porCategoria: Record<string, number>;
  ahorroTotal: number;
  beneficioMasUsado?: {
    id: string;
    titulo: string;
    usos: number;
  };
}

export interface BeneficioFormData {
  titulo: string;
  descripcion: string;
  descuento: number;
  tipo: 'porcentaje' | 'monto_fijo' | 'producto_gratis';
  fechaInicio: Date;
  fechaFin: Date;
  limitePorSocio?: number;
  limiteTotal?: number;
  condiciones?: string;
  categoria: string;
  tags?: string[];
}
