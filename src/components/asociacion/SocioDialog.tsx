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
  Lock
} from 'lucide-react';
import { Socio, SocioFormData } from '@/types/socio';
import { Timestamp } from 'firebase/firestore';
import { useDebounce } from '@/hooks/useDebounce';
import { OptimizationUtils } from '@/lib/optimization-config';

// Esquema de validación
const socioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
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

// Pasos del formulario
const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Información Personal',
    icon: User,
    fields: ['nombre', 'email', 'dni', 'fechaNacimiento']
  },
  {
    id: 'contact',
    title: 'Contacto',
    icon: Phone,
    fields: ['telefono', 'direccion']
  },
  {
    id: 'membership',
    title: 'Membresía',
    icon: CreditCard,
    fields: ['numeroSocio', 'montoCuota', 'fechaVencimiento', 'estadoMembresia']
  },
  {
    id: 'access',
    title: 'Acceso',
    icon: Lock,
    fields: ['password', 'confirmPassword', 'estado']
  }
];

// Componente de campo optimizado
const FormField: React.FC<{
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
}> = React.memo(({ name, label, type = 'text', icon: Icon, placeholder, required, options, register, errors, watch }) => {
  const value = watch(name);
  const hasError = !!errors[name];
  const hasValue = value && value !== '';

  const fieldClasses = `
    w-full px-4 py-3 pl-12 rounded-lg border transition-colors duration-200
    ${hasError 
      ? 'border-red-400 focus:border-red-500' 
      : hasValue 
        ? 'border-green-400 focus:border-green-500'
        : 'border-gray-300 focus:border-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-20
    ${hasError ? 'focus:ring-red-200' : 'focus:ring-blue-200'}
  `;

  if (options) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className={`absolute left-3 top-3.5 w-5 h-5 ${
            hasError ? 'text-red-400' : hasValue ? 'text-green-500' : 'text-gray-400'
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
            <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
          )}
        </div>
        {hasError && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors[name]?.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className={`absolute left-3 top-3.5 w-5 h-5 ${
          hasError ? 'text-red-400' : hasValue ? 'text-green-500' : 'text-gray-400'
        }`} />
        <input
          {...register(name, { valueAsNumber: type === 'number' })}
          type={type}
          placeholder={placeholder}
          className={fieldClasses}
        />
        {hasValue && !hasError && (
          <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
        )}
      </div>
      {hasError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

// Componente principal
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
    }
  });

  // Validación debounced
  const debouncedTrigger = useDebounce(trigger, 300);

  // Resetear formulario
  useEffect(() => {
    if (open) {
      if (socio) {
        const timestampToDate = (timestamp: Timestamp | Date | undefined): Date | undefined => {
          if (!timestamp) return undefined;
          if (timestamp instanceof Timestamp) return timestamp.toDate();
          return timestamp;
        };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="nombre"
              label="Nombre Completo"
              icon={User}
              placeholder="Ingresa el nombre completo"
              required
              register={register}
              errors={errors}
              watch={watch}
            />
            <FormField
              name="email"
              label="Correo Electrónico"
              type="email"
              icon={Mail}
              placeholder="correo@ejemplo.com"
              required
              register={register}
              errors={errors}
              watch={watch}
            />
            <FormField
              name="dni"
              label="DNI/Documento"
              icon={CreditCard}
              placeholder="12345678"
              register={register}
              errors={errors}
              watch={watch}
            />
            <FormField
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              icon={Calendar}
              register={register}
              errors={errors}
              watch={watch}
            />
          </div>
        );

      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="telefono"
              label="Teléfono"
              type="tel"
              icon={Phone}
              placeholder="+54 9 11 1234-5678"
              register={register}
              errors={errors}
              watch={watch}
            />
            <div className="md:col-span-2">
              <FormField
                name="direccion"
                label="Dirección"
                icon={MapPin}
                placeholder="Calle, número, ciudad, provincia"
                register={register}
                errors={errors}
                watch={watch}
              />
            </div>
          </div>
        );

      case 'membership':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="numeroSocio"
              label="Número de Socio"
              icon={CreditCard}
              placeholder="SOC-001"
              register={register}
              errors={errors}
              watch={watch}
            />
            <FormField
              name="montoCuota"
              label="Monto de Cuota"
              type="number"
              icon={CreditCard}
              placeholder="0"
              register={register}
              errors={errors}
              watch={watch}
            />
            <FormField
              name="fechaVencimiento"
              label="Fecha de Vencimiento"
              type="date"
              icon={Calendar}
              register={register}
              errors={errors}
              watch={watch}
            />
            <FormField
              name="estadoMembresia"
              label="Estado de Membresía"
              icon={CreditCard}
              options={[
                { value: 'al_dia', label: 'Al día' },
                { value: 'vencido', label: 'Vencido' },
                { value: 'pendiente', label: 'Pendiente' }
              ]}
              register={register}
              errors={errors}
              watch={watch}
            />
          </div>
        );

      case 'access':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditing && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repetir contraseña"
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}
            
            <div className={!isEditing ? "md:col-span-2" : ""}>
              <FormField
                name="estado"
                label="Estado del Socio"
                icon={User}
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
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!mounted) return null;

  // Animaciones simplificadas
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
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
          {/* Backdrop */}
          <motion.div
            initial={shouldUseAnimations ? { opacity: 0 } : undefined}
            animate={shouldUseAnimations ? { opacity: 1 } : undefined}
            exit={shouldUseAnimations ? { opacity: 0 } : undefined}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={shouldUseAnimations ? modalVariants : undefined}
            initial={shouldUseAnimations ? "hidden" : undefined}
            animate={shouldUseAnimations ? "visible" : undefined}
            exit={shouldUseAnimations ? "hidden" : undefined}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {FORM_STEPS[currentStep]?.title}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-100">
                      Paso {currentStep + 1} de {FORM_STEPS.length}
                    </span>
                    <span className="text-sm text-blue-100">
                      {Math.round(((currentStep + 1) / FORM_STEPS.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-center mt-4 gap-2">
                  {FORM_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCurrent = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <div
                        key={step.id}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isCurrent
                            ? 'bg-white text-blue-600 scale-110'
                            : isCompleted
                            ? 'bg-green-400 text-white'
                            : 'bg-white/20 text-white/60'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {FORM_STEPS[currentStep]?.title}
                  </h3>
                </div>

                <div className="min-h-[300px]">
                  {renderStepContent()}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-3">
                    {currentStep === FORM_STEPS.length - 1 ? (
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting || loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            {isEditing ? 'Actualizar' : 'Crear Socio'}
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isCurrentStepValid}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isCurrentStepValid
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                      </button>
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