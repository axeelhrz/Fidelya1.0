"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { useUser } from '@/context/UserContext'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp } = useUser()
  const router = useRouter()
  
  // Redirigir si ya está autenticado
  useRedirectIfAuthenticated()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'El nombre completo es requerido'
    }
    
    if (!formData.email.trim()) {
      return 'El correo electrónico es requerido'
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Por favor ingresa un correo electrónico válido'
    }
    
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    
    if (!acceptTerms) {
      return 'Debes aceptar los términos y condiciones'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    const result = await signUp(formData.email, formData.password, formData.fullName)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              ¡Registro exitoso!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Hemos enviado un correo de verificación a {formData.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Por favor revisa tu correo electrónico y haz clic en el enlace de verificación para activar tu cuenta.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Ir al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Crear cuenta
            </CardTitle>
            <CardDescription className="text-gray-600">
              Regístrate en el Casino Escolar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
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
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  Acepto los{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    términos y condiciones
                  </Link>
                </Label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}