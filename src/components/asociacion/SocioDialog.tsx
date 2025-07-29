'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Crown,
  DollarSign,
  Clock,
  Users,
  Award
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { SocioFormData, Socio } from '@/types/socio';
import { OptimizationUtils } from '@/lib/optimization-config';
import { useDebounce } from '@/hooks/useDebounce';

// Schema ultra optimizado
const socioSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  email: z.string().email('Email inválido').max(100, 'Email muy largo'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional(),
  confirmPassword: z.string().optional(),
  estado: z.enum(['activo', 'inactivo', 'suspendido', 'pendiente', 'vencido']),
  estadoMembresia: z.enum(['al_dia', 'vencido', 'pendiente']).optional(),
  telefono: z.string().optional(),
  dni: z.string().optional(),
  numeroSocio: z.string().optional(),
  montoCuota: z.number().min(0).optional(),
  direccion: z.string().optional(),
  fechaNacimiento: z.date().optional(),
  fechaVencimiento: z.date().optional(),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type SocioFormInputs = z.infer<typeof socioSchema>;

interface SocioDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SocioFormData) => Promise<void>;
  socio?: Socio | null;
  loading?: boolean;
}

// Función helper para convertir Timestamp a Date
const timestampToDate = (timestamp: Timestamp | Date | undefined): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export const SocioDialog: React.FC<SocioDialogProps> = ({
  open,
  onClose,
  onSave,
  socio,
  loading = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEditing = !!socio;
  const shouldUseAnimations = OptimizationUtils.shouldUseAnimations();

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    trigger
  } = useForm<SocioFormInputs>({
    resolver: zodResolver(socioSchema),
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      email: '',
      estado: 'activo',
      estadoMembresia: 'al_dia',
      telefono: '',
      dni: '',
      numeroSocio: '',
      montoCuota: 0,
      direccion: '',
    }
  });

  // Debounced validation ultra rápida
  const debouncedTrigger = useDebounce(trigger, 100);

  // Resetear formulario
  useEffect(() => {
    if (open) {
      if (socio) {
        reset({
          nombre: socio.nombre || '',
          email: socio.email || '',
          estado: socio.estado || 'activo',
          estadoMembresia: socio.estadoMembresia as 'al_dia' | 'vencido' | 'pendiente' | undefined || 'al_dia',
          telefono: socio.telefono || '',
          dni: socio.dni || '',
          numeroSocio: socio.numeroSocio || '',
          montoCuota: socio.montoCuota || 0,
          direccion: socio.direccion || '',
          fechaNacimiento: timestampToDate(socio.fechaNacimiento),
          fechaVencimiento: timestampToDate(socio.fechaVencimiento),
        });
      } else {
        reset({
          nombre: '',
          email: '',
          estado: 'activo',
          estadoMembresia: 'al_dia',
          telefono: '',
          dni: '',
          numeroSocio: '',
          montoCuota: 0,
          direccion: '',
          fechaNacimiento: undefined,
          fechaVencimiento: undefined,
        });
      }
    }
  }, [open, socio, reset]);

  // Validación en tiempo real ultra optimizada
  const watchedFields = watch();
  useEffect(() => {
    if (open) {
      debouncedTrigger();
    }
  }, [watchedFields, debouncedTrigger, open]);

  // Manejar envío del formulario
  const onSubmit = useCallback(async (data: SocioFormInputs) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData: SocioFormData = {
        nombre: data.nombre,
        email: data.email,
        estado: data.estado,
        estadoMembresia: data.estadoMembresia,
        telefono: data.telefono,
        dni: data.dni,
        numeroSocio: data.numeroSocio,
        montoCuota: data.montoCuota,
        direccion: data.direccion,
        fechaNacimiento: data.fechaNacimiento,
        fechaVencimiento: data.fechaVencimiento,
        password: !isEditing ? data.password : undefined,
      };

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving socio:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSave, onClose, isEditing]);

  // Componente de campo compacto ultra optimizado
  const CompactField = React.memo(({ 
    name, 
    label, 
    type = 'text', 
    icon: Icon, 
    placeholder,
    required = false,
    options,
    ...props 
  }: {
    name: keyof SocioFormInputs;
    label: string;
    type?: string;
    icon?: React.ComponentType<any>;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    [key: string]: any;
  }) => {
    const error = errors[name];
    const hasError = !!error;
    const value = watch(name);
    const hasValue = value !== undefined && value !== '' && value !== 0;

    const fieldState = hasError ? 'error' : hasValue ? 'success' : 'default';
    
    const stateStyles = {
      error: 'ring-red-300 bg-red-50 text-red-900',
      success: 'ring-green-300 bg-green-50 text-green-900',
      default: 'ring-gray-200 bg-white text-gray-900'
    };

    const iconColors = {
      error: 'text-red-400',
      success: 'text-green-400',
      default: 'text-gray-400'
    };

    return (
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className={`h-4 w-4 ${iconColors[fieldState]}`} />
            </div>
          )}
          
          {options ? (
            <select
              {...register(name)}
              className={`
                block w-full rounded-lg border-0 py-2.5 shadow-sm ring-1 ring-inset transition-all duration-150
                ${Icon ? 'pl-9' : 'pl-3'} pr-8 text-sm
                ${stateStyles[fieldState]}
                focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none
              `}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25em 1.25em',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              {...register(name)}
              type={type}
              placeholder={placeholder}
              className={`
                block w-full rounded-lg border-0 py-2.5 shadow-sm ring-1 ring-inset transition-all duration-150
                ${Icon ? 'pl-9' : 'pl-3'} pr-9 text-sm
                ${stateStyles[fieldState]}
                focus:ring-2 focus:ring-blue-500 focus:outline-none
              `}
              {...props}
            />
          )}
          
          {hasValue && !hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          )}
        </div>
        
        {hasError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error?.message}
          </p>
        )}
      </div>
    );
  });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={shouldUseAnimations ? { opacity: 0 } : false}
            animate={shouldUseAnimations ? { opacity: 1 } : false}
            exit={shouldUseAnimations ? { opacity: 0 } : false}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal compacto */}
          <motion.div
            initial={shouldUseAnimations ? { opacity: 0, scale: 0.95, y: 20 } : false}
            animate={shouldUseAnimations ? { opacity: 1, scale: 1, y: 0 } : false}
            exit={shouldUseAnimations ? { opacity: 0, scale: 0.95, y: 20 } : false}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header compacto */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {isEditing ? 'Actualizar información del socio' : 'Crear nuevo miembro'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formulario compacto */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Información Personal
                  </h3>
                  
                  <CompactField
                    name="nombre"
                    label="Nombre Completo"
                    icon={User}
                    placeholder="Nombre completo"
                    required
                  />
                  
                  <CompactField
                    name="dni"
                    label="DNI"
                    icon={CreditCard}
                    placeholder="Número de documento"
                  />
                  
                  <CompactField
                    name="fechaNacimiento"
                    label="Fecha de Nacimiento"
                    type="date"
                    icon={Calendar}
                  />
                </div>

                {/* Contacto */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Contacto
                  </h3>
                  
                  <CompactField
                    name="email"
                    label="Email"
                    type="email"
                    icon={Mail}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                  
                  <CompactField
                    name="telefono"
                    label="Teléfono"
                    icon={Phone}
                    placeholder="+54 9 11 1234-5678"
                  />
                  
                  <CompactField
                    name="direccion"
                    label="Dirección"
                    icon={MapPin}
                    placeholder="Dirección completa"
                  />
                </div>

                {/* Membresía */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Membresía
                  </h3>
                  
                  <CompactField
                    name="estado"
                    label="Estado"
                    icon={Users}
                    required
                    options={[
                      { value: 'activo', label: '✅ Activo' },
                      { value: 'inactivo', label: '⏸️ Inactivo' },
                      { value: 'suspendido', label: '🚫 Suspendido' },
                      { value: 'pendiente', label: '⏳ Pendiente' },
                      { value: 'vencido', label: '⚠️ Vencido' }
                    ]}
                  />
                  
                  <CompactField
                    name="estadoMembresia"
                    label="Estado Membresía"
                    icon={Crown}
                    options={[
                      { value: 'al_dia', label: '💎 Al día' },
                      { value: 'vencido', label: '⚠️ Vencido' },
                      { value: 'pendiente', label: '⏳ Pendiente' }
                    ]}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <CompactField
                      name="numeroSocio"
                      label="N° Socio"
                      icon={Award}
                      placeholder="Número"
                    />
                    
                    <CompactField
                      name="montoCuota"
                      label="Cuota"
                      type="number"
                      icon={DollarSign}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <CompactField
                    name="fechaVencimiento"
                    label="Vencimiento"
                    type="date"
                    icon={Clock}
                  />
                </div>
              </div>

              {/* Acceso al Sistema - Solo para nuevos socios */}
              {!isEditing && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Acceso al Sistema
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <CompactField
                        name="password"
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        icon={Shield}
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <CompactField
                        name="confirmPassword"
                        label="Confirmar Contraseña"
                        type={showConfirmPassword ? 'text' : 'password'}
                        icon={Shield}
                        placeholder="Repite la contraseña"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={`
                    flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
                    ${isValid && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEditing ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {isEditing ? 'Actualizar' : 'Crear Socio'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};