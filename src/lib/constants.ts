// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  COMERCIOS: 'comercios',
  SOCIOS: 'socios',
  ASOCIACIONES: 'asociaciones',
  BENEFICIOS: 'beneficios',
  VALIDACIONES: 'validaciones',
  NOTIFICATIONS: 'notifications',
  BACKUPS: 'backups',
  BACKUP_CONFIGS: 'backupConfigs',
  ACTIVITIES: 'activities',
  CLIENTE_ACTIVITIES: 'cliente_activities',
  CLIENTE_SEGMENTS: 'cliente_segments',
  SOLICITUDES_ADHESION: 'solicitudes_adhesion', // Nueva colección
} as const;

// Export type for collection names
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// App configuration
export const APP_CONFIG = {
  name: 'Fidelya',
  version: '1.0.0',
  description: 'Sistema de Gestión de Socios y Beneficios',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'soporte@fidelya.com',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
} as const;

// CORS and Storage configuration - Enhanced for better CORS handling
export const STORAGE_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  maxFileSize: APP_CONFIG.maxFileSize,
  allowedTypes: APP_CONFIG.allowedImageTypes,
  corsOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://127.0.0.1:3000',
    'https://127.0.0.1:3001',
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
  ].filter(Boolean),
  // Fallback strategy for CORS issues
  useDataUrlFallback: true,
  enableStorageBackup: true,
} as const;

// User roles and permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  ASOCIACION: 'asociacion',
  COMERCIO: 'comercio',
  SOCIO: 'socio',
} as const;

export const USER_STATES = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  PENDIENTE: 'pendiente',
  SUSPENDIDO: 'suspendido',
} as const;

// Beneficio types and states
export const BENEFICIO_TYPES = {
  PORCENTAJE: 'porcentaje',
  MONTO_FIJO: 'monto_fijo',
  PRODUCTO_GRATIS: 'producto_gratis',
} as const;

export const BENEFICIO_STATES = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  VENCIDO: 'vencido',
} as const;

// Validation states
export const VALIDACION_STATES = {
  EXITOSA: 'exitosa',
  FALLIDA: 'fallida',
  PENDIENTE: 'pendiente',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  REMINDER: 'reminder',
} as const;

// Dashboard routes by role
export const DASHBOARD_ROUTES = {
  [USER_ROLES.ADMIN]: '/dashboard/admin',
  [USER_ROLES.ASOCIACION]: '/dashboard/asociacion',
  [USER_ROLES.COMERCIO]: '/dashboard/comercio',
  [USER_ROLES.SOCIO]: '/dashboard/socio',
} as const;

// QR Code configuration - Enhanced for better CORS handling
export const QR_CONFIG = {
  size: 256,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  errorCorrectionLevel: 'M' as const,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001', // Updated to match current port
  validationPath: '/validar-beneficio',
  // Enhanced QR options
  quality: 0.92,
  type: 'image/png' as const,
  rendererOpts: {
    quality: 0.92,
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
} as const;

// Date formats
export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  displayWithTime: 'dd/MM/yyyy HH:mm',
  iso: 'yyyy-MM-dd',
  timestamp: 'yyyy-MM-dd HH:mm:ss',
} as const;

// Validation rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: {
    minLength: 6,
    maxLength: 128,
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  description: {
    maxLength: 500,
  },
} as const;

// Error messages - Enhanced with CORS-specific messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  SERVER_ERROR: 'Error interno del servidor. Intenta más tarde.',
  FILE_TOO_LARGE: `El archivo es muy grande. Máximo ${APP_CONFIG.maxFileSize / 1024 / 1024}MB.`,
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido.',
  CORS_ERROR: 'Error de configuración CORS. Usando método alternativo.',
  STORAGE_ERROR: 'Error al acceder al almacenamiento. Usando método local.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Creado exitosamente',
  UPDATED: 'Actualizado exitosamente',
  DELETED: 'Eliminado exitosamente',
  SAVED: 'Guardado exitosamente',
  SENT: 'Enviado exitosamente',
  UPLOADED: 'Subido exitosamente',
} as const;

// Environment helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isClient = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';

// Feature flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_BACKUPS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_PWA: true,
  ENABLE_OFFLINE_MODE: false, // Future feature
  ENABLE_CORS_FALLBACK: true, // New: Enable CORS fallback strategies
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  longTTL: 60 * 60 * 1000, // 1 hour
  shortTTL: 30 * 1000, // 30 seconds
} as const;

// Rate limiting
export const RATE_LIMITS = {
  login: {
    attempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  api: {
    requests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  upload: {
    files: 10,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

// Adhesion states
export const ESTADOS_ADHESION = {
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
} as const;

export type EstadoAdhesion = typeof ESTADOS_ADHESION[keyof typeof ESTADOS_ADHESION];