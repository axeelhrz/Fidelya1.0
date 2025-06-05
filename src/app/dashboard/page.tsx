"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, 
  Users, 
  Calendar, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  Home,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  students: any[];
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Verificar autenticación
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.log('No session, redirecting to login')
        router.push('/auth/login')
        return
      }

      // Cargar perfil del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (userError || !userData) {
        console.error('Error loading user profile:', userError)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el perfil de usuario"
        })
        return
      }

      // Cargar estudiantes
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('guardian_id', userData.id)
        .eq('is_active', true)

      if (studentsError) {
        console.error('Error loading students:', studentsError)
      }

      setUser({
        ...userData,
        students: studentsData || []
      })

    } catch (error) {
      console.error('Error in loadUserData:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los datos"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente"
      })
      
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cerrar sesión"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar el dashboard</h1>
          <Button onClick={() => router.push('/auth/login')}>
            Volver al login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard - Casino Escolar
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Modo sin autenticación
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Usuarios
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +12% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pedidos Hoy
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  +5% desde ayer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Semana
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">
                  +8% desde la semana pasada
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Menús Activos
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Para esta semana
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Hacer Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <span>Hacer Pedido</span>
                </CardTitle>
                <CardDescription>
                  Crear un nuevo pedido para la semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pedidos/nuevo">
                  <Button className="w-full">
                    Nuevo Pedido
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Ver Menú */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Menú Semanal</span>
                </CardTitle>
                <CardDescription>
                  Consultar menús disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/menu">
                  <Button variant="outline" className="w-full">
                    Ver Menú
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Mi Perfil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <span>Mi Perfil</span>
                </CardTitle>
                <CardDescription>
                  Gestionar información personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/perfil">
                  <Button variant="outline" className="w-full">
                    Ver Perfil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Administración */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-red-600" />
                  <span>Administración</span>
                </CardTitle>
                <CardDescription>
                  Panel de administración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button variant="outline" className="w-full">
                    Ir a Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Estadísticas</span>
                </CardTitle>
                <CardDescription>
                  Reportes y análisis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/estadisticas">
                  <Button variant="outline" className="w-full">
                    Ver Reportes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Historial */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span>Historial</span>
                </CardTitle>
                <CardDescription>
                  Pedidos anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Info Banner */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Home className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Modo de desarrollo activo
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Todas las funcionalidades están disponibles sin autenticación. 
                    Puedes navegar libremente por todo el sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}