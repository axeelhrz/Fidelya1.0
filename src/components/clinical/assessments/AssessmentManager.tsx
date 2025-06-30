'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  User,
  Award,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Target,
  Brain,
  Activity,
  Heart,
  X
} from 'lucide-react';

// Add the correct import for Patient type
import type { Patient } from '../../../types/patient'; // Adjust the path as needed
import type { Assessment, AssessmentTemplate } from '../../../types/assessment'; // Adjust the path as needed

interface AssessmentManagerProps {
  patient: Patient;
  assessments: Assessment[];
  templates: AssessmentTemplate[];
  onCreateAssessment: (templateId: string) => void;
  onViewAssessment: (assessment: Assessment) => void;
  onEditAssessment: (assessment: Assessment) => void;
  onDeleteAssessment: (assessmentId: string) => void;
}

export function AssessmentManager({
  patient,
  assessments,
  onCreateAssessment,
  onViewAssessment,
  onEditAssessment,
  onDeleteAssessment
}: AssessmentManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const assessmentCategories = [
    { id: 'anxiety', label: 'Ansiedad', color: '#F59E0B', icon: AlertTriangle },
    { id: 'depression', label: 'Depresión', color: '#6366F1', icon: Heart },
    { id: 'cognitive', label: 'Cognitivo', color: '#8B5CF6', icon: Brain },
    { id: 'personality', label: 'Personalidad', color: '#EC4899', icon: User },
    { id: 'behavioral', label: 'Conductual', color: '#10B981', icon: Activity },
    { id: 'neuropsychological', label: 'Neuropsicológico', color: '#EF4444', icon: Target },
    { id: 'quality-of-life', label: 'Calidad de Vida', color: '#06B6D4', icon: Award }
  ];

  const popularTests = [
    {
      id: 'phq-9',
      name: 'PHQ-9',
      fullName: 'Patient Health Questionnaire-9',
      category: 'depression',
      duration: 5,
      description: 'Cuestionario de detección y seguimiento de depresión',
      items: 9,
      scoring: 'automatic',
      normative: true
    },
    {
      id: 'gad-7',
      name: 'GAD-7',
      fullName: 'Generalized Anxiety Disorder 7-item',
      category: 'anxiety',
      duration: 3,
      description: 'Escala de ansiedad generalizada',
      items: 7,
      scoring: 'automatic',
      normative: true
    },
    {
      id: 'beck-depression',
      name: 'BDI-II',
      fullName: 'Beck Depression Inventory II',
      category: 'depression',
      duration: 10,
      description: 'Inventario de depresión de Beck',
      items: 21,
      scoring: 'automatic',
      normative: true
    },
    {
      id: 'beck-anxiety',
      name: 'BAI',
      fullName: 'Beck Anxiety Inventory',
      category: 'anxiety',
      duration: 8,
      description: 'Inventario de ansiedad de Beck',
      items: 21,
      scoring: 'automatic',
      normative: true
    },
    {
      id: 'mmpi-2',
      name: 'MMPI-2',
      fullName: 'Minnesota Multiphasic Personality Inventory-2',
      category: 'personality',
      duration: 90,
      description: 'Inventario multifásico de personalidad',
      items: 567,
      scoring: 'manual',
      normative: true
    },
    {
      id: 'wais-iv',
      name: 'WAIS-IV',
      fullName: 'Wechsler Adult Intelligence Scale IV',
      category: 'cognitive',
      duration: 120,
      description: 'Escala de inteligencia para adultos',
      items: 15,
      scoring: 'manual',
      normative: true
    }
  ];

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || assessment.category === selectedCategory;
    const matchesTimeframe = selectedTimeframe === 'all' || 
                            (selectedTimeframe === 'recent' && 
                             new Date(assessment.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesCategory && matchesTimeframe;
  });

  const getScoreInterpretation = (score: number, testId: string) => {
    const interpretations: { [key: string]: { ranges: Array<{ min: number; max: number; label: string; color: string }> } } = {
      'phq-9': {
        ranges: [
          { min: 0, max: 4, label: 'Mínima', color: '#10B981' },
          { min: 5, max: 9, label: 'Leve', color: '#F59E0B' },
          { min: 10, max: 14, label: 'Moderada', color: '#EF4444' },
          { min: 15, max: 19, label: 'Moderadamente severa', color: '#DC2626' },
          { min: 20, max: 27, label: 'Severa', color: '#991B1B' }
        ]
      },
      'gad-7': {
        ranges: [
          { min: 0, max: 4, label: 'Mínima', color: '#10B981' },
          { min: 5, max: 9, label: 'Leve', color: '#F59E0B' },
          { min: 10, max: 14, label: 'Moderada', color: '#EF4444' },
          { min: 15, max: 21, label: 'Severa', color: '#DC2626' }
        ]
      }
    };

    const testRanges = interpretations[testId];
    if (!testRanges) return { label: 'No disponible', color: '#6B7280' };

    const range = testRanges.ranges.find(r => score >= r.min && score <= r.max);
    return range || { label: 'Fuera de rango', color: '#6B7280' };
  };

  const calculateTrend = (assessmentName: string) => {
    const sameTestAssessments = assessments
      .filter(a => a.testName === assessmentName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sameTestAssessments.length < 2) return null;

    const latest = sameTestAssessments[sameTestAssessments.length - 1];
    const previous = sameTestAssessments[sameTestAssessments.length - 2];

    const change = latest.score - previous.score;
    const percentChange = Math.abs((change / previous.score) * 100);

    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      change: Math.abs(change),
      percentChange: Math.round(percentChange),
      isImprovement: (assessmentName.includes('depression') || assessmentName.includes('anxiety')) ? change < 0 : change > 0
    };
  };

  const getAssessmentStats = () => {
    const total = assessments.length;
    const recent = assessments.filter(a => 
      new Date(a.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length;
    const pending = assessments.filter(a => a.status === 'pending').length;
    const completed = assessments.filter(a => a.status === 'completed').length;

    return { total, recent, pending, completed };
  };

  const stats = getAssessmentStats();

  return (
    <div style={{
      width: '100%',
      padding: '1.5rem',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1F2937',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Evaluaciones Psicométricas
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            margin: '0.5rem 0 0 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Paciente: {patient.firstName} {patient.lastName}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={assessments.length < 2}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: assessments.length < 2 ? '#9CA3AF' : '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: assessments.length < 2 ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <BarChart3 size={16} />
            Comparar Resultados
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTemplateModal(true)}
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
            Nueva Evaluación
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: 'Total Evaluaciones', value: stats.total, icon: FileText, color: '#6366F1' },
          { label: 'Últimos 30 días', value: stats.recent, icon: Calendar, color: '#10B981' },
          { label: 'Pendientes', value: stats.pending, icon: Clock, color: '#F59E0B' },
          { label: 'Completadas', value: stats.completed, icon: CheckCircle, color: '#059669' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <Icon size={24} color={stat.color} />
                <span style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: stat.color,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {stat.value}
                </span>
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
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
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none'
            }}
            placeholder="Buscar evaluaciones..."
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            backgroundColor: 'white'
          }}
        >
          <option value="all">Todas las categorías</option>
          {assessmentCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            backgroundColor: 'white'
          }}
        >
          <option value="all">Todos los períodos</option>
          <option value="recent">Últimos 30 días</option>
        </select>
      </div>

      {/* Assessments List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {filteredAssessments.map((assessment) => {
          const category = assessmentCategories.find(cat => cat.id === assessment.category);
          const CategoryIcon = category?.icon || FileText;
          const interpretation = getScoreInterpretation(assessment.score, assessment.testName.toLowerCase());
          const trend = calculateTrend(assessment.testName);

          return (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' }}
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}
              onClick={() => onViewAssessment(assessment)}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: `${category?.color}15`,
                      borderRadius: '0.5rem',
                      border: `1px solid ${category?.color}30`
                    }}>
                      <CategoryIcon size={16} color={category?.color} />
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: category?.color,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {category?.label}
                      </span>
                    </div>

                    <div style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: assessment.status === 'completed' ? '#F0FDF4' : '#FEF3C7',
                      borderRadius: '0.25rem',
                      border: `1px solid ${assessment.status === 'completed' ? '#BBF7D0' : '#FDE68A'}`
                    }}>
                      <span style={{
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        color: assessment.status === 'completed' ? '#15803D' : '#92400E',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase'
                      }}>
                        {assessment.status === 'completed' ? 'Completada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: '0 0 0.5rem 0',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {assessment.testName}
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    margin: '0 0 1rem 0',
                    lineHeight: '1.5',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {assessment.notes || 'Sin notas adicionales'}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      <span>{assessment.date.toLocaleDateString('es-ES')}</span>
                    </div>
                    {assessment.duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        <span>{assessment.duration} min</span>
                      </div>
                    )}
                    {assessment.administeredBy && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={12} />
                        <span>{assessment.administeredBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Display */}
                {assessment.status === 'completed' && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      padding: '1rem',
                      backgroundColor: `${interpretation.color}10`,
                      borderRadius: '0.75rem',
                      border: `2px solid ${interpretation.color}30`,
                      textAlign: 'center',
                      minWidth: '120px'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: interpretation.color,
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {assessment.score}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: interpretation.color,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {interpretation.label}
                      </div>
                      {assessment.percentile && (
                        <div style={{
                          fontSize: '0.625rem',
                          color: '#6B7280',
                          marginTop: '0.25rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Percentil {assessment.percentile}
                        </div>
                      )}
                    </div>

                    {/* Trend Indicator */}
                    {trend && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: trend.isImprovement ? '#F0FDF4' : '#FEF2F2',
                        borderRadius: '0.5rem',
                        border: `1px solid ${trend.isImprovement ? '#BBF7D0' : '#FECACA'}`
                      }}>
                        {trend.direction === 'up' ? (
                          <TrendingUp size={14} color={trend.isImprovement ? '#16A34A' : '#DC2626'} />
                        ) : trend.direction === 'down' ? (
                          <TrendingDown size={14} color={trend.isImprovement ? '#16A34A' : '#DC2626'} />
                        ) : (
                          <div style={{
                            width: '14px',
                            height: '2px',
                            backgroundColor: '#6B7280',
                            borderRadius: '1px'
                          }} />
                        )}
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: trend.isImprovement ? '#15803D' : '#991B1B',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {trend.direction === 'stable' ? 'Estable' : 
                           `${trend.isImprovement ? 'Mejora' : 'Empeora'} ${trend.percentChange}%`}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginLeft: '1rem'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewAssessment(assessment);
                    }}
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

                  {assessment.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAssessment(assessment);
                      }}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#F0FDF4',
                        color: '#16A34A',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit size={14} />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAssessment(assessment.id);
                    }}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredAssessments.length === 0 && (
          <div style={{
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            border: '1px dashed #E5E7EB',
            textAlign: 'center'
          }}>
            <FileText size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              No se encontraron evaluaciones
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {searchTerm || selectedCategory !== 'all' || selectedTimeframe !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando una nueva evaluación para este paciente'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTemplateModal(true)}
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
                fontFamily: 'Inter, sans-serif',
                margin: '0 auto'
              }}
            >
              <Plus size={16} />
              Nueva Evaluación
            </motion.button>
          </div>
        )}
      </div>

      {/* Template Selection Modal */}
      <AnimatePresence>
        {showTemplateModal && (
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
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Seleccionar Evaluación
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTemplateModal(false)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#6B7280" />
                </motion.button>
              </div>

              {/* Popular Tests */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Tests Más Utilizados
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {popularTests.map((test) => {
                    const category = assessmentCategories.find(cat => cat.id === test.category);
                    const CategoryIcon = category?.icon || FileText;

                    return (
                      <motion.div
                        key={test.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onCreateAssessment(test.id);
                          setShowTemplateModal(false);
                        }}
                        style={{
                          padding: '1.5rem',
                          backgroundColor: '#F9FAFB',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: `${category?.color}15`,
                            borderRadius: '0.5rem',
                            border: `1px solid ${category?.color}30`
                          }}>
                            <CategoryIcon size={16} color={category?.color} />
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: category?.color,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {category?.label}
                            </span>
                          </div>

                          <div style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: test.scoring === 'automatic' ? '#F0FDF4' : '#FEF3C7',
                            borderRadius: '0.25rem',
                            border: `1px solid ${test.scoring === 'automatic' ? '#BBF7D0' : '#FDE68A'}`
                          }}>
                            <span style={{
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              color: test.scoring === 'automatic' ? '#15803D' : '#92400E',
                              fontFamily: 'Inter, sans-serif',
                              textTransform: 'uppercase'
                            }}>
                              {test.scoring === 'automatic' ? 'Auto' : 'Manual'}
                            </span>
                          </div>
                        </div>

                        <h5 style={{
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: '#1F2937',
                          margin: '0 0 0.25rem 0',
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}>
                          {test.name}
                        </h5>

                        <p style={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          margin: '0 0 0.5rem 0',
                          fontWeight: 500,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {test.fullName}
                        </p>

                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          margin: '0 0 1rem 0',
                          lineHeight: '1.4',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {test.description}
                        </p>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} />
                            <span>{test.duration} min</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FileText size={12} />
                            <span>{test.items} ítems</span>
                          </div>
                          {test.normative && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <BarChart3 size={12} />
                              <span>Normativo</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Explorar por Categoría
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {assessmentCategories.map((category) => {
                    const CategoryIcon = category.icon;
                    const testsInCategory = popularTests.filter(test => test.category === category.id);

                    return (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '1rem',
                          backgroundColor: `${category.color}10`,
                          border: `1px solid ${category.color}30`,
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <CategoryIcon size={24} color={category.color} style={{ margin: '0 auto 0.5rem' }} />
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: category.color,
                          marginBottom: '0.25rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {category.label}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {testsInCategory.length} tests disponibles
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
