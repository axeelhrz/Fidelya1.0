'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  X,
  Zap,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { ClienteFormData } from '@/types/cliente';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface QuickClienteCreatorProps {
  onCreateCliente: (clienteData: ClienteFormData) => Promise<string | null>;
  loading: boolean;
}

export const QuickClienteCreator: React.FC<QuickClienteCreatorProps> = ({
  onCreateCliente,
  loading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickFormData, setQuickFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validar formulario rápido
  const validateQuickForm = () => {
    const newErrors: Record<string, string> = {};

    if (!quickFormData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!quickFormData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(quickFormData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Crear cliente rápido
  const handleQuickCreate = async () => {
    if (!validateQuickForm()) return;

    const clienteData: ClienteFormData = {
      nombre: quickFormData.nombre,
      email: quickFormData.email,
      telefono: quickFormData.telefono || undefined,
      direccion: quickFormData.direccion || undefined,
      dni: '',
      fechaNacimiento: '',
      notas: '',
      tags: [],
      configuracion: {
        recibirNotificaciones: true,
        recibirPromociones: true,
        recibirEmail: true,
        recibirSMS: false,
      },
    };

    try {
      const clienteId = await onCreateCliente(clienteData);
      if (clienteId) {
        toast.success('Cliente creado exitosamente');
        resetForm();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error creating cliente:', error);
      toast.error('Error al crear cliente');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setQuickFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: ''
    });
    setErrors({});
  };

  // Cerrar modal
  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <>
      {/* Botón flotante de acceso rápido */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <UserPlus size={24} />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Crear cliente rápido
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900"></div>
        </div>
      </motion.button>

      {/* Modal de creación rápida */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Crear Cliente Rápido</h3>
                      <p className="text-purple-100 text-sm">Solo datos esenciales</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Información sobre creación rápida */}
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Creación rápida</p>
                    <p>Solo necesitas nombre y email. Podrás completar más información después.</p>
                  </div>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Nombre completo *"
                      value={quickFormData.nombre}
                      onChange={(e) => {
                        setQuickFormData(prev => ({ ...prev, nombre: e.target.value }));
                        if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' }));
                      }}
                      placeholder="Ej: Juan Pérez"
                      error={errors.nombre}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Email *"
                      type="email"
                      value={quickFormData.email}
                      onChange={(e) => {
                        setQuickFormData(prev => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="ejemplo@correo.com"
                      error={errors.email}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Teléfono (opcional)"
                      value={quickFormData.telefono}
                      onChange={(e) => setQuickFormData(prev => ({ ...prev, telefono: e.target.value }))}
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                  <div>
                    <Input
                      label="Dirección (opcional)"
                      value={quickFormData.direccion}
                      onChange={(e) => setQuickFormData(prev => ({ ...prev, direccion: e.target.value }))}
                      placeholder="Calle 123, Ciudad"
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Configuración por defecto:</h4>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span>Recibirá notificaciones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span>Recibirá promociones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span>Comunicación por email habilitada</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Podrás editar toda la información después
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleQuickCreate}
                    loading={loading}
                    disabled={!quickFormData.nombre.trim() || !quickFormData.email.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Crear Cliente
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};