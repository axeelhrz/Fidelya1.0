import { TaskStatus, TaskPriority, TaskTag } from '@/types/tasks';

// Constantes para planes
export const PlanValue = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const;

// Límites según plan
export const PLAN_LIMITS = {
  [PlanValue.BASIC]: {
    activeTasks: 25,
    kanbanView: false,
    export: false,
    import: false,
    intelligentDueDate: false
  },
  [PlanValue.PRO]: {
    activeTasks: Infinity,
    kanbanView: true,
    export: true,
    import: true,
    intelligentDueDate: true
  },
  [PlanValue.ENTERPRISE]: {
    activeTasks: Infinity,
    kanbanView: true,
    export: true,
    import: true,
    intelligentDueDate: true
  }
};

// Estados de tareas
export const TASK_STATUS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'pendiente', label: 'Pendiente', color: '#F59E0B' },
  { value: 'en_progreso', label: 'En Proceso', color: '#3B82F6' },
  { value: 'completada', label: 'Completada', color: '#10B981' }
];

// Prioridades de tareas
export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'baja', label: 'Baja', color: '#9CA3AF' },
  { value: 'media', label: 'Media', color: '#60A5FA' },
  { value: 'alta', label: 'Alta', color: '#F59E0B' },
];

// Etiquetas predefinidas
export const TASK_TAGS: TaskTag[] = [
  { id: '1', name: 'Renovación', color: '#3B82F6' },
  { id: '2', name: 'Seguimiento', color: '#10B981' },
  { id: '3', name: 'Reclamación', color: '#EF4444' },
  { id: '4', name: 'Cotización', color: '#F59E0B' },
  { id: '5', name: 'Administrativa', color: '#8B5CF6' },
  { id: '6', name: 'Comercial', color: '#EC4899' }
];

// Tipos de recordatorios
export const REMINDER_TYPES = [
  { value: 'none', label: 'Sin recordatorio' },
  { value: '30min', label: '30 minutos antes' },
  { value: '1hour', label: '1 hora antes' },
  { value: '3hours', label: '3 horas antes' },
  { value: '1day', label: '1 día antes' },
  { value: '2days', label: '2 días antes' },
  { value: '1week', label: '1 semana antes' }
];

// Ítems por página
export const ITEMS_PER_PAGE = 10;