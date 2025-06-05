"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface EstadisticasData {
  ventasPorDia: any[];
  pedidosPorOpcion: any[];
  ingresosPorMes: any[];
  distribucionEstados: any[];
  tendencias: {
    pedidosTotal: number;
    crecimientoPedidos: number;
    ingresosTotal: number;
    crecimientoIngresos: number;
  };
}

export default function EstadisticasPage() {
  const [data, setData] = useState<EstadisticasData>({
    ventasPorDia: [],
    pedidosPorOpcion: [],
    ingresosPorMes: [],
    distribucionEstados: [],
    tendencias: {
      pedidosTotal: 0,
      crecimientoPedidos: 0,
      ingresosTotal: 0,
      crecimientoIngresos: 0,
    }
  });
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("30"); // días
  const { toast } = useToast();

  useEffect(() => {
    loadEstadisticas();
  }, [periodo]);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - parseInt(periodo));
      const fechaInicioStr = fechaInicio.toISOString().split('T')[0];

      // Ventas por día
      const { data: pedidosData } = await supabase
        .from('pedidos')
        .select('dia_entrega, estado_pago, created_at')
        .gte('created_at', fechaInicioStr)
        .order('dia_entrega');

      // Procesar datos para gráficos
      const ventasPorDia = procesarVentasPorDia(pedidosData || []);
      const pedidosPorOpcion = await procesarPedidosPorOpcion();
      const distribucionEstados = procesarDistribucionEstados(pedidosData || []);
      const tendencias = calcularTendencias(pedidosData || []);

      setData({
        ventasPorDia,
        pedidosPorOpcion,
        ingresosPorMes: [], // Implementar según necesidades
        distribucionEstados,
        tendencias
      });

    } catch (error: any) {
      console.error('Error loading statistics:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar estadísticas",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const procesarVentasPorDia = (pedidos: any[]) => {
    const ventasPorDia: { [key: string]: number } = {};
    
    pedidos.forEach(pedido => {
      const fecha = pedido.dia_entrega;
      ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + 1;
    });

    return Object.entries(ventasPorDia)
      .map(([fecha, cantidad]) => ({
        fecha: new Date(fecha).toLocaleDateString('es-CL', { 
          day: 'numeric', 
          month: 'short' 
        }),
        pedidos: cantidad,
        ingresos: cantidad * 3500 // Precio promedio estimado
      }))
      .slice(-14); // Últimos 14 días
  };

  const procesarPedidosPorOpcion = async () => {
    const { data } = await supabase
      .from('pedidos')
      .select('opcion_elegida')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const opciones: { [key: string]: number } = {};
    data?.forEach(pedido => {
      opciones[pedido.opcion_elegida] = (opciones[pedido.opcion_elegida] || 0) + 1;
    });

    return Object.entries(opciones).map(([opcion, cantidad]) => ({
      opcion,
      cantidad,
      porcentaje: ((cantidad / (data?.length || 1)) * 100).toFixed(1)
    }));
  };

  const procesarDistribucionEstados = (pedidos: any[]) => {
    const estados: { [key: string]: number } = {};
    
    pedidos.forEach(pedido => {
      estados[pedido.estado_pago] = (estados[pedido.estado_pago] || 0) + 1;
    });

    return Object.entries(estados).map(([estado, cantidad], index) => ({
      name: estado,
      value: cantidad,
      color: COLORS[index % COLORS.length]
    }));
  };

  const calcularTendencias = (pedidos: any[]) => {
    const ahora = new Date();
    const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    const hace60Dias = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000);

    const pedidosUltimos30 = pedidos.filter(p => new Date(p.created_at) >= hace30Dias).length;
    const pedidosAnteriores30 = pedidos.filter(p => {
      const fecha = new Date(p.created_at);
      return fecha >= hace60Dias && fecha < hace30Dias;
    }).length;

    const crecimientoPedidos = pedidosAnteriores30 > 0 
      ? ((pedidosUltimos30 - pedidosAnteriores30) / pedidosAnteriores30) * 100 
      : 0;

    return {
      pedidosTotal: pedidosUltimos30,
      crecimientoPedidos,
      ingresosTotal: pedidosUltimos30 * 3500,
      crecimientoIngresos: crecimientoPedidos // Simplificado
    };
  };

  const exportarDatos = () => {
    // Implementar exportación a Excel/PDF
    toast({
      title: "Exportando datos",
      description: "Los datos se están preparando para la descarga...",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            Estadísticas y Reportes
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Análisis detallado del rendimiento del sistema
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Select value={periodo} onValueChange={setPeriodo}>
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
          <Button variant="outline" size="sm" onClick={exportarDatos}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Pedidos</p>
                  <p className="text-3xl font-bold mt-2">{data.tendencias.pedidosTotal}</p>
                  <div className="flex items-center mt-2">
                    {data.tendencias.crecimientoPedidos >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {Math.abs(data.tendencias.crecimientoPedidos).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Ingresos Estimados</p>
                  <p className="text-3xl font-bold mt-2">
                    ${data.tendencias.ingresosTotal.toLocaleString('es-CL')}
                  </p>
                  <div className="flex items-center mt-2">
                    {data.tendencias.crecimientoIngresos >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {Math.abs(data.tendencias.crecimientoIngresos).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Promedio Diario</p>
                  <p className="text-3xl font-bold mt-2">
                    {Math.round(data.tendencias.pedidosTotal / parseInt(periodo))}
                  </p>
                  <p className="text-sm text-purple-200 mt-2">pedidos por día</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Opción Más Popular</p>
                  <p className="text-2xl font-bold mt-2">
                    {data.pedidosPorOpcion[0]?.opcion || 'N/A'}
                  </p>
                  <p className="text-sm text-orange-200 mt-2">
                    {data.pedidosPorOpcion[0]?.porcentaje || 0}% del total
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="ventas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ventas">Ventas por Día</TabsTrigger>
          <TabsTrigger value="opciones">Opciones Populares</TabsTrigger>
          <TabsTrigger value="estados">Estados de Pago</TabsTrigger>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Ventas por Día</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={data.ventasPorDia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="fecha" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
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
                      dataKey="pedidos" 
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="opciones">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Opciones Más Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsBarChart data={data.pedidosPorOpcion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="opcion" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="estados">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Distribución de Estados de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={data.distribucionEstados}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.distribucionEstados.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="tendencias">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Análisis de Tendencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Crecimiento de Pedidos</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${
                        data.tendencias.crecimientoPedidos >= 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {data.tendencias.crecimientoPedidos >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {Math.abs(data.tendencias.crecimientoPedidos).toFixed(1)}%
                        </p>
                        <p className="text-sm text-slate-500">vs período anterior</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Proyección Mensual</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pedidos estimados</span>
                        <span className="font-semibold">
                          {Math.round(data.tendencias.pedidosTotal * (30 / parseInt(periodo)))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingresos estimados</span>
                        <span className="font-semibold">
                          ${(data.tendencias.ingresosTotal * (30 / parseInt(periodo))).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}