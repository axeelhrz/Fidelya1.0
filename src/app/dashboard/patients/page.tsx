'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { Patient } from '@/types/dashboard';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    riskLevel: 'all',
    therapist: 'all',
    ageGroup: 'all'
  });
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'lastSession' | 'riskLevel' | 'totalSessions'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Mock data para desarrollo
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@email.com',
        phone: '+34 612 345 678',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'female',
        address: 'Calle Mayor 123, Madrid',
        emergencyContact: {
          name: 'Juan González',
          phone: '+34 612 345 679',
          relationship: 'Esposo'
        },
        assignedTherapist: 'Dr. Ana Martín',
        status: 'active',
        tags: ['adulto', 'ansiedad'],
        createdAt: new Date('2024-01-15'),
        lastSession: new Date('2024-03-10'),
        totalSessions: 12,
        diagnosis: ['Trastorno de Ansiedad Generalizada'],
        riskLevel: 'medium',
        phq9Score: 8,
        gad7Score: 12,
        notes: 'Paciente con buena evolución, colaborativa en el tratamiento.'
      },
      {
        id: '2',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+34 623 456 789',
        dateOfBirth: new Date('1992-07-22'),
        gender: 'male',
        address: 'Avenida de la Paz 45, Barcelona',
        emergencyContact: {
          name: 'Carmen Rodríguez',
          phone: '+34 623 456 790',
          relationship: 'Madre'
        },
        assignedTherapist: 'Dr. Luis Fernández',
        status: 'active',
        tags: ['adulto', 'depresión'],
        createdAt: new Date('2024-02-01'),
        lastSession: new Date('2024-03-08'),
        totalSessions: 8,
        diagnosis: ['Episodio Depresivo Mayor'],
        riskLevel: 'high',
        phq9Score: 15,
        gad7Score: 6,
        notes: 'Requiere seguimiento estrecho. Ideación suicida pasiva.'
      },
      {
        id: '3',
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana.lopez@email.com',
        phone: '+34 634 567 890',
        dateOfBirth: new Date('2005-11-08'),
        gender: 'female',
        address: 'Plaza del Sol 12, Valencia',
        emergencyContact: {
          name: 'Pedro López',
          phone: '+34 634 567 891',
          relationship: 'Padre'
        },
        assignedTherapist: 'Dra. Isabel Moreno',
        status: 'active',
        tags: ['adolescente', 'trastorno-alimentario'],
        createdAt: new Date('2024-01-20'),
        lastSession: new Date('2024-03-12'),
        totalSessions: 15,
        diagnosis: ['Anorexia Nerviosa'],
        riskLevel: 'critical',
        phq9Score: 18,
        gad7Score: 14,
        notes: 'Paciente adolescente con trastorno alimentario. Coordinación con familia.'
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
        patient.phone.includes(searchQuery);

      const matchesStatus = selectedFilters.status === 'all' || patient.status === selectedFilters.status;
      const matchesRisk = selectedFilters.riskLevel === 'all' || patient.riskLevel === selectedFilters.riskLevel;
      const matchesTherapist = selectedFilters.therapist === 'all' || patient.assignedTherapist === selectedFilters.therapist;
      
      const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
      const matchesAge = selectedFilters.ageGroup === 'all' || 
        (selectedFilters.ageGroup === 'child' && age < 12) ||
        (selectedFilters.ageGroup === 'adolescent' && age >= 12 && age < 18) ||
        (selectedFilters.ageGroup === 'adult' && age >= 18);

      return matchesSearch && matchesStatus && matchesRisk && matchesTherapist && matchesAge;
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#7C2D12';
      default: return '#6B7280';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low': return '#ECFDF5';
      case 'medium': return '#FFFBEB';
      case 'high': return '#FEF2F2';
      case 'critical': return '#FEF2F2';
      default: return '#F9FAFB';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'discharged': return '#2563EB';
      default: return '#6B7280';
    }
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
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
              onClick={() => console.log('Nuevo paciente')}
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

        {/* Barra de herramientas */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          {/* Búsqueda */}
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

          {/* Filtros */}
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

          {/* Acciones en lote */}
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

        {/* Panel de filtros */}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tabla de pacientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>
                  <input
                    type="checkbox"
                    checked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th 
                  onClick={() => {
                    if (sortBy === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #E5E7EB',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Paciente {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Contacto
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Terapeuta
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Estado
                </th>
                <th 
                  onClick={() => {
                    if (sortBy === 'riskLevel') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('riskLevel');
                      setSortOrder('asc');
                    }
                  }}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #E5E7EB',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Riesgo {sortBy === 'riskLevel' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => {
                    if (sortBy === 'totalSessions') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('totalSessions');
                      setSortOrder('asc');
                    }
                  }}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #E5E7EB',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Sesiones {sortBy === 'totalSessions' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Última Sesión
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '1px solid #E5E7EB',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                    backgroundColor: selectedPatients.includes(patient.id) ? '#EFF6FF' : 'transparent'
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() => handleSelectPatient(patient.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User size={18} color="#2563EB" />
                      </div>
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
                          {calculateAge(patient.dateOfBirth)} años • {patient.gender === 'male' ? 'M' : 'F'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#1F2937',
                        marginBottom: '0.25rem',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {patient.email}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#1F2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.assignedTherapist}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: patient.status === 'active' ? '#ECFDF5' : 
                                     patient.status === 'inactive' ? '#F3F4F6' : '#EFF6FF',
                      color: getStatusColor(patient.status),
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.status === 'active' ? 'Activo' : 
                       patient.status === 'inactive' ? 'Inactivo' : 'Alta'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getRiskColor(patient.riskLevel)
                      }} />
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: getRiskBgColor(patient.riskLevel),
                        color: getRiskColor(patient.riskLevel),
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {patient.riskLevel === 'low' ? 'Bajo' :
                         patient.riskLevel === 'medium' ? 'Medio' :
                         patient.riskLevel === 'high' ? 'Alto' : 'Crítico'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.totalSessions}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#1F2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {patient.lastSession ? patient.lastSession.toLocaleDateString('es-ES') : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => console.log('Ver paciente', patient.id)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          backgroundColor: '#EFF6FF',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={16} color="#2563EB" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => console.log('Editar paciente', patient.id)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          backgroundColor: '#FFFBEB',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit size={16} color="#F59E0B" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => console.log('Eliminar paciente', patient.id)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          backgroundColor: '#FEF2F2',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <Users size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
            <p style={{
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              No se encontraron pacientes con los filtros aplicados
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
