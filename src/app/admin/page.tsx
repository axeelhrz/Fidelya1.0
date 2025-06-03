"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/context/UserContext'
import { redirect } from 'next/navigation'

interface DashboardStats {
  totalStudents: number
  totalOrders: number
  totalRevenue: number
  todayOrders: number
  pendingOrders: number
  paidOrders: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const { guardian, loading } = useUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // Verificar permisos de admin
  useEffect(() => {
    if (!loading && (!guardian || !guardian.is_staff)) {
      redirect('/dashboard')
    }
  }, [guardian, loading])

  useEffect(() => {
    if (guardian?.is_staff) {
      loadDashboardStats()
    }
  }, [guardian])

  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true)

      // Obtener estadísticas en paralelo
      const [
        studentsResult,
        ordersResult,
        todayOrdersResult,
        recentOrdersResult
      ] = await Promise.all([
        // Total estudiantes activos
        supabase
          .from('students')
          .select('id', { count: 'exact' })
          .eq('is_active', true),

        // Total pedidos y revenue
        supabase
          .from('orders')
          .select('id, total_amount, status', { count: 'exact' }),

        // Pedidos de hoy
        supabase
          .from('orders')
          .select('id, status', { count: 'exact' })
          .eq('fecha_pedido', new Date().toISOString().split('T')[0]),

        // Pedidos recientes
        supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            dia_entrega,
            students (
              name,
              grade,
              section
            ),
            guardians (
              full_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10)
      ])

      // Procesar resultados
      const totalStudents = studentsResult.count || 0
      const totalOrders = ordersResult.count || 0
      const orders = ordersResult.data || []
      
      const totalRevenue = orders
        .filter(order => order.status === 'PAGADO')
        .reduce((sum, order) => sum + order.total_amount, 0)

      const todayOrders = todayOrdersResult.count || 0
      const pendingOrders = orders.filter(order => order.status === 'PENDIENTE').length
      const paidOrders = orders.filter(order => order.status === 'PAGADO').length

      setStats({
        totalStudents,
        totalOrders,
        totalRevenue,
        todayOrders,
        pendingOrders,
        paidOrders,
        recentOrders: recentOrdersResult.data || []
      })

    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading || loadingStats) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!guardian?.is_staff) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Panel Administrativo</h1>
        <p className="text-muted-foreground">
          Gestión del Casino Escolar
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Estudiantes activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pedidos
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Pagos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos del día
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pedidos Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {stats?.pendingOrders || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Esperando pago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Pedidos Pagados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats?.paidOrders || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Tasa de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats?.totalOrders ? 
                Math.round((stats.paidOrders / stats.totalOrders) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground">
              Pedidos pagados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {order.students?.name}
                    </span>
                    <Badge variant="outline">
                      {order.students?.grade} {order.students?.section}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.guardians?.full_name} • {order.dia_entrega}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatPrice(order.total_amount)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        order.status === 'PAGADO' ? 'default' :
                        order.status === 'PENDIENTE' ? 'secondary' : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No hay pedidos recientes
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Gestionar Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ver, filtrar y gestionar todos los pedidos
            </p>
            <a href="/admin/pedidos" className="text-primary hover:underline">
              Ir a pedidos →
            </a>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Gestionar Menú</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Subir y gestionar menús semanales
            </p>
            <a href="/admin/menu" className="text-primary hover:underline">
              Ir a menú →
            </a>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ver reportes detallados y métricas
            </p>
            <a href="/admin/estadisticas" className="text-primary hover:underline">
              Ver estadísticas →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}