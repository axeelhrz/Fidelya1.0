"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Utensils,
  Phone,
  MapPin,
  Calendar,
  Users,
  Shield,
  CreditCard,
  School,
  UserCheck,
  Baby,
  Heart
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Schema de validación ultra completo para Casino Escolar
const registerSchema = z.object({
  // Datos del Estudiante
  nombreEstudiante: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  apellidoEstudiante: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 3 && age <= 18;
    }, 'El estudiante debe tener entre 3 y 18 años'),
  
  curso: z
    .string()
    .min(1, 'Debes seleccionar un curso')
    .refine((val) => {
      const validCursos = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
      return validCursos.includes(val);
    }, 'Curso inválido'),
  
  turno: z
    .enum(['mañana', 'tarde'], {
      required_error: 'Debes seleccionar un turno'
    }),

  // Datos del Responsable/Tutor
  nombreResponsable: z
    .string()
    .min(2, 'El nombre del responsable debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  apellidoResponsable: z
    .string()
    .min(2, 'El apellido del responsable debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  
  relacionEstudiante: z
    .enum(['padre', 'madre', 'tutor', 'abuelo', 'abuela', 'tio', 'tia', 'otro'], {
      required_error: 'Debes especificar tu relación con el estudiante'
    }),
  
  email: z
    .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es requerido')
    .toLowerCase(),
  
  telefono: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos')
    .regex(/^[+]?[\d\s\-()]+$/, 'Formato de teléfono inválido'),
  
  telefonoEmergencia: z
    .string()
    .min(10, 'El teléfono de emergencia debe tener al menos 10 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos')
    .regex(/^[+]?[\d\s\-()]+$/, 'Formato de teléfono inválido')
    .optional(),

  // Información Médica y Alimentaria
  alergias: z
    .string()
    .max(500, 'La descripción de alergias no puede exceder 500 caracteres')
    .optional(),
  
  restriccionesDieteticas: z
    .array(z.string())
    .optional(),
  
  medicamentos: z
    .string()
    .max(500, 'La información de medicamentos no puede exceder 500 caracteres')
    .optional(),

  // Datos de Acceso
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos: 1 mayúscula, 1 minúscula y 1 número'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),

  // Términos y Condiciones
  aceptaTerminos: z
    .boolean()
    .refine((val) => val === true, 'Debes aceptar los términos y condiciones'),
  
  autorizaFotos: z
    .boolean()
    .optional(),
  
  recibirNotificaciones: z
    .boolean()
    .optional()

}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Datos para los selectores
const cursos = [
  { value: '1A', label: '1º Año - División A', emoji: '🌱' },
  { value: '1B', label: '1º Año - División B', emoji: '🌱' },
  { value: '2A', label: '2º Año - División A', emoji: '🌿' },
  { value: '2B', label: '2º Año - División B', emoji: '🌿' },
  { value: '3A', label: '3º Año - División A', emoji: '🌳' },
  { value: '3B', label: '3º Año - División B', emoji: '🌳' },
  { value: '4A', label: '4º Año - División A', emoji: '🎯' },
  { value: '4B', label: '4º Año - División B', emoji: '🎯' },
  { value: '5A', label: '5º Año - División A', emoji: '🚀' },
  { value: '5B', label: '5º Año - División B', emoji: '🚀' },
  { value: '6A', label: '6º Año - División A', emoji: '🎓' },
  { value: '6B', label: '6º Año - División B', emoji: '🎓' },
];

const turnos = [
  { value: 'mañana', label: 'Turno Mañana', emoji: '🌅', horario: '7:30 - 12:30' },
  { value: 'tarde', label: 'Turno Tarde', emoji: '🌇', horario: '13:00 - 18:00' },
];

const relaciones = [
  { value: 'padre', label: 'Padre', emoji: '👨' },
  { value: 'madre', label: 'Madre', emoji: '👩' },
  { value: 'tutor', label: 'Tutor Legal', emoji: '👤' },
  { value: 'abuelo', label: 'Abuelo', emoji: '👴' },
  { value: 'abuela', label: 'Abuela', emoji: '👵' },
  { value: 'tio', label: 'Tío', emoji: '👨‍🦳' },
  { value: 'tia', label: 'Tía', emoji: '👩‍🦳' },
  { value: 'otro', label: 'Otro', emoji: '👥' },
];

const restriccionesDieteticas = [
  { value: 'vegetariano', label: 'Vegetariano', emoji: '🥬' },
  { value: 'vegano', label: 'Vegano', emoji: '🌱' },
  { value: 'celiaco', label: 'Celíaco (sin gluten)', emoji: '🚫' },
  { value: 'lactosa', label: 'Intolerante a la lactosa', emoji: '🥛' },
  { value: 'diabetes', label: 'Diabético', emoji: '🍯' },
  { value: 'hipertension', label: 'Hipertensión (bajo sodio)', emoji: '🧂' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    trigger,
    setValue,
    getValues
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      restriccionesDieteticas: [],
      autorizaFotos: true,
      recibirNotificaciones: true
    }
  });

  const watchedFields = watch();
  const totalSteps = 4;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSubmitStatus('idle');

    try {
      const { email, password, ...userData } = data;
      const supabase = supabaseBrowser();

      // Registro en Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${userData.nombreEstudiante} ${userData.apellidoEstudiante}`,
            curso: userData.curso,
            responsable: `${userData.nombreResponsable} ${userData.apellidoResponsable}`
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      const user = signUpData.user;
      if (user) {
        // Insertar en tabla users con todos los datos
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          // Datos del estudiante
          nombre_estudiante: userData.nombreEstudiante,
          apellido_estudiante: userData.apellidoEstudiante,
          fecha_nacimiento: userData.fechaNacimiento,
          curso: userData.curso,
          turno: userData.turno,
          
          // Datos del responsable
          nombre_responsable: userData.nombreResponsable,
          apellido_responsable: userData.apellidoResponsable,
          relacion_estudiante: userData.relacionEstudiante,
          email,
          telefono: userData.telefono,
          telefono_emergencia: userData.telefonoEmergencia,
          
          // Información médica
          alergias: userData.alergias,
          restricciones_dieteticas: userData.restriccionesDieteticas,
          medicamentos: userData.medicamentos,
          
          // Configuraciones
          autoriza_fotos: userData.autorizaFotos,
          recibir_notificaciones: userData.recibirNotificaciones,
          
          // Metadatos
          rol: 'user',
          estado: 'pendiente_verificacion',
          created_at: new Date().toISOString()
        });

        if (insertError) {
          throw new Error(insertError.message);
        }

        setSubmitStatus('success');
        
        // Esperar un momento para mostrar el éxito antes de redirigir
        setTimeout(() => {
          router.push('/auth/check-email');
        }, 3000);
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof RegisterFormData)[] => {
    switch (step) {
      case 1:
        return ['nombreEstudiante', 'apellidoEstudiante', 'fechaNacimiento', 'curso', 'turno'];
      case 2:
        return ['nombreResponsable', 'apellidoResponsable', 'relacionEstudiante', 'email', 'telefono'];
      case 3:
        return ['alergias', 'restriccionesDieteticas', 'medicamentos'];
      case 4:
        return ['password', 'confirmPassword', 'aceptaTerminos'];
      default:
        return [];
    }
  };

  const getFieldStatus = (fieldName: keyof RegisterFormData) => {
    if (errors[fieldName]) return 'error';
    if (touchedFields[fieldName] && watchedFields[fieldName] && !errors[fieldName]) return 'success';
    return 'default';
  };

  const getStepProgress = () => (currentStep / totalSteps) * 100;

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    const current = getValues('restriccionesDieteticas') || [];
    if (checked) {
      setValue('restriccionesDieteticas', [...current, restriction]);
    } else {
      setValue('restriccionesDieteticas', current.filter(r => r !== restriction));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 flex items-center justify-center p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mb-6 shadow-xl"
          >
            <Utensils className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Casino Escolar
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-2"
          >
            Registro de Familia
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Gestiona los pedidos de comida de tu hijo/a de forma fácil y segura
          </motion.p>
        </div>

        {/* Indicador de Progreso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step <= currentStep
                    ? 'bg-orange-600 border-orange-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getStepProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Estudiante</span>
            <span>Responsable</span>
            <span>Salud</span>
            <span>Acceso</span>
          </div>
        </div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="modern-card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Paso 1: Datos del Estudiante */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                      <Baby className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Datos del Estudiante
                      </h2>
                      <p className="text-sm text-gray-500">
                        Información básica del alumno/a
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre del Estudiante */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre del Estudiante *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('nombreEstudiante')}
                          type="text"
                          placeholder="Ej: Juan Carlos"
                          className={`input-field pl-11 ${
                            getFieldStatus('nombreEstudiante') === 'error' ? 'input-error' : 
                            getFieldStatus('nombreEstudiante') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        {getFieldStatus('nombreEstudiante') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.nombreEstudiante && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.nombreEstudiante.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Apellido del Estudiante */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Apellido del Estudiante *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('apellidoEstudiante')}
                          type="text"
                          placeholder="Ej: Pérez González"
                          className={`input-field pl-11 ${
                            getFieldStatus('apellidoEstudiante') === 'error' ? 'input-error' : 
                            getFieldStatus('apellidoEstudiante') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        {getFieldStatus('apellidoEstudiante') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.apellidoEstudiante && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.apellidoEstudiante.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fecha de Nacimiento *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('fechaNacimiento')}
                        type="date"
                        className={`input-field pl-11 ${
                          getFieldStatus('fechaNacimiento') === 'error' ? 'input-error' : 
                          getFieldStatus('fechaNacimiento') === 'success' ? 'input-success' : ''
                        }`}
                      />
                      {getFieldStatus('fechaNacimiento') === 'success' && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                      )}
                    </div>
                    <AnimatePresence>
                      {errors.fechaNacimiento && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.fechaNacimiento.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Curso */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Curso *
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <select
                          {...register('curso')}
                          className={`input-field pl-11 appearance-none cursor-pointer ${
                            getFieldStatus('curso') === 'error' ? 'input-error' : 
                            getFieldStatus('curso') === 'success' ? 'input-success' : ''
                          }`}
                        >
                          <option value="">Selecciona el curso</option>
                          {cursos.map((curso) => (
                            <option key={curso.value} value={curso.value}>
                              {curso.emoji} {curso.label}
                            </option>
                          ))}
                        </select>
                        {getFieldStatus('curso') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.curso && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.curso.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Turno */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Turno *
                      </label>
                      <div className="space-y-3">
                        {turnos.map((turno) => (
                          <label
                            key={turno.value}
                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              watchedFields.turno === turno.value
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              {...register('turno')}
                              type="radio"
                              value={turno.value}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-2xl">{turno.emoji}</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {turno.label}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {turno.horario}
                                </div>
                              </div>
                            </div>
                            {watchedFields.turno === turno.value && (
                              <CheckCircle className="w-5 h-5 text-orange-500" />
                            )}
                          </label>
                        ))}
                      </div>
                      <AnimatePresence>
                        {errors.turno && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.turno.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Datos del Responsable */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Datos del Responsable
                      </h2>
                      <p className="text-sm text-gray-500">
                        Información del tutor o responsable legal
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre del Responsable */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre del Responsable *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('nombreResponsable')}
                          type="text"
                          placeholder="Ej: María Elena"
                          className={`input-field pl-11 ${
                            getFieldStatus('nombreResponsable') === 'error' ? 'input-error' : 
                            getFieldStatus('nombreResponsable') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        {getFieldStatus('nombreResponsable') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.nombreResponsable && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.nombreResponsable.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Apellido del Responsable */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Apellido del Responsable *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('apellidoResponsable')}
                          type="text"
                          placeholder="Ej: Rodríguez"
                          className={`input-field pl-11 ${
                            getFieldStatus('apellidoResponsable') === 'error' ? 'input-error' : 
                            getFieldStatus('apellidoResponsable') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        {getFieldStatus('apellidoResponsable') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.apellidoResponsable && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.apellidoResponsable.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Relación con el Estudiante */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Relación con el Estudiante *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                      <select
                        {...register('relacionEstudiante')}
                        className={`input-field pl-11 appearance-none cursor-pointer ${
                          getFieldStatus('relacionEstudiante') === 'error' ? 'input-error' : 
                          getFieldStatus('relacionEstudiante') === 'success' ? 'input-success' : ''
                        }`}
                      >
                        <option value="">Selecciona la relación</option>
                        {relaciones.map((relacion) => (
                          <option key={relacion.value} value={relacion.value}>
                            {relacion.emoji} {relacion.label}
                          </option>
                        ))}
                      </select>
                      {getFieldStatus('relacionEstudiante') === 'success' && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                      )}
                    </div>
                    <AnimatePresence>
                      {errors.relacionEstudiante && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.relacionEstudiante.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email de Contacto *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="responsable@ejemplo.com"
                        className={`input-field pl-11 ${
                          getFieldStatus('email') === 'error' ? 'input-error' : 
                          getFieldStatus('email') === 'success' ? 'input-success' : ''
                        }`}
                      />
                      {getFieldStatus('email') === 'success' && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Este email se usará para notificaciones y acceso al sistema
                    </p>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Teléfono Principal */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Teléfono Principal *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('telefono')}
                          type="tel"
                          placeholder="+54 11 1234-5678"
                          className={`input-field pl-11 ${
                            getFieldStatus('telefono') === 'error' ? 'input-error' : 
                            getFieldStatus('telefono') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        {getFieldStatus('telefono') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.telefono && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.telefono.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Teléfono de Emergencia */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Teléfono de Emergencia
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('telefonoEmergencia')}
                          type="tel"
                          placeholder="+54 11 9876-5432"
                          className={`input-field pl-11 ${
                            getFieldStatus('telefonoEmergencia') === 'error' ? 'input-error' : 
                            getFieldStatus('telefonoEmergencia') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        {getFieldStatus('telefonoEmergencia') === 'success' && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Contacto alternativo en caso de emergencia
                      </p>
                      <AnimatePresence>
                        {errors.telefonoEmergencia && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.telefonoEmergencia.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Información Médica y Alimentaria */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Información de Salud
                      </h2>
                      <p className="text-sm text-gray-500">
                        Datos médicos y restricciones alimentarias
                      </p>
                    </div>
                  </div>

                  {/* Restricciones Dietéticas */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Restricciones Dietéticas
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {restriccionesDieteticas.map((restriccion) => (
                        <label
                          key={restriccion.value}
                          className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all duration-200"
                        >
                          <input
                            type="checkbox"
                            onChange={(e) => handleRestrictionChange(restriccion.value, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center transition-all duration-200 ${
                            watchedFields.restriccionesDieteticas?.includes(restriccion.value)
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}>
                            {watchedFields.restriccionesDieteticas?.includes(restriccion.value) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-lg mr-2">{restriccion.emoji}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {restriccion.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Alergias */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alergias Alimentarias
                    </label>
                    <textarea
                      {...register('alergias')}
                      rows={3}
                      placeholder="Describe cualquier alergia alimentaria conocida (ej: nueces, mariscos, huevos, etc.)"
                      className={`input-field resize-none ${
                        getFieldStatus('alergias') === 'error' ? 'input-error' : 
                        getFieldStatus('alergias') === 'success' ? 'input-success' : ''
                      }`}
                    />
                    <p className="text-xs text-gray-500">
                      Esta información es crucial para la preparación segura de las comidas
                    </p>
                    <AnimatePresence>
                      {errors.alergias && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.alergias.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Medicamentos */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Medicamentos Actuales
                    </label>
                    <textarea
                      {...register('medicamentos')}
                      rows={3}
                      placeholder="Lista cualquier medicamento que el estudiante tome regularmente (opcional)"
                      className={`input-field resize-none ${
                        getFieldStatus('medicamentos') === 'error' ? 'input-error' : 
                        getFieldStatus('medicamentos') === 'success' ? 'input-success' : ''
                      }`}
                    />
                    <p className="text-xs text-gray-500">
                      Información confidencial para casos de emergencia
                    </p>
                    <AnimatePresence>
                      {errors.medicamentos && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.medicamentos.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Nota informativa */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Confidencialidad Médica
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Toda la información médica proporcionada será tratada con estricta confidencialidad 
                          y solo será utilizada por el personal autorizado del casino escolar para garantizar 
                          la seguridad alimentaria de su hijo/a.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 4: Datos de Acceso y Términos */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Lock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Datos de Acceso
                      </h2>
                      <p className="text-sm text-gray-500">
                        Configuración de seguridad y términos
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contraseña */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 8 caracteres"
                          className={`input-field pl-11 pr-11 ${
                            getFieldStatus('password') === 'error' ? 'input-error' : 
                            getFieldStatus('password') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.password.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirmar Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('confirmPassword')}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repite tu contraseña"
                          className={`input-field pl-11 pr-11 ${
                            getFieldStatus('confirmPassword') === 'error' ? 'input-error' : 
                            getFieldStatus('confirmPassword') === 'success' ? 'input-success' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Términos y Condiciones */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Acepta los términos y condiciones *
                    </label>
                    <div className="relative">
                      <input
                        {...register('aceptaTerminos')}
                        type="checkbox"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      />
                      <div className="ml-10">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Al aceptar, confirmas que has leído y entendido los términos y condiciones del servicio.
                        </p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.aceptaTerminos && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.aceptaTerminos.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Botón de Envío */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || !isValid || submitStatus === 'success'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creando cuenta...
                        </motion.div>
                      ) : submitStatus === 'success' ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          ¡Cuenta creada!
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          Crear Cuenta
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensaje de Error Global */}
            <AnimatePresence>
              {submitStatus === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensaje de Éxito */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 animate-pulse-success" />
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        ¡Registro exitoso!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Revisa tu email para verificar tu cuenta
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de Navegación */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Atrás
                </button>
              )}
              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-secondary flex items-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Indicador de seguridad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Tus datos están protegidos con encriptación de nivel bancario
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}