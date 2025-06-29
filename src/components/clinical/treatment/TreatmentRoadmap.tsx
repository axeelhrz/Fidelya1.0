'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle,
  Clock,
  Flag,
  TrendingUp,
  Calendar,
  Award,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Activity,
  User,
  Lightbulb
} from 'lucide-react';
import { TreatmentPlan, TreatmentGoal } from '@/types/clinical';

interface TreatmentRoadmapProps {
  plan: TreatmentPlan;
  onGoalClick?: (goal: TreatmentGoal) => void;
}

export function TreatmentRoadmap({ plan, onGoalClick }: TreatmentRoadmapProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);

  const goalCategories = [
    { id: 'behavioral', label: 'Conductual', color: '#10B981', icon: Activity },
    { id: 'emotional', label: 'Emocional', color: '#F59E0B', icon: Target },
    { id: 'cognitive', label: 'Cognitivo', color: '#6366F1', icon: Lightbulb },
    { id: 'social', label: 'Social', color: '#EC4899', icon: User },
    { id: 'functional', label: 'Funcional', color: '#8B5CF6', icon: Award }
  ];

  const getTimelineData = () => {
    const now = new Date();
    const timeframes = {
      week: { unit: 'semana', count: 12, multiplier: 7 },
      month: { unit: 'mes', count: 6, multiplier: 30 },
      quarter: { unit: 'trimestre', count: 4, multiplier: 90 }
    };

    const { unit, count, multiplier } = timeframes[selectedTimeframe];
    const periods = [];

    for (let i = 0; i < count; i++) {
      const startDate = new Date(now.getTime() + (i * multiplier * 24 * 60 * 60 * 1000));
      const endDate = new Date(now.getTime() + ((i + 1) * multiplier * 24 * 60 * 60 * 1000));
      
      const goalsInPeriod = plan.goals?.filter(goal => {
        if (!goal.targetDate) return false;
        return goal.targetDate >= startDate && goal.targetDate <= endDate;
      }) || [];

      const milestonesInPeriod = plan.goals?.flatMap(goal => 
        goal.milestones?.filter(milestone => 
          milestone.targetDate && 
          milestone.targetDate >= startDate && 
          milestone.targetDate <= endDate
        ) || []
      ) || [];

      periods.push({
        id: i,
        label: `${unit.charAt(0).toUpperCase() + unit.slice(1)} ${i + 1}`,
        startDate,
        endDate,
        goals: goalsInPeriod,
        milestones: milestonesInPeriod,
        isCurrentPeriod: now >= startDate && now <= endDate
      });
    }

    return periods;
  };

  const getGoalStatusColor = (goal: TreatmentGoal) => {
    if (goal.status === 'completed') return '#10B981';
    if (goal.status === 'paused') return '#F59E0B';
    if (goal.targetDate && new Date(goal.targetDate) < new Date()) return '#EF4444';
    return '#6366F1';
  };

  const calculateOverallProgress = () => {
    if (!plan.goals || plan.goals.length === 0) return 0;
    const totalProgress = plan.goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
    return Math.round(totalProgress / plan.goals.length);
  };

  const timelineData = getTimelineData();
  const overallProgress = calculateOverallProgress();

  return (
    <div style={{
      width: '100%',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
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
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Roadmap de Tratamiento
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: '0.25rem 0 0 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Progreso general: {overallProgress}% • {plan.goals?.length || 0} objetivos activos
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['week', 'month', 'quarter'] as const).map((timeframe) => (
            <motion.button
              key={timeframe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTimeframe(timeframe)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedTimeframe === timeframe ? '#EEF2FF' : 'white',
                color: selectedTimeframe === timeframe ? '#4338CA' : '#6B7280',
                border: `1px solid ${selectedTimeframe === timeframe ? '#C7D2FE' : '#E5E7EB'}`,
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {timeframe === 'week' ? 'Semanal' : timeframe === 'month' ? 'Mensual' : 'Trimestral'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#F9FAFB',
        borderRadius: '0.75rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            fontFamily: 'Inter, sans-serif'
          }}>
            Progreso General del Plan
          </span>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: overallProgress >= 75 ? '#10B981' : overallProgress >= 50 ? '#F59E0B' : '#EF4444',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {overallProgress}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#E5E7EB',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${overallProgress >= 75 ? '#10B981' : overallProgress >= 50 ? '#F59E0B' : '#EF4444'}, ${overallProgress >= 75 ? '#059669' : overallProgress >= 50 ? '#D97706' : '#DC2626'})`,
              borderRadius: '6px'
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        position: 'relative',
        paddingLeft: '2rem'
      }}>
        {/* Timeline Line */}
        <div style={{
          position: 'absolute',
          left: '1rem',
          top: '2rem',
          bottom: '2rem',
          width: '2px',
          backgroundColor: '#E5E7EB'
        }} />

        {/* Timeline Periods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {timelineData.map((period, index) => (
            <motion.div
              key={period.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                position: 'relative',
                paddingLeft: '2rem'
              }}
            >
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-0.5rem',
                top: '0.5rem',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                backgroundColor: period.isCurrentPeriod ? '#6366F1' : period.goals.length > 0 ? '#10B981' : '#E5E7EB',
                border: '2px solid white',
                boxShadow: '0 0 0 2px #E5E7EB'
              }} />

              {/* Period Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: period.isCurrentPeriod ? '#6366F1' : '#1F2937',
                    margin: 0,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {period.label}
                  </h4>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    margin: '0.25rem 0 0 0',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {period.startDate.toLocaleDateString('es-ES')} - {period.endDate.toLocaleDateString('es-ES')}
                  </p>
                </div>

                {period.isCurrentPeriod && (
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Período Actual
                  </div>
                )}
              </div>

              {/* Goals in Period */}
              {period.goals.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {period.goals.map((goal) => {
                    const category = goalCategories.find(cat => cat.id === goal.category);
                    const CategoryIcon = category?.icon || Target;
                    const isHovered = hoveredGoal === goal.id;

                    return (
                      <motion.div
                        key={goal.id}
                        whileHover={{ scale: 1.02, x: 5 }}
                        onHoverStart={() => setHoveredGoal(goal.id || null)}
                        onHoverEnd={() => setHoveredGoal(null)}
                        onClick={() => onGoalClick?.(goal)}
                        style={{
                          padding: '1rem',
                          backgroundColor: isHovered ? `${category?.color}10` : 'white',
                          border: `1px solid ${isHovered ? category?.color + '40' : '#E5E7EB'}`,
                          borderRadius: '0.75rem',
                          cursor: onGoalClick ? 'pointer' : 'default',
                          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.75rem'
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
                            <CategoryIcon size={14} color={category?.color} />
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
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getGoalStatusColor(goal)
                          }} />
                        </div>

                        <h5 style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#1F2937',
                          margin: '0 0 0.5rem 0',
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}>
                          {goal.title}
                        </h5>

                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6B7280',
                          margin: '0 0 1rem 0',
                          lineHeight: '1.4',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {goal.description}
                        </p>

                        {/* Progress Bar */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.25rem'
                            }}>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#374151',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Progreso
                              </span>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: category?.color,
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                {goal.progress}%
                              </span>
                            </div>
                            <div style={{
                              width: '100%',
                              height: '6px',
                              backgroundColor: '#F3F4F6',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                style={{
                                  height: '100%',
                                  backgroundColor: category?.color,
                                  borderRadius: '3px'
                                }}
                              />
                            </div>
                          </div>

                          {goal.targetDate && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              <Calendar size={12} />
                              <span>{goal.targetDate.toLocaleDateString('es-ES')}</span>
                            </div>
                          )}
                        </div>

                        {/* Milestones */}
                        {goal.milestones && goal.milestones.length > 0 && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '0.5rem',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              Hitos ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {goal.milestones.slice(0, 3).map((milestone, mIndex) => (
                                <div key={mIndex} style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: milestone.completed ? '#F0FDF4' : '#F9FAFB',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.625rem',
                                  color: milestone.completed ? '#16A34A' : '#6B7280',
                                  fontFamily: 'Inter, sans-serif'
                                }}>
                                  {milestone.completed ? (
                                    <CheckCircle size={10} color="#16A34A" />
                                  ) : (
                                    <Clock size={10} color="#6B7280" />
                                  )}
                                  <span>{milestone.title}</span>
                                </div>
                              ))}
                              {goal.milestones.length > 3 && (
                                <div style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#F3F4F6',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.625rem',
                                  color: '#6B7280',
                                  fontFamily: 'Inter, sans-serif'
                                }}>
                                  +{goal.milestones.length - 3} más
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Milestones in Period */}
              {period.milestones.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.75rem'
                }}>
                  {period.milestones.map((milestone, mIndex) => (
                    <motion.div
                      key={mIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index * 0.1) + (mIndex * 0.05) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: milestone.completed ? '#F0FDF4' : '#FEF3C7',
                        borderRadius: '0.5rem',
                        border: `1px solid ${milestone.completed ? '#BBF7D0' : '#FDE68A'}`,
                        fontSize: '0.75rem',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <Flag size={12} color={milestone.completed ? '#16A34A' : '#F59E0B'} />
                      <span style={{
                        color: milestone.completed ? '#15803D' : '#92400E',
                        fontWeight: 600
                      }}>
                        {milestone.title}
                      </span>
                      {milestone.targetDate && (
                        <span style={{
                          color: milestone.completed ? '#16A34A' : '#78350F',
                          fontSize: '0.625rem'
                        }}>
                          ({milestone.targetDate.toLocaleDateString('es-ES')})
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty Period */}
              {period.goals.length === 0 && period.milestones.length === 0 && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.5rem',
                  border: '1px dashed #E5E7EB',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    No hay objetivos programados para este período
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#F9FAFB',
        borderRadius: '0.75rem'
      }}>
        <h4 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '0.75rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Leyenda
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem'
        }}>
          {goalCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <CategoryIcon size={14} color={category.color} />
                <span style={{ color: '#374151' }}>{category.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
