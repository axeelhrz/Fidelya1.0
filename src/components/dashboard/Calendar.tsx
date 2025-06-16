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
  Calendar as CalendarIcon,
  Package
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
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 border-emerald-200'
      case 'pending':
        return 'bg-amber-50 border-amber-200'
      case 'cancelled':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  if (!selectedShift) {
    return (
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Selecciona un turno
            </h3>
            <p className="text-slate-600 max-w-sm">
              Para comenzar a gestionar tus pedidos, primero debes seleccionar tu turno de trabajo
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-white shadow-sm border border-slate-200">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <CardTitle className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <p className="text-indigo-100 text-sm mt-1">
                Gestiona tus pedidos de almuerzo
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Cargando calendario...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => (
                  <div key={day} className="p-3 text-center font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="hidden sm:block">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 3)}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
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
                        p-3 h-32 border-2 rounded-xl transition-all duration-200 cursor-pointer
                        ${isPast 
                          ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' 
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md hover:scale-105'
                        }
                        ${isToday ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md' : ''}
                        ${order ? `${getStatusColor(order.status)} shadow-sm` : ''}
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${
                          isToday ? 'text-indigo-600' : 
                          isPast ? 'text-slate-400' : 'text-slate-900'
                        }`}>
                          {date.getDate()}
                        </span>
                        {order && getStatusIcon(order.status)}
                      </div>
                      
                      <div className="space-y-1">
                        {dayMenus.length > 0 ? (
                          <div className="space-y-1">
                            {dayMenus.slice(0, 2).map((menu, idx) => (
                              <div key={idx} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg truncate font-medium">
                                {menu.descripcion_opcion}
                              </div>
                            ))}
                            {dayMenus.length > 2 && (
                              <div className="text-xs text-slate-500 text-center font-medium">
                                +{dayMenus.length - 2} opciones más
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-xs text-slate-400">
                            <Package className="w-3 h-3 mr-1" />
                            Sin menú
                          </div>
                        )}
                      </div>

                      {order ? (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-slate-800 truncate">
                            {order.menu_item}
                          </div>
                          {!isPast && (
                            <div className="flex items-center justify-center mt-1">
                              <Edit className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                        </div>
                      ) : !isPast ? (
                        <div className="flex items-center justify-center mt-2">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Plus className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-xs text-slate-600 font-medium">Pedir</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
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