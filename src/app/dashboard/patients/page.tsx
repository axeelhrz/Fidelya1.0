'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  User,
  Shield,
  ChevronDown,
  FileText,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  X,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Settings,
  Eye,
  Calendar,
  Heart,
  Brain,
  Stethoscope
} from 'lucide-react';
import { ExtendedPatient } from '@/types/clinical';
import { PatientCard } from '@/components/clinical/PatientCard';
import { PatientForm } from '@/components/clinical/patients/PatientForm';
import { PatientTimeline } from '@/components/clinical/patients/PatientTimeline';
import { PatientDocuments } from '@/components/clinical/patients/PatientDocuments';
import { ClinicalCard } from '@/components/clinical/ClinicalCard';
import { usePatientData } from '@/hooks/usePatientData';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DataSeeder from '@/components/admin/DataSeeder';

export default function PatientsPage() {
  const { user } = useAuth();
  const { 
    patients, 
    loading, 
    error, 
    refresh, 
    createPatient, 
    updatePatient, 
    deletePatient,
    searchPatients,
    filterPatients,
    lastUpdated,
    isConnected,
    retryCount
  } = usePatientData();

  const [filteredPatients, setFilteredPatients] = useState<ExtendedPatient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    riskLevel: 'all',
    therapist: 'all',
    ageGroup: 'all',
    tags: 'all',
    emotionalState: 'all'
  });
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'lastSession' | 'riskLevel' | 'totalSessions' | 'createdAt'>('name');
  const [showSeeder, setShowSeeder] = useState(false);
  
  // Modal states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ExtendedPatient | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [detailsTab, setDetailsTab] = useState<'overview' | 'timeline' | 'documents'>('overview');

  // Filter and search patients
  useEffect(() => {
    const filtered = patients.filter(patient => {
      const matchesSearch = 
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        patient.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedFilters.status === 'all' || patient.status === selectedFilters.status;
      const matchesRisk = selectedFilters.riskLevel === 'all' || patient.riskLevel === selectedFilters.riskLevel;
      const matchesTherapist = selectedFilters.therapist === 'all' || patient.assignedTherapist === selectedFilters.therapist;
      
      const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
      const matchesAge = selectedFilters.ageGroup === 'all' || 
        (selectedFilters.ageGroup === 'child' && age < 12) ||
        (selectedFilters.ageGroup === 'adolescent' && age >= 12 && age < 18) ||
        (selectedFilters.ageGroup === 'adult' && age >= 18);

      const matchesTags = selectedFilters.tags === 'all' || 
        patient.tags.some(tag => tag.includes(selectedFilters.tags));

      const matchesEmotionalState = selectedFilters.emotionalState === 'all' || 
        patient.emotionalState === selectedFilters.emotionalState;

      return matchesSearch && matchesStatus && matchesRisk && matchesTherapist && matchesAge && matchesTags && matchesEmotionalState;
    });

    // Sort patients
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'lastSession':
          aValue = a.lastSession?.getTime() || 0;
          bValue = b.lastSession?.getTime() || 0;
          break;
        case 'riskLevel':
          const riskOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = riskOrder[a.riskLevel];
          bValue = riskOrder[b.riskLevel];
          break;
        case 'totalSessions':
          aValue = a.totalSessions;
          bValue = b.totalSessions;
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        default:
          aValue = a.firstName;
          bValue = a.firstName;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPatients(filtered);
  }, [patients, searchQuery, selectedFilters, sortBy, sortOrder]);

  // Handlers
  const handleCreatePatient = () => {
    setSelectedPatient(null);
    setFormMode('create');
    setShowPatientForm(true);
  };

  const handleEditPatient = (patient: ExtendedPatient) => {
    setSelectedPatient(patient);
    setFormMode('edit');
    setShowPatientForm(true);
  };

  const handleViewPatient = (patient: ExtendedPatient) => {
    setSelectedPatient(patient);
    setDetailsTab('overview');
    setShowPatientDetails(true);
  };

  const handleSavePatient = async (patientData: Partial<ExtendedPatient>) => {
    try {
      if (formMode === 'create') {
        await createPatient(patientData as Omit<ExtendedPatient, 'id' | 'createdAt' | 'updatedAt'>);
      } else if (selectedPatient) {
        await updatePatient(selectedPatient.id, patientData);
      }
      setShowPatientForm(false);
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === filteredPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map(p => p.id));
    }
  };

  const handleExport = async () => {
    try {
      const selectedPatientsData = filteredPatients.filter(p => selectedPatients.includes(p.id));
      const exportData = {
        patients: selectedPatientsData,
        exportDate: new Date().toISOString(),
        centerId: user?.centerId,
        exportedBy: user?.email
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pacientes-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting patients:', error);
    }
  };

  const handleAnonymize = async () => {
    if (confirm('¿Estás seguro de que quieres anonimizar los pacientes seleccionados? Esta acción no se puede deshacer.')) {
      try {
        // Implement anonymization logic here
        console.log('Anonimizando pacientes seleccionados:', selectedPatients);
      } catch (error) {
        console.error('Error anonymizing patients:', error);
      }
    }
  };

  // Calculate metrics from real Firebase data
  const metrics = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    highRisk: patients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
    averageAdherence: patients.length > 0 ? patients.reduce((sum, p) => sum + p.adherenceRate, 0) / patients.length : 0,
    newThisMonth: patients.filter(p => {
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      return p.createdAt >= monthAgo;
    }).length,
    averageAge: patients.length > 0 ? patients.reduce((sum, p) => {
      const age = new Date().getFullYear() - p.dateOfBirth.getFullYear();
      return sum + age;
    }, 0) / patients.length : 0,
    genderDistribution: {
      male: patients.filter(p => p.gender === 'male').length,
      female: patients.filter(p => p.gender === 'female').length,
      other: patients.filter(p => p.gender === 'other' || p.gender === 'prefer-not-to-say').length
    },
    emotionalStates: {
      improving: patients.filter(p => p.emotionalState === 'improving').length,
      stable: patients.filter(p => p.emotionalState === 'stable').length,
      struggling: patients.filter(p => p.emotionalState === 'struggling').length,
      crisis: patients.filter(p => p.emotionalState === 'crisis').length
    }
  };

  if (showSeeder) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '2rem' }}
          >
            <button
              onClick={() => setShowSeeder(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6B7280',
                transition: 'all 0.2s ease',
                marginBottom: '2rem',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <X size={16} />
              Volver a Gestión de Pacientes
            </button>
          </motion.div>
          <DataSeeder />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Gestión de Pacientes
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                {filteredPatients.length} pacientes encontrados
              </p>
              
              {/* Connection Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: error ? '#FEF2F2' : '#ECFDF5',
                borderRadius: '1rem',
                border: `1px solid ${error ? '#FECACA' : '#D1FAE5'}`
              }}>
                {error ? <WifiOff size={14} color="#EF4444" /> : <Wifi size={14} color="#10B981" />}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: error ? '#EF4444' : '#10B981',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {error ? 'Sin conexión Firebase' : 'Conectado a Firebase'}
                </span>
              </div>

              {lastUpdated && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '1rem'
                }}>
                  <Clock size={14} color="#6B7280" />
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Actualizado: {lastUpdated.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}

              {retryCount > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#FFFBEB',
                  borderRadius: '1rem'
                }}>
                  <RefreshCw size={14} color="#F59E0B" />
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#F59E0B',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Reintento {retryCount}/3
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={refresh}
              loading={loading}
            >
              Actualizar
            </Button>

            {user?.role?.toString() === 'admin' && (
              <Button
                variant="outline"
                icon={Settings}
                onClick={() => setShowSeeder(true)}
              >
                Gestionar Datos
              </Button>
            )}

            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreatePatient}
            >
              Nuevo Paciente
            </Button>
          </div>
        </div>

        {/* Enhanced Metrics with real Firebase data */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <ClinicalCard
            title="Total Pacientes"
            value={metrics.total}
            icon={Users}
            iconColor="#2563EB"
            trend={{ value: metrics.newThisMonth, isPositive: true }}
            size="small"
          />
          
          <ClinicalCard
            title="Pacientes Activos"
            value={metrics.active}
            icon={Activity}
            iconColor="#10B981"
            size="small"
          />
          
          <ClinicalCard
            title="Alto Riesgo"
            value={metrics.highRisk}
            icon={AlertTriangle}
            iconColor="#EF4444"
            size="small"
          />
          
          <ClinicalCard
            title="Adherencia Promedio"
            value={`${Math.round(metrics.averageAdherence)}%`}
            icon={TrendingUp}
            iconColor="#7C3AED"
            trend={{ value: 5, isPositive: true }}
            size="small"
          />
          
          <ClinicalCard
            title="Nuevos Este Mes"
            value={metrics.newThisMonth}
            icon={Star}
            iconColor="#F59E0B"
            size="small"
          />

          <ClinicalCard
            title="Edad Promedio"
            value={`${Math.round(metrics.averageAge)} años`}
            icon={Calendar}
            iconColor="#6366F1"
            size="small"
          />
        </div>

        {/* Additional metrics row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Gender Distribution */}
          <Card variant="default">
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <User size={20} color="#6366F1" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: 0 }}>
                  Distribución por Género
                </h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Masculino: {metrics.genderDistribution.male}</span>
                <span>Femenino: {metrics.genderDistribution.female}</span>
                <span>Otro: {metrics.genderDistribution.other}</span>
              </div>
            </div>
          </Card>

          {/* Emotional States */}
          <Card variant="default">
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Heart size={20} color="#EF4444" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', margin: 0 }}>
                  Estados Emocionales
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span>Mejorando: {metrics.emotionalStates.improving}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1' }} />
                  <span>Estable: {metrics.emotionalStates.stable}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <span>Dificultades: {metrics.emotionalStates.struggling}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <span>Crisis: {metrics.emotionalStates.crisis}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF'
            }} />
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>

          {/* Sort Controls */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <option value="name">Nombre</option>
              <option value="lastSession">Última sesión</option>
              <option value="riskLevel">Nivel de riesgo</option>
              <option value="totalSessions">Total sesiones</option>
              <option value="createdAt">Fecha creación</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: '0.5rem',
            padding: '0.25rem'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                color: viewMode === 'grid' ? '#1F2937' : '#6B7280',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                color: viewMode === 'list' ? '#1F2937' : '#6B7280',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Lista
            </button>
          </div>

          {/* Filters */}
          <Button
            variant={showFilters ? "primary" : "outline"}
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
            <ChevronDown size={16} style={{
              transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} />
          </Button>

          {/* Bulk Actions */}
          {selectedPatients.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                icon={Download}
                onClick={handleExport}
              >
                Exportar ({selectedPatients.length})
              </Button>
              
              <Button
                variant="outline"
                icon={Shield}
                onClick={handleAnonymize}
              >
                Anonimizar
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                overflow: 'hidden',
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
                marginTop: '1rem'
              }}
            >
              <div style={{
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Estado
                  </label>
                  <select
                    value={selectedFilters.status}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="pending">Pendiente</option>
                    <option value="discharged">Alta</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Nivel de Riesgo
                  </label>
                  <select
                    value={selectedFilters.riskLevel}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="all">Todos</option>
                    <option value="low">Bajo</option>
                    <option value="medium">Medio</option>
                    <option value="high">Alto</option>
                    <option value="critical">Crítico</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Estado Emocional
                  </label>
                  <select
                    value={selectedFilters.emotionalState}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, emotionalState: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="all">Todos</option>
                    <option value="improving">Mejorando</option>
                    <option value="stable">Estable</option>
                    <option value="struggling">Dificultades</option>
                    <option value="crisis">Crisis</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Grupo de Edad
                  </label>
                  <select
                    value={selectedFilters.ageGroup}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, ageGroup: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="all">Todas las edades</option>
                    <option value="child">Niños (&lt;12)</option>
                    <option value="adolescent">Adolescentes (12-17)</option>
                    <option value="adult">Adultos (18+)</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Terapeuta
                  </label>
                  <select
                    value={selectedFilters.therapist}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, therapist: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="all">Todos</option>
                    {Array.from(new Set(patients.map(p => p.assignedTherapist))).map(therapist => (
                      <option key={therapist} value={therapist}>{therapist}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Patients Grid/List with error handling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {error ? (
          <Card variant="default">
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem'
            }}>
              <WifiOff size={48} color="#EF4444" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Sin conexión a Firebase
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                marginBottom: '2rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                No se pueden cargar los datos de pacientes. Verifica la conexión a Firebase.
              </p>
              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={refresh}
                loading={loading}
              >
                Reintentar conexión
              </Button>
            </div>
          </Card>
        ) : filteredPatients.length === 0 ? (
          <Card variant="default">
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem'
            }}>
              <Users size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {loading ? 'Cargando pacientes...' : 'No se encontraron pacientes'}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                marginBottom: '2rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                {loading ? 'Conectando con Firebase...' :
                 searchQuery || Object.values(selectedFilters).some(f => f !== 'all') 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando tu primer paciente'
                }
              </p>
              {!loading && !searchQuery && Object.values(selectedFilters).every(f => f === 'all') && (
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={handleCreatePatient}
                >
                  Crear Primer Paciente
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div style={{
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(400px, 1fr))' : undefined,
            flexDirection: viewMode === 'list' ? 'column' : undefined,
            gap: '1.5rem'
          }}>
            {/* Select All Checkbox for List View */}
            {viewMode === 'list' && (
              <Card variant="default">
                <div style={{
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Seleccionar todos los pacientes ({filteredPatients.length})
                  </span>
                </div>
              </Card>
            )}

            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => handleViewPatient(patient)}
                showDetails={viewMode === 'list'}
                isSelected={selectedPatients.includes(patient.id)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedPatients(prev => [...prev, patient.id]);
                  } else {
                    setSelectedPatients(prev => prev.filter(id => id !== patient.id));
                  }
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Patient Form Modal */}
      <AnimatePresence>
        {showPatientForm && (
          <PatientForm
            patient={selectedPatient ?? undefined}
            onSave={handleSavePatient}
            onCancel={() => setShowPatientForm(false)}
            mode={formMode}
          />
        )}
      </AnimatePresence>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {showPatientDetails && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setShowPatientDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    margin: '0.25rem 0 0 0',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {selectedPatient.email} • {selectedPatient.phone}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="outline"
                    icon={Edit}
                    onClick={() => handleEditPatient(selectedPatient)}
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    icon={X}
                    onClick={() => setShowPatientDetails(false)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB'
              }}>
                {[
                  { key: 'overview', label: 'Resumen', icon: User },
                  { key: 'timeline', label: 'Timeline', icon: Clock },
                  { key: 'documents', label: 'Documentos', icon: FileText }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={detailsTab === key ? "primary" : "ghost"}
                    icon={Icon}
                    onClick={() => setDetailsTab(key as 'overview' | 'timeline' | 'documents')}
                    style={{
                      borderRadius: 0,
                      borderBottom: detailsTab === key ? '2px solid #2563EB' : '2px solid transparent'
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflow: 'auto' }}>
                {detailsTab === 'overview' && (
                  <div style={{ padding: '2rem' }}>
                    <PatientCard
                      patient={selectedPatient}
                      showDetails={true}
                    />
                  </div>
                )}
                
                {detailsTab === 'timeline' && (
                  <PatientTimeline
                    patient={selectedPatient}
                    appointments={[]} // TODO: Get real appointments
                    notes={[]} // TODO: Get real notes
                    assessments={[]} // TODO: Get real assessments
                  />
                )}
                
                {detailsTab === 'documents' && (
                  <PatientDocuments
                    patient={selectedPatient}
                    documents={[]} // TODO: Get real documents
                    onUpload={async () => {}} // TODO: Implement
                    onDelete={async () => {}} // TODO: Implement
                    onDownload={() => {}} // TODO: Implement
                    onView={() => {}} // TODO: Implement
                    onUpdateTags={async () => {}} // TODO: Implement
                    onToggleConfidential={async () => {}} // TODO: Implement
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}