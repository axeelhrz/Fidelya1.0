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
import { Clock, TrendingUp, Calendar as CalendarIcon, ChefHat } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🍽️ Plataforma de Pedidos de Almuerzo
              </h1>
              <p className="text-gray-600">
                Bienvenido, <span className="font-semibold text-orange-600">{profile?.nombre_completo}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Turno Noche</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  Selecciona tus Almuerzos - {getMonthName(currentDate)}
                </h2>
                <p className="text-gray-600">
                  Elige tus almuerzos para cada día del mes próximo
                </p>
              </div>
            </div>
            
            {/* Shift Selection */}
            <div className="flex items-center space-x-4">
              {selectedShift ? (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{selectedShift.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedShift.start_time} - {selectedShift.end_time}
                  </p>
                </div>
              ) : null}
              
              <Button
                onClick={() => setShowShiftSelector(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Clock className="w-4 h-4 mr-2" />
                {selectedShift ? 'Cambiar Turno' : 'Seleccionar Turno'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {selectedShift && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmados</p>
                    <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
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