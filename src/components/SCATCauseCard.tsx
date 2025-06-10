'use client';

import React, { useState } from 'react';
import { SCATCause, CauseValidation } from '../types/scatForm';

interface SCATCauseCardProps {
  cause: SCATCause;
  validation?: CauseValidation;
  sectionType: 'ci' | 'cb' | 'nac';
  onValidationChange: (validation: Partial<CauseValidation>) => void;
  onComplete: () => void;
}

// Iconos
const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export const SCATCauseCard: React.FC<SCATCauseCardProps> = ({
  cause,
  validation = { selected: false, observation: '', attachments: [], P: null, E: null, C: null },
  sectionType,
  onValidationChange,
  onComplete
}) => {
  const [showSubcauses, setShowSubcauses] = useState(false);
  const [observationText, setObservationText] = useState(validation.observation || '');

  const handleSelectionChange = (selected: boolean) => {
    onValidationChange({ selected });
    if (selected && sectionType !== 'nac') {
      onComplete();
    }
  };

  const handleObservationChange = (observation: string) => {
    setObservationText(observation);
    onValidationChange({ observation });
  };

  const handleNACValidation = (type: 'P' | 'E' | 'C', value: boolean) => {
    const newValidation = { [type]: value };
    onValidationChange(newValidation);
    
    // Verificar si todas las validaciones NAC están completas
    const updatedValidation = { ...validation, ...newValidation };
    if (updatedValidation.selected && 
        updatedValidation.P !== null && 
        updatedValidation.E !== null && 
        updatedValidation.C !== null) {
      onComplete();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular subida de archivo
      const fileName = file.name;
      const newAttachments = [...(validation.attachments || []), fileName];
      onValidationChange({ attachments: newAttachments });
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = validation.attachments?.filter((_, i) => i !== index) || [];
    onValidationChange({ attachments: newAttachments });
  };

  const isComplete = sectionType === 'nac' 
    ? validation.selected && validation.P !== null && validation.E !== null && validation.C !== null
    : validation.selected;

  return (
    <div className={`
      bg-[#2E2E2E] rounded-xl overflow-hidden shadow-lg transition-all duration-300
      ${isComplete ? 'ring-2 ring-green-500 bg-[#2A3A2A]' : ''}
      ${validation.selected ? 'ring-2 ring-[#FFD600]' : ''}
    `}>
      {/* Header de la tarjeta */}
      <div className="bg-[#3C3C3C] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFD600] rounded-full flex items-center justify-center text-black font-bold text-lg">
              {cause.number}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{cause.title}</h3>
              {cause.description && (
                <p className="text-gray-400 text-sm mt-1">{cause.description}</p>
              )}
              {cause.nacReferences && (
                <p className="text-[#FFD600] text-xs mt-1 font-semibold">{cause.nacReferences}</p>
              )}
            </div>
          </div>
          
          {/* Estado de completado */}
          {isComplete && (
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <CheckIcon />
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6 space-y-6">
        {/* Selección principal */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={validation.selected}
              onChange={(e) => handleSelectionChange(e.target.checked)}
              className="w-5 h-5 text-[#FFD600] bg-gray-700 border-gray-600 rounded focus:ring-[#FFD600] focus:ring-2"
            />
            <span className="text-white font-medium">
              {sectionType === 'nac' ? 'Aplicar esta acción de control' : 'Esta causa aplica al incidente'}
            </span>
          </label>
        </div>

        {/* Subcausas (si existen) */}
        {cause.subcauses && cause.subcauses.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setShowSubcauses(!showSubcauses)}
              className="flex items-center gap-2 text-[#FFD600] hover:text-[#E6C100] transition-colors"
            >
              <span className="text-sm font-semibold">
                Ver subcausas ({cause.subcauses.length})
              </span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className={`transition-transform duration-200 ${showSubcauses ? 'rotate-180' : ''}`}
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>
            
            {showSubcauses && (
              <div className="bg-[#404040] rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                {cause.subcauses.map((subcause) => (
                  <div key={subcause.id} className="flex items-start gap-3 text-sm">
                    <span className="text-[#FFD600] font-semibold min-w-[3rem]">
                      {subcause.number}
                    </span>
                    <span className="text-gray-300">{subcause.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Validaciones NAC específicas */}
        {sectionType === 'nac' && validation.selected && (
          <div className="bg-[#404040] rounded-lg p-4 space-y-4">
            <h4 className="text-white font-semibold text-sm mb-3">Evaluación de la acción:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Potencial */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Potencial (P)</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNACValidation('P', true)}
                    className={`
                      flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-200
                      ${validation.P === true 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }
                    `}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => handleNACValidation('P', false)}
                    className={`
                      flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-200
                      ${validation.P === false 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }
                    `}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Exposición */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Exposición (E)</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNACValidation('E', true)}
                    className={`
                      flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-200
                      ${validation.E === true 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }
                    `}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => handleNACValidation('E', false)}
                    className={`
                      flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-200
                      ${validation.E === false 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }
                    `}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Control */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Control (C)</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNACValidation('C', true)}
                    className={`
                      flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-200
                      ${validation.C === true 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }
                    `}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => handleNACValidation('C', false)}
                    className={`
                      flex-1 py-2 px-3 rounded text-sm font-medium transition-all duration-200
                      ${validation.C === false 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }
                    `}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Observaciones */}
        <div className="space-y-3">
          <label className="text-gray-300 text-sm font-semibold">Observaciones</label>
          <textarea
            value={observationText}
            onChange={(e) => handleObservationChange(e.target.value)}
            placeholder="Agregar observaciones relevantes..."
            className="w-full h-24 bg-[#404040] border border-gray-600 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Adjuntos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-gray-300 text-sm font-semibold">Adjuntos</label>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="w-8 h-8 bg-[#FFD600] rounded flex items-center justify-center hover:bg-[#E6C100] transition-colors">
                  <CameraIcon />
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <div className="w-8 h-8 bg-[#FFD600] rounded flex items-center justify-center hover:bg-[#E6C100] transition-colors">
                  <DocumentIcon />
                </div>
              </label>
            </div>
          </div>
          
          {/* Lista de adjuntos */}
          {validation.attachments && validation.attachments.length > 0 && (
            <div className="space-y-2">
              {validation.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between bg-[#404040] rounded p-2">
                  <span className="text-gray-300 text-sm truncate">{attachment}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="w-6 h-6 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
