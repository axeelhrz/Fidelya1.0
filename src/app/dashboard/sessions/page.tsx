'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  Download,
  Brain,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Session } from '@/types/dashboard';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    type: 'all',
    therapist: 'all',
    dateRange: '30'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  // Mock data para desarrollo
  useEffect(() => {
    const mockSessions: Session[] = [
      {
        id: '1',
        patientId: '1',
        therapistId: 'therapist1',
        date: new Date('2024-03-10T10:00:00'),
        duration: 60,
        type: 'individual',
        status: 'completed',
        notes: 'Sesión muy productiva. La paciente mostró avances significativos en el manejo de la ansiedad. Se trabajó con técnicas de respiración y reestructuración cognitiva.',
        aiSummary: 'Progreso positivo en manejo de ansiedad. Técnicas de respiración efectivas. Recomendación: continuar con exposición gradual.',
        emotionalState: {
          before: 7,
          after: 4
        },
        interventions: ['Técnicas de respiración', 'Reestructuración cognitiva', 'Relajación muscular'],
        homework: ['Práctica diaria de respiración', 'Registro de pensamientos automáticos'],
        nextSessionGoals: ['Exposición gradual a situaciones temidas', 'Reforzar técnicas aprendidas'],
        cost: 80,
        paid: true
      },
      {
        id: '2',
        patientId: '2',
        therapistId: 'therapist2',
        date: new Date('2024-03-08T15:30:00'),
        duration: 50,
        type: 'individual',
        status: 'completed',
        notes: 'Paciente con episodio depresivo. Se observa mejoría leve en el estado de ánimo. Continúa con ideación suicida pasiva, requiere seguimiento estrecho.',
        aiSummary: 'Mejoría leve en depresión. Mantiene ideación suicida pasiva. Requiere monitoreo continuo y posible ajuste farmacológico.',
        emotionalState: {
          before: 8,
          after: 6
        },
        interventions: ['Terapia cognitivo-conductual', 'Activación conductual', 'Evaluación de riesgo suicida'],
        homework: ['Registro de actividades placenteras', 'Contacto con red de apoyo'],
        nextSessionGoals: ['Reevaluación de riesgo suicida', 'Planificación de actividades'],
        cost: 85,
        paid: true
      },
      {
        id: '3',
        patientId: '3',
        therapistId: 'therapist3',
        date: new Date('2024-03-12T11:00:00'),
        duration: 45,
        type: 'family',
        status: 'completed',
        notes: 'Sesión familiar con adolescente con trastorno alimentario. Buena participación de los padres. Se trabajó en comunicación familiar y establecimiento de límites.',
        aiSummary: 'Sesión familiar productiva. Mejora en comunicación. Padres comprometidos con el tratamiento. Continuar terapia familiar.',
        emotionalState: {
          before: 6,
          after: 5
        },
        interventions: ['Terapia familiar sistémica', 'Psicoeducación', 'Comunicación asertiva'],
        homework: ['Implementar acuerdos familiares', 'Registro de comidas en familia'],
        nextSessionGoals: ['Reforzar límites saludables', 'Trabajar autoestima'],
        cost: 100,
        paid: false
      },
      {
        id: '4',
        patientId: '1',
        therapistId: 'therapist1',
        date: new Date('2024-03-15T14:00:00'),
        duration: 60,
        type: 'individual',
        status: 'scheduled',
        notes: '',
        emotionalState: {
          before: 0,
          after: 0
        },
        interventions: [],
        homework: [],
        nextSessionGoals: [],
        cost: 80,
        paid: false
      }
    ];
    setSessions(mockSessions);
    setFilteredSessions(mockSessions);
  }, []);

  // Filtrar sesiones
  useEffect(() => {
    const filtered = sessions.filter(session => {
      const matchesSearch = 
        session.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.id.includes(searchQuery);

      const matchesStatus = selectedFilters.status === 'all' || session.status === selectedFilters.status;
      const matchesType = selectedFilters.type === 'all' || session.type === selectedFilters.type;

      // Filtro por fecha
      const now = new Date();
      const sessionDate = session.date;
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      const matchesDate = selectedFilters.dateRange === 'all' || daysDiff <= parseInt(selectedFilters.dateRange);

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, selectedFilters]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} color="#10B981" />;
      case 'scheduled': return <Clock size={16} color="#F59E0B" />;
      case 'cancelled': return <XCircle size={16} color="#EF4444" />;
      case 'no-show': return <AlertCircle size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'scheduled': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      case 'no-show': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed': return '#ECFDF5';
      case 'scheduled': return '#FFFBEB';
      case 'cancelled': return '#FEF2F2';
      case 'no-show': return '#FEF2F2';
      default: return '#F9FAFB';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'group': return 'Grupal';
      case 'family': return 'Familiar';
      case 'couple': return 'Pareja';
      default: return type;
    }
  };

  const handleExportSessions = () => {
    console.log('Exportando sesiones seleccionadas:', selectedSessions);
  };

  const handleAIAnalysis = () => {
    console.log('Iniciando análisis IA para sesiones:', selectedSessions);
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSessions.length === filteredSessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(filteredSessions.map(s => s.id));
    }
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
              Gestión de Sesiones
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {filteredSessions.length} sesiones encontradas
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => console.log('Nueva sesión')}
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
              <Calendar size={18} />
              Nueva Sesión
            </motion.button>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={20} color="#10B981" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Completadas
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {sessions.filter(s => s.status === 'completed').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Clock size={20} color="#F59E0B" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Programadas
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {sessions.filter(s => s.status === 'scheduled').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <DollarSign size={20} color="#2563EB" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Ingresos MTD
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              €{sessions.filter(s => s.paid).reduce((sum, s) => sum + s.cost, 0)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Brain size={20} color="#7C3AED" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Con IA
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {sessions.filter(s => s.aiSummary).length}
            </div>
          </motion.div>
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
              placeholder="Buscar sesiones..."
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
          {selectedSessions.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                onClick={handleExportSessions}
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
                Exportar ({selectedSessions.length})
              </motion.button>
              
              <motion.button
                onClick={handleAIAnalysis}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Brain size={16} />
                Análisis IA
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
                    <option value="completed">Completadas</option>
                    <option value="scheduled">Programadas</option>
                    <option value="cancelled">Canceladas</option>
                    <option value="no-show">No asistió</option>
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
                    Tipo
                  </label>
                  <select
                    value={selectedFilters.type}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
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
                    <option value="individual">Individual</option>
                    <option value="group">Grupal</option>
                    <option value="family">Familiar</option>
                    <option value="couple">Pareja</option>
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
                    Período
                  </label>
                  <select
                    value={selectedFilters.dateRange}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <option value="7">Últimos 7 días</option>
                    <option value="30">Últimos 30 días</option>
                    <option value="90">Últimos 90 días</option>
                    <option value="all">Todo el tiempo</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lista de sesiones */}
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
        <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="checkbox"
              checked={selectedSessions.length === filteredSessions.length && filteredSessions.length > 0}
              onChange={handleSelectAll}
              style={{ cursor: 'pointer' }}
            />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            }}>
              Seleccionar todas las sesiones
            </span>
          </div>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #F3F4F6',
                backgroundColor: selectedSessions.includes(session.id) ? '#EFF6FF' : 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => handleSelectSession(session.id)}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="checkbox"
                  checked={selectedSessions.includes(session.id)}
                  onChange={() => handleSelectSession(session.id)}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div style={{ flex: 1 }}>
                  {/* Header de la sesión */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getStatusIcon(session.status)}
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: getStatusBgColor(session.status),
                          color: getStatusColor(session.status),
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {session.status === 'completed' ? 'Completada' :
                           session.status === 'scheduled' ? 'Programada' :
                           session.status === 'cancelled' ? 'Cancelada' : 'No asistió'}
                        </span>
                      </div>
                      
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {getTypeLabel(session.type)}
                      </span>

                      {session.aiSummary && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Sparkles size={14} color="#7C3AED" />
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#7C3AED',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            IA
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {session.date.toLocaleDateString('es-ES')} • {session.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: session.paid ? '#10B981' : '#EF4444',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        €{session.cost}
                      </div>
                    </div>
                  </div>

                  {/* Contenido de la sesión */}
                  {session.status === 'completed' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Notas de la sesión
                        </h4>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6B7280',
                          lineHeight: 1.5,
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {session.notes}
                        </p>

                        {session.interventions.length > 0 && (
                          <div style={{ marginTop: '1rem' }}>
                            <h5 style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '0.5rem',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Intervenciones
                            </h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {session.interventions.map((intervention, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: '#EFF6FF',
                                    color: '#2563EB',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontFamily: 'Inter, sans-serif'
                                  }}
                                >
                                  {intervention}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        {session.aiSummary && (
                          <div style={{
                            padding: '1rem',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '0.75rem',
                            border: '1px solid #E2E8F0',
                            marginBottom: '1rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <Brain size={16} color="#7C3AED" />
                              <h4 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#7C3AED',
                                margin: 0,
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Resumen IA
                              </h4>
                            </div>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#475569',
                              lineHeight: 1.5,
                              margin: 0,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {session.aiSummary}
                            </p>
                          </div>
                        )}

                        {/* Estado emocional */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#FEF2F2',
                            borderRadius: '0.5rem',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginBottom: '0.25rem',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Estado inicial
                            </div>
                            <div style={{
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: '#EF4444',
                              fontFamily: 'Space Grotesk, sans-serif'
                            }}>
                              {session.emotionalState.before}/10
                            </div>
                          </div>
                          
                          <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#ECFDF5',
                            borderRadius: '0.5rem',
                            textAlign: 'center'
                          }}>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              marginBottom: '0.25rem',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Estado final
                            </div>
                            <div style={{
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: '#10B981',
                              fontFamily: 'Space Grotesk, sans-serif'
                            }}>
                              {session.emotionalState.after}/10
                            </div>
                          </div>
                        </div>

                        {/* Tareas para casa */}
                        {session.homework.length > 0 && (
                          <div>
                            <h5 style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '0.5rem',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Tareas para casa
                            </h5>
                            <ul style={{
                              margin: 0,
                              paddingLeft: '1rem',
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {session.homework.map((task, idx) => (
                                <li key={idx} style={{ marginBottom: '0.25rem' }}>
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sesión programada */}
                  {session.status === 'scheduled' && (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#FFFBEB',
                      borderRadius: '0.75rem',
                      border: '1px solid #FDE68A'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="#F59E0B" />
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#92400E',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Sesión programada para {session.date.toLocaleDateString('es-ES')} a las {session.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Ver sesión', session.id);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Editar sesión', session.id);
                    }}
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <FileText size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
            <p style={{
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              No se encontraron sesiones con los filtros aplicados
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
