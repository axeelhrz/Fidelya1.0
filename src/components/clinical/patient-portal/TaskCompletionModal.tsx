'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Star,
  Award
} from 'lucide-react';

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (feedback: string, rating: number) => void;
  taskTitle: string;
  loading?: boolean;
}

export default function TaskCompletionModal({
  isOpen,
  onClose,
  onComplete,
  taskTitle,
  loading = false
}: TaskCompletionModalProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');

  const handleSubmit = () => {
    if (rating > 0) {
      onComplete(feedback, rating);
      // Reset form
      setRating(0);
      setFeedback('');
      setDifficulty('');
    }
  };

  const difficultyOptions = [
    { value: 'muy-facil', label: 'Muy Fácil', color: '#10B981' },
    { value: 'facil', label: 'Fácil', color: '#84CC16' },
    { value: 'moderado', label: 'Moderado', color: '#F59E0B' },
    { value: 'dificil', label: 'Difícil', color: '#EF4444' },
    { value: 'muy-dificil', label: 'Muy Difícil', color: '#DC2626' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '500px',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              zIndex: 51,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 1.5rem 0 1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#ECFDF5'
                }}>
                  <CheckCircle2 size={20} color="#10B981" />
                </div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#1E293B',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Completar Tarea
                </h2>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#F1F5F9',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                padding: '1rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '0.75rem',
                border: '1px solid #E2E8F0',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  margin: '0 0 0.5rem 0',
                  color: '#1E293B'
                }}>
                  {taskTitle}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748B',
                  margin: 0
                }}>
                  ¡Felicitaciones por completar esta tarea! Tu feedback nos ayuda a mejorar tu experiencia de tratamiento.
                </p>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  ¿Qué tan útil fue esta tarea? *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      style={{
                        padding: '0.25rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <Star
                        size={24}
                        color={star <= rating ? '#F59E0B' : '#D1D5DB'}
                        fill={star <= rating ? '#F59E0B' : 'none'}
                      />
                    </motion.button>
                  ))}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#64748B'
                }}>
                  {rating === 0 && 'Selecciona una calificación'}
                  {rating === 1 && 'No fue útil'}
                  {rating === 2 && 'Poco útil'}
                  {rating === 3 && 'Moderadamente útil'}
                  {rating === 4 && 'Muy útil'}
                  {rating === 5 && 'Extremadamente útil'}
                </div>
              </div>

              {/* Difficulty */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  ¿Cómo te pareció la dificultad?
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '0.5rem'
                }}>
                  {difficultyOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDifficulty(option.value)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: `2px solid ${difficulty === option.value ? option.color : '#E2E8F0'}`,
                        backgroundColor: difficulty === option.value ? `${option.color}20` : 'white',
                        color: difficulty === option.value ? option.color : '#64748B',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Comentarios adicionales (opcional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Comparte tu experiencia, dificultades encontradas, o sugerencias..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #D1D5DB',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: rating > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: rating > 0 ? 0.98 : 1 }}
                  onClick={handleSubmit}
                  disabled={rating === 0 || loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    backgroundColor: rating > 0 ? '#10B981' : '#D1D5DB',
                    color: 'white',
                    borderRadius: '0.5rem',
                    cursor: rating > 0 ? 'pointer' : 'not-allowed',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Completando...
                    </>
                  ) : (
                    <>
                      <Award size={16} />
                      Marcar como Completada
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
