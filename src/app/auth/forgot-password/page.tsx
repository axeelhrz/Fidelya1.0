"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import AuthLayout from '@/components/auth/AuthLayout'
import FormInput from '@/components/auth/FormInput'
import SubmitButton from '@/components/auth/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { useFormValidation, authValidationRules } from '@/hooks/useFormValidation'
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword, loading } = useAuth()
  const { errors, validateSingleField } = useFormValidation({
    email: authValidationRules.email
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const error = validateSingleField("email", email)
    if (error) return

    const result = await resetPassword(email)
    if (result.success) {
      setIsSubmitted(true)
    }
    }

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Email Enviado"
        subtitle="Revisa tu correo para continuar"
        showIllustration={false}
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-700">
              Te hemos enviado un enlace de recuperación a:
            </p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            
            <div className="space-y-2">
              <Link 
                href="/auth/login"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ¿No recibiste el email? Intentar nuevamente
              </button>
        </div>
          </div>
        </div>
    </AuthLayout>
  )
}

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Ingresa tu email para recibir un enlace de recuperación"
      showIllustration={false}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(value) => {
            setEmail(value)
            if (value) validateSingleField("email", value)
          }}
          error={errors.email}
          success={!errors.email && email !== ""}
          required
          icon={<Mail size={18} />}
        />

        <SubmitButton loading={loading}>
          Enviar enlace de recuperación
        </SubmitButton>

        <div className="text-center">
          <Link 
            href="/auth/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}