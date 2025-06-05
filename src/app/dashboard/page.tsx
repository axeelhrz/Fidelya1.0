"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User, LogOut, Users, Calendar } from 'lucide-react'
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
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Casino Escolar - Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {user.full_name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Perfil del Usuario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Mi Perfil</span>
                </CardTitle>
                <CardDescription>
                  Información de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {user.full_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Teléfono:</strong> {user.phone}</p>
                  <p><strong>Rol:</strong> {user.role}</p>
                </div>
              </CardContent>
            </Card>

            {/* Estudiantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Mis Estudiantes</span>
                </CardTitle>
                <CardDescription>
                  Estudiantes registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.students.length > 0 ? (
                  <div className="space-y-2">
                    {user.students.map((student, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          {student.grade}{student.section} - {student.level}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay estudiantes registrados</p>
                )}
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Acciones Rápidas</span>
                </CardTitle>
                <CardDescription>
                  Funciones principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Ver Menú Semanal
                  </Button>
                  <Button className="w-full" variant="outline">
                    Hacer Pedido
                  </Button>
                  <Button className="w-full" variant="outline">
                    Historial de Pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}