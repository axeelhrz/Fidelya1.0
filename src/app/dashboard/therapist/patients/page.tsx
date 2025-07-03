'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  SortAsc,
  SortDesc,
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTherapistPatients } from '@/hooks/useTherapistPatients';
import { PatientForm } from '@/components/clinical/patients/PatientForm';
import { PatientDetailsModal } from '@/components/clinical/patients/PatientDetailsModal';
import { PatientFilters } from '@/components/clinical/patients/PatientFilters';
import { PatientStats } from '@/components/clinical/patients/PatientStats';
import { ExportModal } from '@/components/clinical/patients/ExportModal';
import { ExtendedPatient, PatientFilters as PatientFiltersType } from '@/types/clinical';
import { PatientCard } from '@/components/clinical/patients/PatientCard';

type SortField = 'firstName' | 'lastName' | 'age' | 'gender' | 'status' | 'riskLevel' | 'lastSession' | 'totalSessions' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function TherapistPatientsPage() {
  const { user } = useAuth();
  const {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    refreshPatients
  } = useTherapistPatients();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PatientFiltersType>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'lastName', direction: 'asc' });
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<ExtendedPatient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<ExtendedPatient | null>(null);

  // Loading states
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and sort patients
  const filteredAndSortedPatients = React.useMemo(() => {
    const filtered = patients.filter(patient => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          patient.firstName.toLowerCase().includes(search) ||
          patient.lastName.toLowerCase().includes(search) ||
          patient.email.toLowerCase().includes(search) ||
          patient.phone.includes(search) ||
          patient.tags?.some(tag => tag.toLowerCase().includes(search));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && patient.status !== filters.status) return false;

      // Gender filter
      if (filters.gender && patient.gender !== filters.gender) return false;

      // Risk level filter
      if (filters.riskLevel && patient.riskLevel !== filters.riskLevel) return false;

      // Age range filter
      if (filters.ageRange) {
        const age = calculateAge(patient.dateOfBirth);
        if (age < filters.ageRange.min || age > filters.ageRange.max) return false;
      }

      // Assigned therapist filter (for multi-therapist centers)
      if (filters.assignedTherapist && patient.assignedTherapist !== filters.assignedTherapist) return false;

      // Date range filter
      if (filters.dateRange) {
        const createdAt = new Date(patient.createdAt);
        if (filters.dateRange.start && createdAt < filters.dateRange.start) return false;
        if (filters.dateRange.end && createdAt > filters.dateRange.end) return false;
      }

      return true;
    });

    // Sort patients
    filtered.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortConfig.field) {
        case 'firstName':
          aValue = a.firstName.toLowerCase();
          bValue = b.firstName.toLowerCase();
          break;
        case 'lastName':
          aValue = a.lastName.toLowerCase();
          bValue = b.lastName.toLowerCase();
          break;
        case 'age':
          aValue = calculateAge(a.dateOfBirth);
          bValue = calculateAge(b.dateOfBirth);
          break;
        case 'gender':
          aValue = a.gender;
          bValue = b.gender;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'riskLevel':
          const riskOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = riskOrder[a.riskLevel];
          bValue = riskOrder[b.riskLevel];
          break;
        case 'lastSession':
          aValue = a.lastSession ? new Date(a.lastSession).getTime() : 0;
          bValue = b.lastSession ? new Date(b.lastSession).getTime() : 0;
          break;
        case 'totalSessions':
          aValue = a.totalSessions || 0;
          bValue = b.totalSessions || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.lastName.toLowerCase();
          bValue = b.lastName.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [patients, searchTerm, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPatients.length / patientsPerPage);
  const paginatedPatients = filteredAndSortedPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  // Utility functions
  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatLastSession = (lastSession?: Date) => {
    if (!lastSession) return 'Sin sesiones';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastSession.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return lastSession.toLocaleDateString('es-ES');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#7C2D12';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'discharged': return '#2563EB';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Event handlers
  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectPatient = (patientId: string, selected: boolean) => {
    setSelectedPatients(prev => 
      selected 
        ? [...prev, patientId]
        : prev.filter(id => id !== patientId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedPatients(selected ? paginatedPatients.map(p => p.id) : []);
  };

  const handleCreatePatient = async (patientData: Partial<ExtendedPatient>) => {
    try {
      await createPatient(patientData);
      setShowPatientForm(false);
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  const handleUpdatePatient = async (patientData: Partial<ExtendedPatient>) => {
    if (!editingPatient) return;
    
    try {
      await updatePatient(editingPatient.id, patientData);
      setShowPatientForm(false);
      setEditingPatient(null);
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(patientId);
    try {
      await deletePatient(patientId);
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPatients();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewPatient = (patient: ExtendedPatient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleEditPatient = (patient: ExtendedPatient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '1.25rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Users size={28} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: '#065F46',
              textShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
            }}>
              Mis Pacientes
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#047857',
              fontWeight: 600,
              margin: '0.5rem 0 0 0'
            }}>
              Gestiona tu cartera de pacientes de forma profesional y segura
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#047857' }}>
                {filteredAndSortedPatients.length} pacientes encontrados
              </span>
              <div style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#065F46'
              }}>
                {selectedPatients.length} seleccionados
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPatientForm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <UserPlus size={18} />
            Nuevo Paciente
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#047857',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              opacity: isRefreshing ? 0.7 : 1,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <RefreshCw size={16} style={{ 
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none' 
            }} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderToolbar = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '300px' }}>
          <Search 
            size={18} 
            color="#6B7280" 
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono o etiquetas..."
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
          />
        </div>

        {/* Filters Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: showFilters ? '#EEF2FF' : 'white',
            color: showFilters ? '#4338CA' : '#6B7280',
            border: `1px solid ${showFilters ? '#C7D2FE' : '#E5E7EB'}`,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Filter size={16} />
          Filtros
          {Object.keys(filters).length > 0 && (
            <span style={{
              background: '#EF4444',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {Object.keys(filters).length}
            </span>
          )}
        </motion.button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          background: '#F3F4F6',
          borderRadius: '0.5rem',
          padding: '0.25rem'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('table')}
            style={{
              padding: '0.5rem 0.75rem',
              background: viewMode === 'table' ? 'white' : 'transparent',
              color: viewMode === 'table' ? '#374151' : '#6B7280',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
            }}
          >
            Tabla
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('cards')}
            style={{
              padding: '0.5rem 0.75rem',
              background: viewMode === 'cards' ? 'white' : 'transparent',
              color: viewMode === 'cards' ? '#374151' : '#6B7280',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: viewMode === 'cards' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
            }}
          >
            Tarjetas
          </motion.button>
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowExportModal(true)}
          disabled={selectedPatients.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: selectedPatients.length > 0 ? '#10B981' : '#F3F4F6',
            color: selectedPatients.length > 0 ? 'white' : '#9CA3AF',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: selectedPatients.length > 0 ? 'pointer' : 'not-allowed',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Download size={16} />
          Exportar ({selectedPatients.length})
        </motion.button>

        {/* Bulk Actions */}
        {selectedPatients.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (confirm(`¿Está seguro de que desea eliminar ${selectedPatients.length} pacientes seleccionados?`)) {
                selectedPatients.forEach(id => handleDeletePatient(id));
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Trash2 size={16} />
            Eliminar Seleccionados
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  const renderTableHeader = () => {
    const columns = [
      { key: 'select', label: '', sortable: false, width: '50px' },
      { key: 'firstName', label: 'Nombre', sortable: true, width: '200px' },
      { key: 'age', label: 'Edad', sortable: true, width: '80px' },
      { key: 'gender', label: 'Género', sortable: true, width: '100px' },
      { key: 'status', label: 'Estado', sortable: true, width: '120px' },
      { key: 'riskLevel', label: 'Riesgo', sortable: true, width: '100px' },
      { key: 'lastSession', label: 'Última Sesión', sortable: true, width: '150px' },
      { key: 'totalSessions', label: 'Sesiones', sortable: true, width: '100px' },
      { key: 'actions', label: 'Acciones', sortable: false, width: '120px' }
    ];

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: columns.map(col => col.width).join(' '),
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: '#374151',
        fontFamily: 'Inter, sans-serif'
      }}>
        {columns.map((column) => (
          <div key={column.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {column.key === 'select' ? (
              <input
                type="checkbox"
                checked={selectedPatients.length === paginatedPatients.length && paginatedPatients.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <>
                <span>{column.label}</span>
                {column.sortable && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSort(column.key as SortField)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {sortConfig.field === column.key ? (
                      sortConfig.direction === 'asc' ? (
                        <SortAsc size={14} color="#6B7280" />
                      ) : (
                        <SortDesc size={14} color="#6B7280" />
                      )
                    ) : (
                      <div style={{ width: '14px', height: '14px' }} />
                    )}
                  </motion.button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTableRow = (patient: ExtendedPatient, index: number) => {
    const isSelected = selectedPatients.includes(patient.id);
    const age = calculateAge(patient.dateOfBirth);

    return (
      <motion.div
        key={patient.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '50px 200px 80px 100px 120px 100px 150px 100px 120px',
          gap: '1rem',
          padding: '1rem 1.5rem',
          background: isSelected ? '#EFF6FF' : 'white',
          borderBottom: '1px solid #E5E7EB',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => handleViewPatient(patient)}
      >
        {/* Select */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectPatient(patient.id, e.target.checked);
          }}
          style={{ cursor: 'pointer' }}
        />

        {/* Name */}
        <div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#1F2937',
            fontFamily: 'Inter, sans-serif'
          }}>
            {patient.firstName} {patient.lastName}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            {patient.email}
          </div>
        </div>

        {/* Age */}
        <span style={{
          fontSize: '0.875rem',
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }}>
          {age} años
        </span>

        {/* Gender */}
        <span style={{
          fontSize: '0.875rem',
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }}>
          {patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'Otro'}
        </span>

        {/* Status */}
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: patient.status === 'active' ? '#ECFDF5' : 
                         patient.status === 'inactive' ? '#F3F4F6' : 
                         patient.status === 'discharged' ? '#EFF6FF' : '#FFFBEB',
          color: getStatusColor(patient.status),
          fontFamily: 'Inter, sans-serif'
        }}>
          {patient.status === 'active' ? 'Activo' : 
           patient.status === 'inactive' ? 'Inactivo' : 
           patient.status === 'discharged' ? 'Alta' : 
           patient.status === 'pending' ? 'Pendiente' : patient.status}
        </span>

        {/* Risk Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getRiskColor(patient.riskLevel)
          }} />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: getRiskColor(patient.riskLevel),
            fontFamily: 'Inter, sans-serif'
          }}>
            {patient.riskLevel === 'low' ? 'Bajo' :
             patient.riskLevel === 'medium' ? 'Medio' :
             patient.riskLevel === 'high' ? 'Alto' : 'Crítico'}
          </span>
        </div>

        {/* Last Session */}
        <span style={{
          fontSize: '0.875rem',
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }}>
          {formatLastSession(patient.lastSession)}
        </span>

        {/* Total Sessions */}
        <span style={{
          fontSize: '0.875rem',
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }}>
          {patient.totalSessions || 0}
        </span>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleViewPatient(patient);
            }}
            style={{
              padding: '0.375rem',
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            <Eye size={14} color="#2563EB" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleEditPatient(patient);
            }}
            style={{
              padding: '0.375rem',
              background: '#ECFDF5',
              border: '1px solid #D1FAE5',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            <Edit size={14} color="#10B981" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePatient(patient.id);
            }}
            disabled={isDeleting === patient.id}
            style={{
              padding: '0.375rem',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '0.375rem',
              cursor: isDeleting === patient.id ? 'not-allowed' : 'pointer',
              opacity: isDeleting === patient.id ? 0.5 : 1
            }}
          >
            {isDeleting === patient.id ? (
              <div style={{
                width: '14px',
                height: '14px',
                border: '2px solid #DC2626',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <Trash2 size={14} color="#DC2626" />
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const renderTable = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}
    >
      {renderTableHeader()}
      <div style={{ minHeight: '400px' }}>
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #10B981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Cargando pacientes...
            </span>
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <AlertTriangle size={40} color="#EF4444" />
            <span style={{
              fontSize: '0.875rem',
              color: '#EF4444',
              fontFamily: 'Inter, sans-serif'
            }}>
              Error al cargar pacientes: {error}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              style={{
                padding: '0.5rem 1rem',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Reintentar
            </motion.button>
          </div>
        ) : paginatedPatients.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <Users size={40} color="#9CA3AF" />
            <span style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              {searchTerm || Object.keys(filters).length > 0 
                ? 'No se encontraron pacientes con los criterios especificados'
                : 'No hay pacientes registrados'
              }
            </span>
            {!searchTerm && Object.keys(filters).length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPatientForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Plus size={16} />
                Agregar Primer Paciente
              </motion.button>
            )}
          </div>
        ) : (
          paginatedPatients.map((patient, index) => renderTableRow(patient, index))
        )}
      </div>
    </motion.div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          marginTop: '1.5rem'
        }}
      >
        <div style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          fontFamily: 'Inter, sans-serif'
        }}>
          Mostrando {((currentPage - 1) * patientsPerPage) + 1} a {Math.min(currentPage * patientsPerPage, filteredAndSortedPatients.length)} de {filteredAndSortedPatients.length} pacientes
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 0.75rem',
              background: currentPage === 1 ? '#F3F4F6' : 'white',
              color: currentPage === 1 ? '#9CA3AF' : '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Anterior
          </motion.button>

          {pages.map(page => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '0.5rem 0.75rem',
                background: currentPage === page ? '#10B981' : 'white',
                color: currentPage === page ? 'white' : '#374151',
                border: `1px solid ${currentPage === page ? '#10B981' : '#E5E7EB'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                minWidth: '40px'
              }}
            >
              {page}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 0.75rem',
              background: currentPage === totalPages ? '#F3F4F6' : 'white',
              color: currentPage === totalPages ? '#9CA3AF' : '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Siguiente
          </motion.button>
        </div>
      </motion.div>
    );
  };

  if (!user || user.role !== 'therapist') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{ textAlign: 'center' }}>
          <AlertTriangle size={48} color="#EF4444" />
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#1F2937',
                        margin: '1rem 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Acceso Denegado
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Esta página está disponible solo para terapeutas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
        `
      }} />

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {renderHeader()}
        
        <PatientStats patients={filteredAndSortedPatients} />
        
        {renderToolbar()}
        
        <AnimatePresence>
          {showFilters && (
            <PatientFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </AnimatePresence>

        {viewMode === 'table' ? renderTable() : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            {paginatedPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PatientCard
                  patient={patient}
                  onClick={() => handleViewPatient(patient)}
                  showDetails={true}
                  isSelected={selectedPatients.includes(patient.id)}
                  onSelect={(selected: boolean) => handleSelectPatient(patient.id, selected)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {renderPagination()}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPatientForm && (
          <PatientForm
            patient={editingPatient ?? undefined}
            onSave={editingPatient ? handleUpdatePatient : handleCreatePatient}
            onCancel={() => {
              setShowPatientForm(false);
              setEditingPatient(null);
            }}
            mode={editingPatient ? 'edit' : 'create'}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPatientDetails && selectedPatient && (
          <PatientDetailsModal
            patient={selectedPatient}
            onClose={() => {
              setShowPatientDetails(false);
              setSelectedPatient(null);
            }}
            onEdit={() => {
              setShowPatientDetails(false);
              handleEditPatient(selectedPatient);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && (
          <ExportModal
            patients={selectedPatients.map(id => 
              filteredAndSortedPatients.find(p => p.id === id)!
            ).filter(Boolean)}
            onClose={() => setShowExportModal(false)}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

