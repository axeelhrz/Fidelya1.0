/**
 * Plan values
 */
export const PlanValue = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const;

/**
 * Plan limits for different features
 */
export const PLAN_LIMITS = {
  [PlanValue.BASIC]: {
    activeTasks: 10,
    kanbanView: false,
    export: false,
    import: false,
    intelligentDueDate: false
  },
  [PlanValue.PRO]: {
    activeTasks: 100,
    kanbanView: true,
    export: true,
    import: true,
    intelligentDueDate: true
  },
  [PlanValue.ENTERPRISE]: {
    activeTasks: 'unlimited',
    kanbanView: true,
    export: true,
    import: true,
    intelligentDueDate: true
  }
};

/**
 * Task statuses with labels and colors
 */
export const TASK_STATUS = [
  { value: 'pendiente', label: 'Pendiente', color: '#F59E0B' },
  { value: 'en_progreso', label: 'En Proceso', color: '#3B82F6' },
  { value: 'completada', label: 'Completada', color: '#10B981' }
];

/**
 * Task priorities with labels and colors
 */
export const TASK_PRIORITIES = [
  { value: 'baja', label: 'Baja', color: '#9CA3AF' },
  { value: 'media', label: 'Media', color: '#60A5FA' },
  { value: 'alta', label: 'Alta', color: '#F59E0B' }
];

/**
 * Predefined task tags
 */
export const TASK_TAGS = [
  { id: '1', name: 'Renovación', color: '#3B82F6' },
  { id: '2', name: 'Seguimiento', color: '#10B981' },
  { id: '3', name: 'Reclamación', color: '#F59E0B' },
  { id: '4', name: 'Cotización', color: '#8B5CF6' },
  { id: '5', name: 'Administrativa', color: '#EC4899' },
  { id: '6', name: 'Comercial', color: '#6366F1' }
];

/**
 * Reminder types for tasks
 */
export const REMINDER_TYPES = [
  { value: 'none', label: 'Sin recordatorio' },
  { value: '30min', label: '30 minutos antes' },
  { value: '1hour', label: '1 hora antes' },
  { value: '3hours', label: '3 horas antes' },
  { value: '1day', label: '1 día antes' },
  { value: '2days', label: '2 días antes' },
  { value: '1week', label: '1 semana antes' }
];

/**
 * Number of items to display per page
 */
export const ITEMS_PER_PAGE = 10;