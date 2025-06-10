'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface SCATItemCardProps {
  number: number;
  title: string;
  subtitle?: string;
  isCompleted?: boolean;
  isSelected?: boolean;
  hasClip?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  progress?: number;
}

const SCATItemCard: React.FC<SCATItemCardProps> = ({
  number,
  title,
  subtitle,
  isCompleted = false,
  isSelected = false,
  hasClip = false,
  onClick,
  variant = 'default',
  progress
}) => {
  const ClipIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );

  const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </svg>
  );

  const getCardStyles = () => {
    const baseStyles = "relative overflow-hidden transition-all duration-300 cursor-pointer group";
    
    if (variant === 'compact') {
      return `${baseStyles} bg-[#404040] rounded-lg p-4 hover:bg-[#4A4A4A] border border-[#555555]`;
    }
    
    if (variant === 'detailed') {
      return `${baseStyles} bg-[#404040] rounded-xl p-6 hover:bg-[#4A4A4A] border border-[#555555] hover:border-[#666666]`;
    }
    
    return `${baseStyles} bg-[#404040] rounded-lg p-5 hover:bg-[#4A4A4A] border border-[#555555] hover:border-[#666666] ${
      isSelected ? 'ring-2 ring-[#FFD600] border-[#FFD600]' : ''
    }`;
  };

  return (
    <motion.div
      className={getCardStyles()}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Indicador de progreso */}
      {progress !== undefined && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E2E2E] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6B6B] via-[#FFD600] to-[#00D26A]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Número de causa */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
            isCompleted 
              ? 'bg-[#00D26A] text-white' 
              : isSelected 
                ? 'bg-[#FFD600] text-black'
                : 'bg-[#2E2E2E] text-white'
          }`}>
            {isCompleted ? <CheckIcon /> : number}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-base leading-tight mb-1 group-hover:text-[#FFD600] transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[#B3B3B3] text-sm leading-tight">
                {subtitle}
              </p>
            )}
            
            {/* Indicadores adicionales */}
            <div className="flex items-center gap-2 mt-2">
              {hasClip && (
                <div className="flex items-center gap-1 text-[#FFD600] text-xs">
                  <ClipIcon />
                  <span>Adjunto</span>
                </div>
              )}
              {isCompleted && (
                <div className="flex items-center gap-1 text-[#00D26A] text-xs">
                  <CheckIcon />
                  <span>Completado</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flecha de navegación */}
        <div className="flex-shrink-0 text-[#B3B3B3] group-hover:text-[#FFD600] transition-colors">
          <ArrowIcon />
        </div>
      </div>

      {/* Efecto de hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default SCATItemCard;
