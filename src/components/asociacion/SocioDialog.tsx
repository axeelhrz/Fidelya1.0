'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
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
  Award,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { SocioFormData, Socio } from '@/types/socio';
import { OptimizationUtils } from '@/lib/optimization-config';
import { useDebounce } from '@/hooks/useDebounce';

// Schema de validación ultra optimizado
const socioSchema = z.object({
  nombre: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios'),
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email muy largo'),
  password: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .optional(),
  confirmPassword: z.string().optional(),
  estado: z.enum(['activo', 'inactivo', 'suspendido', 'pendiente', 'vencido']),
  estadoMembresia: z.enum(['al_dia', 'vencido', 'pendiente']).optional(),
  telefono: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{0,20}$/, 'Formato de teléfono inválido')
    .optional(),
  dni: z.string()
    .regex(/^[0-9]{0,12}$/, 'Solo números, máximo 12 dígitos')
    .optional(),
  numeroSocio: z.string()
    .max(20, 'Máximo 20 caracteres')
    .optional(),
  montoCuota: z.number()
    .min(0, 'No puede ser negativo')
    .max(999999, 'Monto muy alto')
    .optional(),
  direccion: z.string()
    .max(200, 'Máximo 200 caracteres')
    .optional(),
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

// Configuración de pasos ultra moderna
const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Información Personal',
    subtitle: 'Datos básicos del socio',
    icon: User,
    color: 'from-violet-500 via-purple-500 to-indigo-500',
    bgPattern: 'bg-gradient-to-br from-violet-50 to-purple-50',
    accentColor: 'violet'
  },
  {
    id: 'contact',
    title: 'Contacto',
    subtitle: 'Información de contacto',
    icon: Mail,
    color: 'from-blue-500 via-cyan-500 to-teal-500',
    bgPattern: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    accentColor: 'blue'
  },
  {
    id: 'membership',
    title: 'Membresía',
    subtitle: 'Configuración de membresía',
    icon: Crown,
    color: 'from-amber-500 via-orange-500 to-red-500',
    bgPattern: 'bg-gradient-to-br from-amber-50 to-orange-50',
    accentColor: 'amber'
  },
  {
    id: 'access',
    title: 'Acceso',
    subtitle: 'Credenciales de acceso',
    icon: Shield,
    color: 'from-emerald-500 via-green-500 to-teal-500',
    bgPattern: 'bg-gradient-to-br from-emerald-50 to-green-50',
    accentColor: 'emerald'
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

// Componente de partículas flotantes para efectos visuales
const FloatingParticles = React.memo(() => {
  const particles = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 200,
            scale: 0
          }}
          animate={{
            x: Math.random() * 400,
            y: Math.random() * 200,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
});
FloatingParticles.displayName = 'FloatingParticles';

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
  const [fieldFocus, setFieldFocus] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');

  const isEditing = !!socio;
  const shouldUseAnimations = OptimizationUtils.shouldUseAnimations();
  const formRef = useRef<HTMLFormElement>(null);

  // Spring animations para transiciones fluidas
  const progressSpring = useSpring(currentStep / (FORM_STEPS.length - 1), {
    stiffness: 300,
    damping: 30
  });

  const progressWidth = useTransform(progressSpring, [0, 1], ['0%', '100%']);

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, touchedFields },
    watch,
    trigger,
    clearErrors
  } = useForm<SocioFormInputs>({
    resolver: zodResolver(socioSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
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

  // Debounced validation optimizada
  const debouncedTrigger = useDebounce(trigger, 150);
  const watchedFields = watch();

  // Resetear formulario con animación
  const resetFormWithAnimation = useCallback((socioData?: Socio) => {
    const resetData = socioData ? {
      nombre: socioData.nombre || '',
      email: socioData.email || '',
      estado: socioData.estado || 'activo',
      estadoMembresia: socioData.estadoMembresia as 'al_dia' | 'vencido' | 'pendiente' | undefined || 'al_dia',
      telefono: socioData.telefono || '',
      dni: socioData.dni || '',
      numeroSocio: socioData.numeroSocio || '',
      montoCuota: socioData.montoCuota || 0,
      direccion: socioData.direccion || '',
      fechaNacimiento: timestampToDate(socioData.fechaNacimiento),
      fechaVencimiento: timestampToDate(socioData.fechaVencimiento),
    } : {
      nombre: '',
      email: '',
      estado: 'activo' as const,
      estadoMembresia: 'al_dia' as const,
      telefono: '',
      dni: '',
      numeroSocio: '',
      montoCuota: 0,
      direccion: '',
      fechaNacimiento: undefined,
      fechaVencimiento: undefined,
    };

    reset(resetData);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    clearErrors();
  }, [reset, clearErrors]);

  // Resetear formulario cuando se abre/cierra o cambia el socio
  useEffect(() => {
    if (open) {
      resetFormWithAnimation(socio || undefined);
    }
  }, [open, socio, resetFormWithAnimation]);

  // Validación en tiempo real ultra optimizada
  useEffect(() => {
    if (open && Object.keys(touchedFields).length > 0) {
      const timeoutId = setTimeout(() => {
        debouncedTrigger();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedFields, debouncedTrigger, open, touchedFields]);

  // Manejar envío del formulario con animaciones
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
      
      // Animación de éxito
      if (shouldUseAnimations) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving socio:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSave, onClose, isEditing, shouldUseAnimations]);

  // Obtener campos para validar por paso
  const getFieldsForStep = useCallback((step: number): (keyof SocioFormInputs)[] => {
    switch (step) {
      case 0: return ['nombre', 'dni', 'fechaNacimiento'];
      case 1: return ['email', 'telefono', 'direccion'];
      case 2: return ['estado', 'estadoMembresia', 'numeroSocio', 'montoCuota', 'fechaVencimiento'];
      case 3: return isEditing ? [] : ['password', 'confirmPassword'];
      default: return [];
    }
  }, [isEditing]);

  // Verificar si el paso actual es válido
  const isCurrentStepValid = useMemo(() => {
    const fieldsToCheck = getFieldsForStep(currentStep);
    return fieldsToCheck.every(field => !errors[field]);
  }, [currentStep, errors, getFieldsForStep]);

  // Marcar paso como completado
  useEffect(() => {
    if (isCurrentStepValid && currentStep < FORM_STEPS.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  }, [isCurrentStepValid, currentStep]);

  // Navegación entre pasos con animaciones
  const nextStep = useCallback(async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < FORM_STEPS.length - 1) {
      setAnimationDirection('forward');
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, trigger, getFieldsForStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setAnimationDirection('backward');
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Componente de campo de entrada ultra optimizado
  const InputField = React.memo(({ 
    name, 
    label, 
    type = 'text', 
    icon: Icon, 
    placeholder,
    required = false,
    ...props 
  }: {
    name: keyof SocioFormInputs;
    label: string;
    type?: string;
    icon?: React.ComponentType<{ className?: string }>;
    placeholder?: string;
    required?: boolean;
    [key: string]: unknown;
  }) => {
    const error = errors[name];
    const hasError = !!error;
    const value = watch(name);
    const hasValue = value !== undefined && value !== '' && value !== 0;
    const isFocused = fieldFocus === name;

    const fieldState = hasError ? 'error' : hasValue ? 'success' : isFocused ? 'focused' : 'default';

    const fieldColors = {
      error: 'ring-red-300 bg-red-50 text-red-900 placeholder:text-red-400',
      success: 'ring-green-300 bg-green-50 text-green-900 placeholder:text-green-400',
      focused: 'ring-blue-400 bg-blue-50 text-blue-900 placeholder:text-blue-400',
      default: 'ring-gray-200 bg-white text-gray-900 placeholder:text-gray-400'
    };

    const iconColors = {
      error: 'text-red-400',
      success: 'text-green-400',
      focused: 'text-blue-400',
      default: 'text-gray-400'
    };

    return (
      <motion.div
        layout
        initial={shouldUseAnimations ? { opacity: 0, y: 20 } : false}
        animate={shouldUseAnimations ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="space-y-2"
      >
        <motion.label 
          layout
          className="block text-sm font-semibold text-gray-700"
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
        
        <motion.div 
          layout
          className="relative group"
        >
          {Icon && (
            <motion.div 
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"
              animate={{ scale: isFocused ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className={`h-5 w-5 transition-all duration-200 ${iconColors[fieldState]}`} />
            </motion.div>
          )}
          
          <motion.input
            {...register(name)}
            type={type}
            placeholder={placeholder}
            onFocus={() => setFieldFocus(name)}
            onBlur={() => setFieldFocus(null)}
            className={`
              block w-full rounded-2xl border-0 py-4 shadow-sm ring-2 ring-inset transition-all duration-300
              ${Icon ? 'pl-12' : 'pl-4'} pr-12
              ${fieldColors[fieldState]}
              focus:ring-4 focus:outline-none
              group-hover:shadow-md
              ${isFocused ? 'transform scale-[1.02]' : ''}
            `}
            {...props}
          />
          
          <AnimatePresence>
            {hasValue && !hasError && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={shouldUseAnimations ? { opacity: 0, height: 0, y: -10 } : false}
              animate={shouldUseAnimations ? { opacity: 1, height: 'auto', y: 0 } : false}
              exit={shouldUseAnimations ? { opacity: 0, height: 0, y: -10 } : undefined}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error?.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  });
  InputField.displayName = 'InputField';

  // Componente de selector ultra optimizado
  const SelectField = React.memo(({ 
    name, 
    label, 
    options, 
    icon: Icon,
    required = false 
  }: {
    name: keyof SocioFormInputs;
    label: string;
    options: { value: string; label: string; icon?: React.ComponentType<unknown> }[];
    icon?: React.ComponentType<{ className?: string }>;
    required?: boolean;
  }) => {
    const error = errors[name];
    const hasError = !!error;
    const value = watch(name);
    const isFocused = fieldFocus === name;

    const fieldState = hasError ? 'error' : value ? 'success' : isFocused ? 'focused' : 'default';

    const fieldColors = {
      error: 'ring-red-300 bg-red-50 text-red-900',
      success: 'ring-green-300 bg-green-50 text-green-900',
      focused: 'ring-blue-400 bg-blue-50 text-blue-900',
      default: 'ring-gray-200 bg-white text-gray-900'
    };

    return (
      <motion.div
        layout
        initial={shouldUseAnimations ? { opacity: 0, y: 20 } : false}
        animate={shouldUseAnimations ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="space-y-2"
      >
        <motion.label 
          layout
          className="block text-sm font-semibold text-gray-700"
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
        
        <motion.div 
          layout
          className="relative group"
        >
          {Icon && (
            <motion.div 
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"
              animate={{ scale: isFocused ? 1.1 : 1 }}
            >
              <Icon className={`h-5 w-5 transition-colors duration-200 ${
                hasError ? 'text-red-400' : value ? 'text-green-400' : 'text-gray-400'
              }`} />
            </motion.div>
          )}
          
          <motion.select
            {...register(name)}
            onFocus={() => setFieldFocus(name)}
            onBlur={() => setFieldFocus(null)}
            className={`
              block w-full rounded-2xl border-0 py-4 shadow-sm ring-2 ring-inset transition-all duration-300
              ${Icon ? 'pl-12' : 'pl-4'} pr-12
              ${fieldColors[fieldState]}
              focus:ring-4 focus:outline-none appearance-none
              group-hover:shadow-md
              ${isFocused ? 'transform scale-[1.02]' : ''}
            `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em 1.5em',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
        </motion.div>
        
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={shouldUseAnimations ? { opacity: 0, height: 0, y: -10 } : false}
              animate={shouldUseAnimations ? { opacity: 1, height: 'auto', y: 0 } : false}
              exit={shouldUseAnimations ? { opacity: 0, height: 0, y: -10 } : undefined}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error?.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  });
  SelectField.displayName = 'SelectField';

  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    const stepVariants = {
      enter: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? 300 : -300,
        opacity: 0,
        scale: 0.8
      }),
      center: {
        x: 0,
        opacity: 1,
        scale: 1
      },
      exit: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? -300 : 300,
        opacity: 0,
        scale: 0.8
      })
    };

    const content = (() => {
      switch (currentStep) {
        case 0: // Información Personal
          return (
            <div className="space-y-8">
              <InputField
                name="nombre"
                label="Nombre Completo"
                icon={User}
                placeholder="Ingresa el nombre completo"
                required
              />
              <InputField
                name="dni"
                label="DNI"
                icon={CreditCard}
                placeholder="Número de documento"
              />
              <InputField
                name="fechaNacimiento"
                label="Fecha de Nacimiento"
                type="date"
                icon={Calendar}
              />
            </div>
          );

        case 1: // Contacto
          return (
            <div className="space-y-8">
              <InputField
                name="email"
                label="Email"
                type="email"
                icon={Mail}
                placeholder="correo@ejemplo.com"
                required
              />
              <InputField
                name="telefono"
                label="Teléfono"
                icon={Phone}
                placeholder="+54 9 11 1234-5678"
              />
              <InputField
                name="direccion"
                label="Dirección"
                icon={MapPin}
                placeholder="Dirección completa"
              />
            </div>
          );

        case 2: // Membresía
          return (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
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
                <SelectField
                  name="estadoMembresia"
                  label="Estado de Membresía"
                  icon={Crown}
                  options={[
                    { value: 'al_dia', label: '💎 Al día' },
                    { value: 'vencido', label: '⚠️ Vencido' },
                    { value: 'pendiente', label: '⏳ Pendiente' }
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="numeroSocio"
                  label="Número de Socio"
                  icon={Award}
                  placeholder="Número único"
                />
                <InputField
                  name="montoCuota"
                  label="Monto de Cuota"
                  type="number"
                  icon={DollarSign}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <InputField
                name="fechaVencimiento"
                label="Fecha de Vencimiento"
                type="date"
                icon={Clock}
              />
            </div>
          );

        case 3: // Acceso al Sistema
          if (isEditing) {
            return (
              <motion.div
                initial={shouldUseAnimations ? { opacity: 0, scale: 0.9 } : false}
                animate={shouldUseAnimations ? { opacity: 1, scale: 1 } : false}
                className="text-center py-16"
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Modo Edición
                </h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  La contraseña se mantiene sin cambios. Para modificarla, el socio debe usar la opción de recuperación de contraseña.
                </p>
                <motion.div
                  className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-blue-700">
                    💡 Los cambios se aplicarán inmediatamente al guardar
                  </p>
                </motion.div>
              </motion.div>
            );
          }

          return (
            <div className="space-y-8">
              <div className="relative">
                <InputField
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  icon={Shield}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-11 text-gray-400 hover:text-gray-600 transition-colors z-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </div>
              <div className="relative">
                <InputField
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={Shield}
                  placeholder="Repite la contraseña"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-11 text-gray-400 hover:text-gray-600 transition-colors z-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </div>
            </div>
          );

        default:
          return null;
      }
    })();

    return (
      <motion.div
        key={currentStep}
        custom={animationDirection}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 }
        }}
        className="min-h-[400px] flex flex-col justify-center"
      >
        {content}
      </motion.div>
    );
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop ultra moderno */}
          <motion.div
            initial={shouldUseAnimations ? { opacity: 0 } : false}
            animate={shouldUseAnimations ? { opacity: 1 } : false}
            exit={shouldUseAnimations ? { opacity: 0 } : false}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={shouldUseAnimations ? { 
                opacity: 0, 
                scale: 0.9, 
                y: 50,
                rotateX: -15 
              } : false}
              animate={shouldUseAnimations ? { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotateX: 0 
              } : false}
              exit={shouldUseAnimations ? { 
                opacity: 0, 
                scale: 0.9, 
                y: 50,
                rotateX: 15 
              } : false}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1],
                scale: { type: "spring", stiffness: 300, damping: 30 }
              }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Header ultra moderno con gradiente dinámico */}
              <div className={`relative bg-gradient-to-r ${FORM_STEPS[currentStep].color} px-8 py-10 text-white overflow-hidden`}>
                <FloatingParticles />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      className="flex items-center gap-4"
                      layout
                    >
                      <motion.div 
                        className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {React.createElement(FORM_STEPS[currentStep].icon, { 
                          className: "w-8 h-8" 
                        })}
                      </motion.div>
                      <div>
                        <motion.h2 
                          className="text-3xl font-bold"
                          layout
                        >
                          {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                        </motion.h2>
                        <motion.p 
                          className="text-white/90 text-lg"
                          layout
                        >
                          {FORM_STEPS[currentStep].subtitle}
                        </motion.p>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={onClose}
                      className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {/* Indicador de progreso ultra moderno */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {FORM_STEPS.map((step, index) => (
                        <motion.div 
                          key={step.id} 
                          className="flex items-center"
                          layout
                        >
                          <motion.div 
                            className={`
                              w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300
                              ${index <= currentStep 
                                ? 'bg-white text-gray-900 shadow-lg' 
                                : 'bg-white/20 text-white/60'
                              }
                            `}
                            whileHover={{ scale: 1.05 }}
                            animate={{ 
                              scale: index === currentStep ? 1.1 : 1,
                              rotate: completedSteps.has(index) ? 360 : 0
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {completedSteps.has(index) ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              index + 1
                            )}
                          </motion.div>
                          {index < FORM_STEPS.length - 1 && (
                            <motion.div 
                              className={`
                                w-16 h-1 mx-3 rounded-full transition-all duration-500
                                ${index < currentStep ? 'bg-white' : 'bg-white/20'}
                              `}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: index < currentStep ? 1 : 0 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Barra de progreso fluida */}
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        style={{ width: progressWidth }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Efectos decorativos mejorados */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              {/* Contenido del formulario */}
              <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-8">
                <div className="mb-10">
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 mb-6"
                    layout
                  >
                    {FORM_STEPS[currentStep].title}
                  </motion.h3>
                  
                  <AnimatePresence mode="wait">
                    {renderStepContent()}
                  </AnimatePresence>
                </div>

                {/* Botones de navegación ultra modernos */}
                <motion.div 
                  className="flex items-center justify-between pt-8 border-t border-gray-200"
                  layout
                >
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`
                      flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200
                      ${currentStep === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                      }
                    `}
                    whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                    whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Anterior
                  </motion.button>

                  <div className="flex items-center gap-4">
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-2xl font-semibold transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancelar
                    </motion.button>

                    {currentStep < FORM_STEPS.length - 1 ? (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!isCurrentStepValid}
                        className={`
                          flex items-center gap-3 px-8 py-3 rounded-2xl font-semibold transition-all duration-200
                          ${isCurrentStepValid
                            ? `bg-gradient-to-r ${FORM_STEPS[currentStep].color} text-white hover:shadow-xl hover:scale-105 shadow-lg`
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }
                        `}
                        whileHover={isCurrentStepValid ? { scale: 1.05 } : {}}
                        whileTap={isCurrentStepValid ? { scale: 0.95 } : {}}
                      >
                        Siguiente
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className={`
                          flex items-center gap-3 px-8 py-3 rounded-2xl font-semibold transition-all duration-200
                          ${isValid && !isSubmitting
                            ? `bg-gradient-to-r ${FORM_STEPS[currentStep].color} text-white hover:shadow-xl hover:scale-105 shadow-lg`
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }
                        `}
                        whileHover={isValid && !isSubmitting ? { scale: 1.05 } : {}}
                        whileTap={isValid && !isSubmitting ? { scale: 0.95 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isEditing ? 'Actualizando...' : 'Creando...'}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            {isEditing ? 'Actualizar Socio' : 'Crear Socio'}
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};