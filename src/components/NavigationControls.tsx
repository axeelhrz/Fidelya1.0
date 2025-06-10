'use client';

import React from 'react';

interface NavigationControlsProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  isCurrentCauseComplete: boolean;
  currentSection: 'ci' | 'cb' | 'nac';
  currentCause: number;
  totalCauses: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave?: () => void;
  onMenu?: () => void;
  showValidationWarning?: boolean;
}

// Iconos
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
);

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  canGoPrevious,
  canGoNext,
  isCurrentCauseComplete,
  currentSection,
  currentCause,
  totalCauses,
  onPrevious,
  onNext,
  onSave,
  onMenu,
  showValidationWarning = false
}) => {
  const getSectionName = (section: 'ci' | 'cb' | 'nac') => {
    switch (section) {
      case 'ci': return 'Causas Inmediatas';
      case 'cb': return 'Causas Básicas';
      case 'nac': return 'Necesidades de Acción';
      default: return '';
    }
  };

  const getNextButtonText = () => {
    if (currentCause >= totalCauses - 1) {
      if (currentSection === 'ci') return 'Continuar a CB →';
      if (currentSection === 'cb') return 'Continuar a NAC →';
      if (currentSection === 'nac') return 'Finalizar Análisis ✓';
    }
    return 'Siguiente Causa →';
  };

  const getPreviousButtonText = () => {
    if (currentCause === 0) {
      if (currentSection === 'cb') return '← Volver a CI';
      if (currentSection === 'nac') return '← Volver a CB';
    }
    return '← Causa Anterior';
  };

  return (
    <>
      {/* Controles flotantes principales */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-black rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-4">
            {/* Botón de menú */}
            {onMenu && (
              <button
                onClick={onMenu}
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Menú principal"
              >
                <MenuIcon />
              </button>
            )}

            {/* Botón de guardar */}
            {onSave && (
              <button
                onClick={onSave}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Guardar progreso"
              >
                <SaveIcon />
              </button>
            )}

            {/* Botón anterior */}
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`
                px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200
                ${canGoPrevious 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }
              `}
              title={canGoPrevious ? getPreviousButtonText() : 'No se puede retroceder'}
            >
              <ArrowLeftIcon />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Botón siguiente */}
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`
                px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200
                ${canGoNext 
                  ? 'bg-[#FFD600] hover:bg-[#E6C100] text-black hover:scale-105 shadow-lg' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }
              `}
              title={canGoNext ? getNextButtonText() : 'Complete la causa actual para continuar'}
            >
              <span>{currentSection === 'nac' && currentCause >= totalCauses - 1 ? 'Finalizar' : 'Siguiente'}</span>
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de información inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2A2A2A] border-t border-gray-700 px-8 py-4 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Información de progreso */}
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-400">Sección actual:</span>
                <span className="text-[#FFD600] font-semibold ml-2">
                  {getSectionName(currentSection)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Causa:</span>
                <span className="text-white font-semibold ml-2">
                  {currentCause + 1} de {totalCauses}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Estado:</span>
                <span className={`font-semibold ml-2 ${
                  isCurrentCauseComplete ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {isCurrentCauseComplete ? 'Completa' : 'Pendiente'}
                </span>
              </div>
            </div>

            {/* Advertencias y ayuda */}
            <div className="flex items-center gap-4">
              {showValidationWarning && (
                <div className="flex items-center gap-2 bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg px-3 py-2">
                  <WarningIcon />
                  <span className="text-yellow-400 text-sm font-medium">
                    Complete todas las validaciones para continuar
                  </span>
                </div>
              )}

              {!isCurrentCauseComplete && (
                <div className="text-sm text-gray-400">
                  💡 Marque la causa como aplicable y complete las validaciones
                </div>
              )}

              {/* Atajos de teclado */}
              <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500">
                <kbd className="px-2 py-1 bg-gray-700 rounded">←</kbd>
                <span>Anterior</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">→</kbd>
                <span>Siguiente</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+S</kbd>
                <span>Guardar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
