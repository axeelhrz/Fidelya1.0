"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  BarChart3, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Activity,
  DollarSign,
  UserCheck
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  ordersToday: number;
  pendingOrders: number;
  totalRevenue: number;
  activeMenus: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  user_email?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color = "blue",
  delay = 0 
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange" | "gray";
  delay?: number;
}) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-900",
    green: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-900",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-900",
    gray: "from-gray-50 to-gray-100 border-gray-200 text-gray-900"
  } as const;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border-2 hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium opacity-70">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <p className="text-xs opacity-60 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {trend}
                </p>
              )}
            </div>
            <div className="p-3 rounded-full bg-white/50">
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-60 mt-3">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const QuickActionCard = ({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color = "blue",
  stats,
  delay = 0 
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "purple" | "orange" | "gray";
  stats?: string;
  delay?: number;
}) => {
  const colorClasses = {
    blue: "hover:bg-blue-50 border-blue-100 text-blue-700",
    green: "hover:bg-emerald-50 border-emerald-100 text-emerald-700",
    purple: "hover:bg-purple-50 border-purple-100 text-purple-700",
    orange: "hover:bg-orange-50 border-orange-100 text-orange-700",
    gray: "hover:bg-gray-50 border-gray-100 text-gray-700"
  } as const;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Link href={href}>
        <Card className={`border-2 ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-300 cursor-pointer group`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Icon className="w-8 h-8 mb-2" />
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {description}
            </CardDescription>
          </CardHeader>
          {stats && (
            <CardContent className="pt-0">
              <div className="text-xs font-medium opacity-70 bg-white/50 px-3 py-2 rounded-lg">
                {stats}
              </div>
            </CardContent>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    ordersToday: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeMenus: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Simular carga de datos con un delay realista
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos de ejemplo que se actualizarán cuando conectes la base de datos
      const mockStats: DashboardStats = {
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        ordersToday: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        activeMenus: 0,
        recentActivity: []
      };

      setStats(mockStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">
          Centro de Control
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
          Donde cada dato cuenta una historia, cada métrica revela una oportunidad, 
          y cada decisión construye el futuro de nuestra comunidad educativa.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuarios Activos"
          value={stats.activeUsers}
          description="Miembros de la comunidad"
          icon={UserCheck}
          color="blue"
          delay={0.1}
        />
        
        <StatCard
          title="Pedidos Pendientes"
          value={stats.pendingOrders}
          description="Esperando procesamiento"
          icon={Clock}
          color="orange"
          delay={0.2}
        />
        
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats.totalRevenue)}
          description="Recaudación acumulada"
          icon={DollarSign}
          color="green"
          delay={0.3}
        />
        
        <StatCard
          title="Menús Activos"
          value={stats.activeMenus}
          description="Opciones disponibles"
          icon={Calendar}
          color="purple"
          delay={0.4}
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Gestión de Usuarios"
          description="Administrar perfiles, roles y permisos de la comunidad educativa"
          href="/admin/usuarios"
          icon={Users}
          color="blue"
          stats="Sistema preparado"
          delay={0.5}
        />

        <QuickActionCard
          title="Gestión de Pedidos"
          description="Supervisar, procesar y coordinar todas las solicitudes alimentarias"
          href="/admin/pedidos"
          icon={ShoppingCart}
          color="green"
          stats="Listo para pedidos"
          delay={0.6}
        />

        <QuickActionCard
          title="Gestión de Menú"
          description="Crear, editar y planificar las opciones gastronómicas semanales"
          href="/admin/menu"
          icon={Calendar}
          color="purple"
          stats="Menús configurables"
          delay={0.7}
        />

        <QuickActionCard
          title="Estadísticas"
          description="Analizar tendencias, patrones y métricas de rendimiento"
          href="/admin/estadisticas"
          icon={BarChart3}
          color="orange"
          stats="Reportes disponibles"
          delay={0.8}
        />

        <QuickActionCard
          title="Configuración"
          description="Personalizar parámetros del sistema y preferencias operativas"
          href="/admin/configuracion"
          icon={Settings}
          color="gray"
          stats="Sistema configurable"
          delay={0.9}
        />

        <QuickActionCard
          title="Monitoreo"
          description="Supervisar el estado y rendimiento del sistema en tiempo real"
          href="/admin/monitoreo"
          icon={Activity}
          color="blue"
          stats="Sistema monitoreado"
          delay={1.0}
        />
      </div>

      {/* System Status */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Estado del Sistema
                </h3>
                <p className="text-blue-700">
                  Sistema inicializado y listo para configuración
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Interfaz: Activa
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Módulos: Disponibles
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Configuración: Pendiente
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Welcome Message */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Bienvenido al Centro de Control
            </CardTitle>
            <CardDescription className="text-gray-600">
              Tu plataforma administrativa está lista para gestionar la experiencia alimentaria educativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">Paso 1</h4>
                  <p className="text-sm text-blue-700">Configura los usuarios y roles del sistema</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <h4 className="font-medium text-purple-900 mb-2">Paso 2</h4>
                  <p className="text-sm text-purple-700">Crea y organiza los menús semanales</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <h4 className="font-medium text-green-900 mb-2">Paso 3</h4>
                  <p className="text-sm text-green-700">Comienza a recibir y gestionar pedidos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}