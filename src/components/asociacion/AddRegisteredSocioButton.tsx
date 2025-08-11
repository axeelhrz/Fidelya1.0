'use client';

import React from 'react';

interface AddRegisteredSocioButtonProps {
  onSocioAdded?: () => void;
}

export const AddRegisteredSocioButton: React.FC<AddRegisteredSocioButtonProps> = () => {
  
  // Retornar null para no mostrar el botón
  // Esta funcionalidad ha sido eliminada según los requerimientos del usuario
  return null;

  // Código comentado para referencia histórica:
  /*
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <UserPlus className="w-4 h-4 relative z-10" />
      <span className="relative z-10">Vincular Socio Existente</span>
    </motion.button>
  );
  */
};