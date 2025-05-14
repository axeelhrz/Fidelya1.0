'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente GuestGuard modificado para permitir acceso sin restricciones
export default function GuestGuard({ children }: { children: React.ReactNode }) {
  
  // Renderizar contenido sin verificaciones
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="guest-content"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
