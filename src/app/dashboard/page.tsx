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
import { Shift } from '@/types/database'
import { Clock, TrendingUp, Calendar as CalendarIcon } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [showShiftSelector, setShowShiftSelector] = useState(false)
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
  }, [user, selectedShift])

  const fetchStats = async () => {
    if (!user || !selectedShift) return

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('user_id', user.id)
        .eq('shift_id', selectedShift.id)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-gray-600">
            Gestiona tus pedidos de almuerzo de manera fácil y eficiente
          </p>
        </div>

        {/* Shift Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Turno Seleccionado</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {selectedShift ? (
                  <div>
                    <p className="font-semibold text-lg text-gray-900">
                      {selectedShift.name}
                    </p>
                    <p className="text-gray-600">
                      {selectedShift.start_time} - {selectedShift.end_time}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-lg text-gray-900">
                      No hay turno seleccionado
                    </p>
                    <p className="text-gray-600">
                      Selecciona un turno para comenzar a hacer pedidos
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setShowShiftSelector(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {selectedShift ? 'Cambiar Turno' : 'Seleccionar Turno'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {selectedShift && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
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

            <Card>
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

            <Card>
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
        <Calendar selectedShift={selectedShift} />
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
