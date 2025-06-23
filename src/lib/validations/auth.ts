import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const baseRegisterObjectSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña')
});

export const baseRegisterSchema = baseRegisterObjectSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  }
);

export const asociacionRegisterSchema = baseRegisterObjectSchema
  .extend({
    nombreAsociacion: z
      .string()
      .min(1, 'El nombre de la asociación es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export const comercioRegisterSchema = baseRegisterObjectSchema
  .extend({
    nombreComercio: z
      .string()
      .min(1, 'El nombre del comercio es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    categoria: z
      .string()
      .min(1, 'La categoría es requerida')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type BaseRegisterFormData = z.infer<typeof baseRegisterSchema>;
export type AsociacionRegisterFormData = z.infer<typeof asociacionRegisterSchema>;
export type ComercioRegisterFormData = z.infer<typeof comercioRegisterSchema>;
