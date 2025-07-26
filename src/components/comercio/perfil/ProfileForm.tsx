'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useComercio } from '@/hooks/useComercio';
import { CATEGORIAS_COMERCIO } from '@/types/comercio';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  FileText,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Building,
  Tag,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Edit3,
  X
} from 'lucide-react';

type ComercioProfileFormData = {
  nombre: string;
  nombreComercio: string;
  email: string;
  categoria: string;
  direccion: string;
  telefono: string;
  horario: string;
  descripcion: string;
  sitioWeb: string;
  razonSocial: string;
  cuit: string;
  ubicacion: string;
  emailContacto: string;
  visible: boolean;
  redesSociales: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
};

export const ProfileForm: React.FC = () => {
  const { comercio, loading, updateProfile, error, clearError } = useComercio();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm<ComercioProfileFormData>({
    defaultValues: {
      nombre: '',
      nombreComercio: '',
      email: '',
      categoria: '',
      direccion: '',
      telefono: '',
      horario: '',
      descripcion: '',
      sitioWeb: '',
      razonSocial: '',
      cuit: '',
      ubicacion: '',
      emailContacto: '',
      visible: true,
      redesSociales: {
        facebook: '',
        instagram: '',
        twitter: '',
      }
    }
  });

  const watchedFields = watch();
  
  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    if (comercio) {
      const formData = {
        nombre: comercio.nombreComercio || '',
        nombreComercio: comercio.nombreComercio || '',
        email: comercio.email || '',
        categoria: comercio.categoria || '',
        direccion: comercio.direccion || '',
        telefono: comercio.telefono || '',
        horario: comercio.horario || '',
        descripcion: comercio.descripcion || '',
        sitioWeb: comercio.sitioWeb || '',
        razonSocial: comercio.nombreComercio || '',
        cuit: comercio.cuit || '',
        ubicacion: comercio.direccion || '',
        emailContacto: comercio.email || '',
        visible: comercio.visible ?? true,
        redesSociales: {
          facebook: '',
          instagram: '',
          twitter: '',
        }
      };
      
      reset(formData);
      setHasChanges(false);
    }
  }, [comercio, reset]);

  const onSubmit = async (data: ComercioProfileFormData) => {
    try {
      clearError();
      
      const success = await updateProfile({
        nombreComercio: data.nombreComercio.trim(),
        email: data.email.trim().toLowerCase(),
        categoria: data.categoria,
        direccion: data.direccion?.trim() || '',
        telefono: data.telefono?.trim() || '',
        horario: data.horario?.trim() || '',
        descripcion: data.descripcion?.trim() || '',
        sitioWeb: data.sitioWeb?.trim() || '',
        cuit: data.cuit?.trim() || '',
        configuracion: {
          notificacionesEmail: true,
          notificacionesWhatsApp: false,
          autoValidacion: false,
          requiereAprobacion: true,
        },
      });
      
      if (success) {
        setIsEditing(false);
        setHasChanges(false);
        setSaveSuccess(true);
        
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleReset = () => {
    if (comercio) {
      const formData = {
        nombre: comercio.nombreComercio || '',
        nombreComercio: comercio.nombreComercio || '',
        email: comercio.email || '',
        categoria: comercio.categoria || '',
        direccion: comercio.direccion || '',
        telefono: comercio.telefono || '',
        horario: comercio.horario || '',
        descripcion: comercio.descripcion || '',
        sitioWeb: comercio.sitioWeb || '',
        razonSocial: comercio.nombreComercio || '',
        cuit: comercio.cuit || '',
        ubicacion: comercio.direccion || '',
        emailContacto: comercio.email || '',
        visible: comercio.visible ?? true,
        redesSociales: {
          facebook: '',
          instagram: '',
          twitter: '',
        }
      };
      
      reset(formData);
    }
    setIsEditing(false);
    setHasChanges(false);
    clearError();
  };

  const handleEditToggle = () => {
    if (isEditing && hasChanges) {
      const confirmDiscard = window.confirm('Tienes cambios sin guardar. ¿Deseas descartarlos?');
      if (!confirmDiscard) return;
    }
    
    setIsEditing(!isEditing);
    if (!isEditing) {
      clearError();
    } else {
      handleReset();
    }
  };

  if (loading && !comercio) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando información...
          </h3>
          <p className="text-gray-500">Obteniendo datos del comercio</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Información General
                </h2>
                <p className="text-gray-600 font-medium">
                  Mantén actualizada la información de tu comercio
                </p>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 items-center"
          >
            {/* Status Indicators */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">Cambios sin guardar</span>
                </motion.div>
              )}
              
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Guardado exitosamente</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit/Save Buttons */}
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || !hasChanges}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Datos Generales</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nombre Comercial */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nombre Comercial *
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('nombreComercio', { 
                      required: 'El nombre comercial es requerido',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                      errors.nombreComercio 
                        ? 'border-red-300 bg-red-50' 
                        : isEditing 
                          ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Nombre de tu comercio"
                  />
                </div>
                {errors.nombreComercio && (
                  <p className="text-sm text-red-600">{errors.nombreComercio.message}</p>
                )}
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Rubro o Categoría *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Controller
                    name="categoria"
                    control={control}
                    rules={{ required: 'La categoría es requerida' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 appearance-none ${
                          errors.categoria 
                            ? 'border-red-300 bg-red-50' 
                            : isEditing 
                              ? 'border-gray-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' 
                              : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <option value="">Selecciona una categoría</option>
                        {CATEGORIAS_COMERCIO.map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                {errors.categoria && (
                  <p className="text-sm text-red-600">{errors.categoria.message}</p>
                )}
              </div>

              {/* CUIT */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  RUT / CUIT
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('cuit')}
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="12-34567890-1"
                  />
                </div>
              </div>

              {/* Visibilidad */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Visibilidad
                </label>
                <Controller
                  name="visible"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
                      <button
                        type="button"
                        onClick={() => isEditing && field.onChange(!field.value)}
                        disabled={!isEditing}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          field.value ? 'bg-blue-600' : 'bg-gray-300'
                        } ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            field.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <div className="flex items-center gap-2">
                        {field.value ? (
                          <>
                            <Eye className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Visible para socios</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">Oculto para socios</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Información de Contacto</h3>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Principal *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('email', { 
                      required: 'El email es requerido',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Formato de email inválido'
                      }
                    })}
                    type="email"
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : isEditing 
                          ? 'border-gray-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="correo@micomercio.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('telefono', {
                        pattern: {
                          value: /^[\+]?[0-9\s\-\(\)]+$/,
                          message: 'Formato de teléfono inválido'
                        }
                      })}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                        errors.telefono 
                          ? 'border-red-300 bg-red-50' 
                          : isEditing 
                            ? 'border-gray-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' 
                            : 'border-gray-200 bg-gray-50'
                      }`}
                      placeholder="+598 99 123 456"
                    />
                  </div>
                  {errors.telefono && (
                    <p className="text-sm text-red-600">{errors.telefono.message}</p>
                  )}
                </div>

                {/* Horarios */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Horarios de Atención
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register('horario')}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                        isEditing 
                          ? 'border-gray-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                      placeholder="Lunes a Viernes - 9 a 18 hs"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Dirección Física *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('direccion', {
                      required: 'La dirección es requerida'
                    })}
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                      errors.direccion 
                        ? 'border-red-300 bg-red-50' 
                        : isEditing 
                          ? 'border-gray-300 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="Dirección completa del comercio"
                  />
                </div>
                {errors.direccion && (
                  <p className="text-sm text-red-600">{errors.direccion.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Descripción y Presentación</h3>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Descripción del Comercio
              </label>
              <textarea
                {...register('descripcion', {
                  maxLength: {
                    value: 500,
                    message: 'Máximo 500 caracteres'
                  }
                })}
                disabled={!isEditing}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none ${
                  errors.descripcion 
                    ? 'border-red-300 bg-red-50' 
                    : isEditing 
                      ? 'border-gray-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' 
                      : 'border-gray-200 bg-gray-50'
                }`}
                placeholder="Describe tu comercio, productos o servicios que ofreces a los socios de Fidelitá..."
              />
              <div className="flex justify-between items-center">
                {errors.descripcion && (
                  <p className="text-sm text-red-600">{errors.descripcion.message}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {watchedFields.descripcion?.length || 0}/500 caracteres
                </p>
              </div>
            </div>
          </motion.div>

          {/* Online Presence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Presencia Online</h3>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Sitio Web
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('sitioWeb', {
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                      message: 'URL inválida. Ejemplo: https://www.micomercio.com'
                    }
                  })}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all duration-200 ${
                    errors.sitioWeb 
                      ? 'border-red-300 bg-red-50' 
                      : isEditing 
                        ? 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20' 
                        : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="https://www.micomercio.com"
                />
              </div>
              {errors.sitioWeb && (
                <p className="text-sm text-red-600">{errors.sitioWeb.message}</p>
              )}
            </div>
          </motion.div>
        </form>
      </div>

      {/* Floating Save Changes Alert */}
      <AnimatePresence>
        {hasChanges && isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-md z-50"
          >
            <div className="bg-white border border-amber-200 rounded-2xl shadow-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Cambios sin guardar</h4>
                  <p className="text-sm text-gray-600">Tienes modificaciones pendientes</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Guardando cambios...
              </h3>
              <p className="text-gray-600">
                Por favor espera mientras actualizamos tu perfil
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};