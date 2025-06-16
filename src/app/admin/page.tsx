'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Shield, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Crown,
  Sparkles
} from 'lucide-react'

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

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

  const handleBackToSelection = () => {
    router.push('/role-selection')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background con gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 min-h-screen p-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-slide-in-down">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToSelection}
                variant="ghost"
                className="text-white hover:bg-white/10 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white">Panel de Administración</h1>
                  <p className="text-blue-200">Bienvenido, {profile.nombre_completo}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
              <Shield className="w-5 h-5 text-blue-300" />
              <span className="text-white font-semibold">Administrador</span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
          </div>

          {/* Grid de funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-up">
            {/* Gestión de Usuarios */}
            <Card className="border-0 shadow-2xl glass-card hover-lift group cursor-pointer transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Gestión de Usuarios</h3>
                <p className="text-slate-600 mb-4 font-medium">Administra trabajadores, roles y permisos del sistema.</p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl">
                  Gestionar
                </Button>
              </CardContent>
            </Card>

            {/* Gestión de Pedidos */}
            <Card className="border-0 shadow-2xl glass-card hover-lift group cursor-pointer transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                    <ClipboardList className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Gestión de Pedidos</h3>
                <p className="text-slate-600 mb-4 font-medium">Revisa, confirma y administra todos los pedidos de almuerzo.</p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl">
                  Ver Pedidos
                </Button>
              </CardContent>
            </Card>

            {/* Reportes y Estadísticas */}
            <Card className="border-0 shadow-2xl glass-card hover-lift group cursor-pointer transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Reportes</h3>
                <p className="text-slate-600 mb-4 font-medium">Genera reportes y visualiza estadísticas del sistema.</p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl">
                  Ver Reportes
                </Button>
              </CardContent>
            </Card>

            {/* Configuración del Sistema */}
            <Card className="border-0 shadow-2xl glass-card hover-lift group cursor-pointer transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Configuración</h3>
                <p className="text-slate-600 mb-4 font-medium">Configura turnos, menús y parámetros del sistema.</p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl">
                  Configurar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-center animate-slide-in-up" style={{animationDelay: '0.3s'}}>
            <div className="inline-flex items-center space-x-4 text-sm text-slate-300 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Panel de Administración</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span className="font-semibold">Acceso Completo</span>
              </div>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
