'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import NACModal from '../../../components/NACModal';

// Icons
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,16V18H8V16H6M4,12V11H6V12H4M9,12V11H10V12H9M6,12V11H8V12H6Z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const DoubleArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M5.88,4.12L13.76,12L5.88,19.88L7.29,21.29L16.59,12L7.29,2.71L5.88,4.12M11.88,4.12L19.76,12L11.88,19.88L13.29,21.29L22.59,12L13.29,2.71L11.88,4.12Z"/>
  </svg>
);

// Header Tags Component
const HeaderTag: React.FC<{ 
  text: string; 
  bgColor: string; 
  textColor?: string;
  isActive?: boolean;
}> = ({ text, bgColor, textColor = 'white', isActive = false }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
      isActive ? 'ring-2 ring-yellow-400 shadow-lg' : ''
    }`}
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    {text}
  </motion.div>
);

// NAC Grid Item Component
const NACGridItem: React.FC<{
  number: number;
  title: string;
  status: 'none' | 'completed' | 'partial' | 'not-completed';
  onClick?: () => void;
}> = ({ number, title, status, onClick }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return '#00D26A';
      case 'partial': return '#FFD600';
      case 'not-completed': return '#FF3B30';
      default: return 'transparent';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return '✅';
      case 'partial': return '⚠️';
      case 'not-completed': return '❌';
      default: return '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-[#2E2E2E] rounded-xl p-4 transition-all duration-200 cursor-pointer
        hover:bg-[#353535] hover:shadow-xl relative overflow-hidden
        ${status !== 'none' ? 'ring-2' : ''}
      `}
      style={{ 
        borderColor: status !== 'none' ? getStatusColor() : 'transparent'
      }}
      onClick={onClick}
    >
      {/* Status indicator */}
      {status !== 'none' && (
        <div 
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ backgroundColor: getStatusColor() }}
        >
          {getStatusIcon()}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {number}
          </div>
          <span className="text-white font-semibold text-sm uppercase leading-tight">
            {title}
          </span>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-[#FFD600] rounded-lg flex items-center justify-center ml-3 flex-shrink-0"
        >
          <DoubleArrowIcon />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Question Button Component
const QuestionButton: React.FC<{
  code: string;
  color: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ code, color, text, isSelected, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200
      ${isSelected 
        ? 'bg-opacity-20 ring-2' 
        : 'bg-[#404040] hover:bg-[#4A4A4A]'
      }
    `}
    style={{ 
      backgroundColor: isSelected ? `${color}20` : undefined,
      '--ring-color': isSelected ? color : 'transparent'
    } as React.CSSProperties & { '--ring-color': string }}
  >
    <div 
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {code}
    </div>
    <span className="text-white text-sm font-medium flex-1">{text}</span>
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        ✓
      </motion.div>
    )}
  </motion.div>
);

const NACPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModal, setSelectedModal] = useState<number | null>(null);
  const [itemStatuses, setItemStatuses] = useState<Record<number, 'none' | 'completed' | 'partial' | 'not-completed'>>({});
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const nacItems = [
    { 
      number: 1, 
      title: "LIDERAZGO Y ADMINISTRACIÓN",
      description: "Establece el compromiso visible de la alta dirección con la seguridad y salud ocupacional, definiendo políticas claras, asignando recursos y responsabilidades específicas.",
      examples: [
        "Política de seguridad firmada por la alta dirección",
        "Reuniones regulares de comité de seguridad",
        "Asignación de presupuesto específico para seguridad",
        "Definición clara de roles y responsabilidades"
      ]
    },
    { 
      number: 2, 
      title: "ENTRENAMIENTO DE GERENCIA",
      description: "Capacitación específica para supervisores y gerentes en temas de seguridad, liderazgo en prevención y gestión de riesgos.",
      examples: [
        "Programas de capacitación en liderazgo de seguridad",
        "Entrenamiento en investigación de incidentes",
        "Cursos de comunicación efectiva en seguridad",
        "Certificaciones en gestión de riesgos"
      ]
    },
    { 
      number: 3, 
      title: "INSPECCIONES PLANIFICADAS",
      description: "Sistema estructurado de inspecciones regulares para identificar condiciones y actos inseguros antes de que causen incidentes.",
      examples: [
        "Cronograma de inspecciones por área",
        "Listas de verificación estandarizadas",
        "Sistema de seguimiento de hallazgos",
        "Inspecciones de equipos críticos"
      ]
    },
    { 
      number: 4, 
      title: "ANÁLISIS Y PROCEDIMIENTOS DE TAREAS",
      description: "Análisis sistemático de tareas críticas para identificar riesgos y establecer procedimientos seguros de trabajo.",
      examples: [
        "Análisis de seguridad en el trabajo (AST)",
        "Procedimientos operativos estándar",
        "Permisos de trabajo para tareas críticas",
        "Evaluación de riesgos por tarea"
      ]
    },
    { 
      number: 5, 
      title: "INVESTIGACIÓN DE ACCIDENTES/INCIDENTES",
      description: "Proceso sistemático para investigar todos los incidentes, identificar causas raíz y implementar medidas correctivas.",
      examples: [
        "Metodología de investigación estructurada",
        "Equipo de investigación capacitado",
        "Formularios de reporte estandarizados",
        "Sistema de seguimiento de acciones correctivas"
      ]
    },
    { 
      number: 6, 
      title: "PREPARACIÓN PARA EMERGENCIAS",
      description: "Planes y procedimientos para responder efectivamente a situaciones de emergencia y minimizar sus consecuencias.",
      examples: [
        "Plan de emergencias actualizado",
        "Brigadas de emergencia entrenadas",
        "Simulacros regulares",
        "Equipos de emergencia disponibles"
      ]
    },
    { 
      number: 7, 
      title: "REGLAS DE LA ORGANIZACIÓN",
      description: "Normas y reglas claras de seguridad que todos los empleados deben conocer y cumplir.",
      examples: [
        "Reglamento interno de seguridad",
        "Reglas de oro de seguridad",
        "Procedimientos disciplinarios por incumplimiento",
        "Comunicación efectiva de las reglas"
      ]
    },
    { 
      number: 8, 
      title: "ANÁLISIS DE ACCIDENTES/INCIDENTES",
      description: "Análisis estadístico y de tendencias de los incidentes para identificar patrones y áreas de mejora.",
      examples: [
        "Indicadores de seguridad (frecuencia, severidad)",
        "Análisis de tendencias mensuales",
        "Benchmarking con la industria",
        "Reportes gerenciales de seguridad"
      ]
    },
    { 
      number: 9, 
      title: "ENTRENAMIENTO DE EMPLEADOS",
      description: "Programas de capacitación continua para todos los empleados en temas de seguridad específicos a sus funciones.",
      examples: [
        "Inducción de seguridad para nuevos empleados",
        "Capacitación específica por puesto de trabajo",
        "Entrenamientos de actualización periódicos",
        "Certificaciones de competencia"
      ]
    },
    { 
      number: 10, 
      title: "EQUIPO DE PROTECCIÓN PERSONAL",
      description: "Selección, provisión, uso y mantenimiento adecuado de equipos de protección personal.",
      examples: [
        "Matriz de EPP por puesto de trabajo",
        "Programa de entrega y reposición",
        "Capacitación en uso correcto",
        "Inspección y mantenimiento de EPP"
      ]
    },
    { 
      number: 11, 
      title: "CONTROL DE SALUD",
      description: "Programas de vigilancia de la salud ocupacional y control de exposiciones a riesgos higiénicos.",
      examples: [
        "Exámenes médicos ocupacionales",
        "Monitoreo de exposiciones",
        "Programas de vigilancia epidemiológica",
        "Control de ausentismo por enfermedad"
      ]
    },
    { 
      number: 12, 
      title: "SISTEMA DE EVALUACIÓN DEL PROGRAMA",
      description: "Mecanismos para evaluar la efectividad del sistema de gestión de seguridad y salud ocupacional.",
      examples: [
        "Auditorías internas de seguridad",
        "Revisiones gerenciales del sistema",
        "Indicadores de desempeño",
        "Planes de mejora continua"
      ]
    },
    { 
      number: 13, 
      title: "CONTROLES DE INGENIERÍA",
      description: "Implementación de controles técnicos y de ingeniería para eliminar o reducir los riesgos en la fuente.",
      examples: [
        "Sistemas de ventilación",
        "Guardas de seguridad en máquinas",
        "Sistemas de bloqueo y etiquetado",
        "Diseño seguro de instalaciones"
      ]
    },
    { 
      number: 14, 
      title: "COMUNICACIONES PERSONALES",
      description: "Comunicación directa y personalizada sobre temas de seguridad entre supervisores y empleados.",
      examples: [
        "Charlas de seguridad diarias",
        "Retroalimentación individual sobre comportamientos",
        "Reconocimiento por prácticas seguras",
        "Coaching en seguridad"
      ]
    },
    { 
      number: 15, 
      title: "COMUNICACIONES DE GRUPO",
      description: "Comunicación masiva y grupal sobre temas de seguridad para toda la organización.",
      examples: [
        "Reuniones de seguridad grupales",
        "Boletines informativos de seguridad",
        "Campañas de concientización",
        "Carteleras y señalización"
      ]
    },
    { 
      number: 16, 
      title: "PROMOCIÓN GENERAL",
      description: "Actividades para promover una cultura de seguridad positiva en toda la organización.",
      examples: [
        "Concursos de seguridad",
        "Semanas de la seguridad",
        "Reconocimientos y premios",
        "Eventos de promoción de seguridad"
      ]
    },
    { 
      number: 17, 
      title: "CONTRATACIÓN Y COLOCACIÓN",
      description: "Procesos para asegurar que las personas contratadas tengan las competencias necesarias para trabajar de forma segura.",
      examples: [
        "Evaluación de competencias en seguridad",
        "Exámenes médicos pre-ocupacionales",
        "Verificación de antecedentes",
        "Asignación según aptitudes físicas"
      ]
    },
    { 
      number: 18, 
      title: "CONTROL DE COMPRAS",
      description: "Procedimientos para asegurar que los materiales, equipos y servicios adquiridos cumplan con estándares de seguridad.",
      examples: [
        "Especificaciones de seguridad en compras",
        "Evaluación de proveedores en seguridad",
        "Certificaciones de productos",
        "Inspección de materiales recibidos"
      ]
    },
    { 
      number: 19, 
      title: "SEGURIDAD FUERA DEL TRABAJO",
      description: "Programas para promover la seguridad de los empleados fuera del ambiente laboral.",
      examples: [
        "Programas de seguridad vial",
        "Capacitación en seguridad doméstica",
        "Promoción de estilos de vida saludables",
        "Apoyo en situaciones de emergencia personal"
      ]
    },
    { 
      number: 20, 
      title: "SEGURIDAD PARA VISITANTES",
      description: "Procedimientos y controles para asegurar la seguridad de visitantes, contratistas y personal temporal.",
      examples: [
        "Inducción de seguridad para visitantes",
        "Control de acceso a áreas restringidas",
        "Acompañamiento obligatorio",
        "Entrega de EPP temporal"
      ]
    }
  ];

  const questions = [
    { code: 'P', color: '#FF3B30', text: '¿Existe un estándar definido para esta actividad?' },
    { code: 'E', color: '#FFD600', text: '¿Son adecuados los estándares existentes?' },
    { code: 'C', color: '#00D26A', text: '¿Hay un cumplimiento total de los estándares?' }
  ];

  // Filtered items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm) return nacItems;
    return nacItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.number.toString().includes(searchTerm)
    );
  }, [searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = nacItems.length;
    const completed = Object.values(itemStatuses).filter(status => status === 'completed').length;
    const partial = Object.values(itemStatuses).filter(status => status === 'partial').length;
    const notCompleted = Object.values(itemStatuses).filter(status => status === 'not-completed').length;
    const pending = total - completed - partial - notCompleted;
    
    return { total, completed, partial, notCompleted, pending };
  }, [itemStatuses]);

  const handleBack = () => {
    router.push('/tabla-scat/cb');
  };

  const handleGrid = () => {
    router.push('/tabla-scat');
  };

  const handleItemClick = (itemNumber: number) => {
    setSelectedModal(itemNumber);
  };

  const handleStatusChange = (itemNumber: number, status: 'none' | 'completed' | 'partial' | 'not-completed') => {
    setItemStatuses(prev => ({
      ...prev,
      [itemNumber]: status
    }));
  };

  const handleQuestionToggle = (questionCode: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionCode)
        ? prev.filter(q => q !== questionCode)
        : [...prev, questionCode]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const selectedItem = selectedModal ? nacItems.find(item => item.number === selectedModal) : null;

  return (
    <div className="min-h-screen bg-[#2E2E2E]">
      {/* Header */}
      <div className="bg-black px-12 py-6 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white font-bold text-3xl tracking-wide"
          >
            TABLA SCAT
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#FFC107] font-bold text-xl"
          >
            Técnica de Análisis Sistemático de las Causas
          </motion.h2>
        </div>
      </div>

      {/* Category Tags */}
      <div className="px-12 py-6 bg-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <HeaderTag 
              text="EVALUACIÓN POTENCIAL DE PÉRDIDA" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="Tipo de Contacto o Causal" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="(CI) Causas Inmediatas" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="(CB) Causas Básicas" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="(NAC) Necesidades de Acción de Control" 
              bgColor="#FFD600" 
              textColor="black"
              isActive={true}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Stats */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#404040] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00D26A] rounded-full"></div>
                  <span className="text-white">Cumplido: {stats.completed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FFD600] rounded-full"></div>
                  <span className="text-white">Parcial: {stats.partial}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FF3B30] rounded-full"></div>
                  <span className="text-white">No Cumplido: {stats.notCompleted}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-white">Pendiente: {stats.pending}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NAC Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NACGridItem
                    number={item.number}
                    title={item.title}
                    status={itemStatuses[item.number] || 'none'}
                    onClick={() => handleItemClick(item.number)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Key Questions Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#3C3C3C] rounded-xl p-8 mb-8"
          >
            <h3 className="text-white font-bold text-xl mb-6 text-center">
              Preguntas Clave de Validación
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {questions.map((question) => (
                <QuestionButton
                  key={question.code}
                  code={question.code}
                  color={question.color}
                  text={question.text}
                  isSelected={selectedQuestions.includes(question.code)}
                  onClick={() => handleQuestionToggle(question.code)}
                />
              ))}
            </div>
          </motion.div>

          {/* Progress Summary */}
          {Object.keys(itemStatuses).length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#2E2E2E] rounded-xl p-6 mb-8"
            >
              <h4 className="text-[#FFC107] font-semibold text-lg mb-4">
                Resumen de Evaluación
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00D26A]">{stats.completed}</div>
                  <div className="text-sm text-gray-400">Cumplidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFD600]">{stats.partial}</div>
                  <div className="text-sm text-gray-400">Parciales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF3B30]">{stats.notCompleted}</div>
                  <div className="text-sm text-gray-400">No Cumplidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">{stats.pending}</div>
                  <div className="text-sm text-gray-400">Pendientes</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-[#00D26A] via-[#FFD600] to-[#FF3B30] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((stats.completed + stats.partial + stats.notCompleted) / stats.total) * 100}%` }}
                />
              </div>
              
              <div className="text-center text-sm text-gray-400">
                {Math.round(((stats.completed + stats.partial + stats.notCompleted) / stats.total) * 100)}% evaluado
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-8 right-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black rounded-2xl p-4 flex items-center gap-4 shadow-2xl"
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200"
            title="Regresar"
          >
            <ArrowLeftIcon />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleGrid}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200"
            title="Índice SCAT"
          >
            <GridIcon />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200"
            title="Vista previa de evaluación"
          >
            <EyeIcon />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
              isSaving 
                ? 'bg-[#FFD600] animate-pulse' 
                : 'hover:bg-gray-800'
            }`}
            title="Guardar evaluación"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <SaveIcon />
              </motion.div>
            ) : (
              <SaveIcon />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Modal */}
      <NACModal
        isOpen={selectedModal !== null}
        onClose={() => setSelectedModal(null)}
        item={selectedItem || null}
        status={selectedModal ? (itemStatuses[selectedModal] || 'none') : 'none'}
        onStatusChange={(status) => {
          if (selectedModal) {
            handleStatusChange(selectedModal, status);
          }
        }}
      />
    </div>
  );
};

export default NACPage;
