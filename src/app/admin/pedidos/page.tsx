"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminGuard } from "@/components/admin/AdminGuard";
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ShoppingCart,
  Search,
  Download,
  Eye,
  Package,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import type { OrderWithDetails, OrderStatus, PaymentStatus, OrderFilters } from '@/lib/supabase/types';

export default function PedidosPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    status: undefined,
    paymentStatus: undefined,
    dateFrom: '',
    dateTo: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [currentPage, filters, searchTerm]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('orders')
        .select(`
          *,
          students(name, grade, section, level),
          menu_items(name, category, price_student, price_staff),
          users(full_name, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters.paymentStatus && filters.paymentStatus.length > 0) {
        query = query.in('payment_status', filters.paymentStatus);
      }

      if (filters.dateFrom) {
        query = query.gte('delivery_date', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('delivery_date', filters.dateTo);
      }

      // Búsqueda por texto
      if (searchTerm) {
        query = query.or(`
          students.name.ilike.%${searchTerm}%,
          users.full_name.ilike.%${searchTerm}%,
          menu_items.name.ilike.%${searchTerm}%
        `);
      }

      // Paginación
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setOrders(data || []);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    } catch (error: unknown) {
      console.error('Error loading orders:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar pedidos",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: "El estado del pedido ha sido actualizado exitosamente.",
      });

      await loadOrders();
      setIsDetailDialogOpen(false);
    } catch (error: unknown) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error al actualizar estado",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Estado de pago actualizado",
        description: "El estado de pago ha sido actualizado exitosamente.",
      });

      await loadOrders();
      setIsDetailDialogOpen(false);
    } catch (error: unknown) {
      console.error('Error updating payment status:', error);
      toast({
        variant: "destructive",
        title: "Error al actualizar estado de pago",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const exportOrders = async () => {
    try {
      // Implementar exportación a CSV/Excel
      const csvContent = orders.map(order => ({
        'ID': order.id,
        'Estudiante': order.students?.name || '',
        'Curso': `${order.students?.grade}${order.students?.section}` || '',
        'Menú': order.menu_items?.[0]?.name || '',
        'Cantidad': order.quantity,
        'Precio': order.total_amount,
        'Fecha Entrega': order.delivery_date,
        'Estado': order.status,
        'Estado Pago': order.payment_status,
        'Creado': new Date(order.created_at).toLocaleDateString('es-CL'),
      }));

      // Convertir a CSV
      const headers = Object.keys(csvContent[0] || {});
      const csvString = [
        headers.join(','),
        ...csvContent.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');

      // Descargar archivo
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación exitosa",
        description: "Los pedidos han sido exportados correctamente.",
      });
    } catch (error: unknown) {
      console.error('Error exporting orders:', error);
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'delivered': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'paid': return <CreditCard className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <AdminGuard requiredPermission="pedidos.read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
            <p className="text-gray-600 mt-1">
              Administra y supervisa todos los pedidos del sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {orders.length} pedidos
            </Badge>
            <Button onClick={exportOrders} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={loadOrders} size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por estudiante, apoderado o menú..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado del Pedido</Label>
                <Select 
                  value={filters.status?.[0] || 'all'} 
                  onValueChange={(value) => 
                    setFilters(prev => ({ 
                      ...prev, 
                      status: value === 'all' ? undefined : [value as OrderStatus] 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado de Pago</Label>
                <Select 
                  value={filters.paymentStatus?.[0] || 'all'} 
                  onValueChange={(value) => 
                    setFilters(prev => ({ 
                      ...prev, 
                      paymentStatus: value === 'all' ? undefined : [value as PaymentStatus] 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los pagos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los pagos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="processing">Procesando</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="failed">Fallido</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Entrega</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Pedidos */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Cargando pedidos...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Menú</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Entrega</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {orders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.students?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">
                              {order.students?.grade}{order.students?.section} - {order.students?.level}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.menu_items?.[0]?.name || 'N/A'}</p>
                            <Badge variant="outline" className="text-xs">
                              {order.menu_items?.[0]?.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>${order.total_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(order.delivery_date).toLocaleDateString('es-CL')}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPaymentStatusColor(order.payment_status)} w-fit`}>
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog 
                              open={isDetailDialogOpen && selectedOrder?.id === order.id}
                              onOpenChange={(open) => {
                                setIsDetailDialogOpen(open);
                                if (!open) setSelectedOrder(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Detalles del Pedido</DialogTitle>
                                  <DialogDescription>
                                    Información completa y opciones de gestión
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedOrder && (
                                  <div className="space-y-6">
                                    {/* Información del estudiante */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                      <h4 className="font-semibold mb-2">Información del Estudiante</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="text-gray-600">Nombre:</span>
                                          <p className="font-medium">{selectedOrder.students?.name}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Curso:</span>
                                          <p className="font-medium">
                                            {selectedOrder.students?.grade}{selectedOrder.students?.section}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Nivel:</span>
                                          <p className="font-medium">{selectedOrder.students?.level}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Apoderado:</span>
                                          <p className="font-medium">{selectedOrder.users?.full_name}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Información del pedido */}
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                      <h4 className="font-semibold mb-2">Detalles del Pedido</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="text-gray-600">Menú:</span>
                                          <p className="font-medium">{selectedOrder.menu_items?.[0]?.name}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Categoría:</span>
                                          <p className="font-medium">{selectedOrder.menu_items?.[0]?.category}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Cantidad:</span>
                                          <p className="font-medium">{selectedOrder.quantity}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Total:</span>
                                          <p className="font-medium">${selectedOrder.total_amount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Fecha Entrega:</span>
                                          <p className="font-medium">
                                            {new Date(selectedOrder.delivery_date).toLocaleDateString('es-CL')}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-gray-600">Creado:</span>
                                          <p className="font-medium">
                                            {new Date(selectedOrder.created_at).toLocaleDateString('es-CL')}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Gestión de estados */}
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Estado del Pedido</Label>
                                        <Select 
                                          value={selectedOrder.status}
                                          onValueChange={(value) => updateOrderStatus(selectedOrder.id, value as OrderStatus)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="confirmed">Confirmado</SelectItem>
                                            <SelectItem value="paid">Pagado</SelectItem>
                                            <SelectItem value="delivered">Entregado</SelectItem>
                                            <SelectItem value="cancelled">Cancelado</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label>Estado de Pago</Label>
                                        <Select 
                                          value={selectedOrder.payment_status}
                                          onValueChange={(value) => updatePaymentStatus(selectedOrder.id, value as PaymentStatus)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="processing">Procesando</SelectItem>
                                            <SelectItem value="completed">Completado</SelectItem>
                                            <SelectItem value="failed">Fallido</SelectItem>
                                            <SelectItem value="cancelled">Cancelado</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}

            {orders.length === 0 && !loading && (
              <div className="p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron pedidos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}