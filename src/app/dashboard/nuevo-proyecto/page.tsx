'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSCAT, generateProjectId } from '@/contexts/SCATContext';

const NuevoProyectoPage: React.FC = () => {
  const router = useRouter();
  const { dispatch } = useSCAT();
  
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    involved: '',
    area: '',
    dateTime: '',
    investigator: '',
    otherData: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Iconos
  const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </svg>
  );

  const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );

  const ContactIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  const MapIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  );

  const InspectorIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );

  const FileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  );

  // Componente de campo de formulario
  const FormField: React.FC<{
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    error?: string;
    required?: boolean;
  }> = ({ label, icon, children, error, required = false }) => (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="flex items-center gap-3 text-white font-medium">
        <div className="w-8 h-8 rounded-lg bg-[#FFD600] flex items-center justify-center text-black">
          {icon}
        </div>
        <span>
          {label}
          {required && <span className="text-[#FF3B30] ml-1">*</span>}
        </span>
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#FF3B30] text-sm"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es obligatorio';
    }

    if (!formData.event.trim()) {
      newErrors.event = 'La descripción del evento es obligatoria';
    }

    if (!formData.involved.trim()) {
      newErrors.involved = 'Debe especificar los involucrados';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'El área es obligatoria';
    }

    if (!formData.dateTime.trim()) {
      newErrors.dateTime = 'La fecha y hora son obligatorias';
    }

    if (!formData.investigator.trim()) {
      newErrors.investigator = 'El investigador es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    
    try {
      const newProject = {
        id: generateProjectId(),
        name: formData.name || 'Proyecto sin nombre',
        event: formData.event,
        involved: formData.involved,
        area: formData.area,
        dateTime: formData.dateTime,
        investigator: formData.investigator,
        otherData: formData.otherData,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        scatProgress: {
          ci: {},
          cb: {},
          nac: {}
        },
        validations: {},
        observations: {}
      };

      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      
      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al guardar borrador:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newProject = {
        id: generateProjectId(),
        name: formData.name,
        event: formData.event,
        involved: formData.involved,
        area: formData.area,
        dateTime: formData.dateTime,
        investigator: formData.investigator,
        otherData: formData.otherData,
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        scatProgress: {
          ci: {},
          cb: {},
          nac: {}
        },
        validations: {},
        observations: {}
      };

      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      
      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/dashboard/tabla-scat');
    } catch (error) {
      console.error('Error al crear proyecto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Header */}
      <motion.div 
        className="bg-[#2E2E2E] border-b border-[#555555] px-8 py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleBack}
              className="p-2 rounded-lg bg-[#404040] text-white hover:bg-[#4A4A4A] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon />
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Nuevo Proyecto SCAT</h1>
              <p className="text-[#B3B3B3]">Datos del accidente / incidente</p>
            </div>
          </div>

          {/* Indicador de progreso */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">Paso 1 de 2</p>
              <p className="text-[#B3B3B3] text-sm">Información básica</p>
            </div>
            <div className="w-16 h-2 bg-[#404040] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FFD600]"
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          className="bg-[#2E2E2E] rounded-2xl p-8 border border-[#555555] shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Header del formulario */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 bg-[#FFD600] text-black px-4 py-2 rounded-lg font-bold text-sm mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              DATOS
            </motion.div>
            <h2 className="text-xl font-bold text-white">ACCIDENTE / INCIDENTE</h2>
          </div>

          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Nombre del Proyecto"
              icon={<EditIcon />}
              required
              error={errors.name}
            >
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Análisis Incidente Área Producción"
                className="w-full px-4 py-3 bg-[#404040] border border-[#555555] rounded-lg text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#FFD600] transition-colors"
              />
            </FormField>

            <FormField
              label="Evento"
              icon={<EditIcon />}
              required
              error={errors.event}
            >
              <textarea
                value={formData.event}
                onChange={(e) => handleInputChange('event', e.target.value)}
                placeholder="Descripción detallada del evento ocurrido"
                rows={3}
                className="w-full px-4 py-3 bg-[#404040] border border-[#555555] rounded-lg text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#FFD600] transition-colors resize-none"
              />
            </FormField>

            <FormField
              label="Involucrado"
              icon={<ContactIcon />}
              required
              error={errors.involved}
            >
              <input
                type="text"
                value={formData.involved}
                onChange={(e) => handleInputChange('involved', e.target.value)}
                placeholder="Nombre(s) de la(s) persona(s) involucrada(s)"
                className="w-full px-4 py-3 bg-[#404040] border border-[#555555] rounded-lg text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#FFD600] transition-colors"
              />
            </FormField>

            <FormField
              label="Área"
              icon={<MapIcon />}
              required
              error={errors.area}
            >
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full px-4 py-3 bg-[#404040] border border-[#555555] rounded-lg text-white focus:outline-none focus:border-[#FFD600] transition-colors"
              >
                <option value="">Seleccionar área</option>
                <option value="Producción">Producción</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Almacén">Almacén</option>
                <option value="Oficinas">Oficinas</option>
                <option value="Laboratorio">Laboratorio</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Calidad">Calidad</option>
                <option value="Logística">Logística</option>
                <option value="Otro">Otro</option>
              </select>
            </FormField>

            <FormField
              label="Fecha y Hora"
              icon={<CalendarIcon />}
              required
              error={errors.dateTime}
            >
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleInputChange('dateTime', e.target.value)}
                max={getCurrentDateTime()}
                className="w-full px-4 py-3 bg-[#404040] border border-[#555555] rounded-lg text-white focus:outline-none focus:border-[#FFD600] transition-colors"
              />
            </FormField>

            <FormField
              label="Investigador"
              icon={<InspectorIcon />}
              required
              error={errors.investigator}
            >
              <input
                type="text"
                value={formData.investigator}
                onChange={(e) => handleInputChange('investigator', e.target.value)}
                placeholder="Nombre del responsable de la investigación"
                className="w-full px-4 py-3 bg-[#404040] border border-[#555555] rounded-lg text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#FFD600] transition-colors"
              />
            </FormField>
          </div>

          {/* Campo de otros datos (ancho completo) */}
          <div className="mt-6">
            <FormField
              label="Otros datos"
              icon={<FileIcon />}
            >
              <textarea
                value={formData.otherData}
                onChange={(e) => handleInputChange('otherData', e.target.value)}
                placeholder="Información adicional relevante para la investigación"
                rows={4}
                className="w-full px-4 py-3 bg-[#404040] border border-[#555555] rounded-lg text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#FFD600] transition-colors resize-none"
              />
            </FormField>
          </div>

          {/* Botones de acción */}
          <motion.div 
            className="flex items-center justify-between mt-8 pt-6 border-t border-[#555555]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.button
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-[#404040] text-white rounded-lg hover:bg-[#4A4A4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SaveIcon />
              {isSubmitting ? 'Guardando...' : 'Guardar Borrador'}
            </motion.button>

            <motion.button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="flex items-center gap-3 px-8 py-3 bg-[#FFD600] text-black font-bold rounded-lg hover:bg-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeftIcon />
              <span className="text-lg">
                {isSubmitting ? 'CREANDO...' : 'CONTINUAR'}
              </span>
              <ArrowRightIcon />
            </motion.button>
          </motion.div>

          {/* Indicador de campos requeridos */}
          <motion.p
            className="text-[#B3B3B3] text-sm text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Los campos marcados con <span className="text-[#FF3B30]">*</span> son obligatorios
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default NuevoProyectoPage;