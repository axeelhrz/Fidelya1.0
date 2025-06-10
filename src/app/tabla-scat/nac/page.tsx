'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  <div 
    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
      isActive ? 'ring-2 ring-yellow-400' : ''
    }`}
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    {text}
  </div>
);

// NAC Grid Item Component
const NACGridItem: React.FC<{
  number: number;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ number, title, isSelected = false, onClick }) => (
  <div 
    className={`
      bg-[#2E2E2E] rounded-lg p-4 transition-all duration-200 cursor-pointer
      ${isSelected 
        ? 'ring-2 ring-[#FFD600] bg-[#353535]' 
        : 'hover:bg-[#353535]'
      }
      flex items-center justify-between
    `}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">
        {number}
      </div>
      <span className="text-white font-semibold text-sm uppercase">{title}</span>
    </div>
    <button className="w-8 h-8 bg-[#FFD600] rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-200">
      <DoubleArrowIcon />
    </button>
  </div>
);

// Question Button Component
const QuestionButton: React.FC<{
  code: string;
  color: string;
  text: string;
}> = ({ code, color, text }) => (
  <div className="flex items-center gap-3">
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
      style={{ backgroundColor: color }}
    >
      {code}
    </div>
    <span className="text-white text-sm font-medium">{text}</span>
  </div>
);

const NACPage: React.FC = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleBack = () => {
    router.push('/tabla-scat/cb');
  };

  const handleGrid = () => {
    router.push('/tabla-scat');
  };

  const handleItemSelect = (itemNumber: number) => {
    setSelectedItems(prev => 
      prev.includes(itemNumber) 
        ? prev.filter(n => n !== itemNumber)
        : [...prev, itemNumber]
    );
  };

  const nacItems = [
    { number: 1, title: "LIDERAZGO Y ADMINISTRACIÓN" },
    { number: 2, title: "ENTRENAMIENTO DE GERENCIA" },
    { number: 3, title: "INSPECCIONES PLANIFICADAS" },
    { number: 4, title: "ANÁLISIS Y PROCEDIMIENTOS DE TAREAS" },
    { number: 5, title: "INVESTIGACIÓN DE ACCIDENTES/INCIDENTES" },
    { number: 6, title: "PREPARACIÓN PARA EMERGENCIAS" },
    { number: 7, title: "REGLAS DE LA ORGANIZACIÓN" },
    { number: 8, title: "ANÁLISIS DE ACCIDENTES/INCIDENTES" },
    { number: 9, title: "ENTRENAMIENTO DE EMPLEADOS" },
    { number: 10, title: "EQUIPO DE PROTECCIÓN PERSONAL" },
    { number: 11, title: "CONTROL DE SALUD" },
    { number: 12, title: "SISTEMA DE EVALUACIÓN DEL PROGRAMA" },
    { number: 13, title: "CONTROLES DE INGENIERÍA" },
    { number: 14, title: "COMUNICACIONES PERSONALES" },
    { number: 15, title: "COMUNICACIONES DE GRUPO" },
    { number: 16, title: "PROMOCIÓN GENERAL" },
    { number: 17, title: "CONTRATACIÓN Y COLOCACIÓN" },
    { number: 18, title: "CONTROL DE COMPRAS" },
    { number: 19, title: "SEGURIDAD FUERA DEL TRABAJO" },
    { number: 20, title: "SEGURIDAD PARA VISITANTES" }
  ];

  return (
    <div className="min-h-screen bg-[#2E2E2E]">
      {/* Header */}
      <div className="bg-black px-12 py-6 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-white font-bold text-3xl tracking-wide">TABLA SCAT</h1>
          <h2 className="text-[#FFC107] font-bold text-xl">
            Técnica de Análisis Sistemático de las Causas
          </h2>
        </div>
      </div>

      {/* Category Tags */}
      <div className="px-12 py-6 bg-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <HeaderTag 
              text="EVALUACIÓN POTENCIAL DE PÉRDIDA SI NO ES CONTROLADO" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="Tipo de Contacto o Causal con Energía o Sustancia" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="(CI) Causas Inmediatas o Directas" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="(CB) Causas Básicas / Subyacentes" 
              bgColor="#4A4A4A" 
            />
            <HeaderTag 
              text="(NAC) Necesidades de Acción de Control = Falta de Control" 
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
          {/* NAC Grid - 4 columns × 5 rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {nacItems.map((item) => (
              <NACGridItem
                key={item.number}
                number={item.number}
                title={item.title}
                isSelected={selectedItems.includes(item.number)}
                onClick={() => handleItemSelect(item.number)}
              />
            ))}
          </div>

          {/* Key Questions Section */}
          <div className="bg-[#3C3C3C] rounded-xl p-6 mb-8">
            <h3 className="text-white font-bold text-lg mb-6 text-center">
              PREGUNTAS CLAVE DE VALIDACIÓN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuestionButton
                code="P"
                color="#FF3B30"
                text="¿Tenemos estándares de programa para esta actividad?"
              />
              <QuestionButton
                code="E"
                color="#FFD600"
                text="¿Son adecuados los estándares existentes?"
              />
              <QuestionButton
                code="C"
                color="#00D26A"
                text="¿Hay un cumplimiento total de los estándares?"
              />
            </div>
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="bg-[#2E2E2E] rounded-xl p-6">
              <h4 className="text-[#FFC107] font-semibold mb-4">
                Necesidades de Acción de Control seleccionadas ({selectedItems.length}):
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {selectedItems.map(num => (
                  <span key={num} className="bg-[#FFD600] text-black px-3 py-1 rounded text-sm font-bold text-center">
                    NAC {num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-black rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            title="Regresar"
          >
            <ArrowLeftIcon />
          </button>
          <button 
            onClick={handleGrid}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            title="Índice SCAT"
          >
            <GridIcon />
          </button>
          <button 
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            title="Vista previa"
          >
            <EyeIcon />
          </button>
          <button 
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            title="Guardar"
          >
            <SaveIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NACPage;
