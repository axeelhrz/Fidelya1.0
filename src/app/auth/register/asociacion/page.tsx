'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Zap,
  AlertCircle,
  CheckCircle,
  Users,
  BarChart3,
  Settings,
  Shield,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { asociacionRegisterSchema, type AsociacionRegisterFormData } from '@/lib/validations/auth';
import { createUser, getDashboardRoute } from '@/lib/auth';

const AsociacionRegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AsociacionRegisterFormData>({
    resolver: zodResolver(asociacionRegisterSchema),
  });

  const handleRegister = async (data: AsociacionRegisterFormData) => {
    try {
      setIsSubmitting(true);
      const userData = await createUser(data.email, data.password, {
        nombre: data.nombre,
        email: data.email,
        role: 'asociacion',
        estado: 'activo',
      });
      
      toast.success(`¡Bienvenido a Fidelya, ${userData.nombre}!`);
      const dashboardRoute = getDashboardRoute(userData.role);
      router.push(dashboardRoute);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error. Inténtalo de nuevo.';
      setError('root', {
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: Users, text: 'Gestión centralizada', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { icon: Building2, text: 'Múltiples comercios', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: BarChart3, text: 'Reportes avanzados', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { icon: Shield, text: 'Soporte especializado', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  // Floating particles animation
  const particles = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-20"
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/80 to-blue-100/60">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl"
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
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl"
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
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl"
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

      {/* Enhanced Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link
          href="/auth/register"
          className="group inline-flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:bg-white"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
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
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
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
                  <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Fidelya
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Role Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-3 px-4 py-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl shadow-lg mb-6"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-emerald-800 font-bold text-sm">Cuenta Asociación</p>
                <p className="text-emerald-600 text-xs">Para organizaciones</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 font-display">
                Crear Cuenta de Asociación
              </h1>
              <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto">
                Gestiona programas de fidelidad para tu organización y conecta múltiples comercios
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Glass effect background */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20" />
            
            <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
              {/* Features Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-8 p-5 bg-emerald-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50"
              >
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-emerald-800 text-center">
                    Herramientas para Organizaciones
                  </h3>
                  <Star className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <div className={`w-8 h-8 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                        <feature.icon className={`w-4 h-4 ${feature.color}`} />
                      </div>
                      <span className="text-emerald-700 font-semibold text-sm">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Información del Responsable</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nombre del responsable
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          {...register('nombre')}
                          type="text"
                          placeholder="Tu nombre completo"
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                            errors.nombre ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                      </div>
                    </div>
                    {errors.nombre && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.nombre.message}</span>
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Organization Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>Información de la Organización</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nombre de la asociación
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          {...register('nombreAsociacion')}
                          type="text"
                          placeholder="Nombre de tu asociación u organización"
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                            errors.nombreAsociacion ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        />
                      </div>
                    </div>
                    {errors.nombreAsociacion && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.nombreAsociacion.message}</span>
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Account Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-emerald-600" />
                    <span>Información de la Cuenta</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            {...register('email')}
                            type="email"
                            placeholder="tu@email.com"
                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
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

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Contraseña
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mínimo 6 caracteres"
                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                              errors.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
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

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Confirmar contraseña
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            {...register('confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirma tu contraseña"
                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                              errors.confirmPassword ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-sm font-medium flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.confirmPassword.message}</span>
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Error Alert */}
                <AnimatePresence>
                  {errors.root && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-4 bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center space-x-3 shadow-lg"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-red-800 font-medium text-sm">{errors.root.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-base shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {isSubmitting ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Crear cuenta</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-slate-600 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
                      Iniciar sesión
                    </Link>
                  </p>
                </div>

                {/* Enterprise Note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Settings className="w-5 h-5 text-slate-600" />
                    <span className="font-bold text-slate-800 text-sm">Solución Empresarial</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Herramientas avanzadas para gestionar múltiples comercios y programas de fidelidad con reportes detallados y soporte especializado.
                  </p>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AsociacionRegisterPage;