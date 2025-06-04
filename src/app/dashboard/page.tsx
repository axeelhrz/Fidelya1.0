"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  User, 
  Calendar, 
  ShoppingCart, 
  CreditCard, 
  Settings,
  Users,
  BookOpen
} from 'lucide-react'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalSpent: number
}
export default function DashboardPage() {
  const { user, guardian, students, loading: userLoading } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!guardian) return
      try {
        setLoadingStats(true)
        // Obtener estadísticas de pedidos
      const { data: orders, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('guardian_id', guardian.id)

      if (error) {
          console.error('Error fetching orders:', error)
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
        console.error('Error in fetchStats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (guardian) {
      fetchStats()
    }
  }, [guardian])

  if (userLoading) {
      return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
                  ))}
                </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
  )
}

  if (!user || !guardian) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {guardian.full_name}
          </p>
        </div>
        <Badge variant={guardian.is_staff ? "default" : "secondary"}>
          {guardian.is_staff ? "Staff" : "Apoderado"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-16" /> : stats.totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-16" /> : stats.pendingOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Completados</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-16" /> : stats.completedOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `$${stats.totalSpent.toLocaleString()}`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Students Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Estudiantes
            </CardTitle>
            <CardDescription>
              Estudiantes registrados en tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {students.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay estudiantes registrados
              </p>
            ) : (
              students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.grade} {student.section} - {student.level}
                    </p>
                  </div>
                  <Badge variant="outline">{student.level}</Badge>
                </div>
              ))
            )}
            <Link href="/perfil">
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Gestionar Estudiantes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/pedidos/nuevo">
              <Button className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Hacer Nuevo Pedido
              </Button>
            </Link>
            
            <Link href="/menu">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver Menú Semanal
              </Button>
            </Link>
            
            <Link href="/perfil">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
              </Button>
            </Link>

            {guardian.is_staff && (
              <Link href="/admin">
                <Button variant="secondary" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Panel de Administración
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}