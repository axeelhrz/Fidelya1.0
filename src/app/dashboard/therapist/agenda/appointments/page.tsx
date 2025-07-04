'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Filter,
  Download,
  Search,
  X,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  User,
  MapPin,
  FileText,
  Sun,
  Moon,
  RefreshCw,
  Upload,
  Eye,
  AlertCircle,
  Users,
  Video,
  MessageSquare,
  Copy,
  ExternalLink,
  Settings,
  Archive,
  Star,
  TrendingUp,
  BarChart3,
  Calendar as CalendarIcon,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Columns,
  CheckSquare,
  Square
} from 'lucide-react';
import { useAgenda } from '@/hooks/useAgenda';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentModal from '@/components/clinical/agenda/AppointmentModal';
import AppointmentDetailsModal from '@/components/clinical/agenda/AppointmentDetailsModal';
import { 
  Appointment, 
  AppointmentStatus,
  AppointmentType,
  AgendaFilters, 
  CreateAppointmentData,
  UpdateAppointmentData
} from '@/types/agenda';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Interfaces para la vista
interface TableColumn {
  id: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface ExportConfig {
  format: 'csv' | 'pdf' | 'ics';
  selectedOnly: boolean;
  includeNotes: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface ViewMode {
  type: 'table' | 'grid' | 'timeline';
  density: 'compact' | 'comfortable' | 'spacious';
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const {
    appointments,
    stats,
    loading,
    error,
    clearError,
    fetchAgendaData,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    exportToCSV,
    exportToICS,
    filterAppointments
  } = useAgenda();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'table', density: 'comfortable' });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Data State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AgendaFilters>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'startDateTime', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Mock data for patients and consultorios
  const [patients] = useState([
    { id: '1', name: 'María González', phone: '+1234567890', email: 'maria@email.com' },
    { id: '2', name: 'Carlos Rodríguez', phone: '+1234567891', email: 'carlos@email.com' },
    { id: '3', name: 'Ana Martínez', phone: '+1234567892', email: 'ana@email.com' },
    { id: '4', name: 'Luis Pérez', phone: '+1234567893', email: 'luis@email.com' },
    { id: '5', name: 'Carmen López', phone: '+1234567894', email: 'carmen@email.com' },
    { id: '6', name: 'Roberto Silva', phone: '+1234567895', email: 'roberto@email.com' },
    { id: '7', name: 'Elena Morales', phone: '+1234567896', email: 'elena@email.com' },
    { id: '8', name: 'Diego Herrera', phone: '+1234567897', email: 'diego@email.com' }
  ]);

  const [consultorios] = useState([
    'Consultorio 1',
    'Consultorio 2', 
    'Consultorio 3',
    'Sala de Terapia Familiar',
    'Sala de Terapia Grupal',
    'Consultorio Virtual'
  ]);

  // Table columns configuration
  const columns: TableColumn[] = [
    { id: 'select', label: '', sortable: false, width: '50px', align: 'center' },
    { id: 'startDateTime', label: 'Fecha y Hora', sortable: true, width: '180px' },
    { id: 'patientName', label: 'Paciente', sortable: true, width: '200px' },
    { id: 'consultorio', label: 'Consultorio', sortable: true, width: '150px' },
    { id: 'status', label: 'Estado', sortable: true, width: '120px', align: 'center' },
    { id: 'type', label: 'Tipo', sortable: true, width: '120px' },
    { id: 'motive', label: 'Motivo', sortable: false, width: '250px' },
    { id: 'duration', label: 'Duración', sortable: true, width: '100px', align: 'center' },
    { id: 'actions', label: 'Acciones', sortable: false, width: '120px', align: 'center' }
  ];

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  // Filter and sort appointments
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.patientName.toLowerCase().includes(term) ||
        appointment.motive.toLowerCase().includes(term) ||
        appointment.consultorio?.toLowerCase().includes(term) ||
        appointment.notes?.toLowerCase().includes(term)
      );
    }

    // Apply filters
    filtered = filterAppointments(filtered, filters);

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.field as keyof Appointment];
      let bValue: any = b[sortConfig.field as keyof Appointment];

      // Handle date sorting
      if (sortConfig.field === 'startDateTime') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [appointments, searchTerm, filters, sortConfig, filterAppointments]);

  // Paginated appointments
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedAppointments.slice(startIndex, endIndex);
  }, [filteredAndSortedAppointments, currentPage, pageSize]);

  // Statistics
  const appointmentStats = useMemo(() => {
    const total = filteredAndSortedAppointments.length;
    const today = filteredAndSortedAppointments.filter(apt => isToday(apt.startDateTime)).length;
    const tomorrow = filteredAndSortedAppointments.filter(apt => isTomorrow(apt.startDateTime)).length;
    const thisWeek = filteredAndSortedAppointments.filter(apt => {
      const start = startOfWeek(new Date(), { locale: es });
      const end = endOfWeek(new Date(), { locale: es });
      return apt.startDateTime >= start && apt.startDateTime <= end;
    }).length;

    const byStatus = filteredAndSortedAppointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {} as Record<AppointmentStatus, number>);

    return { total, today, tomorrow, thisWeek, byStatus };
  }, [filteredAndSortedAppointments]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);
    fetchAgendaData(startDate, endDate);
  }, [fetchAgendaData]);

  useEffect(() => {
    // Reset page when filters change
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSort = useCallback((field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleSelectAppointment = useCallback((appointmentId: string, selected: boolean) => {
    setSelectedAppointments(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(appointmentId);
      } else {
        newSet.delete(appointmentId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedAppointments(new Set(paginatedAppointments.map(apt => apt.id)));
    } else {
      setSelectedAppointments(new Set());
    }
  }, [paginatedAppointments]);

  const handleCreateAppointment = useCallback(() => {
    setSelectedAppointment(null);
    setIsCreating(true);
    setShowAppointmentModal(true);
  }, []);

  const handleEditAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCreating(false);
    setShowAppointmentModal(true);
  }, []);

  const handleViewAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  }, []);

  const handleDeleteAppointment = useCallback(async (appointmentId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      await deleteAppointment(appointmentId);
    }
  }, [deleteAppointment]);

  const handleStatusChange = useCallback(async (appointmentId: string, status: AppointmentStatus) => {
    await updateAppointment(appointmentId, { status });
  }, [updateAppointment]);

  const handleBulkStatusChange = useCallback(async (status: AppointmentStatus) => {
    const promises = Array.from(selectedAppointments).map(id => 
      updateAppointment(id, { status })
    );
    await Promise.all(promises);
    setSelectedAppointments(new Set());
  }, [selectedAppointments, updateAppointment]);

  const handleBulkDelete = useCallback(async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar ${selectedAppointments.size} citas?`)) {
      const promises = Array.from(selectedAppointments).map(id => deleteAppointment(id));
      await Promise.all(promises);
      setSelectedAppointments(new Set());
    }
  }, [selectedAppointments, deleteAppointment]);

  const handleExport = useCallback(async (config: ExportConfig) => {
    const appointmentsToExport = config.selectedOnly 
      ? appointments.filter(apt => selectedAppointments.has(apt.id))
      : filteredAndSortedAppointments;

    if (config.format === 'csv') {
      const csvContent = exportToCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `citas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (config.format === 'ics') {
      const icsContent = exportToICS();
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `citas-${format(new Date(), 'yyyy-MM-dd')}.ics`;
      a.click();
      window.URL.revokeObjectURL(url);
    }

    setShowExportModal(false);
  }, [selectedAppointments, filteredAndSortedAppointments, exportToCSV, exportToICS]);

  const handleRefresh = useCallback(() => {
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);
    fetchAgendaData(startDate, endDate);
  }, [fetchAgendaData]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setSelectedAppointments(new Set());
  }, []);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return <Clock size={16} color="#3B82F6" />;
      case 'confirmada': return <CheckCircle size={16} color="#10B981" />;
      case 'check-in': return <User size={16} color="#F59E0B" />;
      case 'no-show': return <X size={16} color="#EF4444" />;
      case 'cancelada': return <X size={16} color="#6B7280" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return 'Reservada';
      case 'confirmada': return 'Confirmada';
      case 'check-in': return 'Check-in';
      case 'no-show': return 'No Show';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return '#3B82F6';
      case 'confirmada': return '#10B981';
      case 'check-in': return '#F59E0B';
      case 'no-show': return '#EF4444';
      case 'cancelada': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'reservada': return '#EFF6FF';
      case 'confirmada': return '#ECFDF5';
      case 'check-in': return '#FFFBEB';
      case 'no-show': return '#FEF2F2';
      case 'cancelada': return '#F9FAFB';
      default: return '#F9FAFB';
    }
  };

  const getTypeLabel = (type: AppointmentType) => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'grupal': return 'Grupal';
      case 'familiar': return 'Familiar';
      case 'pareja': return 'Pareja';
      case 'evaluacion': return 'Evaluación';
      default: return type;
    }
  };

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case 'individual': return '#10B981';
      case 'grupal': return '#6366F1';
      case 'familiar': return '#F59E0B';
      case 'pareja': return '#EC4899';
      case 'evaluacion': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const formatDateRange = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    if (isYesterday(date)) return 'Ayer';
    return format(date, 'dd/MM/yyyy', { locale: es });
  };

  const formatTimeRange = (startDate: Date, duration: number) => {
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`;
  };

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)'
          : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(59, 130, 246, 0.15)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background effects */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(148, 163, 184, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
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
              background: isDarkMode 
                ? 'linear-gradient(135deg, #475569 0%, #334155 100%)'
                : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '1.25rem',
              boxShadow: isDarkMode 
                ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                : '0 8px 24px rgba(59, 130, 246, 0.4)',
              border: `2px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(255, 255, 255, 0.3)'}`
            }}
          >
            <List size={28} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: isDarkMode ? '#F1F5F9' : '#1E40AF',
              textShadow: isDarkMode 
                ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                : '0 2px 4px rgba(59, 130, 246, 0.1)'
            }}>
              Turnos / Appointments
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: isDarkMode ? '#CBD5E1' : '#2563EB',
              fontWeight: 600,
              margin: '0.5rem 0 0 0'
            }}>
              Gestioná todos tus turnos clínicos de forma organizada
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                color: isDarkMode ? '#94A3B8' : '#2563EB' 
              }}>
                {appointmentStats.total} citas • {appointmentStats.today} hoy • {appointmentStats.tomorrow} mañana
              </span>
              <div style={{
                padding: '0.25rem 0.75rem',
                background: isDarkMode 
                  ? 'rgba(148, 163, 184, 0.2)'
                  : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isDarkMode ? '#F1F5F9' : '#1E40AF'
              }}>
                Vista: Lista
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
            onClick={handleCreateAppointment}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Plus size={16} />
            Nuevo Turno
          </motion.button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            background: isDarkMode 
              ? 'rgba(148, 163, 184, 0.2)'
              : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0.875rem',
            border: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
          }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '0.5rem',
                background: showFilters 
                  ? (isDarkMode ? '#475569' : '#3B82F6')
                  : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Filter size={16} color={showFilters ? 'white' : (isDarkMode ? '#94A3B8' : '#3B82F6')} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isDarkMode ? 
                <Sun size={16} color="#94A3B8" /> : 
                <Moon size={16} color="#3B82F6" />
              }
            </motion.button>

            <div style={{ 
              width: '1px', 
              height: '20px', 
              background: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(59, 130, 246, 0.2)' 
            }} />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRefresh}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RefreshCw size={16} color={isDarkMode ? '#94A3B8' : '#3B82F6'} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowExportModal(true)}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Download size={16} color={isDarkMode ? '#94A3B8' : '#3B82F6'} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderFiltersBar = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: isDarkMode 
              ? 'rgba(30, 41, 59, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`,
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isDarkMode ? '#CBD5E1' : '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Buscar Paciente
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color={isDarkMode ? '#64748B' : '#9CA3AF'} style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  type="text"
                  placeholder="Nombre del paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    background: isDarkMode ? '#334155' : 'white',
                    color: isDarkMode ? '#F1F5F9' : '#1F2937'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isDarkMode ? '#CBD5E1' : '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Estado
              </label>
              <select
                value={filters.status?.[0] || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  status: e.target.value ? [e.target.value as AppointmentStatus] : undefined
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  background: isDarkMode ? '#334155' : 'white',
                  color: isDarkMode ? '#F1F5F9' : '#1F2937'
                }}
              >
                <option value="">Todos los estados</option>
                <option value="reservada">Reservada</option>
                <option value="confirmada">Confirmada</option>
                <option value="check-in">Check-in</option>
                <option value="no-show">No Show</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isDarkMode ? '#CBD5E1' : '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Consultorio
              </label>
              <select
                value={filters.consultorio || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  consultorio: e.target.value || undefined
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  background: isDarkMode ? '#334155' : 'white',
                  color: isDarkMode ? '#F1F5F9' : '#1F2937'
                }}
              >
                <option value="">Todos los consultorios</option>
                {consultorios.map(consultorio => (
                  <option key={consultorio} value={consultorio}>
                    {consultorio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isDarkMode ? '#CBD5E1' : '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Fecha
              </label>
              <select
                value=""
                onChange={(e) => {
                  const value = e.target.value;
                  let dateFrom: Date | undefined;
                  let dateTo: Date | undefined;

                  switch (value) {
                    case 'today':
                      dateFrom = startOfDay(new Date());
                      dateTo = endOfDay(new Date());
                      break;
                    case 'tomorrow':
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      dateFrom = startOfDay(tomorrow);
                      dateTo = endOfDay(tomorrow);
                      break;
                    case 'week':
                      dateFrom = startOfWeek(new Date(), { locale: es });
                      dateTo = endOfWeek(new Date(), { locale: es });
                      break;
                    case 'month':
                      dateFrom = startOfMonth(new Date());
                      dateTo = endOfMonth(new Date());
                      break;
                  }

                  setFilters(prev => ({ ...prev, dateFrom, dateTo }));
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  background: isDarkMode ? '#334155' : 'white',
                  color: isDarkMode ? '#F1F5F9' : '#1F2937'
                }}
              >
                <option value="">Seleccionar período</option>
                <option value="today">Hoy</option>
                <option value="tomorrow">Mañana</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                style={{
                  padding: '0.75rem 1rem',
                  background: isDarkMode ? '#475569' : '#F3F4F6',
                  border: `1px solid ${isDarkMode ? '#64748B' : '#D1D5DB'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#F1F5F9' : '#374151',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Limpiar
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderStatsCards = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}
    >
      {[
        { 
          label: 'Total Citas', 
          value: appointmentStats.total, 
          icon: Calendar, 
          color: '#3B82F6',
          bgColor: isDarkMode ? '#1E3A8A' : '#EFF6FF'
        },
        { 
          label: 'Hoy', 
          value: appointmentStats.today, 
          icon: Clock, 
          color: '#10B981',
          bgColor: isDarkMode ? '#064E3B' : '#ECFDF5'
        },
        { 
          label: 'Confirmadas', 
          value: appointmentStats.byStatus.confirmada || 0, 
          icon: CheckCircle, 
          color: '#10B981',
          bgColor: isDarkMode ? '#064E3B' : '#ECFDF5'
        },
        { 
          label: 'Pendientes', 
          value: appointmentStats.byStatus.reservada || 0, 
          icon: Clock, 
          color: '#F59E0B',
          bgColor: isDarkMode ? '#92400E' : '#FFFBEB'
        }
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '1.5rem',
            background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            border: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`,
            boxShadow: isDarkMode 
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: stat.color,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: isDarkMode ? '#94A3B8' : '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                {stat.label}
              </div>
            </div>
            <div style={{
              padding: '0.75rem',
              background: stat.bgColor,
              borderRadius: '0.75rem'
            }}>
              <stat.icon size={24} color={stat.color} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderTableHeader = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      padding: '1rem 1.5rem',
      background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1rem',
      border: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`,
      boxShadow: isDarkMode 
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: isDarkMode ? '#F1F5F9' : '#1F2937',
          margin: 0,
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Lista de Turnos
        </h2>
        <span style={{
          fontSize: '0.875rem',
          color: isDarkMode ? '#94A3B8' : '#6B7280',
          fontFamily: 'Inter, sans-serif'
        }}>
          {filteredAndSortedAppointments.length} resultados
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {selectedAppointments.size > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: isDarkMode ? '#475569' : '#EFF6FF',
              borderRadius: '0.5rem',
              border: `1px solid ${isDarkMode ? '#64748B' : '#DBEAFE'}`
            }}
          >
            <span style={{
              fontSize: '0.875rem',
              color: isDarkMode ? '#F1F5F9' : '#2563EB',
              fontFamily: 'Inter, sans-serif'
            }}>
              {selectedAppointments.size} seleccionadas
            </span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleBulkStatusChange('confirmada')}
              style={{
                padding: '0.25rem 0.5rem',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Confirmar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleBulkStatusChange('cancelada')}
              style={{
                padding: '0.25rem 0.5rem',
                background: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Cancelar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBulkDelete}
              style={{
              padding: '0.25rem 0.5rem',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Eliminar
          </motion.button>
        </motion.div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          style={{
            padding: '0.5rem',
            border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            background: isDarkMode ? '#334155' : 'white',
            color: isDarkMode ? '#F1F5F9' : '#1F2937',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <option value={10}>10 por página</option>
          <option value={25}>25 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setViewMode(prev => ({ 
            ...prev, 
            density: prev.density === 'compact' ? 'comfortable' : 
                     prev.density === 'comfortable' ? 'spacious' : 'compact'
          }))}
          style={{
            padding: '0.5rem',
            background: 'transparent',
            border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Columns size={16} color={isDarkMode ? '#94A3B8' : '#6B7280'} />
        </motion.button>
      </div>
    </div>
  );

  const renderTable = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        border: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`,
        boxShadow: isDarkMode 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}
    >
      {/* Table Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: columns.map(col => col.width || '1fr').join(' '),
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 0.8)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`,
        alignItems: 'center'
      }}>
        {columns.map(column => (
          <div
            key={column.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: column.align === 'center' ? 'center' : 
                             column.align === 'right' ? 'flex-end' : 'flex-start'
            }}
          >
            {column.id === 'select' ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelectAll(selectedAppointments.size !== paginatedAppointments.length)}
                style={{
                  padding: '0.25rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {selectedAppointments.size === paginatedAppointments.length && paginatedAppointments.length > 0 ? (
                  <CheckSquare size={16} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                ) : (
                  <Square size={16} color={isDarkMode ? '#94A3B8' : '#6B7280'} />
                )}
              </motion.button>
            ) : (
              <>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#CBD5E1' : '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {column.label}
                </span>
                {column.sortable && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSort(column.id)}
                    style={{
                      padding: '0.25rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {sortConfig.field === column.id ? (
                      sortConfig.direction === 'asc' ? (
                        <SortAsc size={14} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                      ) : (
                        <SortDesc size={14} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                      )
                    ) : (
                      <SortAsc size={14} color={isDarkMode ? '#64748B' : '#9CA3AF'} />
                    )}
                  </motion.button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div style={{ maxHeight: '600px', overflow: 'auto' }}>
        {paginatedAppointments.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: isDarkMode ? '#94A3B8' : '#6B7280'
          }}>
            <Calendar size={48} color={isDarkMode ? '#64748B' : '#9CA3AF'} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              No hay citas programadas
            </h3>
            <p style={{
              fontSize: '0.875rem',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              {searchTerm || Object.keys(filters).length > 0 
                ? 'No se encontraron citas con los filtros aplicados'
                : 'Comienza creando tu primera cita'
              }
            </p>
            {(!searchTerm && Object.keys(filters).length === 0) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateAppointment}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Crear Primera Cita
              </motion.button>
            )}
          </div>
        ) : (
          paginatedAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.8)' }}
              style={{
                display: 'grid',
                gridTemplateColumns: columns.map(col => col.width || '1fr').join(' '),
                gap: '1rem',
                padding: viewMode.density === 'compact' ? '0.75rem 1.5rem' : 
                         viewMode.density === 'comfortable' ? '1rem 1.5rem' : '1.25rem 1.5rem',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(229, 231, 235, 0.3)'}`,
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleViewAppointment(appointment)}
            >
              {/* Select Checkbox */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAppointment(appointment.id, !selectedAppointments.has(appointment.id));
                  }}
                  style={{
                    padding: '0.25rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {selectedAppointments.has(appointment.id) ? (
                    <CheckSquare size={16} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                  ) : (
                    <Square size={16} color={isDarkMode ? '#94A3B8' : '#6B7280'} />
                  )}
                </motion.button>
              </div>

              {/* Date and Time */}
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#F1F5F9' : '#1F2937',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {formatDateRange(appointment.startDateTime)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: isDarkMode ? '#94A3B8' : '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {formatTimeRange(appointment.startDateTime, appointment.duration)}
                </div>
              </div>

              {/* Patient Name */}
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#F1F5F9' : '#1F2937',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {appointment.patientName}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: isDarkMode ? '#94A3B8' : '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {patients.find(p => p.id === appointment.patientId)?.phone || 'Sin teléfono'}
                </div>
              </div>

              {/* Consultorio */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MapPin size={14} color={isDarkMode ? '#94A3B8' : '#6B7280'} />
                  <span style={{
                    fontSize: '0.875rem',
                    color: isDarkMode ? '#CBD5E1' : '#374151',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {appointment.consultorio || 'Sin asignar'}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  background: getStatusBgColor(appointment.status),
                  color: getStatusColor(appointment.status),
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {getStatusIcon(appointment.status)}
                  {getStatusLabel(appointment.status)}
                </div>
              </div>

              {/* Type */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  background: `${getTypeColor(appointment.type)}20`,
                  color: getTypeColor(appointment.type),
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  width: 'fit-content'
                }}>
                  <Users size={12} />
                  {getTypeLabel(appointment.type)}
                </div>
              </div>

              {/* Motive */}
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: isDarkMode ? '#CBD5E1' : '#374151',
                  fontFamily: 'Inter, sans-serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {appointment.motive}
                </div>
                {appointment.notes && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: isDarkMode ? '#94A3B8' : '#6B7280',
                    fontFamily: 'Inter, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {appointment.notes}
                  </div>
                )}
              </div>

              {/* Duration */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  color: isDarkMode ? '#CBD5E1' : '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Clock size={12} color={isDarkMode ? '#94A3B8' : '#6B7280'} />
                  {appointment.duration}min
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAppointment(appointment);
                    }}
                    style={{
                      padding: '0.375rem',
                      background: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Eye size={14} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAppointment(appointment);
                    }}
                    style={{
                      padding: '0.375rem',
                      background: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Edit size={14} color={isDarkMode ? '#34D399' : '#10B981'} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAppointment(appointment.id);
                    }}
                    style={{
                      padding: '0.375rem',
                      background: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={14} color={isDarkMode ? '#F87171' : '#EF4444'} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredAndSortedAppointments.length > pageSize && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          padding: '1rem 1.5rem',
          borderTop: `1px solid ${isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.6)'}`,
          background: isDarkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.5)'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, filteredAndSortedAppointments.length)} de {filteredAndSortedAppointments.length} resultados
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === 1 
                  ? (isDarkMode ? '#374151' : '#F3F4F6')
                  : (isDarkMode ? '#475569' : 'white'),
                color: currentPage === 1 
                  ? (isDarkMode ? '#6B7280' : '#9CA3AF')
                  : (isDarkMode ? '#F1F5F9' : '#374151'),
                border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Anterior
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {Array.from({ length: Math.ceil(filteredAndSortedAppointments.length / pageSize) }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === Math.ceil(filteredAndSortedAppointments.length / pageSize) ||
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span style={{
                        padding: '0.5rem',
                        color: isDarkMode ? '#6B7280' : '#9CA3AF',
                        fontSize: '0.875rem'
                      }}>
                        ...
                      </span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: currentPage === page 
                          ? (isDarkMode ? '#3B82F6' : '#3B82F6')
                          : (isDarkMode ? '#374151' : 'white'),
                        color: currentPage === page 
                          ? 'white'
                          : (isDarkMode ? '#F1F5F9' : '#374151'),
                        border: `1px solid ${currentPage === page ? '#3B82F6' : (isDarkMode ? '#475569' : '#D1D5DB')}`,
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        minWidth: '2.5rem'
                      }}
                    >
                      {page}
                    </motion.button>
                  </React.Fragment>
                ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAndSortedAppointments.length / pageSize), prev + 1))}
              disabled={currentPage === Math.ceil(filteredAndSortedAppointments.length / pageSize)}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === Math.ceil(filteredAndSortedAppointments.length / pageSize)
                  ? (isDarkMode ? '#374151' : '#F3F4F6')
                  : (isDarkMode ? '#475569' : 'white'),
                color: currentPage === Math.ceil(filteredAndSortedAppointments.length / pageSize)
                  ? (isDarkMode ? '#6B7280' : '#9CA3AF')
                  : (isDarkMode ? '#F1F5F9' : '#374151'),
                border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: currentPage === Math.ceil(filteredAndSortedAppointments.length / pageSize) ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Siguiente
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderExportModal = () => (
    <AnimatePresence>
      {showExportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowExportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDarkMode ? '#1E293B' : 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '500px',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E5E7EB'}`,
              background: isDarkMode 
                ? 'linear-gradient(135deg, #475569 0%, #334155 100%)'
                : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Download size={24} />
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Exportar Citas
                  </h2>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowExportModal(false)}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={20} color="white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Format Selection */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isDarkMode ? '#CBD5E1' : '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Formato de Exportación
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[
                      { value: 'csv', label: 'CSV (Excel)', icon: FileText, desc: 'Para análisis en Excel' },
                      { value: 'pdf', label: 'PDF', icon: FileText, desc: 'Para impresión' },
                      { value: 'ics', label: 'ICS (Calendar)', icon: CalendarIcon, desc: 'Para Google Calendar' }
                    ].map(format => (
                      <motion.div
                        key={format.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Handle format selection
                        }}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          border: `2px solid ${isDarkMode ? '#475569' : '#E5E7EB'}`,
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          background: isDarkMode ? '#334155' : '#F9FAFB'
                        }}
                      >
                        <format.icon size={24} color={isDarkMode ? '#94A3B8' : '#6B7280'} style={{ margin: '0 auto 0.5rem' }} />
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: isDarkMode ? '#F1F5F9' : '#1F2937',
                          marginBottom: '0.25rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {format.label}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: isDarkMode ? '#94A3B8' : '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {format.desc}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Export Options */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isDarkMode ? '#CBD5E1' : '#374151',
                    marginBottom: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Opciones de Exportación
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        defaultChecked={selectedAppointments.size > 0}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          accentColor: '#3B82F6'
                        }}
                      />
                      <span style={{
                        fontSize: '0.875rem',
                        color: isDarkMode ? '#CBD5E1' : '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Solo citas seleccionadas ({selectedAppointments.size})
                      </span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          accentColor: '#3B82F6'
                        }}
                      />
                      <span style={{
                        fontSize: '0.875rem',
                        color: isDarkMode ? '#CBD5E1' : '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Incluir notas adicionales
                      </span>
                    </label>
                  </div>
                </div>

                {/* Summary */}
                <div style={{
                  padding: '1rem',
                  background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '0.75rem',
                  border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: isDarkMode ? '#60A5FA' : '#2563EB',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Se exportarán {selectedAppointments.size > 0 ? selectedAppointments.size : filteredAndSortedAppointments.length} citas
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1.5rem',
              borderTop: `1px solid ${isDarkMode ? '#334155' : '#E5E7EB'}`,
              background: isDarkMode ? '#0F172A' : '#F9FAFB',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExportModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isDarkMode ? '#374151' : 'white',
                  border: `1px solid ${isDarkMode ? '#475569' : '#D1D5DB'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isDarkMode ? '#F1F5F9' : '#374151',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Cancelar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport({
                  format: 'csv',
                  selectedOnly: selectedAppointments.size > 0,
                  includeNotes: true
                })}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Download size={16} />
                Exportar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (loading && appointments.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${isDarkMode ? '#334155' : '#E5E7EB'}`,
            borderTop: `4px solid ${isDarkMode ? '#60A5FA' : '#3B82F6'}`,
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
        : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: isDarkMode
          ? `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)
          `
          : `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
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
        {renderFiltersBar()}
        {renderStatsCards()}
        {renderTableHeader()}
        {renderTable()}
        {renderExportModal()}

        {/* Modals */}
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          onSave={async (data: CreateAppointmentData) => {
            await createAppointment(data);
            setShowAppointmentModal(false);
          }}
          onUpdate={async (id: string, data: UpdateAppointmentData) => {
            await updateAppointment(id, data);
            setShowAppointmentModal(false);
          }}
          appointment={selectedAppointment}
          patients={patients}
          consultorios={consultorios}
          isCreating={isCreating}
        />

        <AppointmentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          appointment={selectedAppointment}
          onEdit={() => {
            setShowDetailsModal(false);
            setIsCreating(false);
            setShowAppointmentModal(true);
          }}
          onDelete={async (id: string) => {
            await handleDeleteAppointment(id);
            setShowDetailsModal(false);
          }}
          onStatusChange={handleStatusChange}
          patient={selectedAppointment ? patients.find(p => p.id === selectedAppointment.patientId) : undefined}
        />

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: isDarkMode ? '#7F1D1D' : '#FEF2F2',
                border: `1px solid ${isDarkMode ? '#991B1B' : '#FECACA'}`,
                borderRadius: '0.75rem',
                padding: '1rem 1.5rem',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
                zIndex: 1000,
                maxWidth: '400px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={20} color="#EF4444" />
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isDarkMode ? '#FCA5A5' : '#DC2626',
                    marginBottom: '0.25rem'
                  }}>
                    Error
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: isDarkMode ? '#FEE2E2' : '#7F1D1D'
                  }}>
                    {error}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearError}
                  style={{
                    padding: '0.25rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#DC2626" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
