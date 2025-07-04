'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { 
  User, 
  Edit3, 
  Mail, 
  Phone, 
  Calendar, 
  Settings,
  Save,
  X,
  RefreshCw,
  Building2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Target,
  Activity,
  Bell,
  Shield,
  Palette,
  Camera,
  Download,
  Star,
  Zap,
  Heart,
  Crown,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  HelpCircle,
  Copy,
  Check,
  QrCode,
  Share2,
  RotateCcw,
  Archive,
  Trash2,
  Cake,
  Home,
  IdCard,
  Languages,
  DollarSign,
  Clock3,
  Shield as ShieldIcon,
  Database,
  BarChart3,
  Smartphone as DeviceIcon
} from 'lucide-react';
import Image from 'next/image';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import UnifiedMetricsCard from '@/components/ui/UnifiedMetricsCard';
import { ProfileImageUploader } from '@/components/socio/ProfileImageUploader';
import { ActivityTimeline } from '@/components/socio/ActivityTimeline';
import { useSocioProfile } from '@/hooks/useSocioProfile';
import { useAuth } from '@/hooks/useAuth';
import { SocioConfiguration } from '@/types/socio';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Styled Components con CSS-in-JS moderno
const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const HeaderSection = styled(motion.div)`
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  
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
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const ProfileHeader = styled.div`
  height: 10rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 8rem;
    height: 8rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
`;

const ProfileHeaderActions = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 0.75rem;
`;

const ProfileContent = styled.div`
  padding: 2rem;
`;

const ProfileAvatarSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: -5rem;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  bottom: -0.25rem;
  left: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  ${({ status }) => {
    switch (status) {
      case 'activo':
        return css`background: linear-gradient(135deg, #10b981, #059669);`;
      case 'vencido':
        return css`background: linear-gradient(135deg, #f59e0b, #d97706);`;
      case 'inactivo':
        return css`background: linear-gradient(135deg, #ef4444, #dc2626);`;
      default:
        return css`background: linear-gradient(135deg, #6b7280, #4b5563);`;
    }
  }}
`;

const LevelBadge = styled.div<{ level: string }>`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  
  ${({ level }) => {
    switch (level) {
      case 'Bronze':
        return css`background: linear-gradient(135deg, #cd7f32, #b8860b);`;
      case 'Silver':
        return css`background: linear-gradient(135deg, #c0c0c0, #a8a8a8);`;
      case 'Gold':
        return css`background: linear-gradient(135deg, #ffd700, #ffb347);`;
      case 'Platinum':
        return css`background: linear-gradient(135deg, #e5e4e2, #d3d3d3);`;
      case 'Diamond':
        return css`background: linear-gradient(135deg, #b9f2ff, #87ceeb);`;
      default:
        return css`background: linear-gradient(135deg, #6b7280, #4b5563);`;
    }
  }}
`;

const UserInfo = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
  
  .status-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .status-text {
    font-size: 1.125rem;
    color: #64748b;
    font-weight: 600;
  }
`;

const StatusChip = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  border: 2px solid;
  
  ${({ status }) => {
    switch (status) {
      case 'activo':
        return css`
          background: #dcfce7;
          color: #166534;
          border-color: #bbf7d0;
        `;
      case 'vencido':
        return css`
          background: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
        `;
      case 'inactivo':
        return css`
          background: #fee2e2;
          color: #991b1b;
          border-color: #fecaca;
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #475569;
          border-color: #e2e8f0;
        `;
    }
  }}
`;

const LevelProgress = styled.div`
  margin-bottom: 1.5rem;
  
  .progress-bar {
    background: #f1f5f9;
    border-radius: 1rem;
    height: 0.75rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
    position: relative;
  }
  
  .progress-fill {
    height: 100%;
    border-radius: 1rem;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s infinite;
    }
  }
  
  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 600;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const InfoIcon = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => `linear-gradient(135deg, ${color}20, ${color}10)`};
  color: ${({ color }) => color};
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
  
  .label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-size: 1rem;
    color: #1e293b;
    font-weight: 700;
    word-break: break-word;
  }
`;

const InfoAction = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #64748b;
    background: #f1f5f9;
    transform: scale(1.1);
  }
`;

const StatsCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
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
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
  }
`;

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
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
  
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const AdditionalMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f5f9;
`;

const MetricCard = styled.div<{ color: string }>`
  text-align: center;
  padding: 1.5rem;
  background: ${({ color }) => `linear-gradient(135deg, ${color}10, ${color}05)`};
  border-radius: 1.5rem;
  border: 2px solid ${({ color }) => `${color}20`};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px ${({ color }) => `${color}30`};
    border-color: ${({ color }) => `${color}40`};
  }
  
  .icon-container {
    width: 3rem;
    height: 3rem;
    background: ${({ color }) => color};
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: white;
  }
  
  .value {
    font-size: 1.75rem;
    font-weight: 900;
    color: ${({ color }) => color};
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 600;
  }
`;

const SideCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 2rem;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const SideCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  .icon-container {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .title-content h3 {
    font-size: 1.125rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.125rem;
  }
  
  .title-content p {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 600;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuickActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: left;
  
  &:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    transform: translateX(4px);
    border-color: #cbd5e1;
    color: #334155;
  }
  
  .icon {
    color: #6366f1;
  }
  
  .text {
    flex: 1;
  }
  
  .arrow {
    color: #94a3b8;
    transition: transform 0.2s ease;
  }
  
  &:hover .arrow {
    transform: translateX(4px);
  }
`;

const TipsCard = styled(motion.div)`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #93c5fd;
  border-radius: 2rem;
  padding: 1.5rem;
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
  
  h3 {
    font-size: 1.125rem;
    font-weight: 800;
    color: #1e40af;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TipItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.5;
  
  .icon-container {
    width: 1.5rem;
    height: 1.5rem;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: white;
  }
  
  .text {
    font-weight: 600;
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


interface ProfileFormData {
  nombre: string;
  telefono: string;
  dni: string;
  direccion: string;
  fechaNacimiento?: Date;
}

export default function SocioPerfilPage() {
  const { user } = useAuth();
  const { 
    socio, 
    stats, 
    asociaciones, 
    activity,
    loading, 
    updating, 
    uploadingImage,
    updateProfile, 
    updateConfiguration,
    uploadProfileImage,
    refreshData,
    exportData,
  } = useSocioProfile();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  
  // UI states
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notificaciones' | 'privacidad' | 'avanzado'>('general');

  // Datos del perfil con fallbacks mejorados
  const profileData = {
    nombre: socio?.nombre || user?.nombre || 'Usuario',
    email: socio?.email || user?.email || '',
    telefono: socio?.telefono || '',
    dni: socio?.dni || '',
    direccion: socio?.direccion || '',
    fechaNacimiento: socio?.fechaNacimiento?.toDate(),
    estado: socio?.estado || 'activo',
    creadoEn: socio?.creadoEn?.toDate() || new Date(),
    ultimoAcceso: socio?.ultimoAcceso?.toDate() || new Date(),
    avatar: socio?.avatar || null,
    avatarThumbnail: socio?.avatarThumbnail || null,
    nivel: socio?.nivel || {
      nivel: 'Bronze',
      puntos: 0,
      puntosParaProximoNivel: 1000,
      proximoNivel: 'Silver',
      beneficiosDesbloqueados: [],
      descuentoAdicional: 0
    }
  };

  // Estadísticas mejoradas con datos reales
  const enhancedStats = {
    beneficiosUsados: stats?.beneficiosUsados || 0,
    ahorroTotal: stats?.ahorroTotal || 0,
    beneficiosEsteMes: stats?.beneficiosEsteMes || 0,
    asociacionesActivas: stats?.asociacionesActivas || 0,
    racha: stats?.racha || 0,
    comerciosVisitados: stats?.comerciosVisitados || 0,
    validacionesExitosas: stats?.validacionesExitosas || 0,
    descuentoPromedio: stats?.descuentoPromedio || 0,
    ahorroEsteMes: stats?.ahorroEsteMes || 0,
    beneficiosFavoritos: stats?.beneficiosFavoritos || 0,
    tiempoComoSocio: stats?.tiempoComoSocio || 0,
    actividadPorMes: stats?.actividadPorMes || {},
    beneficiosPorCategoria: stats?.beneficiosPorCategoria || {},
    comerciosMasVisitados: stats?.comerciosMasVisitados || []
  };

  // Configuración con valores del socio o por defecto
  const [configuracion, setConfiguracion] = useState<SocioConfiguration>({
    // Notificaciones
    notificaciones: socio?.configuracion?.notificaciones ?? true,
    notificacionesPush: socio?.configuracion?.notificacionesPush ?? true,
    notificacionesEmail: socio?.configuracion?.notificacionesEmail ?? true,
    notificacionesSMS: socio?.configuracion?.notificacionesSMS ?? false,
    
    // Apariencia
    tema: socio?.configuracion?.tema ?? 'light',
    idioma: socio?.configuracion?.idioma ?? 'es',
    moneda: socio?.configuracion?.moneda ?? 'ARS',
    timezone: socio?.configuracion?.timezone ?? 'America/Argentina/Buenos_Aires',
    
    // Privacidad
    perfilPublico: socio?.configuracion?.perfilPublico ?? false,
    mostrarEstadisticas: socio?.configuracion?.mostrarEstadisticas ?? true,
    mostrarActividad: socio?.configuracion?.mostrarActividad ?? true,
    compartirDatos: socio?.configuracion?.compartirDatos ?? false,
    
    // Preferencias
    beneficiosFavoritos: socio?.configuracion?.beneficiosFavoritos ?? [],
    comerciosFavoritos: socio?.configuracion?.comerciosFavoritos ?? [],
    categoriasFavoritas: socio?.configuracion?.categoriasFavoritas ?? []
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: profileData.nombre,
    telefono: profileData.telefono,
    dni: profileData.dni,
    direccion: profileData.direccion,
    fechaNacimiento: profileData.fechaNacimiento
  });

  // Update form data when socio data changes
  useEffect(() => {
    if (socio) {
      setFormData({
        nombre: socio.nombre || '',
        telefono: socio.telefono || '',
        dni: socio.dni || '',
        direccion: socio.direccion || '',
        fechaNacimiento: socio.fechaNacimiento?.toDate()
      });
      
      if (socio.configuracion) {
        setConfiguracion(prev => ({
          ...prev,
          ...socio.configuracion
        }));
      }
    }
  }, [socio]);

  // Handlers
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        nombre: formData.nombre,
        telefono: formData.telefono || undefined,
        dni: formData.dni || undefined,
        direccion: formData.direccion || undefined,
        fechaNacimiento: formData.fechaNacimiento
      });
      setEditModalOpen(false);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleSaveConfig = async () => {
    try {
      await updateConfiguration(configuracion);
      setConfigModalOpen(false);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      toast.success('Datos actualizados');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user?.uid || '');
    setCopied(true);
    toast.success('ID de usuario copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportData = async () => {
    try {
      await exportData();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return await uploadProfileImage(file);
  };

  // Utility functions
  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Socio Activo';
      case 'vencido': return 'Socio Vencido';
      case 'inactivo': return 'Socio Inactivo';
      case 'pendiente': return 'Pendiente de Activación';
      default: return 'Estado Desconocido';
    }
  };

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'Bronze': return <Award size={16} />;
      case 'Silver': return <Star size={16} />;
      case 'Gold': return <Crown size={16} />;
      case 'Platinum': return <Zap size={16} />;
      case 'Diamond': return <Sparkles size={16} />;
      default: return <Award size={16} />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        activeSection="perfil"
        sidebarComponent={SocioSidebar}
      >
        <PageContainer>
          <LoadingSkeleton className="h-96" />
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeSection="perfil"
      sidebarComponent={SocioSidebar}
    >
      <PageContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header mejorado */}
        <HeaderSection >
          <HeaderContent>
            <HeaderTitle>
              <h1>Mi Perfil</h1>
              <p>Gestiona tu información personal y configuración de cuenta</p>
            </HeaderTitle>
            <HeaderActions>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 size={16} />}
                onClick={() => setQrModalOpen(true)}
              >
                Compartir
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={16} />}
                onClick={handleExportData}
              >
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} />}
                onClick={handleRefresh}
                loading={refreshing}
              >
                Actualizar
              </Button>
            </HeaderActions>
          </HeaderContent>
        </HeaderSection>

        <MainGrid>
          {/* Columna Principal */}
          <MainColumn>
            {/* Tarjeta de Perfil Principal Mejorada */}
            <ProfileCard>
              <ProfileHeader>
                <ProfileHeaderActions>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<QrCode size={16} />}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => setQrModalOpen(true)}
                  >
                    Mi QR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Settings size={16} />}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => setConfigModalOpen(true)}
                  >
                    Configuración
                  </Button>
                </ProfileHeaderActions>
              </ProfileHeader>

              <ProfileContent>
                <ProfileAvatarSection>
                  <AvatarContainer>
                    <ProfileImageUploader
                      onImageUpload={handleImageUpload}
                      uploading={uploadingImage}
                    />

                    <StatusBadge status={profileData.estado}>
                      <CheckCircle size={12} className="text-white" />
                    </StatusBadge>

                    <LevelBadge level={profileData.nivel.nivel}>
                      {getNivelIcon(profileData.nivel.nivel)}
                      {profileData.nivel.nivel}
                    </LevelBadge>
                  </AvatarContainer>

                  <Button
                    variant="outline"
                    leftIcon={<Edit3 size={16} />}
                    onClick={() => setEditModalOpen(true)}
                  >
                    Editar Perfil
                  </Button>
                </ProfileAvatarSection>

                <UserInfo>
                  <h2>{profileData.nombre}</h2>
                  <div className="status-container">
                    <span className="status-text">{getStatusText(profileData.estado)}</span>
                    <StatusChip status={profileData.estado}>
                      {profileData.estado.toUpperCase()}
                    </StatusChip>
                  </div>

                  <LevelProgress>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(profileData.nivel.puntos / (profileData.nivel.puntos + profileData.nivel.puntosParaProximoNivel)) * 100}%`,
                          background: `linear-gradient(90deg, #6366f1, #8b5cf6)`
                        }}
                      />
                    </div>
                    <div className="progress-labels">
                      <span>{profileData.nivel.puntos} puntos</span>
                      <span>{profileData.nivel.puntosParaProximoNivel} para {profileData.nivel.proximoNivel}</span>
                    </div>
                  </LevelProgress>
                </UserInfo>

                <InfoGrid>
                  <InfoCard
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InfoIcon color="#3b82f6">
                      <Mail size={20} />
                    </InfoIcon>
                    <InfoContent>
                      <div className="label">Email</div>
                      <div className="value">{profileData.email}</div>
                    </InfoContent>
                    <InfoAction onClick={handleCopyUserId}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </InfoAction>
                  </InfoCard>

                  {profileData.telefono && (
                    <InfoCard
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InfoIcon color="#10b981">
                        <Phone size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <div className="label">Teléfono</div>
                        <div className="value">{profileData.telefono}</div>
                      </InfoContent>
                    </InfoCard>
                  )}

                  {profileData.dni && (
                    <InfoCard
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InfoIcon color="#8b5cf6">
                        <IdCard size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <div className="label">DNI</div>
                        <div className="value">{profileData.dni}</div>
                      </InfoContent>
                    </InfoCard>
                  )}

                  {profileData.direccion && (
                    <InfoCard
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InfoIcon color="#f59e0b">
                        <Home size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <div className="label">Dirección</div>
                        <div className="value">{profileData.direccion}</div>
                      </InfoContent>
                    </InfoCard>
                  )}

                  {profileData.fechaNacimiento && (
                    <InfoCard
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InfoIcon color="#ec4899">
                        <Cake size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <div className="label">Fecha de Nacimiento</div>
                        <div className="value">
                          {format(profileData.fechaNacimiento, 'dd MMMM yyyy', { locale: es })}
                        </div>
                      </InfoContent>
                    </InfoCard>
                  )}

                  <InfoCard
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InfoIcon color="#6366f1">
                      <Calendar size={20} />
                    </InfoIcon>
                    <InfoContent>
                      <div className="label">Socio desde</div>
                      <div className="value">
                        {format(profileData.creadoEn, 'dd MMMM yyyy', { locale: es })} 
                        <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>
                          ({enhancedStats.tiempoComoSocio} días)
                        </span>
                      </div>
                    </InfoContent>
                  </InfoCard>
                </InfoGrid>
              </ProfileContent>
            </ProfileCard>

            {/* Estadísticas Detalladas Mejoradas */}
            <StatsCard>
              <StatsHeader>
                <div className="title-section">
                  <div className="icon-container">
                    <BarChart3 size={24} />
                  </div>
                  <div className="title-content">
                    <h3>Estadísticas de Actividad</h3>
                    <p>Tu rendimiento como socio</p>
                  </div>
                </div>
                <div className="actions">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Activity size={16} />}
                    onClick={() => setActivityModalOpen(true)}
                  >
                    Ver Actividad
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<BarChart3 size={16} />}
                    onClick={() => setStatsModalOpen(true)}
                  >
                    Estadísticas Avanzadas
                  </Button>
                </div>
              </StatsHeader>

              <MetricsGrid>
                <UnifiedMetricsCard
                  title="Beneficios Usados"
                  value={enhancedStats.beneficiosUsados}
                  icon={<Award />}
                  color="#6366f1"
                  size="medium"
                  change={12}
                  trend="up"
                  description="Total de beneficios utilizados"
                  showProgress={true}
                  progressValue={75}
                />

                <UnifiedMetricsCard
                  title="Total Ahorrado"
                  value={`$${enhancedStats.ahorroTotal.toLocaleString()}`}
                  icon={<Target />}
                  color="#10b981"
                  size="medium"
                  change={8}
                  trend="up"
                  description="Dinero ahorrado en total"
                  showProgress={true}
                  progressValue={85}
                />

                <UnifiedMetricsCard
                  title="Este Mes"
                  value={enhancedStats.beneficiosEsteMes}
                  icon={<Activity />}
                  color="#f59e0b"
                  size="medium"
                  change={-5}
                  trend="down"
                  description="Beneficios usados este mes"
                  showProgress={true}
                  progressValue={60}
                />

                <UnifiedMetricsCard
                  title="Días de Racha"
                  value={enhancedStats.racha}
                  icon={<Zap />}
                  color="#8b5cf6"
                  size="medium"
                  change={15}
                  trend="up"
                  description="Días consecutivos activo"
                  showProgress={true}
                  progressValue={90}
                />
              </MetricsGrid>

              <AdditionalMetrics>
                <MetricCard color="#3b82f6">
                  <div className="icon-container">
                    <Building2 size={24} />
                  </div>
                  <div className="value">{enhancedStats.comerciosVisitados}</div>
                  <div className="label">Comercios Visitados</div>
                </MetricCard>

                <MetricCard color="#10b981">
                  <div className="icon-container">
                    <CheckCircle size={24} />
                  </div>
                  <div className="value">{enhancedStats.validacionesExitosas}%</div>
                  <div className="label">Validaciones Exitosas</div>
                </MetricCard>

                <MetricCard color="#8b5cf6">
                  <div className="icon-container">
                    <Heart size={24} />
                  </div>
                  <div className="value">{enhancedStats.beneficiosFavoritos}</div>
                  <div className="label">Categorías Favoritas</div>
                </MetricCard>
              </AdditionalMetrics>
            </StatsCard>

            {/* Actividad Reciente */}
            <motion.div>
              <ActivityTimeline
                activities={activity.slice(0, 5)}
                loading={loading}
                onLoadMore={() => setActivityModalOpen(true)}
                hasMore={activity.length > 5}
              />
            </motion.div>
          </MainColumn>

          {/* Columna Lateral Mejorada */}
          <SideColumn>
            {/* Mis Asociaciones Mejoradas */}
            <SideCard>
              <SideCardHeader>
                <div className="icon-container">
                  <Building2 size={20} />
                </div>
                <div className="title-content">
                  <h3>Mis Asociaciones</h3>
                  <p>Estado de socios</p>
                </div>
              </SideCardHeader>

              <div style={{ marginBottom: '1.5rem' }}>
                {asociaciones?.length > 0 ? asociaciones.map((asociacion, index) => (
                  <motion.div
                    key={asociacion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    style={{
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '1rem',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          background: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                            <Image
                              src={asociacion.logo || ''}
                              alt={asociacion.nombre}
                              width={32}
                              height={32}
                              style={{ objectFit: 'cover', borderRadius: '0.25rem' }}
                              unoptimized
                            />
                            <Image
                              src={asociacion.logo || ''}
                              alt={asociacion.nombre}
                              width={32}
                              height={32}
                              style={{ objectFit: 'cover', borderRadius: '0.25rem' }}
                              unoptimized
                            />
                          ) : (
                            <Building2 size={16} style={{ color: '#64748b' }} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{asociacion.nombre}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {asociacion.estado === 'activo' 
                              ? `Vence: ${format(asociacion.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })}`
                              : `Venció: ${format(asociacion.fechaVencimiento.toDate(), 'dd/MM/yyyy', { locale: es })}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', flex: 1, marginRight: '1rem' }}>{asociacion.descripcion}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {asociacion.estado === 'activo' ? <CheckCircle size={14} style={{ color: '#10b981' }} /> : <XCircle size={14} style={{ color: '#ef4444' }} />}
                        <StatusChip status={asociacion.estado}>
                          {asociacion.estado === 'activo' ? 'Activo' : 'Vencido'}
                        </StatusChip>
                      </div>
                    </div>

                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#6366f1' }}>{asociacion.beneficiosIncluidos}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Beneficios</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#10b981' }}>{asociacion.descuentoMaximo}%</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Desc. Máx.</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#8b5cf6' }}>{asociacion.comerciosAfiliados}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Comercios</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <Building2 size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#64748b' }}>No hay asociaciones disponibles</p>
                  </div>
                )}
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>
                      {asociaciones?.filter(a => a.estado === 'activo').length || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Activas</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>
                      {asociaciones?.filter(a => a.estado === 'vencido').length || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Vencidas</div>
                  </div>
                </div>
              </div>
            </SideCard>

            {/* Acciones Rápidas */}
            {/* Acciones Rápidas */}
            <SideCard>
              <SideCardHeader>
                <div className="icon-container">
                  <Zap size={20} />
                </div>
                <div className="title-content">
                  <h3>Acciones Rápidas</h3>
                  <p>Funciones principales</p>
                </div>
              </SideCardHeader>
              
              <QuickActions>
                <QuickActionButton
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQrModalOpen(true)}
                >
                  <QrCode size={20} className="icon" />
                  <span className="text">Ver mi código QR</span>
                  <ChevronRight size={16} className="arrow" />
                </QuickActionButton>
                
                <QuickActionButton
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportData}
                >
                  <Download size={20} className="icon" />
                  <span className="text">Exportar mis datos</span>
                  <ChevronRight size={16} className="arrow" />
                </QuickActionButton>
                
                <QuickActionButton
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Share2 size={20} className="icon" />
                  <span className="text">Compartir perfil</span>
                  <ChevronRight size={16} className="arrow" />
                </QuickActionButton>
                
                <QuickActionButton
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfigModalOpen(true)}
                >
                  <Settings size={20} className="icon" />
                  <span className="text">Configuración avanzada</span>
                  <ChevronRight size={16} className="arrow" />
                </QuickActionButton>
                
                <QuickActionButton
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HelpCircle size={20} className="icon" />
                  <span className="text">Centro de ayuda</span>
                  <ChevronRight size={16} className="arrow" />
                </QuickActionButton>
              </QuickActions>
            </SideCard>

            {/* Consejos y Tips Mejorados */}
            <TipsCard>
              <h3>
                <Sparkles size={20} />
                Consejos para tu perfil
              </h3>
              <TipsList>
                <TipItem>
                  <div className="icon-container">
                    <CheckCircle size={12} />
                  </div>
                  <span className="text">Mantén tu información actualizada para recibir beneficios personalizados</span>
                </TipItem>
                <TipItem>
                  <div className="icon-container">
                    <Phone size={12} />
                  </div>
                  <span className="text">Verifica que tu teléfono esté correcto para notificaciones importantes</span>
                </TipItem>
                <TipItem>
                  <div className="icon-container">
                    <Camera size={12} />
                  </div>
                  <span className="text">Agrega una foto de perfil para personalizar tu experiencia</span>
                </TipItem>
                <TipItem>
                  <div className="icon-container">
                    <TrendingUp size={12} />
                  </div>
                  <span className="text">Usa más beneficios para subir de nivel y obtener mejores descuentos</span>
                </TipItem>
              </TipsList>
            </TipsCard>
          </SideColumn>
        </MainGrid>

        {/* Modal de Edición de Perfil Mejorado */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Edit3 size={24} className="text-indigo-600" />
                Editar Perfil
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <Input
                label="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Tu nombre completo"
                required
                icon={<User size={16} />}
              />

              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Tu número de teléfono"
                icon={<Phone size={16} />}
              />

              <Input
                label="DNI"
                value={formData.dni}
                onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                placeholder="Tu número de documento"
                icon={<IdCard size={16} />}
              />

              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Tu dirección"
                icon={<Home size={16} />}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={formData.fechaNacimiento ? format(formData.fechaNacimiento, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    fechaNacimiento: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveProfile}
                loading={updating}
                leftIcon={<Save size={16} />}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuración Mejorado */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Settings size={24} className="text-indigo-600" />
                Configuración de Cuenta
              </DialogTitle>
            </DialogHeader>

            {/* Tabs de configuración */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                {[
                  { id: 'general', label: 'General', icon: <Settings size={16} /> },
                  { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={16} /> },
                  { id: 'privacidad', label: 'Privacidad', icon: <Shield size={16} /> },
                  { id: 'avanzado', label: 'Avanzado', icon: <Palette size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'general' | 'notificaciones' | 'privacidad' | 'avanzado')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Tab General */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe size={16} />
                      Preferencias Generales
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Languages size={16} className="inline mr-2" />
                          Idioma
                        </label>
                        <select
                          value={configuracion.idioma}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, idioma: e.target.value as 'es' | 'en' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="es">Español</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign size={16} className="inline mr-2" />
                          Moneda
                        </label>
                        <select
                          value={configuracion.moneda}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, moneda: e.target.value as 'ARS' | 'USD' | 'EUR' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="ARS">Peso Argentino (ARS)</option>
                          <option value="USD">Dólar Estadounidense (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock3 size={16} className="inline mr-2" />
                          Zona Horaria
                        </label>
                        <select
                          value={configuracion.timezone}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                          <option value="America/New_York">Nueva York (GMT-5)</option>
                          <option value="Europe/Madrid">Madrid (GMT+1)</option>
                          <option value="Asia/Tokyo">Tokio (GMT+9)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Notificaciones */}
              {activeTab === 'notificaciones' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bell size={16} />
                      Configuración de Notificaciones
                    </h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones generales</span>
                            <p className="text-xs text-gray-500">Recibir todas las notificaciones</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificaciones}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificaciones: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <DeviceIcon size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones push</span>
                            <p className="text-xs text-gray-500">Notificaciones en el dispositivo</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificacionesPush}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesPush: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones por email</span>
                            <p className="text-xs text-gray-500">Recibir emails informativos</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificacionesEmail}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesEmail: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Notificaciones SMS</span>
                            <p className="text-xs text-gray-500">Mensajes de texto importantes</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.notificacionesSMS}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, notificacionesSMS: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Privacidad */}
              {activeTab === 'privacidad' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ShieldIcon size={16} />
                      Configuración de Privacidad
                    </h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Perfil público</span>
                            <p className="text-xs text-gray-500">Permitir que otros vean tu perfil</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.perfilPublico}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, perfilPublico: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BarChart3 size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Mostrar estadísticas</span>
                            <p className="text-xs text-gray-500">Mostrar tus estadísticas públicamente</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.mostrarEstadisticas}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, mostrarEstadisticas: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Mostrar actividad</span>
                            <p className="text-xs text-gray-500">Mostrar tu actividad reciente</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.mostrarActividad}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, mostrarActividad: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Share2 size={16} className="text-gray-600" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Compartir datos</span>
                            <p className="text-xs text-gray-500">Permitir compartir datos con socios</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.compartirDatos}
                          onChange={(e) => setConfiguracion(prev => ({ ...prev, compartirDatos: e.target.checked }))}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Avanzado */}
              {activeTab === 'avanzado' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette size={16} />
                      Configuración Avanzada
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tema de la aplicación</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Claro', icon: <Sun size={16} /> },
                            { value: 'dark', label: 'Oscuro', icon: <Moon size={16} /> },
                            { value: 'auto', label: 'Automático', icon: <Laptop size={16} /> }
                          ].map((tema) => (
                            <button
                              key={tema.value}
                              onClick={() => setConfiguracion(prev => ({ ...prev, tema: tema.value as 'light' | 'dark' | 'auto' }))}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                configuracion.tema === tema.value
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {tema.icon}
                              <span className="text-sm font-medium">{tema.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Información del dispositivo */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <DeviceIcon size={16} />
                          Información del dispositivo
                        </h5>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Último acceso:</span>
                            <span>{format(profileData.ultimoAcceso, 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dispositivos conectados:</span>
                            <span>{socio?.dispositivosConectados?.length || 1}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ubicación actual:</span>
                            <span>
                              {socio?.ubicacionActual ? 
                                `${socio.ubicacionActual.ciudad}, ${socio.ubicacionActual.provincia}` : 
                                'No disponible'
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Acciones de cuenta */}
                      <div className="pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Database size={16} />
                          Gestión de datos
                        </h5>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Download size={16} />}
                            onClick={handleExportData}
                            className="justify-start"
                          >
                            Exportar todos mis datos
                          </Button>
                          
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<RotateCcw size={16} />}
                            className="justify-start"
                            onClick={() => {
                              setConfiguracion({
                                notificaciones: true,
                                notificacionesPush: true,
                                notificacionesEmail: true,
                                notificacionesSMS: false,
                                tema: 'light',
                                idioma: 'es',
                                moneda: 'ARS',
                                timezone: 'America/Argentina/Buenos_Aires',
                                perfilPublico: false,
                                mostrarEstadisticas: true,
                                mostrarActividad: true,
                                compartirDatos: false,
                                beneficiosFavoritos: [],
                                comerciosFavoritos: [],
                                categoriasFavoritas: []
                              });
                              toast.success('Configuración restablecida');
                            }}
                          >
                            Restablecer configuración
                          </Button>
                          
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Archive size={16} />}
                            className="justify-start text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                          >
                            Archivar cuenta
                          </Button>
                          
                          <Button
                            variant="outline"
                            fullWidth
                            leftIcon={<Trash2 size={16} />}
                            className="justify-start text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Eliminar cuenta
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfigModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveConfig}
                loading={updating}
                leftIcon={<Save size={16} />}
              >
                Guardar Configuración
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de QR */}
        <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <QrCode size={24} className="text-indigo-600" />
                Mi Código QR
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-center">
              {/* QR Code */}
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 mx-auto inline-block">
                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                  <QrCode size={120} className="text-gray-400" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Código de Socio</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muestra este código QR en los comercios para validar tus beneficios
                </p>
                
                {/* ID de usuario */}
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-600">
                    {user?.uid?.slice(0, 8)}...{user?.uid?.slice(-8)}
                  </span>
                  <button
                    onClick={handleCopyUserId}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                {/* Información adicional */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-900">Nivel</div>
                      <div className="text-blue-700">{profileData.nivel.nivel}</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Puntos</div>
                      <div className="text-blue-700">{profileData.nivel.puntos}</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Estado</div>
                      <div className="text-blue-700">{getStatusText(profileData.estado)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Asociaciones</div>
                      <div className="text-blue-700">{asociaciones.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Download size={16} />}
                >
                  Descargar
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Share2 size={16} />}
                >
                  Compartir
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setQrModalOpen(false)}
                leftIcon={<X size={16} />}
                fullWidth
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Actividad Completa */}
        <Dialog open={activityModalOpen} onClose={() => setActivityModalOpen(false)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Activity size={24} className="text-indigo-600" />
                Historial de Actividad Completo
              </DialogTitle>
            </DialogHeader>

            <ActivityTimeline
              activities={activity}
              loading={loading}
              hasMore={false}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActivityModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cerrar
              </Button>
              <Button
                leftIcon={<Download size={16} />}
                onClick={async () => {
                  try {
                    const activityData = {
                      actividades: activity,
                      fechaExportacion: new Date().toISOString(),
                      socio: profileData.nombre
                    };
                    
                    const blob = new Blob([JSON.stringify(activityData, null, 2)], { 
                      type: 'application/json' 
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `actividad-socio-${format(new Date(), 'yyyy-MM-dd')}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    toast.success('Historial de actividad exportado');
                  } catch {
                    toast.error('Error al exportar el historial');
                  }
                }}
              >
                Exportar Historial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Estadísticas Avanzadas */}
        <Dialog open={statsModalOpen} onClose={() => setStatsModalOpen(false)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <BarChart3 size={24} className="text-indigo-600" />
                Estadísticas Avanzadas
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              {/* Resumen de estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">${enhancedStats.ahorroTotal.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Ahorro Total</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{enhancedStats.beneficiosUsados}</div>
                  <div className="text-sm text-gray-600">Beneficios Usados</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Building2 size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{enhancedStats.comerciosVisitados}</div>
                  <div className="text-sm text-gray-600">Comercios Visitados</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{enhancedStats.racha}</div>
                  <div className="text-sm text-gray-600">Días de Racha</div>
                </div>
              </div>

              {/* Comercios más visitados */}
              {enhancedStats.comerciosMasVisitados.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 size={20} />
                    Comercios Más Visitados
                  </h4>
                  <div className="space-y-3">
                    {enhancedStats.comerciosMasVisitados.map((comercio, index) => (
                      <div key={comercio.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{comercio.nombre}</h5>
                            <p className="text-sm text-gray-500">
                              Última visita: {format(comercio.ultimaVisita.toDate(), 'dd/MM/yyyy', { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-600">{comercio.visitas}</div>
                          <div className="text-sm text-gray-500">visitas</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beneficios por categoría */}
              {Object.keys(enhancedStats.beneficiosPorCategoria).length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award size={20} />
                    Beneficios por Categoría
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(enhancedStats.beneficiosPorCategoria).map(([categoria, cantidad]) => (
                      <div key={categoria} className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{cantidad}</div>
                        <div className="text-sm text-gray-600">{categoria}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actividad por mes */}
              {Object.keys(enhancedStats.actividadPorMes).length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Actividad por Mes (Últimos 12 meses)
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {Object.entries(enhancedStats.actividadPorMes).map(([mes, actividad]) => (
                      <div key={mes} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-indigo-600">{actividad}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(mes + '-01'), 'MMM yyyy', { locale: es })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStatsModalOpen(false)}
                leftIcon={<X size={16} />}
              >
                Cerrar
              </Button>
              <Button
                leftIcon={<Download size={16} />}
                onClick={async () => {
                  try {
                    const statsData = {
                      estadisticas: enhancedStats,
                      fechaExportacion: new Date().toISOString(),
                      socio: profileData.nombre
                    };
                    
                    const blob = new Blob([JSON.stringify(statsData, null, 2)], { 
                      type: 'application/json' 
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `estadisticas-socio-${format(new Date(), 'yyyy-MM-dd')}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    toast.success('Estadísticas exportadas');
                  } catch {
                    toast.error('Error al exportar las estadísticas');
                  }
                }}
              >
                Exportar Estadísticas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  );
}