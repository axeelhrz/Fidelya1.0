"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
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
}

interface RecentOrder {
  id: string;
  nombre_estudiante: string;
  opcion_elegida: string;
  estado_pago: string;
  created_at: string;
  monto: number;
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
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Obtener estadísticas generales
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      // Total de pedidos
      const { count: totalPedidos } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true });

      // Pedidos de hoy
      const { count: pedidosHoy } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .eq('dia_entrega', today);

      // Pedidos pendientes
      const { count: pedidosPendientes } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .eq('estado_pago', 'PENDIENTE');

      // Usuarios activos (clientes con pedidos en el último mes)
      const { data: usuariosActivosData } = await supabase
        .from('pedidos')
        .select('cliente_id')
        .gte('created_at', startOfMonth);

      const usuariosActivos = new Set(usuariosActivosData?.map(p => p.cliente_id)).size;

      // Pedidos recientes
      const { data: recentOrdersData } = await supabase
        .from('pedidos')
        .select('id, nombre_estudiante, opcion_elegida, estado_pago, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

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
        };
      });

      const chartDataResults = await Promise.all(chartDataPromises);

      // Datos para gráfico de torta - distribución por estado
      const { data: estadosData } = await supabase
        .from('pedidos')
        .select('estado_pago')
        .gte('created_at', startOfMonth);

      const estadosCount = estadosData?.reduce((acc: any, curr) => {
        acc[curr.estado_pago] = (acc[curr.estado_pago] || 0) + 1;
        return acc;
      }, {});

      const pieDataResults = Object.entries(estadosCount || {}).map(([estado, count], index) => ({
        name: estado,
        value: count,
        color: COLORS[index % COLORS.length],
      }));

      setStats({
        totalPedidos: totalPedidos || 0,
        pedidosHoy: pedidosHoy || 0,
        ingresosMes: 0, // Calcular según precios
        usuariosActivos,
        pedidosPendientes: pedidosPendientes || 0,
        tendenciaPedidos: Math.random() * 20 - 10, // Placeholder
        tendenciaIngresos: Math.random() * 20 - 10, // Placeholder
      });

      setRecentOrders(recentOrdersData || []);
      setChartData(chartDataResults);
      setPieData(pieDataResults);

    } catch (error: any) {
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
    color = "green" 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: "up" | "down";
    trendValue?: number;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {title}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {value}
              </p>
              {trend && trendValue !== undefined && (
                <div className={`flex items-center mt-2 text-sm ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(trendValue).toFixed(1)}%</span>
                  <span className="text-slate-500 ml-1">vs mes anterior</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${
              color === 'green' ? 'from-green-500 to-emerald-600' :
              color === 'blue' ? 'from-blue-500 to-indigo-600' :
              color === 'yellow' ? 'from-yellow-500 to-orange-600' :
              'from-purple-500 to-pink-600'
            }`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard Administrativo
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Resumen general del sistema de casino escolar
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Último mes
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver reporte
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pedidos"
          value={stats.totalPedidos}
          icon={ShoppingCart}
          trend={stats.tendenciaPedidos > 0 ? "up" : "down"}
          trendValue={stats.tendenciaPedidos}
          color="green"
        />
        <StatCard
          title="Pedidos Hoy"
          value={stats.pedidosHoy}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Usuarios Activos"
          value={stats.usuariosActivos}
          icon={Users}
          color="yellow"
        />
        <StatCard
          title="Pedidos Pendientes"
          value={stats.pedidosPendientes}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pedidos por Día</span>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Estado de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Opción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.nombre_estudiante}
                    </TableCell>
                    <TableCell>{order.opcion_elegida}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.estado_pago === 'PAGADO' ? 'default' :
                          order.estado_pago === 'PENDIENTE' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {order.estado_pago}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('es-CL')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}