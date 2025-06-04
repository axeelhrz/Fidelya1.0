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
  Sparkles
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Schema de validación ultra completo
const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),
  curso: z
    .string()
    .min(1, 'Debes seleccionar un curso')
    .refine((val) => ['1', '2', '3', '4', '5', '6'].includes(val), 'Curso inválido'),
  email: z
    .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es requerido')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos: 1 mayúscula, 1 minúscula y 1 número'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const cursos = [
  { value: '1', label: '1º Año', emoji: '🌱' },
  { value: '2', label: '2º Año', emoji: '🌿' },
  { value: '3', label: '3º Año', emoji: '🌳' },
  { value: '4', label: '4º Año', emoji: '🎯' },
  { value: '5', label: '5º Año', emoji: '🚀' },
  { value: '6', label: '6º Año', emoji: '🎓' },
];

export default function RegisterPage() {
  const router = useRouter();
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
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSubmitStatus('idle');

    try {
      const { email, password, nombre, curso } = data;
      const supabase = supabaseBrowser();

      // Registro en Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nombre,
            curso: curso
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      const user = signUpData.user;
      if (user) {
        // Insertar en tabla users
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          nombre,
          curso,
          email,
          rol: 'user',
          created_at: new Date().toISOString()
        });

        if (insertError) {
          throw new Error(insertError.message);
        }

        setSubmitStatus('success');
        
        // Esperar un momento para mostrar el éxito antes de redirigir
        setTimeout(() => {
          router.push('/auth/check-email');
        }, 2000);
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldStatus = (fieldName: keyof RegisterFormData) => {
    if (errors[fieldName]) return 'error';
    if (touchedFields[fieldName] && watchedFields[fieldName] && !errors[fieldName]) return 'success';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Crear Cuenta
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300"
          >
            Únete a nuestra plataforma educativa
          </motion.p>
        </div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="modern-card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Nombre */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre del Estudiante
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('nombre')}
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  className={`input-field pl-11 ${
                    getFieldStatus('nombre') === 'error' ? 'input-error' : 
                    getFieldStatus('nombre') === 'success' ? 'input-success' : ''
                  }`}
                />
                {getFieldStatus('nombre') === 'success' && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                )}
              </div>
              <AnimatePresence>
                {errors.nombre && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.nombre.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Campo Curso */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Curso
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
                  <option value="">Selecciona tu curso</option>
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

            {/* Campo Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email del Tutor
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="tutor@ejemplo.com"
                  className={`input-field pl-11 ${
                    getFieldStatus('email') === 'error' ? 'input-error' : 
                    getFieldStatus('email') === 'success' ? 'input-success' : ''
                  }`}
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-success" />
                )}
              </div>
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

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
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

            {/* Campo Confirmar Contraseña */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Contraseña
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