'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  CheckSquare,
  AlertTriangle,
  Star,
  Clock,
  Video,
  Target,
  Eye,
  Plus,
  Search,
  Download,
  BarChart3,
  Activity,
  BookOpen,
} from 'lucide-react';
import { SupervisionSession, Competency, Therapist, SupervisionMetrics } from '@/types/clinical';

interface SupervisionManagerProps {
  therapists: Therapist[];
  sessions: SupervisionSession[];
  competencies: Competency[];
  metrics: SupervisionMetrics;
  onCreateSession: (sessionData: Omit<SupervisionSession, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateSession: (sessionId: string, updates: Partial<SupervisionSession>) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function SupervisionManager({
  therapists,
  sessions,
  competencies,
  metrics,
}: SupervisionManagerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Activity },
    { id: 'sessions', label: 'Sesiones', icon: Calendar },
    { id: 'competencies', label: 'Competencias', icon: CheckSquare },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
    { id: 'resources', label: 'Recursos', icon: BookOpen }
  ];

  const riskLevels = [
    { level: 'low', label: 'Bajo', color: '#10B981', threshold: 85 },
    { level: 'medium', label: 'Medio', color: '#F59E0B', threshold: 70 },
    { level: 'high', label: 'Alto', color: '#EF4444', threshold: 0 }
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.therapistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.notes && session.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    const matchesTherapist = !selectedTherapist || session.therapistId === selectedTherapist;
    
    return matchesSearch && matchesFilter && matchesTherapist;
  });

  const getTherapistCompetencyScore = (therapistId: string) => {
    const therapistCompetencies = competencies.filter(c => c.therapistId === therapistId);
    if (therapistCompetencies.length === 0) return 0;
    
    const totalScore = therapistCompetencies.reduce((sum, comp) => sum + comp.score, 0);
    return Math.round(totalScore / therapistCompetencies.length);
  };

  const getTherapistRiskLevel = (therapistId: string) => {
    const score = getTherapistCompetencyScore(therapistId);
    return riskLevels.find(level => score >= level.threshold) || riskLevels[2];
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'individual':
        return 'Individual';
      case 'group':
        return 'Grupal';
      case 'virtual':
        return 'Virtual';
      default:
        return 'Individual';
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'individual':
        return '#10B981';
      case 'group':
        return '#6366F1';
      case 'virtual':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'scheduled':
        return 'Programada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Programada';
    }
  };

  const handleCreateSession = () => {
    // Modal logic removed
  };

  const handleViewSession = () => {
    // Modal logic removed
  };

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Terapeutas Activos
            </h4>
            <Users size={20} color="#6366F1" />
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1F2937',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {metrics.activeTherapists}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#10B981',
            fontFamily: 'Inter, sans-serif'
          }}>
            +{metrics.newTherapistsThisMonth} este mes
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Sesiones de Supervisión
            </h4>
            <Calendar size={20} color="#10B981" />
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1F2937',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {metrics.totalSessions}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#10B981',
            fontFamily: 'Inter, sans-serif'
          }}>
            {metrics.sessionsThisMonth} este mes
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Competencia Promedio
            </h4>
            <Star size={20} color="#F59E0B" />
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1F2937',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {metrics.averageCompetencyScore}%
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: metrics.competencyTrend > 0 ? '#10B981' : '#EF4444',
            fontFamily: 'Inter, sans-serif'
          }}>
            {metrics.competencyTrend > 0 ? '+' : ''}{metrics.competencyTrend}% vs mes anterior
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Alertas de Riesgo
            </h4>
            <AlertTriangle size={20} color="#EF4444" />
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1F2937',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {metrics.riskAlerts}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#EF4444',
            fontFamily: 'Inter, sans-serif'
          }}>
            Requieren atención inmediata
          </div>
        </motion.div>
      </div>

      {/* Therapist Risk Dashboard */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1F2937',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Panel de Riesgo por Terapeuta
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateSession}
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
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Plus size={16} />
            Nueva Supervisión
          </motion.button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {therapists.map((therapist) => {
            const competencyScore = getTherapistCompetencyScore(therapist.id);
            const riskLevel = getTherapistRiskLevel(therapist.id);
            const recentSessions = sessions.filter(s => s.therapistId === therapist.id).slice(0, 3);

            return (
              <motion.div
                key={therapist.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTherapist(therapist.id)}
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.75rem',
                  border: `2px solid ${riskLevel.color}20`,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Risk Level Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: `${riskLevel.color}20`,
                  borderRadius: '0.25rem',
                  border: `1px solid ${riskLevel.color}40`
                }}>
                  <span style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: riskLevel.color,
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase'
                  }}>
                    Riesgo {riskLevel.label}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#6366F1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {therapist.firstName[0]}{therapist.lastName[0]}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {therapist.firstName} {therapist.lastName}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {therapist.specialization}
                    </div>
                  </div>
                </div>

                {/* Competency Score */}
                <div style={{
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Competencia General
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: riskLevel.color,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {competencyScore}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${competencyScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        backgroundColor: riskLevel.color,
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <div style={{ marginBottom: '0.25rem' }}>
                    Última supervisión: {recentSessions[0]?.date.toLocaleDateString('es-ES') || 'Nunca'}
                  </div>
                  <div>
                    Pacientes activos: {therapist.activePatients || 0}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1F2937',
          margin: '0 0 1.5rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Sesiones Recientes
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {sessions.slice(0, 5).map((session) => (
            <motion.div
              key={session.id}
              whileHover={{ scale: 1.01 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: '#F9FAFB',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: getSessionTypeColor(session.type),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(session.type === 'individual' as string || session.type === 'group' as string) ? (
                    <Users size={16} color="white" />
                  ) : (
                    <Video size={16} color="white" />
                  )}
                </div>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {session.therapistName} • {session.supervisorName}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {session.date.toLocaleDateString('es-ES')} • {session.duration} min
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: session.status === 'completed' ? '#F0FDF4' : '#FEF3C7',
                  borderRadius: '0.25rem',
                  border: `1px solid ${session.status === 'completed' ? '#BBF7D0' : '#FDE68A'}`
                }}>
                  <span style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: session.status === 'completed' ? '#15803D' : '#92400E',
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase'
                  }}>
                    {getStatusLabel(session.status)}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleViewSession()}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with Search and Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#1F2937',
          margin: 0,
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Sesiones de Supervisión
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#6B7280" style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '2.5rem',
                paddingRight: '0.75rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                width: '200px'
              }}
              placeholder="Buscar sesiones..."
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="scheduled">Programadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>

          {/* Therapist Filter */}
          <select
            value={selectedTherapist || ''}
            onChange={(e) => setSelectedTherapist(e.target.value || null)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none'
            }}
          >
            <option value="">Todos los terapeutas</option>
            {therapists.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.firstName} {therapist.lastName}
              </option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateSession}
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
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Plus size={16} />
            Nueva Sesión
          </motion.button>
        </div>
      </div>

      {/* Sessions List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {filteredSessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: getSessionTypeColor(session.type),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(session.type === 'individual' as string) ? (
                    <Users size={20} color="white" />
                  ) : (session.type === 'group' as string) ? (
                    <Users size={20} color="white" />
                  ) : (
                    <Video size={20} color="white" />
                  )}
                </div>

                <div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    marginBottom: '0.25rem',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Supervisión {getSessionTypeLabel(session.type)}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Terapeuta: {session.therapistName} • Supervisor: {session.supervisorName}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: session.status === 'completed' ? '#F0FDF4' : session.status === 'scheduled' ? '#FEF3C7' : '#FEF2F2',
                  borderRadius: '0.5rem',
                  border: `1px solid ${session.status === 'completed' ? '#BBF7D0' : session.status === 'scheduled' ? '#FDE68A' : '#FECACA'}`
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: session.status === 'completed' ? '#15803D' : session.status === 'scheduled' ? '#92400E' : '#991B1B',
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase'
                  }}>
                    {getStatusLabel(session.status)}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleViewSession()}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={16} />
                </motion.button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Calendar size={14} />
                <span>{session.date.toLocaleDateString('es-ES')}</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Clock size={14} />
                <span>{session.duration} minutos</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Target size={14} />
                <span>{session.competenciesReviewed?.length || 0} competencias</span>
              </div>
            </div>

            {session.notes && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#F9FAFB',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB',
                marginBottom: '1rem'
              }}>
                <h6 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '0 0 0.5rem 0',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Notas de la Sesión:
                </h6>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: 0,
                  lineHeight: '1.5',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {session.notes}
                </p>
              </div>
            )}

            {session.actionItems && session.actionItems.length > 0 && (
              <div>
                <h6 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '0 0 0.5rem 0',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Acciones de Seguimiento:
                </h6>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {session.actionItems.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#6366F1',
                        borderRadius: '50%'
                      }} />
                      <span>{typeof item === 'string' ? item : (item?.toString ? item.toString() : JSON.stringify(item))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F9FAFB'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 2rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Supervisión Clínica
            </h1>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: activeTab === tab.id ? '#EEF2FF' : 'transparent',
                      color: activeTab === tab.id ? '#4338CA' : '#6B7280',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: activeTab === tab.id ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Download size={16} />
              Exportar Reporte
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'competencies' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <CheckSquare size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Gestión de Competencias
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Evaluación y seguimiento de competencias profesionales
            </p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <BarChart3 size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Análisis de Supervisión
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Métricas y análisis del programa de supervisión
            </p>
          </div>
        )}
        {activeTab === 'resources' && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <BookOpen size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Recursos de Supervisión
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Biblioteca de recursos y materiales de supervisión
            </p>
          </div>
        )}
      </div>
    </div>
  );
}