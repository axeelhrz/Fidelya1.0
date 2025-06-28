'use client';

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';
import { 
  Store, 
  Calendar, 
  Tag, 
  Eye, 
  CheckCircle, 
  MapPin,
  Zap,
  Heart,
  Share2,
  ArrowUpRight,
  Crown,
  Sparkles,
  Flame,
  DollarSign,
  Percent,
  Gift,
  X
} from 'lucide-react';
import { Beneficio, BeneficioUso } from '@/types/beneficio';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BenefitsCardProps {
  beneficio?: Beneficio;
  beneficioUso?: BeneficioUso;
  tipo: 'disponible' | 'usado';
  onUse?: (beneficioId: string) => void;
  view?: 'grid' | 'list';
}

const CardContainer = styled(motion.div)<{ 
  tipo: 'disponible' | 'usado'; 
  featured?: boolean;
  view: 'grid' | 'list';
}>`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ view }) => view === 'list' && css`
    display: flex;
    align-items: stretch;
  `}
  
  ${({ tipo }) => tipo === 'usado' && css`
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-color: #e2e8f0;
  `}
  
  ${({ featured }) => featured && css`
    border: 2px solid #fbbf24;
    box-shadow: 0 25px 80px -20px rgba(251, 191, 36, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #fbbf24, #f59e0b, #d97706);
      z-index: 1;
    }
  `}
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

const CardHeader = styled.div<{ view: 'grid' | 'list'; tipo: 'disponible' | 'usado' }>`
  ${({ view }) => view === 'grid' ? css`
    padding: 1.5rem 1.5rem 0;
  ` : css`
    padding: 1.5rem;
    flex: 1;
    min-width: 0;
  `}
  
  ${({ tipo }) => tipo === 'usado' && css`
    opacity: 0.8;
  `}
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
`;

const Badge = styled.span<{ variant: 'category' | 'discount' | 'featured' | 'new' | 'ending' | 'used' }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  ${({ variant }) => {
    switch (variant) {
      case 'category':
        return css`
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          color: #3730a3;
          border: 1px solid #a5b4fc;
        `;
      case 'discount':
        return css`
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        `;
      case 'featured':
        return css`
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        `;
      case 'new':
        return css`
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        `;
      case 'ending':
        return css`
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        `;
      case 'used':
        return css`
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #64748b;
        `;
    }
  }}
`;

const CardTitle = styled.h3<{ tipo: 'disponible' | 'usado' }>`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ tipo }) => tipo === 'disponible' ? '#1e293b' : '#64748b'};
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const CardDescription = styled.p<{ tipo: 'disponible' | 'usado' }>`
  color: ${({ tipo }) => tipo === 'disponible' ? '#64748b' : '#94a3b8'};
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  
  .icon {
    color: #94a3b8;
  }
`;

const CardContent = styled.div<{ view: 'grid' | 'list' }>`
  ${({ view }) => view === 'grid' ? css`
    padding: 0 1.5rem 1.5rem;
  ` : css`
    padding: 1.5rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  `}
`;

const ActionsContainer = styled.div<{ view: 'grid' | 'list' }>`
  display: flex;
  gap: 0.75rem;
  
  ${({ view }) => view === 'list' && css`
    flex-direction: column;
    min-width: 200px;
  `}
`;

const ComercioSection = styled.div<{ view: 'grid' | 'list' }>`
  ${({ view }) => view === 'grid' && css`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 1px solid #e2e8f0;
    margin-top: auto;
  `}
`;

const ComercioLogo = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: ${({ color }) => `linear-gradient(135deg, ${color}, ${color}dd)`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px ${({ color }) => `${color}40`};
`;

const ComercioInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  .name {
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .location {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const FeaturedBadge = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
`;

export const BenefitsCard: React.FC<BenefitsCardProps> = ({
  beneficio,
  beneficioUso,
  tipo,
  onUse,
  view = 'grid'
}) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Para beneficios usados, necesitamos obtener la info del beneficio
  const data = beneficio || (beneficioUso ? {
    id: beneficioUso.beneficioId,
    titulo: 'Beneficio Usado',
    descripcion: beneficioUso.detalles || 'Beneficio utilizado anteriormente',
    descuento: 0,
    tipo: 'porcentaje' as const,
    comercioNombre: 'Comercio',
    categoria: 'General',
    fechaFin: beneficioUso.fechaUso,
    destacado: false
  } : null);

  if (!data) return null;

  const isDisponible = tipo === 'disponible';
  const fechaUso = beneficioUso?.fechaUso?.toDate();
  const fechaVencimiento = beneficio?.fechaFin?.toDate();

  const getDiscountText = () => {
    if (data.tipo === 'porcentaje') {
      return `${data.descuento}% OFF`;
    } else if (data.tipo === 'monto_fijo') {
      return `$${data.descuento} OFF`;
    } else {
      return 'GRATIS';
    }
  };

  const getCategoryIcon = (categoria: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Retail': <Store size={14} />,
      'Restaurantes': <Gift size={14} />,
      'Servicios': <Zap size={14} />,
      'Entretenimiento': <Sparkles size={14} />
    };
    return icons[categoria] || <Store size={14} />;
  };

  const getComercioColor = (comercioNombre: string) => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
    const index = comercioNombre.length % colors.length;
    return colors[index];
  };

  const isEndingSoon = (fechaFin: Date | { toDate: () => Date } | undefined) => {
    if (!fechaFin) return false;
    let vencimiento: Date;
    if (fechaFin instanceof Date) {
      vencimiento = fechaFin;
    } else if (typeof fechaFin.toDate === 'function') {
      vencimiento = fechaFin.toDate();
    } else {
      return false;
    }
    const en7Dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return vencimiento <= en7Dias;
  };

  const isNew = (fechaCreacion: { toDate: () => Date } | undefined) => {
    if (!fechaCreacion || !fechaCreacion.toDate) return false;
    const creacion = fechaCreacion.toDate();
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return creacion > hace7Dias;
  };

  const handleUse = async () => {
    if (!onUse) return;
    setLoading(true);
    try {
      await onUse(data.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CardContainer
        tipo={tipo}
        featured={beneficio?.destacado}
        view={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {beneficio?.destacado && (
          <FeaturedBadge
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="featured">
              <Crown size={12} />
              Destacado
            </Badge>
          </FeaturedBadge>
        )}

        <CardHeader view={view} tipo={tipo}>
          <BadgesContainer>
            <Badge variant="category">
              {getCategoryIcon(data.categoria)}
              {data.categoria}
            </Badge>
            
            {isDisponible ? (
              <Badge variant="discount">
                {data.tipo === 'porcentaje' && <Percent size={12} />}
                {data.tipo === 'monto_fijo' && <DollarSign size={12} />}
                {data.tipo === 'producto_gratis' && <Gift size={12} />}
                {getDiscountText()}
              </Badge>
            ) : (
              <Badge variant="used">
                <CheckCircle size={12} />
                Usado
              </Badge>
            )}
            
            {beneficio && isNew(beneficio.creadoEn) && (
              <Badge variant="new">
                <Sparkles size={12} />
                Nuevo
              </Badge>
            )}
            
            {beneficio && isEndingSoon(beneficio.fechaFin) && (
              <Badge variant="ending">
                <Flame size={12} />
                Por vencer
              </Badge>
            )}
          </BadgesContainer>

          <CardTitle tipo={tipo}>{data.titulo}</CardTitle>
          <CardDescription tipo={tipo}>{data.descripcion}</CardDescription>

          <MetaInfo>
            <MetaItem>
              <Calendar size={16} className="icon" />
              {isDisponible && fechaVencimiento ? (
                <span>Vence: {format(fechaVencimiento, 'dd/MM/yyyy', { locale: es })}</span>
              ) : fechaUso ? (
                <span>Usado: {format(fechaUso, 'dd/MM/yyyy', { locale: es })}</span>
              ) : null}
            </MetaItem>
            
            {beneficio?.usosActuales && (
              <MetaItem>
                <Eye size={16} className="icon" />
                <span>{beneficio.usosActuales} usos</span>
              </MetaItem>
            )}
            
            {beneficioUso?.montoDescuento && beneficioUso.montoDescuento > 0 && (
              <MetaItem>
                <Tag size={16} className="icon" />
                <span>Ahorraste: ${beneficioUso.montoDescuento}</span>
              </MetaItem>
            )}
          </MetaInfo>
        </CardHeader>

        <CardContent view={view}>
          <ActionsContainer view={view}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Eye size={16} />}
              onClick={() => setDetailModalOpen(true)}
            >
              Ver Detalles
            </Button>
            
            {isDisponible && onUse && (
              <Button
                size="sm"
                leftIcon={<Zap size={16} />}
                onClick={handleUse}
                loading={loading}
              >
                Usar Ahora
              </Button>
            )}
            
            {!isDisponible && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 size={16} />}
              >
                Compartir
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Heart size={16} />}
            >
              <span className="sr-only">Favorito</span>
            </Button>
          </ActionsContainer>
        </CardContent>

        {view === 'grid' && isDisponible && (
          <ComercioSection view={view}>
            <ComercioLogo color={getComercioColor(data.comercioNombre)}>
              {data.comercioNombre.charAt(0)}
            </ComercioLogo>
            <ComercioInfo>
              <div className="name">{data.comercioNombre}</div>
              <div className="location">
                <MapPin size={14} />
                Centro Comercial
              </div>
            </ComercioInfo>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowUpRight size={16} />}
            >
              <span className="sr-only">Ver comercio</span>
            </Button>
          </ComercioSection>
        )}
      </CardContainer>

      {/* Modal de detalles */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {getCategoryIcon(data.categoria)}
              {data.titulo}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <ComercioLogo color={getComercioColor(data.comercioNombre)}>
                {data.comercioNombre.charAt(0)}
              </ComercioLogo>
              <div>
                <h4 className="font-semibold text-gray-900">{data.comercioNombre}</h4>
                <p className="text-sm text-gray-500">{data.categoria}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Descripción</h5>
              <p className="text-sm text-gray-600">{data.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Descuento</h5>
                <p className="text-lg font-bold text-emerald-600">{getDiscountText()}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Estado</h5>
                <p className={`text-sm font-medium ${isDisponible ? 'text-green-600' : 'text-gray-600'}`}>
                  {isDisponible ? 'Disponible' : 'Usado'}
                </p>
              </div>
            </div>

            {beneficio?.condiciones && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Condiciones</h5>
                <p className="text-sm text-gray-600">{beneficio.condiciones}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailModalOpen(false)}
              leftIcon={<X size={16} />}
            >
              Cerrar
            </Button>
            {isDisponible && onUse && (
              <Button
                onClick={() => {
                  handleUse();
                  setDetailModalOpen(false);
                }}
                loading={loading}
                leftIcon={<Zap size={16} />}
              >
                Usar Beneficio
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};