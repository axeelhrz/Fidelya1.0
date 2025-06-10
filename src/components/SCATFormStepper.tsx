'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Icons
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

// Step data structure based on Figma design
const FORM_STEPS = [
  {
    id: 1,
    title: "Evaluación Potencial de Pérdida",
    subtitle: "Si no es controlado",
    type: "evaluation",
    color: "#FFD600"
  },
  {
    id: 2,
    title: "Tipo de Contacto",
    subtitle: "Causal con Energía o Sustancia",
    type: "contact",
    color: "#FFD600"
  },
  {
    id: 3,
    title: "Causas Inmediatas",
    subtitle: "Actos y Condiciones Inseguras",
    type: "immediate_causes",
    color: "#6B7280"
  },
  {
    id: 4,
    title: "Causas Básicas",
    subtitle: "Factores Personales y del Trabajo",
    type: "basic_causes",
    color: "#6B7280"
  },
  {
    id: 5,
    title: "Necesidades de Acción",
    subtitle: "Medidas de Control",
    type: "control_actions",
    color: "#3B82F6"
  },
  {
    id: 6,
    title: "Datos del Accidente",
    subtitle: "Información General",
    type: "accident_data",
    color: "#6B7280"
  },
  {
    id: 7,
    title: "Factores Personales",
    subtitle: "Información del Personal",
    type: "personal_factors",
    color: "#6B7280"
  },
  {
    id: 8,
    title: "Factores Laborales",
    subtitle: "Condiciones de Trabajo",
    type: "work_factors",
    color: "#6B7280"
  }
];

// Header component matching Figma design
const SCATHeader: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  return (
    <div className="bg-black px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-white font-bold text-2xl">TABLA SCAT</h1>
        <h2 className="text-[#FFD600] font-bold text-lg">
          Técnica de Análisis Sistemático de las Causas
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black text-sm font-bold">?</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step indicator component
const StepIndicator: React.FC<{
  steps: typeof FORM_STEPS;
  currentStep: number;
  onStepClick: (stepId: number) => void;
}> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="bg-[#2A2A2A] px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isAccessible = step.id <= currentStep;
            
            return (
              <button
                key={step.id}
                onClick={() => isAccessible && onStepClick(step.id)}
                disabled={!isAccessible}
                className={`
                  flex-1 min-w-[200px] h-16 px-4 py-2 rounded-lg text-center font-bold text-sm
                  transition-all duration-300 hover:scale-105 shadow-lg
                  flex flex-col items-center justify-center relative overflow-hidden
                  ${isActive 
                    ? 'bg-[#FFD600] text-black shadow-yellow-500/25' 
                    : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-[#4A4A4A] text-white/70 border border-white/20'
                  }
                  ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <CheckIcon />
                  )}
                  <span className="text-xs leading-tight">{step.title}</span>
                </div>
                {step.subtitle && (
                  <span className="text-xs opacity-80 leading-tight">{step.subtitle}</span>
                )}
                
                {/* Active step indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Step 1: Evaluation Component
const EvaluationStep: React.FC<{
  onNext: () => void;
}> = ({ onNext }) => {
  const [evaluations, setEvaluations] = useState({
    severidad: '',
    probabilidad: '',
    frecuencia: ''
  });

  const EvaluationButton: React.FC<{
    letter: string;
    label: string;
    color: string;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ letter, label, color, isSelected, onClick }) => (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={onClick}
        className={`
          w-12 h-12 rounded-lg font-bold text-white text-lg transition-all duration-300 
          hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl
          ${isSelected ? 'ring-2 ring-white ring-opacity-80 scale-105' : ''}
        `}
        style={{ backgroundColor: color }}
      >
        {letter}
      </button>
      <span className="text-xs text-gray-300 font-medium text-center">{label}</span>
    </div>
  );

  const EvaluationRow: React.FC<{
    title: string;
    category: string;
  }> = ({ title, category }) => (
    <div className="bg-[#2E2E2E] rounded-xl p-6 hover:bg-[#353535] transition-all duration-300 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-[#4A90E2] font-bold text-lg flex-1 pr-8">{title}</h3>
        <div className="flex gap-6">
          <EvaluationButton 
            letter="A" 
            label="Grave" 
            color="#DC2626" 
            isSelected={evaluations[category as keyof typeof evaluations] === 'A'}
            onClick={() => setEvaluations(prev => ({ ...prev, [category]: 'A' }))}
          />
          <EvaluationButton 
            letter="B" 
            label="Moderada" 
            color="#F59E0B" 
            isSelected={evaluations[category as keyof typeof evaluations] === 'B'}
            onClick={() => setEvaluations(prev => ({ ...prev, [category]: 'B' }))}
          />
          <EvaluationButton 
            letter="C" 
            label="Leve" 
            color="#10B981" 
            isSelected={evaluations[category as keyof typeof evaluations] === 'C'}
            onClick={() => setEvaluations(prev => ({ ...prev, [category]: 'C' }))}
          />
        </div>
      </div>
    </div>
  );

  const canProceed = evaluations.severidad && evaluations.probabilidad && evaluations.frecuencia;

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-12 py-12">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-white font-bold text-3xl mb-2">
            Evaluación Potencial de Pérdida
          </h2>
          <p className="text-white/60 text-lg">
            Evalúa el potencial de pérdida si el riesgo no es controlado
          </p>
        </div>

        <EvaluationRow 
          title="Potencial de Severidad de Pérdida"
          category="severidad"
        />
        <EvaluationRow 
          title="Probabilidad de Ocurrencia"
          category="probabilidad"
        />
        <EvaluationRow 
          title="Frecuencia de Exposición"
          category="frecuencia"
        />

        {canProceed && (
          <div className="flex justify-center pt-8">
            <button
              onClick={onNext}
              className="px-8 py-3 bg-[#FFD600] text-black font-bold rounded-lg hover:bg-[#E6C100] 
                         transition-all duration-300 hover:scale-105"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 2: Contact Type Component
const ContactTypeStep: React.FC<{
  onNext: () => void;
}> = ({ onNext }) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const contactTypes = [
    { id: '1', title: 'Golpeado por (objeto en movimiento)', icon: '⚡' },
    { id: '2', title: 'Golpeado contra (objeto estacionario)', icon: '🔨' },
    { id: '3', title: 'Caída a diferente nivel', icon: '📉' },
    { id: '4', title: 'Caída al mismo nivel', icon: '🚶' },
    { id: '5', title: 'Atrapado por (puntos de pellizco)', icon: '🤏' },
    { id: '6', title: 'Atrapado en', icon: '📦' },
    { id: '7', title: 'Atrapado bajo', icon: '⬇️' },
    { id: '8', title: 'Contacto con', icon: '👋' },
    { id: '9', title: 'Contacto por', icon: '🔥' },
    { id: '10', title: 'Inhalación', icon: '💨' },
    { id: '11', title: 'Absorción', icon: '🧽' },
    { id: '12', title: 'Ingestión', icon: '🍽️' }
  ];

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  return (
    <div className="px-12 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-white font-bold text-3xl mb-2">
            Tipo de Contacto
          </h2>
          <p className="text-white/60 text-lg">
            Selecciona el tipo de contacto o causal con energía o sustancia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {contactTypes.map((contact) => {
            const isSelected = selectedContacts.includes(contact.id);
            return (
              <button
                key={contact.id}
                onClick={() => toggleContact(contact.id)}
                className={`
                  p-6 rounded-xl text-left transition-all duration-300 hover:scale-105
                  ${isSelected 
                    ? 'bg-[#FFD600] text-black border-2 border-[#FFD600]' 
                    : 'bg-[#2E2E2E] text-white border-2 border-transparent hover:border-white/20'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{contact.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{contact.title}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedContacts.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="px-8 py-3 bg-[#FFD600] text-black font-bold rounded-lg hover:bg-[#E6C100] 
                         transition-all duration-300 hover:scale-105"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 6: Accident Data Component
const AccidentDataStep: React.FC<{
  onNext: () => void;
}> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    evento: '',
    involucrados: '',
    area: '',
    fechaHora: '',
    investigador: '',
    otrosDatos: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="px-12 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#FFD600] text-black p-6 rounded-t-xl">
          <h2 className="font-bold text-2xl text-center">DATOS</h2>
          <h3 className="font-bold text-xl text-center">ACCIDENTE / INCIDENTE</h3>
        </div>
        
        <div className="bg-[#2E2E2E] p-8 rounded-b-xl space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black text-sm">📝</span>
              </div>
              <div className="flex-1">
                <label className="block text-white/70 text-sm mb-2">Evento</label>
                <input
                  type="text"
                  value={formData.evento}
                  onChange={(e) => handleInputChange('evento', e.target.value)}
                  className="w-full bg-[#404040] border border-white/20 rounded-lg p-3 text-white"
                  placeholder="Describe el evento..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black text-sm">👥</span>
              </div>
              <div className="flex-1">
                <label className="block text-white/70 text-sm mb-2">Involucrados</label>
                <input
                  type="text"
                  value={formData.involucrados}
                  onChange={(e) => handleInputChange('involucrados', e.target.value)}
                  className="w-full bg-[#404040] border border-white/20 rounded-lg p-3 text-white"
                  placeholder="Personas involucradas..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black text-sm">📍</span>
              </div>
              <div className="flex-1">
                <label className="block text-white/70 text-sm mb-2">Área</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full bg-[#404040] border border-white/20 rounded-lg p-3 text-white"
                  placeholder="Área donde ocurrió..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black text-sm">📅</span>
              </div>
              <div className="flex-1">
                <label className="block text-white/70 text-sm mb-2">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  value={formData.fechaHora}
                  onChange={(e) => handleInputChange('fechaHora', e.target.value)}
                  className="w-full bg-[#404040] border border-white/20 rounded-lg p-3 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black text-sm">🔍</span>
              </div>
              <div className="flex-1">
                <label className="block text-white/70 text-sm mb-2">Investigador</label>
                <input
                  type="text"
                  value={formData.investigador}
                  onChange={(e) => handleInputChange('investigador', e.target.value)}
                  className="w-full bg-[#404040] border border-white/20 rounded-lg p-3 text-white"
                  placeholder="Nombre del investigador..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black text-sm">⋯</span>
              </div>
              <div className="flex-1">
                <label className="block text-white/70 text-sm mb-2">Otros datos</label>
                <textarea
                  value={formData.otrosDatos}
                  onChange={(e) => handleInputChange('otrosDatos', e.target.value)}
                  className="w-full h-24 bg-[#404040] border border-white/20 rounded-lg p-3 text-white resize-none"
                  placeholder="Información adicional..."
                />
              </div>
            </div>
          </div>

          {canProceed && (
            <div className="flex justify-center pt-6">
              <button
                onClick={onNext}
                className="px-8 py-3 bg-[#FFD600] text-black font-bold rounded-lg hover:bg-[#E6C100] 
                           transition-all duration-300 hover:scale-105"
              >
                CONTINUAR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Navigation Controls
const NavigationControls: React.FC<{
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onMenu: () => void;
}> = ({ currentStep, totalSteps, canGoNext, canGoPrevious, onNext, onPrevious, onMenu }) => {
  return (
    <div className="fixed bottom-8 right-8">
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 shadow-2xl border border-white/10">
        {canGoPrevious && (
          <button 
            onClick={onPrevious}
            className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl 
                       transition-all duration-200 hover:scale-110 active:scale-95 text-white/70 
                       hover:text-white"
          >
            <ArrowLeftIcon />
          </button>
        )}
        
        <button 
          onClick={onMenu}
          className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl 
                     transition-all duration-200 hover:scale-110 active:scale-95 text-white/70 
                     hover:text-white"
        >
          <MenuIcon />
        </button>
        
        {canGoNext && (
          <button 
            onClick={onNext}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-yellow-400 
                       to-yellow-500 text-black rounded-xl transition-all duration-200 hover:scale-110 
                       active:scale-95 shadow-lg shadow-yellow-500/25"
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
};

// Main Form Stepper Component
export const SCATFormStepper: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.includes(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleMenu = () => {
    router.push('/tabla-scat');
  };

  const canGoNext = currentStep < FORM_STEPS.length;
  const canGoPrevious = currentStep > 1;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <EvaluationStep onNext={handleNext} />;
      case 2:
        return <ContactTypeStep onNext={handleNext} />;
      case 6:
        return <AccidentDataStep onNext={handleNext} />;
      default:
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-white font-bold text-3xl mb-4">
                Paso {currentStep}: {FORM_STEPS[currentStep - 1]?.title}
              </h2>
              <p className="text-white/60 text-lg mb-8">
                {FORM_STEPS[currentStep - 1]?.subtitle}
              </p>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-[#FFD600] text-black font-bold rounded-lg hover:bg-[#E6C100] 
                           transition-all duration-300 hover:scale-105"
              >
                Continuar
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Header */}
      <SCATHeader currentStep={currentStep} totalSteps={FORM_STEPS.length} />
      
      {/* Step Indicators */}
      <StepIndicator 
        steps={FORM_STEPS} 
        currentStep={currentStep} 
        onStepClick={handleStepClick} 
      />
      
      {/* Current Step Content */}
      {renderCurrentStep()}
      
      {/* Navigation Controls */}
      <NavigationControls
        currentStep={currentStep}
        totalSteps={FORM_STEPS.length}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onMenu={handleMenu}
      />
    </div>
  );
};
