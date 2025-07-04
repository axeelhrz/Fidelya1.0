'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  Calendar,
  Download,
  Share2,
  MessageSquare,
  Award,
  FileText,
  Lightbulb,
  Heart,
  Brain,
  Users,
  Zap,
  ChevronRight,
  ChevronDown,
  Play,
  Star,
  Eye,
  ExternalLink,
  Bell,
  CheckCircle,
  Info,
  Moon,
  Sun
} from 'lucide-react';
import { usePatientTreatment } from '@/hooks/usePatientTreatment';
import TaskCompletionModal from '@/components/clinical/patient-portal/TaskCompletionModal';
import ExportTreatmentModal from '@/components/clinical/patient-portal/ExportTreatmentModal';
import type { TreatmentExportOptions } from '@/types/treatment';

export default function PatientTreatmentPage() {
  const {
    treatmentPlan,
    objectives,
    tasks,
    alerts,
    materials,
    progress,
    therapistNotes,
    loading,
    loadingTasks,
    error,
    markTaskCompleted,
    markTaskInProgress,
    markAlertResolved,
    markNoteRead,
    exportTreatmentPlan,
    getTaskStats,
    getObjectiveStats
  } = usePatientTreatment();

  // Local state
  const [darkMode, setDarkMode] = useState(false);
  const [expandedObjective, setExpandedObjective] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Statistics
  const taskStats = getTaskStats();
  const objectiveStats = getObjectiveStats();

  // Theme colors
  const theme = {
    primary: darkMode ? '#3B82F6' : '#2563EB',
    secondary: darkMode ? '#64748B' : '#475569',
    background: darkMode ? '#0F172A' : '#FFFFFF',
    surface: darkMode ? '#1E293B' : '#F8FAFC',
    text: darkMode ? '#F1F5F9' : '#1E293B',
    textSecondary: darkMode ? '#94A3B8' : '#64748B',
    border: darkMode ? '#334155' : '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  };

  // Handle task completion
  const handleTaskCompletion = async (feedback: string, rating: number) => {
    if (selectedTaskId) {
      await markTaskCompleted(selectedTaskId, feedback, rating);
      setShowTaskModal(false);
      setSelectedTaskId(null);
    }
  };

  // Handle export
  const handleExport = async (options: TreatmentExportOptions) => {
    try {
      const exportUrl = await exportTreatmentPlan(options);
      // In a real implementation, this would trigger the download or email
      console.log('Export URL:', exportUrl);
      
      // Show success message
      alert('Plan exportado exitosamente');
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error al exportar el plan');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        backgroundColor: theme.background
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `4px solid ${theme.border}`,
            borderTop: `4px solid ${theme.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{
            fontSize: '1rem',
            color: theme.textSecondary,
            fontFamily: 'Inter, sans-serif'
          }}>
            Cargando tu plan de tratamiento...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !treatmentPlan) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: theme.background,
        color: theme.text
      }}>
        <AlertTriangle size={48} color={theme.error} style={{ marginBottom: '1rem' }} />
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Error al cargar el plan de tratamiento
        </h3>
        <p style={{
          fontSize: '1rem',
          color: theme.textSecondary,
          fontFamily: 'Inter, sans-serif'
        }}>
          {error || 'No se pudo cargar tu plan de tratamiento. Por favor, intenta de nuevo.'}
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
      case 'completado':
      case 'completada':
        return theme.success;
      case 'en-progreso':
      case 'en-revision':
        return theme.warning;
      case 'pausado':
      case 'vencida':
        return theme.error;
      default:
        return theme.info;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'activo': 'Activo',
      'en-revision': 'En Revisión',
      'completado': 'Completado',
      'pausado': 'Pausado',
      'pendiente': 'Pendiente',
      'en-progreso': 'En Progreso',
      'completada': 'Completada',
      'asignada': 'Asignada',
      'vencida': 'Vencida'
    };
    return statusMap[status] || status;
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 85) return theme.success;
    if (adherence >= 50) return theme.warning;
    return theme.error;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return theme.error;
      case 'media':
        return theme.warning;
      case 'baja':
        return theme.info;
      default:
        return theme.secondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitivo':
        return Brain;
      case 'conductual':
        return Zap;
      case 'emocional':
        return Heart;
      case 'social':
        return Users;
      case 'sintomatico':
        return AlertTriangle;
      default:
        return Target;
    }
  };

  return (
    <div style={{
      backgroundColor: theme.background,
      color: theme.text,
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '2rem 0',
          borderBottom: `1px solid ${theme.border}`,
          marginBottom: '2rem'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif',
              background: `linear-gradient(135deg, ${theme.primary} 0%, #8B5CF6 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Plan de Tratamiento
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: theme.textSecondary,
              margin: '0.5rem 0 0 0'
            }}>
              Revisá tus objetivos y tareas para tu proceso terapéutico
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '0.75rem',
                borderRadius: '50%',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.surface,
                cursor: 'pointer',
                color: theme.text
              }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowExportModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              <Download size={16} />
              Exportar Plan
            </motion.button>
          </div>
        </div>

        {/* Welcome Message */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: theme.surface,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`
        }}>
          <p style={{
            fontSize: '1rem',
            margin: 0,
            color: theme.text
          }}>
            ¡Hola! Aquí puedes consultar tu plan de tratamiento personalizado, revisar tus objetivos, 
            completar tareas asignadas y acceder a materiales de apoyo. Tu progreso es importante para nosotros.
          </p>
        </div>
      </motion.div>

      {/* Treatment Plan Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          padding: '2rem',
          backgroundColor: theme.surface,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`,
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: `linear-gradient(135deg, ${theme.primary}20 0%, transparent 70%)`,
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: '0 0 0.5rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {treatmentPlan.planName}
              </h2>
              <p style={{
                fontSize: '1rem',
                color: theme.textSecondary,
                margin: '0 0 1rem 0',
                lineHeight: 1.6
              }}>
                {treatmentPlan.description}
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme.textSecondary,
                    margin: '0 0 0.25rem 0',
                    fontWeight: 500
                  }}>
                    Fecha de Inicio
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    margin: 0,
                    color: theme.text
                  }}>
                    {treatmentPlan.startDate.toLocaleDateString('es-ES')}
                  </p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme.textSecondary,
                    margin: '0 0 0.25rem 0',
                    fontWeight: 500
                  }}>
                    Última Revisión
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    margin: 0,
                    color: theme.text
                  }}>
                    {treatmentPlan.lastReviewed.toLocaleDateString('es-ES')}
                  </p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: theme.textSecondary,
                    margin: '0 0 0.25rem 0',
                    fontWeight: 500
                  }}>
                    Próxima Revisión
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    margin: 0,
                    color: theme.warning
                  }}>
                    {treatmentPlan.nextReviewDate.toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginLeft: '2rem'
            }}>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: getStatusColor(treatmentPlan.status),
                color: 'white',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'white'
                }} />
                {getStatusText(treatmentPlan.status)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Overall Progress */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: theme.surface,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: `${theme.success}20`
            }}>
              <TrendingUp size={20} color={theme.success} />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              margin: 0
            }}>
              Progreso General
            </h3>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: theme.success,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {progress?.overallProgress || 0}%
              </span>
              <span style={{
                fontSize: '0.875rem',
                color: theme.textSecondary
              }}>
                del plan completado
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: theme.border,
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress?.overallProgress || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  backgroundColor: theme.success,
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tasks Progress */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: theme.surface,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: `${theme.warning}20`
            }}>
              <CheckCircle2 size={20} color={theme.warning} />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              margin: 0
            }}>
              Tareas
            </h3>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: theme.warning,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {taskStats.completed}/{taskStats.total}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: theme.textSecondary
            }}>
              completadas
            </span>
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: theme.border,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${taskStats.completionRate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%',
                backgroundColor: theme.warning,
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Objectives Progress */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: theme.surface,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: `${theme.info}20`
            }}>
              <Target size={20} color={theme.info} />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              margin: 0
            }}>
              Objetivos
            </h3>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: theme.info,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {Math.round(objectiveStats.averageProgress)}%
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: theme.textSecondary
            }}>
              progreso promedio
            </span>
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: theme.border,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${objectiveStats.averageProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%',
                backgroundColor: theme.info,
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Adherence Rate */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: theme.surface,
          borderRadius: '1rem',
          border: `1px solid ${theme.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: `${getAdherenceColor(treatmentPlan.adherenceRate)}20`
            }}>
              <Award size={20} color={getAdherenceColor(treatmentPlan.adherenceRate)} />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              margin: 0
            }}>
              Adherencia
            </h3>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: getAdherenceColor(treatmentPlan.adherenceRate),
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {treatmentPlan.adherenceRate}%
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: theme.textSecondary
            }}>
              al tratamiento
            </span>
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: theme.border,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${treatmentPlan.adherenceRate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%',
                backgroundColor: getAdherenceColor(treatmentPlan.adherenceRate),
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}
        className="responsive-grid"
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Treatment Objectives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '2rem',
              backgroundColor: theme.surface,
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Objetivos SMART
              </h2>
              <span style={{
                padding: '0.5rem 1rem',
                backgroundColor: `${theme.info}20`,
                color: theme.info,
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                {objectives.length} objetivos
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {objectives.map((objective) => {
                const CategoryIcon = getCategoryIcon(objective.category);
                const isExpanded = expandedObjective === objective.id;
                
                return (
                  <motion.div
                    key={objective.id}
                    layout
                    style={{
                      padding: '1.5rem',
                      backgroundColor: theme.background,
                      borderRadius: '0.75rem',
                      border: `1px solid ${theme.border}`,
                      cursor: 'pointer'
                    }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setExpandedObjective(isExpanded ? null : objective.id)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.75rem'
                        }}>
                          <div style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: `${getPriorityColor(objective.priority)}20`
                          }}>
                            <CategoryIcon size={18} color={getPriorityColor(objective.priority)} />
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: 600,
                              margin: 0,
                              color: theme.text
                            }}>
                              {objective.title}
                            </h4>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              marginTop: '0.25rem'
                            }}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: getStatusColor(objective.status),
                                color: 'white',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}>
                                {getStatusText(objective.status)}
                              </span>
                              
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: `${getPriorityColor(objective.priority)}20`,
                                color: getPriorityColor(objective.priority),
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}>
                                Prioridad {objective.priority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p style={{
                          fontSize: '0.875rem',
                          color: theme.textSecondary,
                          margin: '0 0 1rem 0',
                          lineHeight: 1.5
                        }}>
                          {objective.description}
                        </p>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: theme.text
                            }}>
                              Progreso
                            </span>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: theme.success
                            }}>
                              {objective.progress}%
                            </span>
                          </div>
                          
                          <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: theme.border,
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${objective.progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              style={{
                                height: '100%',
                                backgroundColor: theme.success,
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                        </div>

                        {/* Adherence Indicator */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: getAdherenceColor(objective.adherence)
                          }} />
                          <span style={{
                            fontSize: '0.875rem',
                            color: theme.textSecondary
                          }}>
                            Adherencia: {objective.adherence}%
                          </span>
                        </div>

                        {/* Timeline */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          fontSize: '0.875rem',
                          color: theme.textSecondary
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={14} />
                            <span>Inicio: {objective.startDate.toLocaleDateString('es-ES')}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14} />
                            <span>Meta: {objective.targetDate.toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          padding: '0.5rem',
                          marginLeft: '1rem'
                        }}
                      >
                        <ChevronDown size={20} color={theme.textSecondary} />
                      </motion.div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            marginTop: '1.5rem',
                            paddingTop: '1.5rem',
                            borderTop: `1px solid ${theme.border}`
                          }}
                        >
                          {/* SMART Criteria */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                          }}>
                            <div>
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                margin: '0 0 0.25rem 0',
                                color: theme.text
                              }}>
                                Medible
                              </h5>
                              <p style={{
                                fontSize: '0.875rem',
                                color: theme.textSecondary,
                                margin: 0,
                                lineHeight: 1.4
                              }}>
                                {objective.measurable}
                              </p>
                            </div>
                            
                            <div>
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                margin: '0 0 0.25rem 0',
                                color: theme.text
                              }}>
                                Alcanzable
                              </h5>
                              <p style={{
                                fontSize: '0.875rem',
                                color: theme.textSecondary,
                                margin: 0,
                                lineHeight: 1.4
                              }}>
                                {objective.achievable}
                              </p>
                            </div>
                            
                            <div>
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                margin: '0 0 0.25rem 0',
                                color: theme.text
                              }}>
                                Relevante
                              </h5>
                              <p style={{
                                fontSize: '0.875rem',
                                color: theme.textSecondary,
                                margin: 0,
                                lineHeight: 1.4
                              }}>
                                {objective.relevant}
                              </p>
                            </div>
                            
                            <div>
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                margin: '0 0 0.25rem 0',
                                color: theme.text
                              }}>
                                Tiempo Límite
                              </h5>
                              <p style={{
                                fontSize: '0.875rem',
                                color: theme.textSecondary,
                                margin: 0,
                                lineHeight: 1.4
                              }}>
                                {objective.timeBound}
                              </p>
                            </div>
                          </div>

                          {/* Milestones */}
                          {objective.milestones.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <h5 style={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                margin: '0 0 1rem 0',
                                color: theme.text
                              }}>
                                Hitos del Objetivo
                              </h5>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {objective.milestones.map((milestone) => (
                                  <div
                                    key={milestone.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.75rem',
                                      padding: '0.75rem',
                                      backgroundColor: milestone.status === 'completado' 
                                        ? `${theme.success}10` 
                                        : theme.surface,
                                      borderRadius: '0.5rem',
                                      border: `1px solid ${milestone.status === 'completado' 
                                        ? theme.success 
                                        : theme.border}`
                                    }}
                                  >
                                    <div style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '50%',
                                      backgroundColor: milestone.status === 'completado' 
                                        ? theme.success 
                                        : theme.border,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      {milestone.status === 'completado' && (
                                        <CheckCircle size={12} color="white" />
                                      )}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                      <h6 style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        margin: 0,
                                        color: theme.text
                                      }}>
                                        {milestone.title}
                                      </h6>
                                      <p style={{
                                        fontSize: '0.75rem',
                                        color: theme.textSecondary,
                                        margin: '0.25rem 0 0 0'
                                      }}>
                                        {milestone.description}
                                      </p>
                                    </div>
                                    
                                    <div style={{
                                      fontSize: '0.75rem',
                                      color: theme.textSecondary,
                                      textAlign: 'right'
                                    }}>
                                      {milestone.achievedDate 
                                        ? `Completado: ${milestone.achievedDate.toLocaleDateString('es-ES')}`
                                        : `Meta: ${milestone.targetDate.toLocaleDateString('es-ES')}`
                                      }
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Barriers and Facilitators */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem'
                          }}>
                            <div>
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                margin: '0 0 0.5rem 0',
                                color: theme.error
                              }}>
                                Barreras Identificadas
                              </h5>
                              <ul style={{
                                margin: 0,
                                paddingLeft: '1rem',
                                fontSize: '0.875rem',
                                color: theme.textSecondary
                              }}>
                                {objective.barriers.map((barrier, index) => (
                                  <li key={index} style={{ marginBottom: '0.25rem' }}>
                                    {barrier}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                margin: '0 0 0.5rem 0',
                                color: theme.success
                              }}>
                                Facilitadores
                              </h5>
                              <ul style={{
                                margin: 0,
                                paddingLeft: '1rem',
                                fontSize: '0.875rem',
                                color: theme.textSecondary
                              }}>
                                {objective.facilitators.map((facilitator, index) => (
                                  <li key={index} style={{ marginBottom: '0.25rem' }}>
                                    {facilitator}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Treatment Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '2rem',
              backgroundColor: theme.surface,
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Tareas y Psicoeducación
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: `${theme.warning}20`,
                  color: theme.warning,
                  borderRadius: '2rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  {tasks.filter(t => t.status !== 'completada').length} pendientes
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  style={{
                    padding: '1.5rem',
                    backgroundColor: theme.background,
                    borderRadius: '0.75rem',
                    border: `1px solid ${theme.border}`,
                    position: 'relative'
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          backgroundColor: `${getPriorityColor(task.priority)}20`
                        }}>
                          <FileText size={18} color={getPriorityColor(task.priority)} />
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            margin: 0,
                            color: theme.text
                          }}>
                            {task.title}
                          </h4>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginTop: '0.25rem'
                          }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: getStatusColor(task.status),
                              color: 'white',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {getStatusText(task.status)}
                            </span>
                            
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: `${getPriorityColor(task.priority)}20`,
                              color: getPriorityColor(task.priority),
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {task.priority} prioridad
                            </span>
                            
                            <span style={{
                              fontSize: '0.75rem',
                              color: theme.textSecondary
                            }}>
                              {task.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p style={{
                        fontSize: '0.875rem',
                        color: theme.textSecondary,
                        margin: '0 0 1rem 0',
                        lineHeight: 1.5
                      }}>
                        {task.description}
                      </p>

                      {/* Task Details */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        color: theme.textSecondary
                      }}>
                        {task.dueDate && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14} />
                            <span>Vence: {task.dueDate.toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                        
                        {task.estimatedDuration && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14} />
                            <span>{task.estimatedDuration} min</span>
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Lightbulb size={14} />
                          <span>Dificultad: {task.difficulty}</span>
                        </div>
                      </div>

                      {/* Resources */}
                      {task.resources.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h5 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            margin: '0 0 0.5rem 0',
                            color: theme.text
                          }}>
                            Recursos disponibles:
                          </h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {task.resources.map((resource) => (
                              <motion.button
                                key={resource.id}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => window.open(resource.url || '#', '_blank')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.5rem 0.75rem',
                                  backgroundColor: `${theme.info}20`,
                                  color: theme.info,
                                  border: 'none',
                                  borderRadius: '0.5rem',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: 500
                                }}
                              >
                                <ExternalLink size={12} />
                                {resource.name}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Patient Feedback (if completed) */}
                      {task.status === 'completada' && task.patientFeedback && (
                        <div style={{
                          padding: '1rem',
                          backgroundColor: `${theme.success}10`,
                          borderRadius: '0.5rem',
                          border: `1px solid ${theme.success}30`,
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <CheckCircle size={16} color={theme.success} />
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: theme.success
                            }}>
                              Tarea completada
                            </span>
                            {task.patientRating && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    color={i < task.patientRating! ? theme.warning : theme.border}
                                    fill={i < task.patientRating! ? theme.warning : 'none'}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: theme.textSecondary,
                            margin: 0,
                            fontStyle: 'italic'
                          }}>
                            &ldquo;{task.patientFeedback}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      marginLeft: '1rem'
                    }}>
                      {task.status === 'asignada' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => markTaskInProgress(task.id)}
                          disabled={loadingTasks}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: theme.warning,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Play size={14} />
                          Iniciar
                        </motion.button>
                      )}
                      
                      {task.status === 'en-progreso' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedTaskId(task.id);
                            setShowTaskModal(true);
                          }}
                          disabled={loadingTasks}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: theme.success,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <CheckCircle2 size={14} />
                          Completar
                        </motion.button>
                      )}
                      
                      {task.status === 'completada' && (
                        <div style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: `${theme.success}20`,
                          color: theme.success,
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <CheckCircle size={14} />
                          Completada
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Alerts and Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              padding: '1.5rem',
              backgroundColor: theme.surface,
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Alertas y Revisiones
              </h3>
              {alerts.filter(a => a.status === 'activa').length > 0 && (
                <span style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: theme.error,
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {alerts.filter(a => a.status === 'activa').length}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alerts.filter(a => a.status === 'activa').map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: theme.background,
                    borderRadius: '0.5rem',
                    border: `1px solid ${alert.urgency === 'alta' ? theme.error : 
                                       alert.urgency === 'media' ? theme.warning : theme.info}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      backgroundColor: alert.urgency === 'alta' ? `${theme.error}20` : 
                                     alert.urgency === 'media' ? `${theme.warning}20` : `${theme.info}20`,
                      marginTop: '0.125rem'
                    }}>
                      <Bell size={12} color={
                        alert.urgency === 'alta' ? theme.error : 
                        alert.urgency === 'media' ? theme.warning : theme.info
                      } />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        margin: 0,
                        color: theme.text
                      }}>
                        {alert.title}
                      </h5>
                      <p style={{
                        fontSize: '0.75rem',
                        color: theme.textSecondary,
                        margin: '0.25rem 0',
                        lineHeight: 1.4
                      }}>
                        {alert.description}
                      </p>
                      {alert.scheduledFor && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: theme.textSecondary
                        }}>
                          {alert.scheduledFor.toLocaleDateString('es-ES')}
                        </span>
                      )}
                      
                      {alert.actionRequired && alert.actions.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          {alert.actions.map((action) => (
                            <motion.button
                              key={action.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => markAlertResolved(alert.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: theme.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                marginRight: '0.5rem'
                              }}
                            >
                              {action.title}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {alerts.filter(a => a.status === 'activa').length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: theme.textSecondary
                }}>
                  <CheckCircle size={32} color={theme.success} style={{ marginBottom: '0.5rem' }} />
                  <p style={{
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    No hay alertas activas
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Progress Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              padding: '1.5rem',
              backgroundColor: theme.surface,
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`
            }}
          >
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              margin: '0 0 1rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Evolución y Progreso
            </h3>
            
            {progress && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Overall Progress Circle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '120px',
                    height: '120px'
                  }}>
                    <svg
                      width="120"
                      height="120"
                      style={{ transform: 'rotate(-90deg)' }}
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke={theme.border}
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke={theme.success}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                        animate={{ 
                          strokeDashoffset: 2 * Math.PI * 50 * (1 - progress.overallProgress / 100)
                        }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: theme.success,
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {progress.overallProgress}%
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: theme.textSecondary
                      }}>
                        Completado
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: theme.text
                      }}>
                        Tareas Completadas
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: theme.warning
                      }}>
                        {progress.tasksProgress.completed}/{progress.tasksProgress.total}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: theme.border,
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.tasksProgress.completionRate}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          backgroundColor: theme.warning,
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: theme.text
                      }}>
                        Adherencia General
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: getAdherenceColor(progress.adherenceMetrics.overall)
                      }}>
                        {progress.adherenceMetrics.overall}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: theme.border,
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.adherenceMetrics.overall}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          backgroundColor: getAdherenceColor(progress.adherenceMetrics.overall),
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Weekly Progress */}
                {progress.weeklyProgress.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h5 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      margin: '0 0 0.5rem 0',
                      color: theme.text
                    }}>
                      Progreso Semanal
                    </h5>
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: theme.background,
                      borderRadius: '0.5rem',
                      border: `1px solid ${theme.border}`
                    }}>
                      {progress.weeklyProgress.slice(-1).map((week) => (
                        <div key={week.weekStart.toISOString()}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{
                              fontSize: '0.75rem',
                              color: theme.textSecondary
                            }}>
                              {week.weekStart.toLocaleDateString('es-ES')} - {week.weekEnd.toLocaleDateString('es-ES')}
                            </span>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: theme.success
                            }}>
                              {week.adherenceRate}%
                            </span>
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: theme.text,
                            marginBottom: '0.25rem'
                          }}>
                            Tareas: {week.tasksCompleted}/{week.tasksAssigned}
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              color: theme.textSecondary
                            }}>
                              Estado de ánimo:
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: i < week.mood ? theme.success : theme.border
                                  }}
                                />
                              ))}
                              <span style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: theme.success,
                                marginLeft: '0.25rem'
                              }}>
                                {week.mood}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {progress.milestones.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h5 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      margin: '0 0 0.5rem 0',
                      color: theme.text
                    }}>
                      Logros Recientes
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {progress.milestones.slice(-2).map((milestone) => (
                        <div
                          key={milestone.id}
                          style={{
                            padding: '0.75rem',
                            backgroundColor: `${theme.success}10`,
                            borderRadius: '0.5rem',
                            border: `1px solid ${theme.success}30`
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem'
                          }}>
                            <Award size={14} color={theme.success} />
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: theme.success
                            }}>
                              {milestone.title}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.75rem',
                            color: theme.textSecondary,
                            margin: '0 0 0.25rem 0'
                          }}>
                            {milestone.description}
                          </p>
                          <span style={{
                            fontSize: '0.75rem',
                            color: theme.textSecondary
                          }}>
                            {milestone.achievedDate.toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Materials and Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              padding: '1.5rem',
              backgroundColor: theme.surface,
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Materiales de Apoyo
              </h3>
              <span style={{
                padding: '0.5rem 1rem',
                backgroundColor: `${theme.info}20`,
                color: theme.info,
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                {materials.length} recursos
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {materials.slice(0, 3).map((material) => (
                <motion.div
                  key={material.id}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    padding: '1rem',
                    backgroundColor: theme.background,
                    borderRadius: '0.5rem',
                    border: `1px solid ${theme.border}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: material.isRecommended ? `${theme.warning}20` : `${theme.info}20`
                    }}>
                      <BookOpen size={16} color={material.isRecommended ? theme.warning : theme.info} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <h5 style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          margin: 0,
                          color: theme.text
                        }}>
                          {material.title}
                        </h5>
                        {material.isRecommended && (
                          <Star size={12} color={theme.warning} fill={theme.warning} />
                        )}
                      </div>
                      
                      <p style={{
                        fontSize: '0.75rem',
                        color: theme.textSecondary,
                        margin: '0 0 0.5rem 0',
                        lineHeight: 1.4
                      }}>
                        {material.description}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.75rem',
                        color: theme.textSecondary
                      }}>
                        <span>{material.type}</span>
                        <span>{material.difficulty}</span>
                        {material.duration && <span>{material.duration} min</span>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={10} color={theme.warning} fill={theme.warning} />
                          <span>{material.rating}</span>
                        </div>
                      </div>
                      
                      {material.isCompleted && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          marginTop: '0.5rem'
                        }}>
                          <CheckCircle size={12} color={theme.success} />
                          <span style={{
                            fontSize: '0.75rem',
                            color: theme.success,
                            fontWeight: 500
                          }}>
                            Completado
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: theme.textSecondary
                    }}>
                      <Eye size={12} />
                      <span>{material.accessCount}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {materials.length > 3 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'transparent',
                    color: theme.primary,
                    border: `1px solid ${theme.primary}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Ver todos los materiales
                  <ChevronRight size={14} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Therapist Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              padding: '1.5rem',
              backgroundColor: theme.surface,
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Mensajes del Terapeuta
              </h3>
              {therapistNotes.filter(n => !n.readAt).length > 0 && (
                <span style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: theme.primary,
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {therapistNotes.filter(n => !n.readAt).length} nuevos
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {therapistNotes.slice(0, 3).map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    padding: '1rem',
                    backgroundColor: note.readAt ? theme.background : `${theme.primary}10`,
                    borderRadius: '0.5rem',
                    border: `1px solid ${note.readAt ? theme.border : theme.primary}30`,
                    cursor: 'pointer'
                  }}
                  onClick={() => !note.readAt && markNoteRead(note.id)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      backgroundColor: note.priority === 'urgente' ? `${theme.error}20` : 
                                     note.priority === 'importante' ? `${theme.warning}20` : `${theme.info}20`,
                      marginTop: '0.125rem'
                    }}>
                      <MessageSquare size={12} color={
                        note.priority === 'urgente' ? theme.error : 
                        note.priority === 'importante' ? theme.warning : theme.info
                      } />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <h5 style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          margin: 0,
                          color: theme.text
                        }}>
                          {note.title}
                        </h5>
                        {!note.readAt && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: theme.primary
                          }} />
                        )}
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: theme.textSecondary,
                        margin: '0 0 0.5rem 0',
                        lineHeight: 1.4
                      }}>
                        {note.content}
                      </p>
                      <span style={{
                        fontSize: '0.75rem',
                        color: theme.textSecondary
                      }}>
                        {note.createdAt.toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {therapistNotes.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: theme.textSecondary
                }}>
                  <MessageSquare size={32} color={theme.textSecondary} style={{ marginBottom: '0.5rem' }} />
                  <p style={{
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    No hay mensajes del terapeuta
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Export Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{
              padding: '1.5rem',
              backgroundColor: theme.surface,
              borderRadius: '1rem',
              border: `1px solid ${theme.border}`
            }}
          >
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              margin: '0 0 1rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Exportación Personal
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowExportModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <Download size={16} />
                Descargar plan en PDF
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  color: theme.primary,
                  border: `1px solid ${theme.primary}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <Share2 size={16} />
                Enviar a correo registrado
              </motion.button>
            </div>
            
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: `${theme.info}10`,
              borderRadius: '0.5rem',
              border: `1px solid ${theme.info}30`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={14} color={theme.info} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: theme.info
                }}>
                  Información de Privacidad
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: theme.textSecondary,
                margin: '0.25rem 0 0 0',
                lineHeight: 1.4
              }}>
                Tus datos están protegidos con cifrado de extremo a extremo. Solo tú y tu terapeuta tienen acceso a esta información.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Task Completion Modal */}
      <TaskCompletionModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTaskId(null);
        }}
        onComplete={handleTaskCompletion}
        taskTitle={selectedTaskId ? tasks.find(t => t.id === selectedTaskId)?.title || '' : ''}
        loading={loadingTasks}
      />

      {/* Export Modal */}
      <ExportTreatmentModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        loading={false}
      />

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
