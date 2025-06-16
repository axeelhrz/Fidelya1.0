'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { 
  Shield, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Crown,
  Filter,
  Search,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Sun,
  Moon
} from 'lucide-react'

interface AdminStats {
  totalPedidos: number
  pedidosConfirmados: number
  pedidosEntregados: number
  pedidosCancelados: number
  pedidosDia: number
  pedidosNoche: number
}

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalPedidos: 0,
    pedidosConfirmados: 0,
    pedidosEntregados: 0,
    pedidosCancelados: 0,
    pedidosDia: 0,
    pedidosNoche: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Verificar si el usuario tiene permisos de administrador
    if (!loading && user && profile) {
      const isAdmin = profile.rol?.toLowerCase() === 'admin' || profile.rol?.toLowerCase() === 'administrador'
      if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, profile, loading, router])

  useEffect(() => {
    if (user && profile) {
      fetchStats()
    }
  }, [user, profile, selectedDate])

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      
      // Obtener estadísticas generales
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          shifts!inner(name, start_time)
        `)
        .eq('order_date', selectedDate)

      if (error) throw error

      const totalPedidos = orders?.length || 0
      const pedidosConfirmados = orders?.filter(o => o.status === 'confirmed').length || 0
      const pedidosEntregados = orders?.filter(o => o.status === 'delivered').length || 0
      const pedidosCancelados = orders?.filter(o => o.status === 'cancelled').length || 0
      
      // Contar pedidos por turno
      const pedidosDia = orders?.filter(o => 
        o.shifts.name.toLowerCase().includes('día') || 
        o.shifts.name.toLowerCase().includes('dia')
      ).length || 0
      
      const pedidosNoche = orders?.filter(o => 
        o.shifts.name.toLowerCase().includes('noche')
      ).length || 0

      setStats({
        totalPedidos,
        pedidosConfirmados,
        pedidosEntregados,
        pedidosCancelados,
        pedidosDia,
        pedidosNoche
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleBackToSelection = () => {
    router.push('/role-selection')
  }

  const handleRefresh = () => {
    fetchStats()
  }

  const handleExport = () => {
    // TODO: Implementar exportación
    console.log('Exportar datos')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const isAdmin = profile.rol?.toLowerCase() === 'admin' || profile.rol?.toLowerCase() === 'administrador'

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToSelection}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
                  <p className="text-slate-600">Gestión y análisis de pedidos de almuerzo</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-2xl px-4 py-2 border border-slate-200 shadow-sm">
              <Crown className="w-5 h-5 text-indigo-500" />
              <span className="text-slate-900 font-semibold">{profile.nombre_completo}</span>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6 bg-white shadow-sm border border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg">Filtros</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Fecha</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Buscar por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-end space-x-2">
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar
                  </Button>
                  
                  <Button
                    onClick={handleExport}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pedidos Totales</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {loadingStats ? '-' : stats.totalPedidos}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Total del día seleccionado</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pedidos Confirmados</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {loadingStats ? '-' : stats.pedidosConfirmados}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Listos para preparar</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pedidos Entregados</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {loadingStats ? '-' : stats.pedidosEntregados}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Completados exitosamente</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Pedidos Cancelados</p>
                    <p className="text-3xl font-bold text-red-600">
                      {loadingStats ? '-' : stats.pedidosCancelados}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Cancelados por usuarios</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secciones por Turno */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Turno Día */}
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Pedidos - Turno Día</CardTitle>
                    <p className="text-amber-100 text-sm">6:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    {loadingStats ? '-' : stats.pedidosDia}
                  </div>
                  <p className="text-slate-600 mb-4">Pedidos del turno diurno</p>
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => {/* TODO: Ver detalles */}}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Turno Noche */}
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Pedidos - Turno Noche</CardTitle>
                    <p className="text-indigo-100 text-sm">10:00 PM - 6:00 AM</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {loadingStats ? '-' : stats.pedidosNoche}
                  </div>
                  <p className="text-slate-600 mb-4">Pedidos del turno nocturno</p>
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => {/* TODO: Ver detalles */}}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}