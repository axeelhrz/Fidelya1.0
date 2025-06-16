'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { signInWithCredentials, getAllUsers, generatePassword, testSupabaseConnection } from '@/lib/auth'
import { Trabajador } from '@/types/database'
import {
  Building2,
  User,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield
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
      router.push('/role-selection')
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

  const getRoleBadge = (rol: string | null) => {
    if (!rol) return 'Empleado'
    return rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase()
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-slate-600">
            Sistema de Pedidos de Almuerzo
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">Acceso al Sistema</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${
              connectionStatus === 'connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              connectionStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-slate-50 text-slate-700 border border-slate-200'
            }`}>
              {connectionStatus === 'connected' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : connectionStatus === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span className="font-medium">
                {connectionStatus === 'connected' ? 'Sistema conectado' :
                 connectionStatus === 'error' ? 'Error de conexión' :
                 'Conectando...'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Selecciona tu nombre
                </label>
                
                <div className="dropdown-container relative">
                  <div
                    onClick={() => !loadingUsers && setShowDropdown(!showDropdown)}
                    className={`w-full h-12 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser 
                        ? 'border-emerald-300 bg-emerald-50' 
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    } ${loadingUsers ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium ${
                          selectedUser ? 'bg-emerald-600' : 'bg-slate-400'
                        }`}>
                          {selectedUser ? selectedUser.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <span className={`font-medium ${
                          selectedUser ? 'text-slate-900' : 'text-slate-500'
                        }`}>
                          {loadingUsers ? 'Cargando...' :
                           selectedUser ? selectedUser.nombre_completo : 'Selecciona tu nombre'}
                        </span>
                      </div>
                      {!loadingUsers && (
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                          showDropdown ? 'rotate-180' : ''
                        }`} />
                      )}
                    </div>
                  </div>

                  {/* Dropdown */}
                  {showDropdown && !loadingUsers && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {users.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">
                          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          <p className="text-sm">No hay trabajadores disponibles</p>
                        </div>
                      ) : (
                        users.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                            className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                                {user.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{user.nombre_completo}</p>
                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  <span>{user.rut}</span>
                                  <span>•</span>
                                  <span>{getRoleBadge(user.rol)}</span>
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

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className={`h-12 pr-10 ${
                      password && isPasswordCorrect() 
                        ? 'border-emerald-300 bg-emerald-50' 
                        : password && !isPasswordCorrect()
                        ? 'border-red-300 bg-red-50'
                        : ''
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Hint */}
                {selectedUser && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-slate-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-slate-700 mb-1">Formato de contraseña:</p>
                        <p className="text-slate-600 mb-2">Primera letra del nombre + apellido completo en mayúsculas</p>
                        <code className="bg-white px-2 py-1 rounded border text-slate-800 font-mono">
                          {getExpectedPassword()}
                        </code>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Validation */}
                {password && selectedUser && (
                  <div className={`flex items-center space-x-2 text-sm ${
                    isPasswordCorrect() ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {isPasswordCorrect() ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {isPasswordCorrect() ? 'Contraseña correcta' : 'Contraseña incorrecta'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !selectedUser || !password.trim()}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            ¿Problemas para acceder?{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900 font-medium">
              Contacta al administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}