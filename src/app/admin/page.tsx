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
  Moon,
  Building2,
  FileText,
  TrendingUp,
  User,
  ChefHat
} from 'lucide-react'

interface AdminStats {
  totalPedidos: number
  pedidosDia: number
  pedidosNoche: number
  empresasActivas: number
  trabajadoresActivos: number
  pedidosHoy: number
  pedidosEsteMes: number
}

interface PedidoCompleto {
  id: number
  nombre_trabajador: string
  rut_trabajador: string | null
  turno_elegido: string
  fecha_entrega: string
  dia_semana: string
  numero_dia: number
  codigo_opcion: string
  descripcion_opcion: string
  categoria_opcion: string
  notas: string | null
  empresa: string
  created_at: string
  trabajador_info?: {
    id: number
    nombre_completo: string
    rut: string
    empresa: string
    rol: string | null
    turno_habitual: string | null
    activo: boolean
  }
}

interface PedidosPorEmpresa {
  empresa: string
  total: number
  dia: number
  noche: number
  trabajadores: string[]
}

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalPedidos: 0,
    pedidosDia: 0,
    pedidosNoche: 0,
    empresasActivas: 0,
    trabajadoresActivos: 0,
    pedidosHoy: 0,
    pedidosEsteMes: 0
  })
  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([])
  const [pedidosPorEmpresa, setPedidosPorEmpresa] = useState<PedidosPorEmpresa[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [loadingStats, setLoadingStats] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'companies'>('overview')

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Check if user is admin
  useEffect(() => {
    if (!loading && user && profile) {
      const isAdmin = profile.rol?.toLowerCase() === 'admin' || profile.rol?.toLowerCase() === 'administrador'
      if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, profile, loading, router])

  useEffect(() => {
    if (user && profile) {
      fetchAllData()
    }
  }, [user, profile, selectedDate])

  const fetchAllData = async () => {
    setLoadingStats(true)
    try {
      await Promise.all([
        fetchPedidos(),
        fetchStats(),
        fetchTrabajadoresActivos()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchPedidos = async () => {
    try {
      // Fetch pedidos for selected date
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('fecha_entrega', selectedDate)
        .order('created_at', { ascending: false })

      if (pedidosError) throw pedidosError

      // Fetch trabajadores info for cross-reference
      const { data: trabajadoresData, error: trabajadoresError } = await supabase
        .from('trabajadores')
        .select('*')
        .eq('activo', true)

      if (trabajadoresError) throw trabajadoresError

      // Combine pedidos with trabajador info
      const pedidosCompletos: PedidoCompleto[] = pedidosData?.map(pedido => {
        const trabajadorInfo = trabajadoresData?.find(t => 
          t.nombre_completo === pedido.nombre_trabajador ||
          (pedido.rut_trabajador && t.rut === pedido.rut_trabajador)
        )
        
        return {
          ...pedido,
          trabajador_info: trabajadorInfo
        }
      }) || []

      setPedidos(pedidosCompletos)
      calculatePedidosPorEmpresa(pedidosCompletos)
    } catch (error) {
      console.error('Error fetching pedidos:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch orders for selected date
      const { data: selectedDateData, error: selectedDateError } = await supabase
        .from('pedidos')
        .select('turno_elegido, empresa')
        .eq('fecha_entrega', selectedDate)

      if (selectedDateError) throw selectedDateError

      // Fetch orders for today
      const today = new Date().toISOString().split('T')[0]
      const { data: todayData, error: todayError } = await supabase
        .from('pedidos')
        .select('id')
        .eq('fecha_entrega', today)

      if (todayError) throw todayError

      // Fetch orders for this month
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
      
      const { data: monthData, error: monthError } = await supabase
        .from('pedidos')
        .select('id')
        .gte('fecha_entrega', startOfMonth)
        .lte('fecha_entrega', endOfMonth)

      if (monthError) throw monthError

      const total = selectedDateData?.length || 0
      const diaCount = selectedDateData?.filter(p => p.turno_elegido === 'dia').length || 0
      const nocheCount = selectedDateData?.filter(p => p.turno_elegido === 'noche').length || 0
      
      // Get unique companies
      const empresasUnicas = new Set(selectedDateData?.map(p => p.empresa).filter(Boolean))

      setStats(prev => ({
        ...prev,
        totalPedidos: total,
        pedidosDia: diaCount,
        pedidosNoche: nocheCount,
        empresasActivas: empresasUnicas.size,
        pedidosHoy: todayData?.length || 0,
        pedidosEsteMes: monthData?.length || 0
      }))
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchTrabajadoresActivos = async () => {
    try {
      const { data, error } = await supabase
        .from('trabajadores')
        .select('id')
        .eq('activo', true)

      if (error) throw error

      setStats(prev => ({
        ...prev,
        trabajadoresActivos: data?.length || 0
      }))
    } catch (error) {
      console.error('Error fetching trabajadores:', error)
    }
  }

  const calculatePedidosPorEmpresa = (pedidosData: PedidoCompleto[]) => {
    const empresasMap = new Map<string, { total: number, dia: number, noche: number, trabajadores: Set<string> }>()
    
    pedidosData.forEach(pedido => {
      if (pedido.empresa) {
        const current = empresasMap.get(pedido.empresa) || { 
          total: 0, 
          dia: 0, 
          noche: 0, 
          trabajadores: new Set<string>() 
        }
        
        current.total += 1
        current.trabajadores.add(pedido.nombre_trabajador)
        
        if (pedido.turno_elegido === 'dia') {
          current.dia += 1
        } else if (pedido.turno_elegido === 'noche') {
          current.noche += 1
        }
        
        empresasMap.set(pedido.empresa, current)
      }
    })

    const empresasArray = Array.from(empresasMap.entries()).map(([empresa, stats]) => ({
      empresa,
      total: stats.total,
      dia: stats.dia,
      noche: stats.noche,
      trabajadores: Array.from(stats.trabajadores)
    })).sort((a, b) => b.total - a.total)

    setPedidosPorEmpresa(empresasArray)
  }

  const getFilteredPedidos = () => {
    let filtered = pedidos

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pedido =>
        pedido.nombre_trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.rut_trabajador && pedido.rut_trabajador.includes(searchTerm)) ||
        pedido.descripcion_opcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.codigo_opcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by shift
    if (shiftFilter !== 'all') {
      const turnoFilter = shiftFilter.toLowerCase() === 'día' || shiftFilter.toLowerCase() === 'dia' ? 'dia' : 'noche'
      filtered = filtered.filter(pedido => pedido.turno_elegido === turnoFilter)
    }

    return filtered
  }

  const exportData = async () => {
    try {
      const dataToExport = getFilteredPedidos()
      
      // Convert to CSV
      const headers = [
        'ID', 'Nombre Trabajador', 'RUT Trabajador', 'Empresa', 'Turno', 
        'Fecha Entrega', 'Día Semana', 'Código Opción', 
        'Descripción Opción', 'Categoría', 'Notas', 'Fecha Creación',
        'Rol Trabajador', 'Turno Habitual', 'Estado Trabajador'
      ]
      
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(pedido => [
          pedido.id,
          `"${pedido.nombre_trabajador}"`,
          pedido.rut_trabajador || '',
          `"${pedido.empresa}"`,
          pedido.turno_elegido === 'dia' ? 'Día' : 'Noche',
          pedido.fecha_entrega,
          `"${pedido.dia_semana}"`,
          pedido.codigo_opcion,
          `"${pedido.descripcion_opcion}"`,
          `"${pedido.categoria_opcion}"`,
          `"${pedido.notas || ''}"`,
          new Date(pedido.created_at).toLocaleString('es-ES'),
          `"${pedido.trabajador_info?.rol || 'N/A'}"`,
          `"${pedido.trabajador_info?.turno_habitual || 'N/A'}"`,
          pedido.trabajador_info?.activo ? 'Activo' : 'Inactivo'
        ].join(','))
      ].join('\n')

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `pedidos_completo_${selectedDate}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const isAdmin = profile?.rol?.toLowerCase() === 'admin' || profile?.rol?.toLowerCase() === 'administrador'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || !isAdmin) {
    return null
  }

  const filteredPedidos = getFilteredPedidos()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/role-selection')}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span>Panel de Administración</span>
              </h1>
              <p className="text-slate-600 mt-1">
                Gestión de pedidos de almuerzo - {new Date(selectedDate).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={exportData}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button
              onClick={fetchAllData}
              disabled={loadingStats}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loadingStats ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 inline mr-2" />
            Lista de Pedidos ({filteredPedidos.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'companies'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 inline mr-2" />
            Por Empresa ({pedidosPorEmpresa.length})
          </button>
        </div>

        {/* Date Selector */}
        <Card className="bg-white shadow-sm border border-slate-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <label className="text-sm font-medium text-slate-700">
                    Fecha de consulta:
                  </label>
                </div>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
              <div className="text-sm text-slate-600">
                Última actualización: {new Date().toLocaleTimeString('es-ES')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6 mb-8">
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Fecha</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalPedidos}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Turno Día</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.pedidosDia}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Sun className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Turno Noche</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.pedidosNoche}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Moon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Empresas</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.empresasActivas}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Trabajadores</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.trabajadoresActivos}</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-cyan-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Hoy</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.pedidosHoy}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Este Mes</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.pedidosEsteMes}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>Distribución por Turno</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                        <span className="text-sm font-medium">Turno Día</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{stats.pedidosDia}</span>
                        <span className="text-sm text-slate-500 ml-2">
                          ({stats.totalPedidos > 0 ? Math.round((stats.pedidosDia / stats.totalPedidos) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Turno Noche</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{stats.pedidosNoche}</span>
                        <span className="text-sm text-slate-500 ml-2">
                          ({stats.totalPedidos > 0 ? Math.round((stats.pedidosNoche / stats.totalPedidos) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span>Resumen Rápido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Pedidos totales del día:</span>
                      <span className="font-semibold">{stats.totalPedidos}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Empresas participantes:</span>
                      <span className="font-semibold">{stats.empresasActivas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Trabajadores activos:</span>
                      <span className="font-semibold">{stats.trabajadoresActivos}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Promedio por empresa:</span>
                      <span className="font-semibold">
                        {stats.empresasActivas > 0 ? Math.round(stats.totalPedidos / stats.empresasActivas) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Turno más activo:</span>
                      <span className="font-semibold">
                        {stats.pedidosDia > stats.pedidosNoche ? 'Día' : stats.pedidosNoche > stats.pedidosDia ? 'Noche' : 'Empate'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {/* Filters for Orders */}
            <Card className="bg-white shadow-sm border border-slate-200 mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Buscar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Nombre, RUT, empresa, plato, código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Turno
                    </label>
                    <select
                      value={shiftFilter}
                      onChange={(e) => setShiftFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">Todos los turnos</option>
                      <option value="dia">Día</option>
                      <option value="noche">Noche</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Lista de Pedidos</CardTitle>
                  <div className="text-sm text-slate-600">
                    Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredPedidos.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay pedidos</h3>
                    <p className="text-slate-600">No se encontraron pedidos para los filtros seleccionados</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPedidos.map((pedido) => (
                      <div
                        key={pedido.id}
                        className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center text-white font-semibold">
                              {pedido.nombre_trabajador.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-slate-900 text-lg">{pedido.nombre_trabajador}</h4>
                                {pedido.trabajador_info?.rol && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    pedido.trabajador_info.rol.toLowerCase() === 'admin' || pedido.trabajador_info.rol.toLowerCase() === 'administrador'
                                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                      : 'bg-green-100 text-green-700 border border-green-200'
                                  }`}>
                                    {pedido.trabajador_info.rol}
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-slate-600">
                                    <span className="font-medium">RUT:</span> {pedido.rut_trabajador || 'No especificado'}
                                  </p>
                                  <p className="text-slate-600">
                                    <span className="font-medium">Empresa:</span> {pedido.empresa}
                                  </p>
                                  <p className="text-slate-600">
                                    <span className="font-medium">Turno habitual:</span> {pedido.trabajador_info?.turno_habitual || 'No especificado'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-600">
                                    <span className="font-medium">Plato:</span> {pedido.descripcion_opcion}
                                  </p>
                                  <p className="text-slate-600">
                                    <span className="font-medium">Código:</span> {pedido.codigo_opcion}
                                  </p>
                                  <p className="text-slate-600">
                                    <span className="font-medium">Categoría:</span> {pedido.categoria_opcion}
                                  </p>
                                </div>
                              </div>
                              
                              {pedido.notas && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-700">
                                    <span className="font-medium">Notas:</span> {pedido.notas}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-2">
                              {pedido.turno_elegido === 'dia' ? (
                                <Sun className="w-4 h-4 text-amber-600" />
                              ) : (
                                <Moon className="w-4 h-4 text-purple-600" />
                              )}
                              <span className="text-sm font-medium">
                                {pedido.turno_elegido === 'dia' ? 'Turno Día' : 'Turno Noche'}
                              </span>
                            </div>
                            
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Confirmado</span>
                            </span>
                            
                            <div className="text-xs text-slate-500 text-right">
                              <p>{pedido.dia_semana} {pedido.numero_dia}</p>
                              <p>{new Date(pedido.created_at).toLocaleString('es-ES')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'companies' && (
          <Card className="bg-white shadow-sm border border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Pedidos por Empresa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pedidosPorEmpresa.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay datos</h3>
                  <p className="text-slate-600">No se encontraron pedidos para la fecha seleccionada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidosPorEmpresa.map((empresa, index) => (
                    <div
                      key={empresa.empresa}
                      className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-xl">{empresa.empresa}</h4>
                            <p className="text-sm text-slate-600">
                              {empresa.trabajadores.length} trabajadores han pedido • {new Date(selectedDate).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="flex items-center space-x-2 mb-1">
                              <Sun className="w-4 h-4 text-amber-600" />
                              <span className="text-sm font-medium text-slate-600">Día</span>
                            </div>
                            <span className="text-2xl font-bold text-amber-600">{empresa.dia}</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center space-x-2 mb-1">
                              <Moon className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-slate-600">Noche</span>
                            </div>
                            <span className="text-2xl font-bold text-purple-600">{empresa.noche}</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center space-x-2 mb-1">
                              <ClipboardList className="w-4 h-4 text-indigo-600" />
                              <span className="text-sm font-medium text-slate-600">Total</span>
                            </div>
                            <span className="text-3xl font-bold text-indigo-600">{empresa.total}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Distribución por turno</span>
                          <span>{empresa.total} pedidos</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="flex h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-500" 
                              style={{ width: `${empresa.total > 0 ? (empresa.dia / empresa.total) * 100 : 0}%` }}
                            ></div>
                            <div 
                              className="bg-purple-500" 
                              style={{ width: `${empresa.total > 0 ? (empresa.noche / empresa.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Trabajadores list */}
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Trabajadores que pidieron:</p>
                        <div className="flex flex-wrap gap-2">
                          {empresa.trabajadores.map((trabajador, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                            >
                              {trabajador}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}