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
  Sparkles,
  Shield,
  Zap,
  Check,
  AlertCircle,
  Loader2,
  UserPlus,
  Settings,
  Lock
} from 'lucide-react';
import { Socio, SocioFormData } from '@/types/socio';
import { Timestamp } from 'firebase/firestore';
import { useDebounce } from '@/hooks/useDebounce';

// Esquema de validación futurista
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

// Pasos del formulario futurista
const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Información Personal',
    subtitle: 'Datos básicos del socio',
    icon: User,
    fields: ['nombre', 'email', 'dni', 'fechaNacimiento']
  },
  {
    id: 'contact',
    title: 'Contacto & Ubicación',
    subtitle: 'Información de contacto',
    icon: Phone,
    fields: ['telefono', 'direccion']
  },
  {
    id: 'membership',
    title: 'Membresía',
    subtitle: 'Configuración de membresía',
    icon: CreditCard,
    fields: ['numeroSocio', 'montoCuota', 'fechaVencimiento', 'estadoMembresia']
  },
  {
    id: 'access',
    title: 'Acceso & Seguridad',
    subtitle: 'Configuración de acceso',
    icon: Lock,
    fields: ['password', 'confirmPassword', 'estado']
  }
];

// Componente de partículas de fondo
const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          initial={{
            x: Math.random() * 800,
            y: Math.random() * 600,
            opacity: 0
          }}
          animate={{
            x: Math.random() * 800,
            y: Math.random() * 600,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Componente de campo de formulario futurista
const FuturisticFormField: React.FC<{
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
}> = ({ name, label, type = 'text', icon: Icon, placeholder, required, options, register, errors, watch }) => {
  const value = watch(name);
  const hasError = !!errors[name];
  const hasValue = value && value !== '';

  const fieldClasses = `
    w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300
    bg-white/80 backdrop-blur-sm
    ${hasError 
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
      : hasValue 
        ? 'border-green-400 focus:border-green-500 focus:ring-green-200'
        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
    }
    focus:outline-none focus:ring-4 focus:ring-opacity-20
    placeholder-gray-400 text-gray-900
  `;

  if (options) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Icon className={`absolute left-3 top-3.5 w-5 h-5 transition-colors duration-300 ${
            hasError ? 'text-red-400' : hasValue ? 'text-green-500' : 'text-gray-400'
          }`} />
          <select
            {...register(name)}
            className={fieldClasses}
          >
            <option value="">Seleccionar...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasValue && !hasError && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-3.5"
            >
              <Check className="w-5 h-5 text-green-500" />
            </motion.div>
          )}
        </div>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {errors[name]?.message}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className={`absolute left-3 top-3.5 w-5 h-5 transition-colors duration-300 ${
          hasError ? 'text-red-400' : hasValue ? 'text-green-500' : 'text-gray-400'
        }`} />
        <input
          {...register(name, { valueAsNumber: type === 'number' })}
          type={type}
          placeholder={placeholder}
          className={fieldClasses}
        />
        {hasValue && !hasError && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-3.5"
          >
            <Check className="w-5 h-5 text-green-500" />
          </motion.div>
        )}
      </div>
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm flex items-center gap-1"
        >
          <AlertCircle className="w-4 h-4" />
          {errors[name]?.message}
        </motion.p>
      )}
    </div>
  );
};

// Componente principal del diálogo
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
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isEditing = !!socio;

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

  // Validación debounced ultra rápida
  const debouncedTrigger = useDebounce(trigger, 50);

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
      setCompletedSteps(new Set());
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

  // Marcar pasos como completados
  useEffect(() => {
    if (isCurrentStepValid && currentStep >= 0) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  }, [isCurrentStepValid, currentStep]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FuturisticFormField
              name="nombre"
              label="Nombre Completo"
              icon={User}
              placeholder="Ingresa el nombre completo"
              required
              register={register}
              errors={errors}
              watch={watch}
            />
            <FuturisticFormField
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
            <FuturisticFormField
              name="dni"
              label="DNI/Documento"
              icon={CreditCard}
              placeholder="12345678"
              register={register}
              errors={errors}
              watch={watch}
            />
            <FuturisticFormField
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FuturisticFormField
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
              <FuturisticFormField
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FuturisticFormField
              name="numeroSocio"
              label="Número de Socio"
              icon={CreditCard}
              placeholder="SOC-001"
              register={register}
              errors={errors}
              watch={watch}
            />
            <FuturisticFormField
              name="montoCuota"
              label="Monto de Cuota"
              type="number"
              icon={CreditCard}
              placeholder="0"
              register={register}
              errors={errors}
              watch={watch}
            />
            <FuturisticFormField
              name="fechaVencimiento"
              label="Fecha de Vencimiento"
              type="date"
              icon={Calendar}
              register={register}
              errors={errors}
              watch={watch}
            />
            <FuturisticFormField
              name="estadoMembresia"
              label="Estado de Membresía"
              icon={Shield}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEditing && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:ring-opacity-20 focus:outline-none bg-white/80 backdrop-blur-sm"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repetir contraseña"
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:ring-opacity-20 focus:outline-none bg-white/80 backdrop-blur-sm"
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
              <FuturisticFormField
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
              />
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop futurista */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/20 to-purple-900/30 backdrop-blur-md"
          />

          {/* Partículas de fondo */}
          <ParticleBackground />

          {/* Modal principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Contenedor principal con glassmorphism */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header futurista */}
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                    >
                      <UserPlus className="w-6 h-6 text-white" />
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
                        className="text-blue-100"
                      >
                        {FORM_STEPS[currentStep]?.subtitle}
                      </motion.p>
                    </div>
                  </div>
                  
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                {/* Indicador de progreso */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-100">
                      Paso {currentStep + 1} de {FORM_STEPS.length}
                    </span>
                    <span className="text-sm text-blue-100">
                      {Math.round(((currentStep + 1) / FORM_STEPS.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Navegación de pasos */}
                <div className="flex items-center justify-center mt-4 gap-2">
                  {FORM_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = completedSteps.has(index);
                    const isCurrent = index === currentStep;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isCurrent
                            ? 'bg-white text-blue-600 shadow-lg scale-110'
                            : isCompleted
                            ? 'bg-green-400 text-white'
                            : 'bg-white/20 text-white/60'
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {FORM_STEPS[currentStep]?.title}
                    </h3>
                    <p className="text-gray-600">
                      {FORM_STEPS[currentStep]?.subtitle}
                    </p>
                  </div>

                  {renderStepContent()}
                </motion.div>

                {/* Navegación inferior */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                    whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                    whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </motion.button>

                  <div className="flex items-center gap-3">
                    {currentStep === FORM_STEPS.length - 1 ? (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSubmitting || loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            {isEditing ? 'Actualizar' : 'Crear Socio'}
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!isCurrentStepValid}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          isCurrentStepValid
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        whileHover={isCurrentStepValid ? { scale: 1.05 } : {}}
                        whileTap={isCurrentStepValid ? { scale: 0.95 } : {}}
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