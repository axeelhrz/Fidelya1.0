'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  Clock,
  MessageSquare,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  Download,
  Settings,
  Zap,
  Heart,
  Shield,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Alert } from '@/types/dashboard';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    level: 'all',
    type: 'all',
    status: 'all'
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  // Mock data para desarrollo
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'Riesgo suicida elevado',
        description: 'Paciente Carlos Rodríguez presenta ideación suicida activa. Requiere evaluación inmediata y posible hospitalización.',
        level: 'critical',
        timestamp: new Date('2024-03-15T14:30:00'),
        isRead: false,
        actionUrl: '/dashboard/patients/2',
        patientId: '2',
        type: 'clinical'
      },
      {
        id: '2',
        title: 'Cancelación recurrente',
        description: 'María González ha cancelado 3 sesiones consecutivas. Posible abandono del tratamiento.',
        level: 'warning',
        timestamp: new Date('2024-03-15T10:15:00'),
        isRead: false,
        actionUrl: '/dashboard/patients/1',
        patientId: '1',
        type: 'operational'
      },
      {
        id: '3',
        title: 'Pago pendiente',
        description: 'Factura vencida de €240 para sesiones familiares. Cliente: Ana López.',
        level: 'warning',
        timestamp: new Date('2024-03-14T16:45:00'),
        isRead: true,
        actionUrl: '/dashboard/billing/3',
        patientId: '3',
        type: 'financial'
      },
      {
        id: '4',
        title: 'Mejora significativa',
        description: 'Paciente muestra reducción del 40% en escala PHQ-9. Considerar espaciamiento de sesiones.',
        level: 'info',
        timestamp: new Date('2024-03-14T12:00:00'),
        isRead: true,
        actionUrl: '/dashboard/patients/1',
        patientId: '1',
        type: 'clinical'
      },
      {
        id: '5',
        title: 'Certificado próximo a vencer',
        description: 'Certificado de habilitación sanitaria vence en 15 días. Renovar antes del 30/03/2024.',
        level: 'warning',
        timestamp: new Date('2024-03-13T09:00:00'),
        isRead: false,
        type: 'system'
      },
      {
        id: '6',
        title: 'Capacidad máxima alcanzada',
        description: 'Consultorio 3 ha alcanzado el 95% de ocupación esta semana. Considerar redistribución.',
        level: 'info',
        timestamp: new Date('2024-03-12T18:30:00'),
        isRead: true,
        type: 'operational'
      }
    ];
    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
  }, []);

  // Filtrar alertas
  useEffect(() => {
    const filtered = alerts.filter(alert => {
      const matchesSearch = 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = selectedFilters.level === 'all' || alert.level === selectedFilters.level;
      const matchesType = selectedFilters.type === 'all' || alert.type === selectedFilters.type;
      const matchesStatus = selectedFilters.status === 'all' || 
        (selectedFilters.status === 'read' && alert.isRead) ||
        (selectedFilters.status === 'unread' && !alert.isRead);

      return matchesSearch && matchesLevel && matchesType && matchesStatus;
    });

    // Ordenar por timestamp (más recientes primero)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setFilteredAlerts(filtered);
  }, [alerts, searchQuery, selectedFilters]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return '#DC2626';
      case 'warning': return '#F59E0B';
      case 'info': return '#2563EB';
      default: return '#6B7280';
    }
  };

  const getLevelBgColor = (level: string) => {
    switch (level) {
      case 'critical': return '#FEF2F2';
      case 'warning': return '#FFFBEB';
      case 'info': return '#EFF6FF';
      default: return '#F9FAFB';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return AlertTriangle;
      case 'warning': return Clock;
      case 'info': return Bell;
      default: return Bell;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clinical': return Heart;
      case 'financial': return TrendingUp;
      case 'operational': return Settings;
      case 'system': return Shield;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'clinical': return '#DC2626';
      case 'financial': return '#059669';
      case 'operational': return '#7C3AED';
      case 'system': return '#2563EB';
      default: return '#6B7280';
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map(a => a.id));
    }
  };

  const handleBulkAction = (action: 'read' | 'delete' | 'export') => {
    switch (action) {
      case 'read':
        setAlerts(prev => 
          prev.map(alert => 
            selectedAlerts.includes(alert.id) ? { ...alert, isRead: true } : alert
          )
        );
        break;
      case 'delete':
        setAlerts(prev => prev.filter(alert => !selectedAlerts.includes(alert.id)));
        break;
      case 'export':
        console.log('Exportando alertas:', selectedAlerts);
        break;
    }
    setSelectedAlerts([]);
  };

  const sendWhatsAppAlert = (alertId: string) => {
    console.log('Enviando alerta por WhatsApp:', alertId);
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.level === 'critical').length;

  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Alertas Clínicas
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {filteredAlerts.length} alertas • {unreadCount} sin leer • {criticalCount} críticas
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMarkAllAsRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <CheckCircle size={18} />
              Marcar todas como leídas
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => console.log('Nueva alerta')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Plus size={18} />
              Nueva Alerta
            </motion.button>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={20} color="#DC2626" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Críticas
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#DC2626',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {criticalCount}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Bell size={20} color="#F59E0B" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Sin leer
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#F59E0B',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {unreadCount}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Activity size={20} color="#2563EB" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Hoy
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#2563EB',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {alerts.filter(a => {
                const today = new Date();
                const alertDate = new Date(a.timestamp);
                return alertDate.toDateString() === today.toDateString();
              }).length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Zap size={20} color="#10B981" />
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Automatizadas
              </span>
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#10B981',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {alerts.filter(a => a.type === 'system').length}
            </div>
          </motion.div>
        </div>

        {/* Barra de herramientas */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          {/* Búsqueda */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF'
            }} />
            <input
              type="text"
              placeholder="Buscar alertas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={selectedFilters.level}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, level: e.target.value }))}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <option value="all">Todos los niveles</option>
              <option value="critical">Críticas</option>
              <option value="warning">Advertencias</option>
              <option value="info">Informativas</option>
            </select>

            <select
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <option value="all">Todos los tipos</option>
              <option value="clinical">Clínicas</option>
              <option value="financial">Financieras</option>
              <option value="operational">Operacionales</option>
              <option value="system">Sistema</option>
            </select>

            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <option value="all">Todas</option>
              <option value="unread">Sin leer</option>
              <option value="read">Leídas</option>
            </select>
          </div>

          {/* Acciones en lote */}
          {selectedAlerts.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                onClick={() => handleBulkAction('read')}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <CheckCircle size={16} />
                Marcar leídas ({selectedAlerts.length})
              </motion.button>
              
              <motion.button
                onClick={() => handleBulkAction('export')}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Download size={16} />
                Exportar
              </motion.button>

              <motion.button
                onClick={() => handleBulkAction('delete')}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Lista de alertas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="checkbox"
              checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
              onChange={handleSelectAll}
              style={{ cursor: 'pointer' }}
            />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            }}>
              Seleccionar todas las alertas
            </span>
          </div>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredAlerts.map((alert, index) => {
            const LevelIcon = getLevelIcon(alert.level);
            const TypeIcon = getTypeIcon(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #F3F4F6',
                  backgroundColor: selectedAlerts.includes(alert.id) ? '#EFF6FF' : 
                                 !alert.isRead ? '#FFFBEB' : 'transparent',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => handleSelectAlert(alert.id)}
              >
                {/* Indicador de no leído */}
                {!alert.isRead && (
                  <div style={{
                    position: 'absolute',
                    left: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    backgroundColor: getLevelColor(alert.level),
                    borderRadius: '2px'
                  }} />
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={() => handleSelectAlert(alert.id)}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div style={{ flex: 1 }}>
                    {/* Header de la alerta */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: getLevelBgColor(alert.level)
                          }}>
                            <LevelIcon size={16} color={getLevelColor(alert.level)} />
                          </div>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: getLevelBgColor(alert.level),
                            color: getLevelColor(alert.level),
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {alert.level === 'critical' ? 'Crítica' :
                             alert.level === 'warning' ? 'Advertencia' : 'Información'}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <TypeIcon size={14} color={getTypeColor(alert.type)} />
                          <span style={{
                            fontSize: '0.75rem',
                            color: getTypeColor(alert.type),
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {alert.type === 'clinical' ? 'Clínica' :
                             alert.type === 'financial' ? 'Financiera' :
                             alert.type === 'operational' ? 'Operacional' : 'Sistema'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {alert.timestamp.toLocaleDateString('es-ES')} • {alert.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        
                        {!alert.isRead && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: getLevelColor(alert.level),
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    </div>

                    {/* Contenido de la alerta */}
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#1F2937',
                        marginBottom: '0.5rem',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {alert.title}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        lineHeight: 1.5,
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {alert.description}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!alert.isRead && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(alert.id);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#10B981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <CheckCircle size={14} />
                            Marcar leída
                          </motion.button>
                        )}
                        
                        {alert.actionUrl && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Navegar a:', alert.actionUrl);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#2563EB',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <Eye size={14} />
                            Ver detalles
                          </motion.button>
                        )}

                        {alert.level === 'critical' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              sendWhatsAppAlert(alert.id);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#059669',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            <MessageSquare size={14} />
                            WhatsApp
                          </motion.button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Editar alerta', alert.id);
                          }}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            backgroundColor: '#FFFBEB',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit size={14} color="#F59E0B" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAlert(alert.id);
                          }}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            backgroundColor: '#FEF2F2',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} color="#EF4444" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <Bell size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
            <p style={{
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              No se encontraron alertas con los filtros aplicados
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
