'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Socio } from '@/types/socio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  socio: Socio | null;
  loading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  socio,
  loading = false
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting socio:', error);
    }
  };

  if (!socio) return null;

  return (
    <Dialog open={open} onClose={onClose} className="max-w-md">
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-4">
            ¿Estás seguro de que deseas eliminar al socio <strong>{socio.nombre}</strong>?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> El socio será marcado como inactivo y no se eliminará permanentemente. 
              Podrás reactivarlo más tarde si es necesario.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar Socio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
