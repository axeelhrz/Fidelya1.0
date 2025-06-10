'use client';

import React, { useState } from 'react';

// Enhanced Icons
const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const ArrowLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowRightIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const CameraIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const NotesIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const HomeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

// Enhanced Header Tag Component
interface HeaderTagProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

const HeaderTag: React.FC<HeaderTagProps> = ({ text, isActive = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex-1 min-w-0 h-14 px-4 py-3 rounded-xl text-center font-semibold text-sm 
      transition-all duration-300 hover:scale-105 shadow-lg
      flex items-center justify-center group relative overflow-hidden
      ${isActive 
        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-yellow-500/25' 
        : 'bg-zinc-800/50 text-white/70 hover:bg-zinc-700/50 hover:text-white border border-white/10'
      }
    `}
  >
    <span className="relative z-10 leading-tight">{text}</span>
    {isActive && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    )}
  </button>
);

// Enhanced Side Panel Component
interface SidePanelProps {
  activeTitle: string;
  inactiveTitle: string;
  isFirstActive?: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ activeTitle, inactiveTitle, isFirstActive = true }) => (
  <div className="space-y-4">
    <div className={`
      p-4 rounded-xl text-center font-bold text-sm transition-all duration-300 hover:scale-105
      ${isFirstActive 
        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/25' 
        : 'bg-zinc-800/50 text-white/70 border border-white/10'
      }
    `}>
      {isFirstActive ? activeTitle : inactiveTitle}
    </div>
    <div className={`
      p-4 rounded-xl text-center font-bold text-sm transition-all duration-300 hover:scale-105
      ${!isFirstActive 
        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/25' 
        : 'bg-zinc-800/50 text-white/70 border border-white/10'
      }
    `}>
      {!isFirstActive ? activeTitle : inactiveTitle}
    </div>
  </div>
);

// Enhanced List Item Component
interface ListItemProps {
  number: number;
  title: string;
  subtitle?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ 
  number, 
  title, 
  subtitle, 
  isSelected = false, 
  onClick 
}) => (
  <div 
    className={`
      group flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer
      relative overflow-hidden
      ${isSelected 
        ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400/30 shadow-lg shadow-yellow-500/10' 
        : 'bg-zinc-800/30 hover:bg-zinc-700/50 border border-white/10 hover:border-white/20'
      }
    `}
    onClick={onClick}
  >
    {/* Number Badge */}
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
      transition-all duration-300 group-hover:scale-110
      ${isSelected 
        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/25' 
        : 'bg-zinc-700 text-white/80 group-hover:bg-zinc-600'
      }
    `}>
      {number}
    </div>
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h3 className={`
        font-semibold text-sm leading-tight mb-1
        ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}
      `}>
        {title}
      </h3>
      {subtitle && (
        <p className={`
          text-xs leading-tight
          ${isSelected ? 'text-white/70' : 'text-white/50 group-hover:text-white/70'}
        `}>
          {subtitle}
        </p>
      )}
    </div>
    
    {/* Arrow Indicator */}
    <div className={`
      transition-all duration-300 opacity-0 group-hover:opacity-100
      ${isSelected ? 'opacity-100' : ''}
    `}>
      <ChevronRightIcon className="text-white/60" />
    </div>
    
    {/* Hover Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
  </div>
);

// Enhanced Breadcrumb Component
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav className="flex items-center space-x-2 text-sm mb-6">
    <HomeIcon className="text-white/40" />
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <ChevronRightIcon className="text-white/40" />
        <span className={`
          ${index === items.length - 1 
            ? 'text-yellow-400 font-medium' 
            : 'text-white/60 hover:text-white/80 cursor-pointer'
          }
        `}>
          {item.label}
        </span>
      </React.Fragment>
    ))}
  </nav>
);

// Enhanced Progress Indicator
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  steps 
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-white/60">Progreso</span>
      <span className="text-sm text-yellow-400 font-medium">
        {currentStep} de {totalSteps}
      </span>
    </div>
    
    {/* Progress Bar */}
    <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
      <div 
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
    
    {/* Step Labels */}
    <div className="flex justify-between text-xs">
      {steps.map((step, index) => (
        <span 
          key={index}
          className={`
            ${index < currentStep 
              ? 'text-yellow-400' 
              : index === currentStep 
                ? 'text-white font-medium' 
                : 'text-white/40'
            }
          `}
        >
          {step}
        </span>
      ))}
    </div>
  </div>
);

// Enhanced Floating Action Button
interface FloatingActionButtonProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onMenu?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  disabled?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPrevious,
  onNext,
  onMenu,
  showPrevious = true,
  showNext = true,
  disabled = false
}) => (
  <div className="fixed bottom-8 right-8 z-50">
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-2 shadow-2xl border border-white/10">
      {showPrevious && (
        <button 
          onClick={onPrevious}
          disabled={disabled}
          className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl 
                     transition-all duration-200 hover:scale-110 active:scale-95 text-white/70 
                     hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
        >
          <ArrowLeftIcon />
        </button>
      )}
      
      <button 
        onClick={onMenu}
        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl 
                   transition-all duration-200 hover:scale-110 active:scale-95 text-white/70 
                   hover:text-white focus-ring"
      >
        <MenuIcon />
      </button>
      
      {showNext && (
        <button 
          onClick={onNext}
          disabled={disabled}
          className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-yellow-400 
                     to-yellow-500 text-black rounded-xl transition-all duration-200 hover:scale-110 
                     active:scale-95 shadow-lg shadow-yellow-500/25 disabled:opacity-50 
                     disabled:cursor-not-allowed focus-ring"
        >
          <ArrowRightIcon />
        </button>
      )}
    </div>
  </div>
);

// Main SCAT Layout Props
interface SCATLayoutProps {
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
  activeTitle: string;
  inactiveTitle: string;
  isFirstActive?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  steps?: string[];
}

const SCATLayout: React.FC<SCATLayoutProps> = ({
  children,
  currentStep = 1,
  totalSteps = 5,
  activeTitle,
  inactiveTitle,
  isFirstActive = true,
  onPrevious,
  onNext,
  showPrevious = true,
  showNext = true,
  breadcrumbItems = [
    { label: 'Dashboard' },
    { label: 'SCAT' },
    { label: 'Análisis' }
  ],
  steps = ['Evaluación', 'Contacto', 'Causas Inmediatas', 'Causas Básicas', 'Acciones']
}) => {
  const [observaciones, setObservaciones] = useState('');

  const headerTags = [
    { text: "EVALUACIÓN POTENCIAL DE PÉRDIDA SI NO ES CONTROLADO", isActive: currentStep === 1 },
    { text: "Tipo de Contacto o Causal con Energía o Sustancia", isActive: currentStep === 2 },
    { text: "(CI) Causas Inmediatas", isActive: currentStep === 3 },
    { text: "(CB) Causas Básicas / Subyacentes", isActive: currentStep === 4 },
    { text: "(NAC) Necesidades de Acción de Control", isActive: currentStep === 5 }
  ];

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
            {headerTags.map((tag, index) => (
              <HeaderTag 
                key={index} 
                text={tag.text} 
                isActive={tag.isActive} 
              />
            ))}
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