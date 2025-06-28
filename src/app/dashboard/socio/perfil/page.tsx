'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard,
  Settings,
  Save,
  X,
  RefreshCw,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Award,
  Target,
  Activity,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Palette
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ProfileFormData {
  nombre: string;
  telefono: string;
  dni: string;
  direccion: string;
}

interface ConfiguracionData {
  notificaciones: boolean;
  tema: 'light' | 'dark' | 'auto';
  perfilPublico: boolean;
  mostrarEstadisticas: boolean;
}

export default function SocioPerfilPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  
  // Datos simulados del perfil
  const [socioData, setSocioData] = useState({
    nombre: user?.nombre || 'Juan Pérez',
    email: user?.email || 'juan.perez@email.com',
    telefono: '+54 11 1234-5678',
    dni: '12.345.678',
    direccion: 'Av. Corrientes 1234, CABA',
    estado: 'activo' as const,
    creadoEn: new Date('2023-01-15'),
    ultimoAcceso: new Date()
  });

  // Estadísticas simuladas
  const [stats] = useState({
    beneficiosUsados: 24,
    ahorroTotal: 15750,
    beneficiosEsteMes: 8,
    asociacionesActivas: 2,
    racha: 12,
    nivel: 'Gold'
  });

  // Asociaciones simuladas
  const [asociaciones] = useState([
    {
      id: '1',
      nombre: 'Asociación de Comerciantes Centro',
      estado: 'activo' as const,
      fechaVencimiento: new Date('2024-12-31'),
      descripcion: 'Descuentos en comercios del centro de la ciudad'
    },
    {
      id: '2',
      nombre: 'Cámara de Comercio Local',
      estado: 'vencido' as const,
      fechaVencimiento: new Date('2024-01-15'),
      descripcion: 'Red de comercios locales y servicios'
    }
  ]);

  // Configuración simulada
  const [configuracion, setConfiguracion] = useState<ConfiguracionData>({
    notificaciones: true,
    tema: 'light',
    perfilPublico: false,
    mostrarEstadisticas: true
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: socioData.nombre,
    telefono: socioData.telefono,
    dni: socioData.dni,
    direccion: socioData.direccion
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSocioData(prev => ({ ...prev, ...formData }));
      setEditModalOpen(false);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfigModalOpen(false);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Datos actualizados');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-500';
      case 'vencido': return 'bg-yellow-500';
      case 'inactivo': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Socio Activo';
      case 'vencido': return 'Membresía Vencida';
      case 'inactivo': return 'Socio Inactivo';
      default: return 'Estado Desconocido';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'activo': return <CheckCircle size={16} className="text-green-500" />;
      case 'vencido': return <XCircle size={16} className="text-red-500" />;
      case 'pendiente': return <Clock size={16} className="text-yellow-500" />;
      case 'inactivo': return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColorClass = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'vencido': return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactivo': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout
      activeSection="perfil"
      sidebarComponent={SocioSidebar}
    >
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
              <p className="text-gray-600">
                Gestiona tu información personal y configuración de cuenta
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={handleRefresh}
              loading={loading}
            >
              Actualizar
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tarjeta de Perfil Principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header con gradiente */}
              <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Settings size={16} />}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => setConfigModalOpen(true)}
                  >
                    Configuración
                  </Button>
                </div>
              </div>

              <div className="px-6 pb-6">
                {/* Avatar y información básica */}
                <div className="flex items-start justify-between -mt-16 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                      <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <User size={32} className="text-white" />
                      </div>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 ${getStatusColor(socioData.estado)} rounded-full border-3 border-white flex items-center justify-center`}>
                      <CheckCircle size={14} className="text-white" />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    leftIcon={<Edit3 size={16} />}
                    onClick={() => setEditModalOpen(true)}
                    className="mt-4"
                  >
                    Editar Perfil
                  </Button>
                </div>

                {/* Información del usuario */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{socioData.nombre}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{getStatusText(socioData.estado)}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        {stats.nivel}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Mail size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Email</p>
                        <p className="text-gray-900 font-medium">{socioData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Phone size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Teléfono</p>
                        <p className="text-gray-900 font-medium">{socioData.telefono}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <CreditCard size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">DNI</p>
                        <p className="text-gray-900 font-medium">{socioData.dni}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <MapPin size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Dirección</p>
                        <p className="text-gray-900 font-medium">{socioData.direccion}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm md:col-span-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Calendar size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Miembro desde</p>
                        <p className="text-gray-900 font-medium">
                          {format(socioData.creadoEn, 'dd MMMM yyyy', { locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Estadísticas Detalladas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Estadísticas de Actividad</h3>
                  <p className="text-sm text-gray-500">Tu rendimiento como socio</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Award size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.beneficiosUsados}</div>
                  <div className="text-xs text-gray-600">Beneficios Usados</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">${stats.ahorroTotal.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Total Ahorrado</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Activity size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600">{stats.beneficiosEsteMes}</div>
                  <div className="text-xs text-gray-600">Este Mes</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{stats.racha}</div>
                  <div className="text-xs text-gray-600">Días de Racha</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Mis Asociaciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mis Asociaciones</h3>
                  <p className="text-sm text-gray-500">Estado de membresías</p>
                </div>
              </div>

              <div className="space-y-4">
                {asociaciones.map((asociacion, index) => (
                  <motion.div
                    key={asociacion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                          <Building2 size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{asociacion.nombre}</h4>
                          <p className="text-xs text-gray-500">
                            {asociacion.estado === 'activo' 
                              ? `Vence: ${format(asociacion.fechaVencimiento, 'dd/MM/yyyy', { locale: es })}`
                              : `Venció: ${format(asociacion.fechaVencimiento, 'dd/MM/yyyy', { locale: es })}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 line-clamp-2">{asociacion.descripcion}</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(asociacion.estado)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColorClass(asociacion.estado)}`}>
                          {asociacion.estado === 'activo' ? 'Activo' : 'Vencido'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Resumen */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {asociaciones.filter(a => a.estado === 'activo').length}
                    </div>
                    <div className="text-xs text-gray-500">Activas</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {asociaciones.filter(a => a.estado === 'vencido').length}
                    </div>
                    <div className="text-xs text-gray-500">Vencidas</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Consejos y Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6"
            >
              <h3 className="font-medium text-blue-900 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Consejos para tu perfil
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Mantén tu información actualizada para recibir beneficios personalizados
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Verifica que tu teléfono esté correcto para notificaciones importantes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Contacta a tu asociación si tienes problemas con tu membresía
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Usa más beneficios para subir de nivel y obtener mejores descuentos
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Modal de Edición de Perfil */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                label="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Tu nombre completo"
                required
              />

              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Tu número de teléfono"
              />

              <Input
                label="DNI"
                value={formData.dni}
                onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                placeholder="Tu número de documento"
              />

              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Tu dirección"
              />
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
                loading={loading}
                leftIcon={<Save size={16} />}
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Configuración */}
        <Dialog open={configModalOpen} onClose={() => setConfigModalOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configuración de Cuenta</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Notificaciones */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Bell size={16} />
                  Notificaciones
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Recibir notificaciones</span>
                    <input
                      type="checkbox"
                      checked={configuracion.notificaciones}
                      onChange={(e) => setConfiguracion(prev => ({ ...prev, notificaciones: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>

              {/* Privacidad */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Shield size={16} />
                  Privacidad
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Perfil público</span>
                    <input
                      type="checkbox"
                      checked={configuracion.perfilPublico}
                      onChange={(e) => setConfiguracion(prev => ({ ...prev, perfilPublico: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Mostrar estadísticas</span>
                    <input
                      type="checkbox"
                      checked={configuracion.mostrarEstadisticas}
                      onChange={(e) => setConfiguracion(prev => ({ ...prev, mostrarEstadisticas: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>

              {/* Tema */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Palette size={16} />
                  Apariencia
                </h4>
                <select
                  value={configuracion.tema}
                  onChange={(e) => setConfiguracion(prev => ({ ...prev, tema: e.target.value as 'light' | 'dark' | 'auto' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
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
                loading={loading}
                leftIcon={<Save size={16} />}
              >
                Guardar Configuración
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}