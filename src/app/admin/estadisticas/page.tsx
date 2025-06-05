"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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

// Datos de ejemplo para funcionar sin Supabase
const statsData = [
  {
    title: 'Total Pedidos',
    value: 1234,
    change: 12.5,
    trend: 'up' as const,
    icon: ShoppingCart,
    color: 'green'
  },
  {
    title: 'Ingresos Totales',
    value: '$4,567,890',
    change: 8.2,
    trend: 'up' as const,
    icon: DollarSign,
    color: 'blue'
  },
  {
    title: 'Usuarios Activos',
    value: 156,
    change: 5.2,
    trend: 'up' as const,
    icon: Users,
    color: 'purple'
  },
  {
    title: 'Promedio Diario',
    value: 42,
    change: 2.1,
    trend: 'up' as const,
    icon: Calendar,
    color: 'orange'
  }
];

const ordersChartData = [
  { name: 'Lun', orders: 45, revenue: 157500 },
  { name: 'Mar', orders: 52, revenue: 182000 },
  { name: 'Mié', orders: 38, revenue: 133000 },
  { name: 'Jue', orders: 61, revenue: 213500 },
  { name: 'Vie', orders: 55, revenue: 192500 },
  { name: 'Sáb', orders: 28, revenue: 98000 },
  { name: 'Dom', orders: 15, revenue: 52500 }
];

const categoryChartData = [
  { name: 'Almuerzo', value: 180 },
  { name: 'Colación', value: 120 }
];

const userTypeChartData = [
  { name: 'Estudiantes', value: 250 },
  { name: 'Funcionarios', value: 50 }
];

const topMenuData = [
  { name: 'Pollo al horno', value: 45 },
  { name: 'Pescado a la plancha', value: 38 },
  { name: 'Sándwich de palta', value: 32 },
  { name: 'Cazuela de pollo', value: 28 },
  { name: 'Lasaña de verduras', value: 25 }
];

export default function EstadisticasPage() {
  const [loading] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const { toast } = useToast();

  const exportReport = async () => {
    try {
      // Simular exportación
      const csvContent = 'REPORTE DE ESTADÍSTICAS\nDatos de ejemplo para demostración\n';
      
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
        description: "Error simulado para demostración",
      });
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
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
          <Button onClick={() => {}} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
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
                <AreaChart data={ordersChartData}>
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
                <BarChart data={categoryChartData}>
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
                <BarChart data={userTypeChartData}>
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
                <BarChart data={topMenuData}>
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
      </div>
    </div>
  );
}