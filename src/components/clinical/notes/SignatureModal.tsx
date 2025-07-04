'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, FileSignature, Check, Pen, Type, User } from 'lucide-react';
import { ClinicalNote } from '@/types/notes';

interface SignatureModalProps {
  note: ClinicalNote;
  onClose: () => void;
  onSign: (signatureData?: string) => void;
}

export default function SignatureModal({ note, onClose, onSign }: SignatureModalProps) {
  const [signatureMethod, setSignatureMethod] = useState<'digital' | 'typed' | 'drawn'>('digital');
  const [typedSignature, setTypedSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDigitalSign = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular proceso
      onSign();
    } finally {
      setLoading(false);
    }
  };

  const handleTypedSign = async () => {
    if (!typedSignature.trim()) {
      alert('Por favor, escribe tu nombre para la firma.');
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSign(typedSignature);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawnSign = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSign(signatureData);
    } finally {
      setLoading(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const renderSignatureMethod = () => {
    switch (signatureMethod) {
      case 'digital':
        return (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            background: '#F8FAFC',
            borderRadius: '0.75rem',
            border: '2px dashed #D1D5DB'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <FileSignature size={28} color="white" />
            </div>
            
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: '0 0 0.5rem 0'
            }}>
              Firma Digital
            </h3>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0 0 1.5rem 0',
              lineHeight: 1.5
            }}>
              Tu firma digital será registrada con tu información de usuario, 
              fecha y hora actual, y dirección IP para garantizar la autenticidad.
            </p>

            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #E5E7EB',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Firmante:</strong> Dr. Ana García
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Hora:</strong> {new Date().toLocaleTimeString('es-ES')}
                </div>
                <div>
                  <strong>Licencia:</strong> PSY-12345
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleDigitalSign}
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                margin: '0 auto'
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <Check size={16} />
              )}
              {loading ? 'Firmando...' : 'Firmar Digitalmente'}
            </motion.button>
          </div>
        );

      case 'typed':
        return (
          <div style={{
            padding: '2rem',
            background: '#F8FAFC',
            borderRadius: '0.75rem',
            border: '2px dashed #D1D5DB'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Type size={20} color="white" />
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: 0
                }}>
                  Firma Escrita
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: '0.25rem 0 0 0'
                }}>
                  Escribe tu nombre completo como aparece en tu licencia
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Nombre completo *
              </label>
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Dr. Ana García"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '1.125rem',
                  fontFamily: 'cursive',
                  textAlign: 'center',
                  background: 'white'
                }}
              />
            </div>

            {typedSignature && (
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #E5E7EB',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontFamily: 'cursive',
                  color: '#1F2937',
                  marginBottom: '0.5rem'
                }}>
                  {typedSignature}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280'
                }}>
                  Vista previa de la firma
                </div>
              </div>
            )}

            <motion.button
              onClick={handleTypedSign}
              disabled={loading || !typedSignature.trim()}
              whileHover={!loading && typedSignature.trim() ? { scale: 1.05 } : {}}
              whileTap={!loading && typedSignature.trim() ? { scale: 0.95 } : {}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem',
                background: loading || !typedSignature.trim() ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: loading || !typedSignature.trim() ? 'not-allowed' : 'pointer',
                margin: '0 auto'
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <Check size={16} />
              )}
              {loading ? 'Firmando...' : 'Firmar con Texto'}
            </motion.button>
          </div>
        );

      case 'drawn':
        return (
          <div style={{
            padding: '2rem',
            background: '#F8FAFC',
            borderRadius: '0.75rem',
            border: '2px dashed #D1D5DB'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Pen size={20} color="white" />
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: 0
                }}>
                  Firma Dibujada
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: '0.25rem 0 0 0'
                }}>
                  Dibuja tu firma en el área designada
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  width: '100%',
                  height: '150px',
                  cursor: 'crosshair',
                  display: 'block'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <motion.button
                onClick={clearCanvas}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'white',
                  color: '#6B7280',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Limpiar
              </motion.button>

              <motion.button
                onClick={handleDrawnSign}
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.5rem',
                  background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <Check size={16} />
                )}
                {loading ? 'Firmando...' : 'Firmar'}
              </motion.button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '600px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #E5E7EB',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0
              }}>
                Firma Electrónica
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: '0.25rem 0 0 0'
              }}>
                Nota de {note.patientName} - {new Date(note.date).toLocaleDateString('es-ES')}
              </p>
            </div>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: '0.5rem',
                background: '#F3F4F6',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} color="#6B7280" />
            </motion.button>
          </div>
        </div>

        {/* Selector de método de firma */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            margin: '0 0 1rem 0'
          }}>
            Selecciona el método de firma:
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem'
          }}>
            {[
              { key: 'digital', label: 'Digital', icon: FileSignature, color: '#3B82F6' },
              { key: 'typed', label: 'Escrita', icon: Type, color: '#F59E0B' },
              { key: 'drawn', label: 'Dibujada', icon: Pen, color: '#8B5CF6' }
            ].map(({ key, label, icon: Icon, color }) => (
              <motion.button
                key={key}
                onClick={() => setSignatureMethod(key as 'digital' | 'typed' | 'drawn')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  background: signatureMethod === key ? `${color}15` : 'white',
                  border: `2px solid ${signatureMethod === key ? color : '#E5E7EB'}`,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={24} color={signatureMethod === key ? color : '#6B7280'} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: signatureMethod === key ? color : '#6B7280'
                }}>
                  {label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Área de firma */}
        <div style={{ padding: '1.5rem' }}>
          {renderSignatureMethod()}
        </div>

        {/* Información legal */}
        <div style={{
          padding: '1.5rem',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          margin: '0 1.5rem 1.5rem 1.5rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              padding: '0.25rem',
              background: '#F59E0B',
              borderRadius: '0.375rem',
              marginTop: '0.125rem'
            }}>
              <User size={12} color="white" />
            </div>
            
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#92400E',
                margin: '0 0 0.5rem 0'
              }}>
                Declaración de Firma Electrónica
              </h4>
              <p style={{
                fontSize: '0.75rem',
                color: '#92400E',
                margin: 0,
                lineHeight: 1.4
              }}>
                Al firmar esta nota clínica, confirmo que la información contenida es precisa y completa según mi criterio profesional. 
                Esta firma electrónica tiene la misma validez legal que una firma manuscrita y queda registrada con fecha, 
                hora e información de autenticación para fines de auditoría y cumplimiento normativo.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
