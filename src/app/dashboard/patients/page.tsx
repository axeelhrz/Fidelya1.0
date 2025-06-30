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
  X
} from 'lucide-react';
import { ExtendedPatient } from '@/types/clinical';
import { PatientCard } from '@/components/clinical/PatientCard';
import { PatientForm } from '@/components/clinical/patients/PatientForm';
import { PatientTimeline } from '@/components/clinical/patients/PatientTimeline';
import { PatientDocuments } from '@/components/clinical/patients/PatientDocuments';
import { ClinicalCard } from '@/components/clinical/ClinicalCard';

export default function PatientsPage() {
  const [patients, setPatients] = useState<ExtendedPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<ExtendedPatient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    riskLevel: 'all',
    therapist: 'all',
    ageGroup: 'all',
    tags: 'all'
  });
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy] = useState<'name' | 'lastSession' | 'riskLevel' | 'totalSessions' | 'createdAt'>('name');
  
  // Modal states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ExtendedPatient | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [detailsTab, setDetailsTab] = useState<'overview' | 'timeline' | 'documents'>('overview');

  // Mock data para desarrollo
  useEffect(() => {
    const mockPatients: ExtendedPatient[] = [
      {
        id: '1',
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@email.com',
        phone: '+34 612 345 678',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'female',
        pronouns: 'ella/la',
        identification: {
          type: 'dni',
          number: '12345678A',
          expiryDate: new Date('2030-03-15')
        },
        address: {
          street: 'Calle Mayor 123, 2º A',
          city: 'Madrid',
          state: 'Madrid',
          zipCode: '28001',
          country: 'España'
        },
        emergencyContact: {
          name: 'Juan González',
          phone: '+34 612 345 679',
          relationship: 'esposo',
          email: 'juan.gonzalez@email.com'
        },
        insurance: {
          provider: 'Sanitas',
          policyNumber: 'SAN123456789',
          groupNumber: 'GRP001',
          copay: 15
        },
        medicalInfo: {
          allergies: ['Polen', 'Frutos secos'],
          currentMedications: [
            {
              name: 'Sertralina',
              dosage: '50mg',
              frequency: '1 vez al día',
              prescribedBy: 'Dr. Pérez',
              startDate: new Date('2024-01-15'),
              notes: 'Tomar por la mañana con el desayuno'
            }
          ],
          medicalHistory: ['Episodio depresivo mayor (2023)', 'Trastorno de ansiedad generalizada'],
          previousTherapy: true,
          previousTherapyDetails: 'Terapia cognitivo-conductual durante 6 meses en 2023'
        },
        assignedTherapist: 'Dr. Ana Martín',
        status: 'active',
        tags: ['adulto', 'ansiedad', 'depresión', 'medicación'],
        riskLevel: 'medium',
        assessmentScores: {
          phq9: 8,
          gad7: 12,
          custom: {}
        },
        referralSource: {
          type: 'doctor',
          details: 'Derivado por médico de cabecera',
          referrerName: 'Dr. Pérez',
          referrerContact: 'dr.perez@centrosalud.es'
        },
        consentForms: [
          {
            id: 'consent1',
            type: 'Consentimiento Informado',
            signedDate: new Date('2024-01-10'),
            documentUrl: '/documents/consent1.pdf',
            version: '1.0'
          }
        ],
        privacySettings: {
          allowSMS: true,
          allowEmail: true,
          allowCalls: true,
          shareWithFamily: false
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-03-10'),
        lastSession: new Date('2024-03-10'),
        totalSessions: 12,
        adherenceRate: 85,
        satisfactionScore: 4.5,
        feedback: [
          {
            id: 'feedback1',
            date: new Date('2024-03-01'),
            type: 'session',
            rating: 5,
            comment: 'Muy satisfecha con el progreso',
            sentiment: 'positive'
          }
        ]
      },
      {
        id: '2',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+34 623 456 789',
        dateOfBirth: new Date('1992-07-22'),
        gender: 'male',
        pronouns: 'él/lo',
        identification: {
          type: 'dni',
          number: '87654321B'
        },
        address: {
          street: 'Avenida de la Paz 45',
          city: 'Barcelona',
          state: 'Barcelona',
          zipCode: '08001',
          country: 'España'
        },
        emergencyContact: {
          name: 'Carmen Rodríguez',
          phone: '+34 623 456 790',
          relationship: 'madre'
        },
        insurance: {
          provider: 'Adeslas',
          policyNumber: 'ADE987654321',
          copay: 20
        },
        medicalInfo: {
          allergies: [],
          currentMedications: [],
          medicalHistory: ['Episodio depresivo mayor'],
          previousTherapy: false,
          previousTherapyDetails: ''
        },
        assignedTherapist: 'Dr. Luis Fernández',
        status: 'active',
        tags: ['adulto', 'depresión', 'primera-vez'],
        riskLevel: 'high',
        assessmentScores: {
          phq9: 15,
          gad7: 6,
          custom: {}
        },
        referralSource: {
          type: 'online',
          details: 'Búsqueda en Google'
        },
        consentForms: [],
        privacySettings: {
          allowSMS: true,
          allowEmail: true,
          allowCalls: false,
          shareWithFamily: true
        },
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-03-08'),
        lastSession: new Date('2024-03-08'),
        totalSessions: 8,
        adherenceRate: 75,
        feedback: []
      },
      {
        id: '3',
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana.lopez@email.com',
        phone: '+34 634 567 890',
        dateOfBirth: new Date('2005-11-08'),
        gender: 'female',
        pronouns: 'ella/la',
        identification: {
          type: 'dni',
          number: '11223344C'
        },
        address: {
          street: 'Plaza del Sol 12',
          city: 'Valencia',
          state: 'Valencia',
          zipCode: '46001',
          country: 'España'
        },
        emergencyContact: {
          name: 'Pedro López',
          phone: '+34 634 567 891',
          relationship: 'padre',
          email: 'pedro.lopez@email.com'
        },
        insurance: {
          provider: 'DKV',
          policyNumber: 'DKV555666777',
          copay: 10
        },
        medicalInfo: {
          allergies: ['Lactosa'],
          currentMedications: [],
          medicalHistory: ['Anorexia nerviosa'],
          previousTherapy: true,
          previousTherapyDetails: 'Terapia familiar durante 1 año'
        },
        assignedTherapist: 'Dra. Isabel Moreno',
        status: 'active',
        tags: ['adolescente', 'trastorno-alimentario', 'familia'],
        riskLevel: 'critical',
        assessmentScores: {
          phq9: 18,
          gad7: 14,
          custom: {}
        },
        referralSource: {
          type: 'family',
          details: 'Recomendación familiar'
        },
        consentForms: [
          {
            id: 'consent2',
            type: 'Consentimiento Parental',
            signedDate: new Date('2024-01-20'),
            documentUrl: '/documents/consent2.pdf',
            version: '1.0'
          }
        ],
        privacySettings: {
          allowSMS: false,
          allowEmail: true,
          allowCalls: true,
          shareWithFamily: true
        },
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-03-12'),
        lastSession: new Date('2024-03-12'),
        totalSessions: 15,
        adherenceRate: 90,
        satisfactionScore: 4.8,
        feedback: [
          {
            id: 'feedback2',
            date: new Date('2024-03-05'),
            type: 'general',
            rating: 5,
            comment: 'Me siento mucho mejor',
            sentiment: 'positive'
          }
        ]
      }
    ];
    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
  }, []);

  // Filtrar y buscar pacientes
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

      return matchesSearch && matchesStatus && matchesRisk && matchesTherapist && matchesAge && matchesTags;
    });

    // Ordenar
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
          bValue = b.firstName;
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
        // Create new patient
        const newPatient: ExtendedPatient = {
          ...patientData,
          id: `patient-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalSessions: 0,
          adherenceRate: 0,
          feedback: []
        } as ExtendedPatient;
        
        setPatients(prev => [...prev, newPatient]);
      } else if (selectedPatient) {
        // Update existing patient
        setPatients(prev => prev.map(p => 
          p.id === selectedPatient.id 
            ? { ...p, ...patientData, updatedAt: new Date() }
            : p
        ));
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

  const handleExport = () => {
    console.log('Exportando pacientes seleccionados:', selectedPatients);
  };

  const handleAnonymize = () => {
    console.log('Anonimizando pacientes seleccionados:', selectedPatients);
  };

  // Calculate metrics
  const metrics = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    highRisk: patients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
    averageAdherence: patients.reduce((sum, p) => sum + p.adherenceRate, 0) / patients.length,
    newThisMonth: patients.filter(p => {
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      return p.createdAt >= monthAgo;
    }).length
  };

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
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {filteredPatients.length} pacientes encontrados
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreatePatient}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Plus size={18} />
              Nuevo Paciente
            </motion.button>
          </div>
        </div>

        {/* Metrics */}
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
            trend={{ value: 12, isPositive: true }}
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
        </div>

        {/* Toolbar */}
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
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              backgroundColor: showFilters ? '#EFF6FF' : 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Filter size={16} />
            Filtros
            <ChevronDown size={16} style={{
              transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} />
          </motion.button>

          {/* Bulk Actions */}
          {selectedPatients.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                onClick={handleExport}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Download size={16} />
                Exportar ({selectedPatients.length})
              </motion.button>
              
              <motion.button
                onClick={handleAnonymize}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Shield size={16} />
                Anonimizar
              </motion.button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
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
                    <option value="on-hold">En pausa</option>
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
                    <option value="Dr. Ana Martín">Dr. Ana Martín</option>
                    <option value="Dr. Luis Fernández">Dr. Luis Fernández</option>
                    <option value="Dra. Isabel Moreno">Dra. Isabel Moreno</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Patients Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredPatients.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB'
          }}>
            <Users size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              No se encontraron pacientes
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              marginBottom: '2rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              {searchQuery || Object.values(selectedFilters).some(f => f !== 'all') 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer paciente'
              }
            </p>
            {!searchQuery && Object.values(selectedFilters).every(f => f === 'all') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePatient}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Plus size={18} />
                Crear Primer Paciente
              </motion.button>
            )}
          </div>
        ) : (
          <div style={{
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(400px, 1fr))' : undefined,
            flexDirection: viewMode === 'list' ? 'column' : undefined,
            gap: '1.5rem'
          }}>
            {/* Select All Checkbox for List View */}
            {viewMode === 'list' && (
              <div style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB',
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditPatient(selectedPatient)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit size={16} color="#F59E0B" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPatientDetails(false)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} color="#6B7280" />
                  </motion.button>
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
                  <motion.button
                    key={key}
                    whileHover={{ backgroundColor: '#F3F4F6' }}
                    onClick={() => setDetailsTab(key as 'overview' | 'timeline' | 'documents')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 1.5rem',
                      backgroundColor: detailsTab === key ? 'white' : 'transparent',
                      color: detailsTab === key ? '#2563EB' : '#6B7280',
                      border: 'none',
                      borderBottom: detailsTab === key ? '2px solid #2563EB' : '2px solid transparent',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </motion.button>
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