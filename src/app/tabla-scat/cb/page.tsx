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
    }
  ];

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Header */}
      <div className="bg-black px-12 py-6 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-white font-bold text-3xl tracking-wide">TABLA SCAT</h1>
          <h2 className="text-[#FFC107] font-bold text-xl">
            Técnica de Análisis Sistemático de las Causas
          </h2>
        </div>
      </div>

      {/* Subtitle */}
      <div className="bg-[#2A2A2A] px-12 py-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-white text-xl font-semibold">
            (CB) Causas Básicas / Subyacentes - Seleccione una categoría
          </h3>
        </div>
      </div>

      {/* Grid of CB Cards */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {cbData.map((cb) => (
              <CBMiniCard
                key={cb.number}
                number={cb.number}
                title={cb.title}
                subcauses={cb.subcauses}
                onClick={() => router.push(`/tabla-scat/cb/${cb.number}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-black rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowLeftIcon />
          </button>
          <button 
            onClick={handleMenu}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <MenuIcon />
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CBIndexPage;

}