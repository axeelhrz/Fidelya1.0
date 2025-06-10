'use client';

import React from 'react';
import { SCATCauseCard } from './SCATCauseCard';
import { FormStep, SCATSection, CauseValidation } from '../types/scatForm';

interface SCATStepPanelProps {
  step: FormStep;
  sectionData: SCATSection;
  currentCause: number;
  currentCauseData: any;
  validations: Record<string, CauseValidation>;
  onValidationChange: (causeId: string, validation: Partial<CauseValidation>) => void;
  onCauseComplete: (causeId: string) => void;
  onCauseNavigation: (causeIndex: number) => void;
}

export const SCATStepPanel: React.FC<SCATStepPanelProps> = ({
  step,
  sectionData,
  currentCause,
  currentCauseData,
  validations,
  onValidationChange,
  onCauseComplete,
  onCauseNavigation
}) => {
  const getCauseStatus = (causeIndex: number) => {
    const cause = sectionData.causes[causeIndex];
    const validation = validations[cause.id];
    
    if (!validation?.selected) return 'pending';
    
    if (step.section === 'nac') {
      return (validation.P !== null && validation.E !== null && validation.C !== null) 
        ? 'completed' : 'partial';
    }
    
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'partial': return 'bg-yellow-600 text-white';
      case 'pending': return 'bg-gray-600 text-gray-300';
      default: return 'bg-gray-600 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel lateral izquierdo - Lista de causas */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información de la sección */}
            <div className="bg-[#2E2E2E] rounded-xl p-6">
              <h3 className="text-[#FFD600] font-bold text-lg mb-2">
                {sectionData.name} - {sectionData.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {sectionData.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Progreso:</span>
                <span className="text-[#FFD600] font-semibold">
                  {step.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-[#FFD600] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>

            {/* Lista de causas */}
            <div className="bg-[#2E2E2E] rounded-xl p-4">
              <h4 className="text-white font-semibold text-sm mb-4">
                Causas ({sectionData.causes.length})
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sectionData.causes.map((cause, index) => {
                  const status = getCauseStatus(index);
                  const isActive = index === currentCause;
                  
                  return (
                    <button
                      key={cause.id}
                      onClick={() => onCauseNavigation(index)}
                      className={`
                        w-full text-left p-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-[#FFD600] text-black ring-2 ring-white ring-opacity-50' 
                          : 'bg-[#404040] hover:bg-[#4A4A4A] text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                          ${isActive ? 'bg-black text-[#FFD600]' : getStatusColor(status)}
                        `}>
                          {cause.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {cause.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`
                              w-2 h-2 rounded-full
                              ${status === 'completed' ? 'bg-green-400' : 
                                status === 'partial' ? 'bg-yellow-400' : 
                                'bg-gray-400'}
                            `} />
                            <span className={`
                              text-xs
                              ${isActive ? 'text-black opacity-70' : 'text-gray-400'}
                            `}>
                              {status === 'completed' ? 'Completo' : 
                               status === 'partial' ? 'Parcial' : 
                               'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resumen de progreso */}
            <div className="bg-[#2E2E2E] rounded-xl p-4">
              <h4 className="text-white font-semibold text-sm mb-3">Resumen</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Completadas:</span>
                  <span className="text-green-400 font-semibold">
                    {sectionData.causes.filter((_, index) => getCauseStatus(index) === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Parciales:</span>
                  <span className="text-yellow-400 font-semibold">
                    {sectionData.causes.filter((_, index) => getCauseStatus(index) === 'partial').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pendientes:</span>
                  <span className="text-gray-400 font-semibold">
                    {sectionData.causes.filter((_, index) => getCauseStatus(index) === 'pending').length}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-[#FFD600] font-bold">
                      {sectionData.causes.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal - Causa actual */}
          <div className="lg:col-span-3">
            {currentCauseData && (
              <div className="space-y-6">
                {/* Indicador de posición */}
                <div className="bg-[#2E2E2E] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-white font-bold text-xl">
                        {sectionData.name} {currentCauseData.number}: {currentCauseData.title}
                      </h2>
                      <p className="text-gray-400 text-sm mt-1">
                        Causa {currentCause + 1} de {sectionData.causes.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#FFD600] font-bold text-lg">
                        {Math.round(((currentCause + 1) / sectionData.causes.length) * 100)}%
                      </div>
                      <div className="text-gray-400 text-xs">
                        de esta sección
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de progreso de la sección */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#FFD600] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentCause + 1) / sectionData.causes.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tarjeta de la causa actual */}
                <SCATCauseCard
                  cause={currentCauseData}
                  validation={validations[currentCauseData.id]}
                  sectionType={step.section}
                  onValidationChange={(validation) => onValidationChange(currentCauseData.id, validation)}
                  onComplete={() => onCauseComplete(currentCauseData.id)}
                />

                {/* Mensaje motivacional */}
                <div className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD600">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-black font-semibold text-sm">
                        {step.section === 'ci' && "¡Excelente! Estás identificando las causas inmediatas del incidente."}
                        {step.section === 'cb' && "¡Muy bien! Ahora estás analizando las causas fundamentales."}
                        {step.section === 'nac' && "¡Perfecto! Estás definiendo las acciones para prevenir futuros incidentes."}
                      </p>
                      <p className="text-black text-xs opacity-80 mt-1">
                        Cada validación te acerca más a un análisis completo y efectivo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
