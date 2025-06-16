'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Utensils, 
  Settings, 
  User, 
  Shield, 
  LogOut,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react'

export default function RoleSelection() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleEmployeeAccess = () => {
    router.push('/dashboard')
  }

  const handleAdminAccess = () => {
    router.push('/admin')
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const isAdmin = profile?.rol?.toLowerCase() === 'admin' || profile?.rol?.toLowerCase() === 'administrador'
  const canAccessEmployee = true // Todos pueden acceder como empleado
  const canAccessAdmin = isAdmin

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background con gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient"></div>
      
      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-orange-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-float opacity-80" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-float opacity-70" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-float opacity-60" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Elementos decorativos grandes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-in-down">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-xl opacity-75 animate-glow"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl hover-lift">
                <Utensils className="w-12 h-12 text-white" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black mb-4">
              <span className="text-gradient-orange">Plataforma de</span>
              <br />
              <span className="text-white">Pedidos de Almuerzo</span>
            </h1>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block border border-white/20 shadow-lg mb-4">
              <p className="text-white text-lg font-semibold">
                Bienvenido, <span className="text-gradient-orange">{profile?.nombre_completo}</span>
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>

            <div className="flex items-center justify-center space-x-1 mt-4">
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </div>

          {/* Cards de Opciones */}
          <div className={`grid gap-8 ${canAccessAdmin ? 'md:grid-cols-2' : 'max-w-md mx-auto'} animate-slide-in-up`}>
            {/* Opción Empleado */}
            {canAccessEmployee && (
              <Card className="border-0 shadow-2xl glass-card hover-lift group cursor-pointer transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-900 mb-3">
                    Realizar Pedido
                    <br />
                    <span className="text-green-600">(Empleado)</span>
                  </h2>
                  
                  <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                    Accede al sistema de pedidos como si fueras un empleado regular.
                  </p>
                  
                  <Button
                    onClick={handleEmployeeAccess}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                  >
                    <span className="flex items-center justify-center space-x-3">
                      <span>Ir a Pedidos</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Opción Administrador */}
            {canAccessAdmin && (
              <Card className="border-0 shadow-2xl glass-card hover-lift group cursor-pointer transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-900 mb-3">
                    Panel de
                    <br />
                    <span className="text-blue-600">Administración</span>
                  </h2>
                  
                  <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                    Gestiona pedidos, genera reportes y administra el sistema.
                  </p>
                  
                  <Button
                    onClick={handleAdminAccess}
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                  >
                    <span className="flex items-center justify-center space-x-3">
                      <span>Ir al Panel</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Información del Usuario */}
          <div className="mt-12 text-center animate-slide-in-up" style={{animationDelay: '0.3s'}}>
            <div className="inline-flex items-center space-x-4 text-sm text-slate-300 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Rol: {profile?.rol || 'Empleado'}</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="font-semibold">RUT: {profile?.rut}</span>
              </div>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
