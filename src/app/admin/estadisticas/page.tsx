"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  date?: string;
  orders?: number;
  revenue?: number;
  students?: number;
  staff?: number;
}

interface OrderData {
  created_at: string;
  total_amount: number;
  quantity?: number;
  menu_items?: {
    name?: string;
    category?: string;
  };
  students?: {
    user_type?: string;
  };
}

interface ReportData {
  periodo: string;
  fecha_generacion: string;
  estadisticas: StatCard[];
  pedidos_por_dia: ChartData[];
  categorias: ChartData[];
  tipos_usuario: ChartData[];
  top_menus: ChartData[];
}


export default function EstadisticasPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // días
  const [stats, setStats] = useState<StatCard[]>([]);
  const [ordersChart, setOrdersChart] = useState<ChartData[]>([]);
  const [categoryChart, setCategoryChart] = useState<ChartData[]>([]);
  const [userTypeChart, setUserTypeChart] = useState<ChartData[]>([]);
  const [topMenuItems, setTopMenuItems] = useState<ChartData[]>([]);
  const [dailyTrends, setDailyTrends] = useState<ChartData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, [dateRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(dateRange));

      // Obtener estadísticas generales
      const { data: dashboardStats } = await supabase.rpc('get_dashboard_stats');
      const currentStats = dashboardStats?.[0];

      // Obtener datos del período anterior para comparación
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - parseInt(dateRange));

      const [
        currentPeriodOrders,
        previousPeriodOrders,
        currentPeriodRevenue,
        previousPeriodRevenue,
        ordersData,
        categoryData,
        userTypeData,
        topMenuData
      ] = await Promise.all([
        // Pedidos período actual
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Pedidos período anterior
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', prevStartDate.toISOString())
          .lt('created_at', startDate.toISOString()),
        
        // Ingresos período actual
        supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'completed')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Ingresos período anterior
        supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'completed')
          .gte('created_at', prevStartDate.toISOString())
          .lt('created_at', startDate.toISOString()),
        
        // Datos para gráfico de pedidos por día
        supabase
          .from('orders')
          .select('created_at, total_amount')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at'),
        
        // Datos por categoría
        supabase
          .from('orders')
          .select(`
            menu_items(category),
            total_amount
          `)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Datos por tipo de usuario
        supabase
          .from('orders')
          .select(`
            students(user_type),
            total_amount
          `)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Top menús más pedidos
        supabase
          .from('orders')
          .select(`
            menu_items(name),
            quantity
          `)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      // Calcular estadísticas principales
      const currentOrdersCount = currentPeriodOrders.count || 0;
      const previousOrdersCount = previousPeriodOrders.count || 0;
      const ordersChange = previousOrdersCount > 0 
        ? ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100 
        : 0;

      const currentRevenue = currentPeriodRevenue.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const previousRevenue = previousPeriodRevenue.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const revenueChange = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      const statsCards: StatCard[] = [
        {
          title: 'Total Pedidos',
          value: currentStats?.total_orders || 0,
          change: ordersChange,
          trend: ordersChange >= 0 ? 'up' : 'down',
          icon: ShoppingCart,
          color: 'green'
        },
        {
          title: 'Ingresos Totales',
          value: `$${(currentStats?.total_revenue || 0).toLocaleString()}`,
          change: revenueChange,
          trend: revenueChange >= 0 ? 'up' : 'down',
          icon: DollarSign,
          color: 'blue'
        },
        {
          title: 'Usuarios Activos',
          value: currentStats?.active_users || 0,
          change: 5.2, // Placeholder
          trend: 'up',
          icon: Users,
          color: 'purple'
        },
        {
          title: 'Promedio Diario',
          value: Math.round((currentOrdersCount / parseInt(dateRange)) || 0),
          change: 2.1, // Placeholder
          trend: 'up',
          icon: Calendar,
          color: 'orange'
        }
      ];

      setStats(statsCards);

      // Helper functions for data processing
      const processOrdersByDay = (orders: OrderData[], days: number): ChartData[] => {
        const dailyStats: { [key: string]: { orders: number; revenue: number } } = {};
        
        // Inicializar todos los días
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];
          dailyStats[dateKey] = { orders: 0, revenue: 0 };
        }

        // Procesar pedidos
        orders.forEach(order => {
          const dateKey = order.created_at.split('T')[0];
          if (dailyStats[dateKey]) {
            dailyStats[dateKey].orders += 1;
            dailyStats[dateKey].revenue += order.total_amount;
          }
        });

        // Retornar datos ordenados por fecha
        return Object.entries(dailyStats)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, stats]) => ({
            name: new Date(date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
            value: stats.orders,
            orders: stats.orders,
            revenue: stats.revenue
          }));
      };
      const processCategoryDataFixed = (orders: { menu_items?: { category?: string }[] }[]): ChartData[] => {
        const categoryStats: { [key: string]: number } = {};
        
        orders.forEach(order => {
          const category = order.menu_items?.[0]?.category || 'Sin categoría';
          categoryStats[category] = (categoryStats[category] || 0) + 1;
        });

        return Object.entries(categoryStats).map(([name, value]) => ({
          name,
          value
        }));
      };

      const processUserTypeData = (orders: { students?: { user_type?: string }[]; total_amount: number }[]): ChartData[] => {
        const userTypeStats: { [key: string]: number } = {};
        
        orders.forEach(order => {
          const userType = order.students?.[0]?.user_type || 'estudiante';
          userTypeStats[userType] = (userTypeStats[userType] || 0) + 1;
        });

        return Object.entries(userTypeStats).map(([name, value]) => ({
          name: name === 'estudiante' ? 'Estudiantes' : 'Funcionarios',
          value
        }));
      };

      const processTopMenuDataFromQuery = (orders: { menu_items: { name: string; }[]; quantity: number; }[]): ChartData[] => {
        const menuStats: { [key: string]: number } = {};
        
        orders.forEach(order => {
          const menuName = order.menu_items?.[0]?.name || 'Sin nombre';
          menuStats[menuName] = (menuStats[menuName] || 0) + (order.quantity || 1);
        });

        return Object.entries(menuStats)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
      };

      // Procesar datos para gráficos
      if (ordersData.data) {
        const ordersStats = processOrdersByDay(ordersData.data, parseInt(dateRange));
        setOrdersChart(ordersStats);
        setDailyTrends(ordersStats);
      }
      
      if (categoryData.data) {
        const categoryStats = processCategoryDataFixed(categoryData.data);
        setCategoryChart(categoryStats);
      }

      if (userTypeData.data) {
        const userTypeStats = processUserTypeData(userTypeData.data);
        setUserTypeChart(userTypeStats);
      }

      if (topMenuData.data) {
        const topMenuStats = processTopMenuDataFromQuery(topMenuData.data);
        setTopMenuItems(topMenuStats);
      }

    } catch (error: unknown) {
      console.error('Error loading statistics:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar estadísticas",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCSVReport = (data: ReportData): string => {
    let csv = 'REPORTE DE ESTADÍSTICAS\n';
    csv += `Período: ${data.periodo}\n`;
    csv += `Fecha de generación: ${new Date(data.fecha_generacion).toLocaleString('es-CL')}\n\n`;
    
    csv += 'ESTADÍSTICAS GENERALES\n';
    csv += 'Métrica,Valor,Cambio %\n';
    data.estadisticas.forEach((stat: StatCard) => {
      csv += `"${stat.title}","${stat.value}","${stat.change.toFixed(1)}%"\n`;
    });
    
    csv += '\nPEDIDOS POR DÍA\n';
    csv += 'Fecha,Pedidos,Ingresos\n';
    data.pedidos_por_dia.forEach((day: ChartData) => {
      csv += `"${day.name}","${day.orders}","${day.revenue}"\n`;
    });
    
    return csv;
  };

  const exportReport = async () => {
    try {
      // Generar reporte en CSV
      const reportData = {
        periodo: `${dateRange} días`,
        fecha_generacion: new Date().toISOString(),
        estadisticas: stats,
        pedidos_por_dia: ordersChart,
        categorias: categoryChart,
        tipos_usuario: userTypeChart,
        top_menus: topMenuItems
      };

      const csvContent = generateCSVReport(reportData);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reporte_estadisticas_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Reporte exportado",
        description: "El reporte de estadísticas ha sido descargado exitosamente.",
      });
    } catch (error: unknown) {
      console.error('Error exporting report:', error);
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };


  if (loading) {
    return (
      <AdminGuard requiredPermission="estadisticas.read">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard requiredPermission="estadisticas.read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estadísticas y Reportes</h1>
            <p className="text-gray-600 mt-1">
              Análisis detallado del rendimiento del casino escolar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={loadStatistics} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">
                        {stat.value}
                      </p>
                      <div className={`flex items-center mt-3 text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        <span className="font-medium">{Math.abs(stat.change).toFixed(1)}%</span>
                        <span className="text-slate-500 ml-1">vs período anterior</span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-2xl bg-gradient-to-br shadow-lg ${
                      stat.color === 'green' ? 'from-green-500 to-emerald-600' :
                      stat.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                      stat.color === 'purple' ? 'from-purple-500 to-pink-600' :
                      stat.color === 'orange' ? 'from-orange-500 to-red-600' :
                      'from-slate-500 to-slate-600'
                    }`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencia de Pedidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Tendencia de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ordersChart}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fill="url(#colorOrders)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Distribución por Categoría */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Distribución por Tipo de Usuario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Distribución por Tipo de Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userTypeChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Menús Más Pedidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Top Menús Más Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topMenuItems}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tendencias Diarias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tendencias Diarias</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminGuard>
  );
}