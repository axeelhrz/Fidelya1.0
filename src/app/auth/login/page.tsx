"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Utensils,
  School,
  LogIn
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Schema de validación para login
const loginSchema = z.object({
  email: z
    .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es requerido')
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSubmitStatus('idle');

    try {
      const { email, password } = data;
      const supabase = supabaseBrowser();

      // Iniciar sesión con Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (signInData.user) {
        setSubmitStatus('success');
        
        // Redirigir al dashboard después de mostrar el éxito
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error: unknown) {
      setSubmitStatus('error');
      
      // Personalizar mensajes de error
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado';
      
      if (errorMessage.includes('Invalid login credentials')) {
        setErrorMessage('Email o contraseña incorrectos');
      } else if (errorMessage.includes('Email not confirmed')) {
        setErrorMessage('Por favor verifica tu email antes de iniciar sesión');
      } else {
        setErrorMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldStatus = (fieldName: keyof LoginFormData) => {
    if (errors[fieldName]) return 'error';
    if (touchedFields[fieldName] && watchedFields[fieldName] && !errors[fieldName]) return 'success';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex items-center justify-center p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"></div>
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
            className="inline-flex items-center justify-center w-20 h-20 casino-gradient rounded-3xl mb-6 shadow-xl"
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
            Iniciar Sesión
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Accede a tu cuenta para gestionar pedidos
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
            {/* Campo Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="ejemplo@correo.com"
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
                  placeholder="Ingresa tu contraseña"
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

            {/* Enlace de recuperación de contraseña */}
            <div className="text-right">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
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
                        ¡Inicio de sesión exitoso!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Redirigiendo al dashboard...
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
                    Iniciando sesión...
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
                    ¡Bienvenido!
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Regístrate aquí
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
            <School className="w-3 h-3" />
            Plataforma segura para la gestión escolar
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
