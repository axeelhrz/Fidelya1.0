// ============================================================================
// TIPOS ESPECÍFICOS PARA EL TRATAMIENTO DEL PACIENTE
// ============================================================================

export interface PatientTreatmentPlan {
  id: string;
  patientId: string;
  therapistId: string;
  centerId: string;
  planName: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  lastReviewed: Date;
  nextReviewDate: Date;
  status: TreatmentPlanStatus;
  objectives: TreatmentObjective[];
  tasks: TreatmentTask[];
  alerts: TreatmentAlert[];
  materials: TreatmentMaterial[];
  progress: TreatmentProgress;
  therapistNotes: TherapistNote[];
  adherenceRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TreatmentPlanStatus = 'activo' | 'en-revision' | 'completado' | 'pausado' | 'discontinuado';

export interface TreatmentObjective {
  id: string;
  planId: string;
  title: string;
  description: string;
  category: ObjectiveCategory;
  priority: 'alta' | 'media' | 'baja';
  status: ObjectiveStatus;
  startDate: Date;
  targetDate: Date;
  completedDate?: Date;
  progress: number; // 0-100
  adherence: number; // 0-100
  milestones: ObjectiveMilestone[];
  subtasks: ObjectiveSubtask[];
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  barriers: string[];
  facilitators: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ObjectiveCategory = 'cognitivo' | 'conductual' | 'emocional' | 'social' | 'funcional' | 'sintomatico';
export type ObjectiveStatus = 'pendiente' | 'en-progreso' | 'completado' | 'modificado' | 'pausado';

export interface ObjectiveMilestone {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  targetDate: Date;
  achievedDate?: Date;
  status: 'pendiente' | 'completado' | 'vencido';
  criteria: string[];
  evidence: string[];
}

export interface ObjectiveSubtask {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  completed: boolean;
  completedDate?: Date;
  order: number;
}

export interface TreatmentTask {
  id: string;
  planId: string;
  objectiveId?: string;
  title: string;
  description: string;
  type: TaskType;
  category: TaskCategory;
  priority: 'alta' | 'media' | 'baja';
  status: TaskStatus;
  assignedDate: Date;
  dueDate?: Date;
  completedDate?: Date;
  estimatedDuration?: number; // minutos
  actualDuration?: number; // minutos
  instructions: string;
  resources: TaskResource[];
  attachments: TaskAttachment[];
  notes: string;
  therapistNotes?: string;
  difficulty: 'muy-facil' | 'facil' | 'moderado' | 'dificil' | 'muy-dificil';
  helpfulness?: number; // 1-5
  patientRating?: number; // 1-5
  patientFeedback?: string;
  reminders: TaskReminder[];
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskType = 'tarea' | 'ejercicio' | 'lectura' | 'practica' | 'reflexion' | 'monitoreo' | 'experimento-conductual' | 'habilidad' | 'exposicion' | 'mindfulness' | 'diario' | 'evaluacion';
export type TaskCategory = 'psicoeducacion' | 'tecnicas-cognitivas' | 'tecnicas-conductuales' | 'regulacion-emocional' | 'habilidades-sociales' | 'autocuidado' | 'mindfulness' | 'exposicion';
export type TaskStatus = 'asignada' | 'en-progreso' | 'completada' | 'vencida' | 'omitida' | 'cancelada' | 'parcialmente-completada';

export interface TaskResource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'audio' | 'link' | 'app' | 'imagen' | 'documento';
  url: string;
  description?: string;
  duration?: number; // minutos para videos/audios
  size?: number; // bytes para archivos
  thumbnail?: string;
  isDownloadable: boolean;
  viewCount: number;
  lastAccessed?: Date;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TaskReminder {
  id: string;
  taskId: string;
  type: 'inicial' | 'seguimiento' | 'vencimiento';
  scheduledDate: Date;
  sentDate?: Date;
  method: 'email' | 'sms' | 'push' | 'in-app';
  status: 'programado' | 'enviado' | 'entregado' | 'fallido' | 'cancelado';
  message: string;
}

export interface RecurrencePattern {
  frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual';
  interval: number;
  daysOfWeek?: number[]; // 0-6 para patrones semanales
  endDate?: Date;
  maxOccurrences?: number;
}

export interface TreatmentAlert {
  id: string;
  planId: string;
  type: AlertType;
  title: string;
  description: string;
  urgency: 'baja' | 'media' | 'alta' | 'critica';
  status: 'activa' | 'resuelta' | 'descartada';
  scheduledFor?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  actionRequired: boolean;
  actions: AlertAction[];
  createdAt: Date;
  updatedAt: Date;
}

export type AlertType = 'revision-programada' | 'tarea-vencida' | 'objetivo-retrasado' | 'baja-adherencia' | 'cita-proxima' | 'medicacion' | 'crisis' | 'seguimiento' | 'evaluacion';

export interface AlertAction {
  id: string;
  alertId: string;
  title: string;
  description: string;
  type: 'contactar-terapeuta' | 'reagendar-cita' | 'completar-tarea' | 'revisar-objetivo' | 'actualizar-informacion';
  completed: boolean;
  completedAt?: Date;
  url?: string;
}

export interface TreatmentMaterial {
  id: string;
  planId: string;
  title: string;
  description: string;
  type: MaterialType;
  category: MaterialCategory;
  content?: string;
  url?: string;
  thumbnail?: string;
  duration?: number; // minutos para videos/audios
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  tags: string[];
  isRecommended: boolean;
  isRequired: boolean;
  order: number;
  accessCount: number;
  rating: number;
  reviews: MaterialReview[];
  lastAccessed?: Date;
  completedAt?: Date;
  isCompleted: boolean;
  progress?: number; // 0-100 para materiales con progreso
  createdAt: Date;
  updatedAt: Date;
}

export type MaterialType = 'articulo' | 'video' | 'audio' | 'ejercicio' | 'hoja-trabajo' | 'app' | 'libro' | 'podcast' | 'webinar' | 'curso';
export type MaterialCategory = 'psicoeducacion' | 'tecnicas-relajacion' | 'mindfulness' | 'tcc' | 'habilidades-sociales' | 'autoestima' | 'ansiedad' | 'depresion' | 'trauma' | 'adicciones';

export interface MaterialReview {
  id: string;
  materialId: string;
  patientId: string;
  rating: number; // 1-5
  comment?: string;
  helpful: boolean;
  createdAt: Date;
}

export interface TreatmentProgress {
  planId: string;
  overallProgress: number; // 0-100
  objectivesProgress: ObjectiveProgress[];
  tasksProgress: TasksProgress;
  adherenceMetrics: AdherenceMetrics;
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
  milestones: ProgressMilestone[];
  trends: ProgressTrend[];
  lastUpdated: Date;
}

export interface ObjectiveProgress {
  objectiveId: string;
  title: string;
  progress: number; // 0-100
  status: ObjectiveStatus;
  completedMilestones: number;
  totalMilestones: number;
  daysRemaining?: number;
  onTrack: boolean;
}

export interface TasksProgress {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number; // 0-100
  onTimeCompletionRate: number; // 0-100
  averageCompletionTime: number; // días
}

export interface AdherenceMetrics {
  overall: number; // 0-100
  tasks: number; // 0-100
  appointments: number; // 0-100
  materials: number; // 0-100
  trend: 'mejorando' | 'estable' | 'declinando';
  factors: AdherenceFactor[];
}

export interface AdherenceFactor {
  type: 'facilitador' | 'barrera';
  description: string;
  impact: 'alto' | 'medio' | 'bajo';
  frequency: number;
}

export interface WeeklyProgress {
  weekStart: Date;
  weekEnd: Date;
  tasksCompleted: number;
  tasksAssigned: number;
  adherenceRate: number;
  mood: number; // 1-10
  notes?: string;
}

export interface MonthlyProgress {
  month: string;
  year: number;
  objectivesAchieved: number;
  tasksCompleted: number;
  adherenceRate: number;
  averageMood: number;
  keyAchievements: string[];
  challenges: string[];
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  achievedDate: Date;
  category: 'objetivo' | 'tarea' | 'adherencia' | 'bienestar';
  significance: 'menor' | 'importante' | 'mayor';
  celebration?: string;
}

export interface ProgressTrend {
  metric: string;
  period: 'semanal' | 'mensual' | 'trimestral';
  direction: 'ascendente' | 'descendente' | 'estable';
  change: number; // porcentaje de cambio
  significance: 'significativo' | 'moderado' | 'leve';
}

export interface TherapistNote {
  id: string;
  planId: string;
  therapistId: string;
  title: string;
  content: string;
  type: 'general' | 'progreso' | 'preocupacion' | 'celebracion' | 'ajuste';
  priority: 'informativa' | 'importante' | 'urgente';
  isVisibleToPatient: boolean;
  createdAt: Date;
  readAt?: Date;
}

// ============================================================================
// INTERFACES PARA EXPORTACIÓN Y COMPARTIR
// ============================================================================

export interface TreatmentExportOptions {
  format: 'pdf' | 'word' | 'html';
  sections: ExportSection[];
  includeProgress: boolean;
  includeNotes: boolean;
  includeMaterials: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  language: 'es' | 'en';
  template: 'completo' | 'resumen' | 'progreso';
}

export interface ExportSection {
  name: string;
  included: boolean;
  subsections?: ExportSection[];
}

export interface ShareOptions {
  method: 'email' | 'drive' | 'download';
  recipients?: string[];
  message?: string;
  permissions?: 'view' | 'comment' | 'edit';
  expirationDate?: Date;
}

// ============================================================================
// INTERFACES PARA GAMIFICACIÓN (OPCIONAL)
// ============================================================================

export interface GamificationElements {
  points: number;
  level: number;
  badges: Badge[];
  streaks: Streak[];
  achievements: Achievement[];
  leaderboard?: LeaderboardEntry;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  category: 'tareas' | 'adherencia' | 'progreso' | 'tiempo' | 'especial';
}

export interface Streak {
  id: string;
  type: 'tareas-diarias' | 'adherencia-semanal' | 'objetivos-mensuales';
  current: number;
  best: number;
  lastUpdate: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number; // 0-100
  target: number;
  achieved: boolean;
  achievedAt?: Date;
  reward?: string;
}

export interface LeaderboardEntry {
  rank: number;
  totalParticipants: number;
  category: 'adherencia' | 'progreso' | 'tareas';
  anonymous: boolean;
}

// ============================================================================
// INTERFACES PARA CONFIGURACIÓN Y PREFERENCIAS
// ============================================================================

export interface TreatmentPreferences {
  notifications: {
    taskReminders: boolean;
    progressUpdates: boolean;
    milestoneAlerts: boolean;
    therapistMessages: boolean;
    reminderTiming: number; // horas antes
    methods: ('email' | 'sms' | 'push')[];
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: 'es' | 'en';
    dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
    timeFormat: '12h' | '24h';
    showProgress: boolean;
    showAdherence: boolean;
    showGamification: boolean;
  };
  privacy: {
    shareProgressWithFamily: boolean;
    allowTherapistNotes: boolean;
    showDiagnosis: boolean;
    anonymousLeaderboard: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

// ============================================================================
// TIPOS PARA RESPUESTAS DE API
// ============================================================================

export interface TreatmentAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface TreatmentPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// TIPOS PARA FILTROS Y BÚSQUEDA
// ============================================================================

export interface TreatmentFilters {
  status?: TreatmentPlanStatus[];
  priority?: ('alta' | 'media' | 'baja')[];
  category?: ObjectiveCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  showCompleted?: boolean;
  sortBy?: 'fecha' | 'prioridad' | 'progreso' | 'nombre';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskFilters {
  status?: TaskStatus[];
  type?: TaskType[];
  category?: TaskCategory[];
  priority?: ('alta' | 'media' | 'baja')[];
  dueDate?: {
    start?: Date;
    end?: Date;
  };
  searchTerm?: string;
  showCompleted?: boolean;
  sortBy?: 'fecha' | 'prioridad' | 'tipo' | 'nombre';
  sortOrder?: 'asc' | 'desc';
}

export interface MaterialFilters {
  type?: MaterialType[];
  category?: MaterialCategory[];
  difficulty?: ('principiante' | 'intermedio' | 'avanzado')[];
  isRecommended?: boolean;
  isCompleted?: boolean;
  searchTerm?: string;
  sortBy?: 'nombre' | 'fecha' | 'rating' | 'accesos';
  sortOrder?: 'asc' | 'desc';
}
