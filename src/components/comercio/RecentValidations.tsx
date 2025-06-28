'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useBeneficios } from '@/hooks/useBeneficios';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Users,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export const RecentValidations: React.FC = () => {
  const { validaciones } = useValidaciones();
  const { beneficios } = useBeneficios();
  const router = useRouter();

  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Get recent validations (last 5)
  const recentValidations = validaciones
    .sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())
    .slice(0, 5);

  const getBeneficioTitle = (beneficioId: string) => {
    const beneficio = beneficios.find(b => b.id === beneficioId);
    return beneficio?.titulo || 'Beneficio eliminado';
  };

  const getResultIcon = (resultado: string) => {
    switch (resultado) {
      case 'valido':
        return CheckCircle;
      case 'invalido':
      case 'vencido':
      case 'agotado':
      case 'no_autorizado':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getResultColor = (resultado: string) => {
    switch (resultado) {
      case 'valido':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'invalido':
      case 'vencido':
      case 'agotado':
      case 'no_autorizado':
        return { backgroundColor: '#fecaca', color: '#991b1b' };
      default:
        return { backgroundColor: '#fef3c7', color: '#92400e' };
    }
  };

  const getResultText = (resultado: string) => {
    switch (resultado) {
      case 'valido':
        return 'Válida';
      case 'invalido':
        return 'Inválida';
      case 'vencido':
        return 'Vencido';
      case 'agotado':
        return 'Agotado';
      case 'no_autorizado':
        return 'No autorizado';
      default:
        return resultado;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
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
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#475569',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '2px'
              }}>
                Últimas validaciones
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b'
              }}>
                Actividad reciente de tu comercio
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/dashboard/comercio/validaciones')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            Ver todas
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Validations Table */}
      {recentValidations.length > 0 ? (
        <div>
          {/* Table Header - Desktop only */}
          {isDesktop && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr',
              gap: '16px',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Fecha y hora</div>
              <div>Socio</div>
              <div>Beneficio</div>
              <div>Asociación</div>
              <div>Resultado</div>
            </div>
          )}

          {/* Table Rows */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {recentValidations.map((validacion, index) => {
              const ResultIcon = getResultIcon(validacion.resultado);
              
              return (
                <motion.div
                  key={validacion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* Desktop Layout */}
                  {isDesktop ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 2fr 2fr 1.5fr 1fr',
                      gap: '16px',
                      alignItems: 'center',
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div>
                        <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                          {format(validacion.fechaHora.toDate(), 'dd/MM/yyyy')}
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>
                          {format(validacion.fechaHora.toDate(), 'HH:mm')}
                        </p>
                      </div>
                      
                      <div>
                        <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                          {validacion.socioId.substring(0, 8)}...
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>ID del socio</p>
                      </div>
                      
                      <div>
                        <p style={{ 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '14px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {getBeneficioTitle(validacion.beneficioId)}
                        </p>
                        {validacion.montoTransaccion && (
                          <p style={{ fontSize: '12px', color: '#64748b' }}>
                            ${validacion.montoTransaccion.toFixed(2)}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#64748b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {validacion.asociacionId.substring(0, 12)}...
                        </p>
                      </div>
                      
                      <div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          ...getResultColor(validacion.resultado)
                        }}>
                          <ResultIcon style={{ width: '12px', height: '12px' }} />
                          <span>{getResultText(validacion.resultado)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Mobile Layout */
                    <div style={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                            {format(validacion.fechaHora.toDate(), 'dd/MM/yyyy HH:mm')}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>
                            Socio: {validacion.socioId.substring(0, 8)}...
                          </p>
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          ...getResultColor(validacion.resultado)
                        }}>
                          <ResultIcon style={{ width: '12px', height: '12px' }} />
                          {getResultText(validacion.resultado)}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <p style={{ 
                          fontWeight: 500, 
                          color: '#1e293b',
                          fontSize: '14px'
                        }}>
                          {getBeneficioTitle(validacion.beneficioId)}
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>
                          Asociación: {validacion.asociacionId.substring(0, 15)}...
                        </p>
                        {validacion.montoTransaccion && (
                          <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                            Monto: ${validacion.montoTransaccion.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
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
            <Users style={{ width: '32px', height: '32px', color: '#94a3b8' }} />
          </div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            No hay validaciones aún
          </h4>
          <p style={{
            color: '#64748b',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            Cuando los socios empiecen a usar tus beneficios, las validaciones aparecerán aquí.
          </p>
          <button
            onClick={() => router.push('/dashboard/comercio/beneficios')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6366f1';
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Crear primer beneficio
          </button>
        </div>
      )}
    </motion.div>
  );
};