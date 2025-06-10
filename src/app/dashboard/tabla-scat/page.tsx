'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSCAT, calculateProgress } from '@/contexts/SCATContext';
import SCATHeader from '@/components/SCATHeader';
import SCATItemCard from '@/components/SCATItemCard';
import ActionBar from '@/components/ActionBar';

const TablaSCATPage: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useSCAT();
  const [selectedSection, setSelectedSection] = useState<'ci' | 'cb' | 'nac'>('ci');

  // Datos de las secciones
  const sectionsData = {
    ci: {
      title: 'Causas Inmediatas',
      subtitle: 'Actos y condiciones subestándar',
      color: '#FF6B6B',
      total: 7,
      items: [
        { id: 1, title: 'Operación sin autorización', subtitle: 'Falta de permisos o autorizaciones' },
        { id: 2, title: 'Operar a velocidad inadecuada', subtitle: 'Velocidad excesiva o insuficiente' },
        { id: 3, title: 'Anular dispositivos de seguridad', subtitle: 'Desactivar sistemas de protección' },
        { id: 4, title: 'Usar equipo defectuoso', subtitle: 'Utilizar herramientas en mal estado' },
        { id: 5, title: 'Usar equipo de manera incorrecta', subtitle: 'Uso inadecuado de herramientas' },
        { id: 6, title: 'No usar equipo de protección personal', subtitle: 'Omitir el uso de EPP requerido' },
        { id: 7, title: 'Carga inadecuada', subtitle: 'Sobrecarga o distribución incorrecta' }
      ]
    },
    cb: {
      title: 'Causas Básicas',
      subtitle: 'Factores personales y del trabajo',
      color: '#4ECDC4',
      total: 15,
      items: [
        { id: 1, title: 'Capacidad física/fisiológica inadecuada', subtitle: 'Limitaciones físicas del trabajador' },
        { id: 2, title: 'Capacidad mental/psicológica inadecuada', subtitle: 'Limitaciones mentales o psicológicas' },
        { id: 3, title: 'Tensión física o fisiológica', subtitle: 'Estrés físico o fatiga' },
        { id: 4, title: 'Tensión mental o psicológica', subtitle: 'Estrés mental o emocional' },
        { id: 5, title: 'Falta de conocimiento', subtitle: 'Desconocimiento de procedimientos' },
        { id: 6, title: 'Falta de habilidad', subtitle: 'Carencia de destrezas necesarias' },
        { id: 7, title: 'Motivación incorrecta', subtitle: 'Actitudes inadecuadas hacia la seguridad' },
        { id: 8, title: 'Liderazgo y/o supervisión inadecuados', subtitle: 'Deficiencias en la supervisión' },
        { id: 9, title: 'Ingeniería inadecuada', subtitle: 'Diseño deficiente de procesos' },
        { id: 10, title: 'Adquisiciones inadecuadas', subtitle: 'Compras sin criterios de seguridad' },
        { id: 11, title: 'Mantenimiento inadecuado', subtitle: 'Mantenimiento deficiente o inexistente' },
        { id: 12, title: 'Herramientas y equipos inadecuados', subtitle: 'Equipos inapropiados para la tarea' },
        { id: 13, title: 'Estándares de trabajo inadecuados', subtitle: 'Procedimientos deficientes' },
        { id: 14, title: 'Uso y desgaste', subtitle: 'Deterioro por uso normal' },
        { id: 15, title: 'Abuso o mal uso', subtitle: 'Uso inadecuado de equipos o instalaciones' }
      ]
    },
    nac: {
      title: 'Necesidades de Acción de Control',
      subtitle: 'Medidas preventivas y correctivas',
      color: '#45B7D1',
      total: 20,
      items: [
        { id: 1, title: 'Selección adecuada de personal', subtitle: 'Criterios de selección mejorados' },
        { id: 2, title: 'Ubicación adecuada del personal', subtitle: 'Asignación correcta de puestos' },
        { id: 3, title: 'Entrenamiento inicial adecuado', subtitle: 'Capacitación inicial completa' },
        { id: 4, title: 'Entrenamiento de actualización', subtitle: 'Capacitación continua y actualizada' },
        { id: 5, title: 'Entrenamiento de nuevos procedimientos', subtitle: 'Capacitación en cambios' },
        { id: 6, title: 'Práctica y ejercicios', subtitle: 'Simulacros y práctica regular' },
        { id: 7, title: 'Liderazgo/supervisión', subtitle: 'Mejora en supervisión y liderazgo' },
        { id: 8, title: 'Motivación/concienciación', subtitle: 'Programas de motivación' },
        { id: 9, title: 'Diseño/rediseño del proceso', subtitle: 'Mejoras en el diseño' },
        { id: 10, title: 'Revisión/actualización de especificaciones', subtitle: 'Actualización de especificaciones' },
        { id: 11, title: 'Inspección/evaluación inicial', subtitle: 'Evaluaciones iniciales mejoradas' },
        { id: 12, title: 'Inspección/evaluación de rutina', subtitle: 'Inspecciones regulares' },
        { id: 13, title: 'Mantenimiento/reparación', subtitle: 'Programas de mantenimiento' },
        { id: 14, title: 'Comunicación mejorada', subtitle: 'Sistemas de comunicación' },
        { id: 15, title: 'Definición/revisión de responsabilidades', subtitle: 'Clarificación de roles' },
        { id: 16, title: 'Definición/revisión de estándares', subtitle: 'Actualización de estándares' },
        { id: 17, title: 'Definición/revisión de procedimientos', subtitle: 'Mejora de procedimientos' },
        { id: 18, title: 'Cumplimiento/aplicación mejorados', subtitle: 'Mejor aplicación de normas' },
        { id: 19, title: 'Controles de ingeniería', subtitle: 'Controles técnicos mejorados' },
        { id: 20, title: 'Equipo de protección personal', subtitle: 'Mejoras en EPP' }
      ]
    }
  };

  const currentSection = sectionsData[selectedSection];
  const progress = state.currentProject ? calculateProgress(state.currentProject) : { ci: 0, cb: 0, nac: 0, total: 0 };

  const handleSectionChange = (section: 'ci' | 'cb' | 'nac') => {
    setSelectedSection(section);
    dispatch({ type: 'SET_CURRENT_SECTION', payload: section });
  };

  const handleItemClick = (itemId: number) => {
    router.push(`/dashboard/tabla-scat/${selectedSection}/${itemId}`);
  };

  const handleCameraClick = () => {
    console.log('Abrir cámara');
  };

  const handleSearchClick = () => {
    console.log('Abrir búsqueda');
  };

  const handleFileClick = () => {
    console.log('Abrir archivos');
  };

  const handleSaveClick = () => {
    console.log('Guardar progreso');
  };

  const getItemProgress = (itemId: number) => {
    if (!state.currentProject) return 0;
    const sectionProgress = state.currentProject.scatProgress[selectedSection];
    return sectionProgress[itemId.toString()] ? 100 : 0;
  };

  const isItemCompleted = (itemId: number) => {
    if (!state.currentProject) return false;
    const sectionProgress = state.currentProject.scatProgress[selectedSection];
    return !!sectionProgress[itemId.toString()];
  };

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Header con tabs */}
      <SCATHeader
        currentTab={selectedSection}
        onTabChange={handleSectionChange}
      />

      {/* Contenido principal */}
      <div className="px-8 py-8">
        {/* Información de la sección */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentSection.title}</h2>
              <p className="text-[#B3B3B3] text-lg">{currentSection.subtitle}</p>
            </div>
            
            {/* Estadísticas de progreso */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {progress[selectedSection]}%
                </div>
                <div className="text-[#B3B3B3] text-sm">Completado</div>
              </div>
              
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#404040"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={currentSection.color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - progress[selectedSection] / 100)
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {Object.values(state.currentProject?.scatProgress[selectedSection] || {}).filter(Boolean).length}/{currentSection.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso lineal */}
          <div className="w-full bg-[#404040] rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: currentSection.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress[selectedSection]}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Grid de elementos */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {currentSection.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <SCATItemCard
                number={item.id}
                title={item.title}
                subtitle={item.subtitle}
                isCompleted={isItemCompleted(item.id)}
                progress={getItemProgress(item.id)}
                onClick={() => handleItemClick(item.id)}
                variant="detailed"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Barra de acciones */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <ActionBar
            onCameraClick={handleCameraClick}
            onSearchClick={handleSearchClick}
            onFileClick={handleFileClick}
            onSaveClick={handleSaveClick}
            className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/10"
          />
        </motion.div>
      </div>

      {/* Información adicional */}
      <motion.div
        className="bg-[#2E2E2E] border-t border-[#555555] px-8 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-white font-medium text-lg mb-4">Instrucciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#B3B3B3] text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">1. Seleccionar Causa</h4>
              <p>Haz clic en cualquier elemento para analizar esa causa específica y sus subcausas.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">2. Validar Respuestas</h4>
              <p>Responde las preguntas P/E/C para cada causa identificada en el análisis.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">3. Documentar Observaciones</h4>
              <p>Agrega comentarios y evidencias para respaldar tu análisis de causas.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TablaSCATPage;
