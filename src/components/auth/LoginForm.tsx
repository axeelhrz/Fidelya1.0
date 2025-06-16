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
  const [debugInfo, setDebugInfo] = useState<any>(null)
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
    setDebugInfo(null)

    try {
      console.log('🔐 Iniciando proceso de login...')
      console.log('Usuario seleccionado:', selectedUser.nombre_completo)
      console.log('Contraseña ingresada:', password.trim())
      
      const result = await signInWithCredentials(selectedUser.nombre_completo, password.trim())
      
      console.log('✅ Login exitoso:', result)
      setDebugInfo({
        loginSuccess: true,
        user: result.data?.user,
        timestamp: new Date().toISOString()
      })

      // Pequeña pausa para mostrar el éxito
      setTimeout(() => {
        console.log('🚀 Redirigiendo a /role-selection...')
        router.push('/role-selection')
      }, 500)

    } catch (err: any) {
      console.error('❌ Error en login:', err)
      setError(err.message || 'Error al iniciar sesión')
      setDebugInfo({
        loginSuccess: false,
        error: err.message,
        timestamp: new Date().toISOString()
      })
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
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block border border-white/20 shadow-lg mb-4">
              <p className="text-white text-lg font-semibold">
                Bienvenido al sistema de pedidos
              </p>
            </div>

            <div className="flex items-center justify-center space-x-1 mt-4">
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          </div>

          {/* Card de Login */}
          <Card className="border-0 shadow-2xl glass-card hover-lift animate-slide-in-up">
            <CardContent className="p-8">
              {/* Estado de conexión */}
              <div className="mb-6">
                <div className={`flex items-center space-x-3 p-4 rounded-2xl ${
                  connectionStatus === 'connected' ? 'bg-green-100 text-green-800 border border-green-200' :
                  connectionStatus === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {connectionStatus === 'connected' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : connectionStatus === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  <span className="font-semibold">
                    {connectionStatus === 'connected' ? 'Conectado a la base de datos' :
                     connectionStatus === 'error' ? 'Error de conexión' :
                     'Verificando conexión...'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selector de Usuario */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900">
                    Selecciona tu nombre
                  </label>
                  
                  <div className="dropdown-container relative">
                    <div
                      onClick={() => !loadingUsers && setShowDropdown(!showDropdown)}
                      className={`w-full h-14 px-4 py-3 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedUser 
                          ? 'border-green-300 bg-green-50 shadow-lg' 
                          : 'border-slate-300 bg-white hover:border-orange-400 hover:shadow-md'
                      } ${loadingUsers ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            selectedUser ? 'bg-green-500' : 'bg-slate-400'
                          }`}>
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <span className={`font-semibold ${
                            selectedUser ? 'text-green-800' : 'text-slate-500'
                          }`}>
                            {loadingUsers ? 'Cargando trabajadores...' :
                             selectedUser ? selectedUser.nombre_completo : 'Selecciona tu nombre...'}
                          </span>
                        </div>
                        {!loadingUsers && (
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                            showDropdown ? 'rotate-180' : ''
                          }`} />
                        )}
                      </div>
                    </div>

                    {/* Dropdown */}
                    {showDropdown && !loadingUsers && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                        {users.length === 0 ? (
                          <div className="p-6 text-center text-slate-500">
                            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                            <p className="font-semibold">No hay trabajadores disponibles</p>
                          </div>
                        ) : (
                          users.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => handleUserSelect(user)}
                              className="p-4 hover:bg-slate-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-slate-900">{user.nombre_completo}</p>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getTurnoColor(user.turno_habitual)}`}>
                                      {user.turno_habitual || 'Sin turno'}
                                    </span>
                                    <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getRolColor(user.rol)}`}>
                                      {user.rol || 'Empleado'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Campo de Contraseña */}
                <div className="space-y-3">
                  <label htmlFor="password" className="text-sm font-bold text-slate-900">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      className={`h-14 pr-12 text-lg font-semibold transition-all duration-300 ${
                        password && isPasswordCorrect() 
                          ? 'border-green-400 bg-green-50 text-green-800' 
                          : password && !isPasswordCorrect()
                          ? 'border-red-400 bg-red-50 text-red-800'
                          : 'border-slate-300'
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    <div className={`flex items-center space-x-2 p-3 rounded-xl ${
                      isPasswordCorrect() 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {isPasswordCorrect() ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="font-semibold text-sm">
                        {isPasswordCorrect() ? 'Contraseña correcta' : 'Contraseña incorrecta'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="font-semibold">{error}</p>
                    </div>
                  </div>
                )}

                {/* Botón de Login */}
                <Button
                  type="submit"
                  disabled={loading || !selectedUser || !password.trim()}
                  className="w-full h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Zap className="w-6 h-6" />
                      <span>Iniciar Sesión</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Debug Info */}
              {(process.env.NODE_ENV === 'development' || debugInfo) && (
                <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-600 font-semibold mb-2">🔧 Información de Debug:</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>• Trabajadores cargados: {users.length}</p>
                    <p>• Estado de conexión: {connectionStatus}</p>
                    <p>• Usuario seleccionado: {selectedUser?.nombre_completo || 'Ninguno'}</p>
                    <p>• Contraseña esperada: {selectedUser ? getExpectedPassword() : 'N/A'}</p>
                    <p>• URL actual: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                    {debugInfo && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <p className="font-semibold">Último intento de login:</p>
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
            <div className="inline-flex items-center space-x-4 text-sm text-slate-300 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span className="font-semibold">Sistema de Pedidos</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Seguro y Confiable</span>
              </div>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}