'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, CreditCard } from 'lucide-react';
import { Socio, SocioFormData } from '@/types/socio';
import { socioSchema } from '@/lib/validations/socio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SocioDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SocioFormData) => Promise<void>;
  socio?: Socio | null;
  loading?: boolean;
}

export const SocioDialog: React.FC<SocioDialogProps> = ({
  open,
  onClose,
  onSave,
  socio,
  loading = false
}) => {
  const isEditing = !!socio;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema),
    defaultValues: {
      nombre: '',
      email: '',
      estado: 'activo',
      telefono: '',
      dni: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (socio) {
        reset({
          nombre: socio.nombre,
          email: socio.email,
          estado: socio.estado === 'inactivo' ? 'activo' : socio.estado,
          telefono: socio.telefono || '',
          dni: socio.dni || ''
        });
      } else {
        reset({
          nombre: '',
          email: '',
          estado: 'activo',
          telefono: '',
          dni: ''
        });
      }
    }
  }, [open, socio, reset]);

  const onSubmit = async (data: SocioFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving socio:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-lg">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Nombre completo"
              placeholder="Ingresa el nombre completo"
              icon={<User size={16} />}
              error={errors.nombre?.message}
              {...register('nombre')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="socio@email.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                {...register('estado')}
              >
                <option value="activo">Activo</option>
                <option value="vencido">Vencido</option>
              </select>
              {errors.estado && (
                <p className="text-sm text-red-500 mt-1">{errors.estado.message}</p>
              )}
            </div>

            <Input
              label="Teléfono (opcional)"
              placeholder="Número de teléfono"
              icon={<Phone size={16} />}
              error={errors.telefono?.message}
              {...register('telefono')}
            />

            <Input
              label="DNI (opcional)"
              placeholder="Documento de identidad"
              icon={<CreditCard size={16} />}
              error={errors.dni?.message}
              {...register('dni')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEditing ? 'Actualizar' : 'Crear'} Socio
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
