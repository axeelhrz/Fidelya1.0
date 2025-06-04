"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/context/UserContext'
export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signOut } = useUser()

  useEffect(() => {
    // Verificar si hay tokens de confirmación en la URL
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    if (token && type === 'email') {
      verifyEmail(token)
    }
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })

      if (error) {
        setError('Error al verificar el correo electrónico. El enlace puede haber expirado.')
      } else {
        setVerified(true)
        setMessage('¡Correo verificado exitosamente! Redirigiendo...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      setError('Error inesperado al verificar el correo electrónico.')
    }
    setLoading(false)
  }

  const resendVerification = async () => {
    if (!user?.email) return

    setResendLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      })

      if (error) {
        setError('Error al reenviar el correo de verificación.')
      } else {
        setMessage('Correo de verificación reenviado exitosamente.')
    }
    } catch (error) {
      setError('Error inesperado al reenviar el correo.')
  }

    setResendLoading(false)
  }

  if (loading) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Verificando correo electrónico...</p>
          </CardContent>
        </Card>
        </div>
  )
}

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              ¡Verificación exitosa!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Tu correo electrónico ha sido verificado correctamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Redirigiendo al dashboard en unos segundos...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verifica tu correo electrónico
            </CardTitle>
            <CardDescription className="text-gray-600">
              Hemos enviado un enlace de verificación a tu correo
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Revisa tu bandeja de entrada y haz clic en el enlace de verificación.
              </p>
              
              <div className="space-y-2">
                <Button
                  onClick={resendVerification}
                  variant="outline"
                  className="w-full"
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Reenviando...</span>
                    </div>
                  ) : (
                    'Reenviar correo de verificación'
                  )}
                </Button>
                
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="w-full"
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}