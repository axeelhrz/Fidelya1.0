'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { signInWithCredentials, getAllUsers, generatePassword, testSupabaseConnection } from '@/lib/auth'
import { Trabajador } from '@/types/database'
import {
  Utensils,
  User,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Building2,
  Sparkles,
  Zap,
  Star
} from 'lucide-react'

export default function LoginForm() {
  const [selectedUser, setSelectedUser] = useState<Trabajador | null>(null)
  const [users, setUsers] = useState<Trabajador[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const router = useRouter()

  useEffect(() => {
    checkConnection()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const checkConnection = async () => {
    setConnectionStatus('checking')
    const isConnected = await testSupabaseConnection()
    setConnectionStatus(isConnected ? 'connected' : 'error')

    if (isConnected) {
      fetchUsers()
    } else {
      setLoadingUsers(false)
      setError('No se pudo conectar con la base de datos')
    }
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      setError('')
      const usersList = await getAllUsers()

      if (usersList.length === 0) {
        setError('No se encontraron trabajadores activos')
      } else {
        setUsers(usersList)
      }
    } catch (error: any) {
      setError(`Error al cargar trabajadores: ${error.message}`)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleUserSelect = (user: Trabajador) => {
    setSelectedUser(user)
    setShowDropdown(false)
    setError('')
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser) {
      setError('Por favor selecciona tu nombre')
      return
    }

    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signInWithCredentials(selectedUser.nombre_completo, password.trim())
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const getExpectedPassword = () => {
    return selectedUser ? generatePassword(selectedUser.nombre_completo) : ''
  }

  const isPasswordCorrect = () => {
    return password.toUpperCase() === getExpectedPassword()
  }

  const getTurnoColor = (turno: string | null) => {
    if (!turno) return 'bg-gray-100 text-gray-600 border-gray-200'
    switch (turno.toLowerCase()) {
      case 'día':
      case 'dia':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200'
      case 'noche':
        return 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200'
      case 'mixto':
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getRolColor = (rol: string | null) => {
    if (!rol) return 'bg-gray-100 text-gray-600 border-gray-200'
    switch (rol.toLowerCase()) {
      case 'admin':
      case 'administrador':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
      case 'supervisor':
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200'
      case 'empleado':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

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
        <div className="w-full max-w-md">
          {/* Logo y Header */}
          <div className="text-center mb-8 animate-slide-in-down">
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
              <span className="text-gradient-orange">Plataforma</span>
              <br />
              <span className="text-white">de Pedidos</span>
            </h1>
            <p className="text-slate-300 text-lg font-medium">
              Accede a tu cuenta para gestionar tus almuerzos
            </p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </div>

          {/* Card Principal */}
          <Card className="border-0 shadow-2xl glass-card hover-lift animate-slide-in-up">
            <CardContent className="p-8">
              {/* Status de Conexión */}
              <div className="mb-8">
                {connectionStatus === 'checking' && (
                  <div className="flex items-center justify-center space-x-3 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="font-semibold text-blue-700">Conectando con el servidor...</span>
                    <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                  </div>
                )}
                {connectionStatus === 'connected' && (
                  <div className="flex items-center justify-center space-x-3 text-sm bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">Conectado exitosamente</span>
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                  </div>
                )}
                {connectionStatus === 'error' && (
                  <div className="flex items-center justify-center space-x-3 text-sm bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-700">Error de conexión</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={checkConnection}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full"
                    >
                      Reintentar
                    </Button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Campo Tu Nombre */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span>Tu Nombre</span>
                  </label>

                  {loadingUsers ? (
                    <div className="flex items-center justify-center h-16 border-2 border-dashed border-slate-300 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 animate-shimmer">
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                      <span className="ml-3 text-sm text-slate-600 font-semibold">Cargando trabajadores...</span>
                    </div>
                  ) : (
                    <div className="relative dropdown-container">
                      <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        disabled={users.length === 0}
                        className="w-full h-16 px-6 py-4 border-2 border-slate-200 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 flex items-center justify-between text-left disabled:opacity-50 disabled:cursor-not-allowed group hover:border-orange-300 hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center group-hover:from-orange-400 group-hover:to-red-500 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {selectedUser ? (
                              <div>
                                <p className="text-base font-bold text-slate-900 truncate">{selectedUser.nombre_completo}</p>
                                <p className="text-sm text-slate-500 font-medium">RUT: {selectedUser.rut}</p>
                              </div>
                            ) : (
                              <span className="text-base text-slate-500 font-semibold">
                                {users.length === 0 ? 'No hay trabajadores disponibles' : 'Selecciona tu nombre...'}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={`w-6 h-6 text-slate-400 transition-all duration-300 ${showDropdown ? 'rotate-180 text-orange-500 scale-110' : ''}`} />
                      </button>

                      {showDropdown && users.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto dropdown-enter-active">
                          <div className="p-3">
                            {users.map((user, index) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className={`w-full p-4 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 focus:bg-gradient-to-r focus:from-orange-50 focus:to-red-50 focus:outline-none transition-all duration-300 flex items-center space-x-4 rounded-xl group hover:shadow-md ${
                                  selectedUser?.id === user.id ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 shadow-md' : ''
                                } ${index !== users.length - 1 ? 'border-b border-slate-100' : ''}`}
                              >
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                  <User className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-slate-900 truncate text-lg">{user.nombre_completo}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-sm text-slate-500 font-medium">RUT: {user.rut}</p>
                                    {user.empresa_id && (
                                      <div className="flex items-center space-x-1">
                                        <Building2 className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-400 font-medium">ID: {user.empresa_id}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2 mt-2">
                                    {user.turno_habitual && (
                                      <span className={`text-xs px-3 py-1 rounded-full border font-bold shadow-sm ${getTurnoColor(user.turno_habitual)}`}>
                                        {user.turno_habitual}
                                      </span>
                                    )}
                                    {user.rol && (
                                      <span className={`text-xs px-3 py-1 rounded-full border font-bold shadow-sm ${getRolColor(user.rol)}`}>
                                        {user.rol}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {selectedUser?.id === user.id && (
                                  <CheckCircle2 className="w-6 h-6 text-orange-500 animate-pulse" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <span>Contraseña</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                      <Shield className="w-6 h-6 text-slate-400" />
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-14 pr-14 h-16 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 text-lg font-semibold transition-all duration-300 input-glow ${
                        password && selectedUser
                          ? isPasswordCorrect()
                            ? 'border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 focus:border-emerald-500'
                            : 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50 focus:border-red-500'
                          : 'hover:border-slate-300 hover:shadow-md'
                      }`}
                      disabled={!selectedUser}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300 z-10 hover:scale-110"
                      disabled={!password}
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>

                  {/* Hint de contraseña */}
                  {selectedUser && (
                    <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 shadow-sm">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-bold text-blue-900 mb-2">
                            Formato de contraseña
                          </p>
                          <p className="text-sm text-blue-700 mb-3 font-medium">
                            Primera letra del nombre + apellido completo (todo en mayúsculas)
                          </p>
                          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                            <p className="text-sm text-slate-600 mb-2 font-medium">
                              Para <strong className="text-blue-800">{selectedUser.nombre_completo}</strong>:
                            </p>
                            <code className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-lg font-mono font-black text-lg border border-blue-200">
                              {getExpectedPassword()}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validación visual */}
                  {password && selectedUser && (
                    <div className={`flex items-center space-x-4 p-4 rounded-2xl border shadow-sm ${
                      isPasswordCorrect()
                        ? 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
                        : 'text-red-700 bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                    }`}>
                      {isPasswordCorrect() ? (
                        <CheckCircle2 className="w-6 h-6 flex-shrink-0 animate-pulse" />
                      ) : (
                        <AlertCircle className="w-6 h-6 flex-shrink-0 animate-pulse" />
                      )}
                      <span className="text-base font-bold">
                        {isPasswordCorrect() ? '¡Contraseña correcta!' : 'Contraseña incorrecta'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start space-x-4 animate-slide-in-up shadow-lg">
                    <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-bold text-base">Error de autenticación</p>
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Botón de Login */}
                <Button
                  type="submit"
                  className="w-full h-16 btn-gradient text-white font-black text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 animate-glow"
                  disabled={loading || !selectedUser || !password || connectionStatus !== 'connected'}
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Iniciando sesión...</span>
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6" />
                      <span>Iniciar Sesión</span>
                      <Zap className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center space-y-6">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                <p className="text-sm text-slate-600 font-medium">
                  ¿Problemas para acceder?{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-bold underline transition-colors duration-200 hover:scale-105 inline-block">
                    Contacta al administrador
                  </a>
                </p>

                {/* Debug Info (solo en desarrollo) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="font-bold">🔧 Modo desarrollo</p>
                    <p className="font-medium">Trabajadores cargados: {users.length} | Estado: {connectionStatus}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="mt-8 text-center animate-slide-in-up" style={{animationDelay: '0.3s'}}>
            <div className="inline-flex items-center space-x-3 text-sm text-slate-300 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
              <Shield className="w-4 h-4" />
              <span className="font-semibold">Conexión segura</span>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}