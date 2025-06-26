import { Timestamp } from 'firebase/firestore';

export interface Comercio {
  uid: string;
  nombre: string;
  nombreComercio: string;
  email: string;
  categoria: string;
  direccion?: string;
  telefono?: string;
  horario?: string;
  logoUrl?: string;
  imagenPrincipalUrl?: string;
  descripcion?: string;
  sitioWeb?: string;
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  estado: 'activo' | 'inactivo' | 'pendiente';
  asociacionesVinculadas: string[];
  creadoEn: Timestamp;
  actualizadoEn: Timestamp;
  configuracion?: {
    notificacionesEmail: boolean;
    notificacionesWhatsApp: boolean;
    autoValidacion: boolean;
  };
}

export interface Beneficio {
  id: string;
  comercioId: string;
  titulo: string;
  descripcion: string;
  tipo: 'descuento_porcentaje' | 'descuento_fijo' | '2x1' | 'envio_gratis' | 'regalo' | 'puntos';
  valor: number; // Porcentaje o monto fijo
  asociacionesVinculadas: string[];
  fechaInicio: Timestamp;
  fechaFin: Timestamp;
  diasValidez?: string[]; // ['lunes', 'martes', etc.]
  horariosValidez?: {
    inicio: string; // HH:MM
    fin: string; // HH:MM
  };
  mediosPagoHabilitados?: string[];
  limitePorSocio?: number;
  limiteTotal?: number;
  usosActuales: number;
  estado: 'activo' | 'inactivo' | 'vencido' | 'agotado';
  condiciones?: string;
  imagenUrl?: string;
  creadoEn: Timestamp;
  actualizadoEn: Timestamp;
}

export interface Validacion {
  id: string;
  comercioId: string;
  socioId: string;
  asociacionId: string;
  beneficioId: string;
  fechaHora: Timestamp;
  resultado: 'valido' | 'invalido' | 'vencido' | 'agotado' | 'no_autorizado';
  montoTransaccion?: number;
  descuentoAplicado?: number;
  metodoPago?: string;
  ubicacion?: {
    lat: number;
    lng: number;
  };
  dispositivo?: string;
  notas?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  };
}

export interface ComercioFormData {
  nombre: string;
  nombreComercio: string;
  email: string;
  categoria: string;
  direccion?: string;
  telefono?: string;
  horario?: string;
  descripcion?: string;
  sitioWeb?: string;
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface BeneficioFormData {
  titulo: string;
  descripcion: string;
  tipo: 'descuento_porcentaje' | 'descuento_fijo' | '2x1' | 'envio_gratis' | 'regalo' | 'puntos';
  valor: number;
  asociacionesVinculadas: string[];
  fechaInicio: Date;
  fechaFin: Date;
  diasValidez?: string[];
  horariosValidez?: {
    inicio: string;
    fin: string;
  };
  mediosPagoHabilitados?: string[];
  limitePorSocio?: number;
  limiteTotal?: number;
  condiciones?: string;
}

export interface ComercioStats {
  totalValidaciones: number;
  validacionesHoy: number;
  validacionesMes: number;
  beneficiosActivos: number;
  beneficiosVencidos: number;
  asociacionesVinculadas: number;
  sociosAlcanzados: number;
  ingresosPotenciales: number;
  tasaConversion: number;
  beneficioMasUsado?: {
    id: string;
    titulo: string;
    usos: number;
  };
}

export interface ValidacionStats {
  totalValidaciones: number;
  validacionesExitosas: number;
  validacionesFallidas: number;
  porAsociacion: Record<string, number>;
  porBeneficio: Record<string, number>;
  porDia: Record<string, number>;
  promedioValidacionesDiarias: number;
}

export interface QRData {
  comercioId: string;
  timestamp: number;
  signature: string;
}

// Categorías predefinidas para comercios
export const CATEGORIAS_COMERCIO = [
  'Restaurantes y Gastronomía',
  'Retail y Moda',
  'Salud y Belleza',
  'Deportes y Fitness',
  'Tecnología',
  'Hogar y Decoración',
  'Automotriz',
  'Educación',
  'Entretenimiento',
  'Servicios Profesionales',
  'Turismo y Viajes',
  'Otros'
] as const;

export type CategoriaComercio = typeof CATEGORIAS_COMERCIO[number];

// Tipos de beneficios con sus configuraciones
export const TIPOS_BENEFICIO = {
  descuento_porcentaje: {
    label: 'Descuento por Porcentaje',
    icon: 'Percent',
    color: '#10b981',
    requiresValue: true,
    valueLabel: 'Porcentaje (%)',
    maxValue: 100
  },
  descuento_fijo: {
    label: 'Descuento Fijo',
    icon: 'DollarSign',
    color: '#6366f1',
    requiresValue: true,
    valueLabel: 'Monto ($)',
    maxValue: null
  },
  '2x1': {
    label: '2x1',
    icon: 'Gift',
    color: '#f59e0b',
    requiresValue: false,
    valueLabel: null,
    maxValue: null
  },
  envio_gratis: {
    label: 'Envío Gratis',
    icon: 'Truck',
    color: '#06b6d4',
    requiresValue: false,
    valueLabel: null,
    maxValue: null
  },
  regalo: {
    label: 'Regalo',
    icon: 'Gift',
    color: '#ec4899',
    requiresValue: false,
    valueLabel: 'Descripción del regalo',
    maxValue: null
  },
  puntos: {
    label: 'Puntos Extra',
    icon: 'Star',
    color: '#8b5cf6',
    requiresValue: true,
    valueLabel: 'Puntos',
    maxValue: null
  }
} as const;

export type TipoBeneficio = keyof typeof TIPOS_BENEFICIO;
