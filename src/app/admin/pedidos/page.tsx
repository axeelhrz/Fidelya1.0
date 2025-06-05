"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminGuard } from "@/components/admin/AdminGuard";
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  // Datos de ejemplo
  const pedidos = [
    { id: 1, estudiante: "Pedro Pérez", menu: "Almuerzo Lunes", fecha: "2024-01-15", estado: "confirmado", monto: 3500 },
    { id: 2, estudiante: "Ana González", menu: "Colación Martes", fecha: "2024-01-16", estado: "pendiente", monto: 2000 },
    { id: 3, estudiante: "Luis López", menu: "Almuerzo Miércoles", fecha: "2024-01-17", estado: "pagado", monto: 3500 },
    { id: 4, estudiante: "Carmen Martínez", menu: "Almuerzo Jueves", fecha: "2024-01-18", estado: "cancelado", monto: 3500 },
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmado': return 'default'
      case 'pendiente': return 'secondary'
      case 'pagado': return 'default'
      case 'cancelado': return 'destructive'
      default: return 'secondary'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'confirmado': return <CheckCircle className="w-4 h-4" />
      case 'pendiente': return <Clock className="w-4 h-4" />
      case 'pagado': return <CheckCircle className="w-4 h-4" />
      case 'cancelado': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <AdminGuard requiredPermission="pedidos.read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
            <p className="text-gray-600">Administra y procesa todos los pedidos</p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Total Pedidos</span>
              </div>
              <p className="text-2xl font-bold mt-2">1,234</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Pendientes</span>
              </div>
              <p className="text-2xl font-bold mt-2">23</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Confirmados</span>
              </div>
              <p className="text-2xl font-bold mt-2">1,156</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Cancelados</span>
              </div>
              <p className="text-2xl font-bold mt-2">55</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar pedidos..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                Filtrar por fecha
              </Button>
              <Button variant="outline">
                Filtrar por estado
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>
              Todos los pedidos realizados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{pedido.estudiante}</h3>
                      <p className="text-sm text-gray-600">{pedido.menu}</p>
                      <p className="text-xs text-gray-500">{pedido.fecha}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">${pedido.monto.toLocaleString()}</span>
                    <Badge variant={getEstadoColor(pedido.estado)} className="flex items-center space-x-1">
                      {getEstadoIcon(pedido.estado)}
                      <span>{pedido.estado}</span>
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}