"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Activity,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress-bar";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {  
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardStats {
  totalPedidos: number;
  pedidosHoy: number;
  ingresosMes: number;
  usuariosActivos: number;
  pedidosPendientes: number;
  tendenciaPedidos: number;
  tendenciaIngresos: number;
  tasaCompletacion: number;
}

interface RecentOrder {
  id: string;
  nombre_estudiante: string;
  opcion_elegida: string;
  estado_pago: string;
  created_at: string;
  monto: number;
}

interface ActivityItem {
  id: string;
  type: 'order' | 'payment' | 'user' | 'system';
  message: string;
  timestamp: string;
  user?: string;
}

interface ChartDataItem {
  date: string;
  pedidos: number;
  ingresos: number;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPedidos: 0,
    pedidosHoy: 0,
    ingresosMes: 0,
    usuariosActivos: 0,
    pedidosPendientes: 0,
    tendenciaPedidos: 0,
    tendenciaIngresos: 0,
    tasaCompletacion: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    
    // Actualizar datos cada 5 minutos
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Obtener estadísticas generales
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      // Ejecutar consultas en paralelo para mejor rendimiento
      const [
        totalPedidosResult,
        pedidosHoyResult,
        pedidosPendientesResult,
        usuariosActivosResult,
        recentOrdersResult
      ] = await Promise.all([
        supabase.from('pedidos').select('*', { count: 'exact', head: true }),
        supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('dia_entrega', today),
        supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('estado_pago', 'PENDIENTE'),
        supabase.from('pedidos').select('cliente_id').gte('created_at', startOfMonth),
        supabase.from('pedidos')
          .select('id, nombre_estudiante, opcion_elegida, estado_pago, created_at, monto')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const usuariosActivos = new Set(usuariosActivosResult.data?.map(p => p.cliente_id)).size;

      // Datos para gráficos - últimos 7 días
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const chartDataPromises = last7Days.map(async (date) => {
        const { count } = await supabase
          .from('pedidos')
          .select('*', { count: 'exact', head: true })
          .eq('dia_entrega', date);

        return {
          date: new Date(date).toLocaleDateString('es-CL', { 
            weekday: 'short', 
            day: 'numeric' 
          }),
          pedidos: count || 0,
          ingresos: (count || 0) * 3500, // Precio promedio estimado
        };
      });

      const chartDataResults = await Promise.all(chartDataPromises);

      // Datos para gráfico de torta - distribución por estado
      const { data: estadosData } = await supabase
        .from('pedidos')
        .select('estado_pago')
        .gte('created_at', startOfMonth);

      const estadosCount = estadosData?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.estado_pago] = (acc[curr.estado_pago] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const pieDataResults = Object.entries(estadosCount || {}).map(([estado, count], index) => ({
        name: estado,
        value: count,
        color: COLORS[index % COLORS.length],
      }));

      // Calcular tasa de completación
      const totalPedidos = totalPedidosResult.count || 0;
      const pedidosPagados = estadosCount?.['PAGADO'] || 0;
      const tasaCompletacion = totalPedidos > 0 ? (pedidosPagados / totalPedidos) * 100 : 0;

      // Generar actividad reciente simulada
      const actividadReciente: ActivityItem[] = [
        {
          id: '1',
          type: 'order',
          message: 'Nuevo pedido recibido',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          user: 'María González'
        },
        {
          id: '2',
          type: 'payment',
          message: 'Pago confirmado',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          user: 'Carlos Pérez'
        },
        {
          id: '3',
          type: 'user',
          message: 'Nuevo usuario registrado',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          user: 'Ana Martínez'
        },
        {
          id: '4',
          type: 'system',
          message: 'Menú actualizado para la próxima semana',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
      ];

      setStats({
        totalPedidos: totalPedidos,
        pedidosHoy: pedidosHoyResult.count || 0,
        ingresosMes: (estadosCount?.['PAGADO'] || 0) * 3500,
        usuariosActivos,
        pedidosPendientes: pedidosPendientesResult.count || 0,
        tendenciaPedidos: Math.random() * 20 - 10, // Placeholder
        tendenciaIngresos: Math.random() * 20 - 10, // Placeholder
        tasaCompletacion,
      });

      setRecentOrders(recentOrdersResult.data || []);
      setRecentActivity(actividadReciente);
      setChartData(chartDataResults);
      setPieData(pieDataResults);

    } catch (error: unknown) {
      console.error('Error loading dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar datos",
        description: "No se pudieron cargar las estadísticas del dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = "green",
    subtitle
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: "up" | "down";
    trendValue?: number;
    color?: string;
    subtitle?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {title}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {subtitle}
                </p>
              )}
              {trend && trendValue !== undefined && (
                <div className={`flex items-center mt-3 text-sm ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="font-medium">{Math.abs(trendValue).toFixed(1)}%</span>
                  <span className="text-slate-500 ml-1">vs mes anterior</span>
                </div>
              )}
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br shadow-lg ${
              color === 'green' ? 'from-green-500 to-emerald-600' :
              color === 'blue' ? 'from-blue-500 to-indigo-600' :
              color === 'yellow' ? 'from-yellow-500 to-orange-600' :
              color === 'purple' ? 'from-purple-500 to-pink-600' :
              'from-slate-500 to-slate-600'
            }`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
          </div>
        </CardContent>
        
        {/* Decorative gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
          color === 'green' ? 'from-green-500 to-emerald-600' :
          color === 'blue' ? 'from-blue-500 to-indigo-600' :
          color === 'yellow' ? 'from-yellow-500 to-orange-600' :
          color === 'purple' ? 'from-purple-500 to-pink-600' :
          'from-slate-500 to-slate-600'
        }`} />
      </Card>
    </motion.div>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'user': return <Users className="h-4 w-4 text-purple-500" />;
      case 'system': return <Activity className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Bienvenido al panel de control del casino escolar
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="shadow-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Último mes
          </Button>
          <Button size="sm" className="shadow-sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver reporte completo
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pedidos"
          value={stats.totalPedidos.toLocaleString()}
          icon={ShoppingCart}
          trend={stats.tendenciaPedidos > 0 ? "up" : "down"}
          trendValue={stats.tendenciaPedidos}
          color="green"
          subtitle="Pedidos registrados"
        />
        <StatCard
          title="Pedidos Hoy"
          value={stats.pedidosHoy}
          icon={Calendar}
          color="blue"
          subtitle="Para entrega hoy"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${stats.ingresosMes.toLocaleString()}`}
          icon={DollarSign}
          trend={stats.tendenciaIngresos > 0 ? "up" : "down"}
          trendValue={stats.tendenciaIngresos}
          color="yellow"
          subtitle="CLP"
        />
        <StatCard
          title="Usuarios Activos"
          value={stats.usuariosActivos}
          icon={Users}
          color="purple"
          subtitle="Este mes"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Tasa de Completación
                </h3>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.tasaCompletacion.toFixed(1)}%
                  </span>
                  <Badge variant="secondary">
                    {stats.totalPedidos - stats.pedidosPendientes} completados
                  </Badge>
                </div>
                <Progress 
                  value={stats.tasaCompletacion} 
                  variant="success"
                  showValue={false}
                  animated={true}
                />
                <p className="text-sm text-slate-500">
                  {stats.pedidosPendientes} pedidos pendientes
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Promedio Diario
                </h3>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.round(stats.totalPedidos / 30)}
                </div>
                <p className="text-sm text-slate-500">pedidos por día</p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span>Pico: 45 pedidos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Estado del Sistema
                </h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Operativo</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tiempo de actividad</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Última actualización</span>
                  <span className="font-medium">Hace 2 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rendimiento</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Excelente
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tendencia de Pedidos</span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '14px'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fill="url(#colorPedidos)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.message}
                      </p>
                      {activity.user && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activity.user}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs text-slate-400">
                        {getTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  Ver toda la actividad
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders and Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pedidos Recientes</span>
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {order.nombre_estudiante.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {order.nombre_estudiante}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {order.opcion_elegida}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          order.estado_pago === 'PAGADO' ? 'default' :
                          order.estado_pago === 'PENDIENTE' ? 'secondary' :
                          'destructive'
                        }
                        className={
                          order.estado_pago === 'PAGADO' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          order.estado_pago === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                          ''
                        }
                      >
                        {order.estado_pago}
                      </Badge>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Distribución de Estados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20"
              >
                <ShoppingCart className="h-6 w-6 text-green-600" />
                <span className="text-sm">Ver Pedidos</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
              >
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Gestionar Usuarios</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20"
              >
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Actualizar Menú</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-900/20"
              >
                <TrendingUp className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Ver Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
