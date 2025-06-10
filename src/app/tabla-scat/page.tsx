'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Iconos para la navegación
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
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
    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 ${isUnderlined ? 'underline' : ''}`}
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
  onClick?: () => void;
}> = ({ letter, label, color, isSelected = false, onClick }) => (
  <div className="flex flex-col items-center gap-2">
    <button 
      onClick={onClick}
      className={`
        w-12 h-12 rounded-lg font-bold text-white text-lg transition-all duration-300 
        hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl
        ${isSelected ? 'ring-2 ring-white ring-opacity-80 scale-105' : 'hover:ring-1 hover:ring-white hover:ring-opacity-50'}
      `}
      style={{ backgroundColor: color }}
    >
      {letter}
    </button>
    <span className="text-xs text-gray-300 font-medium">{label}</span>
  </div>
);

// Componente para cada fila de evaluación
const EvaluationRow: React.FC<{
  title: string;
  selectedOption?: string;
  onOptionSelect?: (option: string) => void;
}> = ({ title, selectedOption, onOptionSelect }) => (
  <div className="bg-[#2E2E2E] rounded-xl p-6 hover:bg-[#353535] transition-all duration-300 shadow-lg hover:shadow-xl">
    <div className="flex items-center justify-between">
      <h3 className="text-[#4A90E2] font-bold text-lg flex-1 pr-8">{title}</h3>
      <div className="flex gap-6">
        <EvaluationButton 
          letter="A" 
          label="Grave" 
          color="#DC2626" 
          isSelected={selectedOption === 'A'}
          onClick={() => onOptionSelect?.('A')}
        />
        <EvaluationButton 
          letter="B" 
          label="Moderada" 
          color="#F59E0B" 
          isSelected={selectedOption === 'B'}
          onClick={() => onOptionSelect?.('B')}
        />
        <EvaluationButton 
          letter="C" 
          label="Leve" 
          color="#10B981" 
          isSelected={selectedOption === 'C'}
          onClick={() => onOptionSelect?.('C')}
        />
      </div>
    </div>
  </div>
);

const TablaSCAT: React.FC = () => {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState({
    severidad: 'A',
    probabilidad: 'B',
    frecuencia: 'C'
  });

  const handleNext = () => {
    router.push('/tabla-scat/contacto');
  };

  const handleOptionSelect = (category: string, option: string) => {
    setEvaluations(prev => ({
      ...prev,
      [category]: option
    }));
  };

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Cabecera */}
      <div className="bg-black px-8 py-4 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-white font-bold text-2xl tracking-wide">TABLA SCAT</h1>
          <h2 className="text-[#FFC107] font-bold text-lg">
            Técnica de Análisis Sistemático de las Causas
          </h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all duration-200">
              <InfoIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Etiquetas de cabecera */}
      <div className="px-8 py-4 bg-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
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
      </div>

      {/* Contenido principal centrado */}
      <div className="flex items-center justify-center min-h-[60vh] px-12 py-12">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <EvaluationRow 
            title="Potencial de Severidad de Pérdida"
            selectedOption={evaluations.severidad}
            onOptionSelect={(option) => handleOptionSelect('severidad', option)}
          />
          <EvaluationRow 
            title="Probabilidad de Ocurrencia"
            selectedOption={evaluations.probabilidad}
            onOptionSelect={(option) => handleOptionSelect('probabilidad', option)}
          />
          <EvaluationRow 
            title="Frecuencia de Exposición"
            selectedOption={evaluations.frecuencia}
            onOptionSelect={(option) => handleOptionSelect('frecuencia', option)}
          />
        </div>
      </div>

      {/* Botón flotante inferior mejorado */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-black rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
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

export default TablaSCAT;