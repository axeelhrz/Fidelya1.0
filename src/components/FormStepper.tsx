'use client';

import React, { useEffect } from 'react';
import { StepHeader } from './StepHeader';
import { SCATStepPanel } from './SCATStepPanel';
import { NavigationControls } from './NavigationControls';
import { useFormStepper } from '../hooks/useFormStepper';

interface FormStepperProps {
  onComplete?: () => void;
  onSave?: () => void;
  onExit?: () => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
  onComplete,
  onSave,
  onExit
}) => {
  const {
    currentSection,
    currentCause,
    currentStep,
    steps,
    currentSectionData,
    currentCauseData,
    progress,
    canGoNext,
    canGoPrevious,
    isCurrentCauseComplete,
    validations,
    goNext,
    goPrevious,
    goToSection,
    goToCause,
    updateValidation,
    markCauseComplete,
    saveProgress,
    loadProgress,
    isFormComplete,
    getIncompleteValidations
  } = useFormStepper();

  // Cargar progreso al montar el componente
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Guardar progreso automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000); // Guardar cada 30 segundos

    return () => clearInterval(interval);
  }, [saveProgress]);

  // Manejar atajos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Evitar atajos si el usuario está escribiendo
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canGoPrevious) goPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoNext) goNext();
          break;
        case 's':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleSave();
          }
          break;
        case 'Escape':
          event.preventDefault();
          onExit?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoPrevious, canGoNext, goPrevious, goNext, onExit]);

  const handleStepClick = (step: any) => {
    if (step.status !== 'locked') {
      goToSection(step.section);
    }
  };

  const handleSave = () => {
    saveProgress();
    onSave?.();
    
    // Mostrar notificación de guardado
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = '✓ Progreso guardado';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleNext = () => {
    // Si estamos en la última causa de la última sección y el formulario está completo
    if (currentSection === 'nac' && 
        currentCause >= currentSectionData.causes.length - 1 && 
        isFormComplete()) {
      onComplete?.();
      return;
    }
    
    goNext();
  };

  const handleValidationChange = (causeId: string, validation: any) => {
    updateValidation(causeId, validation);
  };

  const handleCauseComplete = (causeId: string) => {
    markCauseComplete(causeId);
  };

  const showValidationWarning = !isCurrentCauseComplete && currentCauseData;
  const incompleteValidations = getIncompleteValidations();

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header con barra de progreso */}
      <StepHeader
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Panel principal */}
      <SCATStepPanel
        step={currentStep}
        sectionData={currentSectionData}
        currentCause={currentCause}
        currentCauseData={currentCauseData}
        validations={validations}
        onValidationChange={handleValidationChange}
        onCauseComplete={handleCauseComplete}
        onCauseNavigation={goToCause}
      />

      {/* Controles de navegación */}
      <NavigationControls
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isCurrentCauseComplete={isCurrentCauseComplete}
        currentSection={currentSection}
        currentCause={currentCause}
        totalCauses={currentSectionData.causes.length}
        onPrevious={goPrevious}
        onNext={handleNext}
        onSave={handleSave}
        onMenu={onExit}
        showValidationWarning={showValidationWarning}
      />

      {/* Modal de resumen final (cuando el formulario está completo) */}
      {isFormComplete() && currentSection === 'nac' && currentCause >= currentSectionData.causes.length - 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2E2E2E] rounded-xl p-8 max-w-2xl mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h2 className="text-white font-bold text-2xl mb-2">
                ¡Análisis SCAT Completado!
              </h2>
              <p className="text-gray-400 mb-6">
                Has completado exitosamente el análisis sistemático de las causas. 
                Tu trabajo contribuirá significativamente a la prevención de futuros incidentes.
              </p>
              
              <div className="bg-[#404040] rounded-lg p-4 mb-6">
                <h3 className="text-[#FFD600] font-semibold mb-3">Resumen del análisis:</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {progress.sectionProgress.ci.completed}
                    </div>
                    <div className="text-gray-400">Causas Inmediatas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {progress.sectionProgress.cb.completed}
                    </div>
                    <div className="text-gray-400">Causas Básicas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {progress.sectionProgress.nac.completed}
                    </div>
                    <div className="text-gray-400">Acciones de Control</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleSave()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Guardar y Continuar
                </button>
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-[#FFD600] hover:bg-[#E6C100] text-black rounded-lg font-medium transition-colors"
                >
                  Finalizar Análisis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de validaciones incompletas */}
      {incompleteValidations.length > 0 && (
        <div className="fixed top-4 left-4 bg-yellow-600 bg-opacity-90 text-white p-4 rounded-lg shadow-lg max-w-sm z-40">
          <h4 className="font-semibold text-sm mb-2">
            ⚠️ Validaciones pendientes: {incompleteValidations.length}
          </h4>
          <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
            {incompleteValidations.slice(0, 5).map((validation, index) => (
              <div key={index} className="opacity-90">
                • {validation}
              </div>
            ))}
            {incompleteValidations.length > 5 && (
              <div className="opacity-75">
                ... y {incompleteValidations.length - 5} más
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
