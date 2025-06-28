'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Gift, 
  User,
  Store,
  Calendar,
  Tag,
  Award,
  Star,
  Crown,
  Sparkles,
  TrendingUp,
  DollarSign,
  Percent,
  X,
  ExternalLink,
  Share2,
  Download,
  Heart
} from 'lucide-react';
import { ValidacionResponse } from '@/types/validacion';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ValidationResultModalProps {
  open: boolean;
  onClose: () => void;
  result: ValidacionResponse | null;
}

const ModalContainer = styled(motion.div)<{ resultType: string }>`
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  max-width: 32rem;
  width: 100%;
  box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${({ resultType }) => {
      switch (resultType) {
        case 'habilitado':
          return 'linear-gradient(90deg, #10b981, #059669, #047857)';
        case 'no_habilitado':
          return 'linear-gradient(90deg, #ef4444, #dc2626, #b91c1c)';
        case 'vencido':
          return 'linear-gradient(90deg, #f59e0b, #d97706, #b45309)';
        case 'suspendido':
          return 'linear-gradient(90deg, #f97316, #ea580c, #c2410c)';
        default:
          return 'linear-gradient(90deg, #6b7280, #4b5563, #374151)';
      }
    }};
  }
`;

const ResultHeader = styled(motion.div)<{ bgColor: string; borderColor: string }>`
  padding: 2rem;
  text-align: center;
  background: ${({ bgColor }) => bgColor};
  border-bottom: 1px solid ${({ borderColor }) => borderColor};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1), transparent 70%);
  }
`;

const ResultIcon = styled(motion.div)<{ color: string; bgColor: string }>`
  width: 5rem;
  height: 5rem;
  background: ${({ bgColor }) => bgColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: ${({ color }) => color};
  box-shadow: 0 12px 32px ${({ color }) => `${color}40`};
  position: relative;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    background: ${({ color }) => `linear-gradient(45deg, ${color}, ${color}80, ${color})`};
    border-radius: 50%;
    z-index: -1;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 0.9; }
  }
`;

const ResultTitle = styled(motion.h3)`
  font-size: 1.75rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 2;
`;

const ResultMessage = styled(motion.p)`
  color: #64748b;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const ContentSection = styled.div`
  padding: 0 2rem 2rem;
`;

const BenefitCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #10b981, #059669);
  }
`;

const BenefitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BenefitIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
`;

const BenefitInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  .title {
    font-size: 1.125rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .type {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 600;
  }
`;

const DiscountBadge = styled(motion.div)<{ tipo: string }>`
  background: ${({ tipo }) => {
    switch (tipo) {
      case 'porcentaje':
        return 'linear-gradient(135deg, #10b981, #059669)';
      case 'monto_fijo':
        return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
      case 'producto_gratis':
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default:
        return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  }};
  color: white;
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  
  .label {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    opacity: 0.9;
  }
  
  .value {
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -0.02em;
  }
`;

const SocioCard = styled(motion.div)`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SocioHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SocioAvatar = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #94a3b8, #64748b);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const SocioInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  .name {
    font-size: 1.125rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .status {
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ status }) => {
    switch (status) {
      case 'activo':
        return css`
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        `;
      case 'vencido':
        return css`
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        `;
      case 'suspendido':
        return css`
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        `;
    }
  }}
`;

const ActionsSection = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const InfoSection = styled(motion.div)`
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 1rem;
  
  .info-text {
    font-size: 0.875rem;
    color: #475569;
    font-weight: 500;
    line-height: 1.5;
    text-align: center;
  }
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const MetaItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  
  .icon {
    width: 2rem;
    height: 2rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem;
    color: white;
  }
  
  .label {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-size: 0.875rem;
    color: #1e293b;
    font-weight: 700;
  }
`;

export const ValidationResultModal: React.FC<ValidationResultModalProps> = ({
  open,
  onClose,
  result
}) => {
  if (!result) return null;

  const getResultConfig = () => {
    switch (result.resultado) {
      case 'habilitado':
        return {
          icon: CheckCircle,
          color: '#10b981',
          bgColor: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          borderColor: '#86efac',
          title: '¡Validación Exitosa!',
          message: 'Tu beneficio ha sido validado correctamente',
          buttonText: 'Continuar Comprando',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'no_habilitado':
        return {
          icon: XCircle,
          color: '#ef4444',
          bgColor: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          borderColor: '#fca5a5',
          title: 'Acceso Denegado',
          message: result.motivo || 'No tienes acceso a este beneficio',
          buttonText: 'Entendido',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'vencido':
        return {
          icon: Clock,
          color: '#f59e0b',
          bgColor: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          borderColor: '#fcd34d',
          title: 'Beneficio Vencido',
          message: result.motivo || 'Este beneficio ya no está disponible',
          buttonText: 'Ver Otros Beneficios',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'suspendido':
        return {
          icon: AlertTriangle,
          color: '#f97316',
          bgColor: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
          borderColor: '#fb923c',
          title: 'Cuenta Suspendida',
          message: result.motivo || 'Tu cuenta está temporalmente suspendida',
          buttonText: 'Contactar Soporte',
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        };
    }
  };

  const config = getResultConfig();
  const IconComponent = config.icon;

  const getDiscountText = (beneficio: any) => {
    switch (beneficio.tipo) {
      case 'porcentaje':
        return `${beneficio.descuento}%`;
      case 'monto_fijo':
        return `$${beneficio.descuento}`;
      case 'producto_gratis':
        return 'GRATIS';
      default:
        return 'DESCUENTO';
    }
  };

  const getDiscountLabel = (beneficio: any) => {
    switch (beneficio.tipo) {
      case 'porcentaje':
        return 'Descuento';
      case 'monto_fijo':
        return 'Descuento Fijo';
      case 'producto_gratis':
        return 'Producto Gratis';
      default:
        return 'Beneficio';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose}>
          <DialogContent className="max-w-lg p-0 overflow-hidden">
            <ModalContainer
              resultType={result.resultado}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <ResultHeader bgColor={config.bgColor} borderColor={config.borderColor}>
                <ResultIcon
                  color={config.color}
                  bgColor="white"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.1
                  }}
                >
                  <IconComponent size={32} />
                </ResultIcon>

                <ResultTitle
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {config.title}
                </ResultTitle>

                <ResultMessage
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {config.message}
                </ResultMessage>
              </ResultHeader>

              <ContentSection>
                {/* Información del beneficio si está habilitado */}
                {result.resultado === 'habilitado' && result.beneficio && (
                  <BenefitCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <BenefitHeader>
                      <BenefitIcon>
                        <Gift size={20} />
                      </BenefitIcon>
                      <BenefitInfo>
                        <div className="title">{result.beneficio.titulo}</div>
                        <div className="type">{result.beneficio.comercioNombre}</div>
                      </BenefitInfo>
                    </BenefitHeader>
                    
                    <DiscountBadge
                      tipo={result.beneficio.tipo}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <div className="label">{getDiscountLabel(result.beneficio)}</div>
                      <div className="value">
                        {getDiscountText(result.beneficio)}
                        {result.beneficio.tipo !== 'producto_gratis' && (
                          <span style={{ fontSize: '1rem', marginLeft: '0.25rem' }}>
                            {result.beneficio.tipo === 'porcentaje' ? 'OFF' : 'OFF'}
                          </span>
                        )}
                      </div>
                    </DiscountBadge>

                    {result.beneficio.descripcion && (
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: '#f8fafc', 
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#64748b', 
                          fontWeight: 600,
                          marginBottom: '0.25rem'
                        }}>
                          Descripción
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#1e293b', 
                          lineHeight: 1.5 
                        }}>
                          {result.beneficio.descripcion}
                        </div>
                      </div>
                    )}

                    <MetaInfo>
                      <MetaItem>
                        <div className="icon">
                          <Calendar size={12} />
                        </div>
                        <div className="label">Válido hasta</div>
                        <div className="value">
                          {result.beneficio.fechaFin 
                            ? format(result.beneficio.fechaFin.toDate(), 'dd/MM/yyyy', { locale: es })
                            : 'Sin límite'
                          }
                        </div>
                      </MetaItem>
                      
                      <MetaItem>
                        <div className="icon">
                          <Store size={12} />
                        </div>
                        <div className="label">Comercio</div>
                        <div className="value">{result.beneficio.comercioNombre}</div>
                      </MetaItem>
                    </MetaInfo>
                  </BenefitCard>
                )}

                {/* Información del socio */}
                <SocioCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: result.resultado === 'habilitado' ? 0.6 : 0.4 }}
                >
                  <SocioHeader>
                    <SocioAvatar>
                      <User size={20} />
                    </SocioAvatar>
                    <SocioInfo>
                      <div className="name">{result.socio.nombre}</div>
                      <div className="status">
                        Estado: 
                        <StatusBadge status={result.socio.estado}>
                          {result.socio.estado}
                        </StatusBadge>
                      </div>
                    </SocioInfo>
                  </SocioHeader>
                </SocioCard>

                {/* Botones de acción */}
                <ActionsSection
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: result.resultado === 'habilitado' ? 0.7 : 0.5 }}
                >
                  <Button
                    onClick={onClose}
                    className={config.buttonColor}
                    fullWidth
                    size="lg"
                  >
                    {config.buttonText}
                  </Button>
                  
                  {result.resultado === 'habilitado' && (
                    <Button
                      variant="outline"
                      leftIcon={<Share2 size={16} />}
                      size="lg"
                    >
                      <span className="sr-only">Compartir</span>
                    </Button>
                  )}
                </ActionsSection>

                {/* Información adicional para casos de error */}
                {result.resultado !== 'habilitado' && (
                  <InfoSection
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="info-text">
                      {result.resultado === 'no_habilitado' && 
                        'Contacta a tu asociación para regularizar tu situación y acceder a este beneficio.'
                      }
                      {result.resultado === 'vencido' && 
                        'Este beneficio ha expirado. Busca otros beneficios disponibles en tu cuenta.'
                      }
                      {result.resultado === 'suspendido' && 
                        'Tu cuenta está temporalmente suspendida. Ponte en contacto con soporte para resolver esta situación.'
                      }
                    </div>
                  </InfoSection>
                )}

                {/* Timestamp de validación */}
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  fontWeight: 500
                }}>
                  Validación realizada el {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
                </div>
              </ContentSection>
            </ModalContainer>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};