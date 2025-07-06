'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Zap,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Key
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { getDashboardRoute } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [configValid, setConfigValid] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Validate Firebase configuration on component mount
  useEffect(() => {
    const isValid = authService.validateFirebaseConfig();
    setConfigValid(isValid);
    
    if (!isValid) {
      toast.error('Error de configuración. Contacta al administrador.');
    }
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      clearErrors();

      console.log('🔐 Login attempt for:', data.email);

      // Validate Firebase configuration before attempting login
      if (!configValid) {
        throw new Error('Error de configuración del sistema. Contacta al administrador.');
      }

      const response = await authService.signIn({
        email: data.email.trim().toLowerCase(),
        password: data.password
      });

      if (!response.success) {
        console.error('🔐 Login failed:', response.error);
        setError('root', { message: response.error || 'Error al iniciar sesión' });
        return;
      }

      if (!response.user) {
        console.error('🔐 Login succeeded but no user data returned');
        setError('root', { message: 'Error al obtener datos del usuario' });
        return;
      }

      console.log('🔐 Login successful for user:', response.user.nombre);
      toast.success(`¡Bienvenido, ${response.user.nombre}!`);
      
      const dashboardRoute = getDashboardRoute(response.user.role);
      console.log('🔐 Redirecting to:', dashboardRoute);
      router.push(dashboardRoute);
      
    } catch (error: unknown) {
      console.error('🔐 Login error:', error);
      
      let message = 'Ha ocurrido un error inesperado. Intenta nuevamente.';
      
      if (error && typeof error === 'object' && 'message' in error) {
        message = (error as { message: string }).message;
      }
      
      setError('root', { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast.error('Ingresa tu email para recuperar la contraseña');
      return;
    }

    if (!resetEmail.includes('@')) {
      toast.error('Ingresa un email válido');
      return;
    }

    setIsResetting(true);
    try {
      console.log('🔐 Password reset attempt for:', resetEmail);
      
      const response = await authService.resetPassword(resetEmail.trim().toLowerCase());
      
      if (response.success) {
        toast.success('Enlace de recuperación enviado a tu email');
        setShowForgotPassword(false);
        setResetEmail('');
      } else {
        toast.error(response.error || 'Error al enviar el enlace de recuperación');
      }
    } catch (error: unknown) {
      console.error('🔐 Password reset error:', error);
      toast.error('Error al enviar el enlace de recuperación');
    } finally {
      setIsResetting(false);
    }
  };

  const securityFeatures = [
    { icon: Shield, text: 'SSL Seguro', color: 'text-green-600' },
    { icon: CheckCircle, text: 'Verificado', color: 'text-blue-600' },
    { icon: Clock, text: 'Acceso Rápido', color: 'text-amber-600' },
  ];

  const demoAccounts = [
    { role: 'Asociación', email: 'asociacion@demo.com', password: 'demo123', color: 'bg-purple-500' },
    { role: 'Comercio', email: 'comercio@demo.com', password: 'demo123', color: 'bg-blue-500' },
    { role: 'Socio', email: 'socio@demo.com', password: 'demo123', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200/50"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
        </motion.div>

        {/* Configuration Error Alert */}
        <AnimatePresence>
          {!configValid && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                Error de configuración del sistema. Contacta al administrador.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          {/* Logo */}
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Fidelya
              </span>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Bienvenido de vuelta
          </h1>
          <p className="text-gray-600 text-sm">
            Accede a tu cuenta de Fidelya
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-6"
        >
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="tu@email.com"
                  disabled={!configValid}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 text-sm ${
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  disabled={!configValid}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 text-sm ${
                    errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!configValid}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(!showForgotPassword)}
                disabled={!configValid}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>

              <AnimatePresence>
                {showForgotPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <h3 className="font-medium text-blue-900 text-sm">Recuperar Contraseña</h3>
                    </div>
                    <p className="text-xs text-blue-700 mb-3">
                      Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          disabled={!configValid}
                          className="w-full pl-8 pr-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handlePasswordReset}
                          disabled={isResetting || !resetEmail || !configValid}
                          className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                        >
                          {isResetting ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false);
                            setResetEmail('');
                          }}
                          className="px-3 py-1.5 text-gray-500 hover:text-gray-700 transition-colors text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {errors.root && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{errors.root.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !configValid}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium text-xs">¿No tienes cuenta?</span>
              </div>
            </div>

            {/* Register Button */}
            <Link href="/auth/register">
              <button
                type="button"
                disabled={!configValid}
                className="w-full border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Crear cuenta nueva</span>
              </button>
            </Link>
          </form>

          {/* Security Features */}
          <div className="mt-4 p-3 bg-gray-50/50 rounded-lg">
            <div className="flex justify-around items-center">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center mb-1 mx-auto ${feature.color}`}>
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-medium text-amber-800 mb-2 text-center text-sm">
              Cuentas de Demostración
            </h3>
            <div className="space-y-1.5">
              {demoAccounts.map((account, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-white/70 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${account.color}`} />
                    <span className="text-xs font-medium text-amber-800">{account.role}:</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-amber-700 font-mono leading-tight">{account.email}</p>
                    <p className="text-xs text-amber-700 font-mono leading-tight">{account.password}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}