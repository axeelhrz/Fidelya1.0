'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield
} from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Socio, SocioFormData } from '@/types/socio';

// Schema de validación
const socioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  estado: z.enum(['activo', 'inactivo', 'suspendido', 'pendiente', 'vencido']),
  telefono: z.string().optional(),
  dni: z.string().optional(),
  numeroSocio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type SocioFormInputs = z.infer<typeof socioSchema>;

interface SocioDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SocioFormData) => Promise<void>;
  socio?: Socio | null;
}

export const SocioDialog: React.FC<SocioDialogProps> = ({
  open,
  onClose,
  onSave,
  socio
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isEditing = !!socio;

  // Asegurar que el componente esté montado antes de usar createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    trigger,
    watch
  } = useForm<SocioFormInputs>({
    resolver: zodResolver(socioSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      estado: 'activo',
      telefono: '',
      dni: '',
      numeroSocio: '',
    }
  });

  // Resetear formulario cuando se abre/cierra o cambia el socio
  useEffect(() => {
    if (open) {
      if (socio) {
        // Modo edición
        reset({
          nombre: socio.nombre || '',
          email: socio.email || '',
          password: '',
          confirmPassword: '',
          estado: socio.estado || 'activo',
          telefono: socio.telefono || '',
          dni: socio.dni || '',
          numeroSocio: socio.numeroSocio || '',
        });
      } else {
        // Modo creación
        reset({
          nombre: '',
          email: '',
          password: '',
          confirmPassword: '',
          estado: 'activo',
          telefono: '',
          dni: '',
          numeroSocio: '',
        });
      }
      setCurrentStep(0);
    }
  }, [open, socio, reset]);

  const onSubmit: SubmitHandler<SocioFormInputs> = async (data) => {
    try {
      const socioData: SocioFormData = {
        nombre: data.nombre,
        email: data.email,
        estado: data.estado,
        telefono: data.telefono,
        dni: data.dni,
        numeroSocio: data.numeroSocio,
        ...(data.password && { password: data.password }),
      };

      await onSave(socioData);
    } catch (error) {
      console.error('Error saving socio:', error);
    }
  };

  const steps = [
    {
      title: 'Información Personal',
      fields: ['nombre', 'email', 'telefono', 'dni']
    },
    {
      title: 'Acceso al Sistema',
      fields: ['password', 'confirmPassword']
    },
    {
      title: 'Configuración',
      fields: ['estado', 'numeroSocio']
    }
  ];

  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep].fields as (keyof SocioFormInputs)[];
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldValidationState = (fieldName: keyof SocioFormInputs) => {
    if (errors[fieldName]) return 'error';
    const value = watch(fieldName);
    if (value && value.toString().length > 0) return 'success';
    return 'default';
  };

  const getFieldIcon = (fieldName: keyof SocioFormInputs) => {
    const state = getFieldValidationState(fieldName);
    if (state === 'error') return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (state === 'success') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return null;
  };

  const getFieldClasses = (fieldName: keyof SocioFormInputs) => {
    const state = getFieldValidationState(fieldName);
    const baseClasses = "w-full px-4 py-3 pl-12 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200";
    
    switch (state) {
      case 'error':
        return `${baseClasses} border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50`;
      case 'success':
        return `${baseClasses} border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50`;
      default:
        return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white`;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('nombre')}
                  className={getFieldClasses('nombre')}
                  placeholder="Ingresa el nombre completo"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('nombre')}
                </div>
              </div>
              {errors.nombre && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.nombre.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className={getFieldClasses('email')}
                  placeholder="correo@ejemplo.com"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('email')}
                </div>
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('telefono')}
                  className={getFieldClasses('telefono')}
                  placeholder="+54 9 11 1234-5678"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('telefono')}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI/Documento
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('dni')}
                  className={getFieldClasses('dni')}
                  placeholder="12345678"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('dni')}
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {!isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={getFieldClasses('password')}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={getFieldClasses('confirmPassword')}
                      placeholder="Repite la contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Modo Edición
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  La contraseña se mantiene sin cambios. Para modificarla, el socio debe usar la opción de recuperación de contraseña.
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Socio
              </label>
              <select
                {...register('estado')}
                className={getFieldClasses('estado')}
              >
                <option value="activo">✅ Activo - Puede acceder a todos los beneficios</option>
                <option value="inactivo">⏸️ Inactivo - Sin acceso temporal</option>
                <option value="suspendido">🚫 Suspendido - Acceso bloqueado</option>
                <option value="pendiente">⏳ Pendiente - Esperando activación</option>
                <option value="vencido">⚠️ Vencido - Membresía expirada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Socio
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('numeroSocio')}
                  className={getFieldClasses('numeroSocio')}
                  placeholder="SOC001 (opcional)"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon('numeroSocio')}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!open || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden">
        {/* Backdrop con blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Contenedor del modal */}
        <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ 
              type: "spring", 
              duration: 0.6,
              bounce: 0.3
            }}
            className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con gradiente */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-8 py-8">
              {/* Elementos decorativos */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                    </h2>
                    <p className="text-blue-100 text-lg">
                      {steps[currentStep].title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between mb-3">
                  {steps.map((step, index) => (
                    <span
                      key={index}
                      className={`text-sm font-medium transition-colors duration-200 ${
                        index <= currentStep ? 'text-white' : 'text-blue-200'
                      }`}
                    >
                      {step.title}
                    </span>
                  ))}
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-white to-blue-100 rounded-full h-3"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-280px)]">
              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="min-h-[400px]"
                >
                  {renderStepContent()}
                </motion.div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      currentStep === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Anterior</span>
                  </button>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
                    >
                      Cancelar
                    </button>

                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <span>Siguiente</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>{isEditing ? 'Actualizar' : 'Crear'} Socio</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );

  // Usar createPortal para renderizar el modal en el body
  return createPortal(modalContent, document.body);
};