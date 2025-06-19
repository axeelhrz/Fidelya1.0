import { z } from 'zod';

export const patientSchema = z.object({
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'La fecha de nacimiento debe ser válida'),
  
  gender: z.enum(['M', 'F', 'Otro'] as const, {
    required_error: 'El género es requerido',
  }),
  
  emotionalState: z.enum([
    'Estable',
    'Ansioso/a',
    'Deprimido/a',
    'Irritable',
    'Eufórico/a',
    'Confundido/a',
    'Agresivo/a',
    'Retraído/a'
  ] as const, {
    required_error: 'El estado emocional es requerido',
  }),
  
  motivoConsulta: z
    .string()
    .min(10, 'El motivo de consulta debe tener al menos 10 caracteres')
    .max(500, 'El motivo de consulta no puede exceder 500 caracteres'),
  
  observaciones: z
    .string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional(),
  
  assignedPsychologist: z
    .string()
    .min(1, 'Debe asignar un psicólogo'),
  
  nextSession: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const sessionDate = new Date(date);
      const today = new Date();
      return sessionDate >= today;
    }, 'La próxima sesión debe ser una fecha futura'),
  
  customFields: z
    .record(z.any())
    .optional(),
});

export const patientFiltersSchema = z.object({
  search: z.string().optional(),
  gender: z.enum(['', 'M', 'F', 'Otro'] as const).optional(),
  emotionalState: z.enum([
    '',
    'Estable',
    'Ansioso/a',
    'Deprimido/a',
    'Irritable',
    'Eufórico/a',
    'Confundido/a',
    'Agresivo/a',
    'Retraído/a'
  ] as const).optional(),
  assignedPsychologist: z.string().optional(),
  ageRange: z.object({
    min: z.number().min(0).max(120).optional(),
    max: z.number().min(0).max(120).optional(),
  }).optional(),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  status: z.enum(['', 'active', 'inactive', 'discharged'] as const).optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
export type PatientFiltersData = z.infer<typeof patientFiltersSchema>;