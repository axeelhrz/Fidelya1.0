'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { Socio } from '@/types/socio';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

interface SociosTableProps {
  socios: Socio[];
  loading: boolean;
  onEdit: (socio: Socio) => void;
  onDelete: (socio: Socio) => void;
  onAdd: () => void;
}

const ITEMS_PER_PAGE = 10;

export const SociosTable: React.FC<SociosTableProps> = ({
  socios,
  loading,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'vencido'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSocios = useMemo(() => {
    return socios.filter(socio => {
      const matchesSearch = 
        socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.telefono?.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || socio.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [socios, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredSocios.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSocios = filteredSocios.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (estado: string) => {
    const styles = {
      activo: 'bg-green-100 text-green-800',
      vencido: 'bg-red-100 text-red-800',
      inactivo: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      activo: 'Activo',
      vencido: 'Vencido',
      inactivo: 'Inactivo'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[estado as keyof typeof styles]}`}>
        {labels[estado as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Socios</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredSocios.length} socios encontrados
            </p>
          </div>
          <Button onClick={onAdd} leftIcon={<Plus size={16} />}>
            Nuevo Socio
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, email, DNI o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="vencido">Vencidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {paginatedSocios.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay socios</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron socios con los filtros aplicados'
                : 'Comienza agregando tu primer socio'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={onAdd} leftIcon={<Plus size={16} />}>
                Agregar Primer Socio
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Socio
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Alta
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSocios.map((socio, index) => (
                <motion.tr
                  key={socio.uid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{socio.nombre}</div>
                      {socio.dni && (
                        <div className="text-sm text-gray-500">DNI: {socio.dni}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={14} className="mr-2" />
                        {socio.email}
                      </div>
                      {socio.telefono && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-2" />
                          {socio.telefono}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(socio.estado)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2" />
                      {formatDate(socio.creadoEn)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(socio)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Editar socio"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(socio)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar socio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, filteredSocios.length)} de {filteredSocios.length} socios
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-900">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
