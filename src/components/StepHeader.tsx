'use client';

import React from 'react';
import { FormStep } from '../types/scatForm';

interface StepHeaderProps {
  steps: FormStep[];
  currentStep: FormStep;
  onStepClick?: (step: FormStep) => void;
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1c1.71,0,3.1,1.39,3.1,3.1V8z"/>
  </svg>
);

export const StepHeader: React.FC<StepHeaderProps> = ({ 
  steps, 
  currentStep, 
  onStepClick 
}) => {
  const getStepStyles = (step: FormStep) => {
    switch (step.status) {
      case 'completed':
        return {
          bg: 'bg-green-600',
          text: 'text-white',
          border: 'border-green-600',
          cursor: 'cursor-pointer hover:bg-green-700'
        };
      case 'active':
        return {
          bg: 'bg-[#FFD600]',
          text: 'text-black',
          border: 'border-[#FFD600]',
          cursor: 'cursor-pointer'
        };
      case 'locked':
        return {
          bg: 'bg-gray-600',
          text: 'text-gray-400',
          border: 'border-gray-600',
          cursor: 'cursor-not-allowed'
        };
      default:
        return {
          bg: 'bg-gray-700',
          text: 'text-gray-300',
          border: 'border-gray-600',
          cursor: 'cursor-pointer hover:bg-gray-600'
        };
    }
  };

  const getConnectorStyles = (index: number) => {
    const currentStepIndex = steps.findIndex(s => s.id === currentStep.id);
    const isCompleted = index < currentStepIndex || steps[index].status === 'completed';
    
    return isCompleted 
      ? 'bg-green-600' 
      : index === currentStepIndex 
        ? 'bg-[#FFD600]' 
        : 'bg-gray-600';
  };

  return (
    <div className="bg-[#2A2A2A] px-8 py-6 shadow-xl">
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-white font-bold text-3xl tracking-wide mb-2">
            FORMULARIO SCAT INTERACTIVO
          </h1>
          <p className="text-[#FFC107] font-semibold text-lg">
            Técnica de Análisis Sistemático de las Causas
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const styles = getStepStyles(step);
            const isClickable = step.status !== 'locked';
            
            return (
              <React.Fragment key={step.id}>
                {/* Paso */}
                <div className="flex flex-col items-center relative z-10">
                  {/* Círculo del paso */}
                  <button
                    onClick={() => isClickable && onStepClick?.(step)}
                    disabled={!isClickable}
                    className={`
                      w-16 h-16 rounded-full border-2 flex items-center justify-center
                      transition-all duration-300 shadow-lg
                      ${styles.bg} ${styles.text} ${styles.border} ${styles.cursor}
                      ${step.status === 'active' ? 'ring-2 ring-white ring-opacity-50 scale-110' : ''}
                    `}
                  >
                    {step.status === 'completed' ? (
                      <CheckIcon />
                    ) : step.status === 'locked' ? (
                      <LockIcon />
                    ) : (
                      <span className="font-bold text-lg">{index + 1}</span>
                    )}
                  </button>

                  {/* Información del paso */}
                  <div className="mt-3 text-center max-w-[200px]">
                    <h3 className={`font-bold text-sm ${styles.text} mb-1`}>
                      {step.section.toUpperCase()}
                    </h3>
                    <p className="text-gray-300 text-xs leading-tight">
                      {step.title}
                    </p>
                    
                    {/* Barra de progreso individual */}
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          step.status === 'completed' ? 'bg-green-600' :
                          step.status === 'active' ? 'bg-[#FFD600]' :
                          'bg-gray-600'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {step.progress}%
                    </span>
                  </div>
                </div>

                {/* Conector */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 relative">
                    <div className={`
                      absolute top-0 left-0 h-full rounded-full transition-all duration-500
                      ${getConnectorStyles(index)}
                    `} 
                    style={{ 
                      width: index < steps.findIndex(s => s.id === currentStep.id) ? '100%' : '0%' 
                    }} 
                    />
                    <div className="w-full h-full bg-gray-700 rounded-full" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Paso {steps.findIndex(s => s.id === currentStep.id) + 1} de {steps.length} • 
            <span className="text-[#FFD600] font-semibold ml-1">
              {currentStep.title}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
