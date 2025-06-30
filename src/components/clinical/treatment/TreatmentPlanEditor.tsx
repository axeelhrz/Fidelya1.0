'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Save,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Activity,
  Award,
  BarChart3,
  Lightbulb,
  X,
  Download,
} from 'lucide-react';
import { TreatmentPlan, TreatmentGoal, Patient, TreatmentTask, AdherenceMetrics } from '@/types/clinical';

interface TreatmentPlanEditorProps {
  patient: Patient;
  plan?: TreatmentPlan;
  onSave: (planData: Partial<TreatmentPlan>) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

export function TreatmentPlanEditor({
  patient,
  plan,
  onSave,
  onCancel,
  mode
}: TreatmentPlanEditorProps) {
  const [planData, setPlanData] = useState<Partial<TreatmentPlan>>({
    patientId: patient.id,
    title: '',
    description: '',
    goals: [],
    tasks: [],
    startDate: new Date(),
    reviewDate: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 semanas
    status: 'active',
    adherenceRate: 0,
    progressNotes: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [activeGoalIndex, setActiveGoalIndex] = useState<number | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Partial<TreatmentGoal>>({});
  const [currentTask, setCurrentTask] = useState<Partial<TreatmentTask>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [adherenceMetrics, setAdherenceMetrics] = useState<AdherenceMetrics | null>(null);

  const goalCategories = [
    { id: 'behavioral', label: 'Conductual', color: '#10B981', icon: Activity },
    { id: 'emotional', label: 'Emocional', color: '#F59E0B', icon: Target },
    { id: 'cognitive', label: 'Cognitivo', color: '#6366F1', icon: Lightbulb },
    { id: 'social', label: 'Social', color: '#EC4899', icon: User },
    { id: 'functional', label: 'Funcional', color: '#8B5CF6', icon: Award }
  ];

  const taskTypes = [
    { id: 'homework', label: 'Tarea para Casa', icon: FileText },
    { id: 'exercise', label: 'Ejercicio Terapéutico', icon: Activity },
    { id: 'reading', label: 'Lectura/Psicoeducación', icon: FileText },
    { id: 'practice', label: 'Práctica de Habilidades', icon: Target },
    { id: 'monitoring', label: 'Automonitoreo', icon: BarChart3 },
    { id: 'reflection', label: 'Reflexión/Diario', icon: Edit }
  ];

  useEffect(() => {
    if (plan) {
      setPlanData(plan);
      calculateAdherenceMetrics(plan);
    }
  }, [plan]);

  const calculateAdherenceMetrics = (planData: TreatmentPlan) => {
    const totalTasks = planData.tasks?.length || 0;
    const completedTasks = planData.tasks?.filter(task => task.completed).length || 0;
    const overdueTasks = planData.tasks?.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length || 0;

    const adherenceRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const metrics: AdherenceMetrics = {
      adherenceRate,
      totalTasks,
      completedTasks,
      overdueTasks,
      weeklyProgress: calculateWeeklyProgress(planData.tasks || []),
      goalProgress: calculateGoalProgress(planData.goals || [])
    };

    setAdherenceMetrics(metrics);
    setPlanData(prev => ({ ...prev, adherenceRate }));
  };

  const calculateWeeklyProgress = (tasks: TreatmentTask[]) => {
    // Simulación de progreso semanal
    return [
      { week: 1, completed: 3, total: 5 },
      { week: 2, completed: 4, total: 5 },
      { week: 3, completed: 2, total: 4 },
      { week: 4, completed: 5, total: 6 }
    ];
  };

  const calculateGoalProgress = (goals: TreatmentGoal[]) => {
    return goals.map(goal => ({
      goalId: goal.id || '',
      progress: goal.progress || 0,
      milestones: goal.milestones?.filter(m => m.completed).length || 0,
      totalMilestones: goal.milestones?.length || 0
    }));
  };

  const addGoal = () => {
    setCurrentGoal({
      title: '',
      description: '',
      category: 'behavioral',
      priority: 'medium',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      progress: 0,
      milestones: [],
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      status: 'active'
    });
    setShowGoalModal(true);
  };

  const editGoal = (index: number) => {
    setCurrentGoal(planData.goals?.[index] || {});
    setActiveGoalIndex(index);
    setShowGoalModal(true);
  };

  const saveGoal = () => {
    const updatedGoals = [...(planData.goals || [])];
    
    if (activeGoalIndex !== null) {
      updatedGoals[activeGoalIndex] = currentGoal as TreatmentGoal;
    } else {
      updatedGoals.push({
        ...currentGoal,
        id: Date.now().toString(),
        createdAt: new Date()
      } as TreatmentGoal);
    }

    setPlanData(prev => ({ ...prev, goals: updatedGoals }));
    setShowGoalModal(false);
    setActiveGoalIndex(null);
    setCurrentGoal({});
  };

  const deleteGoal = (index: number) => {
    const updatedGoals = planData.goals?.filter((_, i) => i !== index) || [];
    setPlanData(prev => ({ ...prev, goals: updatedGoals }));
  };

  const addTask = () => {
    setCurrentTask({
      title: '',
      description: '',
      type: 'homework',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      completed: false,
      estimatedDuration: 30,
      instructions: '',
      resources: []
    });
    setShowTaskModal(true);
  };

  const saveTask = () => {
    const updatedTasks = [...(planData.tasks || [])];
    updatedTasks.push({
      ...currentTask,
      id: Date.now().toString(),
      createdAt: new Date()
    } as TreatmentTask);

    setPlanData(prev => ({ ...prev, tasks: updatedTasks }));
    setShowTaskModal(false);
    setCurrentTask({});
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = planData.tasks?.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : undefined }
        : task
    ) || [];

    setPlanData(prev => ({ ...prev, tasks: updatedTasks }));
    calculateAdherenceMetrics({ ...planData, tasks: updatedTasks } as TreatmentPlan);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(planData);
    } catch (error) {
      console.error('Error saving treatment plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 85) return '#10B981';
    if (rate >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{
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
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '1400px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {mode === 'create' ? 'Nuevo Plan de Tratamiento' : mode === 'edit' ? 'Editar Plan' : 'Ver Plan'}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Paciente: {patient.firstName} {patient.lastName}
            </p>
          </div>

          {adherenceMetrics && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB'
              }}>
                <BarChart3 size={20} color={getAdherenceColor(adherenceMetrics.adherenceRate)} />
                <div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: getAdherenceColor(adherenceMetrics.adherenceRate),
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {Math.round(adherenceMetrics.adherenceRate)}%
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Adherencia
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCancel}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#6B7280" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* Main Content */}
          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            {/* Plan Info */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
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
                    Título del Plan *
                  </label>
                  <input
                    type="text"
                    value={planData.title || ''}
                    onChange={(e) => setPlanData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={mode === 'view'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      backgroundColor: mode === 'view' ? '#F9FAFB' : 'white'
                    }}
                    placeholder="Ej: Plan de Tratamiento para Ansiedad Generalizada"
                  />
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
                    Fecha de Revisión
                  </label>
                  <input
                    type="date"
                    value={planData.reviewDate ? planData.reviewDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setPlanData(prev => ({ ...prev, reviewDate: new Date(e.target.value) }))}
                    disabled={mode === 'view'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      backgroundColor: mode === 'view' ? '#F9FAFB' : 'white'
                    }}
                  />
                </div>
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
                  Descripción General
                </label>
                <textarea
                  value={planData.description || ''}
                  onChange={(e) => setPlanData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={mode === 'view'}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    resize: 'vertical',
                    backgroundColor: mode === 'view' ? '#F9FAFB' : 'white'
                  }}
                  placeholder="Descripción general del plan de tratamiento, objetivos principales y enfoque terapéutico..."
                />
              </div>
            </div>

            {/* Goals Section */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Objetivos SMART
                </h3>
                {mode !== 'view' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addGoal}
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
                    Agregar Objetivo
                  </motion.button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {planData.goals?.map((goal, index) => {
                  const category = goalCategories.find(cat => cat.id === goal.category);
                  const CategoryIcon = category?.icon || Target;

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
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
                              backgroundColor: getPriorityColor(goal.priority) + '15',
                              borderRadius: '0.25rem',
                              border: `1px solid ${getPriorityColor(goal.priority)}30`
                            }}>
                              <span style={{
                                fontSize: '0.625rem',
                                fontWeight: 600,
                                color: getPriorityColor(goal.priority),
                                fontFamily: 'Inter, sans-serif',
                                textTransform: 'uppercase'
                              }}>
                                {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Media' : 'Baja'}
                              </span>
                            </div>
                          </div>

                          <h4 style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#1F2937',
                            margin: '0 0 0.5rem 0',
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            {goal.title}
                          </h4>

                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                            margin: '0 0 1rem 0',
                            lineHeight: '1.5',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {goal.description}
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
                              height: '8px',
                              backgroundColor: '#F3F4F6',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{
                                  height: '100%',
                                  backgroundColor: category?.color,
                                  borderRadius: '4px'
                                }}
                              />
                            </div>
                          </div>

                          {/* Milestones */}
                          {goal.milestones && goal.milestones.length > 0 && (
                            <div>
                              <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#374151',
                                marginBottom: '0.5rem',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Hitos ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {goal.milestones.map((milestone, mIndex) => (
                                  <div key={mIndex} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.75rem',
                                    color: milestone.completed ? '#10B981' : '#6B7280',
                                    fontFamily: 'Inter, sans-serif'
                                  }}>
                                    {milestone.completed ? (
                                      <CheckCircle size={14} color="#10B981" />
                                    ) : (
                                      <div style={{
                                        width: '14px',
                                        height: '14px',
                                        border: '2px solid #E5E7EB',
                                        borderRadius: '50%'
                                      }} />
                                    )}
                                    <span style={{
                                      textDecoration: milestone.completed ? 'line-through' : 'none'
                                    }}>
                                      {milestone.title}
                                    </span>
                                    {milestone.targetDate && (
                                      <span style={{ color: '#9CA3AF', fontSize: '0.625rem' }}>
                                        ({milestone.targetDate.toLocaleDateString('es-ES')})
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {mode !== 'view' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => editGoal(index)}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: '#EEF2FF',
                                color: '#4338CA',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                              }}
                            >
                              <Edit size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteGoal(index)}
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
                        )}
                      </div>

                      {/* SMART Criteria */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        marginTop: '1rem',
                        padding: '1rem',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '0.5rem'
                      }}>
                        {[
                          { key: 'measurable', label: 'Medible', value: goal.measurable },
                          { key: 'achievable', label: 'Alcanzable', value: goal.achievable },
                          { key: 'relevant', label: 'Relevante', value: goal.relevant },
                          { key: 'timeBound', label: 'Temporal', value: goal.timeBound }
                        ].map((criteria) => (
                          <div key={criteria.key}>
                            <div style={{
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '0.25rem',
                              textTransform: 'uppercase',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {criteria.label}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              lineHeight: '1.4',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {criteria.value || 'No especificado'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Tareas y Psicoeducación
                </h3>
                {mode !== 'view' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addTask}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#6366F1',
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
                    Agregar Tarea
                  </motion.button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {planData.tasks?.map((task) => {
                  const taskType = taskTypes.find(type => type.id === task.type);
                  const TaskIcon = taskType?.icon || FileText;
                  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        backgroundColor: task.completed ? '#F0FDF4' : isOverdue ? '#FEF2F2' : 'white',
                        border: `1px solid ${task.completed ? '#BBF7D0' : isOverdue ? '#FECACA' : '#E5E7EB'}`,
                        borderRadius: '0.5rem',
                        cursor: mode !== 'view' ? 'pointer' : 'default'
                      }}
                      onClick={() => mode !== 'view' && toggleTaskCompletion(task.id)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${task.completed ? '#10B981' : '#E5E7EB'}`,
                          backgroundColor: task.completed ? '#10B981' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {task.completed && <CheckCircle size={12} color="white" />}
                      </motion.div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: task.completed ? '#DCFCE7' : '#F3F4F6',
                        borderRadius: '0.25rem'
                      }}>
                        <TaskIcon size={14} color={task.completed ? '#16A34A' : '#6B7280'} />
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: task.completed ? '#16A34A' : '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {taskType?.label}
                        </span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: task.completed ? '#16A34A' : '#1F2937',
                          marginBottom: '0.25rem',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {task.title}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: task.completed ? '#16A34A' : '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {task.description}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {task.estimatedDuration && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} />
                            <span>{task.estimatedDuration} min</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: isOverdue ? '#DC2626' : '#6B7280'
                          }}>
                            <Calendar size={12} />
                            <span>{task.dueDate.toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                        <div style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: getPriorityColor(task.priority) + '15',
                          borderRadius: '0.25rem',
                          border: `1px solid ${getPriorityColor(task.priority)}30`
                        }}>
                          <span style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            color: getPriorityColor(task.priority),
                            textTransform: 'uppercase'
                          }}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{
            width: '350px',
            borderLeft: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            {/* Adherence Metrics */}
            {adherenceMetrics && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Métricas de Adherencia
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Overall Adherence */}
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB'
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
                        Adherencia General
                      </span>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: getAdherenceColor(adherenceMetrics.adherenceRate),
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {Math.round(adherenceMetrics.adherenceRate)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${adherenceMetrics.adherenceRate}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          backgroundColor: getAdherenceColor(adherenceMetrics.adherenceRate),
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Task Statistics */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#10B981',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {adherenceMetrics.completedTasks}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Completadas
                      </div>
                    </div>

                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#EF4444',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {adherenceMetrics.overdueTasks}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Vencidas
                      </div>
                    </div>
                  </div>

                  {/* Weekly Progress Chart */}
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.75rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Progreso Semanal
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {adherenceMetrics.weeklyProgress.map((week, index) => {
                        const percentage = (week.completed / week.total) * 100;
                        return (
                          <div key={index}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.25rem'
                            }}>
                              <span style={{
                                fontSize: '0.75rem',
                                color: '#6B7280',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                Semana {week.week}
                              </span>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#374151',
                                fontFamily: 'Inter, sans-serif'
                              }}>
                                {week.completed}/{week.total}
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
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                style={{
                                  height: '100%',
                                  backgroundColor: getAdherenceColor(percentage),
                                  borderRadius: '3px'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Goal Progress */}
            {planData.goals && planData.goals.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Progreso de Objetivos
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {planData.goals.map((goal, index) => {
                    const category = goalCategories.find(cat => cat.id === goal.category);
                    return (
                      <div key={goal.id} style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #E5E7EB'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#374151',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {goal.title}
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
                            transition={{ duration: 1, delay: index * 0.2 }}
                            style={{
                              height: '100%',
                              backgroundColor: category?.color,
                              borderRadius: '3px'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Recomendaciones
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {adherenceMetrics && adherenceMetrics.adherenceRate < 70 && (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '0.5rem',
                    border: '1px solid #FDE68A'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <AlertTriangle size={14} color="#F59E0B" />
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#92400E',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Baja Adherencia
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#78350F',
                      margin: 0,
                      lineHeight: '1.4',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Considere revisar las tareas asignadas y ajustar la dificultad o frecuencia.
                    </p>
                  </div>
                )}

                {adherenceMetrics && adherenceMetrics.adherenceRate >= 85 && (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#F0FDF4',
                    borderRadius: '0.5rem',
                    border: '1px solid #BBF7D0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <CheckCircle size={14} color="#16A34A" />
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#15803D',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Excelente Adherencia
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#166534',
                      margin: 0,
                      lineHeight: '1.4',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      El paciente muestra un compromiso excelente. Considere aumentar la complejidad de los objetivos.
                    </p>
                  </div>
                )}

                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '0.5rem',
                  border: '1px solid #DBEAFE'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Lightbulb size={14} color="#2563EB" />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#1E40AF',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Sugerencia
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#1E3A8A',
                    margin: 0,
                    lineHeight: '1.4',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Programe una revisión del plan en {planData.reviewDate?.toLocaleDateString('es-ES')} para evaluar el progreso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderTop: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {mode !== 'view' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isSaving ? '#9CA3AF' : '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {isSaving ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {mode === 'create' ? 'Crear Plan' : 'Guardar Cambios'}
                  </>
                )}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* Export functionality */}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6366F1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Download size={16} />
              Exportar PDF
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {mode === 'view' ? 'Cerrar' : 'Cancelar'}
          </motion.button>
        </div>
      </motion.div>

      {/* Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10000,
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
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {activeGoalIndex !== null ? 'Editar Objetivo' : 'Nuevo Objetivo SMART'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowGoalModal(false);
                    setActiveGoalIndex(null);
                    setCurrentGoal({});
                  }}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Basic Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                      Título del Objetivo *
                    </label>
                    <input
                      type="text"
                      value={currentGoal.title || ''}
                      onChange={(e) => setCurrentGoal(prev => ({ ...prev, title: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                      placeholder="Ej: Reducir episodios de ansiedad"
                    />
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
                      Categoría
                    </label>
                    <select
                      value={currentGoal.category || 'behavioral'}
                      onChange={(e) => setCurrentGoal(prev => ({ ...prev, category: e.target.value as any }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      {goalCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    Descripción
                  </label>
                  <textarea
                    value={currentGoal.description || ''}
                    onChange={(e) => setCurrentGoal(prev => ({ ...prev, description: e.target.value }))}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Descripción detallada del objetivo..."
                  />
                </div>

                {/* SMART Criteria */}
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '1rem',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    Criterios SMART
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.5rem',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Específico y Medible (S/M)
                      </label>
                      <input
                        type="text"
                        value={currentGoal.measurable || ''}
                        onChange={(e) => setCurrentGoal(prev => ({ ...prev, measurable: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none'
                        }}
                        placeholder="Ej: Reducir episodios de ansiedad de 5 a 2 por semana"
                      />
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
                        Alcanzable (A)
                      </label>
                      <input
                        type="text"
                        value={currentGoal.achievable || ''}
                        onChange={(e) => setCurrentGoal(prev => ({ ...prev, achievable: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none'
                        }}
                        placeholder="Ej: Utilizando técnicas de respiración y mindfulness"
                      />
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
                        Relevante (R)
                      </label>
                      <input
                        type="text"
                        value={currentGoal.relevant || ''}
                        onChange={(e) => setCurrentGoal(prev => ({ ...prev, relevant: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none'
                        }}
                        placeholder="Ej: Importante para mejorar calidad de vida y funcionamiento diario"
                      />
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
                        Temporal (T)
                      </label>
                      <input
                        type="text"
                        value={currentGoal.timeBound || ''}
                        onChange={(e) => setCurrentGoal(prev => ({ ...prev, timeBound: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none'
                        }}
                        placeholder="Ej: En un período de 8 semanas"
                      />
                    </div>
                  </div>
                </div>

                {/* Priority and Target Date */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                      Prioridad
                    </label>
                    <select
                      value={currentGoal.priority || 'medium'}
                      onChange={(e) => setCurrentGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
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
                      Fecha Objetivo
                    </label>
                    <input
                      type="date"
                      value={currentGoal.targetDate ? currentGoal.targetDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setCurrentGoal(prev => ({ ...prev, targetDate: new Date(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '2rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowGoalModal(false);
                    setActiveGoalIndex(null);
                    setCurrentGoal({});
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Cancelar
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveGoal}
                  disabled={!currentGoal.title?.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: !currentGoal.title?.trim() ? '#9CA3AF' : '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: !currentGoal.title?.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {activeGoalIndex !== null ? 'Actualizar' : 'Agregar'} Objetivo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10000,
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
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Nueva Tarea
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowTaskModal(false);
                    setCurrentTask({});
                  }}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Título de la Tarea *
                  </label>
                  <input
                    type="text"
                    value={currentTask.title || ''}
                    onChange={(e) => setCurrentTask(prev => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none'
                    }}
                    placeholder="Ej: Practicar técnica de respiración diafragmática"
                  />
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
                    Descripción
                  </label>
                  <textarea
                    value={currentTask.description || ''}
                    onChange={(e) => setCurrentTask(prev => ({ ...prev, description: e.target.value }))}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Descripción detallada de la tarea..."
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                      Tipo de Tarea
                    </label>
                    <select
                      value={currentTask.type || 'homework'}
                      onChange={(e) => setCurrentTask(prev => ({ ...prev, type: e.target.value as any }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      {taskTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
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
                      Prioridad
                    </label>
                    <select
                      value={currentTask.priority || 'medium'}
                      onChange={(e) => setCurrentTask(prev => ({ ...prev, priority: e.target.value as any }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="date"
                      value={currentTask.dueDate ? currentTask.dueDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setCurrentTask(prev => ({ ...prev, dueDate: new Date(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
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
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Duración Estimada (min)
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={currentTask.estimatedDuration || 30}
                      onChange={(e) => setCurrentTask(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none'
                      }}
                    />
                  </div>
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
                    Instrucciones Detalladas
                  </label>
                  <textarea
                    value={currentTask.instructions || ''}
                    onChange={(e) => setCurrentTask(prev => ({ ...prev, instructions: e.target.value }))}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Instrucciones paso a paso para completar la tarea..."
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '2rem'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowTaskModal(false);
                    setCurrentTask({});
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Cancelar
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveTask}
                  disabled={!currentTask.title?.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: !currentTask.title?.trim() ? '#9CA3AF' : '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: !currentTask.title?.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Agregar Tarea
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
