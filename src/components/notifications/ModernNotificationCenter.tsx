'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Send, 
  History, 
  BarChart3, 
  Users, 
  MessageSquare,
  Mail,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  Download,
  Settings,
  Activity
} from 'lucide-react';
import { useSimpleNotifications } from '@/hooks/useSimpleNotifications';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { DeliveryStats } from './DeliveryStats';

type TabType = 'dashboard' | 'send' | 'history';

interface NotificationStats {
  totalSent: number;
  successRate: number;
  monthlyGrowth: number;
  activeRecipients: number;
}

export const ModernNotificationCenter = () => {
  const { user } = useAuth();
  const {
    notifications,
    recipients,
    sendNotification,
    loading,
    sending,
    error
  } = useSimpleNotifications();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  // Form states for sending notifications
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    channels: [] as string[],
    recipientIds: [] as string[]
  });

  // Calculate stats
  const stats: NotificationStats = {
    totalSent: notifications.reduce((acc, n) => acc + (n.status === 'sent' ? 1 : 0), 0),
    successRate: notifications.length > 0 
      ? (notifications.filter(n => n.status === 'sent').length / notifications.length) * 100 
      : 0,
    monthlyGrowth: 12.5, // This would be calculated from historical data
    activeRecipients: recipients.length
  };

  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'send' as TabType,
      label: 'Enviar',
      icon: Send,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'history' as TabType,
      label: 'Historial',
      icon: History,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleSendNotification = async () => {
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    if (notificationForm.channels.length === 0) {
      toast.error('Selecciona al menos un canal');
      return;
    }

    if (notificationForm.recipientIds.length === 0) {
      toast.error('Selecciona al menos un destinatario');
      return;
    }

    try {
      await sendNotification(notificationForm);
      setNotificationForm({
        title: '',
        message: '',
        type: 'info',
        channels: [],
        recipientIds: []
      });
      toast.success('Notificación enviada exitosamente');
    } catch (error) {
      toast.error('Error al enviar la notificación');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Centro de Notificaciones</h1>
                <p className="text-sm text-gray-500">Gestiona tus comunicaciones multicanal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {activeTab === 'dashboard' && (
                <button
                  onClick={() => setShowAdvancedStats(!showAdvancedStats)}
                  className={`p-2 rounded-lg transition-colors ${
                    showAdvancedStats 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                </button>
              )}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <DashboardTab 
                stats={stats} 
                notifications={notifications} 
                recipients={recipients}
                showAdvancedStats={showAdvancedStats}
              />
            )}
            {activeTab === 'send' && (
              <SendTab
                form={notificationForm}
                setForm={setNotificationForm}
                recipients={recipients}
                onSend={handleSendNotification}
                sending={sending}
              />
            )}
            {activeTab === 'history' && (
              <HistoryTab
                notifications={filteredNotifications}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                loading={loading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, notifications, recipients, showAdvancedStats }: {
  stats: NotificationStats;
  notifications: any[];
  recipients: any[];
  showAdvancedStats: boolean;
}) => {
  const recentNotifications = notifications.slice(0, 5);

  if (showAdvancedStats) {
    return <DeliveryStats notifications={notifications} recipients={recipients} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Enviadas"
          value={stats.totalSent.toString()}
          icon={Send}
          color="from-blue-500 to-blue-600"
          trend="+12%"
        />
        <StatsCard
          title="Tasa de Éxito"
          value={`${stats.successRate.toFixed(1)}%`}
          icon={CheckCircle}
          color="from-green-500 to-green-600"
          trend="+5%"
        />
        <StatsCard
          title="Destinatarios"
          value={stats.activeRecipients.toString()}
          icon={Users}
          color="from-purple-500 to-purple-600"
          trend="+8%"
        />
        <StatsCard
          title="Crecimiento"
          value={`${stats.monthlyGrowth}%`}
          icon={TrendingUp}
          color="from-orange-500 to-orange-600"
          trend="+3%"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">En tiempo real</span>
            </div>
          </div>
          <div className="space-y-4">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    notification.status === 'sent' ? 'bg-green-100' :
                    notification.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {notification.status === 'sent' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : notification.status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()} • {notification.channels?.join(', ')}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No hay actividad reciente</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Canales de Comunicación</h3>
          <div className="space-y-4">
            <ChannelCard
              icon={Mail}
              name="Email"
              status="Activo"
              count={recipients.filter(r => r.email).length}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <ChannelCard
              icon={Smartphone}
              name="WhatsApp"
              status="Activo"
              count={recipients.filter(r => r.phone).length}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <ChannelCard
              icon={Bell}
              name="In-App"
              status="Activo"
              count={recipients.length}
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Acciones Rápidas</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <Send className="w-4 h-4" />
                <span className="text-sm font-medium">Enviar</span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exportar</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Send Tab Component
const SendTab = ({ form, setForm, recipients, onSend, sending }: {
  form: any;
  setForm: (form: any) => void;
  recipients: any[];
  onSend: () => void;
  sending: boolean;
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Send className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Notificación</h2>
            <p className="text-sm text-gray-500">Envía mensajes personalizados a tus usuarios</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ingresa el título de la notificación"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje *
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Escribe tu mensaje aquí..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.message.length}/500 caracteres
            </p>
          </div>

          {/* Channels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Canales de Envío *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'email', name: 'Email', icon: Mail, color: 'blue', description: 'Correo electrónico' },
                { id: 'whatsapp', name: 'WhatsApp', icon: Smartphone, color: 'green', description: 'Mensaje de WhatsApp' },
                { id: 'app', name: 'In-App', icon: Bell, color: 'purple', description: 'Notificación en la app' }
              ].map((channel) => {
                const Icon = channel.icon;
                const isSelected = form.channels.includes(channel.id);
                
                return (
                  <motion.button
                    key={channel.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const newChannels = isSelected
                        ? form.channels.filter((c: string) => c !== channel.id)
                        : [...form.channels, channel.id];
                      setForm({ ...form, channels: newChannels });
                    }}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      isSelected
                        ? `border-${channel.color}-500 bg-${channel.color}-50 shadow-md`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${
                      isSelected ? `text-${channel.color}-600` : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium mb-1 ${
                      isSelected ? `text-${channel.color}-900` : 'text-gray-600'
                    }`}>
                      {channel.name}
                    </p>
                    <p className={`text-xs ${
                      isSelected ? `text-${channel.color}-700` : 'text-gray-500'
                    }`}>
                      {channel.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Destinatarios * ({recipients.length} disponibles)
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
              <div className="flex items-center mb-3 p-2 bg-white rounded-lg">
                <input
                  type="checkbox"
                  checked={form.recipientIds.length === recipients.length}
                  onChange={(e) => {
                    const newRecipients = e.target.checked
                      ? recipients.map(r => r.id)
                      : [];
                    setForm({ ...form, recipientIds: newRecipients });
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  Seleccionar todos ({recipients.length})
                </label>
              </div>
              <div className="space-y-2">
                {recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.recipientIds.includes(recipient.id)}
                      onChange={(e) => {
                        const newRecipients = e.target.checked
                          ? [...form.recipientIds, recipient.id]
                          : form.recipientIds.filter((id: string) => id !== recipient.id);
                        setForm({ ...form, recipientIds: newRecipients });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-700">{recipient.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{recipient.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSend}
              disabled={sending}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {sending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Enviar Notificación</span>
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// History Tab Component
const HistoryTab = ({ notifications, searchTerm, setSearchTerm, filterStatus, setFilterStatus, loading }: {
  notifications: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  loading: boolean;
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar notificaciones..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="sent">Enviadas</option>
              <option value="failed">Fallidas</option>
              <option value="sending">Enviando</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando historial...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron notificaciones</h3>
            <p className="text-gray-500">Intenta ajustar los filtros o crear una nueva notificación</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NotificationItem notification={notification} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Helper Components
const StatsCard = ({ title, value, icon: Icon, color, trend }: {
  title: string;
  value: string;
  icon: any;
  color: string;
  trend: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-sm text-green-600 mt-1">{trend}</p>
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const ChannelCard = ({ icon: Icon, name, status, count, color, bgColor }: {
  icon: any;
  name: string;
  status: string;
  count: number;
  color: string;
  bgColor: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`flex items-center justify-between p-4 ${bgColor} rounded-lg transition-all`}
  >
    <div className="flex items-center space-x-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{status}</p>
      </div>
    </div>
    <span className="text-sm font-semibold text-gray-900">{count}</span>
  </motion.div>
);

const NotificationItem = ({ notification }: { notification: any }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'sending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviada';
      case 'failed':
        return 'Fallida';
      case 'sending':
        return 'Enviando';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {getStatusIcon(notification.status)}
            <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
          </div>
          <p className="text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
            <span>•</span>
            <span>{notification.channels?.join(', ')}</span>
            <span>•</span>
            <span>{notification.recipientIds?.length || 0} destinatarios</span>
          </div>
        </div>
        <div className="ml-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            notification.status === 'sent' ? 'bg-green-100 text-green-800' :
            notification.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {getStatusText(notification.status)}
          </span>
        </div>
      </div>
    </div>
  );
};