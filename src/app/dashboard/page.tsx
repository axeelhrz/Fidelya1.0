"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  User, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { supabase } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalSpent: number
}
export default function DashboardPage() {
  const { user, guardian, students } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (guardian) {
      loadDashboardData()
    }
  }, [guardian])
  const loadDashboardData = async () => {
    if (!guardian) return
    try {
      // Cargar estadísticas de pedidos
      const { data: orders, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('guardian_id', guardian.id)

      if (error) {
        console.error('Error cargando pedidos:', error)
        return
      }

      const totalOrders = orders?.length || 0
      const pendingOrders = orders?.filter(order => order.estado_pago === 'PENDIENTE').length || 0
      const completedOrders = orders?.filter(order => order.estado_pago === 'PAGADO').length || 0
      const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSpent
      })
      } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

  // Mostrar loading si no hay usuario o guardian
  if (!user || !guardian) {
      return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }
    
    return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Bienvenido, {guardian.full_name}!
            </h1>
            <p className="mt-2 text-gray-600">
              Gestiona los pedidos de comida para tus estudiantes
                    </p>
                    </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Nuevo Pedido
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Realiza un nuevo pedido para tus estudiantes
                                      </p>
                <Button asChild className="w-full">
                  <Link href="/pedidos/nuevo">
                    Hacer Pedido
                  </Link>
              </Button>
              </CardContent>
                </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mi Perfil
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Actualiza tu información y la de tus estudiantes
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/perfil">
                    Ver Perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Historial
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Revisa el historial de pedidos realizados
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pedidos/historial">
                    Ver Historial
                  </Link>
                </Button>
              </CardContent>
            </Card>
      </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pedidos
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Pedidos realizados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendientes
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Por pagar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completados
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Pagados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Gastado
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalSpent.toLocaleString()}
    </div>
                <p className="text-xs text-muted-foreground">
                  En pedidos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Students */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Estudiantes</CardTitle>
              <CardDescription>
                Estudiantes registrados en tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay estudiantes registrados
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Agrega estudiantes a tu perfil para poder realizar pedidos
                  </p>
                  <Button asChild>
                    <Link href="/perfil">
                      Agregar Estudiante
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <div className="mt-2 space-y-1">
                        <Badge variant="secondary">
                          {student.grade} {student.section}
                        </Badge>
                        <p className="text-sm text-gray-600">{student.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
