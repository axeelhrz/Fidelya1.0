'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Key,
  Sparkles,
  Star,
  Building2,
  Store,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { EmailVerification } from '@/components/auth/EmailVerification';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading, error, clearError, resetPassword } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Check for verification success or reset success from URL params
  useEffect(() => {
    const verified = searchParams.get('verified');
    const reset = searchParams.get('reset');
    
    if (verified === 'true') {
      toast.success('¡Email verificado exitosamente! Ya puedes iniciar sesión.');
    }
    
    if (reset === 'true') {
      toast.success('Contraseña restablecida exitosamente. Inicia sesión con tu nueva contraseña.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      clearErrors();
      clearError();

      console.log('🔐 Login attempt for:', data.email);

      const response = await signIn(data.email, data.password, data.rememberMe);

      if (!response.success) {
        if (response.requiresEmailVerification) {
          setVerificationEmail(data.email);
          setShowEmailVerification(true);
          return;
        }
        
        setError('root', { message: response.error || 'Error al iniciar sesión' });
        return;
      }

      if (!response.user) {
        setError('root', { message: 'Error al obtener datos del usuario' });
        return;
      }

      console.log('🔐 Login successful for user:', response.user.nombre);
      toast.success(`¡Bienvenido, ${response.user.nombre}!`);
      
      // Redirect based on role
      const dashboardRoutes = {
        admin: '/dashboard/admin',
        asociacion: '/dashboard/asociacion',
        comercio: '/dashboard/comercio',
        socio: '/dashboard/socio',
      };
      
      const dashboardRoute = dashboardRoutes[response.user.role as keyof typeof dashboardRoutes] || '/dashboard';
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
      
      // Use the resetPassword method from useAuth hook
      const response = await resetPassword(resetEmail.trim().toLowerCase());
      
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

  // Show email verification screen
  if (showEmailVerification) {
    return (
      <EmailVerification 
        email={verificationEmail}
        onBack={() => setShowEmailVerification(false)}
      />
    );
  }

  const securityFeatures = [
    { icon: Shield, text: 'Protección SSL', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { icon: CheckCircle, text: 'Verificado', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: Clock, text: 'Acceso 24/7', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  const demoAccounts = [
    { 
      role: 'Asociación', 
      email: 'asociacion@demo.com', 
      password: 'demo123', 
      color: 'from-purple-500 to-purple-600', 
      icon: Building2,
      description: 'Panel administrativo'
    },
    { 
      role: 'Comercio', 
      email: 'comercio@demo.com', 
      password: 'demo123', 
      color: 'from-blue-500 to-blue-600', 
      icon: Store,
      description: 'Gestión comercial'
    },
    { 
      role: 'Socio', 
      email: 'socio@demo.com', 
      password: 'demo123', 
      color: 'from-emerald-500 to-emerald-600', 
      icon: User,
      description: 'Portal del socio'
    },
  ];

  // Floating particles animation
  const particles = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20"
      animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 100 - 50, 0],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: "easeInOut"
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  ));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/60">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Floating particles */}
        {particles}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          {/* Enhanced Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:bg-white"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
            </Link>
          </motion.div>

          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            {/* Enhanced Logo */}
            <Link href="/" className="inline-block mb-6 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  </div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                    Fidelya
                  </span>
                </div>
              </motion.div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-slate-800 mb-2 font-display">
                Bienvenido de vuelta
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Accede a tu cuenta y gestiona tu programa de fidelización
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Glass effect background */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20" />
            
            <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                {/* Enhanced Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="tu@email.com"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email.message}</span>
                    </motion.p>
                  )}
                </div>

                {/* Enhanced Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Tu contraseña"
                        disabled={loading}
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password.message}</span>
                    </motion.p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      {...register('rememberMe')}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-slate-600">Recordarme</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(!showForgotPassword)}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Enhanced Forgot Password */}
                <AnimatePresence>
                  {showForgotPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl shadow-lg"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Key className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900 text-sm">Recuperar Contraseña</h3>
                          <p className="text-blue-700 text-xs">Te enviaremos un enlace de recuperación</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            placeholder="tu@email.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 border border-blue-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/90 text-sm font-medium"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={handlePasswordReset}
                            disabled={isResetting || !resetEmail || loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                          >
                            {isResetting ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Enviando...</span>
                              </div>
                            ) : (
                              'Enviar enlace'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(false);
                              setResetEmail('');
                            }}
                            className="px-4 py-2.5 text-slate-600 hover:text-slate-800 transition-colors text-sm font-medium hover:bg-white/50 rounded-xl"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Error Alert */}
                <AnimatePresence>
                  {(errors.root || error) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-4 bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center space-x-3 shadow-lg"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-red-800 font-medium text-sm">
                        {errors.root?.message || error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-base shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {(isSubmitting || loading) ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Iniciar sesión</span>
                    </>
                  )}
                </motion.button>

                {/* Enhanced Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white/80 backdrop-blur-sm text-slate-500 font-semibold text-sm rounded-full border border-slate-200">
                      ¿No tienes cuenta?
                    </span>
                  </div>
                </div>

                {/* Enhanced Register Button */}
                <Link href="/auth/register">
                  <motion.button
                    type="button"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-slate-300 text-slate-700 py-4 px-6 rounded-2xl font-semibold text-base hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Crear cuenta nueva</span>
                  </motion.button>
                </Link>
              </form>

              {/* Enhanced Security Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 p-5 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/50"
              >
                <div className="flex justify-around items-center">
                  {securityFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="text-center group"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-2 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <p className="text-xs text-slate-600 font-semibold">{feature.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Demo Accounts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-6 p-5 bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-sm border border-amber-200/50 rounded-2xl shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-amber-800 text-center">
                    Cuentas de Demostración
                  </h3>
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-3">
                  {demoAccounts.map((account, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      className="group p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${account.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                            <account.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{account.role}</p>
                            <p className="text-xs text-slate-600">{account.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded-lg mb-1">
                            {account.email}
                          </p>
                          <p className="text-xs text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded-lg">
                            {account.password}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}