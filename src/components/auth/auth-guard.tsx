'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Componente AuthGuard modificado para permitir acceso sin restricciones
export default function AuthGuard({ 
  children, 
  fallback,
  requiredRoles = [] 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
}) {
  const pathname = usePathname();
  
  // Renderizar contenido sin verificaciones
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
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
