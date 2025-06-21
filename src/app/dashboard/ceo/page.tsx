'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  Heart, 
  Target, 
  Brain, 
  TrendingUp, 
  Sparkles,
  Activity,
  Users,
  Zap,
  Download,
  Bell,
  ArrowRight,
  Eye,
  Shield,
  Cpu,
  Globe,
  Calendar,
  Clock,
  Star,
  Award,
  Briefcase,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Maximize2,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  MapPin,
  User,
  BarChart2,
  Database
} from 'lucide-react';

import Topbar from '@/components/dashboard/Topbar';
import TabNavigation from '@/components/dashboard/TabNavigation';
import KPIGrid from '@/components/dashboard/KPIGrid';
import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import AIInsightsFooter from '@/components/dashboard/AIInsightsFooter';

// Interfaces para el nuevo dashboard ultra profesional
interface SystemStatus {
  cpu: number;
  memory: number;
  network: 'online' | 'offline';
  battery: number;
  uptime: string;
  lastSync: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
  badge?: number;
}

interface SmartInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  value?: string;
  actionable: boolean;
}

interface PerformanceMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit: string;
  category: 'financial' | 'clinical' | 'operational' | 'commercial';
}

export default function CEODashboard() {
  const [activeTab, setActiveTab] = useState('executive');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 23,
    memory: 67,
    network: 'online',
    battery: 89,
    uptime: '7d 14h 32m',
    lastSync: new Date()
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAIAssistantActive, setIsAIAssistantActive] = useState(true);
  const [notifications, setNotifications] = useState(12);
  const [hasMetrics, setHasMetrics] = useState(false); // Para simular estado sin métricas

  // Usuario mock mejorado
  const mockUser = {
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@centropsicologico.com',
    role: 'CEO & Fundador',
    avatar: null,
    lastLogin: new Date(),
    preferences: {
      theme: 'light',
      notifications: true,
      autoRefresh: true
    }
  };

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simular actualizaciones del sistema
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        battery: Math.max(20, Math.min(100, prev.battery - 0.1)),
        lastSync: new Date()
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Pestañas mejoradas según especificaciones
  const tabs = [
    {
      id: 'executive',
      label: 'Centro de Comando',
      icon: BarChart3,
      description: 'Vista ejecutiva integral',
      badge: 3
    },
    {
      id: 'financial',
      label: 'Inteligencia Financiera',
      icon: DollarSign,
      description: 'Análisis predictivo de ingresos'
    },
    {
      id: 'clinical',
      label: 'Operaciones Clínicas',
      icon: Heart,
      description: 'Salud operativa en tiempo real'
    },
    {
      id: 'commercial',
      label: 'Marketing Inteligente',
      icon: Target,
      description: 'Optimización de conversión'
    },
    {
      id: 'insights',
      label: 'IA & Predicciones',
      icon: Brain,
      description: 'Insights con machine learning',
      badge: 5
    }
  ];

  // Acciones rápidas según especificaciones
  const quickActions: QuickAction[] = [
    {
      id: 'generate-report',
      label: 'Generar Reporte',
      icon: Download,
      color: '#2463EB',
      action: () => console.log('Generating report...'),
      badge: 2
    },
    {
      id: 'schedule-meeting',
      label: 'Agendar Reunión',
      icon: Calendar,
      color: '#10B981',
      action: () => console.log('Scheduling meeting...')
    },
    {
      id: 'ai-analysis',
      label: 'Análisis IA',
      icon: Brain,
      color: '#F59E0B',
      action: () => console.log('Running AI analysis...'),
      badge: 1
    },
    {
      id: 'emergency-alert',
      label: 'Alertas Críticas',
      icon: AlertTriangle,
      color: '#EF4444',
      action: () => console.log('Checking alerts...')
    }
  ];

  // Insights inteligentes según especificaciones
  const smartInsights: SmartInsight[] = [
    {
      id: '1',
      type: 'prediction',
      title: 'Pico de demanda previsto',
      description: 'Se espera un aumento del 34% en citas para la próxima semana basado en patrones históricos y tendencias actuales.',
      confidence: 87,
      impact: 'high',
      timeframe: '7 días',
      value: '+34% demanda',
      actionable: true
    },
    {
      id: '2',
      type: 'optimization',
      title: 'Optimización de horarios',
      description: 'Reasignar 3 slots de tarde a mañana podría incrementar la eficiencia operativa en un 12%.',
      confidence: 92,
      impact: 'medium',
      timeframe: 'Inmediato',
      value: '+12% eficiencia',
      actionable: true
    },
    {
      id: '3',
      type: 'alert',
      title: 'Riesgo de cancelaciones',
      description: 'Patrón anómalo detectado: 23% más cancelaciones los viernes. Posible causa: conflictos de horario.',
      confidence: 78,
      impact: 'medium',
      timeframe: 'Esta semana',
      value: '-23% retención',
      actionable: true
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleCenterChange = (centerId: string) => {
    console.log('Changing to center:', centerId);
  };

  const handleDownloadBrief = () => {
    console.log('Downloading executive brief...');
  };

  const getSystemStatusColor = (value: number, type: 'cpu' | 'memory' | 'battery') => {
    if (type === 'battery') {
      if (value > 50) return '#10B981';
      if (value > 20) return '#F59E0B';
      return '#EF4444';
    }
    if (value < 50) return '#10B981';
    if (value < 80) return '#F59E0B';
    return '#EF4444';
  };

  const getInsightIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'recommendation': return Star;
      case 'alert': return AlertTriangle;
      case 'optimization': return Zap;
      default: return Info;
    }
  };

  const getInsightColor = (impact: SmartInsight['impact']) => {
    switch (impact) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getInsightBgColor = (impact: SmartInsight['impact']) => {
    switch (impact) {
      case 'high': return '#FEF2F2';
      case 'medium': return '#FFFBEB';
      case 'low': return '#ECFDF5';
      default: return '#F9FAFB';
    }
  };

  // Componente de bienvenida profesional
  const renderWelcomeHero = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, #2463EB, #3B82F6)',
        borderRadius: '2rem',
        padding: '2.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}
    >
      {/* Efectos de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ marginRight: '1rem' }}
            >
              <Sparkles size={28} color="rgba(255, 255, 255, 0.8)" />
            </motion.div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0
            }}>
              Bienvenido, {mockUser.name}
            </h1>
          </div>
          
          <p style={{ 
            fontSize: '1.25rem',
            opacity: 0.9,
            fontWeight: 400,
            lineHeight: 1.6,
            marginBottom: '1.5rem'
          }}>
            Centro de comando ejecutivo con inteligencia artificial integrada
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.875rem' }}>
                {currentTime.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} />
              <span style={{ fontSize: '0.875rem' }}>
                {currentTime.toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadBrief}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1rem',
              padding: '1rem 2rem',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Download size={20} />
            Resumen Ejecutivo
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Estado del sistema según especificaciones
  const renderSystemStatus = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Settings size={24} color="#2463EB" />
          </motion.div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: '#1C1E21',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            Estado del Sistema
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div 
            style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: systemStatus.network === 'online' ? '#10B981' : '#EF4444',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} 
          />
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {systemStatus.network === 'online' ? 'En línea' : 'Desconectado'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {/* CPU */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
            <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="#E5E7EB"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke={getSystemStatusColor(systemStatus.cpu, 'cpu')}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - systemStatus.cpu / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#1C1E21'
            }}>
              {systemStatus.cpu.toFixed(0)}%
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>CPU</div>
        </div>

        {/* Memoria */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
            <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="#E5E7EB"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke={getSystemStatusColor(systemStatus.memory, 'memory')}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - systemStatus.memory / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#1C1E21'
            }}>
              {systemStatus.memory.toFixed(0)}%
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Memoria</div>
        </div>

        {/* Batería */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
            <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="#E5E7EB"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke={getSystemStatusColor(systemStatus.battery, 'battery')}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - systemStatus.battery / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#1C1E21'
            }}>
              {systemStatus.battery.toFixed(0)}%
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Batería</div>
        </div>

        {/* Uptime */}
        <div style={{ textAlign: 'center' }}>
          <Clock size={60} color="#6B7280" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Uptime</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1C1E21' }}>
            {systemStatus.uptime}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Acciones rápidas según especificaciones
  const renderQuickActions = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}
    >
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: 600, 
        marginBottom: '1.5rem', 
        color: '#1C1E21',
        fontFamily: 'Inter, sans-serif'
      }}>
        Acciones Rápidas
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            style={{
              background: `linear-gradient(135deg, ${action.color}10 0%, ${action.color}05 100%)`,
              border: `1px solid ${action.color}20`,
              borderRadius: '1rem',
              padding: '1.5rem',
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {action.badge && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#EF4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {action.badge}
              </div>
            )}
            
            <action.icon size={32} color={action.color} style={{ marginBottom: '0.75rem' }} />
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#1C1E21',
              fontFamily: 'Inter, sans-serif'
            }}>
              {action.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Insights inteligentes según especificaciones
  const renderSmartInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain size={24} color="#2463EB" />
          </motion.div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            color: '#1C1E21',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            Insights Inteligentes
          </h3>
        </div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isAIAssistantActive}
            onChange={(e) => setIsAIAssistantActive(e.target.checked)}
            style={{ display: 'none' }}
          />
          <div style={{
            width: '44px',
            height: '24px',
            backgroundColor: isAIAssistantActive ? '#2463EB' : '#E5E7EB',
            borderRadius: '12px',
            position: 'relative',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: isAIAssistantActive ? '22px' : '2px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }} />
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {smartInsights.map((insight, index) => {
          const IconComponent = getInsightIcon(insight.type);
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 4 }}
              style={{
                background: getInsightBgColor(insight.impact),
                border: `1px solid ${getInsightColor(insight.impact)}20`,
                borderRadius: '1rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: `${getInsightColor(insight.impact)}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent size={20} color={getInsightColor(insight.impact)} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      color: '#1C1E21',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {insight.title}
                    </h4>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: `${getInsightColor(insight.impact)}15`,
                      color: getInsightColor(insight.impact)
                    }}>
                      {insight.confidence}%
                    </span>
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#6B7280', 
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {insight.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {insight.timeframe}
                      </span>
                      {insight.value && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          color: getInsightColor(insight.impact)
                        }}>
                          {insight.value}
                        </span>
                      )}
                    </div>
                    
                    {insight.actionable && (
                      <ChevronRight size={16} color="#6B7280" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // Placeholder para "No hay métricas disponibles" según especificaciones
  const renderNoMetricsPlaceholder = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '1.5rem',
        padding: '3rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        position: 'relative'
      }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ marginBottom: '1rem' }}
      >
        <BarChart2 size={48} color="#9CA3AF" />
      </motion.div>
      
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 600, 
        color: '#1C1E21',
        marginBottom: '0.5rem',
        fontFamily: 'Inter, sans-serif'
      }}>
        No hay métricas disponibles
      </h3>
      
      <p style={{ 
        fontSize: '0.875rem', 
        color: '#6B7280',
        fontFamily: 'Inter, sans-serif'
      }}>
        Los datos de KPI se cargarán automáticamente cuando estén disponibles.
      </p>
      
      {/* Ilustración sutil opcional */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        opacity: 0.1
      }}>
        <Database size={32} color="#9CA3AF" />
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        transition: { duration: 0.3 }
      }
    };

    switch (activeTab) {
      case 'executive':
        return (
          <motion.div
            key="executive"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header de bienvenida */}
            {renderWelcomeHero()}
            
            {/* Estado del sistema */}
            {renderSystemStatus()}
            
            {/* Acciones rápidas */}
            {renderQuickActions()}
            
            {/* Insights inteligentes */}
            {renderSmartInsights()}
            
            {/* KPI Grid o placeholder */}
            {hasMetrics ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <KPIGrid />
              </motion.div>
            ) : (
              renderNoMetricsPlaceholder()
            )}
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div
            key="financial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                Inteligencia Financiera
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6B7280',
                maxWidth: '600px', 
                margin: '0 auto',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400
              }}>
                Análisis predictivo avanzado con machine learning para optimización de ingresos
              </p>
            </div>
            <FinancialPanel />
          </motion.div>
        );

      case 'clinical':
        return (
          <motion.div
            key="clinical"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                Operaciones Clínicas
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6B7280',
                maxWidth: '600px', 
                margin: '0 auto',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400
              }}>
                Monitoreo inteligente de salud operativa con alertas predictivas
              </p>
            </div>
            <ClinicalPanel />
          </motion.div>
        );

      case 'commercial':
        return (
          <motion.div
            key="commercial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                Marketing Inteligente
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6B7280',
                maxWidth: '600px', 
                margin: '0 auto',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400
              }}>
                Optimización automática de conversión con análisis de comportamiento
              </p>
            </div>
            <CommercialPanel />
          </motion.div>
        );

      case 'insights':
        return (
          <motion.div
            key="insights"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                IA & Predicciones
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6B7280',
                maxWidth: '600px', 
                margin: '0 auto',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400
              }}>
                Inteligencia artificial avanzada con modelos predictivos y recomendaciones automáticas
              </p>
            </div>
            <AIInsightsFooter />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F9FAFB 0%, #EFF3FB 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo futuristas */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(36, 99, 235, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.02) 0%, transparent 50%)
        `
      }} />

      {/* Topbar mejorado */}
      <Topbar onSearch={handleSearch} onCenterChange={handleCenterChange} />
      
      {/* Contenido principal */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '3rem 2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '3rem'
      }}>
        {/* Columna principal */}
        <div>
          {/* Navegación de pestañas mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '3rem' }}
          >
            <TabNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              variant="cards"
              showDescriptions={true}
            />
          </motion.div>

          {/* Contenido de pestañas */}
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>

        {/* Columna lateral mejorada */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ position: 'sticky', top: '120px' }}
          >
            <AlertsTasksDock />
          </motion.div>
        </div>
      </div>

      {/* Botón flotante de IA mejorado */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 1000,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(36, 99, 235, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Asistente IA"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Brain size={32} color="#FFFFFF" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Indicador de notificaciones flotante */}
      {notifications > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{
            position: 'fixed',
            top: '100px',
            right: '32px',
            zIndex: 1000,
          }}
        >
          <div style={{
            padding: '1rem',
            borderRadius: '1rem',
            background: 'rgba(239, 68, 68, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '120px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Bell size={20} />
            </motion.div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {notifications} alertas
            </span>
          </div>
        </motion.div>
      )}

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 1024px) {
          .container-dashboard {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}