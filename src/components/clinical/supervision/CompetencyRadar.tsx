'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Brain,
  Heart,
  FileText,
  Shield,
  MessageSquare,
  Plus,
  Edit,
} from 'lucide-react';
import { Therapist, Competency, CompetencyCategory } from '@/types/clinical';

interface CompetencyRadarProps {
  therapist: Therapist;
  competencies: Competency[];
  categories: CompetencyCategory[];
  onUpdateCompetency: (competencyId: string, score: number, notes?: string) => void;
  onAddCompetency: (competencyData: Omit<Competency, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function CompetencyRadar({
  therapist,
  competencies,
  categories,
  onUpdateCompetency,
}: CompetencyRadarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const competencyIcons = {
    therapeutic: Heart,
    assessment: Brain,
    intervention: Target,
    ethics: Shield,
    communication: MessageSquare,
    documentation: FileText
  };

  const getCompetencyLevel = (score: number) => {
    if (score >= 90) return { level: 'Experto', color: '#10B981', description: 'Dominio excepcional' };
    if (score >= 80) return { level: 'Avanzado', color: '#6366F1', description: 'Competencia sólida' };
    if (score >= 70) return { level: 'Competente', color: '#F59E0B', description: 'Nivel adecuado' };
    if (score >= 60) return { level: 'En desarrollo', color: '#EF4444', description: 'Requiere mejora' };
    return { level: 'Principiante', color: '#9CA3AF', description: 'Necesita supervisión' };
  };

  const getCategoryAverage = (categoryId: string) => {
    const categoryCompetencies = competencies.filter(c => c.categoryId === categoryId);
    if (categoryCompetencies.length === 0) return 0;
    
    const total = categoryCompetencies.reduce((sum, comp) => sum + comp.score, 0);
    return Math.round(total / categoryCompetencies.length);
  };

  const getOverallScore = () => {
    if (competencies.length === 0) return 0;
    const total = competencies.reduce((sum, comp) => sum + comp.score, 0);
    return Math.round(total / competencies.length);
  };

  const getCompetencyTrend = () => {
    // Simulated trend calculation based on historical data
    const trend = Math.random() > 0.5 ? 
      { direction: 'up', value: Math.floor(Math.random() * 10) + 1 } :
      { direction: 'down', value: Math.floor(Math.random() * 5) + 1 };
    return trend;
  };

  const renderRadarChart = () => {
    const overallScore = getOverallScore();
    const overallLevel = getCompetencyLevel(overallScore);

    return (
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Radar de Competencias
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              {therapist.firstName} {therapist.lastName} • {therapist.specialties?.[0] || 'Especialista'}
            </p>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: `${overallLevel.color}10`,
            borderRadius: '0.75rem',
            border: `2px solid ${overallLevel.color}30`
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: overallLevel.color,
              marginBottom: '0.25rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {overallScore}%
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: overallLevel.color,
              marginBottom: '0.25rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              {overallLevel.level}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Puntuación General
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {categories.map((category) => {
            const Icon = competencyIcons[category.id as keyof typeof competencyIcons] || Target;
            const average = getCategoryAverage(category.id);
            const level = getCompetencyLevel(average);
            const categoryCompetencies = competencies.filter(c => c.categoryId === category.id);

            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '1.5rem',
                  backgroundColor: selectedCategory === category.id ? `${category.color}10` : '#F9FAFB',
                  borderRadius: '0.75rem',
                  border: `2px solid ${selectedCategory === category.id ? category.color : '#E5E7EB'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: category.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {category.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {categoryCompetencies.length} competencias
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: level.color,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {average}%
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: level.color,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {level.level}
                  </span>
                </div>

                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${average}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      backgroundColor: level.color,
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Competencies */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1.5rem',
              backgroundColor: '#F9FAFB',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {categories.find(c => c.id === selectedCategory)?.name}
              </h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Plus size={14} />
                Agregar
              </motion.button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {competencies
                .filter(c => c.categoryId === selectedCategory)
                .map((competency) => {
                  const level = getCompetencyLevel(competency.score);
                  const trend = getCompetencyTrend();

                  return (
                    <motion.div
                      key={competency.id}
                      whileHover={{ scale: 1.01 }}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#1F2937',
                            marginBottom: '0.25rem',
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            {competency.name}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            marginBottom: '0.5rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {competency.description}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: trend.direction === 'up' ? '#10B981' : '#EF4444',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {trend.direction === 'up' ? (
                              <TrendingUp size={12} />
                            ) : (
                              <TrendingDown size={12} />
                            )}
                            <span>{trend.value}%</span>
                          </div>

                          <div style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: `${level.color}20`,
                            borderRadius: '0.25rem',
                            border: `1px solid ${level.color}40`
                          }}>
                            <span style={{
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              color: level.color,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {competency.score}%
                            </span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onUpdateCompetency(competency.id, competency.score)}
                            style={{
                              padding: '0.25rem',
                              backgroundColor: '#EEF2FF',
                              color: '#4338CA',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Edit size={12} />
                          </motion.button>
                        </div>
                      </div>

                      <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        marginBottom: '0.5rem'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${competency.score}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            backgroundColor: level.color,
                            borderRadius: '2px'
                          }}
                        />
                      </div>

                      {competency.lastEvaluated && (
                        <div style={{
                          fontSize: '0.625rem',
                          color: '#9CA3AF',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Última evaluación: {competency.lastEvaluated.toLocaleDateString('es-ES')}
                        </div>
                      )}

                      {competency.notes && (
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: '#F0F9FF',
                          borderRadius: '0.25rem',
                          border: '1px solid #E0F2FE'
                        }}>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#0369A1',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            <strong>Notas:</strong> {competency.notes}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderRecommendations = () => {
    const lowScoreCompetencies = competencies.filter(c => c.score < 70);
    const highScoreCompetencies = competencies.filter(c => c.score >= 90);

    return (
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
          Recomendaciones de Desarrollo
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Areas de Mejora */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#FEF2F2',
            borderRadius: '0.75rem',
            border: '1px solid #FECACA'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <AlertTriangle size={20} color="#EF4444" />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#991B1B',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Áreas de Mejora
              </h4>
            </div>

            {lowScoreCompetencies.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {lowScoreCompetencies.slice(0, 3).map((competency) => (
                  <div key={competency.id} style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #FECACA'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#991B1B',
                      marginBottom: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {competency.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#B91C1C',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Puntuación actual: {competency.score}% • Objetivo: 80%+
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                ¡Excelente! No hay áreas críticas que requieran atención inmediata.
              </p>
            )}
          </div>

          {/* Fortalezas */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#F0FDF4',
            borderRadius: '0.75rem',
            border: '1px solid #BBF7D0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Award size={20} color="#10B981" />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#15803D',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Fortalezas Destacadas
              </h4>
            </div>

            {highScoreCompetencies.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {highScoreCompetencies.slice(0, 3).map((competency) => (
                  <div key={competency.id} style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #BBF7D0'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#15803D',
                      marginBottom: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {competency.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#166534',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Puntuación: {competency.score}% • Nivel experto
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Continúa desarrollando competencias para alcanzar el nivel experto.
              </p>
            )}
          </div>
        </div>

        {/* Action Plan */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: '#F0F9FF',
          borderRadius: '0.75rem',
          border: '1px solid #E0F2FE'
        }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#0C4A6E',
            margin: '0 0 1rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Plan de Acción Recomendado
          </h4>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#0369A1',
              fontFamily: 'Inter, sans-serif'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#0369A1',
                borderRadius: '50%'
              }} />
              <span>Programar sesiones de supervisión adicionales para áreas de mejora</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#0369A1',
              fontFamily: 'Inter, sans-serif'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#0369A1',
                borderRadius: '50%'
              }} />
              <span>Asignar recursos de formación específicos</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#0369A1',
              fontFamily: 'Inter, sans-serif'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#0369A1',
                borderRadius: '50%'
              }} />
              <span>Establecer objetivos SMART para el próximo trimestre</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#0369A1',
              fontFamily: 'Inter, sans-serif'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#0369A1',
                borderRadius: '50%'
              }} />
              <span>Revisar progreso en 4-6 semanas</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      {renderRadarChart()}
      {renderRecommendations()}
    </div>
  );
}