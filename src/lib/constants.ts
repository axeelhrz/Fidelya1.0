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
} as const;

// Export type for collection names
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// CORS and Storage configuration
export const STORAGE_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  corsOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001'
  ]
};

export const isDevelopment = process.env.NODE_ENV === 'development';