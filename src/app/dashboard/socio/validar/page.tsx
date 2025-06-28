'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { 
  QrCode,
  Zap, 
  Shield, 
  CheckCircle, 
  Info,
  Camera,
  Scan,
  Target,
  Award,
  Clock,
  MapPin,
  Store,
  User,
  History,
  TrendingUp,
  Sparkles,
  Star,
  Gift,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Wifi,
  Lock,
  Eye,
  Heart,
  Crown,
  Flame
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { QRScannerButton } from '@/components/socio/QRScannerButton';
import { ValidationResultModal } from '@/components/socio/ValidationResultModal';
import { ValidacionesService } from '@/services/validaciones.service';
import { ValidacionResponse } from '@/types/validacion';
import { useAuth } from '@/hooks/useAuth';
import { useValidaciones } from '@/hooks/useValidaciones';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Styled Components
const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const HeaderSection = styled(motion.div)`
  margin-bottom: 3rem;
  text-align: center;
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #1e293b 0%, #6366f1 60%, #8b5cf6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    color: #64748b;
    font-weight: 600;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ScannerCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 3rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const ScannerIcon = styled(motion.div)`
  width: 6rem;
  height: 6rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #6366f1);
    border-radius: 2rem;
    z-index: -1;
    animation: rotate 3s linear infinite;
    opacity: 0.7;
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ScannerTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const ScannerDescription = styled.p`
  color: #64748b;
  font-weight: 500;
  font-size: 1.125rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const StatsCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .icon-container {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #10b981, #059669);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .title-content h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .title-content p {
    color: #64748b;
    font-weight: 600;
    font-size: 0.875rem;
  }
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatItem = styled(motion.div)<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${({ color }) => `linear-gradient(135deg, ${color}10, ${color}05)`};
  border: 1px solid ${({ color }) => `${color}20`};
  border-radius: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(4px);
    border-color: ${({ color }) => `${color}40`};
  }
  
  .content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .icon {
    width: 2rem;
    height: 2rem;
    background: ${({ color }) => color};
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .text {
    .label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 600;
    }
    
    .value {
      font-size: 1rem;
      color: #1e293b;
      font-weight: 700;
    }
  }
  
  .badge {
    background: ${({ color }) => color};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 800;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled(motion.div)<{ color: string; gradient: string }>`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 80px -20px ${({ color }) => `${color}30`};
    border-color: ${({ color }) => `${color}40`};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ gradient }) => gradient};
  }
`;

const FeatureIcon = styled.div<{ color: string; gradient: string }>`
  width: 4rem;
  height: 4rem;
  background: ${({ gradient }) => gradient};
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  box-shadow: 0 12px 32px ${({ color }) => `${color}40`};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  font-weight: 500;
  line-height: 1.5;
`;

const InstructionsCard = styled(motion.div)`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #93c5fd;
  border-radius: 2rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  }
`;

const InstructionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .icon-container {
    width: 3rem;
    height: 3rem;
    background: #3b82f6;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e40af;
  }
`;

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InstructionStep = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  .step-number {
    width: 2rem;
    height: 2rem;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  .step-content {
    flex: 1;
    
    .step-title {
      font-size: 1rem;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 0.25rem;
    }
    
    .step-description {
      color: #1e40af;
      font-weight: 500;
      line-height: 1.5;
    }
  }
`;

const RecentValidationsCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const ValidationItem = styled(motion.div)<{ status: 'success' | 'error' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  ${({ status }) => {
    switch (status) {
      case 'success':
        return css`
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border: 1px solid #86efac;
          
          &:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
          }
        `;
      case 'error':
        return css`
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border: 1px solid #fca5a5;
          
          &:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2);
          }
        `;
      case 'warning':
        return css`
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1px solid #fcd34d;
          
          &:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
          }
        `;
    }
  }}
  
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    
    ${({ status }) => {
      switch (status) {
        case 'success':
          return css`background: #10b981;`;
        case 'error':
          return css`background: #ef4444;`;
        case 'warning':
          return css`background: #f59e0b;`;
      }
    }}
  }
  
  .content {
    flex: 1;
    min-width: 0;
    
    .title {
      font-weight: 700;
      margin-bottom: 0.25rem;
      
      ${({ status }) => {
        switch (status) {
          case 'success':
            return css`color: #166534;`;
          case 'error':
            return css`color: #991b1b;`;
          case 'warning':
            return css`color: #92400e;`;
        }
      }}
    }
    
    .description {
      font-size: 0.875rem;
      font-weight: 500;
      
      ${({ status }) => {
        switch (status) {
          case 'success':
            return css`color: #166534;`;
          case 'error':
            return css`color: #991b1b;`;
          case 'warning':
            return css`color: #92400e;`;
        }
      }}
    }
  }
  
  .time {
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0.8;
    
    ${({ status }) => {
      switch (status) {
        case 'success':
          return css`color: #166534;`;
        case 'error':
          return css`color: #991b1b;`;
        case 'warning':
          return css`color: #92400e;`;
      }
    }}
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Mock data para validaciones recientes
const mockRecentValidations = [
  {
    id: '1',
    comercio: 'Café Central',
    beneficio: 'Café gratis',
    status: 'success' as const,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    ahorro: 0
  },
  {
    id: '2',
    comercio: 'Fashion Store',
    beneficio: '30% descuento',
    status: 'success' as const,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    ahorro: 450
  },
  {
    id: '3',
    comercio: 'Restaurante Gourmet',
    beneficio: '20% descuento',
    status: 'error' as const,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    ahorro: 0
  }
];

export default function SocioValidarPage() {
  const { user } = useAuth();
  const { validaciones, stats, loading } = useValidaciones();
  const [validationResult, setValidationResult] = useState<ValidacionResponse | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);

  const handleQRScan = async (qrData: string) => {
    setScannerLoading(true);
    try {
      const parsedData = ValidacionesService.parseQRData(qrData);
      if (!parsedData) {
        throw new Error('Código QR inválido');
      }

      const result = await ValidacionesService.validarAcceso({
        socioId: user?.uid || '',
        comercioId: parsedData.comercioId,
        beneficioId: parsedData.beneficioId
      });

      setValidationResult(result);
      setValidationModalOpen(true);
      
      if (result.resultado === 'habilitado') {
        toast.success('¡Validación exitosa!');
      } else {
        toast.error('Validación fallida');
      }
    } catch (error) {
      console.error('Error validating QR:', error);
      toast.error('Error al validar el código QR');
    } finally {
      setScannerLoading(false);
    }
  };

  // Estadísticas calculadas
  const calculatedStats = {
    validacionesHoy: mockRecentValidations.filter(v => {
      const today = new Date();
      const validationDate = v.timestamp;
      return validationDate.toDateString() === today.toDateString();
    }).length,
    validacionesExitosas: mockRecentValidations.filter(v => v.status === 'success').length,
    ahorroTotal: mockRecentValidations.reduce((total, v) => total + v.ahorro, 0),
    ultimaValidacion: mockRecentValidations.length > 0 ? mockRecentValidations[0].timestamp : null
  };

  return (
    <>
      <DashboardLayout
        activeSection="validar"
        sidebarComponent={SocioSidebar}
      >
        <PageContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <HeaderSection variants={itemVariants}>
            <HeaderTitle>
              <h1>Validar Beneficio</h1>
              <p>
                Escanea el código QR del comercio para acceder a tus descuentos y ofertas especiales de forma rápida y segura.
              </p>
            </HeaderTitle>
          </HeaderSection>

          {/* Main Content */}
          <MainContent>
            {/* Scanner Card */}
            <ScannerCard variants={itemVariants}>
              <ScannerIcon
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <QrCode size={48} />
              </ScannerIcon>
              
              <ScannerTitle>¿Listo para ahorrar?</ScannerTitle>
              
              <ScannerDescription>
                Solicita al comercio que muestre su código QR y escanéalo para validar tu acceso a los beneficios disponibles.
              </ScannerDescription>

              <QRScannerButton onScan={handleQRScan} loading={scannerLoading} />
              
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<History size={16} />}
                >
                  Ver Historial
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCw size={16} />}
                >
                  Actualizar
                </Button>
              </div>
            </ScannerCard>

            {/* Stats Card */}
            <StatsCard variants={itemVariants}>
              <StatsHeader>
                <div className="icon-container">
                  <TrendingUp size={20} />
                </div>
                <div className="title-content">
                  <h3>Tus Estadísticas</h3>
                  <p>Actividad de validaciones</p>
                </div>
              </StatsHeader>

              <StatsList>
                <StatItem
                  color="#10b981"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="content">
                    <div className="icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="text">
                      <div className="label">Validaciones Hoy</div>
                      <div className="value">{calculatedStats.validacionesHoy}</div>
                    </div>
                  </div>
                  <div className="badge">{calculatedStats.validacionesHoy}</div>
                </StatItem>

                <StatItem
                  color="#6366f1"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="content">
                    <div className="icon">
                      <Award size={16} />
                    </div>
                    <div className="text">
                      <div className="label">Exitosas</div>
                      <div className="value">{calculatedStats.validacionesExitosas}</div>
                    </div>
                  </div>
                  <div className="badge">{calculatedStats.validacionesExitosas}</div>
                </StatItem>

                <StatItem
                  color="#f59e0b"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="content">
                    <div className="icon">
                      <Target size={16} />
                    </div>
                    <div className="text">
                      <div className="label">Ahorro Total</div>
                      <div className="value">${calculatedStats.ahorroTotal}</div>
                    </div>
                  </div>
                  <div className="badge">${calculatedStats.ahorroTotal}</div>
                </StatItem>

                <StatItem
                  color="#8b5cf6"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="content">
                    <div className="icon">
                      <Clock size={16} />
                    </div>
                    <div className="text">
                      <div className="label">Última Validación</div>
                      <div className="value">
                        {calculatedStats.ultimaValidacion 
                          ? format(calculatedStats.ultimaValidacion, 'HH:mm', { locale: es })
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                </StatItem>
              </StatsList>
            </StatsCard>
          </MainContent>

          {/* Features Grid */}
          <FeaturesGrid>
            <FeatureCard
              color="#10b981"
              gradient="linear-gradient(135deg, #10b981, #059669)"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <FeatureIcon color="#10b981" gradient="linear-gradient(135deg, #10b981, #059669)">
                <Shield size={32} />
              </FeatureIcon>
              <FeatureTitle>100% Seguro</FeatureTitle>
              <FeatureDescription>
                Todas las validaciones están protegidas con encriptación de extremo a extremo para garantizar tu seguridad.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              color="#6366f1"
              gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <FeatureIcon color="#6366f1" gradient="linear-gradient(135deg, #6366f1, #8b5cf6)">
                <Zap size={32} />
              </FeatureIcon>
              <FeatureTitle>Instantáneo</FeatureTitle>
              <FeatureDescription>
                La validación se procesa en tiempo real. Escanea y obtén tu descuento inmediatamente.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              color="#f59e0b"
              gradient="linear-gradient(135deg, #f59e0b, #d97706)"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <FeatureIcon color="#f59e0b" gradient="linear-gradient(135deg, #f59e0b, #d97706)">
                <Smartphone size={32} />
              </FeatureIcon>
              <FeatureTitle>Fácil de Usar</FeatureTitle>
              <FeatureDescription>
                Interfaz intuitiva y simple. Solo escanea el código QR y listo, sin complicaciones.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>

          {/* Instructions */}
          <InstructionsCard variants={itemVariants}>
            <InstructionsHeader>
              <div className="icon-container">
                <Info size={20} />
              </div>
              <h3>¿Cómo funciona la validación?</h3>
            </InstructionsHeader>

            <InstructionsList>
              <InstructionStep
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-title">Dirígete al comercio</div>
                  <div className="step-description">
                    Ve al comercio afiliado donde quieres usar tu beneficio y realiza tu compra normalmente.
                  </div>
                </div>
              </InstructionStep>

              <InstructionStep
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-title">Solicita el código QR</div>
                  <div className="step-description">
                    Pide al personal que muestre el código QR del establecimiento para validar tu beneficio.
                  </div>
                </div>
              </InstructionStep>

              <InstructionStep
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-title">Escanea y ahorra</div>
                  <div className="step-description">
                    Usa el botón de arriba para escanear el código y obtén tu descuento instantáneamente.
                  </div>
                </div>
              </InstructionStep>
            </InstructionsList>
          </InstructionsCard>

          {/* Recent Validations */}
          <RecentValidationsCard variants={itemVariants}>
            <StatsHeader>
              <div className="icon-container">
                <History size={20} />
              </div>
              <div className="title-content">
                <h3>Validaciones Recientes</h3>
                <p>Tu actividad de los últimos días</p>
              </div>
            </StatsHeader>

            {mockRecentValidations.length > 0 ? (
              <div>
                {mockRecentValidations.map((validation, index) => (
                  <ValidationItem
                    key={validation.id}
                    status={validation.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="icon">
                      {validation.status === 'success' && <CheckCircle size={20} />}
                      {validation.status === 'error' && <AlertCircle size={20} />}
                      {validation.status === 'warning' && <Clock size={20} />}
                    </div>
                    <div className="content">
                      <div className="title">{validation.comercio}</div>
                      <div className="description">
                        {validation.beneficio}
                        {validation.ahorro > 0 && ` - Ahorraste $${validation.ahorro}`}
                      </div>
                    </div>
                    <div className="time">
                      {format(validation.timestamp, 'dd/MM HH:mm', { locale: es })}
                    </div>
                  </ValidationItem>
                ))}
                
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <Button
                    variant="outline"
                    leftIcon={<Eye size={16} />}
                  >
                    Ver Historial Completo
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                  borderRadius: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#94a3b8'
                }}>
                  <History size={24} />
                </div>
                <h4 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                  No hay validaciones recientes
                </h4>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Cuando valides un beneficio, aparecerá aquí tu historial
                </p>
                <Button
                  variant="gradient"
                  leftIcon={<QrCode size={16} />}
                  onClick={() => document.querySelector('button')?.click()}
                >
                  Hacer Primera Validación
                </Button>
              </div>
            )}
          </RecentValidationsCard>
        </PageContainer>
      </DashboardLayout>

      <ValidationResultModal
        open={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        result={validationResult}
      />
    </>
  );
}