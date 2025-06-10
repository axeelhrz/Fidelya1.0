'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Iconos para la navegación
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

// Componente para las etiquetas de cabecera
const HeaderTag: React.FC<{ 
  text: string; 
  bgColor: string; 
  textColor?: string;
  isUnderlined?: boolean;
}> = ({ text, bgColor, textColor = 'black', isUnderlined = false }) => (
  <div 
    className={`px-4 py-2 rounded text-sm font-bold ${isUnderlined ? 'underline' : ''}`}
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    {text}
  </div>
);

// Componente para los botones de evaluación
const EvaluationButton: React.FC<{
  letter: string;
  label: string;
  color: string;
  isSelected?: boolean;
}> = ({ letter, label, color, isSelected = false }) => (
  <div className="flex flex-col items-center gap-1">
    <button 
      className={`w-12 h-12 rounded-lg font-bold text-white transition-all hover:scale-105 ${
        isSelected ? 'ring-2 ring-white' : ''
      }`}
      style={{ backgroundColor: color }}
    >
      {letter}
    </button>
    <span className="text-xs text-gray-300">{label}</span>
  </div>
);

// Componente para cada fila de evaluación
const EvaluationRow: React.FC<{
  title: string;
  selectedOption?: string;
}> = ({ title, selectedOption }) => (
  <div className="flex items-center justify-between py-4 px-6 bg-[#2E2E2E] rounded-lg">
    <h3 className="text-[#1F7ED0] font-semibold text-base flex-1">{title}</h3>
    <div className="flex gap-4">
      <EvaluationButton 
        letter="A" 
        label="Mayor" 
        color="#DC2626" 
        isSelected={selectedOption === 'A'}
      />
      <EvaluationButton 
        letter="B" 
        label="Grave" 
        color="#16A34A" 
        isSelected={selectedOption === 'B'}
      />
      <EvaluationButton 
        letter="C" 
        label="Menor" 
        color="#22C55E" 
        isSelected={selectedOption === 'C'}
      />
    </div>
  </div>
);

const TablaSCAT: React.FC = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push('/tabla-scat/contacto');
  };

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Cabecera */}
      <div className="bg-black px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-bold text-2xl">TABLA SCAT</h1>
          <h2 className="text-[#FFC107] font-bold text-lg">
            Técnica de Análisis Sistemático de las Causas
          </h2>
        </div>
      </div>

      {/* Etiquetas de cabecera */}
      <div className="px-8 py-4">
        <div className="flex flex-wrap gap-2 mb-6">
          <HeaderTag 
            text="EVALUACIÓN POTENCIAL DE PÉRDIDA SI NO ES CONTROLADO" 
            bgColor="#FFC107" 
          />
          <HeaderTag 
            text="Tipo de Contacto o Causal con Energía o Sustancia" 
            bgColor="#FFC107" 
          />
          <HeaderTag 
            text="(CI) Causas Inmediatas o Directas" 
            bgColor="#4A4A4A" 
            textColor="white"
          />
          <HeaderTag 
            text="(CB) Causas Básicas / Subyacentes" 
            bgColor="#4A4A4A" 
            textColor="white"
          />
          <HeaderTag 
            text="(NAC) Necesidades de Acción de Control" 
            bgColor="#1F7ED0" 
            textColor="white"
            isUnderlined={true}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-8 pb-20">
        <div className="space-y-4">
          <EvaluationRow 
            title="Potencial de Severidad de Pérdida"
            selectedOption="B"
          />
          <EvaluationRow 
            title="Probabilidad de Ocurrencia"
            selectedOption="B"
          />
          <EvaluationRow 
            title="Frecuencia de Exposición"
            selectedOption="C"
          />
        </div>
      </div>

      {/* Botón flotante inferior */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-black rounded-full p-3 flex items-center gap-3 shadow-lg">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-full transition-colors">
            <MenuIcon />
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaSCAT;
