'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStepper } from '../hooks/useFormStepper';
import { SCAT_SECTIONS } from '../data/scatData';

// Icons
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

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

// Header with progress indicators
const SCATFormHeader: React.FC<{
  currentSection: 'ci' | 'cb' | 'nac';
  progress: any;
}> = ({ currentSection, progress }) => {
  const sections = [
    { id: 'ci', name: 'CI', title: 'Causas Inmediatas', color: '#FFD600' },
    { id: 'cb', name: 'CB', title: 'Causas Básicas', color: '#FFD600' },
    { id: 'nac', name: 'NAC', title: 'Acciones de Control', color: '#FFD600' }
  ];

  return (
    <div className="bg-black px-8 py-6 shadow-xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-white font-bold text-2xl tracking-wide">TABLA SCAT</h1>
        <h2 className="text-[#FFC107] font-bold text-lg">
          Técnica de Análisis Sistemático de las Causas
        </h2>
      </div>
      
      {/* Progress indicators */}
      <div className="flex justify-center gap-4 mt-6">
        {sections.map((section, index) => {
          const isActive = section.id === currentSection;
          const isCompleted = progress.sectionProgress[section.id].percentage === 100;
          const progressPercentage = progress.sectionProgress[section.id].percentage;
          
          return (
            <div key={section.id} className="flex flex-col items-center">
              <div className={`
                w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg
                transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/25' 
                  : isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-zinc-800 text-white/70 border border-white/20'
                }
              `}>
                {isCompleted ? <CheckIcon /> : section.name}
                
                {/* Progress bar for active section */}
                {isActive && !isCompleted && (
                  <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                )}
              </div>
              
              <span className={`
                text-xs mt-2 font-medium text-center
                ${isActive ? 'text-yellow-400' : isCompleted ? 'text-green-400' : 'text-white/60'}
              `}>
                {section.title}
              </span>
              
              <span className={`
                text-xs mt-1
                ${isActive ? 'text-yellow-300' : isCompleted ? 'text-green-300' : 'text-white/40'}
              `}>
                {progressPercentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Individual cause card component
const CauseCard: React.FC<{
  cause: any;
  isSelected: boolean;
  isCompleted: boolean;
  onSelect: () => void;
  currentSection: 'ci' | 'cb' | 'nac';
}> = ({ cause, isSelected, isCompleted, onSelect, currentSection }) => {
  return (
    <div 
      className={`
        group relative bg-[#2E2E2E] rounded-xl p-6 cursor-pointer
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        border-2 overflow-hidden
        ${isSelected 
          ? 'border-yellow-400 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 shadow-lg shadow-yellow-500/20' 
          : isCompleted
            ? 'border-green-500 bg-gradient-to-r from-green-500/10 to-green-600/10'
            : 'border-white/10 hover:border-white/30'
        }
      `}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
            ${isSelected 
              ? 'bg-yellow-400 text-black' 
              : isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-zinc-700 text-white/80'
            }
          `}>
            {isCompleted ? <CheckIcon /> : cause.number}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{cause.title}</h3>
            {cause.description && (
              <p className="text-white/60 text-sm">{cause.description}</p>
            )}
          </div>
        </div>
        
        {/* Status indicator */}
        <div className={`
          w-4 h-4 rounded-full
          ${isCompleted ? 'bg-green-500' : isSelected ? 'bg-yellow-400' : 'bg-white/20'}
        `} />
      </div>

      {/* Subcauses preview */}
      {cause.subcauses && cause.subcauses.length > 0 && (
        <div className="space-y-2">
          <p className="text-white/40 text-xs font-medium">
            {cause.subcauses.length} subcausas disponibles
          </p>
          <div className="flex flex-wrap gap-1">
            {cause.subcauses.slice(0, 3).map((subcause: any, index: number) => (
              <span 
                key={index}
                className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded"
              >
                {subcause.number}
              </span>
            ))}
            {cause.subcauses.length > 3 && (
              <span className="text-xs text-white/50">
                +{cause.subcauses.length - 3} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* NAC references */}
      {cause.nacReferences && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-blue-400">{cause.nacReferences}</p>
        </div>
      )}

      {/* Selection overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-yellow-500/5 pointer-events-none" />
      )}
    </div>
  );
};

// Subcause selection component
const SubcauseSelector: React.FC<{
  subcauses: any[];
  selectedSubcauses: string[];
  onSubcauseToggle: (subcauseId: string) => void;
}> = ({ subcauses, selectedSubcauses, onSubcauseToggle }) => {
  return (
    <div className="bg-[#2E2E2E] rounded-xl p-6">
      <h4 className="text-white font-bold text-lg mb-4">Seleccionar subcausas específicas:</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {subcauses.map((subcause) => {
          const isSelected = selectedSubcauses.includes(subcause.id);
          return (
            <div 
              key={subcause.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer
                transition-all duration-200
                ${isSelected 
                  ? 'bg-yellow-400/20 border border-yellow-400/50' 
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }
              `}
              onClick={() => onSubcauseToggle(subcause.id)}
            >
              <div className={`
                w-6 h-6 rounded flex items-center justify-center
                ${isSelected ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white/60'}
              `}>
                {isSelected && <CheckIcon />}
              </div>
              <div className="flex-1">
                <span className="text-yellow-400 font-semibold text-sm mr-2">
                  {subcause.number}
                </span>
                <span className="text-white text-sm">{subcause.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Observation and attachments component
const ObservationPanel: React.FC<{
  observation: string;
  onObservationChange: (value: string) => void;
  attachments: string[];
  onAddAttachment: () => void;
}> = ({ observation, onObservationChange, attachments, onAddAttachment }) => {
  return (
    <div className="bg-[#2E2E2E] rounded-xl p-6">
      <h4 className="text-white font-bold text-lg mb-4">Observaciones y evidencias</h4>
      
      {/* Observation textarea */}
      <div className="mb-6">
        <label className="block text-white/70 text-sm font-medium mb-2">
          Observaciones
        </label>
        <textarea 
          className="w-full h-32 bg-[#404040] border border-white/20 rounded-lg p-3 text-white text-sm resize-none 
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                     transition-all duration-200"
          placeholder="Describe las observaciones relevantes para esta causa..."
          value={observation}
          onChange={(e) => onObservationChange(e.target.value)}
        />
      </div>

      {/* Attachment buttons */}
      <div className="flex gap-4">
        <button 
          onClick={onAddAttachment}
          className="flex items-center gap-2 px-4 py-2 bg-[#404040] hover:bg-[#4A4A4A] 
                     text-white rounded-lg transition-all duration-200 hover:scale-105"
        >
          <CameraIcon />
          <span className="text-sm">Foto</span>
        </button>
        <button 
          onClick={onAddAttachment}
          className="flex items-center gap-2 px-4 py-2 bg-[#404040] hover:bg-[#4A4A4A] 
                     text-white rounded-lg transition-all duration-200 hover:scale-105"
        >
          <DocumentIcon />
          <span className="text-sm">Documento</span>
        </button>
      </div>

      {/* Attachments list */}
      {attachments.length > 0 && (
        <div className="mt-4">
          <p className="text-white/70 text-sm mb-2">Archivos adjuntos:</p>
          <div className="space-y-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-white/60">
                <DocumentIcon />
                <span>{attachment}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// NAC validation component (P, E, C buttons)
const NACValidation: React.FC<{
  validation: { P: boolean | null; E: boolean | null; C: boolean | null };
  onValidationChange: (type: 'P' | 'E' | 'C', value: boolean) => void;
}> = ({ validation, onValidationChange }) => {
  const validationTypes = [
    { key: 'P' as const, label: 'Potencial', description: 'Evalúa el potencial de la acción' },
    { key: 'E' as const, label: 'Exposición', description: 'Evalúa la exposición que controla' },
    { key: 'C' as const, label: 'Control', description: 'Evalúa el control que proporciona' }
  ];

  return (
    <div className="bg-[#2E2E2E] rounded-xl p-6">
      <h4 className="text-white font-bold text-lg mb-4">Validación NAC</h4>
      <p className="text-white/60 text-sm mb-6">
        Evalúa cada aspecto de la necesidad de acción de control:
      </p>
      
      <div className="space-y-4">
        {validationTypes.map((type) => (
          <div key={type.key} className="flex items-center justify-between p-4 bg-[#404040] rounded-lg">
            <div>
              <h5 className="text-white font-semibold">{type.label}</h5>
              <p className="text-white/60 text-sm">{type.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onValidationChange(type.key, true)}
                className={`
                  w-12 h-8 rounded-lg font-bold text-sm transition-all duration-200
                  ${validation[type.key] === true 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-white/20 text-white/60 hover:bg-white/30'
                  }
                `}
              >
                SÍ
              </button>
              <button
                onClick={() => onValidationChange(type.key, false)}
                className={`
                  w-12 h-8 rounded-lg font-bold text-sm transition-all duration-200
                  ${validation[type.key] === false 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/20 text-white/60 hover:bg-white/30'
                  }
                `}
              >
                NO
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main interactive form component
export const InteractiveSCATForm: React.FC = () => {
  const router = useRouter();
  const {
    currentSection,
    currentCause,
    currentSectionData,
    currentCauseData,
    progress,
    validations,
    canGoNext,
    canGoPrevious,
    goNext,
    goPrevious,
    updateValidation,
    updateNACValidation,
    updateObservation,
    addAttachment,
    saveProgress,
    loadProgress
  } = useFormStepper();

  const [selectedSubcauses, setSelectedSubcauses] = useState<string[]>([]);
  const [showSubcauses, setShowSubcauses] = useState(false);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Auto-save progress
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(interval);
  }, [saveProgress]);

  const currentValidation = validations[currentCauseData?.id] || {
    selected: false,
    observation: '',
    attachments: [],
    P: null,
    E: null,
    C: null
  };

  const handleCauseSelect = useCallback(() => {
    if (!currentCauseData) return;
    
    updateValidation(currentCauseData.id, { selected: true });
    
    if (currentCauseData.subcauses && currentCauseData.subcauses.length > 0) {
      setShowSubcauses(true);
    }
  }, [currentCauseData, updateValidation]);

  const handleSubcauseToggle = useCallback((subcauseId: string) => {
    setSelectedSubcauses(prev => 
      prev.includes(subcauseId) 
        ? prev.filter(id => id !== subcauseId)
        : [...prev, subcauseId]
    );
  }, []);

  const handleObservationChange = useCallback((observation: string) => {
    if (!currentCauseData) return;
    updateObservation(currentCauseData.id, observation);
  }, [currentCauseData, updateObservation]);

  const handleAddAttachment = useCallback(() => {
    if (!currentCauseData) return;
    // Simulate adding an attachment
    const fileName = `attachment_${Date.now()}.jpg`;
    addAttachment(currentCauseData.id, fileName);
  }, [currentCauseData, addAttachment]);

  const handleNACValidationChange = useCallback((type: 'P' | 'E' | 'C', value: boolean) => {
    if (!currentCauseData) return;
    updateNACValidation(currentCauseData.id, type, value);
  }, [currentCauseData, updateNACValidation]);

  const handleNext = useCallback(() => {
    saveProgress();
    goNext();
    setShowSubcauses(false);
    setSelectedSubcauses([]);
  }, [saveProgress, goNext]);

  const handlePrevious = useCallback(() => {
    saveProgress();
    goPrevious();
    setShowSubcauses(false);
    setSelectedSubcauses([]);
  }, [saveProgress, goPrevious]);

  if (!currentSectionData || !currentCauseData) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <SCATFormHeader currentSection={currentSection} progress={progress} />

      {/* Main content */}
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Current section info */}
          <div className="mb-8 text-center">
            <h2 className="text-white font-bold text-3xl mb-2">
              {currentSectionData.title}
            </h2>
            <p className="text-white/60 text-lg">
              {currentSectionData.description}
            </p>
            <div className="mt-4 text-yellow-400 font-medium">
              Causa {currentCause + 1} de {currentSectionData.causes.length}
            </div>
          </div>

          {/* Current cause card */}
          <div className="mb-8">
            <CauseCard
              cause={currentCauseData}
              isSelected={currentValidation.selected}
              isCompleted={currentValidation.selected && (currentSection !== 'nac' || 
                (currentValidation.P !== null && currentValidation.E !== null && currentValidation.C !== null))}
              onSelect={handleCauseSelect}
              currentSection={currentSection}
            />
          </div>

          {/* Conditional panels based on selection and section */}
          {currentValidation.selected && (
            <div className="space-y-6">
              {/* Subcauses selection */}
              {showSubcauses && currentCauseData.subcauses && (
                <SubcauseSelector
                  subcauses={currentCauseData.subcauses}
                  selectedSubcauses={selectedSubcauses}
                  onSubcauseToggle={handleSubcauseToggle}
                />
              )}

              {/* NAC validation (only for NAC section) */}
              {currentSection === 'nac' && (
                <NACValidation
                  validation={{
                    P: currentValidation.P,
                    E: currentValidation.E,
                    C: currentValidation.C
                  }}
                  onValidationChange={handleNACValidationChange}
                />
              )}

              {/* Observations and attachments */}
              <ObservationPanel
                observation={currentValidation.observation}
                onObservationChange={handleObservationChange}
                attachments={currentValidation.attachments}
                onAddAttachment={handleAddAttachment}
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 shadow-2xl border border-white/10">
          {canGoPrevious && (
            <button 
              onClick={handlePrevious}
              className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl 
                         transition-all duration-200 hover:scale-110 active:scale-95 text-white/70 
                         hover:text-white"
            >
              <ArrowLeftIcon />
            </button>
          )}
          
          <button 
            onClick={() => router.push('/tabla-scat')}
            className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl 
                       transition-all duration-200 hover:scale-110 active:scale-95 text-white/70 
                       hover:text-white"
          >
            <MenuIcon />
          </button>
          
          {canGoNext && (
            <button 
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-yellow-400 
                         to-yellow-500 text-black rounded-xl transition-all duration-200 hover:scale-110 
                         active:scale-95 shadow-lg shadow-yellow-500/25"
            >
              <ArrowRightIcon />
            </button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="fixed bottom-8 left-8">
        <div className="bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="text-white/60 text-sm mb-2">Progreso total</div>
          <div className="w-32 bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(
                  progress.sectionProgress.ci.percentage + 
                  progress.sectionProgress.cb.percentage + 
                  progress.sectionProgress.nac.percentage
                ) / 3}%` 
              }}
            />
          </div>
          <div className="text-yellow-400 text-sm mt-1 font-medium">
            {Math.round((
              progress.sectionProgress.ci.percentage + 
              progress.sectionProgress.cb.percentage + 
              progress.sectionProgress.nac.percentage
            ) / 3)}%
          </div>
        </div>
      </div>
    </div>
  );
};
