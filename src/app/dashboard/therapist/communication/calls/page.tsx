'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  FileText,
  Download,
  Edit3,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  PhoneMissed,
  PhoneOff,
  Settings,
  Mic,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useCalls } from '@/hooks/useCalls';
import { 
  Call, 
  CreateCallData, 
  UpdateCallData, 
  CallFilters,
  CallType,
  CallStatus,
} from '@/types/calls';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TherapistCallsPage() {
  const {
    calls,
    stats,
    loading,
    error,
    clearError,
    fetchCalls,
    createCall,
    updateCall,
    deleteCall,
    exportCalls,
    searchCalls,
    filterCalls,
  } = useCalls();

  // State
  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CallFilters>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);

  // Form state
  const [callForm, setCallForm] = useState<CreateCallData>({
    date: new Date(),
    startTime: '',
    duration: 0,
    type: 'saliente',
    status: 'realizada',
    motive: '',
    notes: '',
    hasRecording: false,
    consentGiven: false
  });

  // Refs
  const tableRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchCalls(filters);
  }, [fetchCalls, filters]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreateCall = async () => {
    const success = await createCall(callForm);
    if (success) {
      setShowNewCallModal(false);
      resetForm();
    }
  };

  const handleUpdateCall = async () => {
    if (!selectedCall) return;

    const success = await updateCall(selectedCall.id, callForm as UpdateCallData);
    if (success) {
      setShowEditModal(false);
      setSelectedCall(null);
      resetForm();
    }
  };

  const handleDeleteCall = async (callId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta llamada?')) {
      const success = await deleteCall(callId);
      if (success && selectedCall?.id === callId) {
        setSelectedCall(null);
        setShowDetailsModal(false);
      }
    }
  };

  const handleEditCall = (call: Call) => {
    setSelectedCall(call);
    setCallForm({
      patientId: call.patientId,
      contactId: call.contactId,
      contactName: call.contactName,
      date: call.date,
      startTime: call.startTime,
      duration: call.duration,
      type: call.type,
      status: call.status,
      motive: call.motive,
      notes: call.notes,
      hasRecording: call.hasRecording,
      consentGiven: call.consentGiven
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (call: Call) => {
    setSelectedCall(call);
    setShowDetailsModal(true);
  };

  const handleExport = async (exportFormat: 'csv' | 'pdf') => {
    const exportData = await exportCalls({
      format: exportFormat,
      filters,
      includeNotes: true,
      includeRecordings: false
    });

    if (exportData) {
      const blob = new Blob([exportData], { 
        type: exportFormat === 'csv' ? 'text/csv' : 'application/pdf' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `llamadas-${exportFormat}-${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowExportModal(false);
  };

  const resetForm = () => {
    setCallForm({
      date: new Date(),
      startTime: '',
      duration: 0,
      type: 'saliente',
      status: 'realizada',
      motive: '',
      notes: '',
      hasRecording: false,
      consentGiven: false
    });
  };

  const handleSelectCall = (callId: string) => {
    setSelectedCalls(prev => 
      prev.includes(callId) 
        ? prev.filter(id => id !== callId)
        : [...prev, callId]
    );
  };

  const handleSelectAllCalls = () => {
    if (selectedCalls.length === filteredCalls.length) {
      setSelectedCalls([]);
    } else {
      setSelectedCalls(filteredCalls.map(call => call.id));
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const formatCallTime = (date: Date, startTime: string) => {
    if (isToday(date)) {
      return `Hoy ${startTime}`;
    } else if (isYesterday(date)) {
      return `Ayer ${startTime}`;
    } else {
      return `${format(date, 'dd/MM/yyyy')} ${startTime}`;
    }
  };

  const getStatusIcon = (status: CallStatus) => {
    switch (status) {
      case 'realizada':
        return <CheckCircle size={16} color="#10B981" />;
      case 'no_contestada':
        return <PhoneMissed size={16} color="#F59E0B" />;
      case 'cancelada':
        return <XCircle size={16} color="#EF4444" />;
      case 'perdida':
        return <PhoneOff size={16} color="#6B7280" />;
      default:
        return <Phone size={16} color="#6B7280" />;
    }
  };

  const getStatusLabel = (status: CallStatus) => {
    switch (status) {
      case 'realizada':
        return 'Realizada';
      case 'no_contestada':
        return 'No contestada';
      case 'cancelada':
        return 'Cancelada';
      case 'perdida':
        return 'Perdida';
      default:
        return status;
    }
  };

  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case 'realizada':
        return '#10B981';
      case 'no_contestada':
        return '#F59E0B';
      case 'cancelada':
        return '#EF4444';
      case 'perdida':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getTypeIcon = (type: CallType) => {
    return type === 'entrante' 
      ? <PhoneIncoming size={16} color="#3B82F6" />
      : <PhoneOutgoing size={16} color="#10B981" />;
  };

  const getTypeLabel = (type: CallType) => {
    return type === 'entrante' ? 'Entrante' : 'Saliente';
  };

  const filteredCalls = searchTerm 
    ? searchCalls(searchTerm)
    : filterCalls(filters);

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
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
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
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
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '1.25rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Phone size={28} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: '#1E40AF',
              textShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
            }}>
              Llamadas
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#2563EB',
              fontWeight: 600,
              margin: '0.5rem 0 0 0'
            }}>
              Registrá y gestioná tus llamadas clínicas
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              {stats && (
                <>
                  <span style={{ fontSize: '0.875rem', color: '#2563EB' }}>
                    {stats.total} llamadas totales
                  </span>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1E40AF'
                  }}>
                    {stats.thisWeek} esta semana
                  </div>
                </>
              )}
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
            onClick={() => setShowNewCallModal(true)}
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
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus size={16} />
            Nueva Llamada
          </motion.button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0.875rem',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '0.5rem',
                background: showFilters ? '#3B82F6' : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Filter size={16} color={showFilters ? 'white' : '#3B82F6'} />
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
              <Download size={16} color="#3B82F6" />
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
              <Settings size={16} color="#3B82F6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStats = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}
    >
      {stats && [
        {
          label: 'Total Llamadas',
          value: stats.total,
          icon: Phone,
          color: '#3B82F6',
          bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: 'Realizadas',
          value: stats.realizadas,
          icon: CheckCircle,
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
          label: 'No Contestadas',
          value: stats.noContestadas,
          icon: PhoneMissed,
          color: '#F59E0B',
          bgColor: 'rgba(245, 158, 11, 0.1)'
        },
        {
          label: 'Duración Promedio',
          value: `${stats.averageDuration} min`,
          icon: Clock,
          color: '#8B5CF6',
          bgColor: 'rgba(139, 92, 246, 0.1)'
        }
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.75rem',
              background: stat.bgColor
            }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: stat.color
              }}
            />
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#1F2937',
            marginBottom: '0.25rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderSearchAndFilters = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.5rem'
      }}
    >
      {/* Search bar */}
      <div style={{ marginBottom: showFilters ? '1.5rem' : '0' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#9CA3AF" style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            type="text"
            placeholder="Buscar por paciente, contacto, motivo o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'all 0.2s ease',
              background: 'rgba(249, 250, 251, 0.8)'
            }}
          />
        </div>
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(229, 231, 235, 0.3)'
            }}>
              {/* Tipo de llamada */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Tipo de llamada
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as CallType || undefined }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                >
                  <option value="">Todos los tipos</option>
                  <option value="entrante">Entrante</option>
                  <option value="saliente">Saliente</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Estado
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as CallStatus || undefined }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                >
                  <option value="">Todos los estados</option>
                  <option value="realizada">Realizada</option>
                  <option value="no_contestada">No contestada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="perdida">Perdida</option>
                </select>
              </div>

              {/* Fecha desde */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={filters.dateFrom ? format(filters.dateFrom, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateFrom: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                />
              </div>

              {/* Fecha hasta */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={filters.dateTo ? format(filters.dateTo, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateTo: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(229, 231, 235, 0.3)'
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFilters({});
                  setSearchTerm('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  cursor: 'pointer'
                }}
              >
                Limpiar filtros
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderCallsTable = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}
    >
      {/* Table header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
        background: 'rgba(249, 250, 251, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1F2937',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Historial de Llamadas
          </h3>
          <span style={{
            padding: '0.25rem 0.75rem',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#2563EB',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            {filteredCalls.length} llamadas
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedCalls.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: '#DC2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Trash2 size={12} />
              Eliminar ({selectedCalls.length})
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchCalls(filters)}
            style={{
              padding: '0.5rem',
              background: 'rgba(107, 114, 128, 0.1)',
              border: '1px solid rgba(107, 114, 128, 0.2)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={14} color="#6B7280" />
          </motion.button>
        </div>
      </div>

      {/* Table content */}
      <div ref={tableRef} style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
        {loading && filteredCalls.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#9CA3AF'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid #E5E7EB',
                borderTop: '2px solid #3B82F6',
                borderRadius: '50%'
              }}
            />
          </div>
        ) : filteredCalls.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            <Phone size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              No hay llamadas registradas
            </p>
            <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
              Registra tu primera llamada para comenzar
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(249, 250, 251, 0.5)' }}>
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedCalls.length === filteredCalls.length && filteredCalls.length > 0}
                    onChange={handleSelectAllCalls}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Fecha y Hora
                </th>
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                }}>
                  Contacto
                </th>
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                }}>
                  Tipo
                </th>
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                }}>
                  Estado
                </th>
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                }}>
                  Duración
                </th>
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                }}>
                  Motivo
                </th>
                <th style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((call, index) => (
                <motion.tr
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                  style={{
                    borderBottom: '1px solid rgba(229, 231, 235, 0.2)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewDetails(call)}
                >
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="checkbox"
                        checked={selectedCalls.includes(call.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectCall(call.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div style={{
                          fontWeight: 600,
                          color: '#1F2937',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {formatCallTime(call.date, call.startTime)}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '0.125rem'
                        }}>
                          {formatDistanceToNow(call.date, { addSuffix: true, locale: es })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: call.patientId 
                          ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                          : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {call.patientName 
                          ? call.patientName.split(' ').map(n => n[0]).join('').toUpperCase()
                          : call.contactName 
                            ? call.contactName.split(' ').map(n => n[0]).join('').toUpperCase()
                            : 'N/A'
                        }
                      </div>
                      <div>
                        <div style={{
                          fontWeight: 600,
                          color: '#1F2937',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {call.patientName || call.contactName || 'Sin nombre'}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280'
                        }}>
                          {call.patientId ? 'Paciente' : 'Contacto externo'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getTypeIcon(call.type)}
                      <span style={{
                        fontWeight: 500,
                        color: '#374151'
                      }}>
                        {getTypeLabel(call.type)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.5rem',
                      background: `${getStatusColor(call.status)}15`,
                      border: `1px solid ${getStatusColor(call.status)}30`
                    }}>
                      {getStatusIcon(call.status)}
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: getStatusColor(call.status)
                      }}>
                        {getStatusLabel(call.status)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="#6B7280" />
                      <span style={{
                        fontWeight: 500,
                        color: '#374151'
                      }}>
                        {call.duration} min
                      </span>
                      {call.hasRecording && (
                        <div style={{
                          padding: '0.125rem 0.375rem',
                          background: 'rgba(139, 92, 246, 0.1)',
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Mic size={10} color="#8B5CF6" />
                          <span style={{
                            fontSize: '0.6875rem',
                            color: '#8B5CF6',
                            fontWeight: 600
                          }}>
                            REC
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#374151'
                    }}>
                      {call.motive}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(call);
                        }}
                        style={{
                          padding: '0.375rem',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Eye size={14} color="#3B82F6" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCall(call);
                        }}
                        style={{
                          padding: '0.375rem',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Edit3 size={14} color="#10B981" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCall(call.id);
                        }}
                        style={{
                          padding: '0.375rem',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} color="#EF4444" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );

  const renderNewCallModal = () => (
    <AnimatePresence>
      {showNewCallModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowNewCallModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Nueva Llamada
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNewCallModal(false)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#6B7280" />
              </motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Fecha */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Fecha
                </label>
                <input
                  type="date"
                  value={format(callForm.date, 'yyyy-MM-dd')}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    date: new Date(e.target.value) 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Hora */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Hora de inicio
                </label>
                <input
                  type="time"
                  value={callForm.startTime}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    startTime: e.target.value 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Tipo */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Tipo de llamada
                </label>
                <select
                  value={callForm.type}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    type: e.target.value as CallType 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="saliente">Saliente</option>
                  <option value="entrante">Entrante</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Estado
                </label>
                <select
                  value={callForm.status}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    status: e.target.value as CallStatus 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="realizada">Realizada</option>
                  <option value="no_contestada">No contestada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="perdida">Perdida</option>
                </select>
              </div>
            </div>

            {/* Contacto */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Paciente o contacto
              </label>
              <input
                type="text"
                placeholder="Nombre del paciente o contacto"
                value={callForm.contactName || ''}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  contactName: e.target.value 
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Duración */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Duración (minutos)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={callForm.duration || ''}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) || 0 
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Motivo */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Motivo de la llamada
              </label>
              <input
                type="text"
                placeholder="Describe el motivo de la llamada"
                value={callForm.motive}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  motive: e.target.value 
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Notas */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Notas adicionales
              </label>
              <textarea
                placeholder="Notas sobre la llamada (opcional)"
                value={callForm.notes || ''}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  notes: e.target.value 
                }))}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Opciones adicionales */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={callForm.hasRecording || false}
                    onChange={(e) => setCallForm(prev => ({ 
                      ...prev, 
                      hasRecording: e.target.checked 
                    }))}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    La llamada fue grabada
                  </span>
                </label>

                {callForm.hasRecording && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: '1.5rem' }}>
                    <input
                      type="checkbox"
                      checked={callForm.consentGiven || false}
                      onChange={(e) => setCallForm(prev => ({ 
                        ...prev, 
                        consentGiven: e.target.checked 
                      }))}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Se obtuvo consentimiento para la grabación
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewCallModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancelar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateCall}
                disabled={!callForm.motive || !callForm.startTime}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: callForm.motive && callForm.startTime 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'rgba(107, 114, 128, 0.3)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: 'white',
                  cursor: callForm.motive && callForm.startTime ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                  boxShadow: callForm.motive && callForm.startTime 
                    ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                    : 'none'
                }}
              >
                Guardar Llamada
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderEditModal = () => (
    <AnimatePresence>
      {showEditModal && selectedCall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Editar Llamada
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#6B7280" />
              </motion.button>
            </div>

            {/* Formulario similar al de crear, pero con datos pre-llenados */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Fecha
                </label>
                <input
                  type="date"
                  value={format(callForm.date, 'yyyy-MM-dd')}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    date: new Date(e.target.value) 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Hora de inicio
                </label>
                <input
                  type="time"
                  value={callForm.startTime}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    startTime: e.target.value 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Tipo de llamada
                </label>
                <select
                  value={callForm.type}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    type: e.target.value as CallType 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="saliente">Saliente</option>
                  <option value="entrante">Entrante</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Estado
                </label>
                <select
                  value={callForm.status}
                  onChange={(e) => setCallForm(prev => ({ 
                    ...prev, 
                    status: e.target.value as CallStatus 
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="realizada">Realizada</option>
                  <option value="no_contestada">No contestada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="perdida">Perdida</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Paciente o contacto
              </label>
              <input
                type="text"
                placeholder="Nombre del paciente o contacto"
                value={callForm.contactName || ''}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  contactName: e.target.value 
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Duración (minutos)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={callForm.duration || ''}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) || 0 
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Motivo de la llamada
              </label>
              <input
                type="text"
                placeholder="Describe el motivo de la llamada"
                value={callForm.motive}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  motive: e.target.value 
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Notas adicionales
              </label>
              <textarea
                placeholder="Notas sobre la llamada (opcional)"
                value={callForm.notes || ''}
                onChange={(e) => setCallForm(prev => ({ 
                  ...prev, 
                  notes: e.target.value 
                }))}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={callForm.hasRecording || false}
                    onChange={(e) => setCallForm(prev => ({ 
                      ...prev, 
                      hasRecording: e.target.checked 
                    }))}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    La llamada fue grabada
                  </span>
                </label>

                {callForm.hasRecording && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: '1.5rem' }}>
                    <input
                      type="checkbox"
                      checked={callForm.consentGiven || false}
                      onChange={(e) => setCallForm(prev => ({ 
                        ...prev, 
                        consentGiven: e.target.checked 
                      }))}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Se obtuvo consentimiento para la grabación
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDeleteCall(selectedCall.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#DC2626',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </motion.button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(107, 114, 128, 0.1)',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Cancelar
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateCall}
                  disabled={!callForm.motive || !callForm.startTime}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: callForm.motive && callForm.startTime 
                      ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                      : 'rgba(107, 114, 128, 0.3)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    color: 'white',
                    cursor: callForm.motive && callForm.startTime ? 'pointer' : 'not-allowed',
                    fontWeight: 600,
                    boxShadow: callForm.motive && callForm.startTime 
                      ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                      : 'none'
                  }}
                >
                  Actualizar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderDetailsModal = () => (
    <AnimatePresence>
      {showDetailsModal && selectedCall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowDetailsModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Detalles de la Llamada
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#6B7280" />
              </motion.button>
            </div>

            {/* Información principal */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: selectedCall.patientId 
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600
                }}>
                  {selectedCall.patientName 
                    ? selectedCall.patientName.split(' ').map(n => n[0]).join('').toUpperCase()
                    : selectedCall.contactName 
                      ? selectedCall.contactName.split(' ').map(n => n[0]).join('').toUpperCase()
                      : 'N/A'
                  }
                </div>
                <div>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: '0 0 0.25rem 0',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {selectedCall.patientName || selectedCall.contactName || 'Sin nombre'}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getTypeIcon(selectedCall.type)}
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      fontWeight: 500
                    }}>
                      Llamada {getTypeLabel(selectedCall.type).toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Estado
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: `${getStatusColor(selectedCall.status)}15`,
                    border: `1px solid ${getStatusColor(selectedCall.status)}30`
                  }}>
                    {getStatusIcon(selectedCall.status)}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: getStatusColor(selectedCall.status)
                    }}>
                      {getStatusLabel(selectedCall.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Duración
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} color="#6B7280" />
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1F2937'
                    }}>
                      {selectedCall.duration} minutos
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginBottom: '0.25rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Fecha y hora
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937'
                  }}>
                    {formatCallTime(selectedCall.date, selectedCall.startTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Motivo */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 0.75rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Motivo de la llamada
              </h4>
              <div style={{
                padding: '1rem',
                background: 'rgba(249, 250, 251, 0.8)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(229, 231, 235, 0.3)',
                fontSize: '0.875rem',
                color: '#374151',
                lineHeight: 1.5
              }}>
                {selectedCall.motive}
              </div>
            </div>

            {/* Notas */}
            {selectedCall.notes && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: '0 0 0.75rem 0',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Notas adicionales
                </h4>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(249, 250, 251, 0.8)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(229, 231, 235, 0.3)',
                  fontSize: '0.875rem',
                  color: '#374151',
                  lineHeight: 1.5
                }}>
                  {selectedCall.notes}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div style={{
              background: 'rgba(249, 250, 251, 0.5)',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 0.75rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Información adicional
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={14} color="#6B7280" />
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Profesional: {selectedCall.professionalName}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} color="#6B7280" />
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Registrada: {format(selectedCall.createdAt, 'dd/MM/yyyy HH:mm', { locale: es })}
                  </span>
                </div>

                {selectedCall.hasRecording && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mic size={14} color="#8B5CF6" />
                    <span style={{ fontSize: '0.875rem', color: '#8B5CF6' }}>
                      Llamada grabada
                      {selectedCall.consentGiven && ' (con consentimiento)'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditCall(selectedCall);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#2563EB',
                  cursor: 'pointer',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Edit3 size={16} />
                Editar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowExportModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Exportar Llamadas
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowExportModal(false)}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#6B7280" />
              </motion.button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: '0 0 1rem 0',
                lineHeight: 1.5
              }}>
                Selecciona el formato para exportar las llamadas filtradas.
              </p>

              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#2563EB',
                  fontWeight: 600,
                  marginBottom: '0.25rem'
                }}>
                  Llamadas a exportar
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937'
                }}>
                  {filteredCalls.length} llamadas
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('csv')}
                style={{
                  padding: '1rem',
                  background: 'rgba(16, 185, 129, 0.02)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '0.5rem'
                }}>
                  <FileText size={20} color="#10B981" />
                </div>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    marginBottom: '0.125rem'
                  }}>
                    Exportar como CSV
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280'
                  }}>
                    Compatible con Excel y Google Sheets
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('pdf')}
                style={{
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.02)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  padding: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '0.5rem'
                }}>
                  <Download size={20} color="#EF4444" />
                </div>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    marginBottom: '0.125rem'
                  }}>
                    Exportar como PDF
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280'
                  }}>
                    Formato profesional para reportes
                  </div>
                </div>
              </motion.button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExportModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancelar
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

  if (loading && calls.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
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
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #3B82F6',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
        `
      }} />

      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {renderHeader()}
        {renderStats()}
        {renderSearchAndFilters()}
        {renderCallsTable()}

        {/* Modals */}
        {renderNewCallModal()}
        {renderEditModal()}
        {renderDetailsModal()}
        {renderExportModal()}

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
                background: '#FEF2F2',
                border: '1px solid #FECACA',
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
                    color: '#DC2626',
                    marginBottom: '0.25rem'
                  }}>
                    Error
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#7F1D1D'
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

      <style jsx>{`
        /* Scrollbar styling */
        div::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }

        /* Table hover effects */
        table tbody tr:hover {
          background-color: rgba(249, 250, 251, 0.5) !important;
        }

        /* Input focus styles */
        input:focus,
        select:focus,
        textarea:focus {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        /* Button focus styles */
        button:focus-visible {
          outline: 2px solid rgba(59, 130, 246, 0.5);
          outline-offset: 2px;
        }

        /* Responsive table */
        @media (max-width: 768px) {
          table {
            font-size: 0.75rem;
          }
          
          th, td {
            padding: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

