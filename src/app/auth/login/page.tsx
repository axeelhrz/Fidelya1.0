'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Shield, 
  Zap, 
  CheckCircle, 
  Key, 
  Send, 
  X, 
  AlertTriangle,
  Sparkles,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { authService } from '@/services/auth.service';
import { getDashboardRoute } from '@/lib/auth';

const LoginPage = () => {
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
    { icon: Shield, text: 'SSL Seguro', color: 'text-emerald-500' },
    { icon: CheckCircle, text: 'Verificado', color: 'text-blue-500' },
    { icon: Zap, text: 'Acceso Rápido', color: 'text-amber-500' },
  ];

  const demoAccounts = [
    { role: 'Asociación', email: 'asociacion@demo.com', password: 'demo123', color: 'bg-purple-500' },
    { role: 'Comercio', email: 'comercio@demo.com', password: 'demo123', color: 'bg-blue-500' },
    { role: 'Socio', email: 'socio@demo.com', password: 'demo123', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-200 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm hover:shadow-md hover:scale-105"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </motion.div>

        {/* Configuration Error Alert */}
        <AnimatePresence>
          {!configValid && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">
                  Error de configuración del sistema. Contacta al administrador.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          {/* Logo */}
          <Link href="/" className="inline-block mb-6">
            <motion.div
              className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {/* Sparkle Effect */}
              <div className="absolute -top-1 -right-1">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={12} className="text-yellow-300" />
                </motion.div>
              </div>
              
              <span className="text-2xl font-bold text-white">F</span>
            </motion.div>
          </Link>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Bienvenido de vuelta
          </motion.h1>
          
          <motion.p 
            className="text-base text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Accede a tu cuenta de Fidelya y gestiona tu programa de fidelidad
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          {/* Glass Effect Background */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20" />
          
          {/* Content */}
          <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-white/30">
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              {/* Login Form */}
              <div className="space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 mb-6"
                >
                  Iniciar Sesión
                </motion.h2>
                
                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail size={16} />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="tu@email.com"
                      disabled={!configValid}
                      autoComplete="email"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-indigo-500'
                      }`}
                    />
                    {errors.email && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <AlertTriangle size={16} className="text-red-500" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-red-500"
                      >
                        {errors.email.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      disabled={!configValid}
                      autoComplete="current-password"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border text-sm transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={!configValid}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-red-500"
                      >
                        {errors.password.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-center"
              >
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  disabled={!configValid}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                <AnimatePresence>
                  {showForgotPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-6 bg-indigo-50 border border-indigo-200 rounded-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Key size={20} className="text-indigo-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-indigo-900 mb-2">
                            Recuperar Contraseña
                          </h3>
                          <p className="text-sm text-indigo-700 mb-4">
                            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                          </p>
                          
                          <div className="space-y-3">
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Mail size={16} />
                              </div>
                              <input
                                type="email"
                                placeholder="tu@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                disabled={!configValid}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-indigo-200 text-sm transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handlePasswordReset}
                                disabled={isResetting || !resetEmail || !configValid}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:scale-[1.02]"
                              >
                                {isResetting ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Send size={16} />
                                )}
                                <span>{isResetting ? 'Enviando...' : 'Enviar enlace'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowForgotPassword(false);
                                  setResetEmail('');
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Error Alert */}
              <AnimatePresence>
                {errors.root && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl bg-red-50 border border-red-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700 font-medium">{errors.root.message as string}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting || !configValid}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogIn size={16} />
                  )}
                  <span>{isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
                </button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="relative my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium">
                    ¿No tienes cuenta?
                  </span>
                </div>
              </motion.div>

              {/* Register Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Link
                  href="/auth/register"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.98] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus size={16} />
                  <span>Crear cuenta nueva</span>
                </Link>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
        >
          <div className="flex justify-around items-center gap-4">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="text-center flex-1"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 bg-white/80 shadow-sm">
                  <feature.icon size={18} className={feature.color} />
                </div>
                <p className="text-xs font-medium text-gray-600">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demo Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
          className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
          
          <h3 className="font-semibold text-amber-900 mb-4 text-center">
            Cuentas de Demostración
          </h3>
          
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/60 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${account.color}`} />
                  <span className="font-medium text-amber-900 text-sm">
                    {account.role}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-amber-800">
                    {account.email}
                  </p>
                  <p className="text-xs font-mono text-amber-700">
                    {account.password}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">
            © 2024 Fidelya. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;