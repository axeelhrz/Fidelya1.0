'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  X, 
  Save, 
  AlertCircle, 
  Loader2, 
  Shield,
  Calendar,
  CreditCard,
  CheckCircle,
  Info
} from 'lucide-react';
import { BulkEditSocioData } from '@/types/socio';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface BulkEditSociosDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BulkEditSocioData) => Promise<void>;
  selectedSocioIds: string[];
  selectedSocioNames: string[];
  loading?: boolean;
}

export const BulkEditSociosDialog: React.FC<BulkEditSociosDialogProps> = ({
  open,
  onClose,
  onSave,
  selectedSocioIds,
  selectedSocioNames,
  loading = false
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    estado: '',
    estadoMembresia: '',
    montoCuota: '',
    fechaVencimiento: ''
  });

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Resetear formulario cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      setFormData({
        estado: '',
        estadoMembresia: '',
        montoCuota: '',
        fechaVencimiento: ''
      });
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSocioIds.length === 0) {
      toast.error('No hay socios seleccionados');
      return;
    }

    // Verificar que al menos un campo tenga valor
    const hasChanges = Object.values(formData).some(value => value.trim() !== '');
    if (!hasChanges) {
      toast.error('Debe seleccionar al menos un campo para actualizar');
      return;
    }

    try {
      setIsSubmitting(true);

      // Preparar datos para la actualización
      const changes: BulkEditSocioData['changes'] = {};

      if (formData.estado) {
        changes.estado = formData.estado as 'activo' | 'inactivo' | 'vencido';
      }

      if (formData.estadoMembresia) {
        changes.estadoMembresia = formData.estadoMembresia as 'al_dia' | 'vencido' | 'pendiente';
      }

      if (formData.montoCuota) {
        const monto = parseFloat(formData.montoCuota);
        if (!isNaN(monto) && monto >= 0) {
          changes.montoCuota = monto;
        }
      }

      if (formData.fechaVencimiento) {
        changes.fechaVencimiento = Timestamp.fromDate(new Date(formData.fechaVencimiento));
      }

      const bulkEditData: BulkEditSocioData = {
        socioIds: selectedSocioIds,
        changes
      };

      await onSave(bulkEditData);
      onClose();
    } catch (error) {
      console.error('Error en edición múltiple:', error);
      toast.error('Error al actualizar los socios');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Editar Múltiples Socios
                      </h2>
                      <p className="text-white/80 text-sm">
                        Actualizar {selectedSocioIds.length} socios seleccionados
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Información de socios seleccionados */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-2">
                        Socios seleccionados ({selectedSocioIds.length})
                      </h3>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {selectedSocioNames.slice(0, 10).map((name, index) => (
                            <div key={index} className="text-sm text-blue-700 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1 text-blue-500" />
                              {name}
                            </div>
                          ))}
                        </div>
                        {selectedSocioNames.length > 10 && (
                          <div className="text-sm text-blue-600 mt-2 font-medium">
                            ... y {selectedSocioNames.length - 10} socios más
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campos de edición */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Estado */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Shield className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={formData.estado}
                          onChange={(e) => handleInputChange('estado', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors bg-white"
                        >
                          <option value="">Sin cambios</option>
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                          <option value="vencido">Vencido</option>
                        </select>
                      </div>
                    </div>

                    {/* Estado de Membresía */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estado de Membresía
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Shield className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={formData.estadoMembresia}
                          onChange={(e) => handleInputChange('estadoMembresia', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors bg-white"
                        >
                          <option value="">Sin cambios</option>
                          <option value="al_dia">Al día</option>
                          <option value="vencido">Vencido</option>
                          <option value="pendiente">Pendiente</option>
                        </select>
                      </div>
                    </div>

                    {/* Monto de Cuota */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Monto de Cuota
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.montoCuota}
                          onChange={(e) => handleInputChange('montoCuota', e.target.value)}
                          placeholder="Dejar vacío para no cambiar"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors bg-white"
                        />
                      </div>
                    </div>

                    {/* Fecha de Vencimiento */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de Vencimiento
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          value={formData.fechaVencimiento}
                          onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Advertencia */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                          Importante
                        </h3>
                        <p className="text-sm text-yellow-700">
                          Los cambios se aplicarán a todos los socios seleccionados. 
                          Solo se actualizarán los campos que tengan valores. 
                          Los campos vacíos no se modificarán.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Actualizando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Actualizar {selectedSocioIds.length} Socios</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};