'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Edit,
  Close,
  Camera,
  TrendingUp,
  Settings,
  Notifications,
  Security,
  Download,
  Share,
  Refresh,
  CheckCircle,
  Badge as BadgeIcon,
  Analytics,
  Store,
  LocalOffer,
  AccountCircle,
  Cake,
  Business,
  Schedule,
  MonetizationOn,
  Loyalty,
  BarChart,
  Speed,
  Visibility,
  Mail,
  Sms,
  NotificationsActive,
  History,
  Receipt,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Socio, SocioStats } from '@/types/socio';
import { HistorialValidacion } from '@/services/validaciones.service';
import { socioService } from '@/services/socio.service';
import { validacionesService } from '@/services/validaciones.service';
import { safeFormatTimestamp } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SocioProfileViewProps {
  socio: Socio;
  open: boolean;
  onClose: () => void;
  onEdit?: (socio: Socio) => void;
  onRefresh?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    aria-labelledby={`profile-tab-${index}`}
    {...other}
  >
    {value === index && <div className="p-6 space-y-6">{children}</div>}
  </div>
);

// Componente de tarjeta de estadística compacta
const CompactStatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex-1 min-w-[120px]">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-gray-600 font-medium">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500">{subtitle}</div>
        )}
      </div>
    </div>
  </div>
);

// Componente de información compacta
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  iconColor?: string;
}> = ({ icon, label, value, iconColor = 'text-gray-400' }) => (
  <div className="flex items-center gap-3 py-2">
    <div className={`${iconColor} w-5 h-5`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-sm text-gray-900 font-semibold">{value}</div>
    </div>
  </div>
);

export const SocioProfileView: React.FC<SocioProfileViewProps> = ({
  socio,
  open,
  onClose,
  onEdit,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<SocioStats | null>(null);
  const [validaciones, setValidaciones] = useState<HistorialValidacion[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos del perfil
  const loadProfileData = React.useCallback(async () => {
    if (!socio) return;
    
    setLoading(true);
    try {
      const [statsData, , validacionesData] = await Promise.all([
        socioService.getSocioStats?.(socio.uid) || Promise.resolve(null),
        socioService.getSocioActivity?.() || Promise.resolve([]),
        validacionesService.getHistorialValidaciones(socio.uid, 20),
      ]);
      
      setStats(statsData);
      setValidaciones(validacionesData.validaciones);
    } finally {
      setLoading(false);
    }
  }, [socio]);

  useEffect(() => {
    if (open && socio) {
      loadProfileData();
    }
  }, [open, socio, loadProfileData]);

  const handleImageUpload = async (file: File) => {
    if (!socio) return;
    
    try {
      await socioService.uploadProfileImage?.(socio.uid, file);
      toast.success('Imagen de perfil actualizada');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    }
  };

  const handleExportData = async () => {
    if (!socio) return;
    
    try {
      const exportData = await socioService.exportSocioData?.(socio.uid);
      
      if (exportData) {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `perfil_${socio.nombre.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Datos exportados correctamente');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar los datos');
    }
  };

  const getStatusChip = (estado: string) => {
    const config = {
      activo: { color: 'bg-green-100 text-green-800', label: 'Activo' },
      vencido: { color: 'bg-red-100 text-red-800', label: 'Vencido' },
      inactivo: { color: 'bg-gray-100 text-gray-800', label: 'Inactivo' },
      pendiente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      suspendido: { color: 'bg-red-100 text-red-800', label: 'Suspendido' },
    };

    const { color, label } = config[estado as keyof typeof config] || config.inactivo;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getValidationStatusChip = (estado: string) => {
    const config = {
      exitoso: { color: 'bg-green-100 text-green-800', label: 'Exitoso' },
      fallido: { color: 'bg-red-100 text-red-800', label: 'Fallido' },
      pendiente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
    };

    const { color, label } = config[estado as keyof typeof config] || config.pendiente;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'Muy Alto', color: 'text-green-600' };
    if (score >= 60) return { label: 'Alto', color: 'text-yellow-600' };
    if (score >= 40) return { label: 'Medio', color: 'text-blue-600' };
    return { label: 'Bajo', color: 'text-red-600' };
  };

  const calculateEngagementScore = () => {
    if (!stats) return 50;
    
    let score = 50;
    if (socio.estado === 'activo') score += 20;
    if (stats.beneficiosUsados && stats.beneficiosUsados > 0) score += 15;
    if (stats.comerciosVisitados && stats.comerciosVisitados > 3) score += 10;
    if (stats.racha && stats.racha > 7) score += 5;
    
    return Math.min(100, Math.max(0, score));
  };

  const engagementScore = calculateEngagementScore();
  const engagementLevel = getEngagementLevel(engagementScore);

  const tabs = [
    { id: 0, label: 'Información', icon: Person },
    { id: 1, label: 'Estadísticas', icon: Analytics },
    { id: 2, label: 'Historial', icon: History },
    { id: 3, label: 'Configuración', icon: Settings },
  ];

  if (!socio || !open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {socio.avatar ? (
                    <Image
                      src={socio.avatar}
                      alt={socio.nombre}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                      style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                      priority
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {socio.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  )}
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                    <Camera className="w-3 h-3 text-blue-600" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Perfil de {socio.nombre}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {socio.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusChip(socio.estado)}
                    <span className={`text-xs font-medium ${engagementLevel.color}`}>
                      {engagementLevel.label} ({engagementScore}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    loadProfileData();
                    if (onRefresh) onRefresh();
                  }}
                  disabled={loading}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  title="Actualizar"
                >
                  <Refresh className="w-5 h-5" />
                </button>
                
                {onEdit && (
                  <button
                    onClick={() => onEdit(socio)}
                    className="text-white hover:text-gray-200 transition-colors p-1"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  onClick={handleExportData}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  title="Exportar datos"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  title="Cerrar"
                >
                  <Close className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-4">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1: Información Personal */}
            <TabPanel value={activeTab} index={0}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información básica */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <AccountCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Información Personal
                  </h4>
                  
                  <div className="space-y-3">
                    <InfoItem
                      icon={<Person />}
                      label="Nombre completo"
                      value={socio.nombre}
                    />

                    <InfoItem
                      icon={<Email />}
                      label="Correo electrónico"
                      value={socio.email}
                    />

                    {socio.telefono && (
                      <InfoItem
                        icon={<Phone />}
                        label="Teléfono"
                        value={socio.telefono}
                      />
                    )}

                    {socio.dni && (
                      <InfoItem
                        icon={<BadgeIcon />}
                        label="DNI"
                        value={socio.dni}
                      />
                    )}

                    {socio.direccion && (
                      <InfoItem
                        icon={<LocationOn />}
                        label="Dirección"
                        value={socio.direccion}
                      />
                    )}

                    {socio.fechaNacimiento && (
                      <InfoItem
                        icon={<Cake />}
                        label="Fecha de nacimiento"
                        value={safeFormatTimestamp(socio.fechaNacimiento, 'dd MMMM yyyy', { locale: es })}
                      />
                    )}
                  </div>
                </div>

                {/* Información de membresía */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Business className="w-5 h-5 mr-2 text-green-600" />
                    Información de Membresía
                  </h4>
                  
                  <div className="space-y-3">
                    <InfoItem
                      icon={<CalendarToday />}
                      label="Fecha de registro"
                      value={safeFormatTimestamp(socio.creadoEn, 'dd MMMM yyyy', { locale: es })}
                    />

                    <div className="flex items-center gap-3 py-2">
                      <CheckCircle className="text-gray-400 w-5 h-5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700">Estado actual</div>
                        <div className="mt-1">
                          {getStatusChip(socio.estado)}
                        </div>
                      </div>
                    </div>

                    {socio.numeroSocio && (
                      <InfoItem
                        icon={<BadgeIcon />}
                        label="Número de socio"
                        value={`#${socio.numeroSocio}`}
                      />
                    )}

                    <InfoItem
                      icon={<MonetizationOn />}
                      label="Cuota mensual"
                      value={`$${socio.montoCuota || 0}`}
                    />

                    {socio.ultimoAcceso && (
                      <InfoItem
                        icon={<Schedule />}
                        label="Último acceso"
                        value={safeFormatTimestamp(socio.ultimoAcceso, 'dd MMM yyyy, HH:mm', { locale: es })}
                      />
                    )}

                    {/* Engagement score */}
                    <div className="py-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Speed className="text-gray-400 w-5 h-5" />
                        <div className="text-sm font-medium text-gray-700">Nivel de engagement</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              engagementScore >= 80 ? 'bg-green-500' :
                              engagementScore >= 60 ? 'bg-yellow-500' :
                              engagementScore >= 40 ? 'bg-blue-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${engagementScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${engagementLevel.color}`}>
                          {engagementScore}%
                        </span>
                      </div>
                      <div className={`text-sm font-medium ${engagementLevel.color} mt-1`}>
                        {engagementLevel.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Tab 2: Estadísticas */}
            <TabPanel value={activeTab} index={1}>
              <div className="flex flex-wrap gap-4">
                <CompactStatCard
                  title="Beneficios Usados"
                  value={stats?.beneficiosUsados || 0}
                  icon={<LocalOffer className="w-5 h-5 text-white" />}
                  color="bg-purple-500"
                  subtitle="Total utilizados"
                />
                
                <CompactStatCard
                  title="Ahorro Total"
                  value={`$${stats?.ahorroTotal || 0}`}
                  icon={<MonetizationOn className="w-5 h-5 text-white" />}
                  color="bg-green-500"
                  subtitle="Dinero ahorrado"
                />
                
                <CompactStatCard
                  title="Comercios"
                  value={stats?.comerciosVisitados || 0}
                  icon={<Store className="w-5 h-5 text-white" />}
                  color="bg-blue-500"
                  subtitle="Únicos visitados"
                />
                
                <CompactStatCard
                  title="Validaciones"
                  value={validaciones.filter(v => v.estado === 'exitosa').length}
                  icon={<CheckCircle className="w-5 h-5 text-white" />}
                  color="bg-green-500"
                  subtitle="Exitosas"
                />
                
                <CompactStatCard
                  title="Racha"
                  value={`${stats?.racha || 0} días`}
                  icon={<Loyalty className="w-5 h-5 text-white" />}
                  color="bg-yellow-500"
                  subtitle="Consecutivos"
                />

                <CompactStatCard
                  title="Promedio"
                  value={`$${Math.round((stats?.ahorroTotal || 0) / Math.max(1, stats?.tiempoComoSocio || 1) * 30)}`}
                  icon={<TrendingUp className="w-5 h-5 text-white" />}
                  color="bg-pink-500"
                  subtitle="Mensual"
                />
              </div>
            </TabPanel>

            {/* Tab 3: Historial de Validaciones */}
            <TabPanel value={activeTab} index={2}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                    Historial de Validaciones
                  </h4>
                  <button
                    onClick={loadProfileData}
                    disabled={loading}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Refresh className="w-4 h-4 inline mr-1" />
                    Actualizar
                  </button>
                </div>

                {validaciones.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {validaciones.slice(0, 10).map((validacion) => (
                      <div 
                        key={validacion.id} 
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">
                            {validacion.beneficioTitulo}
                          </div>
                          {getValidationStatusChip(validacion.estado)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{validacion.comercioNombre}</span>
                          <span className="text-green-600 font-medium">
                            {validacion.tipoDescuento === 'porcentaje' 
                              ? `${validacion.descuento}%` 
                              : `$${validacion.descuento}`
                            }
                          </span>
                          <span className="text-gray-500">
                            {format(validacion.fechaValidacion, 'dd MMM', { locale: es })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      No hay validaciones
                    </div>
                    <div className="text-xs text-gray-500">
                      Las validaciones aparecerán aquí
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>

            {/* Tab 4: Configuración */}
            <TabPanel value={activeTab} index={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuración de notificaciones */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Notifications className="w-5 h-5 mr-2 text-blue-600" />
                    Notificaciones
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      {
                        key: 'notificaciones',
                        label: 'Notificaciones generales',
                        icon: <NotificationsActive />,
                        enabled: socio.configuracion?.notificaciones ?? true,
                      },
                      {
                        key: 'notificacionesEmail',
                        label: 'Notificaciones por email',
                        icon: <Mail />,
                        enabled: socio.configuracion?.notificacionesEmail ?? true,
                      },
                      {
                        key: 'notificacionesSMS',
                        label: 'Notificaciones por SMS',
                        icon: <Sms />,
                        enabled: socio.configuracion?.notificacionesSMS ?? false,
                      },
                    ].map((config) => (
                      <div key={config.key} className="flex items-center gap-3 py-2">
                        <div className={`${config.enabled ? 'text-green-600' : 'text-gray-400'} w-5 h-5`}>
                          {config.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{config.label}</div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {config.enabled ? 'Activado' : 'Desactivado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuración de privacidad */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Security className="w-5 h-5 mr-2 text-green-600" />
                    Privacidad
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      {
                        key: 'perfilPublico',
                        label: 'Perfil público',
                        icon: <Visibility />,
                        enabled: socio.configuracion?.perfilPublico ?? false,
                      },
                      {
                        key: 'mostrarEstadisticas',
                        label: 'Mostrar estadísticas',
                        icon: <BarChart />,
                        enabled: socio.configuracion?.mostrarEstadisticas ?? true,
                      },
                      {
                        key: 'compartirDatos',
                        label: 'Compartir datos',
                        icon: <Share />,
                        enabled: socio.configuracion?.compartirDatos ?? false,
                      },
                    ].map((config) => (
                      <div key={config.key} className="flex items-center gap-3 py-2">
                        <div className={`${config.enabled ? 'text-blue-600' : 'text-gray-400'} w-5 h-5`}>
                          {config.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{config.label}</div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          config.enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {config.enabled ? 'Activado' : 'Desactivado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabPanel>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(socio)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Socio
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
