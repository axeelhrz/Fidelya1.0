'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NavigationFooterProps {
  currentSection: 'ci' | 'cb' | 'nac';
  currentCause?: number;
  totalCauses: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onGridView?: () => void;
  onSave?: () => void;
  showSave?: boolean;
}

const NavigationFooter: React.FC<NavigationFooterProps> = ({
  currentSection,
  currentCause,
  totalCauses,
  onPrevious,
  onNext,
  onGridView,
  onSave,
  showSave = true
}) => {
  const router = useRouter();

  const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </svg>
  );

  const GridIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  );

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (currentCause && currentCause > 1) {
      router.push(`/dashboard/tabla-scat/${currentSection}/${currentCause - 1}`);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (currentCause && currentCause < totalCauses) {
      router.push(`/dashboard/tabla-scat/${currentSection}/${currentCause + 1}`);
    }
  };

  const handleGridView = () => {
    if (onGridView) {
      onGridView();
    } else {
      router.push(`/dashboard/tabla-scat/${currentSection}`);
    }
  };

  const canGoPrevious = currentCause && currentCause > 1;
  const canGoNext = currentCause && currentCause < totalCauses;

  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-white/10">
        {/* Botón anterior */}
        <motion.button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`p-3 rounded-xl transition-all duration-200 ${
            canGoPrevious
              ? 'bg-[#404040] text-white hover:bg-[#4A4A4A] hover:scale-105'
              : 'bg-[#2E2E2E] text-[#666666] cursor-not-allowed'
          }`}
          whileHover={canGoPrevious ? { scale: 1.05 } : {}}
          whileTap={canGoPrevious ? { scale: 0.95 } : {}}
        >
          <ArrowLeftIcon />
        </motion.button>

        {/* Indicador de progreso */}
        {currentCause && (
          <div className="px-4 py-2 bg-[#404040] rounded-xl">
            <div className="text-center">
              <div className="text-white font-bold text-sm">
                {currentCause} / {totalCauses}
              </div>
              <div className="text-[#B3B3B3] text-xs uppercase tracking-wide">
                {currentSection.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Botón vista de cuadrícula */}
        <motion.button
          onClick={handleGridView}
          className="p-3 rounded-xl bg-[#FFD600] text-black hover:bg-[#FFC107] transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-tooltip="Vista de cuadrícula"
        >
          <GridIcon />
        </motion.button>

        {/* Botón guardar */}
        {showSave && (
          <motion.button
            onClick={onSave}
            className="p-3 rounded-xl bg-[#00D26A] text-white hover:bg-[#00B050] transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-tooltip="Guardar progreso"
          >
            <SaveIcon />
          </motion.button>
        )}

        {/* Botón siguiente */}
        <motion.button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`p-3 rounded-xl transition-all duration-200 ${
            canGoNext
              ? 'bg-[#404040] text-white hover:bg-[#4A4A4A] hover:scale-105'
              : 'bg-[#2E2E2E] text-[#666666] cursor-not-allowed'
          }`}
          whileHover={canGoNext ? { scale: 1.05 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          <ArrowRightIcon />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NavigationFooter;
