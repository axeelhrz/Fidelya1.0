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