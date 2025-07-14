'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Search,
  UserPlus,
  X,
  Mail,
  Phone,
  User,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSocioAsociacion } from '@/hooks/useSocioAsociacion';
import { userSearchService, RegisteredUser } from '@/services/user-search.service';
import toast from 'react-hot-toast';

interface VincularSocioDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const VincularSocioDialog: React.FC<VincularSocioDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { vincularSocio, loading: vinculandoSocio } = useSocioAsociacion();

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);

  // Efecto para limpiar la búsqueda cuando se abre/cierra el diálogo
  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setUsers([]);
      setError(null);
      setSelectedUser(null);
    }
  }, [open]);

  // Función para buscar usuarios
  const handleSearch = async () => {
    if (!searchTerm.trim() || !user) return;

    try {
      setSearching(true);
      setError(null);

      // Buscar usuarios que no estén ya vinculados a la asociación
      const result = await userSearchService.searchRegisteredUsers({
        search: searchTerm,
        role: 'socio',
        estado: 'activo',
        excludeAsociacionId: user.uid
      });

      setUsers(result.users);

      if (result.users.length === 0) {
        setError('No se encontraron usuarios con los criterios especificados');
      }
    } catch (err) {
      console.error('Error buscando usuarios:', err);
      setError('Error al buscar usuarios');
      toast.error('Error al buscar usuarios');
    } finally {
      setSearching(false);
    }
  };

  // Función para vincular el socio seleccionado
  const handleVincular = async () => {
    if (!selectedUser || !user) return;

    try {
      // Verificar si el usuario puede ser agregado como socio
      const canAdd = await userSearchService.canAddAsSocio(selectedUser.id, user.uid);
      
      if (!canAdd.canAdd) {
        toast.error(canAdd.reason || 'No se puede agregar este usuario como socio');
        return;
      }

      const success = await vincularSocio(selectedUser.id);
      
      if (success) {
        toast.success('Socio vinculado exitosamente');
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error('Error vinculando socio:', err);
      toast.error('Error al vincular el socio');
    }
  };

  // Manejar tecla Enter en la búsqueda
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <UserPlus className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Vincular Nuevo Socio
                    </h3>
                    <p className="text-sm text-gray-500">
                      Busca y vincula un usuario como socio de la asociación
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Section */}
            <div className="px-6 py-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Buscar por nombre, email o DNI..."
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={searching || vinculandoSocio}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || searching || vinculandoSocio}
                  className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>

              {/* Results Section */}
              <div className="mt-6">
                {error && (
                  <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                {users.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Usuarios encontrados ({users.length})
                    </h4>
                    {users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 transition-colors border rounded-lg cursor-pointer ${
                          selectedUser?.id === user.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {user.avatar ? (
                              <Image
                                src={user.avatar}
                                alt={user.nombre}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{user.nombre}</h4>
                            <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {user.email}
                              </span>
                              {user.telefono && (
                                <span className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {user.telefono}
                                </span>
                              )}
                            </div>
                            {user.dni && (
                              <div className="mt-1 text-sm text-gray-500">
                                DNI: {user.dni}
                              </div>
                            )}
                          </div>
                          {selectedUser?.id === user.id && (
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchTerm && !searching && users.length === 0 && !error && (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron usuarios</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Intenta con otros términos de búsqueda
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  disabled={vinculandoSocio}
                  className="px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVincular}
                  disabled={!selectedUser || vinculandoSocio}
                  className="flex items-center px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {vinculandoSocio ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Vinculando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Vincular Socio
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};