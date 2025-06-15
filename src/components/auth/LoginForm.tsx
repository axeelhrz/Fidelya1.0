'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { signInWithName, getAllUsers, generatePassword, testSupabaseConnection, getFullName } from '@/lib/auth'
import { Trabajador } from '@/types/database'
import { Utensils, User, ChevronDown, LogIn, AlertCircle, RefreshCw, Badge } from 'lucide-react'

export default function LoginForm() {
  const [selectedUser, setSelectedUser] = useState<Trabajador | null>(null)
  const [users, setUsers] = useState<Trabajador[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
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
      setError('No se pudo conectar con la base de datos. Verifica tu conexión.')
    }
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      setError('')
      const usersList = await getAllUsers()
      
      if (usersList.length === 0) {
        setError('No se encontraron trabajadores activos en la base de datos.')
      } else {
        setUsers(usersList)
        console.log('Trabajadores loaded:', usersList.map(u => u.nombre_completo))
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      setError(`Error al cargar trabajadores: ${error.message}`)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleUserSelect = (user: Trabajador) => {
    setSelectedUser(user)
    setShowDropdown(false)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser) {
      setError('Por favor selecciona tu nombre')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Attempting login for:', selectedUser.nombre_completo)
      await signInWithName(selectedUser.nombre_completo)
      console.log('Login successful, redirecting...')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const getTurnoColor = (turno: string | null) => {
    if (!turno) return 'bg-gray-100 text-gray-600'
    switch (turno.toLowerCase()) {
      case 'día':
      case 'dia':
        return 'bg-yellow-100 text-yellow-700'
      case 'noche':
        return 'bg-blue-100 text-blue-700'
      case 'mixto':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl mb-6 shadow-lg">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🍽️ Plataforma de Pedidos de Almuerzo
          </h1>
          <p className="text-gray-600 text-lg">
            Accede a tu cuenta para gestionar tus pedidos
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Selecciona tu nombre para acceder al sistema
            </CardDescription>
            
            {/* Connection Status */}
            <div className="mt-4">
              {connectionStatus === 'checking' && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando conexión...</span>
                </div>
              )}
              {connectionStatus === 'connected' && (
                <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Conectado a Supabase</span>
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="flex items-center justify-center space-x-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Error de conexión</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={checkConnection}
                    className="text-xs"
                  >
                    Reintentar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">
                  Selecciona tu nombre
                </label>
                
                {loadingUsers ? (
                  <div className="flex items-center justify-center h-14 border border-gray-300 rounded-xl bg-gray-50">
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-gray-600">Cargando trabajadores...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={users.length === 0}
                      className="w-full h-14 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 flex items-center justify-between text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-base ${selectedUser ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {selectedUser ? selectedUser.nombre_completo : 
                           users.length === 0 ? 'No hay trabajadores disponibles' : 'Selecciona tu nombre...'}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && users.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                        {users.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="w-full px-4 py-3 text-left hover:bg-orange-50 focus:bg-orange-50 focus:outline-none transition-colors duration-150 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{user.nombre_completo}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <p className="text-xs text-gray-500">RUT: {user.rut}</p>
                                {user.turno_habitual && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getTurnoColor(user.turno_habitual)}`}>
                                    {user.turno_habitual}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Contraseña: <span className="font-mono font-bold">{generatePassword(user.nombre_completo)}</span>
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{selectedUser.nombre_completo}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-600">RUT: {selectedUser.rut}</p>
                        {selectedUser.turno_habitual && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getTurnoColor(selectedUser.turno_habitual)}`}>
                            {selectedUser.turno_habitual}
                          </span>
                        )}
                      </div>
                      {selectedUser.rol && (
                        <p className="text-sm text-gray-600">Rol: {selectedUser.rol}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Contraseña: <span className="font-mono font-bold text-blue-600">
                          {generatePassword(selectedUser.nombre_completo)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading || !selectedUser || connectionStatus !== 'connected'}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando Sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                ¿Problemas para acceder?{' '}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold underline">
                  Contacta al administrador
                </a>
              </p>
              
              {/* Debug info */}
              <div className="mt-4 text-xs text-gray-400">
                <p>Trabajadores cargados: {users.length}</p>
                <p>Estado: {connectionStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}