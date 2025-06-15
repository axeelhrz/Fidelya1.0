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
  Building2
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
    if (!turno) return 'bg-slate-100 text-slate-600'
    switch (turno.toLowerCase()) {
      case 'día':
      case 'dia':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'noche':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'mixto':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const getRolColor = (rol: string | null) => {
    if (!rol) return 'bg-gray-100 text-gray-600'
    switch (rol.toLowerCase()) {
      case 'admin':
      case 'administrador':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'supervisor':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'empleado':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f1f5f9\" fill-opacity=\"0.4\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-10 animate-pulse delay-500"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo y Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl mb-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
            Plataforma de Pedidos
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Accede a tu cuenta para gestionar tus almuerzos
          </p>
        </div>

        {/* Card Principal */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-300 animate-slide-in">
          <CardContent className="p-8">
            {/* Status de Conexión */}
            <div className="mb-8">
              {connectionStatus === 'checking' && (
                <div className="flex items-center justify-center space-x-3 text-sm text-slate-500 bg-slate-50 rounded-xl p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  <span className="font-medium">Conectando con el servidor...</span>
                </div>
              )}
              {connectionStatus === 'connected' && (
                <div className="flex items-center justify-center space-x-3 text-sm text-emerald-600 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Conectado exitosamente</span>
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="flex items-center justify-center space-x-3 text-sm text-red-600 bg-red-50 rounded-xl p-4 border border-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error de conexión</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={checkConnection}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    Reintentar
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Campo Tu Nombre */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Tu Nombre</span>
                </label>

                {loadingUsers ? (
                  <div className="flex items-center justify-center h-14 border-2 border-slate-200 rounded-xl bg-slate-50 loading-shimmer">
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                    <span className="ml-3 text-sm text-slate-500 font-medium">Cargando trabajadores...</span>
                  </div>
                ) : (
                  <div className="relative dropdown-container">
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={users.length === 0}
                      className="w-full h-14 px-4 py-3 border-2 border-slate-200 rounded-xl bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 flex items-center justify-between text-left disabled:opacity-50 disabled:cursor-not-allowed group hover:border-slate-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-slate-600 rounded-xl flex items-center justify-center group-hover:from-orange-400 group-hover:to-red-500 transition-all duration-300 shadow-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {selectedUser ? (
                            <div>
                              <p className="text-sm font-semibold text-slate-900 truncate">{selectedUser.nombre_completo}</p>
                              <p className="text-xs text-slate-500">RUT: {selectedUser.rut}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500 font-medium">
                              {users.length === 0 ? 'No hay trabajadores disponibles' : 'Selecciona tu nombre...'}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180 text-orange-500' : ''}`} />
                    </button>

                    {showDropdown && users.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto animate-fade-in">
                        <div className="p-2">
                          {users.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleUserSelect(user)}
                              className={`w-full p-4 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 focus:bg-gradient-to-r focus:from-orange-50 focus:to-red-50 focus:outline-none transition-all duration-200 flex items-center space-x-4 rounded-lg group ${
                                selectedUser?.id === user.id ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200' : ''
                              }`}
                            >
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 truncate text-base">{user.nombre_completo}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-slate-500 font-medium">RUT: {user.rut}</p>
                                  {user.empresa_id && (
                                    <div className="flex items-center space-x-1">
                                      <Building2 className="w-3 h-3 text-slate-400" />
                                      <span className="text-xs text-slate-400">ID: {user.empresa_id}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                  {user.turno_habitual && (
                                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getTurnoColor(user.turno_habitual)}`}>
                                      {user.turno_habitual}
                                    </span>
                                  )}
                                  {user.rol && (
                                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getRolColor(user.rol)}`}>
                                      {user.rol}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {selectedUser?.id === user.id && (
                                <CheckCircle2 className="w-5 h-5 text-orange-500" />
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
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Contraseña</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Shield className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-12 pr-12 h-14 border-2 border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-medium transition-all duration-200 ${
                      password && selectedUser ?
                        isPasswordCorrect()
                          ? 'border-emerald-400 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-500'
                          : 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500'
                        : 'hover:border-slate-300'
                    }`}
                    disabled={!selectedUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 z-10"
                    disabled={!password}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Hint de contraseña */}
                {selectedUser && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Formato de contraseña
                        </p>
                        <p className="text-xs text-blue-700 mb-2">
                          Primera letra del nombre + apellido completo (todo en mayúsculas)
                        </p>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-slate-600 mb-1">
                            Para <strong className="text-blue-800">{selectedUser.nombre_completo}</strong>:
                          </p>
                          <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono font-bold text-sm">
                            {getExpectedPassword()}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validación visual */}
                {password && selectedUser && (
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    isPasswordCorrect()
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-red-700 bg-red-50 border-red-200'
                  }`}>
                    {isPasswordCorrect() ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">
                      {isPasswordCorrect() ? 'Contraseña correcta' : 'Contraseña incorrecta'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-start space-x-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Error de autenticación</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Botón de Login */}
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                disabled={loading || !selectedUser || !password || connectionStatus !== 'connected'}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
              <p className="text-xs text-slate-500">
                ¿Problemas para acceder?{' '}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold underline transition-colors duration-200">
                  Contacta al administrador
                </a>
              </p>

              {/* Debug Info (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p>🔧 Modo desarrollo</p>
                  <p>Trabajadores cargados: {users.length} | Estado: {connectionStatus}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200">
            <Shield className="w-3 h-3" />
            <span>Conexión segura</span>
          </div>
        </div>
      </div>
    </div>
  )
}