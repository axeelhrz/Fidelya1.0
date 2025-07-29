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
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Crown,
  DollarSign,
  Clock,
  Users,
  Award,
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

// Configuración de pasos minimalista
const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Información Personal',
    subtitle: 'Datos básicos del socio',
    icon: User,
    fields: ['nombre', 'dni', 'fechaNacimiento']
  },
  {
    id: 'contact',
    title: 'Contacto',
    subtitle: 'Información de contacto',
    icon: Mail,
    fields: ['email', 'telefono', 'direccion']
  },
  {
    id: 'membership',
    title: 'Membresía',
    subtitle: 'Configuración de membresía',
    icon: Crown,
    fields: ['estado', 'estadoMembresia', 'numeroSocio', 'montoCuota', 'fechaVencimiento']
  },
  {
    id: 'access',
    title: 'Acceso',
    subtitle: 'Credenciales de acceso',
    icon: Shield,
    fields: ['password', 'confirmPassword']
  }
];

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
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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
  const debouncedTrigger = useDebounce(trigger, 50);

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
      setCurrentStep(0);
      setCompletedSteps(new Set());
    }
  }, [open, socio, reset]);

  // Validación en tiempo real ultra optimizada
  const watchedFields = watch();
  useEffect(() => {
    if (open) {
      debouncedTrigger();
    }
  }, [watchedFields, debouncedTrigger, open]);

  // Verificar si el paso actual es válido
  const isCurrentStepValid = useMemo(() => {
    const currentStepFields = FORM_STEPS[currentStep].fields;
    if (isEditing && currentStep === 3) return true; // Skip password validation for editing
    return currentStepFields.every(field => !errors[field as keyof SocioFormInputs]);
  }, [currentStep, errors, isEditing]);

  // Marcar paso como completado
  useEffect(() => {
    if (isCurrentStepValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  }, [isCurrentStepValid, currentStep]);

  // Navegación entre pasos
  const nextStep = useCallback(async () => {
    const fieldsToValidate = FORM_STEPS[currentStep].fields;
    const isStepValid = await trigger(fieldsToValidate as (keyof SocioFormInputs)[]);
    
    if (isStepValid && currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, trigger]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

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

  // Componente de campo ultra optimizado
  const Field = React.memo(({ 
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
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    [key: string]: unknown;
  }) => {
    const error = errors[name];
    const hasError = !!error;
    const value = watch(name);
    const hasValue = value !== undefined && value !== '' && value !== 0;

    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative group">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Icon className={`h-4 w-4 transition-colors duration-200 ${
                hasError ? 'text-red-400' : hasValue ? 'text-emerald-500' : 'text-slate-400'
              }`} />
            </div>
          )}
          
          {options ? (
            <select
              {...register(name)}
              className={`
                block w-full rounded-xl border-0 py-2.5 shadow-sm ring-1 ring-inset transition-all duration-200
                ${Icon ? 'pl-10' : 'pl-3'} pr-8 text-sm
                ${hasError 
                  ? 'ring-red-300 bg-red-50/50 text-red-900' 
                  : hasValue
                  ? 'ring-emerald-300 bg-emerald-50/50 text-emerald-900'
                  : 'ring-slate-200 bg-white text-slate-900'
                }
                focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none
                group-hover:ring-slate-300
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
                block w-full rounded-xl border-0 py-2.5 shadow-sm ring-1 ring-inset transition-all duration-200
                ${Icon ? 'pl-10' : 'pl-3'} pr-9 text-sm
                ${hasError 
                  ? 'ring-red-300 bg-red-50/50 text-red-900 placeholder:text-red-400' 
                  : hasValue
                  ? 'ring-emerald-300 bg-emerald-50/50 text-emerald-900 placeholder:text-emerald-400'
                  : 'ring-slate-200 bg-white text-slate-900 placeholder:text-slate-400'
                }
                focus:ring-2 focus:ring-blue-500 focus:outline-none
                group-hover:ring-slate-300
              `}
              {...props}
            />
          )}
          
          {hasValue && !hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
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

  Field.displayName = "Field";

  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Información Personal
        return (
          <div className="space-y-6">
            <Field
              name="nombre"
              label="Nombre Completo"
              icon={User}
              placeholder="Nombre completo del socio"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                name="dni"
                label="DNI"
                icon={CreditCard}
                placeholder="Número de documento"
              />
              <Field
                name="fechaNacimiento"
                label="Fecha de Nacimiento"
                type="date"
                icon={Calendar}
              />
            </div>
          </div>
        );

      case 1: // Contacto
        return (
          <div className="space-y-6">
            <Field
              name="email"
              label="Email"
              type="email"
              icon={Mail}
              placeholder="correo@ejemplo.com"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                name="telefono"
                label="Teléfono"
                icon={Phone}
                placeholder="+54 9 11 1234-5678"
              />
              <Field
                name="direccion"
                label="Dirección"
                icon={MapPin}
                placeholder="Dirección completa"
              />
            </div>
          </div>
        );

      case 2: // Membresía
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                name="estado"
                label="Estado"
                icon={Users}
                required
                options={[
                  { value: 'activo', label: 'Activo' },
                  { value: 'inactivo', label: 'Inactivo' },
                  { value: 'suspendido', label: 'Suspendido' },
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'vencido', label: 'Vencido' }
                ]}
              />
              <Field
                name="estadoMembresia"
                label="Estado Membresía"
                icon={Crown}
                options={[
                  { value: 'al_dia', label: 'Al día' },
                  { value: 'vencido', label: 'Vencido' },
                  { value: 'pendiente', label: 'Pendiente' }
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                name="numeroSocio"
                label="Número de Socio"
                icon={Award}
                placeholder="Número único"
              />
              <Field
                name="montoCuota"
                label="Cuota"
                type="number"
                icon={DollarSign}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <Field
                name="fechaVencimiento"
                label="Vencimiento"
                type="date"
                icon={Clock}
              />
            </div>
          </div>
        );

      case 3: // Acceso al Sistema
        if (isEditing) {
          return (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Modo Edición
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                La contraseña se mantiene sin cambios. Para modificarla, el socio debe usar la opción de recuperación de contraseña.
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="relative">
              <Field
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
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors z-20"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Field
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
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors z-20"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={shouldUseAnimations ? { opacity: 0, scale: 0.96, y: 8 } : false}
            animate={shouldUseAnimations ? { opacity: 1, scale: 1, y: 0 } : false}
            exit={shouldUseAnimations ? { opacity: 0, scale: 0.96, y: 8 } : false}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header minimalista */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {React.createElement(FORM_STEPS[currentStep].icon, { 
                      className: "w-5 h-5 text-slate-600" 
                    })}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {FORM_STEPS[currentStep].subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Indicador de progreso minimalista */}
              <div className="flex items-center gap-2 mt-4">
                {FORM_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200
                      ${index <= currentStep 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-slate-200 text-slate-400'
                      }
                    `}>
                      {completedSteps.has(index) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < FORM_STEPS.length - 1 && (
                      <div className={`
                        w-8 h-0.5 mx-2 transition-all duration-200
                        ${index < currentStep ? 'bg-blue-500' : 'bg-slate-200'}
                      `} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contenido del formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-base font-medium text-slate-900 mb-4">
                  {FORM_STEPS[currentStep].title}
                </h3>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={shouldUseAnimations ? { opacity: 0, x: 10 } : false}
                    animate={shouldUseAnimations ? { opacity: 1, x: 0 } : false}
                    exit={shouldUseAnimations ? { opacity: 0, x: -10 } : false}
                    transition={{ duration: 0.15 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Botones de navegación */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${currentStep === 0
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>

                  {currentStep < FORM_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isCurrentStepValid}
                      className={`
                        flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
                        ${isCurrentStepValid
                          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }
                      `}
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className={`
                        flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
                        ${isValid && !isSubmitting
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
