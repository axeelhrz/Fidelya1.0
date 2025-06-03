"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormInput } from '@/components/auth/FormInput'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { useFormValidation, commonValidationRules } from '@/hooks/useFormValidation'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: ''
  })
  const [emailSent, setEmailSent] = useState(false)

  const { resetPassword, loading, error } = useAuth()

  const validationRules = {
    email: commonValidationRules.email
  }

  const { validateField, validateForm, getFieldValidation, isFormValid } = useFormValidation(validationRules)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm(formData)) {
      return
    }

    const success = await resetPassword(formData.email)
    if (success) {
      setEmailSent(true)
    }
  }

  const emailValidation = getFieldValidation('email')

  if (emailSent) {
    return (
      <AuthLayout 
        title="Email Enviado"
        subtitle="Revisa tu correo electrónico"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-700">
              Hemos enviado un enlace de recuperación a:
            </p>
            <p className="font-medium text-gray-900">{formData.email}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            
            <div className="flex flex-col space-y-3">
              <SubmitButton
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Enviar otro email
              </SubmitButton>
              
              <Link 
                href="/auth/login"
                className="inline-flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 smooth-transition"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al inicio de sesión
              </Link>
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
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          name="email"
          type="email"
          label="Correo Electrónico"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleInputChange}
          icon="email"
          error={emailValidation.error || undefined}
          success={emailValidation.success || undefined}
          autoComplete="email"
          required
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-slideUp">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <SubmitButton
          type="submit"
          loading={loading}
          loadingText="Enviando email..."
          disabled={!isFormValid}
          className="w-full"
        >
          Enviar Enlace de Recuperación
        </SubmitButton>

        <div className="text-center">
          <Link 
            href="/auth/login"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 smooth-transition"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}