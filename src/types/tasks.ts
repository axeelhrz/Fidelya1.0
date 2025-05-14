
import { Timestamp } from 'firebase/firestore';
import { FieldValue } from 'firebase/firestore';

export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';
export type TaskRecurrence = 'ninguna' | 'diaria' | 'semanal' | 'mensual';


export interface Task {
  id?: string;
  title: string;
  description?: string;
  dueDate?: Timestamp | Date;
  priority: TaskPriority;
  status: TaskStatus;
  isRecurring?: boolean;
  recurrence?: TaskRecurrence;
  hasSubtasks?: boolean;
  subtasks?: Array<string | SubtaskItem>;
  userId: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  isUrgent?: boolean;
  completedAt?: Timestamp;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  urgent: number;
  dueToday: number;
  dueThisWeek: number;
  overdue: number;
}

export interface TaskFilters {
  status: TaskStatus | 'todas';
  priority: TaskPriority | 'todas';
  dateFilter: 'todas' | 'hoy' | 'esta_semana' | 'vencidas';
  searchQuery: string;
}

export interface TaskTag {
  id: string;
  name: string;
  color: string;
}

export interface SubtaskItem {
  text: string;
  completed: boolean;
}

