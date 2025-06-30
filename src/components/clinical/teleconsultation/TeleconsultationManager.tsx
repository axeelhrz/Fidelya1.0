'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Calendar,
  Clock,
  User,
  Settings,
  Monitor,
  Wifi,
  WifiOff,
  Camera,
  CameraOff,
  MessageSquare,
  Download,
  FileText,
  CheckCircle,
  Copy,
} from 'lucide-react';
import { TeleconsultationSession, Patient, Appointment } from '@/types/clinical';

interface TeleconsultationManagerProps {
  appointment: Appointment;
  patient: Patient;
  onSessionStart: (sessionData: Partial<TeleconsultationSession>) => void;
  onSessionEnd: (sessionId: string, notes: string) => void;
  onTechnicalIssue: (issue: string) => void;
}

export function TeleconsultationManager({
  appointment,
  patient,
  onSessionStart,
  onSessionEnd,
  onTechnicalIssue
}: TeleconsultationManagerProps) {
  const [sessionStatus, setSessionStatus] = useState<'waiting' | 'connecting' | 'active' | 'ended'>('waiting');
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('excellent');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'therapist' | 'patient';
    message: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showTechnicalSupport, setShowTechnicalSupport] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<'off' | 'recording' | 'paused'>('off');
  const [sessionLink, setSessionLink] = useState('');

  // Simulated session data
  const sessionData = {
    id: 'session-' + Date.now(),
    appointmentId: appointment.id,
    patientId: patient.id,
    startTime: new Date(),
    platform: 'zoom' as const,
    meetingId: '123-456-789',
    passcode: 'abc123',
    recordingEnabled: false,
    quality: connectionQuality
  };

  useEffect(() => {
    // Generate session link
    const link = `https://meet.centro-psicologico.com/session/${sessionData.id}?pwd=${sessionData.passcode}`;
    setSessionLink(link);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStatus === 'active') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setSessionStatus('connecting');
    setTimeout(() => {
      setSessionStatus('active');
      onSessionStart(sessionData);
    }, 2000);
  };

  const handleEndSession = () => {
    setSessionStatus('ended');
    onSessionEnd(sessionData.id, sessionNotes);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'therapist' as const,
        message: newMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const copySessionLink = () => {
    navigator.clipboard.writeText(sessionLink);
    // Show toast notification
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Wifi size={16} color="#10B981" />;
      case 'good': return <Wifi size={16} color="#F59E0B" />;
      case 'poor': return <Wifi size={16} color="#EF4444" />;
      case 'disconnected': return <WifiOff size={16} color="#6B7280" />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return '#10B981';
      case 'good': return '#F59E0B';
      case 'poor': return '#EF4444';
      case 'disconnected': return '#6B7280';
    }
  };

  if (sessionStatus === 'waiting') {
    return (
      <div style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Pre-Session Setup */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#EEF2FF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Video size={32} color="#6366F1" />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1F2937',
            margin: '0 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Teleconsulta Programada
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            {patient.firstName} {patient.lastName}
          </p>
        </div>

        {/* Session Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Calendar size={16} color="#6366F1" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Fecha y Hora
              </span>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              {appointment.dateTime.toLocaleDateString('es-ES')} a las {appointment.dateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Clock size={16} color="#6366F1" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Duración Estimada
              </span>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              {appointment.duration || 50} minutos
            </div>
          </div>
        </div>

        {/* Session Link */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#EFF6FF',
          borderRadius: '0.75rem',
          border: '1px solid #DBEAFE',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <Link size={16} color="#2563EB" />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1E40AF',
              fontFamily: 'Inter, sans-serif'
            }}>
              Enlace de la Sesión
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB'
          }}>
            <input
              type="text"
              value={sessionLink}
              readOnly
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copySessionLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#6366F1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Copy size={14} />
              Copiar
            </motion.button>
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#1E3A8A',
            margin: '0.5rem 0 0 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Comparte este enlace con el paciente para que pueda unirse a la sesión.
          </p>
        </div>

        {/* Technical Check */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#F0FDF4',
          borderRadius: '0.75rem',
          border: '1px solid #BBF7D0',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <Settings size={16} color="#16A34A" />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#15803D',
              fontFamily: 'Inter, sans-serif'
            }}>
              Verificación Técnica
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem'
          }}>
            {[
              { icon: Camera, label: 'Cámara', status: 'ok' },
              { icon: Mic, label: 'Micrófono', status: 'ok' },
              { icon: Wifi, label: 'Conexión', status: 'ok' },
              { icon: Monitor, label: 'Pantalla', status: 'ok' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#15803D',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <Icon size={14} color="#16A34A" />
                  <span>{item.label}</span>
                  <CheckCircle size={12} color="#16A34A" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTechnicalSupport(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
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
            <Settings size={16} />
            Configuración
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartSession}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
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
            <Video size={16} />
            Iniciar Sesión
          </motion.button>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'connecting') {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F2937'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              margin: '0 auto 1rem'
            }}
          />
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            margin: '0 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Conectando...
          </h3>
          <p style={{
            fontSize: '0.875rem',
            opacity: 0.8,
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            Estableciendo conexión segura con el paciente
          </p>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'active') {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#1F2937',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <User size={16} />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                {patient.firstName} {patient.lastName}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem'
            }}>
              {getConnectionIcon()}
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                {connectionQuality === 'excellent' ? 'Excelente' :
                 connectionQuality === 'good' ? 'Buena' :
                 connectionQuality === 'poor' ? 'Pobre' : 'Desconectado'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Clock size={16} />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                {formatDuration(sessionDuration)}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {recordingStatus === 'recording' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#DC2626',
                borderRadius: '0.25rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'white',
                  borderRadius: '50%'
                }} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  REC
                </span>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEndSession}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Finalizar
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* Video Area */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Patient Video */}
            <div style={{
              flex: 1,
              backgroundColor: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {isVideoEnabled ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#4B5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#6B7280',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={48} color="white" />
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  color: 'white'
                }}>
                  <CameraOff size={48} />
                  <span style={{
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Cámara desactivada
                  </span>
                </div>
              )}

              {/* Therapist Video (Picture in Picture) */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                width: '200px',
                height: '150px',
                backgroundColor: '#1F2937',
                borderRadius: '0.5rem',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isVideoEnabled ? (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#6B7280',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={24} color="white" />
                  </div>
                ) : (
                  <CameraOff size={24} color="white" />
                )}
              </div>
            </div>

            {/* Controls */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isAudioEnabled ? 'rgba(255, 255, 255, 0.2)' : '#DC2626',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isVideoEnabled ? 'rgba(255, 255, 255, 0.2)' : '#DC2626',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isScreenSharing ? '#10B981' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Monitor size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRecordingStatus(recordingStatus === 'off' ? 'recording' : 'off')}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: recordingStatus === 'recording' ? '#DC2626' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'white',
                  borderRadius: recordingStatus === 'recording' ? '50%' : '2px'
                }} />
              </motion.button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{
            width: '300px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #E5E7EB'
          }}>
            {/* Chat */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                margin: '0 0 1rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Chat de la Sesión
              </h4>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '1rem'
              }}>
                {chatMessages.map((message) => (
                  <div key={message.id} style={{
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: message.sender === 'therapist' ? '#EEF2FF' : '#F0FDF4',
                    borderRadius: '0.5rem',
                    border: `1px solid ${message.sender === 'therapist' ? '#C7D2FE' : '#BBF7D0'}`
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: message.sender === 'therapist' ? '#4338CA' : '#16A34A',
                      marginBottom: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {message.sender === 'therapist' ? 'Terapeuta' : 'Paciente'}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {message.message}
                    </div>
                    <div style={{
                      fontSize: '0.625rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Escribir mensaje..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <MessageSquare size={16} />
                </motion.button>
              </div>
            </div>

            {/* Session Notes */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #E5E7EB'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                margin: '0 0 0.75rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Notas de la Sesión
              </h4>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  resize: 'none'
                }}
                placeholder="Notas sobre la sesión..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'ended') {
    return (
      <div style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#F0FDF4',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <CheckCircle size={32} color="#16A34A" />
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#1F2937',
          margin: '0 0 0.5rem 0',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Sesión Finalizada
        </h2>

        <p style={{
          fontSize: '1rem',
          color: '#6B7280',
          margin: '0 0 2rem 0',
          fontFamily: 'Inter, sans-serif'
        }}>
          La teleconsulta con {patient.firstName} {patient.lastName} ha terminado exitosamente.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#6366F1',
              marginBottom: '0.25rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {formatDuration(sessionDuration)}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Duración Total
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: getConnectionColor(),
              marginBottom: '0.25rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {connectionQuality === 'excellent' ? 'Excelente' :
               connectionQuality === 'good' ? 'Buena' :
               connectionQuality === 'poor' ? 'Regular' : 'Mala'}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Calidad de Conexión
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
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
            <Download size={16} />
            Descargar Grabación
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
            <FileText size={16} />
            Completar Notas
          </motion.button>
        </div>
      </div>
    );
  }

  return null;
}
