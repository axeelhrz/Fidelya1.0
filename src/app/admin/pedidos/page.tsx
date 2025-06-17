"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Filter,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface Order {
  id: string;
  studentName: string;
  guardianName: string;
  menuItem: string;
  category: 'almuerzo' | 'colacion';
  deliveryDate: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'delivered';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  transactionId?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const MetricCard = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color = "neutral",
  delay = 0 
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: any;
  color?: string;
  delay?: number;
}) => {
  const colors = {
    neutral: "bg-white border-gray-100 text-gray-900",
    blue: "bg-blue-50/50 border-blue-100 text-blue-900",
    green: "bg-emerald-50/50 border-emerald-100 text-emerald-900",
    amber: "bg-amber-50/50 border-amber-100 text-amber-900",
    red: "bg-red-50/50 border-red-100 text-red-900"
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className={`${colors[color]} border backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 opacity-60" />
                <span className="text-sm font-medium opacity-70">{label}</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                {change && (
                  <p className="text-xs opacity-60 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {change}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const OrderCard = ({ 
  order, 
  onView, 
  delay = 0 
}: { 
  order: Order; 
  onView: (order: Order) => void; 
  delay?: number;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'paid': return <CreditCard className="w-3 h-3" />;
      case 'delivered': return <Package className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
    >
      <Card className="bg-white border border-gray-100 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{order.studentName}</h3>
                  <p className="text-sm text-gray-500">{order.guardianName}</p>
                </div>
                <Badge className={`${getStatusColor(order.status)} border text-xs font-medium`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{order.menuItem}</span>
                  <span className="text-sm font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(order.deliveryDate).toLocaleDateString('es-CL')}</span>
                  <span className="capitalize">{order.category}</span>
                </div>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-4"
              onClick={() => onView(order)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const mockOrders: Order[] = [];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Cargando pedidos</p>
            <p className="text-sm text-gray-500">Preparando la información más reciente</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <motion.div 
        className="max-w-7xl mx-auto p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Pedidos
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Gestiona cada solicitud con precisión y cuidado, transformando necesidades en experiencias satisfactorias.
          </p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            label="Total"
            value={0}
            icon={ShoppingCart}
            color="neutral"
            delay={0.1}
          />
          <MetricCard
            label="Pendientes"
            value={0}
            icon={Clock}
            color="amber"
            delay={0.15}
          />
          <MetricCard
            label="Confirmados"
            value={0}
            icon={CheckCircle}
            color="blue"
            delay={0.2}
          />
          <MetricCard
            label="Entregados"
            value={0}
            icon={Package}
            color="green"
            delay={0.25}
          />
          <MetricCard
            label="Ingresos"
            value="$0"
            icon={DollarSign}
            color="green"
            delay={0.3}
          />
        </div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por estudiante o apoderado..."
                    className="pl-10 bg-white/50 border-gray-200 focus:bg-white transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/50 border-gray-200">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="confirmed">Confirmados</SelectItem>
                      <SelectItem value="paid">Pagados</SelectItem>
                      <SelectItem value="delivered">Entregados</SelectItem>
                      <SelectItem value="cancelled">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="bg-white/50 border-gray-200 hover:bg-white">
                    <Filter className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" className="bg-white/50 border-gray-200 hover:bg-white">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <motion.div
              key="empty"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card className="bg-white/70 backdrop-blur-sm border border-gray-100">
                <CardContent className="p-12">
                  <div className="text-center space-y-6">
                    <div className="relative mx-auto w-24 h-24">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Esperando los primeros pedidos
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                        Este espacio se llenará de vida cuando los usuarios comiencen a realizar sus solicitudes alimentarias.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                        <Calendar className="w-4 h-4 mr-2" />
                        Configurar Menús
                      </Button>
                      <Button variant="outline" className="bg-white/50 border-gray-200 hover:bg-white">
                        <User className="w-4 h-4 mr-2" />
                        Gestionar Usuarios
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {orders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={(order) => {
                    setSelectedOrder(order);
                    setIsDetailDialogOpen(true);
                  }}
                  delay={index * 0.05}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-lg bg-white/95 backdrop-blur-sm border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Detalles del Pedido</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Estudiante</p>
                    <p className="font-medium">{selectedOrder.studentName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Apoderado</p>
                    <p className="font-medium">{selectedOrder.guardianName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Menú</p>
                    <p className="font-medium">{selectedOrder.menuItem}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP'
                      }).format(selectedOrder.totalAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0">
                    Confirmar
                  </Button>
                  <Button variant="outline" className="flex-1 bg-white/50 border-gray-200 hover:bg-white">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}