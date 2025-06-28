'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Mail, Phone, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';

export const ProfileCard: React.FC = () => {
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    telefono: user?.telefono || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    // Aquí iría la lógica para actualizar el perfil
    console.log('Guardando perfil:', formData);
    setEditModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Header con gradiente */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-start justify-between -mt-12 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit3 size={16} />}
              onClick={() => setEditModalOpen(true)}
              className="mt-4"
            >
              Editar
            </Button>
          </div>

          {/* Información del usuario */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.nombre || 'Nombre del Socio'}</h2>
              <p className="text-sm text-gray-500">Socio Activo</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-gray-600" />
                </div>
                <span className="text-gray-900">{user?.email}</span>
              </div>

              {user?.telefono && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-gray-600" />
                  </div>
                  <span className="text-gray-900">{user.telefono}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-gray-600" />
                </div>
                <span className="text-gray-900">Miembro desde 2024</span>
              </div>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">12</div>
                <div className="text-xs text-gray-500">Beneficios Usados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">$2,450</div>
                <div className="text-xs text-gray-500">Ahorrado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">5</div>
                <div className="text-xs text-gray-500">Este Mes</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de edición */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              label="Nombre completo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Tu nombre completo"
            />

            <Input
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="Tu número de teléfono"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Tu email"
              disabled
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
