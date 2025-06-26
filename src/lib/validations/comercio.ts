import { z } from 'zod';

export const comercioProfileSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  nombreComercio: z
    .string()
    .min(1, 'El nombre del comercio es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  categoria: z
    .string()
    .min(1, 'La categoría es requerida'),
  direccion: z
    .string()
    .optional(),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'El teléfono debe tener al menos 8 dígitos'
    }),
  horario: z
    .string()
    .optional(),
  descripcion: z
    .string()
    .optional(),
  sitioWeb: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith('http'), {
      message: 'El sitio web debe comenzar con http:// o https://'
    }),
  redesSociales: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
  }).optional()
});

export const beneficioSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es requerido')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  descripcion: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  tipo: z.enum(['descuento_porcentaje', 'descuento_fijo', '2x1', 'envio_gratis', 'regalo', 'puntos']),
  valor: z
    .number()
    .min(0, 'El valor debe ser mayor a 0'),
  asociacionesVinculadas: z
    .array(z.string())
    .min(1, 'Debe seleccionar al menos una asociación'),
  fechaInicio: z
    .date()
    .refine((date) => date >= new Date(), {
      message: 'La fecha de inicio debe ser hoy o posterior'
    }),
  fechaFin: z
    .date(),
  diasValidez: z
    .array(z.string())
    .optional(),
  horariosValidez: z.object({
    inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    fin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido')
  }).optional(),
  mediosPagoHabilitados: z
    .array(z.string())
    .optional(),
  limitePorSocio: z
    .number()
    .min(1, 'El límite por socio debe ser mayor a 0')
    .optional(),
  limiteTotal: z
    .number()
    .min(1, 'El límite total debe ser mayor a 0')
    .optional(),
  condiciones: z
    .string()
    .optional()
}).refine((data) => data.fechaFin > data.fechaInicio, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fechaFin']
}).refine((data) => {
  if (data.tipo === 'descuento_porcentaje' && data.valor > 100) {
    return false;
  }
  return true;
}, {
  message: 'El porcentaje no puede ser mayor a 100%',
  path: ['valor']
});

export type ComercioProfileFormData = z.infer<typeof comercioProfileSchema>;
export type BeneficioFormData = z.infer<typeof beneficioSchema>;
