'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  User,
  Trash2,
  Unlink,
  FileText,
} from 'lucide-react';
import { useSocios } from '@/hooks/useSocios';
import { useSocioAsociacion } from '@/hooks/useSocioAsociacion';
import { SocioDialog } from './SocioDialog';
import { AddRegisteredSocioButton } from './AddRegisteredSocioButton';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { UnlinkConfirmDialog } from './UnlinkConfirmDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Socio, SocioFormData } from '@/types/socio';
import toast from 'react-hot-toast';
import Image from 'next/image';

export const EnhancedMemberManagement = () => {
  const { 
    socios, 
    loading, 
    error, 
    stats,
    loadSocios,
    createSocio,
    updateSocio,
    deleteSocio,
    importSocios
  } = useSocios();

  const {
    loadSocios: loadVinculados,
    desvincularSocio
  } = useSocioAsociacion();

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: '',
    estadoMembresia: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para el diálogo de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [socioToDelete, setSocioToDelete] = useState<Socio | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Estados para el diálogo de desvinculación
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [socioToUnlink, setSocioToUnlink] = useState<Socio | null>(null);
  const [unlinking, setUnlinking] = useState(false);

  // Estados para importación/exportación
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadSocios();
    loadVinculados();
  }, [loadSocios, loadVinculados]);

  // Función para refrescar datos
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadSocios(), loadVinculados()]);
      toast.success('Datos actualizados');
    } catch {
      toast.error('Error al actualizar los datos');
    } finally {
      setRefreshing(false);
    }
  };

  // Función para convertir fechas a formato compatible
  const convertDateToTimestamp = (date: Date | Timestamp | string | undefined): Timestamp | undefined => {
    if (!date) return undefined;
    
    if (date instanceof Date) {
      return Timestamp.fromDate(date);
    }
    
    if (date instanceof Timestamp) {
      return date;
    }
    
    if (typeof date === 'string') {
      try {
        return Timestamp.fromDate(new Date(date));
      } catch {
        return undefined;
      }
    }
    
    return undefined;
  };

  // Función para crear/actualizar socio
  const handleSaveSocio = async (data: SocioFormData) => {
    try {
      // Convertir fechas al formato correcto
      const processedData: SocioFormData = {
        ...data,
        fechaNacimiento: convertDateToTimestamp(data.fechaNacimiento),
        fechaVencimiento: convertDateToTimestamp(data.fechaVencimiento)
      };

      if (selectedSocio) {
        await updateSocio(selectedSocio.id, processedData);
        toast.success('Socio actualizado exitosamente');
      } else {
        await createSocio(processedData);
        toast.success('Socio creado exitosamente');
      }
      await handleRefresh();
    } catch {
      toast.error('Error al guardar el socio');
    }
  };

  // Función para abrir el diálogo de eliminación
  const handleDeleteClick = (socio: Socio) => {
    setSocioToDelete(socio);
    setDeleteDialogOpen(true);
  };

  // Función para confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!socioToDelete) return;

    setDeleting(true);
    try {
      const success = await deleteSocio(socioToDelete.id);
      if (success) {
        toast.success('Socio eliminado exitosamente');
        setDeleteDialogOpen(false);
        setSocioToDelete(null);
        await handleRefresh();
      }
    } catch {
      toast.error('Error al eliminar el socio');
    } finally {
      setDeleting(false);
    }
  };

  // Función para cancelar eliminación
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSocioToDelete(null);
  };

  // Función para abrir el diálogo de desvinculación
  const handleUnlinkClick = (socio: Socio) => {
    setSocioToUnlink(socio);
    setUnlinkDialogOpen(true);
  };

  // Función para confirmar desvinculación
  const handleUnlinkConfirm = async () => {
    if (!socioToUnlink) return;

    setUnlinking(true);
    try {
      await desvincularSocio(socioToUnlink.id);
      toast.success('Socio desvinculado exitosamente');
      setUnlinkDialogOpen(false);
      setSocioToUnlink(null);
      await handleRefresh();
    } catch {
      toast.error('Error al desvincular el socio');
    } finally {
      setUnlinking(false);
    }
  };

  // Función para cancelar desvinculación
  const handleUnlinkCancel = () => {
    setUnlinkDialogOpen(false);
    setSocioToUnlink(null);
  };

  // Función optimizada para exportar datos a CSV
  const handleExport = async () => {
    if (exporting) return;
    
    setExporting(true);
    const loadingToast = toast.loading('Preparando exportación...');
    
    try {
      if (socios.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('No hay socios para exportar');
        return;
      }

      // Crear encabezados CSV con mejor formato
      const headers = [
        'Nombre Completo',
        'Correo Electrónico',
        'DNI/Documento',
        'Teléfono',
        'Número de Socio',
        'Estado',
        'Estado de Membresía',
        'Monto de Cuota',
        'Dirección',
        'Fecha de Nacimiento'
      ];

      // Función para escapar valores CSV
      const escapeCSV = (value: unknown): string => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        // Si contiene comas, comillas o saltos de línea, envolver en comillas
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      // Función para formatear fechas de manera segura
      const formatDate = (date: Date | Timestamp | undefined): string => {
        try {
          if (!date) return '';
          if (date instanceof Timestamp) {
            return format(date.toDate(), 'dd/MM/yyyy', { locale: es });
          }
          if (date instanceof Date) {
            return format(date, 'dd/MM/yyyy', { locale: es });
          }
          return '';
        } catch {
          return '';
        }
      };

      // Convertir datos a formato CSV con mejor manejo de errores
      const csvData = socios.map(socio => {
        try {
          return [
            escapeCSV(socio.nombre || ''),
            escapeCSV(socio.email || ''),
            escapeCSV(socio.dni || ''),
            escapeCSV(socio.telefono || ''),
            escapeCSV(socio.numeroSocio || ''),
            escapeCSV(socio.estado || ''),
            escapeCSV(socio.estadoMembresia || ''),
            escapeCSV(socio.montoCuota || 0),
            escapeCSV(socio.beneficiosUsados || 0),
            escapeCSV(socio.direccion || ''),
            escapeCSV(formatDate(socio.fechaNacimiento))
          ].join(',');
        } catch (error) {
          console.error('Error procesando socio:', socio.id, error);
          return '';
        }
      }).filter(row => row !== ''); // Filtrar filas vacías por errores

      // Crear contenido CSV con BOM para mejor compatibilidad con Excel
      const BOM = '\uFEFF';
      const csvContent = BOM + [
        headers.map(escapeCSV).join(','),
        ...csvData
      ].join('\n');

      // Crear y descargar archivo con mejor nombre
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `socios_export_${timestamp}.csv`;
      
      const blob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.dismiss(loadingToast);
      toast.success(`Datos exportados exitosamente (${socios.length} socios)`);
    } catch (error) {
      console.error('Error en exportación:', error);
      toast.dismiss(loadingToast);
      toast.error('Error al exportar los datos. Inténtalo de nuevo.');
    } finally {
      setExporting(false);
    }
  };

  // Función optimizada para importar datos
  const handleImport = async (file: File) => {
    if (importing) return;
    
    setImporting(true);
    const loadingToast = toast.loading('Procesando archivo...');
    
    try {
      // Validar tipo de archivo
      if (!file.name.toLowerCase().endsWith('.csv')) {
        toast.dismiss(loadingToast);
        toast.error('Por favor selecciona un archivo CSV válido');
        return;
      }

      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.dismiss(loadingToast);
        toast.error('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }

      const text = await file.text();
      
      // Remover BOM si existe
      const cleanText = text.replace(/^\uFEFF/, '');
      const lines = cleanText.split(/\r?\n/).filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.dismiss(loadingToast);
        toast.error('El archivo CSV debe tener al menos una fila de encabezados y una fila de datos');
        return;
      }

      toast.dismiss(loadingToast);
      const processingToast = toast.loading('Procesando datos...');

      // Función para parsear CSV de manera más robusta
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++; // Skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        result.push(current.trim());
        return result;
      };

      // Parsear encabezados
      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
      
      // Mapeo de encabezados posibles
      const headerMap: Record<string, string> = {
        'nombre': 'nombre',
        'nombre completo': 'nombre',
        'email': 'email',
        'correo': 'email',
        'correo electrónico': 'email',
        'correo electronico': 'email',
        'dni': 'dni',
        'documento': 'dni',
        'dni/documento': 'dni',
        'telefono': 'telefono',
        'teléfono': 'telefono',
        'numero de socio': 'numeroSocio',
        'número de socio': 'numeroSocio',
        'numero socio': 'numeroSocio',
        'estado': 'estado',
        'estado membresia': 'estadoMembresia',
        'estado de membresía': 'estadoMembresia',
        'estado de membresia': 'estadoMembresia',
        'monto cuota': 'montoCuota',
        'monto de cuota': 'montoCuota',
        'cuota': 'montoCuota',
        'direccion': 'direccion',
        'dirección': 'direccion'
      };

      // Validar que existan campos obligatorios
      const requiredFields = ['nombre', 'email'];
      const mappedHeaders = headers.map(h => headerMap[h] || h);
      const missingFields = requiredFields.filter(field => 
        !mappedHeaders.includes(field)
      );

      if (missingFields.length > 0) {
        toast.dismiss(processingToast);
        toast.error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        return;
      }

      // Procesar datos línea por línea
      const sociosData: SocioFormData[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]);
          
          if (values.length === 0 || values.every(v => !v.trim())) {
            continue; // Saltar líneas vacías
          }

          const socio: Partial<SocioFormData> = {};
          
          headers.forEach((header, idx) => {
            const mappedField = headerMap[header] || header;
            const value = values[idx]?.trim() || '';
            
            if (!value) return;

            switch (mappedField) {
              case 'nombre':
                socio.nombre = value;
                break;
              case 'email':
                // Validar formato de email básico
                if (value.includes('@') && value.includes('.')) {
                  socio.email = value.toLowerCase();
                } else {
                  errors.push(`Línea ${i + 1}: Email inválido "${value}"`);
                }
                break;
              case 'dni':
                socio.dni = value;
                break;
              case 'telefono':
                socio.telefono = value;
                break;
              case 'numeroSocio':
                socio.numeroSocio = value;
                break;
              case 'estado':
                const validStates = ['activo', 'inactivo', 'suspendido', 'pendiente'];
                const normalizedState = value.toLowerCase();
                if (validStates.includes(normalizedState)) {
                  socio.estado = normalizedState as SocioFormData['estado'];
                } else {
                  socio.estado = 'activo'; // Default
                }
                break;
              case 'estadoMembresia':
                const validMembershipStates = ['al_dia', 'vencido', 'pendiente'];
                const normalizedMembership = value.toLowerCase().replace(/\s+/g, '_');
                if (validMembershipStates.includes(normalizedMembership)) {
                  socio.estadoMembresia = normalizedMembership as SocioFormData['estadoMembresia'];
                } else {
                  socio.estadoMembresia = 'al_dia'; // Default
                }
                break;
              case 'montoCuota':
                const amount = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
                if (!isNaN(amount) && amount >= 0) {
                  socio.montoCuota = amount;
                }
                break;
              case 'direccion':
                socio.direccion = value;
                break;
            }
          });

          // Validar campos obligatorios
          if (!socio.nombre || !socio.email) {
            errors.push(`Línea ${i + 1}: Faltan campos obligatorios (nombre o email)`);
            continue;
          }

          // Establecer valores por defecto
          const completeSocio: SocioFormData = {
            nombre: socio.nombre,
            email: socio.email,
            dni: socio.dni || '',
            telefono: socio.telefono || '',
            numeroSocio: socio.numeroSocio || '',
            estado: socio.estado || 'activo',
            estadoMembresia: socio.estadoMembresia || 'al_dia',
            montoCuota: socio.montoCuota || 0,
            direccion: socio.direccion || '',
            fechaNacimiento: undefined,
            fechaVencimiento: undefined
          };

          sociosData.push(completeSocio);
        } catch (error) {
          errors.push(`Línea ${i + 1}: Error procesando datos - ${error}`);
        }
      }

      if (sociosData.length === 0) {
        toast.error('No se encontraron datos válidos para importar');
        return;
      }

      // Mostrar resumen antes de importar
      if (errors.length > 0) {
        const proceed = window.confirm(
          `Se encontraron ${errors.length} errores en el archivo.\n` +
          `Se importarán ${sociosData.length} socios válidos.\n` +
          `¿Deseas continuar?`
        );
        
        if (!proceed) {
          toast('Importación cancelada');
          return;
        }
      }

      const importingToast = toast.loading(`Importando ${sociosData.length} socios...`);

      try {
        await importSocios(sociosData);
        toast.dismiss(importingToast);
        toast.success(
          `Importación completada: ${sociosData.length} socios importados` +
          (errors.length > 0 ? ` (${errors.length} errores omitidos)` : '')
        );
        await handleRefresh();
      } catch (importError) {
        toast.dismiss(importingToast);
        toast.error('Error durante la importación. Algunos datos pueden no haberse guardado.');
        console.error('Import error:', importError);
      }

    } catch (error) {
      console.error('Error en importación:', error);
      toast.dismiss(loadingToast);
      toast.error('Error al procesar el archivo. Verifica que sea un CSV válido.');
    } finally {
      setImporting(false);
      // Limpiar el input file
      const fileInput = document.getElementById('import-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  // Función para descargar plantilla CSV
  const downloadTemplate = () => {
    const headers = [
      'Nombre Completo',
      'Correo Electrónico',
      'DNI/Documento',
      'Teléfono',
      'Número de Socio',
      'Estado',
      'Estado de Membresía',
      'Monto de Cuota',
      'Dirección'
    ];

    const exampleData = [
      'Juan Pérez',
      'juan.perez@email.com',
      '12345678',
      '+54 9 11 1234-5678',
      'SOC001',
      'activo',
      'al_dia',
      '1500',
      'Av. Corrientes 1234, CABA'
    ];

    const csvContent = '\uFEFF' + [
      headers.join(','),
      exampleData.map(field => `"${field}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_socios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Plantilla descargada exitosamente');
  };

  // Filtrar socios
  const filteredSocios = socios.filter(socio => {
    const matchesSearch = 
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (socio.dni && socio.dni.includes(searchTerm)) ||
      (socio.numeroSocio && socio.numeroSocio.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEstado = !filters.estado || socio.estado === filters.estado;
    const matchesMembresia = !filters.estadoMembresia || socio.estadoMembresia === filters.estadoMembresia;

    let matchesFecha = true;
    if (filters.fechaDesde || filters.fechaHasta) {
      const fechaIngreso = socio.fechaIngreso.toDate();
      if (filters.fechaDesde && new Date(filters.fechaDesde) > fechaIngreso) {
        matchesFecha = false;
      }
      if (filters.fechaHasta && new Date(filters.fechaHasta) < fechaIngreso) {
        matchesFecha = false;
      }
    }

    return matchesSearch && matchesEstado && matchesMembresia && matchesFecha;
  });

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando socios...</p>
        </div>
      </div>
    );
  }

  // Renderizar estado de error
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar los socios</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Socios</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Socios Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats?.activos || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Socios Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{stats?.vencidos || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar socios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>

            <AddRegisteredSocioButton 
              onSocioAdded={handleRefresh}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            />

            <button
              onClick={() => {
                setSelectedSocio(null);
                setDialogOpen(true);
              }}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Socio
            </button>

            <div className="flex items-center gap-2">
              {/* Botón de plantilla */}
              <button
                onClick={downloadTemplate}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Descargar plantilla CSV"
              >
                <FileText className="w-5 h-5" />
              </button>

              {/* Botón de exportar */}
              <button
                onClick={handleExport}
                disabled={exporting || socios.length === 0}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Exportar datos"
              >
                <Download className={`w-5 h-5 ${exporting ? 'animate-pulse' : ''}`} />
              </button>

              {/* Botón de importar */}
              <button
                onClick={() => document.getElementById('import-file')?.click()}
                disabled={importing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Importar datos"
              >
                <Upload className={`w-5 h-5 ${importing ? 'animate-pulse' : ''}`} />
              </button>
              <input
                id="import-file"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImport(e.target.files[0]);
                  }
                }}
              />

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Actualizar datos"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de Membresía
                </label>
                <select
                  value={filters.estadoMembresia}
                  onChange={(e) => setFilters(prev => ({ ...prev, estadoMembresia: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="al_dia">Al día</option>
                  <option value="vencido">Vencido</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilters({
                    estado: '',
                    estadoMembresia: '',
                    fechaDesde: '',
                    fechaHasta: ''
                  });
                  setSearchTerm('');
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Limpiar filtros
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lista de Socios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredSocios.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {socios.length === 0 ? 'No hay socios vinculados' : 'No se encontraron socios'}
            </h3>
            <p className="text-gray-600 mb-4">
              {socios.length === 0 
                ? 'Comienza vinculando socios existentes o creando nuevos'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {socios.length === 0 && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <AddRegisteredSocioButton 
                  onSocioAdded={handleRefresh}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                />
                <button
                  onClick={() => {
                    setSelectedSocio(null);
                    setDialogOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo Socio
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSocios.map((socio) => (
                  <tr key={socio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {socio.avatar ? (
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={socio.avatar}
                            alt={socio.nombre}
                            width={40}
                            height={40}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-purple-600" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {socio.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {socio.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {socio.numeroSocio || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        socio.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : socio.estado === 'inactivo'
                          ? 'bg-gray-100 text-gray-800'
                          : socio.estado === 'suspendido'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {socio.estado.charAt(0).toUpperCase() + socio.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(socio.fechaIngreso.toDate(), 'dd/MM/yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {socio.fechaVencimiento
                        ? format(socio.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSocio(socio);
                            setDialogOpen(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="Editar socio"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(socio)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar socio"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleUnlinkClick(socio)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Desvincular socio"
                        >
                          <Unlink className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Diálogo de Socio */}
      <SocioDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSocio}
        socio={selectedSocio}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Socio"
        message={`¿Estás seguro de que deseas eliminar al socio "${socioToDelete?.nombre}"? Esta acción eliminará permanentemente todos los datos del socio, incluyendo su historial de beneficios y validaciones.`}
        confirmText="Eliminar Socio"
        cancelText="Cancelar"
        loading={deleting}
      />

      {/* Diálogo de Confirmación de Desvinculación */}
      <UnlinkConfirmDialog
        open={unlinkDialogOpen}
        onClose={handleUnlinkCancel}
        onConfirm={handleUnlinkConfirm}
        title="Desvincular Socio"
        message={`¿Estás seguro de que deseas desvincular al socio "${socioToUnlink?.nombre}" de esta asociación? El socio mantendrá su cuenta pero perderá acceso a los beneficios de esta asociación.`}
        confirmText="Desvincular"
        cancelText="Cancelar"
        loading={unlinking}
      />
    </div>
  );
};