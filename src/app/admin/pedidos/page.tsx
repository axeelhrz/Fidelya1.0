"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Filter, 
  Search, 
  Calendar,
  Users,
  DollarSign,
  Printer
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/context/UserContext';
import { redirect } from 'next/navigation';
import PedidosDetalle from './components/pedidos-detalle';
import PedidosPorNivel from './components/pedidos-por-nivel';

interface OrderFilters {
  dateFrom: string;
  dateTo: string;
  status: string;
  level: string;
  searchTerm: string;
}

interface OrderSummary {
  totalOrders: number;
  totalAmount: number;
  byStatus: { [key: string]: number };
  byLevel: { [key: string]: number };
}
export default function AdminPedidosPage() {
  const { guardian } = useUser();
  const [activeTab, setActiveTab] = useState('detalle');
  const [filters, setFilters] = useState<OrderFilters>({
    dateFrom: '',
    dateTo: '',
    status: 'TODOS',
    level: 'TODOS',
    searchTerm: ''
  });
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Verificar permisos de admin
  useEffect(() => {
    if (!guardian || (guardian.role !== 'admin' && guardian.role !== 'staff')) {
      redirect('/dashboard');
    }
  }, [guardian]);

  useEffect(() => {
    if (guardian && (guardian.role === 'admin' || guardian.role === 'staff')) {
      loadOrderSummary();
    }
  }, [guardian, filters]);

  const loadOrderSummary = async () => {
    try {
      setLoadingSummary(true);

      let query = supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          students (
            level,
            name,
            grade,
            section
          ),
          guardians (
            full_name
          )
        `);

      // Aplicar filtros
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters.status !== 'TODOS') {
        // Map Spanish status values to database enum values
        const statusMap: { [key: string]: 'pending' | 'paid' | 'cancelled' | 'delivered' } = {
          'PENDIENTE': 'pending',
          'PAGADO': 'paid',
          'CANCELADO': 'cancelled',
          'ENTREGADO': 'delivered'
        };
        const dbStatus = statusMap[filters.status] || filters.status as 'pending' | 'paid' | 'cancelled' | 'delivered';
        query = query.eq('status', dbStatus);
      }

      const { data: orders, error } = await query;

      if (error) {
        console.error('Error loading orders:', error);
        return;
      }

      // Filtrar por nivel y término de búsqueda
      let filteredOrders = orders || [];

      if (filters.level !== 'TODOS') {
        filteredOrders = filteredOrders.filter(order => 
          order.students?.level === filters.level
        );
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
          order.students?.name.toLowerCase().includes(searchLower) ||
          order.guardians?.full_name.toLowerCase().includes(searchLower) ||
          order.students?.grade.toLowerCase().includes(searchLower)
        );
      }

      // Calcular resumen
      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0);

      const byStatus = filteredOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const byLevel = filteredOrders.reduce((acc, order) => {
        const level = order.students?.level || 'UNKNOWN';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      setSummary({
        totalOrders,
        totalAmount,
        byStatus,
        byLevel
      });

    } catch (error) {
      console.error('Error loading order summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const exportToCSV = async () => {
    try {
      // Obtener datos completos para exportar
      let query = supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          students (
            name,
            grade,
            section,
            level
          ),
          guardians (
            full_name,
            email
          ),
          order_items (
            quantity,
            unit_price,
            products (
              code,
              name
            )
          )
        `);

      // Aplicar mismos filtros
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters.status !== 'TODOS') {
        // Map Spanish status values to database enum values
        const statusMap: { [key: string]: 'pending' | 'paid' | 'cancelled' | 'delivered' } = {
          'PENDIENTE': 'pending',
          'PAGADO': 'paid',
          'CANCELADO': 'cancelled',
          'ENTREGADO': 'delivered'
        };
        const dbStatus = statusMap[filters.status] || filters.status as 'pending' | 'paid' | 'cancelled' | 'delivered';
        query = query.eq('status', dbStatus);
      }

      const { data: orders, error } = await query;

      if (error) {
        console.error('Error exporting orders:', error);
        return;
      }

      // Convertir a CSV
      const csvHeaders = [
        'ID Pedido',
        'Fecha Pedido',
        'Día Entrega',
        'Estudiante',
        'Curso',
        'Nivel',
        'Responsable',
        'Email',
        'Productos',
        'Total',
        'Estado',
        'Fecha Creación'
      ];

      const csvRows = orders?.map(order => [
        order.id.substring(0, 8),
        new Date(order.created_at).toLocaleDateString('es-CL'),
        '', // Remove dia_entrega since column doesn't exist
        order.students?.name || '',
        `${order.students?.grade || ''} ${order.students?.section || ''}`,
        order.students?.level || '',
        order.guardians?.full_name || '',
        order.guardians?.email || '',
        order.order_items?.map(item => 
          `${item.products?.code}: ${item.quantity}x`
        ).join('; ') || '',
        order.total_amount,
        order.status,
        new Date(order.created_at).toLocaleDateString('es-CL')
      ]) || [];

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error exporting to CSV:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (!guardian) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!guardian || (guardian.role !== 'admin' && guardian.role !== 'staff')) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">
            Administra y supervisa todos los pedidos del casino
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="dateFrom">Fecha desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Fecha hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={filters.status} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="PAGADO">Pagado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  <SelectItem value="ENTREGADO">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="level">Nivel</Label>
              <Select value={filters.level} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, level: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PREESCOLAR">Preescolar</SelectItem>
                  <SelectItem value="BASICA">Básica</SelectItem>
                  <SelectItem value="MEDIA">Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Estudiante, responsable..."
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-2xl font-bold">{summary.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Ingresos</p>
                  <p className="text-2xl font-bold">{formatPrice(summary.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Por Estado</p>
                <div className="space-y-1">
                  {Object.entries(summary.byStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <Badge variant="outline">{status}</Badge>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Por Nivel</p>
                <div className="space-y-1">
                  {Object.entries(summary.byLevel).map(([level, count]) => (
                    <div key={level} className="flex justify-between text-sm">
                      <span>{level}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs de contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="detalle">Detalle de Pedidos</TabsTrigger>
          <TabsTrigger value="agrupados">Pedidos por Nivel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalle">
          <PedidosDetalle />
        </TabsContent>
        
        <TabsContent value="agrupados">
          <PedidosPorNivel />
        </TabsContent>
      </Tabs>
    </div>
  );
}