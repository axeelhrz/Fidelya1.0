import { Timestamp } from 'firebase/firestore';

export interface Pago {
  fecha: Timestamp;
  monto: number;
}

export interface SocioConfiguration {
  // Notificaciones
  notificaciones: boolean;
  notificacionesPush: boolean;
  notificacionesEmail: boolean;
  notificacionesSMS: boolean;
  
  // Apariencia
  tema: 'light' | 'dark' | 'auto';
  idioma: 'es' | 'en';
  moneda: 'ARS' | 'USD' | 'EUR';
  timezone: string;
  
  // Privacidad
  perfilPublico: boolean;
  mostrarEstadisticas: boolean;
  mostrarActividad: boolean;
  compartirDatos: boolean;
  
  // Preferencias
  beneficiosFavoritos: string[];
  comerciosFavoritos: string[];
  categoriasFavoritas: string[];
}

export interface SocioActivity {
  id: string;
  tipo: 'beneficio' | 'validacion' | 'registro' | 'actualizacion' | 'configuracion';
  titulo: string;
  descripcion: string;
  fecha: Timestamp;
  metadata?: {
    comercioId?: string;
    comercioNombre?: string;
    beneficioId?: string;
    beneficioNombre?: string;
    montoDescuento?: number;
    categoria?: string;
    ubicacion?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

export interface SocioLevel {
  nivel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  puntos: number;
  puntosParaProximoNivel: number;
  proximoNivel: string;
  beneficiosDesbloqueados: string[];
  descuentoAdicional: number;
}

export interface SocioProfile {
  // Información básica
  nombre: string;
  email: string;
  telefono?: string;
  dni?: string;
  direccion?: string;
  fechaNacimiento?: Timestamp;
  
  // Imágenes
  avatar?: string;
  avatarThumbnail?: string;
  
  // Configuración
  configuracion: SocioConfiguration;
  
  // Nivel y gamificación
  nivel: SocioLevel;
  
  // Metadata
  ultimoAcceso?: Timestamp;
  dispositivosConectados?: string[];
  ubicacionActual?: {
    lat: number;
    lng: number;
    ciudad: string;
    provincia: string;
  };
}

export interface Socio {
  uid: string;
  nombre: string;
  email: string;
  estado: 'activo' | 'vencido' | 'inactivo' | 'pendiente';
  asociacionId: string;
  creadoEn: Timestamp;
  actualizadoEn?: Timestamp;
  telefono?: string;
  dni?: string;
  direccion?: string;
  fechaNacimiento?: Timestamp;
  pagos?: Pago[];
  
  // Nuevos campos
  avatar?: string;
  avatarThumbnail?: string;
  configuracion?: SocioConfiguration;
  nivel?: SocioLevel;
  ultimoAcceso?: Timestamp;
  dispositivosConectados?: string[];
  ubicacionActual?: {
    lat: number;
    lng: number;
    ciudad: string;
    provincia: string;
  };
  asociacion: string;

}

export interface SocioFormData {
  nombre: string;
  email: string;
  estado: 'activo' | 'vencido';
  telefono?: string;
  dni?: string;
  direccion?: string;
  fechaNacimiento?: Date;
}

export interface SocioStats {
  // Estadísticas básicas
  total: number;
  activos: number;
  vencidos: number;
  inactivos: number;
  
  // Estadísticas detalladas para perfil individual
  beneficiosUsados?: number;
  ahorroTotal?: number;
  beneficiosEsteMes?: number;
  asociacionesActivas?: number;
  racha?: number;
  comerciosVisitados?: number;
  validacionesExitosas?: number;
  descuentoPromedio?: number;
  ahorroEsteMes?: number;
  beneficiosFavoritos?: number;
  tiempoComoSocio?: number;
  
  // Estadísticas avanzadas
  actividadPorMes?: { [mes: string]: number };
  beneficiosPorCategoria?: { [categoria: string]: number };
  comerciosMasVisitados?: Array<{
    id: string;
    nombre: string;
    visitas: number;
    ultimaVisita: Timestamp;
  }>;
  beneficiosMasUsados?: Array<{
    id: string;
    nombre: string;
    usos: number;
    ahorroTotal: number;
  }>;
  
  [key: string]: number | undefined | string | boolean | object | unknown[];
}

export interface SocioAsociacion {
  id: string;
  nombre: string;
  descripcion?: string;
  logo?: string;
  estado: 'activo' | 'vencido' | 'pendiente' | 'suspendido';
  fechaInicio: Timestamp;
  fechaVencimiento: Timestamp;
  tipo: 'mensual' | 'anual' | 'vitalicia';
  beneficiosIncluidos: number;
  descuentoMaximo: number;
  comerciosAfiliados: number;
}

// Tipos para formularios y actualizaciones
export interface UpdateSocioProfileData {
  nombre?: string;
  telefono?: string;
  dni?: string;
  direccion?: string;
  fechaNacimiento?: Date | Timestamp;
  avatar?: string;
  configuracion?: Partial<SocioConfiguration>;

}

export interface SocioActivityFilter {
  tipo?: SocioActivity['tipo'][];
  fechaDesde?: Date;
  fechaHasta?: Date;
  comercioId?: string;
  limit?: number;
  offset?: number;
}

// Tipos para exportación de datos
export interface SocioDataExport {
  perfil: Socio;
  estadisticas: SocioStats;
  asociaciones: SocioAsociacion[];
  actividad: SocioActivity[];
  configuracion: SocioConfiguration;
  fechaExportacion: Timestamp;
}