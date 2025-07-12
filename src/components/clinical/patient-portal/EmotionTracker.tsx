'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  TrendingUp,
  Plus,
  Save,
  X,
} from 'lucide-react';
import { usePatientData } from '@/hooks/usePatientData';

export function EmotionTracker() {
  const { data, loading, addMoodLog } = usePatientData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [notes, setNotes] = useState('');

  if (loading || !data) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #E2E8F0',
          borderTop: '4px solid #3B82F6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const { moodLogs = [] } = data;

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#10B981';
    if (mood >= 6) return '#84CC16';
    if (mood >= 4) return '#F59E0B';
    if (mood >= 2) return '#EF4444';
    return '#DC2626';
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 9) return 'Excelente';
    if (mood >= 7) return 'Muy bien';
    if (mood >= 5) return 'Bien';
    if (mood >= 3) return 'Regular';
    if (mood >= 1) return 'Mal';
    return 'Muy mal';
  };

  const handleSaveMood = async () => {
    if (selectedMood >= 1 && selectedMood <= 10) {
      await addMoodLog(selectedMood, notes);
      setShowAddForm(false);
      setSelectedMood(5);
      setNotes('');
    }
  };

  const averageMood = moodLogs.length > 0 
    ? moodLogs.reduce((sum, log) => sum + log.mood, 0) / moodLogs.length 
    : 0;

  const recentTrend = moodLogs.length >= 2 
    ? moodLogs[0].mood - moodLogs[1].mood 
    : 0;

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1E293B',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Registro de Emociones
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#64748B',
            margin: '0.5rem 0 0 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Lleva un seguimiento diario de tu estado emocional
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Plus size={16} />
          Registrar Hoy
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#FEF2F2'
            }}>
              <Heart size={20} color="#EF4444" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Estado Actual
            </h3>
          </div>
          
          {moodLogs.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>
                {getMoodEmoji(moodLogs[0].mood)}
              </span>
              <div>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: getMoodColor(moodLogs[0].mood),
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {moodLogs[0].mood}/10
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  margin: '0.25rem 0 0 0',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {getMoodLabel(moodLogs[0].mood)}
                </p>
              </div>
            </div>
          ) : (
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              No hay registros aún
            </p>
          )}
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#EFF6FF'
            }}>
              <TrendingUp size={20} color="#3B82F6" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Promedio Semanal
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#3B82F6',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {averageMood.toFixed(1)}/10
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {getMoodLabel(averageMood)}
            </p>
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: recentTrend >= 0 ? '#ECFDF5' : '#FEF2F2'
            }}>
              <TrendingUp size={20} color={recentTrend >= 0 ? '#10B981' : '#EF4444'} />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Tendencia
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: recentTrend >= 0 ? '#10B981' : '#EF4444',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {recentTrend > 0 ? '+' : ''}{recentTrend.toFixed(1)}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {recentTrend > 0 ? 'Mejorando' : recentTrend < 0 ? 'Empeorando' : 'Estable'}
            </p>
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#FFFBEB'
            }}>
              <Calendar size={20} color="#F59E0B" />
            </div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Días Registrados
            </h3>
          </div>
          
          <div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#F59E0B',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {moodLogs.length}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Total de registros
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mood History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E293B',
          margin: '0 0 1.5rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Historial de Emociones
        </h2>

        {moodLogs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {moodLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '0.75rem',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>
                      {getMoodEmoji(log.mood)}
                    </span>
                    <div>
                      <h4 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#1E293B',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {getMoodLabel(log.mood)} ({log.mood}/10)
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#64748B',
                        margin: '0.25rem 0 0 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {log.date.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: getMoodColor(log.mood),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {log.mood}
                  </div>
                </div>
                
                {log.notes && (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      margin: 0,
                      fontStyle: 'italic',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      &quot;{log.notes}&quot;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem'
          }}>
            <Heart size={48} color="#E2E8F0" style={{ marginBottom: '1rem' }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              No hay registros aún
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#64748B',
              marginBottom: '2rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Comienza registrando tu estado emocional de hoy
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Plus size={16} />
              Primer Registro
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Add Mood Modal */}
      <AnimatePresence>
        {showAddForm && (
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
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Registrar Estado Emocional
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
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

              {/* Modal Content */}
              <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '1rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    ¿Cómo te sientes hoy? (1-10)
                  </label>
                  
                  {/* Mood Scale */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                      <motion.button
                        key={mood}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedMood(mood)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: selectedMood === mood ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                          backgroundColor: selectedMood === mood ? '#EFF6FF' : 'white',
                          color: selectedMood === mood ? '#3B82F6' : '#64748B',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {mood}
                      </motion.button>
                    ))}
                  </div>

                  {/* Mood Preview */}
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0',
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                      {getMoodEmoji(selectedMood)}
                    </div>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: getMoodColor(selectedMood),
                      margin: 0,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {getMoodLabel(selectedMood)} ({selectedMood}/10)
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Notas (opcional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="¿Qué ha influido en tu estado emocional hoy?"
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontFamily: 'Inter, sans-serif',
                        resize: 'vertical',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveMood}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <Save size={16} />
                    Guardar Registro
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddForm(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: 'transparent',
                      color: '#64748B',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
