'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Order, Shift } from '@/types/database'
import OrderModal from './OrderModal'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit
} from 'lucide-react'

interface CalendarProps {
  selectedShift: Shift | null
}

export default function Calendar({ selectedShift }: CalendarProps) {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (user && selectedShift) {
      fetchOrders()
    }
  }, [user, selectedShift, currentDate])

  const fetchOrders = async () => {
    if (!user || !selectedShift) return

    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('shift_id', selectedShift.id)
        .gte('order_date', startOfMonth.toISOString().split('T')[0])
        .lte('order_date', endOfMonth.toISOString().split('T')[0])

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getOrderForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0]
    return orders.find(order => order.order_date === dateStr)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Don't allow orders for past dates
    if (clickedDate < today) return

    const existingOrder = getOrderForDate(day)
    setSelectedDate(clickedDate)
    setSelectedOrder(existingOrder || null)
    setShowOrderModal(true)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  if (!selectedShift) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selecciona un turno
            </h3>
            <p className="text-gray-600">
              Primero debes seleccionar un turno para ver tus pedidos
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Selecciona tus Almuerzos - {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Turno seleccionado: <span className="font-medium">{selectedShift.name}</span>
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getDaysInMonth().map((day, index) => {
                if (day === null) {
                  return <div key={index} className="p-2" />
                }

                const order = getOrderForDate(day)
                const isToday = new Date().toDateString() === 
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
                const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < 
                  new Date(new Date().setHours(0, 0, 0, 0))

                return (
                  <div
                    key={day}
                    className={`relative p-2 min-h-[100px] border rounded-lg transition-all ${
                      isPast 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:shadow-md hover:border-gray-300'
                    } ${
                      isToday ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                    onClick={() => !isPast && handleDayClick(day)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        isToday ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {day}
                      </span>
                      {order && getStatusIcon(order.status)}
                    </div>
                    
                    {order ? (
                      <div className="text-xs space-y-1">
                        <p className="font-medium text-gray-900 truncate">
                          {order.menu_item}
                        </p>
                        <p className={`capitalize ${
                          order.status === 'confirmed' ? 'text-green-600' :
                          order.status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {order.status === 'confirmed' ? 'Confirmado' :
                           order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                        </p>
                        {!isPast && (
                          <div className="flex items-center justify-center mt-2">
                            <Edit className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ) : !isPast ? (
                      <div className="flex items-center justify-center h-12">
                        <div className="flex flex-col items-center space-y-1">
                          <Plus className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Agregar</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Modal */}
      {showOrderModal && selectedDate && selectedShift && (
        <OrderModal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false)
            setSelectedDate(null)
            setSelectedOrder(null)
          }}
          selectedDate={selectedDate}
          selectedShift={selectedShift}
          existingOrder={selectedOrder}
          onOrderSaved={fetchOrders}
        />
      )}
    </>
  )
}