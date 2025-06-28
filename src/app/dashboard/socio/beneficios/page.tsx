'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { 
  Gift, 
  History, 
  TrendingUp, 
  Search, 
  Filter, 
  Star,
  Clock,
  MapPin,
  Tag,
  Zap,
  Heart,
  Eye,
  Share2,
  Bookmark,
  Calendar,
  Store,
  Percent,
  DollarSign,
  Award,
  Target,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpRight,
  Flame,
  Crown,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Gamepad2,
  Scissors,
  Dumbbell,
  GraduationCap,
  Stethoscope
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useAuth } from '@/hooks/useAuth';
import { Beneficio, BeneficioUso } from '@/types/beneficio';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Styled Components
const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const HeaderSection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #1e293b 0%, #6366f1 60%, #8b5cf6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    color: #64748b;
    font-weight: 600;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)<{ color: string; gradient: string }>`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
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

const StatIcon = styled.div<{ color: string; gradient: string }>`
  width: 4rem;
  height: 4rem;
  border-radius: 1.5rem;
  background: ${({ gradient }) => gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: 0 12px 32px ${({ color }) => `${color}40`};
`;

const StatContent = styled.div`
  .value {
    font-size: 2.5rem;
    font-weight: 900;
    color: #1e293b;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }
  
  .label {
    font-size: 1rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .description {
    font-size: 0.875rem;
    color: #94a3b8;
    font-weight: 500;
  }
`;

const StatChange = styled.div<{ trend: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  
  ${({ trend }) => {
    switch (trend) {
      case 'up':
        return css`
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        `;
      case 'down':
        return css`
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
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

const FilterSection = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .icon-container {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .title-content h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .title-content p {
    color: #64748b;
    font-weight: 600;
  }
`;

const FilterControls = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 1.5rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
`;

const Tab = styled(motion.button)<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  
  ${({ active }) => active ? css`
    background: white;
    color: #1e293b;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  ` : css`
    background: transparent;
    color: #64748b;
    
    &:hover {
      color: #1e293b;
    }
  `}
`;

const TabBadge = styled.span<{ color: string }>`
  background: ${({ color }) => color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  min-width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 1rem;
  padding: 0.25rem;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ active }) => active ? css`
    background: white;
    color: #6366f1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  ` : css`
    background: transparent;
    color: #64748b;
    
    &:hover {
      color: #1e293b;
    }
  `}
`;

const BenefitsGrid = styled(motion.div)<{ view: 'grid' | 'list' }>`
  display: grid;
  gap: 1.5rem;
  
  ${({ view }) => view === 'grid' ? css`
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  ` : css`
    grid-template-columns: 1fr;
  `}
`;

const BenefitCard = styled(motion.div)<{ featured?: boolean; view: 'grid' | 'list' }>`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ view }) => view === 'list' && css`
    display: flex;
    align-items: center;
    padding: 1.5rem;
  `}
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
  }
  
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
    }
  `}
`;

const BenefitHeader = styled.div<{ view: 'grid' | 'list' }>`
  ${({ view }) => view === 'grid' ? css`
    padding: 1.5rem 1.5rem 0;
  ` : css`
    margin-right: 1.5rem;
    min-width: 0;
    flex: 1;
  `}
`;

const BenefitBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ variant: 'category' | 'discount' | 'featured' | 'new' | 'ending' }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
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
      default:
        return css`
          background: #f1f5f9;
          color: #64748b;
        `;
    }
  }}
`;

const BenefitContent = styled.div<{ view: 'grid' | 'list' }>`
  ${({ view }) => view === 'grid' ? css`
    padding: 0 1.5rem 1.5rem;
  ` : css`
    flex: 1;
    min-width: 0;
  `}
`;

const BenefitTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const BenefitDescription = styled.p`
  color: #64748b;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const BenefitMeta = styled.div`
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

const BenefitActions = styled.div<{ view: 'grid' | 'list' }>`
  display: flex;
  gap: 0.75rem;
  
  ${({ view }) => view === 'list' && css`
    margin-left: 1rem;
    flex-shrink: 0;
  `}
`;

const ComercioInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
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
`;

const ComercioDetails = styled.div`
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
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  
  .icon {
    width: 6rem;
    height: 6rem;
    margin: 0 auto 2rem;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .description {
    color: #64748b;
    font-weight: 500;
    margin-bottom: 2rem;
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

// Mock data mejorado
const mockBeneficios: Beneficio[] = [
  {
    id: '1',
    titulo: '30% de descuento en toda la tienda',
    descripcion: 'Válido en todos los productos excepto ofertas especiales. No acumulable con otras promociones.',
    descuento: 30,
    tipo: 'porcentaje',
    comercioId: 'comercio1',
    comercioNombre: 'Fashion Store Premium',
    comercioLogo: '',
    asociacionesDisponibles: ['asociacion1'],
    fechaInicio: Timestamp.fromDate(new Date()),
    fechaFin: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    estado: 'activo',
    usosActuales: 5,
    categoria: 'Retail',
    condiciones: 'Válido de lunes a viernes. Máximo 1 uso por socio.',
    creadoEn: Timestamp.fromDate(new Date()),
    actualizadoEn: Timestamp.fromDate(new Date()),
    destacado: true
  },
  {
    id: '2',
    titulo: 'Café gratis con cualquier compra',
    descripcion: 'Un café americano gratis al comprar cualquier producto de panadería o pastelería.',
    descuento: 0,
    tipo: 'producto_gratis',
    comercioId: 'comercio2',
    comercioNombre: 'Café Central',
    comercioLogo: '',
    asociacionesDisponibles: ['asociacion1'],
    fechaInicio: Timestamp.fromDate(new Date()),
    fechaFin: Timestamp.fromDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    estado: 'activo',
    usosActuales: 12,
    categoria: 'Restaurantes',
    condiciones: 'Válido todos los días. Horario: 7:00 AM - 6:00 PM.',
    creadoEn: Timestamp.fromDate(new Date()),
    actualizadoEn: Timestamp.fromDate(new Date())
  },
  {
    id: '3',
    titulo: '$500 de descuento en servicios',
    descripcion: 'Descuento fijo en cualquier servicio de belleza y estética.',
    descuento: 500,
    tipo: 'monto_fijo',
    comercioId: 'comercio3',
    comercioNombre: 'Salón de Belleza Elegance',
    comercioLogo: '',
    asociacionesDisponibles: ['asociacion1'],
    fechaInicio: Timestamp.fromDate(new Date()),
    fechaFin: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    estado: 'activo',
    usosActuales: 3,
    categoria: 'Servicios',
    condiciones: 'Válido para servicios superiores a $2000. Reserva previa requerida.',
    creadoEn: Timestamp.fromDate(new Date()),
    actualizadoEn: Timestamp.fromDate(new Date())
  }
];

const mockBeneficiosUsados: BeneficioUso[] = [
  {
    id: 'uso1',
    beneficioId: '1',
    socioId: 'socio1',
    comercioId: 'comercio1',
    fechaUso: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    montoDescuento: 450,
    detalles: 'Compra de ropa por $1500',
    validadoPor: 'empleado1',
    creadoEn: Timestamp.fromDate(new Date()),
    actualizadoEn: Timestamp.fromDate(new Date())
  },
  {
    id: 'uso2',
    beneficioId: '2',
    socioId: 'socio1',
    comercioId: 'comercio2',
    fechaUso: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    montoDescuento: 0,
    detalles: 'Café americano gratis',
    validadoPor: 'empleado2',
    creadoEn: Timestamp.fromDate(new Date()),
    actualizadoEn: Timestamp.fromDate(new Date())
  }
];

interface FilterState {
  search: string;
  categoria: string;
  ordenar: string;
}

export default function SocioBeneficiosPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'disponibles' | 'usados'>('disponibles');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBenefit, setSelectedBenefit] = useState<Beneficio | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categoria: '',
    ordenar: 'fecha_desc'
  });

  // Datos simulados - en producción vendrían de los hooks
  const beneficiosDisponibles = mockBeneficios;
  const beneficiosUsados = mockBeneficiosUsados;
  
  // Estadísticas calculadas
  const stats = {
    disponibles: beneficiosDisponibles.length,
    usados: beneficiosUsados.length,
    ahorroTotal: beneficiosUsados.reduce((total, uso) => total + (uso.montoDescuento || 0), 0),
    ahorroEsteMes: beneficiosUsados
      .filter(uso => {
        const fechaUso = uso.fechaUso.toDate();
        const ahora = new Date();
        return fechaUso.getMonth() === ahora.getMonth() && fechaUso.getFullYear() === ahora.getFullYear();
      })
      .reduce((total, uso) => total + (uso.montoDescuento || 0), 0),
    nuevos: beneficiosDisponibles.filter(b => {
      const fechaCreacion = b.creadoEn.toDate();
      const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return fechaCreacion > hace7Dias;
    }).length,
    porVencer: beneficiosDisponibles.filter(b => {
      const fechaVencimiento = b.fechaFin.toDate();
      const en7Dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return fechaVencimiento <= en7Dias;
    }).length
  };

  // Filtrar beneficios
  const filteredBeneficios = beneficiosDisponibles.filter(beneficio => {
    const matchesSearch = beneficio.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
                         beneficio.descripcion.toLowerCase().includes(filters.search.toLowerCase()) ||
                         beneficio.comercioNombre.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.categoria || beneficio.categoria === filters.categoria;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (filters.ordenar) {
      case 'fecha_desc':
        return b.creadoEn.toDate().getTime() - a.creadoEn.toDate().getTime();
      case 'fecha_asc':
        return a.creadoEn.toDate().getTime() - b.creadoEn.toDate().getTime();
      case 'descuento_desc':
        return b.descuento - a.descuento;
      case 'descuento_asc':
        return a.descuento - b.descuento;
      case 'vencimiento':
        return a.fechaFin.toDate().getTime() - b.fechaFin.toDate().getTime();
      default:
        return 0;
    }
  });

  const categorias = Array.from(new Set(beneficiosDisponibles.map(b => b.categoria)));

  const handleUseBenefit = async (beneficioId: string) => {
    setLoading(true);
    try {
      // Simular uso del beneficio
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('¡Beneficio usado exitosamente!');
    } catch (error) {
      toast.error('Error al usar el beneficio');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (beneficio: Beneficio) => {
    setSelectedBenefit(beneficio);
    setDetailModalOpen(true);
  };

  const getCategoryIcon = (categoria: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Retail': <ShoppingBag size={20} />,
      'Restaurantes': <Utensils size={20} />,
      'Servicios': <Scissors size={20} />,
      'Entretenimiento': <Gamepad2 size={20} />,
      'Transporte': <Car size={20} />,
      'Salud': <Stethoscope size={20} />,
      'Educación': <GraduationCap size={20} />,
      'Deportes': <Dumbbell size={20} />
    };
    return icons[categoria] || <Store size={20} />;
  };

  const getComercioColor = (comercioNombre: string) => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];
    const index = comercioNombre.length % colors.length;
    return colors[index];
  };

  const getDiscountText = (beneficio: Beneficio) => {
    switch (beneficio.tipo) {
      case 'porcentaje':
        return `${beneficio.descuento}% OFF`;
      case 'monto_fijo':
        return `$${beneficio.descuento} OFF`;
      case 'producto_gratis':
        return 'GRATIS';
      default:
        return 'DESCUENTO';
    }
  };

  const isEndingSoon = (fechaFin: Timestamp) => {
    const vencimiento = fechaFin.toDate();
    const en7Dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return vencimiento <= en7Dias;
  };

  const isNew = (fechaCreacion: Timestamp) => {
    const creacion = fechaCreacion.toDate();
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return creacion > hace7Dias;
  };

  return (
    <DashboardLayout
      activeSection="beneficios"
      sidebarComponent={SocioSidebar}
    >
      <PageContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <HeaderSection variants={itemVariants}>
          <HeaderContent>
            <HeaderTitle>
              <h1>Mis Beneficios</h1>
              <p>Descubre y utiliza todos los descuentos y ofertas especiales</p>
            </HeaderTitle>
            <HeaderActions>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Search size={16} />}
              >
                Buscar Comercios
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Heart size={16} />}
              >
                Favoritos
              </Button>
              <Button
                variant="gradient"
                size="sm"
                leftIcon={<Sparkles size={16} />}
              >
                Explorar Nuevos
              </Button>
            </HeaderActions>
          </HeaderContent>
        </HeaderSection>

        {/* Stats Cards */}
        <StatsContainer variants={itemVariants}>
          <StatCard
            color="#10b981"
            gradient="linear-gradient(135deg, #10b981, #059669)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#10b981" gradient="linear-gradient(135deg, #10b981, #059669)">
              <Gift size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">{stats.disponibles}</div>
              <div className="label">Beneficios Disponibles</div>
              <div className="description">Listos para usar ahora mismo</div>
            </StatContent>
            <StatChange trend="up">
              <TrendingUp size={16} />
              +{stats.nuevos} nuevos esta semana
            </StatChange>
          </StatCard>

          <StatCard
            color="#6366f1"
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#6366f1" gradient="linear-gradient(135deg, #6366f1, #8b5cf6)">
              <TrendingUp size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">${stats.ahorroTotal.toLocaleString()}</div>
              <div className="label">Total Ahorrado</div>
              <div className="description">En todos tus beneficios usados</div>
            </StatContent>
            <StatChange trend="up">
              <DollarSign size={16} />
              ${stats.ahorroEsteMes} este mes
            </StatChange>
          </StatCard>

          <StatCard
            color="#f59e0b"
            gradient="linear-gradient(135deg, #f59e0b, #d97706)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#f59e0b" gradient="linear-gradient(135deg, #f59e0b, #d97706)">
              <History size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">{stats.usados}</div>
              <div className="label">Beneficios Usados</div>
              <div className="description">Historial de uso completo</div>
            </StatContent>
            <StatChange trend="neutral">
              <Clock size={16} />
              Último uso hace 5 días
            </StatChange>
          </StatCard>

          <StatCard
            color="#ef4444"
            gradient="linear-gradient(135deg, #ef4444, #dc2626)"
            whileHover={{ y: -8 }}
          >
            <StatIcon color="#ef4444" gradient="linear-gradient(135deg, #ef4444, #dc2626)">
              <AlertCircle size={24} />
            </StatIcon>
            <StatContent>
              <div className="value">{stats.porVencer}</div>
              <div className="label">Por Vencer</div>
              <div className="description">Vencen en los próximos 7 días</div>
            </StatContent>
            <StatChange trend="down">
              <Clock size={16} />
              ¡Úsalos pronto!
            </StatChange>
          </StatCard>
        </StatsContainer>

        {/* Filter Section */}
        <FilterSection variants={itemVariants}>
          <FilterHeader>
            <div className="title-section">
              <div className="icon-container">
                <SlidersHorizontal size={20} />
              </div>
              <div className="title-content">
                <h3>Filtros y Búsqueda</h3>
                <p>Encuentra exactamente lo que buscas</p>
              </div>
            </div>
            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={20} />
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </ViewButton>
            </ViewToggle>
          </FilterHeader>

          <FilterControls>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar beneficios
              </label>
              <Input
                placeholder="Buscar por nombre, comercio o descripción..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                leftIcon={<Search size={16} />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={filters.categoria}
                onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.ordenar}
                onChange={(e) => setFilters(prev => ({ ...prev, ordenar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="fecha_desc">Más recientes</option>
                <option value="fecha_asc">Más antiguos</option>
                <option value="descuento_desc">Mayor descuento</option>
                <option value="descuento_asc">Menor descuento</option>
                <option value="vencimiento">Por vencer</option>
              </select>
            </div>

            <Button
              variant="outline"
              leftIcon={<Filter size={16} />}
              onClick={() => setFilters({ search: '', categoria: '', ordenar: 'fecha_desc' })}
            >
              Limpiar
            </Button>
          </FilterControls>
        </FilterSection>

        {/* Tabs */}
        <TabsContainer>
          <Tab
            active={activeTab === 'disponibles'}
            onClick={() => setActiveTab('disponibles')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Gift size={20} />
            Disponibles
            <TabBadge color="#10b981">{stats.disponibles}</TabBadge>
          </Tab>
          <Tab
            active={activeTab === 'usados'}
            onClick={() => setActiveTab('usados')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <History size={20} />
            Usados
            <TabBadge color="#6366f1">{stats.usados}</TabBadge>
          </Tab>
        </TabsContainer>

        {/* Benefits Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 'disponibles' ? (
            <BenefitsGrid
              key="disponibles"
              view={viewMode}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {filteredBeneficios.length > 0 ? (
                filteredBeneficios.map((beneficio, index) => (
                  <BenefitCard
                    key={beneficio.id}
                    view={viewMode}
                    featured={beneficio.destacado}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {beneficio.destacado && (
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
                        <Badge variant="featured">
                          <Crown size={12} style={{ marginRight: '0.25rem' }} />
                          Destacado
                        </Badge>
                      </div>
                    )}

                    <BenefitHeader view={viewMode}>
                      <BenefitBadges>
                        <Badge variant="category">
                          {getCategoryIcon(beneficio.categoria)}
                          <span style={{ marginLeft: '0.5rem' }}>{beneficio.categoria}</span>
                        </Badge>
                        <Badge variant="discount">
                          {getDiscountText(beneficio)}
                        </Badge>
                        {isNew(beneficio.creadoEn) && (
                          <Badge variant="new">
                            <Sparkles size={12} style={{ marginRight: '0.25rem' }} />
                            Nuevo
                          </Badge>
                        )}
                        {isEndingSoon(beneficio.fechaFin) && (
                          <Badge variant="ending">
                            <Flame size={12} style={{ marginRight: '0.25rem' }} />
                            Por vencer
                          </Badge>
                        )}
                      </BenefitBadges>

                      <BenefitTitle>{beneficio.titulo}</BenefitTitle>
                      <BenefitDescription>{beneficio.descripcion}</BenefitDescription>

                      <BenefitMeta>
                        <MetaItem>
                          <Calendar size={16} className="icon" />
                          Vence: {format(beneficio.fechaFin.toDate(), 'dd/MM/yyyy', { locale: es })}
                        </MetaItem>
                        <MetaItem>
                          <Eye size={16} className="icon" />
                          {beneficio.usosActuales} usos
                        </MetaItem>
                      </BenefitMeta>
                    </BenefitHeader>

                    <BenefitContent view={viewMode}>
                      <BenefitActions view={viewMode}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye size={16} />}
                          onClick={() => handleViewDetails(beneficio)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<Zap size={16} />}
                          onClick={() => handleUseBenefit(beneficio.id)}
                          loading={loading}
                        >
                          Usar Ahora
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Heart size={16} />}
                        >
                          <span className="sr-only">Agregar a favoritos</span>
                        </Button>
                      </BenefitActions>
                    </BenefitContent>

                    {viewMode === 'grid' && (
                      <ComercioInfo>
                        <ComercioLogo color={getComercioColor(beneficio.comercioNombre)}>
                          {beneficio.comercioNombre.charAt(0)}
                        </ComercioLogo>
                        <ComercioDetails>
                          <div className="name">{beneficio.comercioNombre}</div>
                          <div className="location">
                            <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                            Centro Comercial
                          </div>
                        </ComercioDetails>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<ArrowUpRight size={16} />}
                        >
                          <span className="sr-only">Ver comercio</span>
                        </Button>
                      </ComercioInfo>
                    )}
                  </BenefitCard>
                ))
              ) : (
                <EmptyState
                  variants={itemVariants}
                  style={{ gridColumn: '1 / -1' }}
                >
                  <div className="icon">
                    <Search size={48} />
                  </div>
                  <div className="title">No se encontraron beneficios</div>
                  <div className="description">
                    Intenta ajustar los filtros o buscar con otros términos
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ search: '', categoria: '', ordenar: 'fecha_desc' })}
                  >
                    Limpiar Filtros
                  </Button>
                </EmptyState>
              )}
            </BenefitsGrid>
          ) : (
            <BenefitsGrid
              key="usados"
              view={viewMode}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {beneficiosUsados.length > 0 ? (
                beneficiosUsados.map((uso, index) => (
                  <BenefitCard
                    key={uso.id}
                    view={viewMode}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BenefitHeader view={viewMode}>
                      <BenefitBadges>
                        <Badge variant="category">
                          <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />
                          Usado
                        </Badge>
                        {uso.montoDescuento && uso.montoDescuento > 0 && (
                          <Badge variant="discount">
                            ${uso.montoDescuento} ahorrado
                          </Badge>
                        )}
                      </BenefitBadges>

                      <BenefitTitle>Beneficio Usado</BenefitTitle>
                      <BenefitDescription>{uso.detalles}</BenefitDescription>

                      <BenefitMeta>
                        <MetaItem>
                          <Calendar size={16} className="icon" />
                          Usado: {format(uso.fechaUso.toDate(), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </MetaItem>
                        {uso.montoDescuento && (
                          <MetaItem>
                            <DollarSign size={16} className="icon" />
                            Ahorro: ${uso.montoDescuento}
                          </MetaItem>
                        )}
                      </BenefitMeta>
                    </BenefitHeader>

                    <BenefitContent view={viewMode}>
                      <BenefitActions view={viewMode}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye size={16} />}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Share2 size={16} />}
                        >
                          Compartir
                        </Button>
                      </BenefitActions>
                    </BenefitContent>
                  </BenefitCard>
                ))
              ) : (
                <EmptyState
                  variants={itemVariants}
                  style={{ gridColumn: '1 / -1' }}
                >
                  <div className="icon">
                    <History size={48} />
                  </div>
                  <div className="title">No has usado beneficios aún</div>
                  <div className="description">
                    Cuando uses un beneficio, aparecerá aquí con los detalles del ahorro
                  </div>
                  <Button
                    variant="gradient"
                    onClick={() => setActiveTab('disponibles')}
                  >
                    Explorar Beneficios
                  </Button>
                </EmptyState>
              )}
            </BenefitsGrid>
          )}
        </AnimatePresence>

        {/* Modal de Detalles */}
        <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
          <DialogContent className="max-w-2xl">
            {selectedBenefit && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    {getCategoryIcon(selectedBenefit.categoria)}
                    {selectedBenefit.titulo}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Header del beneficio */}
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                    <ComercioLogo color={getComercioColor(selectedBenefit.comercioNombre)}>
                      {selectedBenefit.comercioNombre.charAt(0)}
                    </ComercioLogo>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedBenefit.comercioNombre}
                      </h3>
                      <p className="text-gray-600 mb-3">{selectedBenefit.categoria}</p>
                      <div className="flex gap-2">
                        <Badge variant="discount">
                          {getDiscountText(selectedBenefit)}
                        </Badge>
                        {selectedBenefit.destacado && (
                          <Badge variant="featured">
                            <Crown size={12} style={{ marginRight: '0.25rem' }} />
                            Destacado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedBenefit.descripcion}</p>
                  </div>

                  {/* Condiciones */}
                  {selectedBenefit.condiciones && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Términos y Condiciones</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedBenefit.condiciones}</p>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h5 className="font-medium text-gray-900 mb-1">Válido hasta</h5>
                      <p className="text-lg font-bold text-indigo-600">
                        {format(selectedBenefit.fechaFin.toDate(), 'dd MMMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h5 className="font-medium text-gray-900 mb-1">Usos registrados</h5>
                      <p className="text-lg font-bold text-green-600">
                        {selectedBenefit.usosActuales} veces
                      </p>
                    </div>
                  </div>

                  {/* Ubicación del comercio */}
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-blue-600" />
                      <h5 className="font-medium text-blue-900">Ubicación</h5>
                    </div>
                    <p className="text-blue-800">Centro Comercial - Local 123</p>
                    <p className="text-sm text-blue-600 mt-1">Av. Principal 456, Ciudad</p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDetailModalOpen(false)}
                    leftIcon={<X size={16} />}
                  >
                    Cerrar
                  </Button>
                  <Button
                    onClick={() => {
                      handleUseBenefit(selectedBenefit.id);
                      setDetailModalOpen(false);
                    }}
                    loading={loading}
                    leftIcon={<Zap size={16} />}
                  >
                    Usar Este Beneficio
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}
