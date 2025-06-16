'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Order, Trabajador } from '@/types/database'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User,
  Package,
  Calendar,
  Filter,
  Search
} from 'lucide-react'

interface OrderWithWorker extends Order {
  trabajador: Trabajador
  shift: {
    name: string
    start_time: string
    end_time: string
  }
}

interface OrdersListProps {
  selectedDate: string
  searchTerm: string
  shiftFilter?: string
}

export default function OrdersList({ selectedDate, searchTerm, shiftFilter }: OrdersListProps) {
  const [orders, setOrders] = useState<OrderWithWorker[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [selectedDate, searchTerm, shiftFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          trabajador:trabajadores!inner(nombre_completo, rut, rol),
          shift:shifts!inner(name, start_time, end_time)
        `)
        .eq('order_date', selectedDate)
        .order('created_at', { ascending: false })

      if (shiftFilter && shiftFilter !== 'all') {
        query = query.ilike('shifts.name', `%${shiftFilter}%`)
      }

      const { data, error } = await query

      if (error) throw error

      let filteredOrders = data || []

      // Filtrar por término de búsqueda
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          order.trabajador.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.trabajador.rut.includes(searchTerm) ||
          order.menu_item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Filtrar por estado
      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter)
      }

      setOrders(filteredOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error

      // Actualizar el estado local
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any }
          : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />
      case 'delivered':
        return <Package className="w-4 h-4 text-blue-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'delivered':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'pending':
        return 'Pendiente'
      case 'delivered':
        return 'Entregado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Lista de Pedidos</CardTitle>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmados</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay pedidos</h3>
            <p className="text-slate-600">No se encontraron pedidos para los filtros seleccionados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center text-white font-semibold">
                      {order.trabajador.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{order.trabajador.nombre_completo}</h4>
                      <p className="text-sm text-slate-600">{order.trabajador.rut} • {order.shift.name}</p>
                      <p className="text-sm font-medium text-slate-800 mt-1">{order.menu_item}</p>
                      {order.notes && (
                        <p className="text-xs text-slate-500 mt-1">Nota: {order.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>
                    
                    {order.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                    
                    {order.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Marcar Entregado
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
