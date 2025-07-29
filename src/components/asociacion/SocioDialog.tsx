'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  MapPin, 
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Socio, SocioFormData } from '@/types/socio';
import { Timestamp } from 'firebase/firestore';

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

  const isEditing = !!socio;

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

  const isStepValid = (stepIndex: number) => {
    const fieldsToCheck = steps[stepIndex].fields as (keyof SocioFormInputs)[];
    return fieldsToCheck.every(field => !errors[field]);
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
            {!isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
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
            )}

            {isEditing && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Modo Edición
                </h3>
                <p className="text-gray-600">
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
                <option value="activo">Activo - Puede acceder a todos los beneficios</option>
                <option value="inactivo">Inactivo - Sin acceso temporal</option>
                <option value="suspendido">Suspendido - Acceso bloqueado</option>
                <option value="pendiente">Pendiente - Esperando activación</option>
                <option value="vencido">Vencido - Membresía expirada</option>
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

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {steps[currentStep].title}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                  <span
                    key={index}
                    className={`text-xs font-medium ${
                      index <= currentStep ? 'text-white' : 'text-blue-200'
                    }`}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white rounded-full h-2"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium transition-all"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{isEditing ? 'Actualizar' : 'Crear'} Socio</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};