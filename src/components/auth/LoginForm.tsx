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
  Loader2
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
    setPassword('') // Limpiar contraseña al cambiar usuario
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f1f5f9" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Plataforma de Pedidos
          </h1>
          <p className="text-slate-600">
            Accede a tu cuenta para gestionar tus almuerzos
          </p>
        </div>

        {/* Card Principal */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8">
            {/* Status de Conexión */}
            <div className="mb-6">
              {connectionStatus === 'checking' && (
                <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Conectando...</span>
                </div>
              )}
              {connectionStatus === 'connected' && (
                <div className="flex items-center justify-center space-x-2 text-sm text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Conectado</span>
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="flex items-center justify-center space-x-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Error de conexión</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Tu Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Tu Nombre
                </label>
                
                {loadingUsers ? (
                  <div className="flex items-center justify-center h-12 border border-slate-200 rounded-xl bg-slate-50">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    <span className="ml-2 text-sm text-slate-500">Cargando...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={users.length === 0}
                      className="w-full h-12 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 flex items-center justify-between text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-slate-400 to-slate-600 rounded-lg flex items-center justify-center group-hover:from-orange-400 group-hover:to-red-500 transition-all duration-200">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm ${selectedUser ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                          {selectedUser ? selectedUser.nombre_completo : 
                           users.length === 0 ? 'No hay trabajadores disponibles' : 'Selecciona tu nombre...'}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && users.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                        {users.map((user, index) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className={`w-full px-4 py-3 text-left hover:bg-orange-50 focus:bg-orange-50 focus:outline-none transition-colors duration-150 flex items-center space-x-3 ${
                              index !== users.length - 1 ? 'border-b border-slate-100' : ''
                            }`}
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">{user.nombre_completo}</p>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <p className="text-xs text-slate-500">RUT: {user.rut}</p>
                                {user.turno_habitual && (
                                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                    {user.turno_habitual}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 border-slate-200 focus:ring-orange-500 focus:border-orange-500 ${
                      password && selectedUser ? 
                        isPasswordCorrect() ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'
                      : ''
                    }`}
                    disabled={!selectedUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={!password}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Hint de contraseña */}
                {selectedUser && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">
                      <strong>Formato de contraseña:</strong> Primera letra del nombre + apellido (mayúsculas)
                    </p>
                    <p className="text-xs text-slate-500">
                      Para <strong>{selectedUser.nombre_completo}</strong>: <code className="bg-white px-1 py-0.5 rounded text-orange-600 font-mono font-bold">{getExpectedPassword()}</code>
                    </p>
                  </div>
                )}

                {/* Validación visual */}
                {password && selectedUser && (
                  <div className={`flex items-center space-x-2 text-xs ${
                    isPasswordCorrect() ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {isPasswordCorrect() ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span>
                      {isPasswordCorrect() ? 'Contraseña correcta' : 'Contraseña incorrecta'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Botón de Login */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !selectedUser || !password || connectionStatus !== 'connected'}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">
                ¿Problemas para acceder?{' '}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  Contacta al administrador
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-center text-xs text-slate-400">
            <p>Trabajadores: {users.length} | Estado: {connectionStatus}</p>
          </div>
        )}
      </div>
    </div>
  )
}