'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  FileText,
  Building,
  AlertCircle,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ComercioFormData } from '@/services/comercio.service';
import { useDebounce } from '@/hooks/useDebounce';

const CATEGORIAS_COMERCIO = [
  'Alimentación',
  'Librería y Papelería',
  'Farmacia y Salud',
  'Restaurantes y Gastronomía',
  'Retail y Moda',
  'Salud y Belleza',
  'Deportes y Fitness',
  'Tecnología',
  'Hogar y Decoración',
  'Automotriz',
  'Educación',
  'Entretenimiento',
  'Servicios Profesionales',
  'Turismo y Viajes',
  'Otros'
];

// Esquema de validación
const comercioSchema = z.object({
  nombreComercio: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  descripcion: z.string().optional(),
  sitioWeb: z.string().url('URL inválida').optional().or(z.literal('')),
  horario: z.string().optional(),
  cuit: z.string().optional(),
});

type ComercioFormInputs = z.infer<typeof comercioSchema>;

// Configuración de pasos del formulario
const FORM_STEPS = [
  {
    id: 'basic',
    title: 'Información Básica',
    subtitle: 'Datos principales del comercio',
    icon: Store,
    color: 'from-green-500 to-emerald-500',
    fields: ['nombreComercio', 'email', 'categoria', 'descripcion']
  },
  {
    id: 'contact',
    title: 'Contacto y Ubicación',
    subtitle: 'Información de contacto',
    icon: Phone,
    color: 'from-blue-500 to-cyan-500',
    fields: ['telefono', 'direccion', 'sitioWeb', 'horario', 'cuit']
  },
  {
    id: 'config',
    title: 'Configuración',
    subtitle: 'Configuración inicial',
    icon: Settings,
    color: 'from-purple-500 to-pink-500',
    fields: ['configuracion']
  }
];

// Componente de campo de formulario
const FormField = React.memo(({ 
  field, 
  register, 
  error, 
  watch,
  formData,
  handleConfigChange
}: any) => {
  const fieldValue = watch(field.name);
  const hasError = !!error;
  const hasValue = fieldValue && fieldValue.length > 0;
  const isValid = hasValue && !hasError;

  const getFieldIcon = () => {
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (isValid) return <Check className="w-4 h-4 text-green-500" />;
    return field.icon ? <field.icon className="w-4 h-4 text-gray-400" /> : null;
  };

  const getFieldClasses = () => {
    const baseClasses = "w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-colors duration-100 bg-white";
    
    if (hasError) {
      return `${baseClasses} border-red-300 focus:border-red-500`;
    }
    if (isValid) {
      return `${baseClasses} border-green-300 focus:border-green-500`;
    }
    return `${baseClasses} border-gray-200 focus:border-blue-500`;
  };

  if (field.type === 'select') {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {getFieldIcon()}
          </div>
          <select
            {...register(field.name)}
            className={getFieldClasses()}
          >
            <option value="">Seleccionar...</option>
            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error.message}
          </p>
        )}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
            {getFieldIcon()}
          </div>
          <textarea
            {...register(field.name)}
            rows={3}
            placeholder={field.placeholder}
            className={`${getFieldClasses()} resize-none`}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error.message}
          </p>
        )}
      </div>
    );
  }

  if (field.type === 'config') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Notificaciones por Email</h5>
            <p className="text-sm text-gray-600">Recibir notificaciones de validaciones por email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.configuracion?.notificacionesEmail || false}
              onChange={(e) => handleConfigChange('notificacionesEmail', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Notificaciones por WhatsApp</h5>
            <p className="text-sm text-gray-600">Recibir notificaciones de validaciones por WhatsApp</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.configuracion?.notificacionesWhatsApp || false}
              onChange={(e) => handleConfigChange('notificacionesWhatsApp', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Auto-validación</h5>
            <p className="text-sm text-gray-600">Validar automáticamente los beneficios sin confirmación manual</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.configuracion?.autoValidacion || false}
              onChange={(e) => handleConfigChange('autoValidacion', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h5 className="font-medium text-gray-900">Requiere Aprobación</h5>
            <p className="text-sm text-gray-600">Los beneficios requieren aprobación antes de ser publicados</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.configuracion?.requiereAprobacion || false}
              onChange={(e) => handleConfigChange('requiereAprobacion', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getFieldIcon()}
        </div>
        <input
          {...register(field.name)}
          type={field.type}
          placeholder={field.placeholder}
          className={getFieldClasses()}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

interface CreateComercioDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ComercioFormData) => Promise<boolean>;
  loading?: boolean;
}

export const CreateComercioDialog: React.FC<CreateComercioDialogProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<ComercioFormData>({
    nombreComercio: '',
    categoria: '',
    email: '',
    telefono: '',
    direccion: '',
    descripcion: '',
    sitioWeb: '',
    horario: '',
    cuit: '',
    configuracion: {
      notificacionesEmail: true,
      notificacionesWhatsApp: false,
      autoValidacion: false,
      requiereAprobacion: true,
    }
  });

  const currentStepData = FORM_STEPS[currentStep];

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    trigger,
    getValues
  } = useForm<ComercioFormInputs>({
    resolver: zodResolver(comercioSchema),
    mode: 'onChange',
    defaultValues: {
      nombreComercio: '',
      email: '',
      categoria: '',
      telefono: '',
      direccion: '',
      descripcion: '',
      sitioWeb: '',
      horario: '',
      cuit: '',
    }
  });

  // Validación debounced
  const debouncedTrigger = useDebounce(trigger, 300);

  // Resetear formulario
  useEffect(() => {
    if (open) {
      reset({
        nombreComercio: '',
        email: '',
        categoria: '',
        telefono: '',
        direccion: '',
        descripcion: '',
        sitioWeb: '',
        horario: '',
        cuit: '',
      });
      setFormData({
        nombreComercio: '',
        categoria: '',
        email: '',
        telefono: '',
        direccion: '',
        descripcion: '',
        sitioWeb: '',
        horario: '',
        cuit: '',
        configuracion: {
          notificacionesEmail: true,
          notificacionesWhatsApp: false,
          autoValidacion: false,
          requiereAprobacion: true,
        }
      });
      setCurrentStep(0);
    }
  }, [open, reset]);

  // Navegación entre pasos
  const nextStep = useCallback(async () => {
    const currentFields = FORM_STEPS[currentStep].fields.filter(field => field !== 'configuracion');
    const isValid = await trigger(currentFields as any);
    
    if (isValid && currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, trigger]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  // Manejar cambios de configuración
  const handleConfigChange = useCallback((field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      configuracion: {
        ...prev.configuracion,
        [field]: value
      }
    }));
  }, []);

  // Envío del formulario
  const onSubmitForm = useCallback(async (data: ComercioFormInputs) => {
    try {
      setIsSubmitting(true);
      
      const finalData: ComercioFormData = {
        ...data,
        configuracion: formData.configuracion
      };

      const success = await onSubmit(finalData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error al crear comercio:', error);
      toast.error('Error al crear el comercio');
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, onClose, formData.configuracion]);

  // Campos del formulario por paso
  const getStepFields = useMemo(() => {
    const fieldConfigs = {
      nombreComercio: { name: 'nombreComercio', label: 'Nombre del Comercio', type: 'text', icon: Store, placeholder: 'Ej: Supermercado Central' },
      email: { name: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'comercio@ejemplo.com' },
      categoria: { 
        name: 'categoria', 
        label: 'Categoría', 
        type: 'select', 
        icon: Building,
        options: CATEGORIAS_COMERCIO.map(cat => ({ value: cat, label: cat }))
      },
      descripcion: { name: 'descripcion', label: 'Descripción', type: 'textarea', icon: FileText, placeholder: 'Describe brevemente el comercio y sus servicios...' },
      telefono: { name: 'telefono', label: 'Teléfono', type: 'tel', icon: Phone, placeholder: '+54 11 1234-5678' },
      direccion: { name: 'direccion', label: 'Dirección', type: 'text', icon: MapPin, placeholder: 'Av. Corrientes 1234, CABA' },
      sitioWeb: { name: 'sitioWeb', label: 'Sitio Web', type: 'url', icon: Globe, placeholder: 'https://www.ejemplo.com' },
      horario: { name: 'horario', label: 'Horario de Atención', type: 'text', icon: Clock, placeholder: 'Lun-Vie 9:00-18:00' },
      cuit: { name: 'cuit', label: 'CUIT', type: 'text', icon: Building, placeholder: 'XX-XXXXXXXX-X' },
      configuracion: { name: 'configuracion', label: 'Configuración', type: 'config', icon: Settings },
    };

    return currentStepData.fields.map(fieldName => fieldConfigs[fieldName as keyof typeof fieldConfigs]);
  }, [currentStepData]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`relative px-6 py-4 bg-gradient-to-r ${currentStepData.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <currentStepData.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Nuevo Comercio
                      </h2>
                      <p className="text-white/80 text-sm">
                        {currentStepData.title} - {currentStepData.subtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Navegación por iconos */}
                <div className="mt-4 flex justify-center space-x-4">
                  {FORM_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => goToStep(index)}
                        className={`relative p-3 rounded-xl transition-all duration-100 ${
                          isActive 
                            ? 'bg-white/30 scale-110' 
                            : isCompleted 
                              ? 'bg-white/20 hover:bg-white/25' 
                              : 'bg-white/10 hover:bg-white/15'
                        }`}
                      >
                        <StepIcon className={`w-5 h-5 ${
                          isActive || isCompleted ? 'text-white' : 'text-white/60'
                        }`} />
                        
                        {/* Indicador de completado */}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
                <div key={currentStep} className="space-y-6">
                  {currentStep === 2 ? (
                    // Paso de configuración - layout especial
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Configuración Inicial
                        </h4>
                        <p className="text-gray-600 text-sm mb-6">
                          Estas configuraciones se pueden cambiar más tarde desde el panel del comercio.
                        </p>
                      </div>
                      {getStepFields.map((field) => (
                        <FormField
                          key={field.name}
                          field={field}
                          register={register}
                          error={errors[field.name as keyof typeof errors]}
                          watch={watch}
                          formData={formData}
                          handleConfigChange={handleConfigChange}
                        />
                      ))}
                      
                      {/* Resumen */}
                      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2 flex items-center">
                          <Check className="w-4 h-4 mr-2" />
                          Resumen del Comercio
                        </h5>
                        <div className="text-sm text-green-800 space-y-1">
                          <p><strong>Nombre:</strong> {watch('nombreComercio') || 'Sin especificar'}</p>
                          <p><strong>Email:</strong> {watch('email') || 'Sin especificar'}</p>
                          <p><strong>Categoría:</strong> {watch('categoria') || 'Sin especificar'}</p>
                          {watch('telefono') && <p><strong>Teléfono:</strong> {watch('telefono')}</p>}
                          {watch('direccion') && <p><strong>Dirección:</strong> {watch('direccion')}</p>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Pasos normales - grid layout
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {getStepFields.map((field) => (
                        <div key={field.name} className={field.name === 'descripcion' ? 'md:col-span-2' : ''}>
                          <FormField
                            field={field}
                            register={register}
                            error={errors[field.name as keyof typeof errors]}
                            watch={watch}
                            formData={formData}
                            handleConfigChange={handleConfigChange}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>

                    {currentStep < FORM_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting || loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Creando...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Crear Comercio</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};