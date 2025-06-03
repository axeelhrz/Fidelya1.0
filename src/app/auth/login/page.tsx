"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormInput } from '@/components/auth/FormInput'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { useFormValidation, commonValidationRules } from '@/hooks/useFormValidation'
import { Checkbox } from '@/components/ui/checkbox'
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const { login, loading, error } = useAuth()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const validationRules = {
    email: commonValidationRules.email,
    password: { required: true, minLength: 1 } // Simplified for login
  }

  const { validateField, validateForm, getFieldValidation, isFormValid } = useFormValidation(validationRules)

  // Check for remembered login
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe')
    if (rememberMe) {
      setFormData(prev => ({ ...prev, rememberMe: true }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({ ...prev, [name]: newValue }))

    // Validate field on change (except checkbox)
    if (type !== 'checkbox') {
      validateField(name, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const fieldsToValidate = { email: formData.email, password: formData.password }
    if (!validateForm(fieldsToValidate)) {
      return
    }

    const success = await login({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    })

    if (success) {
      // Reset form on successful login
      setFormData({ email: '', password: '', rememberMe: false })
    }
  }

  const emailValidation = getFieldValidation('email')
  const passwordValidation = getFieldValidation('password')
  return (
    <AuthLayout 
      title="Casino Escolar"
      subtitle="Inicia sesión en tu cuenta"
    >
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          name="email"
          type="email"
          label="Correo Electrónico"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleInputChange}
          icon="email"
          error={emailValidation.error ?? undefined}
          success={emailValidation.success ?? undefined}
          autoComplete="email"
          required
        />

        <FormInput
          name="password"
          type="password"
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={handleInputChange}
          icon="password"
          showPasswordToggle
          error={passwordValidation.error ?? undefined}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
              }
            />
            <label 
              htmlFor="rememberMe" 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Recordarme
            </label>
          </div>

          <Link 
            href="/auth/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 smooth-transition"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-slideUp">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <SubmitButton
          type="submit"
          loading={loading}
          loadingText="Iniciando sesión..."
          disabled={!isFormValid}
          className="w-full"
        >
          Iniciar Sesión
        </SubmitButton>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link 
              href="/auth/registro"
              className="font-medium text-blue-600 hover:text-blue-500 smooth-transition"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}