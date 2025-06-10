'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NACModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    number: number;
    title: string;
    description: string;
    examples: string[];
  } | null;
  status: 'none' | 'completed' | 'partial' | 'not-completed';
  onStatusChange: (status: 'none' | 'completed' | 'partial' | 'not-completed') => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const NACModal: React.FC<NACModalProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  status, 
  onStatusChange 
}) => {
  const [observations, setObservations] = useState('');

  const statusOptions = [
    { 
      key: 'completed' as const, 
      label: 'Cumplido', 
      color: '#00D26A', 
      icon: CheckIcon,
      description: 'Este control está implementado correctamente'
    },
    { 
      key: 'partial' as const, 
      label: 'Parcial', 
      color: '#FFD600', 
      icon: WarningIcon,
      description: 'Este control está parcialmente implementado'
    },
    { 
      key: 'not-completed' as const, 
      label: 'No Cumplido', 
      color: '#FF3B30', 
      icon: XIcon,
      description: 'Este control no está implementado'
    }
  ];

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#2E2E2E] shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFD600] rounded-full flex items-center justify-center text-black font-bold text-lg">
                    {item.number}
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Necesidad de Acción de Control #{item.number}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-4">Descripción</h3>
                <p className="text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Examples */}
              {item.examples.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-white font-semibold text-lg mb-4">Ejemplos de Implementación</h3>
                  <ul className="space-y-3">
                    {item.examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#FFD600] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status Selection */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-4">Estado de Implementación</h3>
                <div className="grid gap-3">
                  {statusOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = status === option.key;
                    
                    return (
                      <motion.button
                        key={option.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStatusChange(option.key)}
                        className={`
                          p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${isSelected 
                            ? 'border-current bg-opacity-10' 
                            : 'border-gray-600 hover:border-gray-500'
                          }
                        `}
                        style={{ 
                          color: isSelected ? option.color : '#ffffff',
                          backgroundColor: isSelected ? `${option.color}20` : 'transparent'
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: option.color }}
                          >
                            <IconComponent />
                          </div>
                          <span className="font-semibold">{option.label}</span>
                        </div>
                        <p className="text-sm opacity-80 ml-11">
                          {option.description}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Observations */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-4">Observaciones</h3>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Agregar observaciones específicas sobre este control..."
                  className="w-full h-32 bg-[#404040] border border-gray-600 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 bg-[#FFD600] text-black font-semibold py-3 px-6 rounded-xl hover:bg-[#FFC107] transition-all duration-200"
                >
                  Guardar Evaluación
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200"
                >
                  Cerrar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NACModal;
