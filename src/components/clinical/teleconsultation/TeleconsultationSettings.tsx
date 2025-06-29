'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Video,
  Mic,
  Monitor,
  Wifi,
  Shield,
  Clock,
  Bell,
  Mail,
  Phone,
  Calendar,
  Link,
  Download,
  Upload,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface TeleconsultationSettingsProps {
  onSave: (settings: any) => void;
  onCancel: () => void;
}

export function TeleconsultationSettings({
  onSave,
  onCancel
}: TeleconsultationSettingsProps) {
  const [settings, setSettings] = useState({
    // Platform Settings
    platform: 'zoom',
    autoGenerateLinks: true,
    linkExpirationHours: 24,
    waitingRoomEnabled: true,
    
    // Audio/Video Settings
    defaultVideoEnabled: true,
    defaultAudioEnabled: true,
    recordingEnabled: false,
    autoRecording: false,
    recordingQuality: 'hd',
    
    // Security Settings
    passwordProtected: true,
    encryptionEnabled: true,
    participantAuthentication: true,
    screenSharingRestricted: false,
    
    // Notification Settings
    reminderEmails: true,
    reminderSMS: false,
    reminderHoursBefore: 24,
    followUpEmails: true,
    
    // Integration Settings
    calendarSync: true,
    calendarProvider: 'google',
    automaticScheduling: false,
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    
    // Quality Settings
    bandwidthOptimization: true,
    adaptiveQuality: true,
    connectionTesting: true,
    fallbackOptions: true
  });

  const [activeTab, setActiveTab] = useState('platform');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'platform', label: 'Plataforma', icon: Video },
    { id: 'audio-video', label: 'Audio/Video', icon: Mic },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'integration', label: 'Integración', icon: Calendar },
    { id: 'quality', label: 'Calidad', icon: Wifi }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'platform':
        return (
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
                Plataforma de Videollamadas
              </label>
              <select
                value={settings.platform}
                onChange={(e) => setSettings(prev => ({ ...prev, platform: e.target.value }))}
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
                <option value="zoom">Zoom</option>
                <option value="teams">Microsoft Teams</option>
                <option value="meet">Google Meet</option>
                <option value="webex">Cisco Webex</option>
                <option value="custom">Plataforma Personalizada</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.autoGenerateLinks}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoGenerateLinks: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Generar enlaces automáticamente
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Crear enlaces de sesión automáticamente al programar citas
              </p>
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
                Expiración de enlaces (horas)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={settings.linkExpirationHours}
                onChange={(e) => setSettings(prev => ({ ...prev, linkExpirationHours: parseInt(e.target.value) }))}
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
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.waitingRoomEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, waitingRoomEnabled: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Habilitar sala de espera
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Los pacientes esperarán hasta que el terapeuta los admita
              </p>
            </div>
          </div>
        );

      case 'audio-video':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.defaultVideoEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultVideoEnabled: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Video habilitado por defecto
              </label>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.defaultAudioEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, defaultAudioEnabled: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Audio habilitado por defecto
              </label>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.recordingEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, recordingEnabled: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Permitir grabación de sesiones
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Requiere consentimiento explícito del paciente
              </p>
            </div>

            {settings.recordingEnabled && (
              <>
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={settings.autoRecording}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoRecording: e.target.checked }))}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Grabación automática
                  </label>
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
                    Calidad de grabación
                  </label>
                  <select
                    value={settings.recordingQuality}
                    onChange={(e) => setSettings(prev => ({ ...prev, recordingQuality: e.target.value }))}
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
                    <option value="sd">Definición estándar (SD)</option>
                    <option value="hd">Alta definición (HD)</option>
                    <option value="fhd">Full HD (1080p)</option>
                  </select>
                </div>
              </>
            )}
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1rem',
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
                <Shield size={16} color="#F59E0B" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#92400E',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Configuración de Seguridad
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#78350F',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Estas configuraciones afectan la seguridad y privacidad de las sesiones
              </p>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.passwordProtected}
                  onChange={(e) => setSettings(prev => ({ ...prev, passwordProtected: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Protección con contraseña
              </label>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.encryptionEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, encryptionEnabled: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Encriptación end-to-end
              </label>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.participantAuthentication}
                  onChange={(e) => setSettings(prev => ({ ...prev, participantAuthentication: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Autenticación de participantes
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Verificar identidad antes de permitir acceso
              </p>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.screenSharingRestricted}
                  onChange={(e) => setSettings(prev => ({ ...prev, screenSharingRestricted: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Restringir compartir pantalla
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Solo el terapeuta puede compartir pantalla
              </p>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.reminderEmails}
                  onChange={(e) => setSettings(prev => ({ ...prev, reminderEmails: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Recordatorios por email
              </label>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.reminderSMS}
                  onChange={(e) => setSettings(prev => ({ ...prev, reminderSMS: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Recordatorios por SMS
              </label>
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
                Enviar recordatorios (horas antes)
              </label>
              <select
                value={settings.reminderHoursBefore}
                onChange={(e) => setSettings(prev => ({ ...prev, reminderHoursBefore: parseInt(e.target.value) }))}
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
                <option value="1">1 hora antes</option>
                <option value="2">2 horas antes</option>
                <option value="4">4 horas antes</option>
                <option value="24">24 horas antes</option>
                <option value="48">48 horas antes</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.followUpEmails}
                  onChange={(e) => setSettings(prev => ({ ...prev, followUpEmails: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Emails de seguimiento post-sesión
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Enviar resumen y próximos pasos después de la sesión
              </p>
            </div>
          </div>
        );

      case 'integration':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.calendarSync}
                  onChange={(e) => setSettings(prev => ({ ...prev, calendarSync: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Sincronización con calendario
              </label>
            </div>

            {settings.calendarSync && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Proveedor de calendario
                </label>
                <select
                  value={settings.calendarProvider}
                  onChange={(e) => setSettings(prev => ({ ...prev, calendarProvider: e.target.value }))}
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
                  <option value="google">Google Calendar</option>
                  <option value="outlook">Microsoft Outlook</option>
                  <option value="apple">Apple Calendar</option>
                  <option value="caldav">CalDAV</option>
                </select>
              </div>
            )}

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.automaticScheduling}
                  onChange={(e) => setSettings(prev => ({ ...prev, automaticScheduling: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Programación automática
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Permitir a los pacientes programar citas automáticamente
              </p>
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
                  Buffer antes (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={settings.bufferTimeBefore}
                  onChange={(e) => setSettings(prev => ({ ...prev, bufferTimeBefore: parseInt(e.target.value) }))}
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
                  Buffer después (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={settings.bufferTimeAfter}
                  onChange={(e) => setSettings(prev => ({ ...prev, bufferTimeAfter: parseInt(e.target.value) }))}
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
        );

      case 'quality':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.bandwidthOptimization}
                  onChange={(e) => setSettings(prev => ({ ...prev, bandwidthOptimization: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Optimización de ancho de banda
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Ajustar automáticamente la calidad según la conexión
              </p>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.adaptiveQuality}
                  onChange={(e) => setSettings(prev => ({ ...prev, adaptiveQuality: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Calidad adaptativa
              </label>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.connectionTesting}
                  onChange={(e) => setSettings(prev => ({ ...prev, connectionTesting: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Prueba de conexión pre-sesión
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Verificar calidad de conexión antes de iniciar
              </p>
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.fallbackOptions}
                  onChange={(e) => setSettings(prev => ({ ...prev, fallbackOptions: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Opciones de respaldo
              </label>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Llamada telefónica como respaldo si falla el video
              </p>
            </div>
          </div>
        );

      default:
        return null;
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
          maxWidth: '800px',
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
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Configuración de Teleconsulta
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Personaliza la experiencia de videollamadas
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* Sidebar */}
          <div style={{
            width: '200px',
            backgroundColor: '#F9FAFB',
            borderRight: '1px solid #E5E7EB',
            padding: '1rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
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
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: activeTab === tab.id ? '#EEF2FF' : 'transparent',
                      color: activeTab === tab.id ? '#4338CA' : '#6B7280',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: activeTab === tab.id ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto'
          }}>
            {renderTabContent()}
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            <Info size={14} />
            <span>Los cambios se aplicarán a las próximas sesiones</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
              Cancelar
            </motion.button>

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
                  Guardar Configuración
                </>
              )}
            </motion.button>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
