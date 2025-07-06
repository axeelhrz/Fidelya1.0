import { z } from 'zod';

export const comercioProfileSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  nombreComercio: z
    .string()
    .min(1, 'El nombre del comercio es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  categoria: z
    .string()
    .min(1, 'La categoría es requerida'),
  direccion: z
    .string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional(),
  telefono: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'El teléfono debe tener al menos 8 dígitos'
    }),
  horario: z
    .string()
    .max(100, 'El horario no puede exceder 100 caracteres')
    .optional(),
  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  sitioWeb: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith('http'), {
      message: 'El sitio web debe comenzar con http:// o https://'
    }),
  razonSocial: z
    .string()
    .max(150, 'La razón social no puede exceder 150 caracteres')
    .optional(),
  cuit: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{2}-\d{8}-\d{1}$/.test(val), {
      message: 'El formato del CUIT debe ser XX-XXXXXXXX-X'
    }),
  ubicacion: z
    .string()
    .max(100, 'La ubicación no puede exceder 100 caracteres')
    .optional(),
  emailContacto: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),
  visible: z
    .boolean()
    .optional()
    .default(true),
  redesSociales: z.object({
    facebook: z
      .string()
      .optional()
      .refine((val) => !val || val.startsWith('@') || val.includes('facebook.com'), {
        message: 'Debe ser un usuario (@usuario) o URL de Facebook'
      }),
    instagram: z
      .string()
      .optional()
      .refine((val) => !val || val.startsWith('@') || val.includes('instagram.com'), {
        message: 'Debe ser un usuario (@usuario) o URL de Instagram'
      }),
    twitter: z
      .string()
      .optional()
      .refine((val) => !val || val.startsWith('@') || val.includes('twitter.com'), {
        message: 'Debe ser un usuario (@usuario) o URL de Twitter'
      }),
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
    .max(300, 'Las condiciones no pueden exceder 300 caracteres')
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

// Schema para validación de imágenes
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'El archivo debe ser menor a 5MB'
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
      message: 'Solo se permiten archivos JPG, PNG o WebP'
    }),
  type: z.enum(['logo', 'portada'])
});

// Schema para configuración de comercio
export const comercioConfigSchema = z.object({
  notificacionesEmail: z.boolean().default(true),
  notificacionesWhatsApp: z.boolean().default(false),
  autoValidacion: z.boolean().default(false),
  visible: z.boolean().default(true),
  horarioAtencion: z.object({
    lunes: z.object({
      activo: z.boolean(),
      inicio: z.string().optional(),
      fin: z.string().optional()
    }).optional(),
    martes: z.object({
      activo: z.boolean(),
      inicio: z.string().optional(),
      fin: z.string().optional()
    }).optional(),
    miercoles: z.object({
      activo: z.boolean(),
      inicio: z.string().optional(),
      fin: z.string().optional()
    }).optional(),
    jueves: z.object({
      activo: z.boolean(),
      inicio: z.string().optional(),
      fin: z.string().optional()
    }).optional(),
    viernes: z.object({
      activo: z.boolean(),
      inicio: z.string().optional(),
      fin: z.string().optional()
    }).optional(),
    sabado: z.object({
      activo: z.boolean(),
      inicio: z.string().optional(),
      fin: z.string().optional()
    }).optional(),
    domingo: z.object({
      activo: z.boolean(),
      inicio: z.string().optional(),
      fin: z.string().optional()
    }).optional()
  }).optional()
});

export type ComercioProfileFormData = z.infer<typeof comercioProfileSchema>;
export type BeneficioFormData = z.infer<typeof beneficioSchema>;
export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
export type ComercioConfigFormData = z.infer<typeof comercioConfigSchema>;