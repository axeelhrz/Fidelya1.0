'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Enhanced Icons
const EditIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const ContactIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const MapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const InspectorIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const MenuIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
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

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

// Enhanced Form Field Component
interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'date' | 'select';
  options?: string[];
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  icon, 
  isActive = false, 
  isCompleted = false,
  onClick,
  value = '',
  placeholder = '',
  type = 'text',
  options = []
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isExpanded, setIsExpanded] = useState(isActive);

  useEffect(() => {
    setIsExpanded(isActive);
  }, [isActive]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };

  return (
    <div className={`
      rounded-xl transition-all duration-300 overflow-hidden
      ${isActive 
        ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400/30 shadow-lg shadow-yellow-500/10' 
        : isCompleted
          ? 'bg-green-500/10 border border-green-500/30'
          : 'bg-zinc-800/30 border border-white/10 hover:border-white/20'
      }
    `}>
      {/* Header */}
      <div 
        className="h-16 px-6 flex items-center justify-between cursor-pointer group"
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
            ${isActive 
              ? 'bg-yellow-400 text-black' 
              : isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-zinc-700 text-white/70 group-hover:bg-zinc-600'
            }
          `}>
            {isCompleted ? <CheckIcon /> : icon}
          </div>
          <span className={`
            font-medium text-base transition-colors duration-300
            ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-white/80 group-hover:text-white'}
          `}>
            {label}
          </span>
        </div>
        
        <div className={`
          transition-transform duration-300
          ${isExpanded ? 'rotate-90' : ''}
        `}>
          <ArrowRightIcon className="w-5 h-5 text-white/40" />
        </div>
      </div>
      
      {/* Expanded Content */}
      <div className={`
        transition-all duration-300 overflow-hidden
        ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 pb-6">
          {type === 'textarea' ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="w-full h-24 bg-zinc-800/50 border border-white/10 rounded-lg p-3 
                       text-white text-sm resize-none focus:outline-none focus:border-yellow-400 
                       focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200
                       placeholder:text-white/40"
            />
          ) : type === 'select' ? (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-zinc-800/50 border border-white/10 rounded-lg p-3 
                       text-white text-sm focus:outline-none focus:border-yellow-400 
                       focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
            >
              <option value="">{placeholder}</option>
              {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-zinc-800/50 border border-white/10 rounded-lg p-3 
                       text-white text-sm focus:outline-none focus:border-yellow-400 
                       focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200
                       placeholder:text-white/40"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Progress Steps Component
const ProgressSteps: React.FC<{ currentStep: number; totalSteps: number }> = ({ 
  currentStep, 
  totalSteps 
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-white/60">Progreso del formulario</span>
      <span className="text-sm text-yellow-400 font-medium">
        {Math.round((currentStep / totalSteps) * 100)}%
      </span>
    </div>
    <div className="w-full bg-zinc-800 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      />
    </div>
  </div>
);

const NuevoProyecto: React.FC = () => {
  const router = useRouter();
  const [activeField, setActiveField] = useState<number>(0);
  const [completedFields, setCompletedFields] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const handleContinue = () => {
    router.push('/tabla-scat');
  };

  const handleFieldClick = (index: number) => {
    setActiveField(activeField === index ? -1 : index);
  };

  const markFieldCompleted = (index: number) => {
    setCompletedFields(prev => new Set([...prev, index]));
    if (index < formFields.length - 1) {
      setActiveField(index + 1);
    }
  };

  const formFields = [
    { 
      label: "Descripción del Evento", 
      icon: <EditIcon />, 
      type: 'textarea' as const,
      placeholder: "Describe detalladamente el evento o incidente..."
    },
    { 
      label: "Persona(s) Involucrada(s)", 
      icon: <ContactIcon />,
      placeholder: "Nombre completo de la(s) persona(s) involucrada(s)"
    },
    { 
      label: "Área o Ubicación", 
      icon: <MapIcon />,
      type: 'select' as const,
      placeholder: "Selecciona el área",
      options: ["Producción", "Almacén", "Oficinas", "Mantenimiento", "Laboratorio", "Exterior"]
    },
    { 
      label: "Fecha y Hora del Incidente", 
      icon: <CalendarIcon />,
      type: 'date' as const
    },
    { 
      label: "Investigador Responsable", 
      icon: <InspectorIcon />,
      placeholder: "Nombre del investigador asignado"
    },
    { 
      label: "Información Adicional", 
      icon: <MenuIcon />,
      type: 'textarea' as const,
      placeholder: "Cualquier información adicional relevante..."
    }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-8">
      {/* Main Form Container */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="card p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/10 animate-fadeInUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 
                          rounded-xl py-4 px-8 mb-4 shadow-lg shadow-yellow-500/25">
              <EditIcon className="text-black" />
              <h1 className="text-black font-bold text-xl tracking-wide">
                NUEVO PROYECTO
              </h1>
            </div>
            <h2 className="text-white/80 font-medium text-lg mb-2">
              Datos del Accidente / Incidente
            </h2>
            <p className="text-white/60 text-sm">
              Complete la información requerida para iniciar el análisis SCAT
            </p>
          </div>

          {/* Progress Steps */}
          <ProgressSteps 
            currentStep={completedFields.size} 
            totalSteps={formFields.length} 
          />

          {/* Form Fields */}
          <div className="space-y-4 mb-8">
            {formFields.map((field, index) => (
              <FormField
                key={index}
                label={field.label}
                icon={field.icon}
                isActive={activeField === index}
                isCompleted={completedFields.has(index)}
                onClick={() => handleFieldClick(index)}
                type={field.type}
                placeholder={field.placeholder}
                options={field.options}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={handleBack}
              className="w-14 h-14 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full 
                       flex items-center justify-center transition-all duration-300 
                       hover:scale-110 active:scale-95 border border-white/10 
                       hover:border-white/20 focus-ring group"
            >
              <ArrowLeftIcon className="text-white/70 group-hover:text-white" />
            </button>
            
            <button 
              onClick={handleContinue}
              disabled={completedFields.size < 3}
              className="btn btn-primary px-8 py-4 text-lg disabled:opacity-50 
                       disabled:cursor-not-allowed hover-lift"
            >
              Continuar al Análisis
              <ArrowRightIcon />
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Complete al menos 3 campos para continuar con el análisis SCAT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoProyecto;