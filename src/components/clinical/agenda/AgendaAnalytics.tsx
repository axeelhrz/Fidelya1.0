'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Activity,
  BarChart3,
  Target
} from 'lucide-react';
import { Appointment, ConsultingRoom } from '@/types/clinical';
import { ClinicalCard } from '../ClinicalCard';

interface AgendaAnalyticsProps {
  appointments: Appointment[];
  rooms: ConsultingRoom[];
  dateRange: { start: Date; end: Date };
}

type MetricKey = 'occupancy' | 'revenue' | 'efficiency' | 'trends';

export function AgendaAnalytics({ appointments, rooms, dateRange }: AgendaAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('occupancy');

  // Calculate analytics
  const analytics = useMemo(() => {
    const filteredAppointments = appointments.filter(apt => 
      apt.date >= dateRange.start && apt.date <= dateRange.end
    );

    // Basic metrics
    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed').length;
    const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled').length;
    const noShowAppointments = filteredAppointments.filter(apt => apt.status === 'no-show').length;

    // Revenue metrics
    const totalRevenue = filteredAppointments
      .filter(apt => apt.paid && apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.cost, 0);

    const averageSessionCost = totalRevenue / Math.max(completedAppointments, 1);

    // Occupancy metrics
    const workingDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const workingHours = 10; // 8 AM to 6 PM
    const totalAvailableSlots = workingDays * workingHours * rooms.length * 2; // 30-min slots
    const occupancyRate = (totalAppointments / totalAvailableSlots) * 100;

    // Efficiency metrics
    const completionRate = (completedAppointments / Math.max(totalAppointments, 1)) * 100;
    const cancellationRate = (cancelledAppointments / Math.max(totalAppointments, 1)) * 100;
    const noShowRate = (noShowAppointments / Math.max(totalAppointments, 1)) * 100;

    // Time distribution
    const hourlyDistribution = Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8; // 8 AM to 7 PM
      const hourAppointments = filteredAppointments.filter(apt => {
        const aptHour = apt.date.getHours();
        return aptHour === hour;
      }).length;
      return { hour, count: hourAppointments };
    });

    // Room utilization
    const roomUtilization = rooms.map(room => {
      const roomAppointments = filteredAppointments.filter(apt => apt.roomId === room.id).length;
      const utilization = (roomAppointments / Math.max(totalAppointments, 1)) * 100;
      return { room: room.name, count: roomAppointments, utilization };
    });

    // Weekly heatmap
    const weeklyHeatmap = Array.from({ length: 7 }, (_, dayIndex) => {
      const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dayIndex];
      const hours = Array.from({ length: 12 }, (_, hourIndex) => {
        const hour = hourIndex + 8;
        const appointmentsCount = filteredAppointments.filter(apt => {
          const aptDay = apt.date.getDay();
          const aptHour = apt.date.getHours();
          return aptDay === dayIndex && aptHour === hour;
        }).length;
        
        const intensity = Math.min(appointmentsCount / rooms.length, 1); // Normalize by room count
        return { hour, count: appointmentsCount, intensity };
      });
      return { day: dayName, dayIndex, hours };
    });

    // Therapist performance
    const therapistStats = new Map();
    filteredAppointments.forEach(apt => {
      if (!therapistStats.has(apt.therapistId)) {
        therapistStats.set(apt.therapistId, {
          total: 0,
          completed: 0,
          cancelled: 0,
          noShow: 0,
          revenue: 0
        });
      }
      const stats = therapistStats.get(apt.therapistId);
      stats.total++;
      if (apt.status === 'completed') {
        stats.completed++;
        if (apt.paid) stats.revenue += apt.cost;
      } else if (apt.status === 'cancelled') {
        stats.cancelled++;
      } else if (apt.status === 'no-show') {
        stats.noShow++;
      }
    });

    return {
      basic: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        noShowAppointments,
        totalRevenue,
        averageSessionCost
      },
      rates: {
        occupancyRate,
        completionRate,
        cancellationRate,
        noShowRate
      },
      distributions: {
        hourlyDistribution,
        roomUtilization,
        weeklyHeatmap
      },
      therapistStats: Array.from(therapistStats.entries()).map(([id, stats]) => ({
        therapistId: id,
        ...stats
      }))
    };
  }, [appointments, rooms, dateRange]);

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return '#F9FAFB';
    if (intensity <= 0.25) return '#DBEAFE';
    if (intensity <= 0.5) return '#93C5FD';
    if (intensity <= 0.75) return '#3B82F6';
    return '#1D4ED8';
  };

  const getIntensityTextColor = (intensity: number) => {
    return intensity > 0.5 ? 'white' : '#374151';
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1F2937',
          margin: 0,
          marginBottom: '0.5rem',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Análisis de Agenda
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#6B7280',
          margin: 0,
          fontFamily: 'Inter, sans-serif'
        }}>
          Período: {dateRange.start.toLocaleDateString('es-ES')} - {dateRange.end.toLocaleDateString('es-ES')}
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <ClinicalCard
          title="Tasa de Ocupación"
          value={`${analytics.rates.occupancyRate.toFixed(1)}%`}
          icon={Activity}
          iconColor="#2563EB"
          trend={{
            value: 12,
            isPositive: analytics.rates.occupancyRate > 70
          }}
        />
        
        <ClinicalCard
          title="Tasa de Finalización"
          value={`${analytics.rates.completionRate.toFixed(1)}%`}
          icon={Target}
          iconColor="#10B981"
          trend={{
            value: 5,
            isPositive: analytics.rates.completionRate > 85
          }}
        />
        
        <ClinicalCard
          title="Ingresos Totales"
          value={`€${analytics.basic.totalRevenue.toFixed(2)}`}
          icon={TrendingUp}
          iconColor="#7C3AED"
          trend={{
            value: 18,
            isPositive: true
          }}
        />
        
        <ClinicalCard
          title="Costo Promedio"
          value={`€${analytics.basic.averageSessionCost.toFixed(2)}`}
          icon={BarChart3}
          iconColor="#F59E0B"
        />
        
        <ClinicalCard
          title="Tasa de Cancelación"
          value={`${analytics.rates.cancellationRate.toFixed(1)}%`}
          icon={AlertTriangle}
          iconColor="#EF4444"
          trend={{
            value: 3,
            isPositive: analytics.rates.cancellationRate < 10
          }}
        />
        
        <ClinicalCard
          title="No Presentados"
          value={`${analytics.rates.noShowRate.toFixed(1)}%`}
          icon={Users}
          iconColor="#6B7280"
          trend={{
            value: 2,
            isPositive: analytics.rates.noShowRate < 5
          }}
        />
      </div>

      {/* Metric Selector */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '0.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #E5E7EB'
      }}>
        {[
          { key: 'occupancy', label: 'Mapa de Calor', icon: Activity },
          { key: 'revenue', label: 'Ingresos', icon: TrendingUp },
          { key: 'efficiency', label: 'Eficiencia', icon: Target },
          { key: 'trends', label: 'Tendencias', icon: BarChart3 }
        ].map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            onClick={() => setSelectedMetric(key as MetricKey)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: selectedMetric === key ? '#2563EB' : 'transparent',
              color: selectedMetric === key ? 'white' : '#6B7280',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Icon size={16} />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Content based on selected metric */}
      <motion.div
        key={selectedMetric}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          padding: '2rem'
        }}
      >
        {selectedMetric === 'occupancy' && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1F2937',
              marginBottom: '1.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Mapa de Calor Semanal
            </h3>
            
            {/* Heatmap */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(12, 1fr)',
              gap: '2px',
              marginBottom: '2rem'
            }}>
              {/* Header with hours */}
              <div />
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6B7280',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {(i + 8).toString().padStart(2, '0')}:00
                </div>
              ))}
              
              {/* Days and data */}
              {analytics.distributions.weeklyHeatmap.map((day) => (
                <React.Fragment key={day.dayIndex}>
                  <div style={{
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {day.day}
                  </div>
                  
                  {day.hours.map((hour) => (
                    <motion.div
                      key={`${day.dayIndex}-${hour.hour}`}
                      whileHover={{ scale: 1.1 }}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: getIntensityColor(hour.intensity),
                        color: getIntensityTextColor(hour.intensity),
                        borderRadius: '0.25rem',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      title={`${day.day} ${hour.hour}:00 - ${hour.count} citas`}
                    >
                      {hour.count}
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.75rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              <span>Menos ocupado</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
                  <div
                    key={intensity}
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: getIntensityColor(intensity),
                      borderRadius: '2px'
                    }}
                  />
                ))}
              </div>
              <span>Más ocupado</span>
            </div>
          </div>
        )}

        {selectedMetric === 'revenue' && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1F2937',
              marginBottom: '1.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Análisis de Ingresos
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem'
            }}>
              {/* Revenue by hour */}
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Distribución por Hora
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {analytics.distributions.hourlyDistribution.map((hour) => {
                    const percentage = (hour.count / Math.max(analytics.basic.totalAppointments, 1)) * 100;
                    return (
                      <div key={hour.hour} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#374151',
                          width: '60px',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {hour.hour}:00
                        </span>
                        
                        <div style={{
                          flex: 1,
                          height: '8px',
                          backgroundColor: '#F3F4F6',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: '#2563EB',
                            borderRadius: '4px'
                          }} />
                        </div>
                        
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          width: '40px',
                          textAlign: 'right',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {hour.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Room utilization */}
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Utilización por Consultorio
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analytics.distributions.roomUtilization.map((room) => (
                    <div key={room.room} style={{
                      padding: '1rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '0.5rem',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {room.room}
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#2563EB',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {room.utilization.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div style={{
                        height: '6px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${room.utilization}%`,
                          height: '100%',
                          backgroundColor: '#10B981',
                          borderRadius: '3px'
                        }} />
                      </div>
                      
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        marginTop: '0.25rem',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {room.count} citas
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'efficiency' && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1F2937',
              marginBottom: '1.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Métricas de Eficiencia
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Completion Rate Chart */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '0.75rem',
                border: '1px solid #E2E8F0'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Estado de Citas
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#10B981',
                        borderRadius: '50%'
                      }} />
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Completadas
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {analytics.basic.completedAppointments} ({analytics.rates.completionRate.toFixed(1)}%)
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#EF4444',
                        borderRadius: '50%'
                      }} />
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Canceladas
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {analytics.basic.cancelledAppointments} ({analytics.rates.cancellationRate.toFixed(1)}%)
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#F59E0B',
                        borderRadius: '50%'
                      }} />
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        No presentados
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {analytics.basic.noShowAppointments} ({analytics.rates.noShowRate.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '0.75rem',
                border: '1px solid #E2E8F0'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Recomendaciones
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analytics.rates.cancellationRate > 15 && (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#FEF2F2',
                      borderRadius: '0.5rem',
                      border: '1px solid #FECACA'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <AlertTriangle size={14} color="#EF4444" />
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#DC2626',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Alta tasa de cancelación
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#7F1D1D',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Considera implementar recordatorios automáticos 24h antes
                      </p>
                    </div>
                  )}
                  
                  {analytics.rates.occupancyRate < 60 && (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#FFFBEB',
                      borderRadius: '0.5rem',
                      border: '1px solid #FDE68A'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <TrendingUp size={14} color="#F59E0B" />
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#92400E',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Baja ocupación
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#78350F',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Optimiza horarios en horas de menor demanda
                      </p>
                    </div>
                  )}
                  
                  {analytics.rates.completionRate > 90 && (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#ECFDF5',
                      borderRadius: '0.5rem',
                      border: '1px solid #A7F3D0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Target size={14} color="#10B981" />
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#059669',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Excelente eficiencia
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#047857',
                        margin: 0,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Mantén las prácticas actuales de gestión
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMetric === 'trends' && (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1F2937',
              marginBottom: '1.5rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Tendencias y Proyecciones
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#F8FAFC',
                borderRadius: '0.75rem',
                border: '1px solid #E2E8F0',
                textAlign: 'center'
              }}>
                <BarChart3 size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Análisis de Tendencias
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Funcionalidad en desarrollo - Próximamente disponible
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
