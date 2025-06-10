'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Icons
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const ActionIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
  </svg>
);

// Mini CB Card Component
const CBMiniCard: React.FC<{
  number: number;
  title: string;
  subcauses: Array<{ number: string; text: string; }>;
  onClick: () => void;
}> = ({ number, title, subcauses, onClick }) => (
  <div 
    className="bg-[#2E2E2E] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
    onClick={onClick}
  >
    {/* Mini Header */}
    <div className="bg-[#3C3C3C] px-4 py-3 flex items-center justify-between">
      <div>
        <h3 className="text-white font-bold text-lg">
          <span className="text-2xl mr-2 text-[#FFD600]">{number}</span>
          <span className="text-sm">{title}</span>
        </h3>
      </div>
      <button className="w-6 h-6 bg-[#404040] rounded flex items-center justify-center">
        <SaveIcon />
      </button>
    </div>
    
    {/* Mini Subcauses List */}
    <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
      {subcauses.slice(0, 8).map((subcause, index) => (
        <div key={index} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#FFD600] font-semibold min-w-[2rem]">{subcause.number}</span>
            <span className="text-gray-300 truncate">{subcause.text}</span>
          </div>
          <button className="w-6 h-6 bg-[#FFD600] rounded-full flex items-center justify-center flex-shrink-0">
            <ActionIcon />
          </button>
        </div>
      ))}
      {subcauses.length > 8 && (
        <div className="text-center text-gray-500 text-xs py-1">
          +{subcauses.length - 8} más...
        </div>
      )}
    </div>
    
    {/* Mini Action Icons */}
    <div className="bg-[#404040] px-4 py-2 flex justify-center gap-3">
      <button className="w-8 h-8 bg-[#2E2E2E] rounded flex items-center justify-center border border-gray-600">
        <CameraIcon />
      </button>
      <button className="w-8 h-8 bg-[#2E2E2E] rounded flex items-center justify-center border border-gray-600">
        <DocumentIcon />
      </button>
    </div>
    
    {/* Mini Navigation */}
    <div className="bg-[#5C5C5C] px-4 py-2 flex items-center justify-center gap-3">
      <div className="w-6 h-6 bg-[#404040] rounded flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
      <div className="w-6 h-6 bg-[#FFD600] rounded flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="black">
          <path d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,16V18H8V16H6M4,12V11H6V12H4M9,12V11H10V12H9M6,12V11H8V12H6Z"/>
        </svg>
      </div>
      <div className="w-6 h-6 bg-[#404040] rounded flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
      </div>
    </div>
  </div>
);

const CBIndexPage: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/tabla-scat/contacto');
  };

  const handleNext = () => {
    router.push('/tabla-scat/actos');
  };

  const handleMenu = () => {
    router.push('/tabla-scat');
  };

  const handleCBClick = (cbNumber: number) => {
    // Handle CB card click
    console.log(`CB ${cbNumber} clicked`);
  };

  const cbData = [
    {
      number: 1,
      title: "Capacidad Física / Fisiológica Inadecuada",
      subcauses: [
        { number: "1.1", text: "Estatura, peso, fuerza inadecuados" },
        { number: "1.2", text: "Rango de movimiento corporal limitado" },
        { number: "1.3", text: "Capacidad limitada para mantener posiciones corporales" },
        { number: "1.4", text: "Sensibilidad a ciertas sustancias o alergias" },
        { number: "1.5", text: "Sensibilidad a extremos sensoriales" },
        { number: "1.6", text: "Defecto de visión" },
        { number: "1.7", text: "Defecto de audición" },
        { number: "1.8", text: "Otras deficiencias sensoriales" },
        { number: "1.9", text: "Incapacidad respiratoria" },
        { number: "1.10", text: "Otras incapacidades físicas permanentes" },
        { number: "1.11", text: "Incapacidades temporales" }
      ]
    },
    {
      number: 2,
      title: "Capacidad Mental/Psicológica Inadecuada",
      subcauses: [
        { number: "2.1", text: "Miedos y fobias" },
        { number: "2.2", text: "Problemas emocionales" },
        { number: "2.3", text: "Enfermedad mental" },
        { number: "2.4", text: "Nivel de inteligencia" },
        { number: "2.5", text: "Incapacidad de comprensión" },
        { number: "2.6", text: "Falta de juicio" },
        { number: "2.7", text: "Coordinación deficiente" },
        { number: "2.8", text: "Tiempo de reacción lento" },
        { number: "2.9", text: "Aptitud mecánica deficiente" },
        { number: "2.10", text: "Incapacidad de aprendizaje" },
        { number: "2.11", text: "Problemas de memoria" }
      ]
    },
    {
      number: 3,
      title: "Tensión Física o Fisiológica",
      subcauses: [
        { number: "3.1", text: "Lesión o enfermedad" },
        { number: "3.2", text: "Fatiga debido a la carga o duración de la tarea" },
        { number: "3.3", text: "Fatiga debido a la falta de descanso" },
        { number: "3.4", text: "Fatiga debido a sobrecarga sensorial" },
        { number: "3.5", text: "Exposición a riesgos contra la salud" },
        { number: "3.6", text: "Exposición a temperaturas extremas" },
        { number: "3.7", text: "Insuficiencia de oxígeno" },
        { number: "3.8", text: "Variaciones en la presión atmosférica" },
        { number: "3.9", text: "Vibración" },
        { number: "3.10", text: "Insuficiencia de azúcar en sangre" },
        { number: "3.11", text: "Ingestión de drogas" }
      ]
    },
    {
      number: 4,
      title: "Tensión Mental o Psicológica",
      subcauses: [
        { number: "4.1", text: "Sobrecarga emocional" },
        { number: "4.2", text: "Fatiga debido a la carga o duración de la tarea mental" },
        { number: "4.3", text: "Problemas financieros extremos" },
        { number: "4.4", text: "Problemas familiares" },
        { number: "4.5", text: "Problemas emocionales" },
        { number: "4.6", text: "Enfermedad en la familia" },
        { number: "4.7", text: "Muerte en la familia" },
        { number: "4.8", text: "Problemas maritales" },
        { number: "4.9", text: "Frustración" },
        { number: "4.10", text: "Conflictos de personalidad" },
        { number: "4.11", text: "Enfermedad mental" }
      ]
    },
    {
      number: 5,
      title: "Falta de Conocimientos",
      subcauses: [
        { number: "5.1", text: "Falta de experiencia" },
        { number: "5.2", text: "Orientación inadecuada" },
        { number: "5.3", text: "Entrenamiento inicial inadecuado" },
        { number: "5.4", text: "Reentrenamiento inadecuado" },
        { number: "5.5", text: "Instrucciones malentendidas" }
      ]
    },
    {
      number: 6,
      title: "Falta de Habilidad",
      subcauses: [
        { number: "6.1", text: "Instrucción inicial inadecuada" },
        { number: "6.2", text: "Práctica inadecuada" },
        { number: "6.3", text: "Operación esporádica" },
        { number: "6.4", text: "Falta de preparación" },
        { number: "6.5", text: "Falta de habilidades de liderazgo" }
      ]
    },
    {
      number: 7,
      title: "Motivación Incorrecta",
      subcauses: [
        { number: "7.1", text: "El desempeño incorrecto es premiado" },
        { number: "7.2", text: "El desempeño correcto no es premiado" },
        { number: "7.3", text: "El desempeño correcto es castigado" },
        { number: "7.4", text: "Falta de incentivos" },
        { number: "7.5", text: "Frustración excesiva" },
        { number: "7.6", text: "Agresión indebida" },
        { number: "7.7", text: "Intento indebido de ahorrar tiempo" },
        { number: "7.8", text: "Intento indebido de evitar esfuerzo" },
        { number: "7.9", text: "Intento indebido de evitar incomodidad" },
        { number: "7.10", text: "Intento indebido de llamar la atención" },
        { number: "7.11", text: "Presión indebida de los compañeros" },
        { number: "7.12", text: "Ejemplo personal deficiente por parte de la supervisión" },
        { number: "7.13", text: "Retroalimentación deficiente o incorrecta" },
        { number: "7.14", text: "Incentivos de producción incorrectos" }
      ]
    },
    {
      number: 8,
      title: "Liderazgo y/o Supervisión Inadecuados",
      subcauses: [
        { number: "8.1", text: "Relaciones jerárquicas confusas o conflictivas" },
        { number: "8.2", text: "Asignación de responsabilidades confusas o conflictivas" },
        { number: "8.3", text: "Delegación inadecuada o insuficiente" },
        { number: "8.4", text: "Definición inadecuada de políticas" },
        { number: "8.5", text: "Formulación inadecuada de objetivos" },
        { number: "8.6", text: "Formulación inadecuada de estándares de trabajo" },
        { number: "8.7", text: "Formulación inadecuada de procedimientos de trabajo" },
        { number: "8.8", text: "Programación o planificación inadecuada del trabajo" },
        { number: "8.9", text: "Instrucciones de trabajo inadecuadas" },
        { number: "8.10", text: "Orientación y entrenamiento inadecuados" },
        { number: "8.11", text: "Provisión inadecuada de referencias, documentos y guías" },
        { number: "8.12", text: "Identificación y evaluación inadecuadas de exposiciones a pérdidas" },
        { number: "8.13", text: "Falta de conocimiento del trabajo por parte de la supervisión" },
        { number: "8.14", text: "Ubicación inadecuada del trabajador" },
        { number: "8.15", text: "Medición y evaluación inadecuadas del desempeño" },
        { number: "8.16", text: "Retroalimentación inadecuada o incorrecta" }
      ]
    },
    {
      number: 9,
      title: "Ingeniería Inadecuada",
      subcauses: [
        { number: "9.1", text: "Otras deficiencias sensoriales" },
        { number: "9.2", text: "Defecto de visión" },
        { number: "9.3", text: "Defecto de audición" },
        { number: "9.4", text: "Otras incapacidades físicas permanentes" },
        { number: "9.5", text: "Incapacidades temporales" },
        { number: "9.6", text: "Frustración" },
        { number: "9.7", text: "Conflictos de personalidad" },
        { number: "9.8", text: "Enfermedad mental" },
        { number: "9.9", text: "Otras incapacidades físicas permanentes" },
        { number: "9.10", text: "Incapacidades temporales" },
        { number: "9.11", text: "Frustración" },
        { number: "9.12", text: "Conflictos de personalidad" },
        { number: "9.13", text: "Enfermedad mental" },
        { number: "9.14", text: "Otras incapacidades físicas permanentes" },
        { number: "9.15", text: "Incapacidades temporales" },
        { number: "9.16", text: "Frustración" },
        { number: "9.17", text: "Conflictos de personalidad" },
        { number: "9.18", text: "Enfermedad mental" },
        { number: "9.19", text: "Otras incapacidades físicas permanentes" },
        { number: "9.20", text: "Incapacidades temporales" },
        { number: "9.21", text: "Frustración" },
        { number: "9.22", text: "Conflictos de personalidad" },
        { number: "9.23", text: "Enfermedad mental" },
        { number: "9.24", text: "Otras incapacidades físicas permanentes" },
        { number: "9.25", text: "Incapacidades temporales" },
        { number: "9.26", text: "Frustración" },
        { number: "9.27", text: "Conflictos de personalidad" },
        { number: "9.28", text: "Enfermedad mental" },
        { number: "9.29", text: "Otras incapacidades físicas permanentes" },
        { number: "9.30", text: "Incapacidades temporales" },
        { number: "9.31", text: "Frustración" },
        { number: "9.32", text: "Conflictos de personalidad" },
        { number: "9.33", text: "Enfermedad mental" },
        { number: "9.34", text: "Otras incapacidades físicas permanentes" },
        { number: "9.35", text: "Incapacidades temporales" },
        { number: "9.36", text: "Frustración" },
        { number: "9.37", text: "Conflictos de personalidad" },
        { number: "9.38", text: "Enfermedad mental" },
        { number: "9.39", text: "Otras incapacidades físicas permanentes" },
        { number: "9.40", text: "Incapacidades temporales" },
        { number: "9.41", text: "Frustración" },
        { number: "9.42", text: "Conflictos de personalidad" },
        { number: "9.43", text: "Enfermedad mental" },
        { number: "9.44", text: "Otras incapacidades físicas permanentes" },
        { number: "9.45", text: "Incapacidades temporales" },
        { number: "9.46", text: "Frustración" },
        { number: "9.47", text: "Conflictos de personalidad" },
        { number: "9.48", text: "Enfermedad mental" },
        { number: "9.49", text: "Otras incapacidades físicas permanentes" },
        { number: "9.50", text: "Incapacidades temporales" },
        { number: "9.51", text: "Frustración" },
        { number: "9.52", text: "Conflictos de personalidad" },
        { number: "9.53", text: "Enfermedad mental" },
        { number: "9.54", text: "Otras incapacidades físicas permanentes" },
        { number: "9.55", text: "Incapacidades temporales" },
        { number: "9.56", text: "Frustración" },
        { number: "9.57", text: "Conflictos de personalidad" },
        { number: "9.58", text: "Enfermedad mental" },
        { number: "9.59", text: "Otras incapacidades físicas permanentes" },
        { number: "9.60", text: "Incapacidades temporales" },
        { number: "9.61", text: "Frustración" },
        { number: "9.62", text: "Conflictos de personalidad" },
        { number: "9.63", text: "Enfermedad mental" },
        { number: "9.64", text: "Otras incapacidades físicas permanentes" },
        { number: "9.65", text: "Incapacidades temporales" },
        { number: "9.66", text: "Frustración" },
        { number: "9.67", text: "Conflictos de personalidad" },
        { number: "9.68", text: "Enfermedad mental" },
        { number: "9.69", text: "Otras incapacidades físicas permanentes" },
        { number: "9.70", text: "Incapacidades temporales" },
        { number: "9.71", text: "Frustración" },
        { number: "9.72", text: "Conflictos de personalidad" },
        { number: "9.73", text: "Enfermedad mental" },
        { number: "9.74", text: "Otras incapacidades físicas permanentes" },
        { number: "9.75", text: "Incapacidades temporales" },
        { number: "9.76", text: "Frustración" },
        { number: "9.77", text: "Conflictos de personalidad" },
        { number: "9.78", text: "Enfermedad mental" },
        { number: "9.79", text: "Otras incapacidades físicas permanentes" },
        { number: "9.80", text: "Incapacidades temporales" },
        { number: "9.81", text: "Frustración" },
        { number: "9.82", text: "Conflictos de personalidad" },
        { number: "9.83", text: "Enfermedad mental" },
        { number: "9.84", text: "Otras incapacidades físicas permanentes" },
        { number: "9.85", text: "Incapacidades temporales" },
        { number: "9.86", text: "Frustración" },
        { number: "9.87", text: "Conflictos de personalidad" },
        { number: "9.88", text: "Enfermedad mental" },
        { number: "9.89", text: "Otras incapacidades físicas permanentes" },
        { number: "9.90", text: "Incapacidades temporales" },
        { number: "9.91", text: "Frustración" },
        { number: "9.92", text: "Conflictos de personalidad" },
        { number: "9.93", text: "Enfermedad mental" },
        { number: "9.94", text: "Otras incapacidades físicas permanentes" },
        { number: "9.95", text: "Incapacidades temporales" },
        { number: "9.96", text: "Frustración" },
        { number: "9.97", text: "Conflictos de personalidad" },
        { number: "9.98", text: "Enfermedad mental" },
        { number: "9.99", text: "Otras incapacidades físicas permanentes" },
        { number: "9.100", text: "Incapacidades temporales" },
        { number: "9.101", text: "Frustración" },
        { number: "9.102", text: "Conflictos de personalidad" },
        { number: "9.103", text: "Enfermedad mental" },
        { number: "9.104", text: "Otras incapacidades físicas permanentes" },
        { number: "9.105", text: "Incapacidades temporales" },
        { number: "9.106", text: "Frustración" },
        { number: "9.107", text: "Conflictos de personalidad" },
        { number: "9.108", text: "Enfermedad mental" },
        { number: "9.109", text: "Otras incapacidades físicas permanentes" },
        { number: "9.110", text: "Incapacidades temporales" },
        { number: "9.111", text: "Frustración" },
        { number: "9.112", text: "Conflictos de personalidad" },
        { number: "9.113", text: "Enfermedad mental" },
        { number: "9.114", text: "Otras incapacidades físicas permanentes" },
        { number: "9.115", text: "Incapacidades temporales" },
        { number: "9.116", text: "Frustración" },
        { number: "9.117", text: "Conflictos de personalidad" },
        { number: "9.118", text: "Enfermedad mental" },
        { number: "9.119", text: "Otras incapacidades físicas permanentes" },
        { number: "9.120", text: "Incapacidades temporales" },
        { number: "9.121", text: "Frustración" },
        { number: "9.122", text: "Conflictos de personalidad" },
        { number: "9.123", text: "Enfermedad mental" },
        { number: "9.124", text: "Otras incapacidades físicas permanentes" },
        { number: "9.125", text: "Incapacidades temporales" },
        { number: "9.126", text: "Frustración" },
        { number: "9.127", text: "Conflictos de personalidad" },
        { number: "9.128", text: "Enfermedad mental" },
        { number: "9.129", text: "Otras incapacidades físicas permanentes" },
        { number: "9.130", text: "Incapacidades temporales" },
        { number: "9.131", text: "Frustración" },
        { number: "9.132", text: "Conflictos de personalidad" },
        { number: "9.133", text: "Enfermedad mental" },
        { number: "9.134", text: "Otras incapacidades físicas permanentes" },
        { number: "9.135", text: "Incapacidades temporales" },
        { number: "9.136", text: "Frustración" },
        { number: "9.137", text: "Conflictos de personalidad" },
        { number: "9.138", text: "Enfermedad mental" },
        { number: "9.139", text: "Otras incapacidades físicas permanentes" },
        { number: "9.140", text: "Incapacidades temporales" },
        { number: "9.141", text: "Frustración" },
        { number: "9.142", text: "Conflictos de personalidad" },
        { number: "9.143", text: "Enfermedad mental" },
        { number: "9.144", text: "Otras incapacidades físicas permanentes" },
        { number: "9.145", text: "Incapacidades temporales" },
        { number: "9.146", text: "Frustración" },
        { number: "9.147", text: "Conflictos de personalidad" },
        { number: "9.148", text: "Enfermedad mental" },
        { number: "9.149", text: "Otras incapacidades físicas permanentes" },
        { number: "9.150", text: "Incapacidades temporales" },
        { number: "9.151", text: "Frustración" },
        { number: "9.152", text: "Conflictos de personalidad" },
        { number: "9.153", text: "Enfermedad mental" },
        { number: "9.154", text: "Otras incapacidades físicas permanentes" },
        { number: "9.155", text: "Incapacidades temporales" },
        { number: "9.156", text: "Frustración" },
        { number: "9.157", text: "Conflictos de personalidad" },
        { number: "9.158", text: "Enfermedad mental" },
        { number: "9.159", text: "Otras incapacidades físicas permanentes" },
        { number: "9.160", text: "Incapacidades temporales" },
        { number: "9.161", text: "Frustración" },
        { number: "9.162", text: "Conflictos de personalidad" },
        { number: "9.163", text: "Enfermedad mental" },
        { number: "9.164", text: "Otras incapacidades físicas permanentes" },
        { number: "9.165", text: "Incapacidades temporales" },
        { number: "9.166", text: "Frustración" },
        { number: "9.167", text: "Conflictos de personalidad" },
        { number: "9.168", text: "Enfermedad mental" },
        { number: "9.169", text: "Otras incapacidades físicas permanentes" },
        { number: "9.170", text: "Incapacidades temporales" },
        { number: "9.171", text: "Frustración" },
        { number: "9.172", text: "Conflictos de personalidad" },
        { number: "9.173", text: "Enfermedad mental" },
        { number: "9.174", text: "Otras incapacidades físicas permanentes" },
        { number: "9.175", text: "Incapacidades temporales" },
        { number: "9.176", text: "Frustración" },
        { number: "9.177", text: "Conflictos de personalidad" },
        { number: "9.178", text: "Enfermedad mental" },
        { number: "9.179", text: "Otras incapacidades físicas permanentes" },
        { number: "9.180", text: "Incapacidades temporales" },
        { number: "9.181", text: "Frustración" },
        { number: "9.182", text: "Conflictos de personalidad" },
        { number: "9.183", text: "Enfermedad mental" },
        { number: "9.184", text: "Otras incapacidades físicas permanentes" },
        { number: "9.185", text: "Incapacidades temporales" },
        { number: "9.186", text: "Frustración" },
        { number: "9.187", text: "Conflictos de personalidad" },
        { number: "9.188", text: "Enfermedad mental" },
        { number: "9.189", text: "Otras incapacidades físicas permanentes" },
        { number: "9.190", text: "Incapacidades temporales" },
        { number: "9.191", text: "Frustración" },
        { number: "9.192", text: "Conflictos de personalidad" },
        { number: "9.193", text: "Enfermedad mental" },
        { number: "9.194", text: "Otras incapacidades físicas permanentes" },
        { number: "9.195", text: "Incapacidades temporales" },
        { number: "9.196", text: "Frustración" },
        { number: "9.197", text: "Conflictos de personalidad" },
        { number: "9.198", text: "Enfermedad mental" },
        { number: "9.199", text: "Otras incapacidades físicas permanentes" },
        { number: "9.200", text: "Incapacidades temporales" },
        { number: "9.201", text: "Frustración" },
        { number: "9.202", text: "Conflictos de personalidad" },
        { number: "9.203", text: "Enfermedad mental" },
        { number: "9.204", text: "Otras incapacidades físicas permanentes" },
        { number: "9.205", text: "Incapacidades temporales" },
        { number: "9.206", text: "Frustración" },
        { number: "9.207", text: "Conflictos de personalidad" },
        { number: "9.208", text: "Enfermedad mental" },
        { number: "9.209", text: "Otras incapacidades físicas permanentes" },
        { number: "9.210", text: "Incapacidades temporales" },
        { number: "9.211", text: "Frustración" },
        { number: "9.212", text: "Conflictos de personalidad" },
        { number: "9.213", text: "Enfermedad mental" },
        { number: "9.214", text: "Otras incapacidades físicas permanentes" },
        { number: "9.215", text: "Incapacidades temporales" },
        { number: "9.216", text: "Frustración" },
        { number: "9.217", text: "Conflictos de personalidad" },
        { number: "9.218", text: "Enfermedad mental" },
        { number: "9.219", text: "Otras incapacidades físicas permanentes" },
        { number: "9.220", text: "Incapacidades temporales" },
        { number: "9.221", text: "Frustración" },
        { number: "9.222", text: "Conflictos de personalidad" },
        { number: "9.223", text: "Enfermedad mental" },
        { number: "9.224", text: "Otras incapacidades físicas permanentes" },
        { number: "9.225", text: "Incapacidades temporales" },
        { number: "9.226", text: "Frustración" },
        { number: "9.227", text: "Conflictos de personalidad" },
        { number: "9.228", text: "Enfermedad mental" },
        { number: "9.229", text: "Otras incapacidades físicas permanentes" },
        { number: "9.230", text: "Incapacidades temporales" },
        { number: "9.231", text: "Frustración" },
        { number: "9.232", text: "Conflictos de personalidad" },
        { number: "9.233", text: "Enfermedad mental" },
        { number: "9.234", text: "Otras incapacidades físicas permanentes" },
        { number: "9.235", text: "Incapacidades temporales" },
        { number: "9.236", text: "Frustración" },
        { number: "9.237", text: "Conflictos de personalidad" },
        { number: "9.238", text: "Enfermedad mental" },
        { number: "9.239", text: "Otras incapacidades físicas permanentes" },
        { number: "9.240", text: "Incapacidades temporales" },
        { number: "9.241", text: "Frustración" },
        { number: "9.242", text: "Conflictos de personalidad" },
        { number: "9.243", text: "Enfermedad mental" },
        { number: "9.244", text: "Otras incapacidades físicas permanentes" },
        { number: "9.245", text: "Incapacidades temporales" },
        { number: "9.246", text: "Frustración" },
        { number: "9.247", text: "Conflictos de personalidad" },
        { number: "9.248", text: "Enfermedad mental" },
        { number: "9.249", text: "Otras incapacidades físicas permanentes" },
        { number: "9.250", text: "Incapacidades temporales" },
        { number: "9.251", text: "Frustración" },
        { number: "9.252", text: "Conflictos de personalidad" },
        { number: "9.253", text: "Enfermedad mental" },
        { number: "9.254", text: "Otras incapacidades físicas permanentes" },
        { number: "9.255", text: "Incapacidades temporales" },
        { number: "9.256", text: "Frustración" },
        { number: "9.257", text: "Conflictos de personalidad" },
        { number: "9.258", text: "Enfermedad mental" },
        { number: "9.259", text: "Otras incapacidades físicas permanentes" },
        { number: "9.260", text: "Incapacidades temporales" },
        { number: "9.261", text: "Frustración" },
        { number: "9.262", text: "Conflictos de personalidad" },
        { number: "9.263", text: "Enfermedad mental" },
        { number: "9.264", text: "Otras incapacidades físicas permanentes" },
        { number: "9.265", text: "Incapacidades temporales" },
        { number: "9.266", text: "Frustración" },
        { number: "9.267", text: "Conflictos de personalidad" },
        { number: "9.268", text: "Enfermedad mental" },
        { number: "9.269", text: "Otras incapacidades físicas permanentes" },
        { number: "9.270", text: "Incapacidades temporales" },
        { number: "9.271", text: "Frustración" },
        { number: "9.272", text: "Conflictos de personalidad" },
        { number: "9.273", text: "Enfermedad mental" },
        { number: "9.274", text: "Otras incapacidades físicas permanentes" },
        { number: "9.275", text: "Incapacidades temporales" },
        { number: "9.276", text: "Frustración" },
        { number: "9.277", text: "Conflictos de personalidad" },
        { number: "9.278", text: "Enfermedad mental" },
        { number: "9.279", text: "Otras incapacidades físicas permanentes" },
        { number: "9.280", text: "Incapacidades temporales" },
        { number: "9.281", text: "Frustración" },
        { number: "9.282", text: "Conflictos de personalidad" },
        { number: "9.283", text: "Enfermedad mental" },
        { number: "9.284", text: "Otras incapacidades físicas permanentes" },
        { number: "9.285", text: "Incapacidades temporales" },
        { number: "9.286", text: "Frustración" },
        { number: "9.287", text: "Conflictos de personalidad" },
        { number: "9.288", text: "Enfermedad mental" },
        { number: "9.289", text: "Otras incapacidades físicas permanentes" },
        { number: "9.290", text: "Incapacidades temporales" },
        { number: "9.291", text: "Frustración" },
        { number: "9.292", text: "Conflictos de personalidad" },
        { number: "9.293", text: "Enfermedad mental" },
        { number: "9.294", text: "Otras incapacidades físicas permanentes" },
        { number: "9.295", text: "Incapacidades temporales" },
        { number: "9.296", text: "Frustración" },
        { number: "9.297", text: "Conflictos de personalidad" },
        { number: "9.298", text: "Enfermedad mental" },
        { number: "9.299", text: "Otras incapacidades físicas permanentes" },
        { number: "9.300", text: "Incapacidades temporales" },
        { number: "9.301", text: "Frustración" },
        { number: "9.302", text: "Conflictos de personalidad" },
        { number: "9.303", text: "Enfermedad mental" },
        { number: "9.304", text: "Otras incapacidades físicas permanentes" },
        { number: "9.305", text: "Incapacidades temporales" },
        { number: "9.306", text: "Frustración" },
        { number: "9.307", text: "Conflictos de personalidad" },
        { number: "9.308", text: "Enfermedad mental" },
        { number: "9.309", text: "Otras incapacidades físicas permanentes" },
        { number: "9.310", text: "Incapacidades temporales" },
        { number: "9.311", text: "Frustración" },
        { number: "9.312", text: "Conflictos de personalidad" },
        { number: "9.313", text: "Enfermedad mental" },
        { number: "9.314", text: "Otras incapacidades físicas permanentes" },
        { number: "9.315", text: "Incapacidades temporales" },
        { number: "9.316", text: "Frustración" },
        { number: "9.317", text: "Conflictos de personalidad" },
        { number: "9.318", text: "Enfermedad mental" },
        { number: "9.319", text: "Otras incapacidades físicas permanentes" },
        { number: "9.320", text: "Incapacidades temporales" },
        { number: "9.321", text: "Frustración" },
        { number: "9.322", text: "Conflictos de personalidad" },
        { number: "9.323", text: "Enfermedad mental" },
        { number: "9.324", text: "Otras incapacidades físicas permanentes" },
        { number: "9.325", text: "Incapacidades temporales" },
        { number: "9.326", text: "Frustración" },
        { number: "9.327", text: "Conflictos de personalidad" },
        { number: "9.328", text: "Enfermedad mental" },
        { number: "9.329", text: "Otras incapacidades físicas permanentes" },
        { number: "9.330", text: "Incapacidades temporales" },
        { number: "9.331", text: "Frustración" },
        { number: "9.332", text: "Conflictos de personalidad" },
        { number: "9.333", text: "Enfermedad mental" },
        { number: "9.334", text: "Otras incapacidades físicas permanentes" },
        { number: "9.335", text: "Incapacidades temporales" },
        { number: "9.336", text: "Frustración" },
        { number: "9.337", text: "Conflictos de personalidad" },
        { number: "9.338", text: "Enfermedad mental" },
        { number: "9.339", text: "Otras incapacidades físicas permanentes" },
        { number: "9.340", text: "Incapacidades temporales" },
        { number: "9.341", text: "Frustración" },
        { number: "9.342", text: "Conflictos de personalidad" },
        { number: "9.343", text: "Enfermedad mental" },
        { number: "9.344", text: "Otras incapacidades físicas permanentes" },
        { number: "9.345", text: "Incapacidades temporales" },
        { number: "9.346", text: "Frustración" },
        { number: "9.347", text: "Conflictos de personalidad" },
        { number: "9.348", text: "Enfermedad mental" },
        { number: "9.349", text: "Otras incapacidades físicas permanentes" },
        { number: "9.350", text: "Incapacidades temporales" },
        { number: "9.351", text: "Frustración" },
        { number: "9.352", text: "Conflictos de personalidad" },
        { number: "9.353", text: "Enfermedad mental" },
        { number: "9.354", text: "Otras incapacidades físicas permanentes" },
        { number: "9.355", text: "Incapacidades temporales" },
        { number: "9.356", text: "Frustración" },
        { number: "9.357", text: "Conflictos de personalidad" },
        { number: "9.358", text: "Enfermedad mental" },
        { number: "9.359", text: "Otras incapacidades físicas permanentes" },
        { number: "9.360", text: "Incapacidades temporales" },
        { number: "9.361", text: "Frustración" },
        { number: "9.362", text: "Conflictos de personalidad" },
        { number: "9.363", text: "Enfermedad mental" },
        { number: "9.364", text: "Otras incapacidades físicas permanentes" },
        { number: "9.365", text: "Incapacidades temporales" },
        { number: "9.366", text: "Frustración" },
        { number: "9.367", text: "Conflictos de personalidad" },
        { number: "9.368", text: "Enfermedad mental" },
        { number: "9.369", text: "Otras incapacidades físicas permanentes" },
        { number: "9.370", text: "Incapacidades temporales" },
        { number: "9.371", text: "Frustración" },
        { number: "9.372", text: "Conflictos de personalidad" },
        { number: "9.373", text: "Enfermedad mental" },
        { number: "9.374", text: "Otras incapacidades físicas permanentes" },
        { number: "9.375", text: "Incapacidades temporales" },
        { number: "9.376", text: "Frustración" },
        { number: "9.377", text: "Conflictos de personalidad" },
        { number: "9.378", text: "Enfermedad mental" },
        { number: "9.379", text: "Otras incapacidades físicas permanentes" },
        { number: "9.380", text: "Incapacidades temporales" },
        { number: "9.381", text: "Frustración" },
        { number: "9.382", text: "Conflictos de personalidad" },
        { number: "9.383", text: "Enfermedad mental" },
        { number: "9.384", text: "Otras incapacidades físicas permanentes" },
        { number: "9.385", text: "Incapacidades temporales" },
        { number: "9.386", text: "Frustración" },
        { number: "9.387", text: "Conflictos de personalidad" },
        { number: "9.388", text: "Enfermedad mental" },
        { number: "9.389", text: "Otras incapacidades físicas permanentes" },
        { number: "9.390", text: "Incapacidades temporales" },
        { number: "9.391", text: "Frustración" },
        { number: "9.392", text: "Conflictos de personalidad" },
        { number: "9.393", text: "Enfermedad mental" },
        { number: "9.394", text: "Otras incapacidades físicas permanentes" },
        { number: "9.395", text: "Incapacidades temporales" },
        { number: "9.396", text: "Frustración" },
        { number: "9.397", text: "Conflictos de personalidad" },
        { number: "9.398", text: "Enfermedad mental" },
        { number: "9.399", text: "Otras incapacidades físicas permanentes" },
        { number: "9.400", text: "Incapacidades temporales" },
        { number: "9.401", text: "Frustración" },
        { number: "9.402", text: "Conflictos de personalidad" },
        { number: "9.403", text: "Enfermedad mental" },
        { number: "9.404", text: "Otras incapacidades físicas permanentes" },
        { number: "9.405", text: "Incapacidades temporales" },
        { number: "9.406", text: "Frustración" },
        { number: "9.407", text: "Conflictos de personalidad" },
        { number: "9.408", text: "Enfermedad mental" },
        { number: "9.409", text: "Otras incapacidades físicas permanentes" },
        { number: "9.410", text: "Incapacidades temporales" },
        { number: "9.411", text: "Frustración" },
        { number: "9.412", text: "Conflictos de personalidad" },
        { number: "9.413", text: "Enfermedad mental" },
        { number: "9.414", text: "Otras incapacidades físicas permanentes" },
        { number: "9.415", text: "Incapacidades temporales" },
        { number: "9.416", text: "Frustración" },
        { number: "9.417", text: "Conflictos de personalidad" },
        { number: "9.418", text: "Enfermedad mental" },
        { number: "9.419", text: "Otras incapacidades físicas permanentes" },
        { number: "9.420", text: "Incapacidades temporales" },
        { number: "9.421", text: "Frustración" },
        { number: "9.422", text: "Conflictos de personalidad" },
        { number: "9.423", text: "Enfermedad mental" },
        { number: "9.424", text: "Otras incapacidades físicas permanentes" },
        { number: "9.425", text: "Incapacidades temporales" },
        { number: "9.426", text: "Frustración" },
        { number: "9.427", text: "Conflictos de personalidad" },
        { number: "9.428", text: "Enfermedad mental" },
        { number: "9.429", text: "Otras incapacidades físicas permanentes" },
        { number: "9.430", text: "Incapacidades temporales" },
        { number: "9.431", text: "Frustración" },
        { number: "9.432", text: "Conflictos de personalidad" },
        { number: "9.433", text: "Enfermedad mental" },
        { number: "9.434", text: "Otras incapacidades físicas permanentes" },
        { number: "9.435", text: "Incapacidades temporales" },
        { number: "9.436", text: "Frustración" },
        { number: "9.437", text: "Conflictos de personalidad" },
        { number: "9.438", text: "Enfermedad mental" },
        { number: "9.439", text: "Otras incapacidades físicas permanentes" },
        { number: "9.440", text: "Incapacidades temporales" },
        { number: "9.441", text: "Frustración" },
        { number: "9.442", text: "Conflictos de personalidad" },
        { number: "9.443", text: "Enfermedad mental" },
        { number: "9.444", text: "Otras incapacidades físicas permanentes" },
        { number: "9.445", text: "Incapacidades temporales" },
        { number: "9.446", text: "Frustración" },
        { number: "9.447", text: "Conflictos de personalidad" },
        { number: "9.448", text: "Enfermedad mental" },
        { number: "9.449", text: "Otras incapacidades físicas permanentes" },
        { number: "9.450", text: "Incapacidades temporales" },
        { number: "9.451", text: "Frustración" },
        { number: "9.452", text: "Conflictos de personalidad" },
        { number: "9.453", text: "Enfermedad mental" },
        { number: "9.454", text: "Otras incapacidades físicas permanentes" },
        { number: "9.455", text: "Incapacidades temporales" },
        { number: "9.456", text: "Frustración" },
        { number: "9.457", text: "Conflictos de personalidad" },
        { number: "9.458", text: "Enfermedad mental" },
        { number: "9.459", text: "Otras incapacidades físicas permanentes" },
        { number: "9.460", text: "Incapacidades temporales" },
        { number: "9.461", text: "Frustración" },
        { number: "9.462", text: "Conflictos de personalidad" },
        { number: "9.463", text: "Enfermedad mental" },
        { number: "9.464", text: "Otras incapacidades físicas permanentes" },
        { number: "9.465", text: "Incapacidades temporales" },
        { number: "9.466", text: "Frustración" },
        { number: "9.467", text: "Conflictos de personalidad" },
        { number: "9.468", text: "Enfermedad mental" },
        { number: "9.469", text: "Otras incapacidades físicas permanentes" },
        { number: "9.470", text: "Incapacidades temporales" },
        { number: "9.471", text: "Frustración" },
        { number: "9.472", text: "Conflictos de personalidad" },
        { number: "9.473", text: "Enfermedad mental" },
        { number: "9.474", text: "Otras incapacidades físicas permanentes" },
        { number: "9.475", text: "Incapacidades temporales" },
        { number: "9.476", text: "Frustración" },
        { number: "9.477", text: "Conflictos de personalidad" },
        { number: "9.478", text: "Enfermedad mental" },
        { number: "9.479", text: "Otras incapacidades físicas permanentes" },
        { number: "9.480", text: "Incapacidades temporales" },
        { number: "9.481", text: "Frustración" },
        { number: "9.482", text: "Conflictos de personalidad" },
        { number: "9.483", text: "Enfermedad mental" },
        { number: "9.484", text: "Otras incapacidades físicas permanentes" },
        { number: "9.485", text: "Incapacidades temporales" },
        { number: "9.486", text: "Frustración" },
        { number: "9.487", text: "Conflictos de personalidad" },
        { number: "9.488", text: "Enfermedad mental" },
        { number: "9.489", text: "Otras incapacidades físicas permanentes" },
        { number: "9.490", text: "Incapacidades temporales" },
        { number: "9.491", text: "Frustración" },
        { number: "9.492", text: "Conflictos de personalidad" },
        { number: "9.493", text: "Enfermedad mental" },
        { number: "9.494", text: "Otras incapacidades físicas permanentes" },
        { number: "9.495", text: "Incapacidades temporales" },
        { number: "9.496", text: "Frustración" },
        { number: "9.497", text: "Conflictos de personalidad" },
        { number: "9.498", text: "Enfermedad mental" },
        { number: "9.499", text: "Otras incapacidades físicas permanentes" },
        { number: "9.500", text: "Incapacidades temporales" },
        { number: "9.501", text: "Frustración" },
        { number: "9.502", text: "Conflictos de personalidad" },
        { number: "9.503", text: "Enfermedad mental" },
        { number: "9.504", text: "Otras incapacidades físicas permanentes" },
        { number: "9.505", text: "Incapacidades temporales" },
        { number: "9.506", text: "Frustración" },
        { number: "9.507", text: "Conflictos de personalidad" },
        { number: "9.508", text: "Enfermedad mental" },
        { number: "9.509", text: "Otras incapacidades físicas permanentes" },
        { number: "9.510", text: "Incapacidades temporales" },
        { number: "9.511", text: "Frustración" },
        { number: "9.512", text: "Conflictos de personalidad" },
        { number: "9.513", text: "Enfermedad mental" },
        { number: "9.514", text: "Otras incapacidades físicas permanentes" },
        { number: "9.515", text: "Incapacidades temporales" },
        { number: "9.516", text: "Frustración" },
        { number: "9.517", text: "Conflictos de personalidad" },
        { number: "9.518", text: "Enfermedad mental" },
        { number: "9.519", text: "Otras incapacidades físicas permanentes" },
        { number: "9.520", text: "Incapacidades temporales" },
        { number: "9.521", text: "Frustración" },
        { number: "9.522", text: "Conflictos de personalidad" },
        { number: "9.523", text: "Enfermedad mental" },
        { number: "9.524", text: "Otras incapacidades físicas permanentes" },
        { number: "9.525", text: "Incapacidades temporales" },
        { number: "9.526", text: "Frustración" },
        { number: "9.527", text: "Conflictos de personalidad" },
        { number: "9.528", text: "Enfermedad mental" },
        { number: "9.529", text: "Otras incapacidades físicas permanentes" },
        { number: "9.530", text: "Incapacidades temporales" },
        { number: "9.531", text: "Frustración" },
        { number: "9.532", text: "Conflictos de personalidad" },
        { number: "9.533", text: "Enfermedad mental" },
        { number: "9.534", text: "Otras incapacidades físicas permanentes" },
        { number: "9.535", text: "Incapacidades temporales" },
        { number: "9.536", text: "Frustración" },
        { number: "9.537", text: "Conflictos de personalidad" },
        { number: "9.538", text: "Enfermedad mental" },
        { number: "9.539", text: "Otras incapacidades físicas permanentes" },
        { number: "9.540", text: "Incapacidades temporales" },
        { number: "9.541", text: "Frustración" },
        { number: "9.542", text: "Conflictos de personalidad" },
        { number: "9.543", text: "Enfermedad mental" },
        { number: "9.544", text: "Otras incapacidades físicas permanentes" },
        { number: "9.545", text: "Incapacidades temporales" },
        { number: "9.546", text: "Frustración" },
        { number: "9.547", text: "Conflictos de personalidad" },
        { number: "9.548", text: "Enfermedad mental" },
        { number: "9.549", text: "Otras incapacidades físicas permanentes" },
        { number: "9.550", text: "Incapacidades temporales" },
        { number: "9.551", text: "Frustración" },
        { number: "9.552", text: "Conflictos de personalidad" },
        { number: "9.553", text: "Enfermedad mental" },
        { number: "9.554", text: "Otras incapacidades físicas permanentes" },
        { number: "9.555", text: "Incapacidades temporales" },
        { number: "9.556", text: "Frustración" },
        { number: "9.557", text: "Conflictos de personalidad" },
        { number: "9.558", text: "Enfermedad mental" },
        { number: "9.559", text: "Otras incapacidades físicas permanentes" },
        { number: "9.560", text: "Incapacidades temporales" },
        { number: "9.561", text: "Frustración" },
        { number: "9.562", text: "Conflictos de personalidad" },
        { number: "9.563", text: "Enfermedad mental" },
        { number: "9.564", text: "Otras incapacidades físicas permanentes" },
        { number: "9.565", text: "Incapacidades temporales" },
        { number: "9.566", text: "Frustración" },
        { number: "9.567", text: "Conflictos de personalidad" },
        { number: "9.568", text: "Enfermedad mental" },
        { number: "9.569", text: "Otras incapacidades físicas permanentes" },
        { number: "9.570", text: "Incapacidades temporales" },
        { number: "9.571", text: "Frustración" },
        { number: "9.572", text: "Conflictos de personalidad" },
        { number: "9.573", text: "Enfermedad mental" },
        { number: "9.574", text: "Otras incapacidades físicas permanentes" },
        { number: "9.575", text: "Incapacidades temporales" },
        { number: "9.576", text: "Frustración" },
        { number: "9.577", text: "Conflictos de personalidad" },
        { number: "9.578", text: "Enfermedad mental" },
        { number: "9.579", text: "Otras incapacidades físicas permanentes" },
        { number: "9.580", text: "Incapacidades temporales" },
        { number: "9.581", text: "Frustración" },
        { number: "9.582", text: "Conflictos de personalidad" },
        { number: "9.583", text: "Enfermedad mental" },
        { number: "9.584", text: "Otras incapacidades físicas permanentes" },
        { number: "9.585", text: "Incapacidades temporales" },
        { number: "9.586", text: "Frustración" },
        { number: "9.587", text: "Conflictos de personalidad" },
        { number: "9.588", text: "Enfermedad mental" },
        { number: "9.589", text: "Otras incapacidades físicas permanentes" },
        { number: "9.590", text: "Incapacidades temporales" },
        { number: "9.591", text: "Frustración" },
        { number: "9.592", text: "Conflictos de personalidad" },
        { number: "9.593", text: "Enfermedad mental" },
        { number: "9.594", text: "Otras incapacidades físicas permanentes" },
        { number: "9.595", text: "Incapacidades temporales" },
        { number: "9.596", text: "Frustración" },
        { number: "9.597", text: "Conflictos de personalidad" },
        { number: "9.598", text: "Enfermedad mental" },
        { number: "9.599", text: "Otras incapacidades físicas permanentes" },
        { number: "9.600", text: "Incapacidades temporales" },
        { number: "9.601", text: "Frustración" },
        { number: "9.602", text: "Conflictos de personalidad" },
        { number: "9.603", text: "Enfermedad mental" },
        { number: "9.604", text: "Otras incapacidades físicas permanentes" },
        { number: "9.605", text: "Incapacidades temporales" },
        { number: "9.606", text: "Frustración" },
        { number: "9.607", text: "Conflictos de personalidad" },
        { number: "9.608", text: "Enfermedad mental" },
        { number: "9.609", text: "Otras incapacidades físicas permanentes" },
        { number: "9.610", text: "Incapacidades temporales" },
        { number: "9.611", text: "Frustración" },
        { number: "9.612", text: "Conflictos de personalidad" },
        { number: "9.613", text: "Enfermedad mental" },
        { number: "9.614", text: "Otras incapacidades físicas permanentes" },
        { number: "9.615", text: "Incapacidades temporales" },
        { number: "9.616", text: "Frustración" },
        { number: "9.617", text: "Conflictos de personalidad" },
        { number: "9.618", text: "Enfermedad mental" },
        { number: "9.619", text: "Otras incapacidades físicas permanentes" },
        { number: "9.620", text: "Incapacidades temporales" },
        { number: "9.621", text: "Frustración" },
        { number: "9.622", text: "Conflictos de personalidad" },
        { number: "9.623", text: "Enfermedad mental" },
        { number: "9.624", text: "Otras incapacidades físicas permanentes" },
        { number: "9.625", text: "Incapacidades temporales" },
        { number: "9.626", text: "Frustración" },
        { number: "9.627", text: "Conflictos de personalidad" },
        { number: "9.628", text: "Enfermedad mental" },
        { number: "9.629", text: "Otras incapacidades físicas permanentes" },
        { number: "9.630", text: "Incapacidades temporales" },
        { number: "9.631", text: "Frustración" },
        { number: "9.632", text: "Conflictos de personalidad" },
        { number: "9.633", text: "Enfermedad mental" },
        { number: "9.634", text: "Otras incapacidades físicas permanentes" },
        { number: "9.635", text: "Incapacidades temporales" },
        { number: "9.636", text: "Frustración" },
        { number: "9.637", text: "Conflictos de personalidad" },
        { number: "9.638", text: "Enfermedad mental" },
        { number: "9.639", text: "Otras incapacidades físicas permanentes" },
        { number: "9.640", text: "Incapacidades temporales" },
        { number: "9.641", text: "Frustración" },
        { number: "9.642", text: "Conflictos de personalidad" },
        { number: "9.643", text: "Enfermedad mental" },
        { number: "9.644", text: "Otras incapacidades físicas permanentes" },
        { number: "9.645", text: "Incapacidades temporales" },
        { number: "9.646", text: "Frustración" },
        { number: "9.647", text: "Conflictos de personalidad" },
        { number: "9.648", text: "Enfermedad mental" },
        { number: "9.649", text: "Otras incapacidades físicas permanentes" },
        { number: "9.650", text: "Incapacidades temporales" },
        { number: "9.651", text: "Frustración" },
        { number: "9.652", text: "Conflictos de personalidad" },
        { number: "9.653", text: "Enfermedad mental" },
        { number: "9.654", text: "Otras incapacidades físicas permanentes" },
        { number: "9.655", text: "Incapacidades temporales" },
        { number: "9.656", text: "Frustración" },
        { number: "9.657", text: "Conflictos de personalidad" },
        { number: "9.658", text: "Enfermedad mental" },
        { number: "9.659", text: "Otras incapacidades físicas permanentes" },
        { number: "9.660", text: "Incapacidades temporales" },
        { number: "9.661", text: "Frustración" },
        { number: "9.662", text: "Conflictos de personalidad" },
        { number: "9.663", text: "Enfermedad mental" },
        { number: "9.664", text: "Otras incapacidades físicas permanentes" },
        { number: "9.665", text: "Incapacidades temporales" },
        { number: "9.666", text: "Frustración" },
        { number: "9.667", text: "Conflictos de personalidad" },
        { number: "9.668", text: "Enfermedad mental" },
        { number: "9.669", text: "Otras incapacidades físicas permanentes" },
        { number: "9.670", text: "Incapacidades temporales" },
        { number: "9.671", text: "Frustración" },
        { number: "9.672", text: "Conflictos de personalidad" },
        { number: "9.673", text: "Enfermedad mental" },
        { number: "9.674", text: "Otras incapacidades físicas permanentes" },
        { number: "9.675", text: "Incapacidades temporales" },
        { number: "9.676", text: "Frustración" },
        { number: "9.677", text: "Conflictos de personalidad" },
        { number: "9.678", text: "Enfermedad mental" },
        { number: "9.679", text: "Otras incapacidades físicas permanentes" },
        { number: "9.680", text: "Incapacidades temporales" },
        { number: "9.681", text: "Frustración" },
        { number: "9.682", text: "Conflictos de personalidad" },
        { number: "9.683", text: "Enfermedad mental" },
        { number: "9.684", text: "Otras incapacidades físicas permanentes" },
        { number: "9.685", text: "Incapacidades temporales" },
        { number: "9.686", text: "Frustración" },
        { number: "9.687", text: "Conflictos de personalidad" },
        { number: "9.688", text: "Enfermedad mental" },
        { number: "9.689", text: "Otras incapacidades físicas permanentes" },
        { number: "9.690", text: "Incapacidades temporales" },
        { number: "9.691", text: "Frustración" },
        { number: "9.692", text: "Conflictos de personalidad" },
        { number: "9.693", text: "Enfermedad mental" },
        { number: "9.694", text: "Otras incapacidades físicas permanentes" },
        { number: "9.695", text: "Incapacidades temporales" },
        { number: "9.696", text: "Frustración" },
        { number: "9.697", text: "Conflictos de personalidad" },
        { number: "9.698", text: "Enfermedad mental" },
        { number: "9.699", text: "Otras incapacidades físicas permanentes" },
        { number: "9.700", text: "Incapacidades temporales" },
        { number: "9.701", text: "Frustración" },
        { number: "9.702", text: "Conflictos de personalidad" },
        { number: "9.703", text: "Enfermedad mental" },
        { number: "9.704", text: "Otras incapacidades físicas permanentes" },
        { number: "9.705", text: "Incapacidades temporales" },
        { number: "9.706", text: "Frustración" },
        { number: "9.707", text: "Conflictos de personalidad" },
        { number: "9.708", text: "Enfermedad mental" },
        { number: "9.709", text: "Otras incapacidades físicas permanentes" },
        { number: "9.710", text: "Incapacidades temporales" },
        { number: "9.711", text: "Frustración" },
        { number: "9.712", text: "Conflictos de personalidad" },
        { number: "9.713", text: "Enfermedad mental" },
        { number: "9.714", text: "Otras incapacidades físicas permanentes" },
        { number: "9.715", text: "Incapacidades temporales" },
        { number: "9.716", text: "Frustración" },
        { number: "9.717", text: "Conflictos de personalidad" },
        { number: "9.718", text: "Enfermedad mental" },
        { number: "9.719", text: "Otras incapacidades físicas permanentes" },
        { number: "9.720", text: "Incapacidades temporales" },
        { number: "9.721", text: "Frustración" },
        { number: "9.722", text: "Conflictos de personalidad" },
        { number: "9.723", text: "Enfermedad mental" },
        { number: "9.724", text: "Otras incapacidades físicas permanentes" },
        { number: "9.725", text: "Incapacidades temporales" },
        { number: "9.726", text: "Frustración" },
        { number: "9.727", text: "Conflictos de personalidad" },
        { number: "9.728", text: "Enfermedad mental" },
        { number: "9.729", text: "Otras incapacidades físicas permanentes" },
        { number: "9.730", text: "Incapacidades temporales" },
        { number: "9.731", text: "Frustración" },
        { number: "9.732", text: "Conflictos de personalidad" },
        { number: "9.733", text: "Enfermedad mental" },
        { number: "9.734", text: "Otras incapacidades físicas permanentes" },
        { number: "9.735", text: "Incapacidades temporales" },
        { number: "9.736", text: "Frustración" },
        { number: "9.737", text: "Conflictos de personalidad" },
        { number: "9.738", text: "Enfermedad mental" },
        { number: "9.739", text: "Otras incapacidades físicas permanentes" },
        { number: "9.740", text: "Incapacidades temporales" },
        { number: "9.741", text: "Frustración" },
        { number: "9.742", text: "Conflictos de personalidad" },
        { number: "9.743", text: "Enfermedad mental" },
        { number: "9.744", text: "Otras incapacidades físicas permanentes" },
        { number: "9.745", text: "Incapacidades temporales" },
        { number: "9.746", text: "Frustración" },
        { number: "9.747", text: "Conflictos de personalidad" },
        { number: "9.748", text: "Enfermedad mental" },
        { number: "9.749", text: "Otras incapacidades físicas permanentes" },
        { number: "9.750", text: "Incapacidades temporales" },
        { number: "9.751", text: "Frustración" },
        { number: "9.752", text: "Conflictos de personalidad" },
        { number: "9.753", text: "Enfermedad mental" },
        { number: "9.754", text: "Otras incapacidades físicas permanentes" },
        { number: "9.755", text: "Incapacidades temporales" },
        { number: "9.756", text: "Frustración" },
        { number: "9.757", text: "Conflictos de personalidad" },
        { number: "9.758", text: "Enfermedad mental" },
        { number: "9.759", text: "Otras incapacidades físicas permanentes" },
        { number: "9.760", text: "Incapacidades temporales" },
        { number: "9.761", text: "Frustración" },
        { number: "9.762", text: "Conflictos de personalidad" },
        { number: "9.763", text: "Enfermedad mental" },
        { number: "9.764", text: "Otras incapacidades físicas permanentes" },
        { number: "9.765", text: "Incapacidades temporales" },
        { number: "9.766", text: "Frustración" },
        { number: "9.767", text: "Conflictos de personalidad" },
        { number: "9.768", text: "Enfermedad mental" },
        { number: "9.769", text: "Otras incapacidades físicas permanentes" },
        { number: "9.770", text: "Incapacidades temporales" },
        { number: "9.771", text: "Frustración" },
        { number: "9.772", text: "Conflictos de personalidad" },
        { number: "9.773", text: "Enfermedad mental" },
        { number: "9.774", text: "Otras incapacidades físicas permanentes" },
        { number: "9.775", text: "Incapacidades temporales" },
        { number: "9.776", text: "Frustración" },
        { number: "9.777", text: "Conflictos de personalidad" },
        { number: "9.778", text: "Enfermedad mental" },
        { number: "9.779", text: "Otras incapacidades físicas permanentes" },
        { number: "9.780", text: "Incapacidades temporales" },
        { number: "9.781", text: "Frustración" },
        { number: "9.782", text: "Conflictos de personalidad" },
        { number: "9.783", text: "Enfermedad mental" },
        { number: "9.784", text: "Otras incapacidades físicas permanentes" },
        { number: "9.785", text: "Incapacidades temporales" },
        { number: "9.786", text: "Frustración" },
        { number: "9.787", text: "Conflictos de personalidad" },
        { number: "9.788", text: "Enfermedad mental" },
        { number: "9.789", text: "Otras incapacidades físicas permanentes" },
        { number: "9.790", text: "Incapacidades temporales" },
        { number: "9.791", text: "Frustración" },
        { number: "9.792", text: "Conflictos de personalidad" },
        { number: "9.793", text: "Enfermedad mental" },
        { number: "9.794", text: "Otras incapacidades físicas permanentes" },
        { number: "9.795", text: "Incapacidades temporales" },
        { number: "9.796", text: "Frustración" },
        { number: "9.797", text: "Conflictos de personalidad" },
        { number: "9.798", text: "Enfermedad mental" },
        { number: "9.799", text: "Otras incapacidades físicas permanentes" },
        { number: "9.800", text: "Incapacidades temporales" },
        { number: "9.801", text: "Frustración" },
        { number: "9.802", text: "Conflictos de personalidad" },
        { number: "9.803", text: "Enfermedad mental" },
        { number: "9.804", text: "Otras incapacidades físicas permanentes" },
        { number: "9.805", text: "Incapacidades temporales" },
        { number: "9.806", text: "Frustración" },
        { number: "9.807", text: "Conflictos de personalidad" },
        { number: "9.808", text: "Enfermedad mental" },
        { number: "9.809", text: "Otras incapacidades físicas permanentes" },
        { number: "9.810", text: "Incapacidades temporales" },
        { number: "9.811", text: "Frustración" },
        { number: "9.812", text: "Conflictos de personalidad" },
        { number: "9.813", text: "Enfermedad mental" },
        { number: "9.814", text: "Otras incapacidades físicas permanentes" },
        { number: "9.815", text: "Incapacidades temporales" },
        { number: "9.816", text: "Frustración" },
        { number: "9.817", text: "Conflictos de personalidad" },
        { number: "9.818", text: "Enfermedad mental" },
        { number: "9.819", text: "Otras incapacidades físicas permanentes" },
        { number: "9.820", text: "Incapacidades temporales" },
        { number: "9.821", text: "Frustración" },
        { number: "9.822", text: "Conflictos de personalidad" },
        { number: "9.823", text: "Enfermedad mental" },
        { number: "9.824", text: "Otras incapacidades físicas permanentes" },
        { number: "9.825", text: "Incapacidades temporales" },
        { number: "9.826", text: "Frustración" },
        { number: "9.827", text: "Conflictos de personalidad" },
        { number: "9.828", text: "Enfermedad mental" },
        { number: "9.829", text: "Otras incapacidades físicas permanentes" },
        { number: "9.830", text: "Incapacidades temporales" },
        { number: "9.831", text: "Frustración" },
        { number: "9.832", text: "Conflictos de personalidad" },
        { number: "9.833", text: "Enfermedad mental" },
        { number: "9.834", text: "Otras incapacidades físicas permanentes" },
        { number: "9.835", text: "Incapacidades temporales" },
        { number: "9.836", text: "Frustración" },
        { number: "9.837", text: "Conflictos de personalidad" },
                { number: "9.838", text: "Enfermedad mental" }
              ]
            },
            {
              number: 10,
              title: "Adquisiciones Inadecuadas",
              subcauses: [
                { number: "10.1", text: "Especificaciones inadecuadas del artículo" },
                { number: "10.2", text: "Investigación inadecuada de materiales y equipos" },
                { number: "10.3", text: "Especificaciones inadecuadas para el vendedor" },
                { number: "10.4", text: "Modalidad o ruta de embarque inadecuada" },
                { number: "10.5", text: "Inspecciones inadecuadas y aceptación de artículos" },
                { number: "10.6", text: "Comunicación inadecuada de las necesidades de seguridad y salud" },
                { number: "10.7", text: "Manejo inadecuado de materiales" },
                { number: "10.8", text: "Almacenamiento inadecuado de materiales" },
                { number: "10.9", text: "Transporte inadecuado de materiales" },
                { number: "10.10", text: "Identificación inadecuada de artículos riesgosos" },
                { number: "10.11", text: "Sistemas inadecuados de eliminación y desecho" }
              ]
            },
            {
              number: 11,
              title: "Mantenimiento Inadecuado",
              subcauses: [
                { number: "11.1", text: "Aspectos preventivos inadecuados del programa de mantenimiento" },
                { number: "11.2", text: "Aspectos predictivos inadecuados del programa de mantenimiento" },
                { number: "11.3", text: "Lubricación y servicio inadecuados" },
                { number: "11.4", text: "Ajuste/ensamblaje inadecuado" },
                { number: "11.5", text: "Limpieza o pulimiento inadecuados" },
                { number: "11.6", text: "Reemplazo inadecuado de partes" },
                { number: "11.7", text: "Reparación inadecuada" },
                { number: "11.8", text: "Remoción inadecuada de materiales de desecho" },
                { number: "11.9", text: "Programación inadecuada del mantenimiento" },
                { number: "11.10", text: "Examen inadecuado de partes críticas" },
                { number: "11.11", text: "Reparación inadecuada por problemas de mantenimiento" }
              ]
            },
            {
              number: 12,
              title: "Herramientas y Equipos Inadecuados",
              subcauses: [
                { number: "12.1", text: "Evaluación inadecuada de necesidades y riesgos" },
                { number: "12.2", text: "Preocupación inadecuada por los factores humanos/ergonómicos" },
                { number: "12.3", text: "Estándares o especificaciones inadecuadas" },
                { number: "12.4", text: "Disponibilidad inadecuada" },
                { number: "12.5", text: "Ajustes/reparación/mantenimiento inadecuados" },
                { number: "12.6", text: "Sistema inadecuado de reparación y recuperación" },
                { number: "12.7", text: "Remoción y reemplazo inadecuados" }
              ]
            },
            {
              number: 13,
              title: "Estándares Inadecuados del Trabajo",
              subcauses: [
                { number: "13.1", text: "Desarrollo inadecuado de estándares para:" },
                { number: "13.2", text: "Inventario y evaluación inadecuados de exposiciones y necesidades" },
                { number: "13.3", text: "Coordinación inadecuada con quienes diseñan el proceso" },
                { number: "13.4", text: "Compromiso inadecuado del trabajador" },
                { number: "13.5", text: "Estándares incompletos o inadecuados para:" },
                { number: "13.6", text: "Comunicación inadecuada de los estándares existentes" },
                { number: "13.7", text: "Mantenimiento inadecuado de los estándares" }
              ]
            },
            {
              number: 14,
              title: "Uso y Desgaste",
              subcauses: [
                { number: "14.1", text: "Planificación inadecuada del uso" },
                { number: "14.2", text: "Prolongación inadecuada de la vida útil de los artículos" },
                { number: "14.3", text: "Inspección inadecuada" },
                { number: "14.4", text: "Carga o proporción de uso inadecuado" },
                { number: "14.5", text: "Mantenimiento inadecuado" },
                { number: "14.6", text: "Empleo inadecuado para otros propósitos" },
                { number: "14.7", text: "Eliminación y reemplazo inadecuado de artículos gastados" }
              ]
            },
            {
              number: 15,
              title: "Abuso o Mal Uso",
              subcauses: [
                { number: "15.1", text: "Permitido por la supervisión" },
                { number: "15.2", text: "Intencional" },
                { number: "15.3", text: "No intencional" }
              ]
            }
          ];
        
          return (
            <div className="min-h-screen bg-[#1A1A1A] relative">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-[#2C2C2C] shadow-lg">
                <button
                  onClick={handleBack}
                  className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center hover:bg-[#505050] transition-colors"
                >
                  <ArrowLeftIcon />
                </button>
                
                <h1 className="text-white text-xl font-bold">
                  Causas Básicas (CB)
                </h1>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMenu}
                    className="w-10 h-10 bg-[#404040] rounded-full flex items-center justify-center hover:bg-[#505050] transition-colors"
                  >
                    <MenuIcon />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 bg-[#FFD600] rounded-full flex items-center justify-center hover:bg-[#E6C100] transition-colors"
                  >
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
        
              {/* CB Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cbData.map((cb) => (
                  <CBMiniCard
                    key={cb.number}
                    number={cb.number}
                    title={cb.title}
                    subcauses={cb.subcauses}
                    onClick={() => handleCBClick(cb.number)}
                  />
                ))}
              </div>
            </div>
          );
        };
        
        export default CBIndexPage;