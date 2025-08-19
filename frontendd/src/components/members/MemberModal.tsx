'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Member, Club } from '@/types';
import Modal from '@/components/ui/Modal';
import { useEffect } from 'react';

const memberSchema = z.object({
  club_id: z.number().min(1, 'Por favor selecciona un club'),
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  doc_id: z.string().optional(),
  email: z.string().email('Por favor ingresa un email válido').optional().or(z.literal('')),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MemberFormValues) => Promise<void>;
  member?: Member | null;
  clubs: Club[];
  isSubmitting?: boolean;
}

export default function MemberModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  member, 
  clubs,
  isSubmitting = false 
}: MemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      club_id: member?.club_id || (clubs.length === 1 ? clubs[0].id : 0),
      first_name: member?.first_name || '',
      last_name: member?.last_name || '',
      doc_id: member?.doc_id || '',
      email: member?.email || '',
      phone: member?.phone || '',
      birth_date: member?.birth_date || '',
      gender: member?.gender || undefined,
      status: member?.status || 'active',
    },
  });

  // Auto-select club if only one is available
  useEffect(() => {
    if (clubs.length === 1 && !member) {
      setValue('club_id', clubs[0].id);
    }
  }, [clubs, member, setValue]);

  const handleFormSubmit = async (data: MemberFormValues) => {
    // Clean up empty strings
    const cleanData = {
      ...data,
      email: data.email || undefined,
      doc_id: data.doc_id || undefined,
      phone: data.phone || undefined,
      birth_date: data.birth_date || undefined,
      gender: data.gender || undefined,
    };
    
    try {
      await onSubmit(cleanData);
      reset();
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const currentClub = clubs.length === 1 ? clubs[0] : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={member ? 'Editar Miembro' : 'Nuevo Miembro'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Club Field - Hidden if only one club */}
        {clubs.length > 1 ? (
          <div className="space-y-2">
            <label htmlFor="club_id" className="block text-sm font-medium text-gray-700">
              Club
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register('club_id', { valueAsNumber: true })}
              id="club_id"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 ${
                errors.club_id 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{ color: '#111827' }}
            >
              <option value={0} style={{ color: '#111827' }}>Selecciona un club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id} style={{ color: '#111827' }}>
                  {club.name} {club.league?.name && `- ${club.league.name}`}
                </option>
              ))}
            </select>
            {errors.club_id && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.club_id.message}
              </p>
            )}
          </div>
        ) : currentClub ? (
          // Show club info when only one club is available
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Agregando miembro a:</p>
                <p className="text-lg font-semibold text-green-800">{currentClub.name}</p>
                {currentClub.league?.name && (
                  <p className="text-sm text-green-600">Liga: {currentClub.league.name}</p>
                )}
              </div>
            </div>
            {/* Hidden input for club_id */}
            <input type="hidden" {...register('club_id', { valueAsNumber: true })} />
          </div>
        ) : null}

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              Nombre
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register('first_name')}
              type="text"
              id="first_name"
              placeholder="Ingresa el nombre"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 placeholder-gray-500 ${
                errors.first_name 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{ color: '#111827' }}
            />
            {errors.first_name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Apellido
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register('last_name')}
              type="text"
              id="last_name"
              placeholder="Ingresa el apellido"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 placeholder-gray-500 ${
                errors.last_name 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{ color: '#111827' }}
            />
            {errors.last_name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="correo@ejemplo.com (opcional)"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 placeholder-gray-500 ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              style={{ color: '#111827' }}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder="Número de teléfono (opcional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300 text-gray-900 placeholder-gray-500"
              style={{ color: '#111827' }}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="doc_id" className="block text-sm font-medium text-gray-700">
              Documento ID
            </label>
            <input
              {...register('doc_id')}
              type="text"
              id="doc_id"
              placeholder="ID del documento (opcional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300 text-gray-900 placeholder-gray-500"
              style={{ color: '#111827' }}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              {...register('birth_date')}
              type="date"
              id="birth_date"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300 text-gray-900"
              style={{ color: '#111827' }}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Género
            </label>
            <select
              {...register('gender')}
              id="gender"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300 text-gray-900"
              style={{ color: '#111827' }}
            >
              <option value="" style={{ color: '#111827' }}>Seleccionar género</option>
              <option value="male" style={{ color: '#111827' }}>Masculino</option>
              <option value="female" style={{ color: '#111827' }}>Femenino</option>
              <option value="other" style={{ color: '#111827' }}>Otro</option>
            </select>
          </div>
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            {...register('status')}
            id="status"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300 text-gray-900"
            style={{ color: '#111827' }}
          >
            <option value="active" style={{ color: '#111827' }}>Activo</option>
            <option value="inactive" style={{ color: '#111827' }}>Inactivo</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              member ? 'Actualizar Miembro' : 'Crear Miembro'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}