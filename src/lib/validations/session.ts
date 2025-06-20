import { z } from 'zod';
import { SessionType } from '@/types/session';

export const sessionFormSchema = z.object({
  patientId: z.string().min(1, 'Debe seleccionar un paciente'),
  date: z.string().min(1, 'La fecha es requerida'),
  duration: z.number().min(15, 'La duración mínima es 15 minutos').max(480, 'La duración máxima es 8 horas').optional(),
  type: z.enum(['individual', 'group', 'family', 'online'] as const, {
    required_error: 'Debe seleccionar un tipo de sesión',
  }),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled'] as const, {
    required_error: 'Debe seleccionar un estado',
  }),
  notes: z.string().min(10, 'Las notas deben tener al menos 10 caracteres').max(5000, 'Las notas no pueden exceder 5000 caracteres'),
  observations: z.string().max(2000, 'Las observaciones no pueden exceder 2000 caracteres').optional(),
  interventions: z.string().max(2000, 'Las intervenciones no pueden exceder 2000 caracteres').optional(),
  homework: z.string().max(1000, 'Las tareas no pueden exceder 1000 caracteres').optional(),
  nextSessionPlan: z.string().max(1000, 'El plan para la próxima sesión no puede exceder 1000 caracteres').optional(),
});

export const sessionFiltersSchema = z.object({
  search: z.string().optional(),
  patientId: z.string().optional(),
  professionalId: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled', ''] as const).optional(),
  type: z.enum(['individual', 'group', 'family', 'online', ''] as const).optional(),
  emotionalTone: z.enum([
    'Estable', 'Ansioso/a', 'Deprimido/a', 'Irritable', 'Eufórico/a', 
    'Confundido/a', 'Agresivo/a', 'Retraído/a', 'Esperanzado/a', 'Frustrado/a', ''
  ] as const).optional(),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  hasAIAnalysis: z.boolean().optional(),
  riskLevel: z.enum(['low', 'medium', 'high', ''] as const).optional(),
});

export type SessionFormData = z.infer<typeof sessionFormSchema>;
export type SessionFiltersData = z.infer<typeof sessionFiltersSchema>;

// Validaciones adicionales
export const validateSessionDate = (date: string): boolean => {
  const sessionDate = new Date(date);
  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  return sessionDate >= new Date('2020-01-01') && sessionDate <= oneYearFromNow;
};

export const validateSessionTime = (date: string): boolean => {
  const sessionDate = new Date(date);
  const hours = sessionDate.getHours();
  
  // Validar que esté en horario laboral (6 AM - 10 PM)
  return hours >= 6 && hours <= 22;
};

export const validateNotesQuality = (notes: string): {
  isValid: boolean;
  score: number;
  suggestions: string[];
} => {
  const suggestions: string[] = [];
  let score = 0;

  // Longitud mínima
  if (notes.length >= 50) score += 20;
  else suggestions.push('Considera agregar más detalles a las notas');

  // Presencia de palabras clave clínicas
  const clinicalKeywords = [
    'paciente', 'sesión', 'terapia', 'emocional', 'comportamiento', 
    'síntoma', 'progreso', 'objetivo', 'intervención', 'estrategia'
  ];
  
  const foundKeywords = clinicalKeywords.filter(keyword => 
    notes.toLowerCase().includes(keyword)
  );
  
  score += Math.min(foundKeywords.length * 5, 30);
  
  if (foundKeywords.length < 3) {
    suggestions.push('Incluye más terminología clínica específica');
  }

  // Estructura (párrafos)
  const paragraphs = notes.split('\n').filter(p => p.trim().length > 0);
  if (paragraphs.length >= 2) score += 20;
  else suggestions.push('Organiza las notas en párrafos para mejor estructura');

  // Presencia de observaciones específicas
  const specificTerms = ['observé', 'noté', 'manifestó', 'expresó', 'reportó'];
  const hasSpecificObservations = specificTerms.some(term => 
    notes.toLowerCase().includes(term)
  );
  
  if (hasSpecificObservations) score += 15;
  else suggestions.push('Incluye observaciones específicas del comportamiento del paciente');

  // Presencia de plan o próximos pasos
  const planTerms = ['próxima', 'siguiente', 'plan', 'objetivo', 'meta'];
  const hasPlan = planTerms.some(term => notes.toLowerCase().includes(term));
  
  if (hasPlan) score += 15;
  else suggestions.push('Considera incluir planes o objetivos para futuras sesiones');

  return {
    isValid: score >= 60,
    score,
    suggestions
  };
};

export const getSessionDurationSuggestion = (type: SessionType): number => {
  const suggestions = {
    individual: 50, // 50 minutos estándar
    group: 90,      // 1.5 horas para grupos
    family: 60,     // 1 hora para familias
    online: 45      // Ligeramente más corto para online
  };
  
  return suggestions[type];
};

export const validateSessionConflicts = (
  newSessionDate: string,
  existingSessions: Array<{ date: string; duration?: number }>
): {
  hasConflict: boolean;
  conflictingSessions: Array<{ date: string; duration?: number }>;
} => {
  const newDate = new Date(newSessionDate);
  const conflictingSessions: Array<{ date: string; duration?: number }> = [];

  for (const session of existingSessions) {
    const sessionDate = new Date(session.date);
    const sessionDuration = session.duration || 50; // Duración por defecto
    const sessionEnd = new Date(sessionDate.getTime() + sessionDuration * 60000);

    // Verificar si hay solapamiento (con buffer de 15 minutos)
    const buffer = 15 * 60000; // 15 minutos en milisegundos
    const newSessionStart = new Date(newDate.getTime() - buffer);
    const newSessionEnd = new Date(newDate.getTime() + buffer);

    if (
      (newSessionStart >= sessionDate && newSessionStart <= sessionEnd) ||
      (newSessionEnd >= sessionDate && newSessionEnd <= sessionEnd) ||
      (newSessionStart <= sessionDate && newSessionEnd >= sessionEnd)
    ) {
      conflictingSessions.push(session);
    }
  }

  return {
    hasConflict: conflictingSessions.length > 0,
    conflictingSessions
  };
};