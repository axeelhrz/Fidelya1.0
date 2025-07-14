'use client';

import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { VincularSocioDialog } from './VincularSocioDialog';

interface AddRegisteredSocioButtonProps {
  onSocioAdded?: () => void;
  className?: string;
}

export const AddRegisteredSocioButton: React.FC<AddRegisteredSocioButtonProps> = ({
  onSocioAdded,
  className = ''
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSuccess = () => {
    onSocioAdded?.();
  };

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className={`inline-flex items-center px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 ${className}`}
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Vincular Socio Existente
      </button>

      <VincularSocioDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};