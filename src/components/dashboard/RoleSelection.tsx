'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  User, 
  Shield, 
  LogOut,
  ArrowRight,
  Zap,
  Cpu
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
  const canAccessEmployee = true
  const canAccessAdmin = isAdmin

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-slate-200/50 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-slate-200/30 rotate-45"></div>
        <div className="absolute bottom-32 left-16 w-40 h-40 border border-slate-200/40 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-slate-200/60 rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <Cpu className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
            Sistema de Gestión
            <span className="block font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Pedidos de Almuerzo
            </span>
          </h1>
          
          <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Plataforma inteligente para la gestión eficiente de pedidos alimentarios
          </p>

          {/* User Info Card */}
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 border border-slate-200/50 shadow-lg mt-8">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center text-white font-medium">
                {profile?.nombre_completo?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-lg">
                {profile?.nombre_completo}
              </p>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">
                  {profile?.rol || 'Empleado'}
                </span>
                <span className="text-slate-400">•</span>
                <span>{profile?.rut}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className={`grid gap-8 mb-16 ${canAccessAdmin ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'max-w-md mx-auto'}`}>
          {/* Employee Option */}
          {canAccessEmployee && (
            <Card className="group relative overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              
              <CardContent className="relative p-10 text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <User className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Portal Empleado
                </h2>
                
                <p className="text-slate-600 mb-8 leading-relaxed font-light">
                  Interfaz optimizada para la gestión personal de pedidos con seguimiento en tiempo real
                </p>
                
                <Button
                  onClick={handleEmployeeAccess}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white h-14 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>Acceder al Portal</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin Option */}
          {canAccessAdmin && (
            <Card className="group relative overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-600"></div>
              
              <CardContent className="relative p-10 text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  Centro de Control
                </h2>
                
                <p className="text-slate-600 mb-8 leading-relaxed font-light">
                  Dashboard avanzado con analytics, gestión de usuarios y configuración del sistema
                </p>
                
                <Button
                  onClick={handleAdminAccess}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white h-14 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>Acceder al Centro</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-6 bg-white/40 backdrop-blur-sm rounded-2xl px-8 py-4 border border-slate-200/50">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Sistema Activo</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}