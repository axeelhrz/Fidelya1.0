'use client';

import React from 'react';

// Iconos para la navegación
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

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

const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const NotesIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
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
    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${isUnderlined ? 'underline' : ''}`}
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    {text}
  </div>
);

// Componente para los paneles laterales
const SidePanel: React.FC<{
  activeTitle: string;
  inactiveTitle: string;
  isFirstActive?: boolean;
}> = ({ activeTitle, inactiveTitle, isFirstActive = true }) => (
  <div className="space-y-4">
    <div className={`p-4 rounded-lg text-center font-bold text-sm ${isFirstActive ? 'bg-[#FFD600] text-black' : 'bg-[#4A4A4A] text-white'}`}>
      {isFirstActive ? activeTitle : inactiveTitle}
    </div>
    <div className={`p-4 rounded-lg text-center font-bold text-sm ${!isFirstActive ? 'bg-[#FFD600] text-black' : 'bg-[#4A4A4A] text-white'}`}>
      {!isFirstActive ? activeTitle : inactiveTitle}
    </div>
  </div>
);

// Componente para items de lista
const ListItem: React.FC<{
  number: number;
  title: string;
  subtitle?: string;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ number, title, subtitle, isSelected = false, onClick }) => (
  <div 
    className={`
      flex items-start gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer
      ${isSelected 
        ? 'bg-[#404040] ring-2 ring-[#FFC107] shadow-lg' 
        : 'bg-[#2E2E2E] hover:bg-[#353535] hover:shadow-md'
      }
    `}
    onClick={onClick}
  >
    <div className="w-8 h-8 bg-[#666666] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      {number}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-white font-medium text-sm leading-tight">{title}</h3>
      {subtitle && (
        <p className="text-gray-400 text-xs mt-1 leading-tight">{subtitle}</p>
      )}
    </div>
  </div>
);

// Props del layout principal
interface SCATLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  activeTitle: string;
  inactiveTitle: string;
  isFirstActive?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
}

const SCATLayout: React.FC<SCATLayoutProps> = ({
  children,
  activeTitle,
  inactiveTitle,
  isFirstActive = true,
  onPrevious,
  onNext,
  showPrevious = true,
  showNext = true
}) => {
  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Cabecera */}
      <div className="bg-black px-12 py-6 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-white font-bold text-3xl tracking-wide">TABLA SCAT</h1>
          <h2 className="text-[#FFC107] font-bold text-xl">
            Técnica de Análisis Sistemático de las Causas
          </h2>
        </div>
      </div>

      {/* Etiquetas de cabecera */}
      <div className="px-12 py-6 bg-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
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
              bgColor="#FFC107" 
            />
            <HeaderTag 
              text="(CB) Causas Básicas / Subyacentes" 
              bgColor="#4A4A4A" 
              textColor="white"
            />
            <HeaderTag 
              text="(NAC) Necesidades de Acción de Control" 
              bgColor="#4A4A4A" 
              textColor="white"
            />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-12 py-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Panel lateral izquierdo */}
            <div className="lg:col-span-1">
              <SidePanel 
                activeTitle={activeTitle}
                inactiveTitle={inactiveTitle}
                isFirstActive={isFirstActive}
              />
              
              {/* Área de observaciones */}
              <div className="mt-8 bg-[#2E2E2E] rounded-xl p-6 shadow-xl">
                <div className="flex flex-col items-center space-y-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-300 cursor-pointer">
                      <CameraIcon />
                    </div>
                    <div className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-300 cursor-pointer">
                      <NotesIcon />
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <label className="block text-gray-300 text-sm font-semibold mb-3">
                      Observaciones
                    </label>
                    <textarea 
                      className="w-full h-32 bg-[#404040] border border-gray-600 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200"
                      placeholder="Agregar observaciones..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante inferior */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-black rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          {showPrevious && (
            <button 
              onClick={onPrevious}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ArrowLeftIcon />
            </button>
          )}
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
            <MenuIcon />
          </button>
          {showNext && (
            <button 
              onClick={onNext}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { SCATLayout, ListItem };
