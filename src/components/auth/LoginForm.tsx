'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { signInWithCredentials, getAllCompanies, getUsersByCompany, generatePassword, testSupabaseConnection } from '@/lib/auth'
import { Trabajador, Empresa } from '@/types/database'
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
  Shield,
  ArrowLeft,
  ChefHat,
  Users,
  ArrowRight
} from 'lucide-react'

export default function LoginForm() {
  // Estados principales
  const [step, setStep] = useState<'company' | 'user'>('company')
  const [selectedCompany, setSelectedCompany] = useState<Empresa | null>(null)
  const [selectedUser, setSelectedUser] = useState<Trabajador | null>(null)
  
  // Estados de datos
  const [companies, setCompanies] = useState<Empresa[]>([])
  const [users, setUsers] = useState<Trabajador[]>([])
  
  // Estados de UI
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Estados de carga y errores
  const [loading, setLoading] = useState(false)
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(false)
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
        setShowCompanyDropdown(false)
        setShowUserDropdown(false)
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
      fetchCompanies()
    } else {
      setLoadingCompanies(false)
      setError('No se pudo conectar con la base de datos')
    }
  }

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true)
      setError('')
      const companiesList = await getAllCompanies()

      if (companiesList.length === 0) {
        setError('No se encontraron empresas activas')
      } else {
        setCompanies(companiesList)
      }
    } catch (error: any) {
      setError(`Error al cargar empresas: ${error.message}`)
    } finally {
      setLoadingCompanies(false)
    }
  }

  const fetchUsersByCompany = async (empresa: string) => {
    try {
      setLoadingUsers(true)
      setError('')
      const usersList = await getUsersByCompany(empresa)

      if (usersList.length === 0) {
        setError('No se encontraron trabajadores activos en esta empresa')
      } else {
        setUsers(usersList)
      }
    } catch (error: any) {
      setError(`Error al cargar trabajadores: ${error.message}`)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleCompanySelect = async (company: Empresa) => {
    setSelectedCompany(company)
    setShowCompanyDropdown(false)
    setError('')
    await fetchUsersByCompany(company.nombre)
    setStep('user')
  }

  const handleUserSelect = (user: Trabajador) => {
    setSelectedUser(user)
    setShowUserDropdown(false)
    setError('')
    setPassword('')
  }

  const handleBackToCompanies = () => {
    setStep('company')
    setSelectedCompany(null)
    setSelectedUser(null)
    setUsers([])
    setPassword('')
    setError('')
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

  const getRoleColor = (rol: string | null) => {
    switch (rol?.toLowerCase()) {
      case 'admin':
      case 'administrador':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'supervisor':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Pedidos
          </h1>
          <p className="text-gray-600 text-lg">
            Gestión de restaurante
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-900">
                {step === 'company' ? 'Selecciona tu empresa' : 'Iniciar sesión'}
              </CardTitle>
              {step === 'user' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToCompanies}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Volver
                </Button>
              )}
            </div>
            {step === 'user' && selectedCompany && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                <Building2 className="w-4 h-4 text-orange-600" />
                <span className="font-medium">{selectedCompany.nombre}</span>
                <span className="text-gray-400">•</span>
                <span>{selectedCompany.trabajadores_count} trabajadores</span>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${
              connectionStatus === 'connected' ? 'bg-green-50 text-green-700 border border-green-200' :
              connectionStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-gray-50 text-gray-700 border border-gray-200'
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

            {/* Company Selection Step */}
            {step === 'company' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Empresa
                  </label>
                  
                  <div className="dropdown-container relative">
                    <div
                      onClick={() => !loadingCompanies && setShowCompanyDropdown(!showCompanyDropdown)}
                      className={`w-full h-14 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedCompany 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${loadingCompanies ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-medium ${
                            selectedCompany ? 'bg-orange-600' : 'bg-gray-400'
                          }`}>
                            {selectedCompany ? <Building2 className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                          </div>
                          <div className="text-left">
                            <span className={`font-medium block ${
                              selectedCompany ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {loadingCompanies ? 'Cargando empresas...' :
                               selectedCompany ? selectedCompany.nombre : 'Selecciona tu empresa'}
                            </span>
                            {selectedCompany && (
                              <span className="text-sm text-gray-500">
                                {selectedCompany.trabajadores_count} trabajadores
                              </span>
                            )}
                          </div>
                        </div>
                        {!loadingCompanies && (
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                            showCompanyDropdown ? 'rotate-180' : ''
                          }`} />
                        )}
                      </div>
                    </div>

                    {/* Company Dropdown */}
                    {showCompanyDropdown && !loadingCompanies && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                        {companies.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <Building2 className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">No hay empresas disponibles</p>
                          </div>
                        ) : (
                          companies.map((company) => (
                            <div
                              key={company.nombre}
                              onClick={() => handleCompanySelect(company)}
                              className="p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{company.nombre}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Users className="w-3 h-3" />
                                    <span>{company.trabajadores_count} trabajadores</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* User Selection Step */}
            {step === 'user' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Selecciona tu nombre
                  </label>
                  
                  <div className="dropdown-container relative">
                    <div
                      onClick={() => !loadingUsers && setShowUserDropdown(!showUserDropdown)}
                      className={`w-full h-14 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedUser 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      } ${loadingUsers ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-medium ${
                            selectedUser ? 'bg-green-600' : 'bg-gray-400'
                          }`}>
                            {selectedUser ? selectedUser.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                          </div>
                          <div className="text-left">
                            <span className={`font-medium block ${
                              selectedUser ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {loadingUsers ? 'Cargando trabajadores...' :
                               selectedUser ? selectedUser.nombre_completo : 'Selecciona tu nombre'}
                            </span>
                            {selectedUser && (
                              <span className="text-sm text-gray-500">
                                {selectedUser.rut} • {getRoleBadge(selectedUser.rol)}
                              </span>
                            )}
                          </div>
                        </div>
                        {!loadingUsers && (
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                            showUserDropdown ? 'rotate-180' : ''
                          }`} />
                        )}
                      </div>
                    </div>

                    {/* User Dropdown */}
                    {showUserDropdown && !loadingUsers && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                        {users.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <User className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">No hay trabajadores disponibles</p>
                          </div>
                        ) : (
                          users.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => handleUserSelect(user)}
                              className="p-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700 text-sm font-medium">
                                  {user.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{user.nombre_completo}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>{user.rut}</span>
                                    <span>•</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.rol)}`}>
                                      {getRoleBadge(user.rol)}
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

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu contraseña"
                      className={`h-14 pr-12 border-2 rounded-xl transition-all duration-200 ${
                        password && isPasswordCorrect() 
                          ? 'border-green-300 bg-green-50' 
                          : password && !isPasswordCorrect()
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 focus:border-orange-300'
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Hint */}
                  {selectedUser && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-2">Formato de contraseña:</p>
                          <p className="text-gray-600 mb-3">Primera letra del nombre + apellido completo en mayúsculas</p>
                          <div className="bg-white px-3 py-2 rounded-lg border border-gray-200">
                            <code className="text-gray-800 font-mono font-semibold">
                              {getExpectedPassword()}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Validation */}
                  {password && selectedUser && (
                    <div className={`flex items-center space-x-2 text-sm ${
                      isPasswordCorrect() ? 'text-green-600' : 'text-red-600'
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
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
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
                  className="w-full h-14 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Iniciar Sesión</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            ¿Problemas para acceder?{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
              Contacta al administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}