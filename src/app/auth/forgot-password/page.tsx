"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase/client'
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (!email) {
      setError('Por favor ingresa tu correo electrónico')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (error) {
      setError('Error inesperado. Por favor intenta nuevamente.')
    }

    setLoading(false)
  }
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Correo enviado
            </CardTitle>
            <CardDescription className="text-gray-600">
              Hemos enviado las instrucciones a {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Revisa tu correo electrónico y sigue las instrucciones para restablecer tu contraseña.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Volver al inicio de sesión
              </Link>
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
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              ¿Olvidaste tu contraseña?
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tu correo y te enviaremos instrucciones para restablecerla
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
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  'Enviar instrucciones'
                )}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}