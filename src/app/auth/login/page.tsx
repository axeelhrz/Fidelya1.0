"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useUser } from '@/context/UserContext'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, user, guardian, loading: userLoading } = useUser()
  const router = useRouter()
  // Redirigir si ya está autenticado
  useRedirectIfAuthenticated()

  // Efecto para redirigir cuando el usuario esté completamente cargado
  useEffect(() => {
    console.log('🔄 Login page - Estado:', { 
      user: !!user, 
      guardian: !!guardian, 
      userLoading,
      userId: user?.id 
    })

    if (!userLoading && user) {
      console.log('✅ Usuario autenticado, redirigiendo al dashboard...')
      // Usar replace para evitar que el usuario pueda volver atrás
      router.replace('/dashboard')
    }
  }, [user, guardian, userLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    console.log('🔐 Intentando login desde formulario...')
    const result = await signIn(email, password)
    
    if (result.error) {
      console.error('❌ Error en login:', result.error)
      setError(result.error)
      setLoading(false)
    } else {
      console.log('✅ Login exitoso, esperando carga de datos...')
      // No redirigimos aquí, dejamos que el useEffect lo haga
      // cuando los datos estén completamente cargados
    }
  }

  // Si ya está autenticado y cargando, mostrar loading
  if (user && userLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Cargando tu perfil...</p>
          </CardContent>
        </Card>
      </div>
  )
}

  // Si ya está autenticado pero no está cargando, redirigir inmediatamente
  if (user && !userLoading) {
    router.replace('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Bienvenido de vuelta
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa a tu cuenta del Casino Escolar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/auth/registro"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Debug info en desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-center pt-4 border-t space-y-2">
                <Link
                  href="/debug"
                  className="block text-xs text-gray-400 hover:text-gray-600"
                >
                  Debug de Autenticación
                </Link>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="block w-full text-xs text-gray-400 hover:text-gray-600"
                >
                  Forzar ir al Dashboard
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}