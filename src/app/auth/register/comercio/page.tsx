'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Store, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  FileText, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  Clock,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { comercioRegisterSchema, type ComercioRegisterData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { EmailVerification } from '@/components/auth/EmailVerification';

export default function ComercioRegisterPage() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<ComercioRegisterData>({
    resolver: zodResolver(comercioRegisterSchema),
    defaultValues: {
      role: 'comercio',
      acceptTerms: false,
    }
  });

  const password = watch('password');

  const handleRegister = async (data: ComercioRegisterData) => {
    try {
      setIsSubmitting(true);
      clearErrors();

      console.log('🔐 Comercio registration attempt for:', data.email);

      const response = await signUp({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        role: 'comercio',
        telefono: data.telefono,
        additionalData: {
          nombreComercio: data.nombreComercio,
          categoria: data.categoria,
          descripcion: data.descripcion,
          direccion: data.direccion,
          horario: data.horario,
          sitioWeb: data.sitioWeb,
          cuit: data.cuit,
        }
      });

      if (!response.success) {
        setError('root', { message: response.error || 'Error al registrarse' });
        return;
      }

      if (response.requiresEmailVerification) {
        setRegistrationEmail(data.email);
        setShowEmailVerification(true);
        return;
      }

      console.log('🔐 Registration successful');
      toast.success('¡Registro exitoso! Bienvenido a Fidelya.');
      router.push('/dashboard/comercio');
      
    } catch (error: unknown) {
      console.error('🔐 Registration error:', error);
      
      let message = 'Ha ocurrido un error inesperado. Intenta nuevamente.';
      
      if (error && typeof error === 'object' && 'message' in error) {
        message = (error as { message: string }).message;
      }
      
      setError('root', { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show email verification screen
  if (showEmailVerification) {
    return (
      <EmailVerification 
        email={registrationEmail}
        onBack={() => setShowEmailVerification(false)}
      />
    );
  }

  const categorias = [
    { value: 'restaurante', label: 'Restaurante' },
    { value: 'retail', label: 'Retail' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'salud', label: 'Salud' },
    { value: 'educacion', label: 'Educación' },
    { value: 'entretenimiento', label: 'Entretenimiento' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'automotriz', label: 'Automotriz' },
    { value: 'hogar', label: 'Hogar' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/auth/register"
            className="group inline-flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          {/* Logo */}
          <Link href="/" className="inline-block mb-6 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Registro de Comercio
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Únete a nuestra red y atrae más clientes con beneficios exclusivos
            </p>
          </motion.div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          {/* Glass effect background */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20" />
          
          <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Información Personal</h3>
                </div>

                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Nombre Completo *
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('nombre')}
                        type="text"
                        placeholder="Tu nombre completo"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.nombre ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
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

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Correo Electrónico *
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="tu@email.com"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
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
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Teléfono
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      {...register('telefono')}
                      type="tel"
                      placeholder="+54 9 11 1234-5678"
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                        errors.telefono ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.telefono && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.telefono.message}</span>
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Store className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Información del Comercio</h3>
                </div>

                {/* Business Name and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Nombre del Comercio *
                    </label>
                    <div className="relative group">
                      <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('nombreComercio')}
                        type="text"
                        placeholder="Nombre de tu comercio"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.nombreComercio ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.nombreComercio && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.nombreComercio.message}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Categoría *
                    </label>
                    <div className="relative">
                      <select
                        {...register('categoria')}
                        disabled={loading}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 font-medium appearance-none ${
                          errors.categoria ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map(categoria => (
                          <option key={categoria.value} value={categoria.value}>
                            {categoria.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.categoria && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.categoria.message}</span>
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Descripción
                  </label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <textarea
                      {...register('descripcion')}
                      rows={3}
                      placeholder="Describe brevemente tu comercio..."
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium resize-none ${
                        errors.descripcion ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.descripcion && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.descripcion.message}</span>
                    </motion.p>
                  )}
                </div>

                {/* Address and Hours Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Dirección
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('direccion')}
                        type="text"
                        placeholder="Dirección del comercio"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.direccion ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.direccion && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.direccion.message}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* Hours */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Horario de Atención
                    </label>
                    <div className="relative group">
                      <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('horario')}
                        type="text"
                        placeholder="Ej: Lun-Vie 9:00-18:00"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.horario ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.horario && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.horario.message}</span>
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Website and CUIT Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Website */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Sitio Web
                    </label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('sitioWeb')}
                        type="url"
                        placeholder="https://tucomercio.com"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.sitioWeb ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.sitioWeb && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.sitioWeb.message}</span>
                      </motion.p>
                    )}
                  </div>

                  {/* CUIT */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      CUIT
                    </label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('cuit')}
                        type="text"
                        placeholder="XX-XXXXXXXX-X"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.cuit ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                    </div>
                    {errors.cuit && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.cuit.message}</span>
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Seguridad</h3>
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Contraseña *
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Tu contraseña"
                        disabled={loading}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
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
                    <label className="block text-sm font-semibold text-slate-700">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirma tu contraseña"
                        disabled={loading}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium ${
                          errors.confirmPassword ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
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

                {/* Password Strength Indicator */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <p className="text-sm font-medium text-slate-700 mb-2">Fortaleza de la contraseña:</p>
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full ${
                              password.length >= level * 2
                                ? level <= 2 ? 'bg-red-400' : level === 3 ? 'bg-yellow-400' : 'bg-green-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className={`flex items-center space-x-2 ${password.length >= 8 ? 'text-green-600' : ''}`}>
                          {password.length >= 8 ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-slate-300 rounded-full" />}
                          <span>Al menos 8 caracteres</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                          {/[A-Z]/.test(password) ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-slate-300 rounded-full" />}
                          <span>Una letra mayúscula</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                          {/[a-z]/.test(password) ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-slate-300 rounded-full" />}
                          <span>Una letra minúscula</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${/\d/.test(password) ? 'text-green-600' : ''}`}>
                          {/\d/.test(password) ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 border border-slate-300 rounded-full" />}
                          <span>Un número</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    disabled={loading}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    Acepto los{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium underline">
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium underline">
                      política de privacidad
                    </Link>
                    {' '}de Fidelya
                  </span>
                </label>
                {errors.acceptTerms && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm font-medium flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.acceptTerms.message}</span>
                  </motion.p>
                )}
              </div>

              {/* Error Alert */}
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

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-base shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {(isSubmitting || loading) ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  <>
                    <Store className="w-5 h-5" />
                    <span>Crear Cuenta de Comercio</span>
                  </>
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-slate-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
