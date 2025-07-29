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
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  UserPlus,
  Lock,
  Building,
  Shield,
  Sparkles
} from 'lucide-react';
import { Socio, SocioFormData } from '@/types/socio';
import { Timestamp } from 'firebase/firestore';
import { useDebounce } from '@/hooks/useDebounce';
import { OptimizationUtils } from '@/lib/optimization-config';

// Esquema de validación mejorado
const socioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  confirmPassword: z.string().optional(),
  estado: z.enum(['activo', 'inactivo', 'suspendido', 'pendiente', 'vencido']),
  estadoMembresia: z.enum(['al_dia', 'vencido', 'pendiente']).optional(),
  telefono: z.string().optional(),
  dni: z.string().optional(),
  numeroSocio: z.string().optional(),
  montoCuota: z.number().min(0, 'El monto debe ser mayor o igual a 0').optional(),
  direccion: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  fechaVencimiento: z.string().optional(),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type SocioFormInputs = z.infer<typeof socioSchema>;

interface SocioDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SocioFormData) => Promise<void>;
  socio?: Socio | null;
  loading?: boolean;
}

// Pasos del formulario con mejor organización
const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Información Personal',
    subtitle: 'Datos básicos del socio',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    fields: ['nombre', 'email', 'dni', 'fechaNacimiento']
  },
  {
    id: 'contact',
    title: 'Contacto & Ubicación',
    subtitle: 'Información de contacto',
    icon: Phone,
    color: 'from-green-500 to-emerald-500',
    fields: ['telefono', 'direccion']
  },
  {
    id: 'membership',
    title: 'Membresía',
    subtitle: 'Configuración de membresía',
    icon: Building,
    color: 'from-purple-500 to-violet-500',
    fields: ['numeroSocio', 'montoCuota', 'fechaVencimiento', 'estadoMembresia']
  },
  {
    id: 'access',
    title: 'Acceso & Seguridad',
    subtitle: 'Configuración de acceso',
    icon: Shield,
    color: 'from-orange-500 to-red-500',
    fields: ['password', 'confirmPassword', 'estado']
  }
];

// Componente de campo mejorado y profesional
const ProfessionalFormField: React.FC<{
  name: string;
  label: string;
  type?: string;
  icon: React.ElementType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  register: any;
  errors: any;
  watch: any;
  description?: string;
}> = React.memo(({ name, label, type = 'text', icon: Icon, placeholder, required, options, register, errors, watch, description }) => {
  const value = watch(name);
  const hasError = !!errors[name];
  const hasValue = value && value !== '';

  const baseClasses = `
    w-full px-4 py-3.5 pl-12 rounded-xl border-2 transition-all duration-300
    bg-white/80 backdrop-blur-sm font-medium text-gray-900 placeholder-gray-500
    focus:outline-none focus:ring-4 focus:ring-opacity-20
  `;

  const stateClasses = hasError 
    ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
    : hasValue 
      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400';

  const fieldClasses = `${baseClasses} ${stateClasses}`;

  if (options) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gray-600 mb-2">{description}</p>
        )}
        <div className="relative group">
          <Icon className={`absolute left-3.5 top-4 w-5 h-5 transition-colors duration-300 ${
            hasError ? 'text-red-500' : hasValue ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-600'
          }`} />
          <select {...register(name)} className={fieldClasses}>
            <option value="">Seleccionar...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasValue && !hasError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute right-3.5 top-4"
            >
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          )}
        </div>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors[name]?.message}</span>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-600 mb-2">{description}</p>
      )}
      <div className="relative group">
        <Icon className={`absolute left-3.5 top-4 w-5 h-5 transition-colors duration-300 ${
          hasError ? 'text-red-500' : hasValue ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-600'
        }`} />
        <input
          {...register(name, { 
            valueAsNumber: type === 'number',
            setValueAs: (value) => {
              if (type === 'number') return value === '' ? 0 : Number(value);
              return value;
            }
          })}
          type={type}
          placeholder={placeholder}
          className={fieldClasses}
        />
        {hasValue && !hasError && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3.5 top-4"
          >
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </motion.div>
        )}
      </div>
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors[name]?.message}</span>
        </motion.div>
      )}
    </div>
  );
});

ProfessionalFormField.displayName = 'ProfessionalFormField';

// Componente principal mejorado
export const SocioDialog: React.FC<SocioDialogProps> = ({
  open,
  onClose,
  onSave,
  socio,
  loading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEditing = !!socio;
  const shouldUseAnimations = OptimizationUtils.shouldUseAnimations();
  const currentStepData = FORM_STEPS[currentStep];

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
      fechaNacimiento: '',
      fechaVencimiento: '',
    }
  });

  // Validación debounced
  const debouncedTrigger = useDebounce(trigger, 300);

  // Función para convertir Date/Timestamp a string para input date
  const formatDateForInput = (date: Date | Timestamp | undefined): string => {
    if (!date) return '';
    
    let jsDate: Date;
    if (date instanceof Timestamp) {
      jsDate = date.toDate();
    } else if (date instanceof Date) {
      jsDate = date;
    } else {
      return '';
    }
    
    return jsDate.toISOString().split('T')[0];
  };

  // Resetear formulario
  useEffect(() => {
    if (open) {
      if (socio) {
        reset({
          nombre: socio.nombre || '',
          email: socio.email || '',
          estado: socio.estado || 'activo',
          estadoMembresia: socio.estadoMembresia || 'al_dia',
          telefono: socio.telefono || '',
          dni: socio.dni || '',
          numeroSocio: socio.numeroSocio || '',
          montoCuota: socio.montoCuota || 0,
          direccion: socio.direccion || '',
          fechaNacimiento: formatDateForInput(socio.fechaNacimiento),
          fechaVencimiento: formatDateForInput(socio.fechaVencimiento),
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
          fechaNacimiento: '',
          fechaVencimiento: '',
        });
      }
      setCurrentStep(0);
    }
  }, [open, socio, reset]);

  // Validación en tiempo real
  const watchedFields = watch();
  useEffect(() => {
    if (open) {
      debouncedTrigger();
    }
  }, [watchedFields, debouncedTrigger, open]);

  // Verificar si el paso actual es válido
  const isCurrentStepValid = useMemo(() => {
    const currentStepFields = FORM_STEPS[currentStep]?.fields || [];
    return currentStepFields.every(field => !errors[field as keyof typeof errors]);
  }, [currentStep, errors]);

  // Función de envío
  const onSubmit = useCallback(async (data: SocioFormInputs) => {
    try {
      setIsSubmitting(true);
      
      const formData: SocioFormData = {
        nombre: data.nombre,
        email: data.email,
        estado: data.estado,
        estadoMembresia: data.estadoMembresia,
        telefono: data.telefono || '',
        dni: data.dni || '',
        numeroSocio: data.numeroSocio || '',
        montoCuota: data.montoCuota || 0,
        direccion: data.direccion || '',
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
        fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : undefined,
        password: !isEditing ? data.password : undefined,
      };

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving socio:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSave, onClose, isEditing]);

  // Navegación entre pasos
  const nextStep = useCallback(async () => {
    const currentStepFields = FORM_STEPS[currentStep]?.fields || [];
    const isValid = await trigger(currentStepFields as any);
    
    if (isValid && currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, trigger]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Renderizar contenido del paso
  const renderStepContent = () => {
    const step = FORM_STEPS[currentStep];
    
    switch (step.id) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfessionalFormField
              name="nombre"
              label="Nombre Completo"
              icon={User}
              placeholder="Ej: Juan Carlos Pérez"
              required
              register={register}
              errors={errors}
              watch={watch}
              description="Nombre y apellido del socio"
            />
            <ProfessionalFormField
              name="email"
              label="Correo Electrónico"
              type="email"
              icon={Mail}
              placeholder="correo@ejemplo.com"
              required
              register={register}
              errors={errors}
              watch={watch}
              description="Email para acceso al sistema"
            />
            <ProfessionalFormField
              name="dni"
              label="DNI/Documento"
              icon={CreditCard}
              placeholder="12.345.678"
              register={register}
              errors={errors}
              watch={watch}
              description="Documento de identidad"
            />
            <ProfessionalFormField
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              icon={Calendar}
              register={register}
              errors={errors}
              watch={watch}
              description="Fecha de nacimiento del socio"
            />
          </div>
        );

      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfessionalFormField
              name="telefono"
              label="Teléfono"
              type="tel"
              icon={Phone}
              placeholder="+54 9 11 1234-5678"
              register={register}
              errors={errors}
              watch={watch}
              description="Número de contacto principal"
            />
            <div className="md:col-span-2">
              <ProfessionalFormField
                name="direccion"
                label="Dirección"
                icon={MapPin}
                placeholder="Calle, número, ciudad, provincia"
                register={register}
                errors={errors}
                watch={watch}
                description="Dirección completa del socio"
              />
            </div>
          </div>
        );

      case 'membership':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfessionalFormField
              name="numeroSocio"
              label="Número de Socio"
              icon={CreditCard}
              placeholder="SOC-001"
              register={register}
              errors={errors}
              watch={watch}
              description="Identificador único del socio"
            />
            <ProfessionalFormField
              name="montoCuota"
              label="Monto de Cuota"
              type="number"
              icon={CreditCard}
              placeholder="0"
              register={register}
              errors={errors}
              watch={watch}
              description="Cuota mensual en pesos"
            />
            <ProfessionalFormField
              name="fechaVencimiento"
              label="Fecha de Vencimiento"
              type="date"
              icon={Calendar}
              register={register}
              errors={errors}
              watch={watch}
              description="Fecha de vencimiento de la membresía"
            />
            <ProfessionalFormField
              name="estadoMembresia"
              label="Estado de Membresía"
              icon={Building}
              options={[
                { value: 'al_dia', label: 'Al día' },
                { value: 'vencido', label: 'Vencido' },
                { value: 'pendiente', label: 'Pendiente' }
              ]}
              register={register}
              errors={errors}
              watch={watch}
              description="Estado actual de la membresía"
            />
          </div>
        );

      case 'access':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEditing && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Contraseña <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Contraseña para acceso al sistema</p>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-4 w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:ring-opacity-20 focus:outline-none bg-white/80 backdrop-blur-sm font-medium text-gray-900 placeholder-gray-500 hover:border-gray-400 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.password.message}</span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Confirmar Contraseña <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Repetir la contraseña anterior</p>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-4 w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repetir contraseña"
                      className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:ring-opacity-20 focus:outline-none bg-white/80 backdrop-blur-sm font-medium text-gray-900 placeholder-gray-500 hover:border-gray-400 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.confirmPassword.message}</span>
                    </motion.div>
                  )}
                </div>
              </>
            )}
            
            <div className={!isEditing ? "md:col-span-2" : ""}>
              <ProfessionalFormField
                name="estado"
                label="Estado del Socio"
                icon={Shield}
                options={[
                  { value: 'activo', label: 'Activo' },
                  { value: 'inactivo', label: 'Inactivo' },
                  { value: 'suspendido', label: 'Suspendido' },
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'vencido', label: 'Vencido' }
                ]}
                required
                register={register}
                errors={errors}
                watch={watch}
                description="Estado actual del socio en el sistema"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!mounted) return null;

  // Animaciones optimizadas
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          variants={shouldUseAnimations ? backdropVariants : undefined}
          initial={shouldUseAnimations ? "hidden" : undefined}
          animate={shouldUseAnimations ? "visible" : undefined}
          exit={shouldUseAnimations ? "hidden" : undefined}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop profesional */}
          <motion.div
            initial={shouldUseAnimations ? { opacity: 0 } : undefined}
            animate={shouldUseAnimations ? { opacity: 1 } : undefined}
            exit={shouldUseAnimations ? { opacity: 0 } : undefined}
            onClick={onClose}
            className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-md"
          />

          {/* Modal principal */}
          <motion.div
            variants={shouldUseAnimations ? modalVariants : undefined}
            initial={shouldUseAnimations ? "hidden" : undefined}
            animate={shouldUseAnimations ? "visible" : undefined}
            exit={shouldUseAnimations ? "hidden" : undefined}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
              {/* Header profesional con gradiente dinámico */}
              <div className={`bg-gradient-to-r ${currentStepData?.color || 'from-blue-600 to-purple-600'} p-8 relative overflow-hidden`}>
                {/* Patrón de fondo sutil */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />
                </div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30"
                    >
                      <UserPlus className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-white"
                      >
                        {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/90 font-medium"
                      >
                        {currentStepData?.subtitle}
                      </motion.p>
                    </div>
                  </div>
                  
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-200 border border-white/30"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                {/* Progress bar mejorado */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white/90">
                      Paso {currentStep + 1} de {FORM_STEPS.length}
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {Math.round(((currentStep + 1) / FORM_STEPS.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-white h-2 rounded-full shadow-lg"
                    />
                  </div>
                </motion.div>

                {/* Navegación de pasos mejorada */}
                <div className="flex items-center justify-center mt-6 gap-3">
                  {FORM_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCurrent = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                          isCurrent
                            ? 'bg-white text-blue-600 scale-110 shadow-lg border-white'
                            : isCompleted
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                            : 'bg-white/20 text-white/60 border-white/30 backdrop-blur-sm'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Contenido del formulario */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <motion.div
                  key={currentStep}
                  initial={shouldUseAnimations ? { opacity: 0, x: 20 } : undefined}
                  animate={shouldUseAnimations ? { opacity: 1, x: 0 } : undefined}
                  exit={shouldUseAnimations ? { opacity: 0, x: -20 } : undefined}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${currentStepData?.color} flex items-center justify-center`}>
                        <currentStepData.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {currentStepData?.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {currentStepData?.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {renderStepContent()}
                </motion.div>

                {/* Navegación inferior mejorada */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 shadow-sm'
                    }`}
                    whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
                    whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </motion.button>

                  <div className="flex items-center gap-3">
                    {currentStep === FORM_STEPS.length - 1 ? (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting || loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            {isEditing ? 'Actualizar Socio' : 'Crear Socio'}
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!isCurrentStepValid}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                          isCurrentStepValid
                            ? `bg-gradient-to-r ${currentStepData?.color} text-white hover:shadow-xl hover:scale-105`
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        whileHover={isCurrentStepValid ? { scale: 1.02 } : {}}
                        whileTap={isCurrentStepValid ? { scale: 0.98 } : {}}
                      >
                        Siguiente
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SocioDialog;