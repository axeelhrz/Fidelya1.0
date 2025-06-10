'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSCAT } from '@/contexts/SCATContext';

interface ValidationFooterProps {
  causeId: string;
  onValidationChange?: (type: 'P' | 'E' | 'C', value: boolean) => void;
}

const ValidationFooter: React.FC<ValidationFooterProps> = ({
  causeId,
  onValidationChange
}) => {
  const { state, dispatch } = useSCAT();
  const [showDetails, setShowDetails] = useState(false);
  
  const currentValidations = state.currentProject?.validations[causeId] || {
    P: null,
    E: null,
    C: null
  };

  const validationQuestions = {
    P: {
      title: "Potencial de Pérdida",
      question: "¿Esta causa tiene potencial de generar pérdidas significativas?",
      description: "Evalúa si esta causa podría resultar en lesiones graves, daños materiales importantes o impacto operacional significativo."
    },
    E: {
      title: "Exposición",
      question: "¿Las personas están frecuentemente expuestas a esta causa?",
      description: "Considera la frecuencia con la que las personas están expuestas a esta condición o realizan esta actividad."
    },
    C: {
      title: "Control",
      question: "¿Existen controles efectivos para esta causa?",
      description: "Evalúa si hay medidas de control implementadas y si son efectivas para prevenir o mitigar esta causa."
    }
  };

  const handleValidationClick = (type: 'P' | 'E' | 'C', value: boolean) => {
    dispatch({
      type: 'UPDATE_VALIDATION',
      payload: { causeId, type, value }
    });
    
    if (onValidationChange) {
      onValidationChange(type, value);
    }
  };

  const ValidationButton: React.FC<{
    type: 'P' | 'E' | 'C';
    value: boolean;
    isSelected: boolean | null;
  }> = ({ type, value, isSelected }) => {
    const colors = {
      P: { bg: '#FF6B6B', text: 'white' },
      E: { bg: '#FFD600', text: 'black' },
      C: { bg: '#00D26A', text: 'white' }
    };

    const getButtonStyle = () => {
      if (isSelected === value) {
        return `bg-[${colors[type].bg}] text-[${colors[type].text}] ring-2 ring-white/50`;
      }
      return 'bg-[#404040] text-[#B3B3B3] hover:bg-[#4A4A4A] hover:text-white';
    };

    return (
      <motion.button
        onClick={() => handleValidationClick(type, value)}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${getButtonStyle()}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={isSelected === value ? { 
          backgroundColor: colors[type].bg, 
          color: colors[type].text 
        } : {}}
      >
        {value ? 'SÍ' : 'NO'}
      </motion.button>
    );
  };

  const getCompletionStatus = () => {
    const completed = Object.values(currentValidations).filter(v => v !== null).length;
    return `${completed}/3`;
  };

  return (
    <motion.div 
      className="bg-[#2E2E2E] border-t border-[#555555]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header de validaciones */}
      <div className="px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-lg">Validación de Causa</h3>
            <p className="text-[#B3B3B3] text-sm">
              Responde las siguientes preguntas para validar esta causa
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">Progreso</p>
              <p className="text-[#FFD600] text-sm font-bold">{getCompletionStatus()}</p>
            </div>
            
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-[#404040] text-white hover:bg-[#4A4A4A] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className={`transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
              >
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Validaciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(validationQuestions).map(([key, config]) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ 
                    backgroundColor: key === 'P' ? '#FF6B6B' : key === 'E' ? '#FFD600' : '#00D26A'
                  }}
                />
                <h4 className="text-white font-medium">{config.title}</h4>
              </div>
              
              <p className="text-[#B3B3B3] text-sm leading-relaxed">
                {config.question}
              </p>
              
              <div className="flex gap-2">
                <ValidationButton
                  type={key as 'P' | 'E' | 'C'}
                  value={true}
                  isSelected={currentValidations[key as 'P' | 'E' | 'C']}
                />
                <ValidationButton
                  type={key as 'P' | 'E' | 'C'}
                  value={false}
                  isSelected={currentValidations[key as 'P' | 'E' | 'C']}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalles expandibles */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[#555555] px-8 py-4 bg-[#404040]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(validationQuestions).map(([key, config]) => (
                <div key={key} className="space-y-2">
                  <h5 className="text-white font-medium text-sm">{config.title} - Detalles</h5>
                  <p className="text-[#B3B3B3] text-xs leading-relaxed">
                    {config.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ValidationFooter;
