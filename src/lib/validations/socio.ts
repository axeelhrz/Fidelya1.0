import { z } from 'zod';

export const socioSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string()
    .email('Ingresa un email válido')
    .min(1, 'El email es requerido'),
  estado: z.enum(['activo', 'vencido'], {
    required_error: 'Selecciona un estado'
  }),
  telefono: z.string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'El teléfono debe tener al menos 8 dígitos'
    }),
  dni: z.string()
    .optional()
    .refine((val) => !val || val.length >= 7, {
      message: 'El DNI debe tener al menos 7 caracteres'
    })
});

export const csvSocioSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido'),
  estado: z.enum(['activo', 'vencido']).optional().default('activo'),
  telefono: z.string().optional(),
  dni: z.string().optional()
});

export type SocioFormData = z.infer<typeof socioSchema>;
export type CsvSocioData = z.infer<typeof csvSocioSchema>;
