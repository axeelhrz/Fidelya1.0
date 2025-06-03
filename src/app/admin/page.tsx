import Image from "next/image";
import { formatPrice, formatDate } from 'utils';
import { Card, CardHeader, CardTitle, CardContent, Badge, Users, ShoppingCart, DollarSign, Calendar, Clock, TrendingUp, AlertCircle } from 'components';

export default function AdminDashboard() {
  const guardian = {
    is_staff: true
  };
  const stats = {
    totalStudents: 100,
    totalOrders: 50,
    totalRevenue: 1000,
    todayOrders: 10,
    pendingOrders: 5,
    paidOrders: 30,
    totalOrders: 50,
    recentOrders: [
      { id: 1, students: { name: 'John Doe', grade: '10', section: 'A' }, guardians: { full_name: 'Jane Doe' }, dia_entrega: '2023-10-01', total_amount: 100, status: 'PAGADO', created_at: '2023-10-01T12:00:00' },
      { id: 2, students: { name: 'Jane Smith', grade: '11', section: 'B' }, guardians: { full_name: 'John Smith' }, dia_entrega: '2023-10-02', total_amount: 200, status: 'PENDIENTE', created_at: '2023-10-02T12:00:00' }
    ]
  };

  const loading = false;
  const loadingStats = false;

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