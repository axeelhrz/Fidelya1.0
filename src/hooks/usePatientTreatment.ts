'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PatientTreatmentPlan, 
  TreatmentObjective, 
  TreatmentTask, 
  TreatmentAlert,
  TreatmentMaterial,
  TreatmentProgress,
  TherapistNote,
  TreatmentExportOptions,
  ShareOptions,
  TaskFilters,
  MaterialFilters
} from '@/types/treatment';

interface UsePatientTreatmentReturn {
  // Data
  treatmentPlan: PatientTreatmentPlan | null;
  objectives: TreatmentObjective[];
  tasks: TreatmentTask[];
  alerts: TreatmentAlert[];
  materials: TreatmentMaterial[];
  progress: TreatmentProgress | null;
  therapistNotes: TherapistNote[];
  
  // Loading states
  loading: boolean;
  loadingTasks: boolean;
  loadingMaterials: boolean;
  loadingProgress: boolean;
  
  // Error states
  error: string | null;
  
  // Filters
  taskFilters: TaskFilters;
  materialFilters: MaterialFilters;
  
  // Actions
  markTaskCompleted: (taskId: string, feedback?: string, rating?: number) => Promise<void>;
  markTaskInProgress: (taskId: string) => Promise<void>;
  markMaterialCompleted: (materialId: string, progress?: number) => Promise<void>;
  markAlertResolved: (alertId: string) => Promise<void>;
  markNoteRead: (noteId: string) => Promise<void>;
  
  // Export and sharing
  exportTreatmentPlan: (options: TreatmentExportOptions) => Promise<string>;
  shareTreatmentPlan: (options: ShareOptions) => Promise<void>;
  
  // Filters
  setTaskFilters: (filters: TaskFilters) => void;
  setMaterialFilters: (filters: MaterialFilters) => void;
  
  // Refresh
  refetch: () => Promise<void>;
  
  // Statistics
  getTaskStats: () => {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
  };
  
  getObjectiveStats: () => {
    total: number;
    completed: number;
    inProgress: number;
    averageProgress: number;
  };
}

export function usePatientTreatment(): UsePatientTreatmentReturn {
  const { user } = useAuth();
  
  // State
  const [treatmentPlan, setTreatmentPlan] = useState<PatientTreatmentPlan | null>(null);
  const [objectives, setObjectives] = useState<TreatmentObjective[]>([]);
  const [tasks, setTasks] = useState<TreatmentTask[]>([]);
  const [alerts, setAlerts] = useState<TreatmentAlert[]>([]);
  const [materials, setMaterials] = useState<TreatmentMaterial[]>([]);
  const [progress, setProgress] = useState<TreatmentProgress | null>(null);
  const [therapistNotes, setTherapistNotes] = useState<TherapistNote[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingProgress] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [taskFilters, setTaskFilters] = useState<TaskFilters>({
    showCompleted: false,
    sortBy: 'fecha',
    sortOrder: 'asc'
  });
  
  const [materialFilters, setMaterialFilters] = useState<MaterialFilters>({
    sortBy: 'nombre',
    sortOrder: 'asc'
  });

  // Mock data generator
  const generateMockData = useCallback((): PatientTreatmentPlan => {
    const planId = `plan_${user?.id}`;
    const now = new Date();
    
    return {
      id: planId,
      patientId: user?.id || '',
      therapistId: 'therapist_1',
      centerId: 'center_1',
      planName: 'Plan de Tratamiento para Ansiedad Generalizada',
      title: 'Manejo de Ansiedad y Técnicas de Afrontamiento',
      description: 'Plan integral para el tratamiento de ansiedad generalizada mediante técnicas cognitivo-conductuales, mindfulness y psicoeducación.',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-07-15'),
      lastReviewed: new Date('2024-03-01'),
      nextReviewDate: new Date('2024-04-01'),
      status: 'activo',
      adherenceRate: 85,
      createdAt: new Date('2024-01-15'),
      updatedAt: now,
      
      objectives: [
        {
          id: 'obj_1',
          planId,
          title: 'Reducir síntomas de ansiedad',
          description: 'Disminuir la frecuencia e intensidad de los episodios de ansiedad mediante técnicas de relajación y reestructuración cognitiva.',
          category: 'sintomatico',
          priority: 'alta',
          status: 'en-progreso',
          startDate: new Date('2024-01-15'),
          targetDate: new Date('2024-04-15'),
          progress: 65,
          adherence: 80,
          measurable: 'Reducir episodios de ansiedad de 5-6 por semana a 2-3 por semana',
          achievable: 'Mediante práctica diaria de técnicas aprendidas',
          relevant: 'Fundamental para mejorar calidad de vida',
          timeBound: '3 meses',
          barriers: ['Falta de tiempo', 'Olvido de practicar'],
          facilitators: ['Apoyo familiar', 'Motivación personal'],
          milestones: [
            {
              id: 'milestone_1',
              objectiveId: 'obj_1',
              title: 'Dominar técnica de respiración',
              description: 'Practicar respiración diafragmática 10 minutos diarios',
              targetDate: new Date('2024-02-15'),
              achievedDate: new Date('2024-02-10'),
              status: 'completado',
              criteria: ['Práctica diaria', 'Reducción de ansiedad'],
              evidence: ['Registro de práctica', 'Autoevaluación']
            }
          ],
          subtasks: [
            {
              id: 'subtask_1',
              objectiveId: 'obj_1',
              title: 'Practicar respiración diafragmática',
              description: '10 minutos diarios',
              completed: true,
              completedDate: new Date('2024-02-10'),
              order: 1
            }
          ],
          createdAt: new Date('2024-01-15'),
          updatedAt: now
        }
      ],
      
      tasks: [
        {
          id: 'task_1',
          planId,
          objectiveId: 'obj_1',
          title: 'Registro de pensamientos automáticos',
          description: 'Anota tus pensamientos automáticos negativos durante la semana usando la hoja de registro.',
          type: 'tarea',
          category: 'tecnicas-cognitivas',
          priority: 'alta',
          status: 'en-progreso',
          assignedDate: new Date('2024-03-15'),
          dueDate: new Date('2024-03-22'),
          estimatedDuration: 15,
          instructions: 'Utiliza la hoja de registro proporcionada. Anota al menos 3 situaciones donde notes pensamientos automáticos negativos. Incluye: situación, pensamiento, emoción y nivel de ansiedad (1-10).',
          resources: [
            {
              id: 'res_1',
              name: 'Hoja de Registro de Pensamientos',
              type: 'pdf',
              url: '/resources/thought-record.pdf',
              description: 'Plantilla para registrar pensamientos automáticos',
              isDownloadable: true,
              viewCount: 5,
              lastAccessed: new Date('2024-03-18')
            }
          ],
          attachments: [],
          notes: 'Recuerda ser específico en las situaciones y honesto con tus pensamientos.',
          difficulty: 'moderado',
          reminders: [],
          isRecurring: false,
          createdAt: new Date('2024-03-15'),
          updatedAt: now
        },
        {
          id: 'task_2',
          planId,
          objectiveId: 'obj_1',
          title: 'Ejercicio de respiración diafragmática',
          description: 'Practica la técnica de respiración que aprendimos en sesión.',
          type: 'ejercicio',
          category: 'tecnicas-conductuales',
          priority: 'media',
          status: 'completada',
          assignedDate: new Date('2024-03-10'),
          dueDate: new Date('2024-03-17'),
          completedDate: new Date('2024-03-16'),
          estimatedDuration: 10,
          actualDuration: 12,
          instructions: 'Practica 10 minutos cada día, preferiblemente por la mañana y antes de dormir. Usa el audio guía si lo necesitas.',
          resources: [
            {
              id: 'res_2',
              name: 'Audio Guía de Respiración',
              type: 'audio',
              url: '/resources/breathing-guide.mp3',
              description: 'Audio de 10 minutos para guiar tu práctica',
              duration: 10,
              isDownloadable: true,
              viewCount: 8,
              lastAccessed: new Date('2024-03-16')
            }
          ],
          attachments: [],
          notes: 'Excelente progreso. Continúa con la práctica diaria.',
          difficulty: 'facil',
          patientRating: 4,
          patientFeedback: 'Me ayuda mucho a relajarme, especialmente antes de dormir.',
          reminders: [],
          isRecurring: true,
          recurrencePattern: {
            frequency: 'diario',
            interval: 1,
            endDate: new Date('2024-04-15')
          },
          createdAt: new Date('2024-03-10'),
          updatedAt: now
        }
      ],
      
      alerts: [
        {
          id: 'alert_1',
          planId,
          type: 'revision-programada',
          title: 'Revisión de Plan de Tratamiento',
          description: 'Tu próxima revisión del plan de tratamiento está programada para el 1 de abril.',
          urgency: 'media',
          status: 'activa',
          scheduledFor: new Date('2024-04-01'),
          actionRequired: true,
          actions: [
            {
              id: 'action_1',
              alertId: 'alert_1',
              title: 'Preparar preguntas para la revisión',
              description: 'Piensa en qué aspectos del tratamiento te gustaría discutir',
              type: 'revisar-objetivo',
              completed: false
            }
          ],
          createdAt: new Date('2024-03-15'),
          updatedAt: now
        },
        {
          id: 'alert_2',
          planId,
          type: 'tarea-vencida',
          title: 'Tarea Próxima a Vencer',
          description: 'La tarea "Registro de pensamientos automáticos" vence mañana.',
          urgency: 'alta',
          status: 'activa',
          scheduledFor: new Date('2024-03-21'),
          actionRequired: true,
          actions: [
            {
              id: 'action_2',
              alertId: 'alert_2',
              title: 'Completar registro de pensamientos',
              description: 'Finaliza tu registro antes de la fecha límite',
              type: 'completar-tarea',
              completed: false
            }
          ],
          createdAt: new Date('2024-03-20'),
          updatedAt: now
        }
      ],
      
      materials: [
        {
          id: 'mat_1',
          planId,
          title: 'Técnicas de Relajación para la Ansiedad',
          description: 'Guía completa de técnicas de relajación específicamente diseñadas para el manejo de la ansiedad.',
          type: 'articulo',
          category: 'tecnicas-relajacion',
          difficulty: 'principiante',
          tags: ['ansiedad', 'relajación', 'técnicas'],
          isRecommended: true,
          isRequired: false,
          order: 1,
          accessCount: 3,
          rating: 4.8,
          reviews: [
            {
              id: 'review_1',
              materialId: 'mat_1',
              patientId: user?.id || '',
              rating: 5,
              comment: 'Muy útil y fácil de entender',
              helpful: true,
              createdAt: new Date('2024-03-10')
            }
          ],
          lastAccessed: new Date('2024-03-18'),
          isCompleted: true,
          completedAt: new Date('2024-03-12'),
          progress: 100,
          createdAt: new Date('2024-01-15'),
          updatedAt: now
        },
        {
          id: 'mat_2',
          planId,
          title: 'Meditación Guiada - 10 minutos',
          description: 'Sesión de meditación guiada perfecta para principiantes que buscan reducir la ansiedad.',
          type: 'audio',
          category: 'mindfulness',
          duration: 10,
          difficulty: 'principiante',
          tags: ['meditación', 'mindfulness', 'relajación'],
          isRecommended: true,
          isRequired: false,
          order: 2,
          accessCount: 8,
          rating: 4.9,
          reviews: [],
          lastAccessed: new Date('2024-03-19'),
          isCompleted: false,
          progress: 60,
          createdAt: new Date('2024-01-15'),
          updatedAt: now
        }
      ],
      
      progress: {
        planId,
        overallProgress: 72,
        objectivesProgress: [
          {
            objectiveId: 'obj_1',
            title: 'Reducir síntomas de ansiedad',
            progress: 65,
            status: 'en-progreso',
            completedMilestones: 2,
            totalMilestones: 3,
            daysRemaining: 25,
            onTrack: true
          }
        ],
        tasksProgress: {
          total: 2,
          completed: 1,
          inProgress: 1,
          overdue: 0,
          completionRate: 50,
          onTimeCompletionRate: 100,
          averageCompletionTime: 6
        },
        adherenceMetrics: {
          overall: 85,
          tasks: 80,
          appointments: 95,
          materials: 75,
          trend: 'mejorando',
          factors: [
            {
              type: 'facilitador',
              description: 'Apoyo familiar constante',
              impact: 'alto',
              frequency: 5
            },
            {
              type: 'barrera',
              description: 'Falta de tiempo por trabajo',
              impact: 'medio',
              frequency: 3
            }
          ]
        },
        weeklyProgress: [
          {
            weekStart: new Date('2024-03-11'),
            weekEnd: new Date('2024-03-17'),
            tasksCompleted: 1,
            tasksAssigned: 2,
            adherenceRate: 80,
            mood: 7,
            notes: 'Buena semana, me sentí más relajado'
          }
        ],
        monthlyProgress: [
          {
            month: 'Marzo',
            year: 2024,
            objectivesAchieved: 0,
            tasksCompleted: 3,
            adherenceRate: 85,
            averageMood: 7.2,
            keyAchievements: ['Dominio de respiración diafragmática', 'Identificación de pensamientos automáticos'],
            challenges: ['Mantener consistencia en práctica diaria']
          }
        ],
        milestones: [
          {
            id: 'prog_milestone_1',
            title: 'Primera semana sin episodios de ansiedad severa',
            description: 'Logré pasar una semana completa sin episodios de ansiedad nivel 8 o superior',
            achievedDate: new Date('2024-03-10'),
            category: 'bienestar',
            significance: 'importante',
            celebration: 'Cena especial con la familia'
          }
        ],
        trends: [
          {
            metric: 'Adherencia a tareas',
            period: 'semanal',
            direction: 'ascendente',
            change: 15,
            significance: 'moderado'
          }
        ],
        lastUpdated: now
      },
      
      therapistNotes: [
        {
          id: 'note_1',
          planId,
          therapistId: 'therapist_1',
          title: 'Excelente progreso en técnicas de respiración',
          content: 'El paciente ha mostrado un dominio excepcional de las técnicas de respiración diafragmática. Se recomienda continuar con la práctica diaria y comenzar a aplicarla en situaciones de estrés real.',
          type: 'progreso',
          priority: 'informativa',
          isVisibleToPatient: true,
          createdAt: new Date('2024-03-12'),
          readAt: new Date('2024-03-13')
        },
        {
          id: 'note_2',
          planId,
          therapistId: 'therapist_1',
          title: 'Ajuste en objetivos del tratamiento',
          content: 'Considerando el buen progreso, hemos ajustado ligeramente los objetivos para incluir más práctica de mindfulness en situaciones cotidianas.',
          type: 'ajuste',
          priority: 'importante',
          isVisibleToPatient: true,
          createdAt: new Date('2024-03-15')
        }
      ]
    };
  }, [user?.id]);

  // Load treatment data
  const loadTreatmentData = useCallback(async () => {
    if (!user || user.role !== 'patient') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = generateMockData();
      
      setTreatmentPlan(mockData);
      setObjectives(mockData.objectives);
      setTasks(mockData.tasks);
      setAlerts(mockData.alerts);
      setMaterials(mockData.materials);
      setProgress(mockData.progress);
      setTherapistNotes(mockData.therapistNotes);

    } catch (err) {
      setError('Error al cargar el plan de tratamiento');
      console.error('Error loading treatment data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, generateMockData]);

  // Mark task as completed
  const markTaskCompleted = useCallback(async (taskId: string, feedback?: string, rating?: number) => {
    try {
      setLoadingTasks(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'completada',
              completedDate: new Date(),
              patientFeedback: feedback,
              patientRating: rating
            }
          : task
      ));

      // Update progress
      if (progress) {
        const completedTasks = tasks.filter(t => t.status === 'completada').length + 1;
        const newCompletionRate = (completedTasks / tasks.length) * 100;
        
        setProgress(prev => prev ? {
          ...prev,
          tasksProgress: {
            ...prev.tasksProgress,
            completed: completedTasks,
            completionRate: newCompletionRate
          },
          overallProgress: Math.min(prev.overallProgress + 5, 100)
        } : null);
      }

    } catch (err) {
      console.error('Error marking task as completed:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, [tasks, progress]);

  // Mark task as in progress
  const markTaskInProgress = useCallback(async (taskId: string) => {
    try {
      setLoadingTasks(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'en-progreso' }
          : task
      ));

    } catch (err) {
      console.error('Error marking task as in progress:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  // Mark material as completed
  const markMaterialCompleted = useCallback(async (materialId: string, progressValue?: number) => {
    try {
      setLoadingMaterials(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMaterials(prev => prev.map(material => 
        material.id === materialId 
          ? { 
              ...material, 
              isCompleted: true,
              completedAt: new Date(),
              progress: progressValue || 100,
              accessCount: material.accessCount + 1
            }
          : material
      ));

    } catch (err) {
      console.error('Error marking material as completed:', err);
    } finally {
      setLoadingMaterials(false);
    }
  }, []);

  // Mark alert as resolved
  const markAlertResolved = useCallback(async (alertId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              status: 'resuelta',
              resolvedAt: new Date(),
              resolvedBy: user?.id || ''
            }
          : alert
      ));

    } catch (err) {
      console.error('Error marking alert as resolved:', err);
    }
  }, [user?.id]);

  // Mark note as read
  const markNoteRead = useCallback(async (noteId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setTherapistNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, readAt: new Date() }
          : note
      ));

    } catch (err) {
      console.error('Error marking note as read:', err);
    }
  }, []);

  // Export treatment plan
  const exportTreatmentPlan = useCallback(async (options: TreatmentExportOptions): Promise<string> => {
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would generate and return a download URL
      const exportUrl = `/exports/treatment-plan-${treatmentPlan?.id}-${Date.now()}.${options.format}`;
      
      return exportUrl;
    } catch (err) {
      console.error('Error exporting treatment plan:', err);
      throw new Error('Error al exportar el plan de tratamiento');
    }
  }, [treatmentPlan?.id]);

  // Share treatment plan
  const shareTreatmentPlan = useCallback(async (options: ShareOptions) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would handle sharing via email, drive, etc.
      console.log('Sharing treatment plan with options:', options);
      
    } catch (err) {
      console.error('Error sharing treatment plan:', err);
      throw new Error('Error al compartir el plan de tratamiento');
    }
  }, []);

  // Get task statistics
  const getTaskStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completada').length;
    const inProgress = tasks.filter(t => t.status === 'en-progreso').length;
    const overdue = tasks.filter(t => 
      t.dueDate && t.dueDate < new Date() && t.status !== 'completada'
    ).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate
    };
  }, [tasks]);

  // Get objective statistics
  const getObjectiveStats = useCallback(() => {
    const total = objectives.length;
    const completed = objectives.filter(o => o.status === 'completado').length;
    const inProgress = objectives.filter(o => o.status === 'en-progreso').length;
    const averageProgress = total > 0 
      ? objectives.reduce((sum, obj) => sum + obj.progress, 0) / total 
      : 0;

    return {
      total,
      completed,
      inProgress,
      averageProgress
    };
  }, [objectives]);

  // Refetch data
  const refetch = useCallback(async () => {
    await loadTreatmentData();
  }, [loadTreatmentData]);

  // Load data on mount
  useEffect(() => {
    loadTreatmentData();
  }, [loadTreatmentData]);

  return {
    // Data
    treatmentPlan,
    objectives,
    tasks,
    alerts,
    materials,
    progress,
    therapistNotes,
    
    // Loading states
    loading,
    loadingTasks,
    loadingMaterials,
    loadingProgress,
    
    // Error states
    error,
    
    // Filters
    taskFilters,
    materialFilters,
    
    // Actions
    markTaskCompleted,
    markTaskInProgress,
    markMaterialCompleted,
    markAlertResolved,
    markNoteRead,
    
    // Export and sharing
    exportTreatmentPlan,
    shareTreatmentPlan,
    
    // Filters
    setTaskFilters,
    setMaterialFilters,
    
    // Refresh
    refetch,
    
    // Statistics
    getTaskStats,
    getObjectiveStats
  };
}