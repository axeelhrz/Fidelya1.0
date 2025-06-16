'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { Pedido, Trabajador } from '@/types/database'
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
  ChefHat,
  Utensils,
  Eye
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

interface PedidoCompleto extends Pedido {
  trabajador_info?: Trabajador
}

interface PedidosPorEmpresa {
  empresa: string
  total: number
  dia: number
  noche: number
  trabajadores: string[]
}

interface PlatoPorTurno {
  descripcion_opcion: string
  codigo_opcion: string
  categoria_opcion: string
  cantidad: number
  trabajadores: string[]
}

interface VistaCocina {
  dia: PlatoPorTurno[]
  noche: PlatoPorTurno[]
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
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [pedidosPorEmpresa, setPedidosPorEmpresa] = useState<PedidosPorEmpresa[]>([])
  const [vistaCocina, setVistaCocina] = useState<VistaCocina>({ dia: [], noche: [] })
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [loadingStats, setLoadingStats] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'companies' | 'kitchen'>('overview')
  const [exportType, setExportType] = useState<'general' | 'kitchen' | 'workers' | 'shifts'>('general')

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
        fetchTrabajadores(),
        fetchPedidos(),
        fetchStats()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchTrabajadores = async () => {
    try {
      const { data, error } = await supabase
        .from('trabajadores')
        .select('*')
        .eq('activo', true)

      if (error) throw error
      setTrabajadores(data || [])
    } catch (error) {
      console.error('Error fetching trabajadores:', error)
    }
  }

  const fetchPedidos = async () => {
    try {
      console.log('Fetching pedidos for date:', selectedDate)
      
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('pedidos')
        .select(`
          id,
          nombre_trabajador,
          rut_trabajador,
          turno_elegido,
          fecha_entrega,
          dia_semana,
          numero_dia,
          codigo_opcion,
          descripcion_opcion,
          categoria_opcion,
          notas,
          created_at,
          empresa
        `)
        .eq('fecha_entrega', selectedDate)
        .order('created_at', { ascending: false })

      if (pedidosError) {
        console.error('Error fetching pedidos:', pedidosError)
        throw pedidosError
      }

      console.log('Pedidos fetched:', pedidosData?.length || 0)

      const pedidosCompletos: PedidoCompleto[] = pedidosData?.map(pedido => {
        const trabajadorInfo = trabajadores.find(t => 
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
      calculateVistaCocina(pedidosCompletos)
    } catch (error) {
      console.error('Error fetching pedidos:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const { data: selectedDateData, error: selectedDateError } = await supabase
        .from('pedidos')
        .select('turno_elegido, empresa')
        .eq('fecha_entrega', selectedDate)

      if (selectedDateError) throw selectedDateError

      const today = new Date().toISOString().split('T')[0]
      const { data: todayData, error: todayError } = await supabase
        .from('pedidos')
        .select('id')
        .eq('fecha_entrega', today)

      if (todayError) throw todayError

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
      
      const empresasUnicas = new Set(selectedDateData?.map(p => p.empresa).filter(Boolean))

      setStats(prev => ({
        ...prev,
        totalPedidos: total,
        pedidosDia: diaCount,
        pedidosNoche: nocheCount,
        empresasActivas: empresasUnicas.size,
        trabajadoresActivos: trabajadores.length,
        pedidosHoy: todayData?.length || 0,
        pedidosEsteMes: monthData?.length || 0
      }))
    } catch (error) {
      console.error('Error fetching stats:', error)
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

  const calculateVistaCocina = (pedidosData: PedidoCompleto[]) => {
    const platosMap = new Map<string, Map<string, { cantidad: number, trabajadores: Set<string>, categoria: string, codigo: string }>>()
    
    pedidosData.forEach(pedido => {
      const turno = pedido.turno_elegido
      const plato = pedido.descripcion_opcion
      
      if (!platosMap.has(turno)) {
        platosMap.set(turno, new Map())
      }
      
      const turnoMap = platosMap.get(turno)!
      const current = turnoMap.get(plato) || { 
        cantidad: 0, 
        trabajadores: new Set<string>(),
        categoria: pedido.categoria_opcion,
        codigo: pedido.codigo_opcion
      }
      
      current.cantidad += 1
      current.trabajadores.add(pedido.nombre_trabajador)
      
      turnoMap.set(plato, current)
    })

    const dia: PlatoPorTurno[] = []
    const noche: PlatoPorTurno[] = []

    if (platosMap.has('dia')) {
      platosMap.get('dia')!.forEach((stats, plato) => {
        dia.push({
          descripcion_opcion: plato,
          codigo_opcion: stats.codigo,
          categoria_opcion: stats.categoria,
          cantidad: stats.cantidad,
          trabajadores: Array.from(stats.trabajadores)
        })
      })
    }

    if (platosMap.has('noche')) {
      platosMap.get('noche')!.forEach((stats, plato) => {
        noche.push({
          descripcion_opcion: plato,
          codigo_opcion: stats.codigo,
          categoria_opcion: stats.categoria,
          cantidad: stats.cantidad,
          trabajadores: Array.from(stats.trabajadores)
        })
      })
    }

    dia.sort((a, b) => a.categoria_opcion.localeCompare(b.categoria_opcion) || b.cantidad - a.cantidad)
    noche.sort((a, b) => a.categoria_opcion.localeCompare(b.categoria_opcion) || b.cantidad - a.cantidad)

    setVistaCocina({ dia, noche })
  }

  const getFilteredPedidos = () => {
    let filtered = pedidos

    if (searchTerm) {
      filtered = filtered.filter(pedido =>
        pedido.nombre_trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.rut_trabajador && pedido.rut_trabajador.includes(searchTerm)) ||
        pedido.descripcion_opcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.codigo_opcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.categoria_opcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (shiftFilter !== 'all') {
      const turnoFilter = shiftFilter.toLowerCase() === 'día' || shiftFilter.toLowerCase() === 'dia' ? 'dia' : 'noche'
      filtered = filtered.filter(pedido => pedido.turno_elegido === turnoFilter)
    }

    return filtered
  }

  const exportData = async () => {
    try {
      let csvContent = ''
      let filename = ''

      switch (exportType) {
        case 'kitchen':
          csvContent = generateKitchenCSV()
          filename = `vista_cocina_${selectedDate}.csv`
          break
        case 'workers':
          csvContent = generateWorkersCSV()
          filename = `por_trabajador_${selectedDate}.csv`
          break
        case 'shifts':
          csvContent = generateShiftsCSV()
          filename = `por_turno_${selectedDate}.csv`
          break
        default:
          csvContent = generateGeneralCSV()
          filename = `pedidos_general_${selectedDate}.csv`
      }

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const generateKitchenCSV = () => {
    const dateFormatted = new Date(selectedDate).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    let content = [
      // Header principal
      'VISTA DIARIA PARA COCINA',
      `Fecha: ${dateFormatted}`,
      '', // Línea vacía
      '', // Línea vacía
      
      // Sección Turno Día
      'PEDIDOS - TURNO DÍA',
      '', // Línea vacía
    ]

    if (vistaCocina.dia.length > 0) {
      // Headers para turno día
      content.push('Plato,Código,Categoría,Cantidad,Trabajadores')
      
      // Datos del turno día
      vistaCocina.dia.forEach(plato => {
        content.push([
          `"${plato.descripcion_opcion}"`,
          plato.codigo_opcion,
          plato.categoria_opcion,
          plato.cantidad.toString(),
          `"${plato.trabajadores.join('; ')}"`
        ].join(','))
      })
    } else {
      content.push('No hay pedidos para este turno')
    }

    content.push('') // Línea vacía
    content.push('') // Línea vacía
    content.push('PEDIDOS - TURNO NOCHE')
    content.push('') // Línea vacía

    if (vistaCocina.noche.length > 0) {
      // Headers para turno noche
      content.push('Plato,Código,Categoría,Cantidad,Trabajadores')
      
      // Datos del turno noche
      vistaCocina.noche.forEach(plato => {
        content.push([
          `"${plato.descripcion_opcion}"`,
          plato.codigo_opcion,
          plato.categoria_opcion,
          plato.cantidad.toString(),
          `"${plato.trabajadores.join('; ')}"`
        ].join(','))
      })
    } else {
      content.push('No hay pedidos para este turno')
    }

    return content.join('\n')
  }

  const generateWorkersCSV = () => {
    const dateFormatted = new Date(selectedDate).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    let content = [
      // Header principal
      'PEDIDOS POR TRABAJADOR',
      `Fecha: ${dateFormatted}`,
      `Total de pedidos: ${pedidos.length}`,
      '', // Línea vacía
      
      // Headers de columnas
      'Trabajador,RUT,Empresa,Turno,Plato,Código,Categoría,Notas,Hora Pedido'
    ]

    // Ordenar pedidos por trabajador y luego por turno
    const sortedPedidos = [...pedidos].sort((a, b) => 
      a.nombre_trabajador.localeCompare(b.nombre_trabajador) || 
      a.turno_elegido.localeCompare(b.turno_elegido)
    )

    // Agregar datos de cada pedido
    sortedPedidos.forEach(pedido => {
      content.push([
        `"${pedido.nombre_trabajador}"`,
        pedido.rut_trabajador || 'Sin RUT',
        `"${pedido.empresa}"`,
        pedido.turno_elegido === 'dia' ? 'Día' : 'Noche',
        `"${pedido.descripcion_opcion}"`,
        pedido.codigo_opcion,
        pedido.categoria_opcion,
        `"${pedido.notas || 'Sin notas'}"`,
        new Date(pedido.created_at).toLocaleTimeString('es-ES')
      ].join(','))
    })

    return content.join('\n')
  }

  const generateShiftsCSV = () => {
    const dateFormatted = new Date(selectedDate).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    let content = [
      // Header principal
      'PEDIDOS POR TURNO',
      `Fecha: ${dateFormatted}`,
      '', // Línea vacía
    ]

    // Sección Turno Día
    const pedidosDia = pedidos.filter(p => p.turno_elegido === 'dia')
    content.push('TURNO DÍA')
    content.push(`Total pedidos: ${pedidosDia.length}`)
    content.push('') // Línea vacía
    
    if (pedidosDia.length > 0) {
      content.push('Trabajador,RUT,Empresa,Plato,Código,Categoría,Notas')
      
      pedidosDia.forEach(pedido => {
        content.push([
          `"${pedido.nombre_trabajador}"`,
          pedido.rut_trabajador || 'Sin RUT',
          `"${pedido.empresa}"`,
          `"${pedido.descripcion_opcion}"`,
          pedido.codigo_opcion,
          pedido.categoria_opcion,
          `"${pedido.notas || 'Sin notas'}"`
        ].join(','))
      })
    } else {
      content.push('No hay pedidos para este turno')
    }

    content.push('') // Línea vacía
    content.push('') // Línea vacía

    // Sección Turno Noche
    const pedidosNoche = pedidos.filter(p => p.turno_elegido === 'noche')
    content.push('TURNO NOCHE')
    content.push(`Total pedidos: ${pedidosNoche.length}`)
    content.push('') // Línea vacía

    if (pedidosNoche.length > 0) {
      content.push('Trabajador,RUT,Empresa,Plato,Código,Categoría,Notas')
      
      pedidosNoche.forEach(pedido => {
        content.push([
          `"${pedido.nombre_trabajador}"`,
          pedido.rut_trabajador || 'Sin RUT',
          `"${pedido.empresa}"`,
          `"${pedido.descripcion_opcion}"`,
          pedido.codigo_opcion,
          pedido.categoria_opcion,
          `"${pedido.notas || 'Sin notas'}"`
        ].join(','))
      })
    } else {
      content.push('No hay pedidos para este turno')
    }

    return content.join('\n')
  }

  const generateGeneralCSV = () => {
    const dataToExport = getFilteredPedidos()
    const dateFormatted = new Date(selectedDate).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    let content = [
      // Header principal
      'REPORTE GENERAL DE PEDIDOS',
      `Fecha: ${dateFormatted}`,
      `Total de pedidos: ${dataToExport.length}`,
      '', // Línea vacía
      
      // Headers de columnas
      'ID,Trabajador,RUT,Empresa,Turno,Plato,Código,Categoría,Notas,Día Semana,Fecha Creación,Rol Trabajador,Turno Habitual,Estado'
    ]
    
    // Datos de cada pedido
    dataToExport.forEach(pedido => {
      content.push([
        pedido.id.toString(),
        `"${pedido.nombre_trabajador}"`,
        pedido.rut_trabajador || 'Sin RUT',
        `"${pedido.empresa}"`,
        pedido.turno_elegido === 'dia' ? 'Día' : 'Noche',
        `"${pedido.descripcion_opcion}"`,
        pedido.codigo_opcion,
        pedido.categoria_opcion,
        `"${pedido.notas || 'Sin notas'}"`,
        pedido.dia_semana,
        new Date(pedido.created_at).toLocaleString('es-ES'),
        pedido.trabajador_info?.rol || 'N/A',
        pedido.trabajador_info?.turno_habitual || 'N/A',
        pedido.trabajador_info?.activo ? 'Activo' : 'Inactivo'
      ].join(','))
    })

    return content.join('\n')
  }

  const getCategoryColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'principal':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'especial':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'dieta_blanda':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'vegetariano':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'postre':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
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
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="general">Exportar General</option>
              <option value="kitchen">Vista Cocina</option>
              <option value="workers">Por Trabajador</option>
              <option value="shifts">Por Turno</option>
            </select>
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
            onClick={() => setActiveTab('kitchen')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'kitchen'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-4 h-4 inline mr-2" />
            Vista Cocina
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
                Última actualización: {new Date().toLocaleTimeString('es-ES')} | {pedidos.length} pedidos cargados
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

        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            {/* Vista Cocina Header */}
            <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-3">
                  <ChefHat className="w-8 h-8" />
                  <span>Vista Diaria para Cocina</span>
                </CardTitle>
                <p className="text-orange-100">
                  Resumen de platos agrupados por turno y cantidad - {new Date(selectedDate).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </CardHeader>
            </Card>

            {/* Turno Día */}
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="text-xl flex items-center space-x-3">
                  <Sun className="w-6 h-6" />
                  <span>Pedidos - Turno Día</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {vistaCocina.dia.reduce((total, plato) => total + plato.cantidad, 0)} pedidos
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {vistaCocina.dia.length === 0 ? (
                  <div className="text-center py-8">
                    <Utensils className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay pedidos para este turno</h3>
                    <p className="text-slate-600">No se registraron pedidos para el turno de día</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vistaCocina.dia.map((plato, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {plato.cantidad}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 text-lg">{plato.descripcion_opcion}</h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-sm text-slate-600">Código: {plato.codigo_opcion}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(plato.categoria_opcion)}`}>
                                  {plato.categoria_opcion}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Trabajadores ({plato.trabajadores.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {plato.trabajadores.map((trabajador, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm border border-amber-200"
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

            {/* Turno Noche */}
            <Card className="bg-white shadow-sm border border-slate-200">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-xl flex items-center space-x-3">
                  <Moon className="w-6 h-6" />
                  <span>Pedidos - Turno Noche</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {vistaCocina.noche.reduce((total, plato) => total + plato.cantidad, 0)} pedidos
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {vistaCocina.noche.length === 0 ? (
                  <div className="text-center py-8">
                    <Utensils className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay pedidos para este turno</h3>
                    <p className="text-slate-600">No se registraron pedidos para el turno de noche</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vistaCocina.noche.map((plato, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {plato.cantidad}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 text-lg">{plato.descripcion_opcion}</h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-sm text-slate-600">Código: {plato.codigo_opcion}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(plato.categoria_opcion)}`}>
                                  {plato.categoria_opcion}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Trabajadores ({plato.trabajadores.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {plato.trabajadores.map((trabajador, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-sm border border-purple-200"
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
          </div>
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
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                  ID: {pedido.id}
                                </span>
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