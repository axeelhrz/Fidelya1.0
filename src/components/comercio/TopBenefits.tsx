'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { Gift, TrendingUp, Award, Star } from 'lucide-react';

export const TopBenefits: React.FC = () => {
  const { beneficios } = useBeneficios();
  const { validaciones } = useValidaciones();

  // Calculate benefit usage
  const benefitUsage = beneficios.map(beneficio => {
    const usos = validaciones.filter(v => v.beneficioId === beneficio.id && v.resultado === 'valido').length;
    return {
      ...beneficio,
      usos,
      porcentaje: 0 // Will be calculated after sorting
    };
  }).sort((a, b) => b.usos - a.usos).slice(0, 5);

  // Calculate percentages based on the most used benefit
  const maxUsos = benefitUsage[0]?.usos || 1;
  benefitUsage.forEach(benefit => {
    benefit.porcentaje = (benefit.usos / maxUsos) * 100;
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'inactivo':
        return { backgroundColor: '#f1f5f9', color: '#475569' };
      case 'vencido':
        return { backgroundColor: '#fecaca', color: '#991b1b' };
      case 'agotado':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#475569' };
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      case 'vencido':
        return 'Vencido';
      case 'agotado':
        return 'Agotado';
      default:
        return estado;
    }
  };

  const getRankingStyle = (index: number) => {
    switch (index) {
      case 0:
        return { backgroundColor: '#f59e0b', color: 'white' };
      case 1:
        return { backgroundColor: '#9ca3af', color: 'white' };
      case 2:
        return { backgroundColor: '#92400e', color: 'white' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#64748b' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#8b5cf6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Gift style={{ width: '20px', height: '20px', color: 'white' }} />
        </div>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '2px'
          }}>
            Beneficios más canjeados
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            Top 5 beneficios por uso
          </p>
        </div>
      </div>

      {/* Benefits List */}
      {benefitUsage.length > 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {benefitUsage.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease'
              }}>
                {/* Ranking */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  ...getRankingStyle(index)
                }}>
                  {index === 0 ? <Award style={{ width: '16px', height: '16px' }} /> : index + 1}
                </div>

                {/* Benefit Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <h4 style={{
                      fontWeight: 600,
                      color: '#1e293b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '14px'
                    }}>
                      {benefit.titulo}
                    </h4>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500,
                      ...getStatusColor(benefit.estado)
                    }}>
                      {getStatusText(benefit.estado)}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '8px'
                  }}>
                    {benefit.asociacionesVinculadas.length} asociación{benefit.asociacionesVinculadas.length !== 1 ? 'es' : ''}
                  </p>

                  {/* Progress Bar */}
                  <div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${benefit.porcentaje}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        style={{
                          height: '100%',
                          backgroundColor: '#8b5cf6',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '4px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: '#94a3b8'
                      }}>
                        {benefit.porcentaje.toFixed(0)}% del más usado
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#64748b'
                      }}>
                        {benefit.usos} uso{benefit.usos !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Count */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#8b5cf6',
                    marginBottom: '2px'
                  }}>
                    <TrendingUp style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '20px', fontWeight: 700 }}>{benefit.usos}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>canjes</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '48px 0'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f1f5f9',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Star style={{ width: '32px', height: '32px', color: '#94a3b8' }} />
          </div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            No hay datos de uso
          </h4>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Cuando tengas validaciones, aquí verás tus beneficios más populares.
          </p>
        </div>
      )}
    </motion.div>
  );
};