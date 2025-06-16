'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import OrderModal from './OrderModal'
import { Order, Shift, Menu } from '@/types/database'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit,
  ChefHat,
  Calendar as CalendarIcon
} from 'lucide-react'

interface CalendarProps {
  selectedShift: Shift | null
  currentDate: Date
  onDateChange: (date: Date) => void
}

export default function Calendar({ selectedShift, currentDate, onDateChange }: CalendarProps) {
  const { user, profile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (user && selectedShift) {
      fetchOrders()
      fetchMenus()
    }
  }, [user, selectedShift, currentDate])

  const fetchOrders = async () => {
    if (!user || !selectedShift || !profile) return

    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('trabajador_id', profile.id)
        .eq('shift_id', selectedShift.id)
        .gte('order_date', startOfMonth.toISOString().split('T')[0])
        .lte('order_date', endOfMonth.toISOString().split('T')[0])

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchMenus = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('activa', true)
        .gte('fecha', startOfMonth.toISOString().split('T')[0])
        .lte('fecha', endOfMonth.toISOString().split('T')[0])
        .order('fecha', { ascending: true })
        .order('categoria', { ascending: true })

      if (error) throw error
      setMenus(data || [])
    } catch (error) {
      console.error('Error fetching menus:', error)
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
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getOrderForDate = (date: Date): Order | null => {
    const dateStr = date.toISOString().split('T')[0]
    return orders.find(order => order.order_date === dateStr) || null
  }

  const getMenusForDate = (date: Date): Menu[] => {
    const dateStr = date.toISOString().split('T')[0]
    return menus.filter(menu => menu.fecha === dateStr)
  }

  const handleDayClick = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) return // No permitir seleccionar días pasados

    const existingOrder = getOrderForDate(date)
    setSelectedDate(date)
    setSelectedOrder(existingOrder)
    setShowOrderModal(true)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    onDateChange(newDate)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

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
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <CardTitle className="text-2xl font-bold text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Week day headers */}
              {weekDays.map(day => (
                <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getDaysInMonth().map((date, index) => {
                if (!date) {
                  return <div key={index} className="p-3 h-32" />
                }
                
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const isToday = date.getTime() === today.getTime()
                const isPast = date < today
                const order = getOrderForDate(date)
                const dayMenus = getMenusForDate(date)
                
                return (
                  <div
                    key={index}
                    onClick={() => !isPast && handleDayClick(date)}
                    className={`
                      p-3 h-32 border-2 rounded-lg transition-all duration-200 cursor-pointer
                      ${isPast 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50' 
                        : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                      }
                      ${isToday ? 'ring-2 ring-orange-500 border-orange-500' : ''}
                      ${order ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-bold ${
                        isToday ? 'text-orange-600' : 
                        isPast ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </span>
                      {order && getStatusIcon(order.status)}
                    </div>
                    
                    <div className="space-y-1">
                      {dayMenus.length > 0 ? (
                        <div className="space-y-1">
                          {dayMenus.slice(0, 2).map((menu, idx) => (
                            <div key={idx} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full truncate">
                              {menu.descripcion_opcion}
                            </div>
                          ))}
                          {dayMenus.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayMenus.length - 2} más
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 text-center">
                          Sin menú
                        </div>
                      )}
                    </div>

                    {order ? (
                      <div className="mt-2">
                        <div className="text-xs font-medium text-green-800 truncate">
                          {order.menu_item}
                        </div>
                        {!isPast && (
                          <div className="flex items-center justify-center mt-1">
                            <Edit className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ) : !isPast ? (
                      <div className="flex items-center justify-center mt-2">
                        <div className="flex flex-col items-center space-y-1">
                          <Plus className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Pedir</span>
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
      {showOrderModal && selectedDate && (
        <OrderModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          selectedDate={selectedDate}
          selectedShift={selectedShift}
          existingOrder={selectedOrder}
          onOrderSaved={() => {
            fetchOrders()
            setShowOrderModal(false)
          }}
          availableMenus={getMenusForDate(selectedDate)}
        />
      )}
    </>
  )
}