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
  Cpu,
  Activity
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
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      {/* Partículas flotantes */}
      <div className="particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Formas geométricas */}
      <div className="geometric-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
      </div>

      {/* Líneas de conexión */}
      <div className="connection-lines">
        <div className="line line-1" />
        <div className="line line-2" />
        <div className="line line-3" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header futurista */}
        <div className="text-center mb-20 transform-gpu">
          <div className="relative inline-block mb-8 perspective-1000">
            <div className="w-24 h-24 glass-ultra rounded-3xl flex items-center justify-center mx-auto hover-glow animate-hologram">
              <Cpu className="w-12 h-12 text-cyan-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse" />
          </div>
          
          <h1 className="text-5xl font-light text-white mb-6 tracking-tight">
            <span className="text-glow">Sistema Neural</span>
            <br />
            <span className="text-gradient-cyber font-semibold">Gestión Alimentaria</span>
          </h1>
          
          <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto leading-relaxed mb-8">
            Plataforma de inteligencia artificial para optimización de pedidos y gestión automatizada
          </p>

          {/* User Info Card futurista */}
          <div className="inline-flex items-center space-x-6 glass-ultra rounded-2xl px-8 py-6 hover-glow transition-all duration-500">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xl">
                {profile?.nombre_completo?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full border-2 border-slate-900 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />
              </div>
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-xl mb-1">
                {profile?.nombre_completo}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-300 font-medium">
                  {profile?.rol || 'Empleado'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-mono">{profile?.rut}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de opciones futurista */}
        <div className={`grid gap-10 mb-20 ${canAccessAdmin ? 'md:grid-cols-2 max-w-5xl mx-auto' : 'max-w-lg mx-auto'}`}>
          {/* Portal Empleado */}
          {canAccessEmployee && (
            <Card className="group relative overflow-hidden border-0 glass-card hover-glow transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 animate-gradient-rotate" />
              
              <CardContent className="relative p-12 text-center">
                <div className="relative mb-10">
                  <div className="w-24 h-24 glass-ultra rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 animate-hologram">
                    <User className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Portal Neural
                  <span className="block text-emerald-600 text-2xl">Empleado</span>
                </h2>
                
                <p className="text-slate-600 mb-10 leading-relaxed font-light text-lg">
                  Interfaz inteligente con IA predictiva para gestión optimizada de pedidos
                </p>
                
                <Button
                  onClick={handleEmployeeAccess}
                  className="w-full btn-futuristic h-16 font-semibold text-lg rounded-2xl group-hover:scale-105 transition-all duration-300 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-2xl"
                >
                  <span className="flex items-center justify-center space-x-4">
                    <span>Acceder al Portal</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Centro de Control Admin */}
          {canAccessAdmin && (
            <Card className="group relative overflow-hidden border-0 glass-card hover-glow transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 animate-gradient-rotate" />
              
              <CardContent className="relative p-12 text-center">
                <div className="relative mb-10">
                  <div className="w-24 h-24 glass-ultra rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 animate-hologram">
                    <Shield className="w-12 h-12 text-purple-400" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Centro Neural
                  <span className="block text-purple-600 text-2xl">Administración</span>
                </h2>
                
                <p className="text-slate-600 mb-10 leading-relaxed font-light text-lg">
                  Dashboard avanzado con machine learning y analytics en tiempo real
                </p>
                
                <Button
                  onClick={handleAdminAccess}
                  className="w-full btn-futuristic h-16 font-semibold text-lg rounded-2xl group-hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-2xl"
                >
                  <span className="flex items-center justify-center space-x-4">
                    <span>Acceder al Centro</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer futurista */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-8 glass-ultra rounded-3xl px-10 py-6 hover-glow transition-all duration-500">
            <div className="flex items-center space-x-3 text-cyan-300">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-pulse" />
              <span className="font-semibold text-lg">Sistema Activo</span>
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 group font-medium text-lg"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Desconectar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Efectos de datos streaming */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-data-stream"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}