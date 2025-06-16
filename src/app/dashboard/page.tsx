'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/dashboard/Header'
import Calendar from '@/components/dashboard/Calendar'
import ShiftSelector from '@/components/dashboard/ShiftSelector'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { Shift, Menu } from '@/types/database'
import { Clock, TrendingUp, Calendar as CalendarIcon, ChefHat, Users, CheckCircle2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [showShiftSelector, setShowShiftSelector] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => {
    // Mostrar el mes próximo por defecto
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return nextMonth
  })
  const [stats, setStats] = useState({
    totalOrders: 0,
    confirmedOrders: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && selectedShift) {
      fetchStats()
    }
  }, [user, selectedShift, currentDate])

  const fetchStats = async () => {
    if (!user || !selectedShift) return

    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('trabajador_id', profile?.id)
        .eq('shift_id', selectedShift.id)
        .gte('order_date', startOfMonth.toISOString().split('T')[0])
        .lte('order_date', endOfMonth.toISOString().split('T')[0])

      if (error) throw error

      const orders = data || []
      setStats({
        totalOrders: orders.length,
        confirmedOrders: orders.filter((o: { status: string }) => o.status === 'confirmed').length,
        pendingOrders: orders.filter((o: { status: string }) => o.status === 'pending').length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Plataforma de Pedidos de Almuerzo
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Bienvenido, <span className="font-semibold text-indigo-600">{profile?.nombre_completo}</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-600">Sistema Activo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">{profile?.rol || 'Empleado'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shift Selection Card */}
              <div className="text-right">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  {selectedShift ? (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-700 mb-1">{selectedShift.name}</p>
                      <p className="text-xs text-slate-500">
                        {selectedShift.start_time} - {selectedShift.end_time}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-700">Sin turno seleccionado</p>
                      <p className="text-xs text-slate-500">Selecciona tu turno de trabajo</p>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => setShowShiftSelector(true)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedShift ? 'Cambiar Turno' : 'Seleccionar Turno'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 capitalize">
                    Calendario de Almuerzos - {getMonthName(currentDate)}
                  </h2>
                  <p className="text-slate-600">
                    Planifica y gestiona tus pedidos de almuerzo del mes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {selectedShift && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total de Pedidos</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
                    <p className="text-xs text-slate-500 mt-1">Este mes</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Confirmados</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.confirmedOrders}</p>
                    <p className="text-xs text-slate-500 mt-1">Listos para entrega</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pendientes</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.pendingOrders}</p>
                    <p className="text-xs text-slate-500 mt-1">En proceso</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calendar */}
        <Calendar 
          selectedShift={selectedShift} 
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      </main>

      {/* Shift Selector Modal */}
      {showShiftSelector && (
        <ShiftSelector
          selectedShift={selectedShift}
          onShiftSelect={setSelectedShift}
          onClose={() => setShowShiftSelector(false)}
        />
      )}
    </div>
  )
}